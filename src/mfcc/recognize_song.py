import mfcc
import matplotlib.pyplot as plt
import librosa as lr
from keras.models import load_model
import os

test = lr.load("genres_original/metal/metal.00000.wav")
size = len(test[0])
print(size)

audio_path = 'mozart.wav'
audio, sr = lr.load(audio_path)
print(audio.shape)
mfcc_audio = mfcc.mfcc(audio, sr)[:1874,:]
cmap = plt.cm.jet
plt.imsave("mozart_mfcc.png",mfcc_audio, cmap=cmap)

print(mfcc_audio.shape)

model = load_model("model/model_0.h5")
print(model.summary)
print(model.predict(os.path("mozart_mfcc.png")))