@echo off
echo Starting Sound Slicer...

:: Start Backend
echo Starting Backend Server...
start "Sound Slicer Backend" cmd /k "call .\venv\Scripts\activate.bat && python app.py"

:: Start Frontend
echo Starting Frontend Server...
cd frontend
start "Sound Slicer Frontend" cmd /k "npm run dev"

echo Done!
