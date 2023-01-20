import numpy as np 
import matplotlib.pyplot as plt 
import librosa as lr

##---- Framing Audio ----##

# Découpe le signal audio initial en portion de taille frame_number
# recovery_proportion est la proportion de recouvrement : 
# |----------| portion 1
#         |----------| portion 2
#         [--] recouvrement de recovery_proportion * frame_number points
def frame_audio(audio, frame_number, recovery_proportion):
    print("Framing audio for {} frames and {} as recovery proportion".format(frame_number, recovery_proportion))
    framed_audio_number = int(len(audio) / (frame_number * (1 - recovery_proportion)))-1
    print("Number of partition of the audio signal : {}".format(framed_audio_number))
    framed_audio = np.zeros(shape=(framed_audio_number, frame_number), dtype=float)

    for n in range(framed_audio_number):
        start_index = int(n * (1-recovery_proportion) * frame_number)
        framed_audio[n,:] = audio[start_index : start_index + frame_number]

    return framed_audio

##----- Windowing ----##

#----- Han window -----#

def get_han_window(frame_number):
    print("Getting Hanning Window of size {}".format(frame_number))
    window = np.zeros(shape=frame_number, dtype=float)
    for n in range(frame_number):
        window[n] = 0.5 * (1.0 - np.cos(2 * np.pi * n / (frame_number - 1)))
    return window

#---- Ponderation ----#

# Retourne la fenêtre de ponderation des coefficients cepstraux
def get_pond_window(filter_num):
    pond_window = np.zeros(shape=filter_num) 
    for n in range(filter_num):
        pond_window[n] = 1 + filter_num / 2 * np.sin(np.pi * n / filter_num)
    
    return pond_window

#---- Window Application ----#

def appl_window(framed_audio, window):
    assert len(window) == framed_audio.shape[1]
    windowed_audio = np.zeros(framed_audio.shape)
    for n in range(framed_audio.shape[0]):
        windowed_audio[n,:] = window * framed_audio[n,:]
    return windowed_audio

##---- Cepstrals coefficient computation ----##

#---- Mel Scale function -----#

def freq_to_mel(freq:float)->float:
    return 2595.0 * np.log10(1.0 + freq / 700.0)

def mel_to_freq(mels:float)->float:
    return 700.0 * (10.0**(mels / 2595.0) - 1.0)

#---- Filters creation ----#
 
# Rertourne filter_num + 2 points en Hz correspondant au limites des triangles de taille 300 Mel  
def get_filter_points(filter_num:int)->np.ndarray:
    triangle_len = 300 # Mel

    print("Getting {} filters from {} to {}".format(filter_num, 0, (filter_num + 1) // 2 * triangle_len))
    fmin_mel = freq_to_mel(0)
    fmax_mel = freq_to_mel((filter_num + 1) // 2 * triangle_len)
    
    print("Limits in mel : {} to {}".format(fmin_mel, fmax_mel))
    mels = np.linspace(fmin_mel, fmax_mel, num=filter_num + 2)
    return mel_to_freq(mels).astype(int)

# Retourne les triangles correspondant au filter_num + 2 points passées en entrée dans mel_filters_points
def get_triangles(mel_filters_points:np.ndarray, filter_num:int):
    print("Getting triangles for {} filters of range 0 to {}".format(filter_num, mel_filters_points[-1]))
    triangles = np.zeros(shape=(filter_num, mel_filters_points[-1]),dtype=float)
    for n in range(filter_num):
        triangles[n, :] = get_triangle(mel_filters_points[n], mel_filters_points[n+1], mel_filters_points[n+2], mel_filters_points[-1])

    return triangles

def get_triangle(start:int, middle : int, end:int, arr_size:int)-> np.ndarray:
    filter = np.zeros(shape=arr_size)
    filter[start : middle] = np.linspace(0,1,middle - start)
    filter[middle : end] = np.linspace(1,0,end - middle)

    return filter

#---- Filter contribution ----#

def calculate_filter_contribution(power_spectrum, filters, filter_num):
    filter_contribution = np.zeros(shape=filter_num)
    for n in range(filter_num):
        for k in range(len(power_spectrum)):
            filter_contribution[n] += power_spectrum[k] * filters[n,k]
        
    return filter_contribution

##---- DCT ----##

def dct(filtered_spectrum):
    K = len(filtered_spectrum)
    dct_spectrum = np.zeros(shape=K)
    for n in range(K):
        for k in range(n):
            # A modifier
            if(filtered_spectrum[k] > 0):
                dct_spectrum[n] += np.log(filtered_spectrum[k]) * np.cos(n * (k - 0.5)* np.pi / K)
    
    return dct_spectrum

##---- Utility ----##

def sqr_module(x):
    return x.real**2 + x.imag**2

##---- Framing Audio ----##

# On se restreins à un seul channel car wavfile.read renvoie un tableau contenant 1 ou deux channel
sample_rate = 44100 #Hz
audio, sample_rate = lr.load("src\mfcc\data\samples\A0vH.wav", sr=sample_rate)

frame_duration = 20 #ms

recovery_proportion = 0.5

frame_number = int(frame_duration / 1000 * sample_rate)
framed_audio = frame_audio(audio, frame_number, recovery_proportion)

window = get_han_window(frame_number)

##---- Applying window ----##

windowed_audio = appl_window(framed_audio, window)

print("Showing windowed audio")
plt.figure(figsize=(15,4))
plt.plot(windowed_audio[0])
plt.grid(True)
plt.show()

##---- Apply FFT ----##

print("Applying FFT")
fft_audio = np.zeros(shape=windowed_audio.shape, dtype='complex')
for n in range(fft_audio.shape[0]):
    print("{} / {}".format(n, fft_audio.shape[0]))
    # On ne prend que la première moitié de la FFT car elle est repétée
    fft_audio[n,:(frame_number+1)//2] = np.fft.fft(windowed_audio[n])[:(frame_number+1)//2]

sqr_fft = sqr_module(fft_audio)

##---- Getting filters ----##

filter_num = 13
filters = get_triangles(get_filter_points(filter_num),filter_num)
plt.figure(figsize=(15,4))
for n in range(filter_num):
    plt.plot(filters[n])
plt.show()

##---- Applying filters ----##

filtered_spectrum = np.zeros(shape=(sqr_fft.shape[0],filter_num))
print("Calculating filter contribution for {} filters".format(filter_num))
for n in range(filtered_spectrum.shape[0]):
    filtered_spectrum[n] = calculate_filter_contribution(sqr_fft[n], filters, filter_num)

##---- Applying dct ----##

dct_spectrum = np.zeros(shape=filtered_spectrum.shape)

for n in range(filtered_spectrum.shape[0]):
    dct_spectrum[n] = dct(filtered_spectrum[n])

##---- Ponderation ----##

pond_window = get_pond_window(filter_num)
pond_spectrum = appl_window(dct_spectrum, pond_window)
plt.figure(figsize=(15,4))
plt.imshow(np.transpose(pond_spectrum), aspect='auto', origin='lower')

hop_length = int(sample_rate/100)
n_fft = int(sample_rate/40)
features_librosa = lr.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=13, hop_length=hop_length, n_fft=n_fft)
plt.figure(figsize=(15,4))
plt.imshow(features_librosa, aspect='auto', origin='lower')
plt.show()