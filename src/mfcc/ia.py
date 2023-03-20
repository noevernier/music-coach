import mfcc
import numpy as np
import matplotlib.pyplot as plt
import librosa as lr
import tensorflow as tf
import os

from tensorflow import keras
from keras import layers
from keras.models import Sequential
from keras.models import load_model

# Transformation de la base de donnée en image
def initialize_data():
  cmap = plt.cm.jet
  for foldername in os.listdir("genres_original"):
    f = os.path.join("genres_original", foldername)
    print(f)
    for filename in os.listdir(f):
        print("advancement {}".format(filename))
        fp = os.path.join(f, filename)
        print(fp)
        # checking if it is a file
        if os.path.isfile(fp):
            signal, sr = lr.load(fp)
            data = mfcc.mfcc(signal, sr, recovery_proportion=0.2)[:,1:14]
            print(data.shape)
            plt.imsave('images/' + foldername +'/' + filename + '.png', np.transpose(data), cmap=cmap)

initialize_data()

batch_size = 32
img_height = 12
img_width = 1874

train_ds = keras.utils.image_dataset_from_directory(
  "music_styles",
  validation_split=0.2,
  subset="training",
  seed=123,
  image_size=(img_height, img_width),
  batch_size=batch_size)

val_ds = tf.keras.utils.image_dataset_from_directory(
  "music_styles",
  validation_split=0.2,
  subset="validation",
  seed=123,
  image_size=(img_height, img_width),
  batch_size=batch_size)

class_names = train_ds.class_names

plt.figure(figsize=(10, 10))
for images, labels in train_ds.take(1):
  for i in range(9):
    ax = plt.subplot(3, 3, i + 1)
    plt.imshow(images[i].numpy().astype("uint8"))
    plt.title(class_names[labels[i]])
    plt.axis("off")

normalization_layer = layers.Rescaling(1./255)
normalized_ds = train_ds.map(lambda x, y: (normalization_layer(x), y))
image_batch, labels_batch = next(iter(normalized_ds))
first_image = image_batch[0]
print(np.min(first_image), np.max(first_image))

num_classes = len(class_names)

# Utilsation d'un réseau préconçu par TensorFlow
model = Sequential([
  layers.Rescaling(1./255, input_shape=(img_height, img_width, 3)),
  layers.Conv2D(16, 3, padding='same', activation='relu'),
  layers.MaxPooling2D(),
  layers.Conv2D(32, 3, padding='same', activation='relu'),
  layers.MaxPooling2D(),
  layers.Conv2D(64, 3, padding='same', activation='relu'),
  layers.MaxPooling2D(),
  layers.Flatten(),
  layers.Dense(128, activation='relu'),
  layers.Dense(num_classes)
])

model.compile(optimizer='adam',
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
              metrics=['accuracy'])

model.summary()

epochs=20
history = model.fit(
  train_ds,
  validation_data=val_ds,
  epochs=epochs
)

acc = history.history['accuracy']
val_acc = history.history['val_accuracy']

loss = history.history['loss']
val_loss = history.history['val_loss']

epochs_range = range(epochs)

plt.figure(figsize=(8, 8))
plt.subplot(1, 2, 1)
plt.plot(epochs_range, acc, label='Training Accuracy')
plt.plot(epochs_range, val_acc, label='Validation Accuracy')
plt.legend(loc='lower right')
plt.title('Training and Validation Accuracy')

plt.subplot(1, 2, 2)
plt.plot(epochs_range, loss, label='Training Loss')
plt.plot(epochs_range, val_loss, label='Validation Loss')
plt.legend(loc='upper right')
plt.title('Training and Validation Loss')
plt.show()

export_path = os.path.join("model", "model_1")
print('export_path = {}\n'.format(export_path))

model.save("model/model_3.h5")

