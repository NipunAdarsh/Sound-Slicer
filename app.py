from flask import Flask, request, send_file, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from pathlib import Path
import uuid
import threading
import time
from datetime import datetime, timedelta
from src.separate import separate, ensure_dirs, get_separator, INPUT_DIR, STEMS_DIR

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])
socketio = SocketIO(app, cors_allowed_origins="*")

# Global job tracking
jobs = {}

# File cleanup configuration
CLEANUP_INTERVAL = 1800  # 30 minutes in seconds
FILE_RETENTION = 3600  # 1 hour in seconds


def cleanup_old_files():
    """Remove files and jobs older than FILE_RETENTION seconds."""
    while True:
        time.sleep(CLEANUP_INTERVAL)
        current_time = datetime.now()
        jobs_to_remove = []

        for job_id, job_data in jobs.items():
            if 'created_at' in job_data:
                age = (current_time - job_data['created_at']).total_seconds()
                if age > FILE_RETENTION:
                    # Clean up files
                    try:
                        if 'input_path' in job_data:
                            input_path = Path(job_data['input_path'])
                            if input_path.exists():
                                input_path.unlink()

                        if 'vocals_path' in job_data:
                            vocals_path = Path(job_data['vocals_path'])
                            if vocals_path.exists():
                                vocals_path.unlink()

                        if 'accompaniment_path' in job_data:
                            accompaniment_path = Path(job_data['accompaniment_path'])
                            if accompaniment_path.exists():
                                accompaniment_path.unlink()

                            # Remove parent directory if empty
                            parent = accompaniment_path.parent
                            if parent.exists() and not any(parent.iterdir()):
                                parent.rmdir()
                    except Exception as e:
                        print(f"[CLEANUP ERROR] Failed to clean job {job_id}: {e}")

                    jobs_to_remove.append(job_id)

        # Remove old jobs from tracking
        for job_id in jobs_to_remove:
            del jobs[job_id]
            print(f"[CLEANUP] Removed job {job_id}")


def process_audio(job_id, file_path):
    """Background thread function to process audio file."""
    try:
        # Emit processing status (to all clients)
        socketio.emit('processing_status', {
            'job_id': job_id,
            'status': 'processing',
            'message': 'Separating audio tracks...'
        }, namespace='/')
        print(f"[WEBSOCKET] Emitted processing_status for job {job_id}")

        # Call the separation function
        accompaniment_path, vocals_path = separate(file_path)

        # Update job with results
        jobs[job_id]['status'] = 'complete'
        jobs[job_id]['vocals_path'] = str(vocals_path)
        jobs[job_id]['accompaniment_path'] = str(accompaniment_path)

        print(f"[SUCCESS] Job {job_id} completed")

        # Small delay to ensure WebSocket is ready
        time.sleep(0.5)

        # Emit completion event (to all clients)
        socketio.emit('processing_complete', {
            'job_id': job_id,
            'status': 'complete',
            'message': 'Separation complete!',
            'filename': jobs[job_id]['filename']
        }, namespace='/')
        print(f"[WEBSOCKET] Emitted processing_complete for job {job_id}")

        # Another small delay to ensure event is sent before thread ends
        time.sleep(0.5)

    except Exception as e:
        # Update job with error
        jobs[job_id]['status'] = 'error'
        jobs[job_id]['error'] = str(e)

        # Emit error event (to all clients)
        socketio.emit('processing_error', {
            'job_id': job_id,
            'status': 'error',
            'error': str(e)
        }, namespace='/')
        print(f"[WEBSOCKET] Emitted processing_error for job {job_id}")

        print(f"[ERROR] Job {job_id} failed: {e}")


@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Handle file upload and initiate processing."""
    try:
        # Check if file exists in request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'No file provided'}), 400

        # Validate file extension
        allowed_extensions = {'.mp3', '.wav', '.flac', '.ogg', '.m4a'}
        file_ext = Path(file.filename).suffix.lower()

        if file_ext not in allowed_extensions:
            return jsonify({
                'error': 'Invalid file format. Accepted: mp3, wav, flac, ogg, m4a'
            }), 400

        # Ensure directories exist
        ensure_dirs()

        # Generate unique job ID
        job_id = str(uuid.uuid4())

        # Save file to input directory
        safe_filename = f"{job_id}_{file.filename}"
        file_path = INPUT_DIR / safe_filename
        file.save(str(file_path))

        # Create job entry
        jobs[job_id] = {
            'job_id': job_id,
            'status': 'processing',
            'filename': file.filename,
            'input_path': str(file_path),
            'created_at': datetime.now()
        }

        # Start background processing thread
        thread = threading.Thread(target=process_audio, args=(job_id, file_path))
        thread.daemon = True
        thread.start()

        print(f"[UPLOAD] Job {job_id} started for file: {file.filename}")

        return jsonify({
            'job_id': job_id,
            'message': 'Processing started'
        }), 200

    except Exception as e:
        print(f"[ERROR] Upload failed: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/download/<track_type>/<job_id>', methods=['GET'])
def download_file(track_type, job_id):
    """Download separated audio file."""
    try:
        # Check if job exists
        if job_id not in jobs:
            return jsonify({'error': 'Job not found'}), 404

        job = jobs[job_id]

        # Check if job is complete
        if job['status'] != 'complete':
            return jsonify({'error': 'Processing not complete'}), 400

        # Get file path based on track type
        if track_type == 'vocals':
            if 'vocals_path' not in job:
                return jsonify({'error': 'File not found'}), 404
            file_path = Path(job['vocals_path'])
        elif track_type == 'accompaniment':
            if 'accompaniment_path' not in job:
                return jsonify({'error': 'File not found'}), 404
            file_path = Path(job['accompaniment_path'])
        else:
            return jsonify({'error': 'Invalid track type'}), 400

        # Verify file exists
        if not file_path.exists():
            return jsonify({'error': 'File not found'}), 404

        # Send file
        return send_file(
            str(file_path),
            mimetype='audio/wav',
            as_attachment=True,
            download_name=f"{track_type}_{job['filename'].rsplit('.', 1)[0]}.wav"
        )

    except Exception as e:
        print(f"[ERROR] Download failed: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/status/<job_id>', methods=['GET'])
def get_status(job_id):
    """Get job status (backup to WebSocket)."""
    try:
        # Check if job exists
        if job_id not in jobs:
            return jsonify({'error': 'Job not found'}), 404

        job = jobs[job_id]

        # Build response
        response = {
            'job_id': job_id,
            'status': job['status'],
            'filename': job['filename']
        }

        # Include error if present
        if 'error' in job:
            response['error'] = job['error']

        return jsonify(response), 200

    except Exception as e:
        print(f"[ERROR] Status check failed: {e}")
        return jsonify({'error': str(e)}), 500


@socketio.on('connect')
def handle_connect():
    """Handle WebSocket connection."""
    print(f"[WEBSOCKET] Client connected")


@socketio.on('disconnect')
def handle_disconnect():
    """Handle WebSocket disconnection."""
    print(f"[WEBSOCKET] Client disconnected")


if __name__ == '__main__':
    # Start cleanup thread
    cleanup_thread = threading.Thread(target=cleanup_old_files)
    cleanup_thread.daemon = True
    cleanup_thread.start()

    print("[INFO] Starting Flask + SocketIO server on http://0.0.0.0:5000")
    
    # Pre-load the model to avoid delay on first request
    # This is safe here because we are in __main__
    get_separator()
    
    socketio.run(app, host='0.0.0.0', port=5000, debug=True, allow_unsafe_werkzeug=True)
