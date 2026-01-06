#!/bin/bash
echo "Fixing Voice Separator dependencies..."

# Clear cache
pip cache purge

# Install core dependencies first
echo "Installing core dependencies..."
pip install numpy==1.23.5
pip install click==7.1.2
pip install typer==0.7.0

# Install TensorFlow (compatible with Spleeter)
echo "Installing TensorFlow..."
pip install tensorflow==2.9.3

# Install Spleeter
echo "Installing Spleeter..."
pip install spleeter==2.4.0

# Install web framework
echo "Installing web framework..."
pip install flask==2.2.5
pip install flask-socketio==5.3.6
pip install flask-cors==4.0.0
pip install eventlet==0.33.3
pip install python-socketio==5.10.0

# Install audio utilities
echo "Installing audio utilities..."
pip install pydub==0.25.1
pip install soundfile==0.12.1
pip install sounddevice==0.4.6
pip install librosa==0.9.2
pip install numba==0.56.4
pip install llvmlite==0.39.1

echo "All dependencies installed successfully!"
echo "Now run: python app.py"