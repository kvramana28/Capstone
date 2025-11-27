# Paddy Pest Detection – Flask + CNN

This project is a Python Flask web app that detects pests in paddy crops
using a Convolutional Neural Network (CNN). It is designed to match the
UI flow of your existing hosted app while letting you plug in your own CSS.

## Project structure

```
paddy_pest_flask/
│
├── app.py              # Flask web app (upload + prediction)
├── train_model.py      # CNN training script (Keras + TensorFlow)
├── requirements.txt
├── model/
│   ├── paddy_pest_cnn.h5       # saved model (created after training)
│   └── class_indices.json      # mapping from label -> index
├── uploads/            # uploaded images (auto created)
├── templates/
│   ├── base.html
│   └── index.html
└── static/
    └── css/
        └── style.css
```

## How to use

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

> If you use a GPU, you can install `tensorflow-gpu` instead of `tensorflow`
> depending on your environment.

### 2. Prepare dataset

Download your Google Drive folders:

- `train_images`
- `test_images` (optional)

Organize them like:

```
data/
  train/
    class_1/
      img1.jpg
      img2.jpg
    class_2/
      ...
  validation/            # optional but recommended
    class_1/
    class_2/
```

Each folder name (`class_1`, `class_2`, etc.) corresponds to the pest/condition
label (for example: `brown_plant_hopper`, `gandhi_bug`, `healthy`, ...).

Then update the `TRAIN_DIR` and `VAL_DIR` variables in `train_model.py` if
you put the data in a different folder.

### 3. Train the CNN model

```bash
python train_model.py
```

This will:

- Train a CNN using your images.
- Save the best model to `model/paddy_pest_cnn.h5`.
- Save the label mapping to `model/class_indices.json`.

### 4. Run the Flask app

```bash
python app.py
```

Then open your browser at:

```
http://127.0.0.1:5000/
```

Upload a paddy crop image and you will see the predicted pest and confidence.

### 5. Match your exact CSS design

The file `static/css/style.css` already contains a modern default design.

If you want the **same CSS as your Lovable app**:

1. Copy the CSS from your existing project.
2. Paste it into `static/css/style.css`, replacing the current contents.
3. Keep the same class names used in `base.html` and `index.html` or
   update the HTML to match your old structure.

---

If you want me to plug in your exact CSS file one-to-one, you can send me
the CSS code, and I can update this project structure for you.
