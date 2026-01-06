# Sound Slicer 🎵

Sound Slicer is a powerful, minimalist AI tool for separating vocals and instrumentals from tracks. 
Built with an **iOS-inspired design system**, it offers a clean, premium experience for processing audio files.

![Sound Slicer](https://via.placeholder.com/800x400?text=Sound+Slicer+Preview)

## ✨ Features
- **AI-Powered Separation**: Uses Spleeter to cleanly separate vocals from accompaniment.
- **Premium iOS Design**: Minimalist, clean interface with soft shadows and system-native typography.
- **Real-time Visualization**: Beautiful animated waveforms during processing and playback.
- **Support for Many Formats**: MP3, WAV, FLAC, OGG, M4A.
- **One-Click Run**: Simple start script for Windows.

---

## 🚀 Quick Start (Windows)

The easiest way to run the application is using the included **One-Click Script**.

1.  **Clone the repository** (or unzip the downloaded file).
2.  **Install Prerequisites** (see below).
3.  Double-click **`run_locally.bat`**.

That's it! The script will automatically start both the Backend (Python) and Frontend (React) servers for you.

---

## 🛠️ Prerequisites

Before running, ensure you have the following installed on your system:

### 1. Python 3.10
*   **Important**: Spleeter requires Python 3.10. Newer versions (3.11/3.12) may cause issues.
*   [Download Python 3.10](https://www.python.org/downloads/release/python-31011/)
*   Make sure to check **"Add Python to PATH"** during installation.

### 2. Node.js
*   Required for the frontend interface.
*   [Download Node.js](https://nodejs.org/) (LTS version recommended).

### 3. FFmpeg
*   Required for audio processing.
*   **Windows**:
    1.  Download FFmpeg from [gyan.dev](https://www.gyan.dev/ffmpeg/builds/ffmpeg-git-full.7z).
    2.  Extract the folder.
    3.  Add the `bin` folder path (e.g., `C:\ffmpeg\bin`) to your System Environment Variables -> Path.
*   **Verification**: Open a terminal and run `ffmpeg -version`.

---

## 👩‍💻 Manual Installation (Developers)

If you prefer to run things manually step-by-step:

### 1. Clone & Setup Backend
```bash
# Navigate to project root
cd Sound-Slicer-main

# Create virtual environment (Python 3.10)
python -m venv venv

# Activate venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Setup Frontend
```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install
```

### 3. Run Application
**Terminal 1 (Backend):**
```bash
# From project root (with venv activated)
python app.py
```

**Terminal 2 (Frontend):**
```bash
# From frontend folder
npm run dev
```

Open your browser to **http://localhost:5173**.

---

## ❓ Troubleshooting

**"Spleeter or Tensorflow error"**
*   Ensure you are using **Python 3.10**.
*   If you see a "Visual C++" error, install the [VC++ Redistributable](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170).

**"FFmpeg not found"**
*   Make sure FFmpeg is added to your system PATH. Restart your terminal after installing it.

**"Upload failed"**
*   Check the backend terminal for error logs. Ensure the file is a valid audio format.

---

## 📄 License
MIT License. Free to use and modify.
