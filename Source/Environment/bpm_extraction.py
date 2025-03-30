import librosa


def find_tempo(path):
    # Load the audio file 
    y, sr = librosa.load(path)

    # Extract tempo (BPM)
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)

    return tempo

print(find_tempo("Source/Environment/output.wav"))