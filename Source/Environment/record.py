import sounddevice as sd
import numpy as np
import scipy.io.wavfile as wav

# Parameters
duration = 5  # seconds
sample_rate = 44100  # 44.1 kHz CD quality

print("Recording...")
audio_data = sd.rec(int(duration * sample_rate), samplerate=sample_rate, channels=1, dtype=np.int16)
sd.wait()  # Wait until recording is finished
print("Recording finished.")

# Save the recording
wav.write("output.wav", sample_rate, audio_data)
print("Audio saved as output.wav")
