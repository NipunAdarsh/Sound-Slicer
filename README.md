# Sound-Slicer
SoundSlicer is a powerful and beginner‑friendly tool for separating vocals and instrumentals from audio tracks. Built with Python and Flask, it combines backend audio processing with a sleek, animated interface to make sound separation both accessible and visually engaging.


 Complete Setup Guide: From Git Clone to Running App
# Step 1: 
Clone the Repository
git clone <your-repo-url>
cd Sound Slicer

# Step 2: 
Check Python Version
Required: Python 3.10 (Python 3.11+ not supported)

python --version
If you need to install Python 3.10, download from python.org

# Step 3:
Set Up Python Virtual Environment
python -m venv sound-slicer-env

# Activate virtual environment
# Windows:
sound-slicer-env\Scripts\activate

# Linux/Mac:
source sound-slicer-env/bin/activate

# Step 4:
Install Backend Dependencies


# Install all required Python packages
pip install -r requirements.txt


# Step 5:
Verify Node.js Installation
Required: Node.js 16+ (for frontend)

node --version
npm --version
If not installed, download from nodejs.org

# Step 6:
Install Frontend Dependencies
cd frontend
npm install
cd ..

# Step 7: 
Start the Backend Server

Open Terminal 1:
python app.py
Expected Output:

2025-11-07 19:12:13.201709: W tensorflow/stream_executor/platform/default/dso_loader.cc:64] Could not load dynamic library 'cudart64_110.dll'; dlerror: cudart64_110.dll not found 2025-11-07 19:12:13.202662: I tensorflow/stream_executor/cuda/cudart_stub.cc:29] Ignore above cudart dlerror if you do not have a GPU set up on your machine. [INFO] Starting Flask + SocketIO server on http://0.0.0.0:5000 (17252) wsgi starting up on http://0.0.0.0:5000
(CUDA warning is normal - means using CPU instead of GPU)

# Step 8: 
Start the Frontend Server
Open Terminal 2:

cd Voice-Separator/frontend
npm run dev
Expected Output:

VITE v5.0.0 ready in 345 ms ➜ Local: http://localhost:5173/ ➜ Network: use --host to expose ➜ press h + enter to show help

# Step 9: 
Access the Application
Open your browser and go to:

http://localhost:5173
You should see:

🎵 SOUNDSLICER heading with cyberpunk gradient text
Neon magenta/cyan color scheme
"DROP AUDIO FILE" drag-and-drop zone
Smooth animations and hover effects


# Step 10: 
Test the Complete Flow
Upload: Drag an MP3/WAV file onto the drop zone
Processing: Watch animated waveform bars
Results: See audio players for vocals and accompaniment
Playback: Click play buttons to hear separated tracks
Download: Download the separated audio files
