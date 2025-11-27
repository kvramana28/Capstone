"""
Training script for Paddy Pest Detection using a CNN (Keras + TensorFlow).

Steps to use:
1. Download your Google Drive "train_images" and (optionally) "test_images".
2. Arrange them as:
   data/
       train/
           class_1/
               image1.jpg
               image2.jpg
               ...
           class_2/
               ...
       validation/   (optional but recommended)
           class_1/
           class_2/
   (You can also split a subset of train into validation.)

3. Update TRAIN_DIR and VAL_DIR paths below if needed.
4. Run:
   python train_model.py
5. After training, paddy_pest_cnn.h5 and class_indices.json
   will be stored in the "model" folder.
"""

import os
import json

import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras import layers, models, optimizers, callbacks

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ----------- UPDATE THESE PATHS IF NEEDED ----------- #
DATA_DIR = os.path.join(BASE_DIR, "data")
TRAIN_DIR = os.path.join(DATA_DIR, "train")
VAL_DIR = os.path.join(DATA_DIR, "validation")  # you can create from part of train

IMAGE_SIZE = (128, 128)     # must match app.py
BATCH_SIZE = 32
EPOCHS = 20

MODEL_FOLDER = os.path.join(BASE_DIR, "model")
MODEL_PATH = os.path.join(MODEL_FOLDER, "paddy_pest_cnn.h5")
CLASS_INDICES_PATH = os.path.join(MODEL_FOLDER, "class_indices.json")

os.makedirs(MODEL_FOLDER, exist_ok=True)

def build_cnn_model(input_shape, num_classes):
    """
    Simple CNN model. You can make it deeper if dataset is large.
    """
    model = models.Sequential([
        layers.Conv2D(32, (3, 3), activation="relu", input_shape=input_shape),
        layers.MaxPooling2D((2, 2)),

        layers.Conv2D(64, (3, 3), activation="relu"),
        layers.MaxPooling2D((2, 2)),

        layers.Conv2D(128, (3, 3), activation="relu"),
        layers.MaxPooling2D((2, 2)),

        layers.Flatten(),
        layers.Dense(128, activation="relu"),
        layers.Dropout(0.5),
        layers.Dense(num_classes, activation="softmax"),
    ])

    model.compile(
        loss="categorical_crossentropy",
        optimizer=optimizers.Adam(learning_rate=1e-4),
        metrics=["accuracy"],
    )
    return model

def main():
    # Data generators
    train_datagen = ImageDataGenerator(
        rescale=1.0/255,
        rotation_range=20,
        width_shift_range=0.1,
        height_shift_range=0.1,
        zoom_range=0.1,
        horizontal_flip=True,
        fill_mode="nearest",
        validation_split=0.2 if not os.path.exists(VAL_DIR) else 0.0,
    )

    if os.path.exists(VAL_DIR):
        # Use separate validation directory
        val_datagen = ImageDataGenerator(rescale=1.0/255)
        train_generator = train_datagen.flow_from_directory(
            TRAIN_DIR,
            target_size=IMAGE_SIZE,
            batch_size=BATCH_SIZE,
            class_mode="categorical",
        )
        val_generator = val_datagen.flow_from_directory(
            VAL_DIR,
            target_size=IMAGE_SIZE,
            batch_size=BATCH_SIZE,
            class_mode="categorical",
        )
    else:
        # Use validation_split from train_datagen
        train_generator = train_datagen.flow_from_directory(
            TRAIN_DIR,
            target_size=IMAGE_SIZE,
            batch_size=BATCH_SIZE,
            class_mode="categorical",
            subset="training",
        )
        val_generator = train_datagen.flow_from_directory(
            TRAIN_DIR,
            target_size=IMAGE_SIZE,
            batch_size=BATCH_SIZE,
            class_mode="categorical",
            subset="validation",
        )

    num_classes = train_generator.num_classes
    input_shape = (IMAGE_SIZE[0], IMAGE_SIZE[1], 3)

    model = build_cnn_model(input_shape, num_classes)
    model.summary()

    # Save class indices to JSON so Flask app can load labels
    class_indices = train_generator.class_indices
    with open(CLASS_INDICES_PATH, "w") as f:
        json.dump(class_indices, f, indent=4)

    checkpoint_cb = callbacks.ModelCheckpoint(
        MODEL_PATH,
        monitor="val_accuracy",
        save_best_only=True,
        mode="max",
        verbose=1,
    )

    earlystop_cb = callbacks.EarlyStopping(
        monitor="val_loss",
        patience=5,
        restore_best_weights=True,
        verbose=1,
    )

    history = model.fit(
        train_generator,
        epochs=EPOCHS,
        validation_data=val_generator,
        callbacks=[checkpoint_cb, earlystop_cb],
    )

    # Save final model as well (even if not the best)
    model.save(MODEL_PATH)
    print(f"Model saved at: {MODEL_PATH}")
    print(f"Class indices saved at: {CLASS_INDICES_PATH}")
    

if __name__ == "__main__":
    main()
