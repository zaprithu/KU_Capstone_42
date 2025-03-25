import librosa

# Load the audio file (replace 'audio_file_path' with the actual file path)
y, sr = librosa.load('Source\\Environment\\output.wav')

# Extract tempo (BPM)
tempo, _ = librosa.beat.beat_track(y=y, sr=sr)

print(f"Tempo: {tempo} BPM")
