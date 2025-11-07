#!/bin/bash
# Step-by-step installation to avoid dependency conflicts

echo "Installing Voice Separator dependencies..."

# Step 1: Core scientific stack
echo "Step 1: Installing core scientific stack..."
pip install numpy==1.23.5

# Step 2: TensorFlow (must be installed before Spleeter)
echo "Step 2: Installing TensorFlow..."
pip install tensorflow==2.9.3

# Step 3: Install Spleeter (this will install typer with click<7.2.0)
echo "Step 3: Installing Spleeter..."
pip install spleeter==2.4.0

# Step 4: Audio utilities
echo "Step 4: Installing audio utilities..."
pip install pydub==0.25.1
pip install soundfile==0.12.1
pip install sounddevice==0.4.6

# Step 5: Librosa and its dependencies
echo "Step 5: Installing Librosa..."
pip install llvmlite==0.39.1
pip install numba==0.56.4
pip install librosa==0.9.2

# Step 6: Web framework (install Flask 2.0.3 which is compatible with click 7.1.x)
echo "Step 6: Installing web framework..."
pip install "click>=7.1.1,<7.2.0"  # Ensure compatible click version
pip install werkzeug==2.0.3
pip install flask==2.0.3
pip install flask-cors==4.0.0

# Step 7: SocketIO support
echo "Step 7: Installing SocketIO support..."
pip install eventlet==0.33.3
pip install python-socketio==5.10.0
pip install flask-socketio==5.3.6

echo "Installation complete!"
echo ""
echo "To start the backend server, run:"
echo "  python app.py"
