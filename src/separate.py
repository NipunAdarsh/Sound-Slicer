from pathlib import Path
from spleeter.separator import Separator

# Define base folders
BASE = Path(__file__).resolve().parent.parent
INPUT_DIR = BASE / "data" / "input"
STEMS_DIR = BASE / "data" / "stems"
OUTPUT_DIR = BASE / "data" / "output"

_separator_instance = None


def get_separator():
    """Lazy load the separator instance."""
    global _separator_instance
    if _separator_instance is None:
        print("[INFO] Loading Spleeter model... (this may take a moment)")
        _separator_instance = Separator('spleeter:2stems')
        print("[INFO] Spleeter model loaded successfully.")
    return _separator_instance


def ensure_dirs():

    """Make sure input, stems, and output directories exist."""
    for d in [INPUT_DIR, STEMS_DIR, OUTPUT_DIR]:
        d.mkdir(parents=True, exist_ok=True)


def separate(song_path: Path):
    """Separate vocals and accompaniment from a song file."""
    ensure_dirs()
    separator = get_separator()

    # Output folder for this song
    out_dir = STEMS_DIR / song_path.stem
    out_dir.mkdir(parents=True, exist_ok=True)

    # Save directly into data/stems/<songname>/
    print(f"[INFO] Processing: {song_path}")
    separator.separate_to_file(str(song_path), str(STEMS_DIR))

    # Expected files
    instrumental = out_dir / "accompaniment.wav"
    vocals = out_dir / "vocals.wav"

    print(f"[INFO] Instrumental saved at: {instrumental}")
    print(f"[INFO] Vocals saved at: {vocals}")

    return instrumental, vocals


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python src/separate.py <path_to_audio>")
        raise SystemExit(1)

    song = Path(sys.argv[1]).resolve()
    inst, voc = separate(song)