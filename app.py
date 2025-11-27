import os
from flask import (
    Flask,
    render_template,
    request,
    redirect,
    url_for,
    flash,
    send_from_directory,
    session,
)
from werkzeug.utils import secure_filename
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import json

# ----------------- CONFIG ----------------- #

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
MODEL_FOLDER = os.path.join(BASE_DIR, "model")
MODEL_PATH = os.path.join(MODEL_FOLDER, "paddy_pest_cnn.h5")
CLASS_INDICES_PATH = os.path.join(MODEL_FOLDER, "class_indices.json")

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

IMAGE_SIZE = (128, 128)  # must match training

app = Flask(__name__)
app.secret_key = "change-this-secret-key"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# ----------------- SIMPLE AI KNOWLEDGE BASE ----------------- #
# IMPORTANT:
#  - Change the keys ("brown_plant_hopper", etc.) so they match
#    your actual class labels from training (folder names / class_indices.json).
#  - Pesticide examples are generic. Always verify with local agri officer.

PEST_KNOWLEDGE = {
    "brown_plant_hopper": {
        "display_name": "Brown Planthopper (BPH)",
        "description": (
            "Serious sap-sucking pest of paddy that can cause hopper burn patches "
            "and heavy yield loss if not managed in time."
        ),
        "pesticides": [
            {
                "name": "Dinotefuran 20% SG",
                "dose": "150–200 g per hectare in ~500 L water",
                "usage": "Spray when BPH reaches economic threshold level (10–20 hoppers/hill).",
            },
            {
                "name": "Imidacloprid 17.8% SL",
                "dose": "50–100 ml per acre in 150–200 L water",
                "usage": "Directed spray at the base of plants; avoid overuse to reduce resistance.",
            },
            {
                "name": "Thiamethoxam 25% WG",
                "dose": "40 g per acre in 150–200 L water",
                "usage": "Use only when hopper population is above threshold; avoid repeated applications.",
            },
        ],
        "advice": (
            "Avoid excessive nitrogen, maintain proper drainage, and keep a small strip of un-sprayed field "
            "for natural enemies. Do not use non-recommended sprays that may cause pest resurgence."
        ),
    },
    "stem_borer": {
        "display_name": "Rice Yellow Stem Borer",
        "description": (
            "Larvae bore into the stem causing dead heart in young crop and white ears in older crop."
        ),
        "pesticides": [
            {
                "name": "Cartap hydrochloride 4G",
                "dose": "25 kg per hectare as granules",
                "usage": "Broadcast uniformly in the field with shallow standing water at early infestation.",
            },
            {
                "name": "Cartap hydrochloride 50% SP",
                "dose": "1 kg per hectare in 500 L water",
                "usage": "Spray thoroughly covering the plant base and canopy.",
            },
        ],
        "advice": (
            "Clip seedling tips before transplanting, use light traps, destroy stubbles after harvest, and "
            "avoid staggered planting. Combine granular insecticide with good agronomic practices."
        ),
    },
    "gundhi_bug": {
        "display_name": "Gundhi Bug / Rice Earhead Bug",
        "description": (
            "Earhead bug that damages grains during milky stage, leading to chaffy and discoloured grains."
        ),
        "pesticides": [
            {
                "name": "Fipronil 5% SC",
                "dose": "800–1200 ml per hectare in 500 L water",
                "usage": "Apply at early ear formation and repeat after 10 days if needed.",
            },
            {
                "name": "Neem (Azadirachtin 3000 ppm)",
                "dose": "2–3 ml per litre of water",
                "usage": "Eco-friendly option at early infestation levels.",
            },
        ],
        "advice": (
            "Use light traps, keep the field and bunds clean, synchronise planting with neighbours and avoid "
            "late planting which increases bug incidence."
        ),
    },
    "leaf_folder": {
        "display_name": "Rice Leaf Folder",
        "description": (
            "Caterpillars fold leaves and feed inside, reducing photosynthesis and crop vigour."
        ),
        "pesticides": [
            {
                "name": "Cartap hydrochloride 50% SP",
                "dose": "1 kg per hectare in 500 L water",
                "usage": "Spray targeted to folded leaves in early stage of infestation.",
            },
        ],
        "advice": (
            "Avoid high doses of nitrogen, encourage natural enemies (spiders, parasitoids) and use light traps. "
            "Spray only when damage crosses economic threshold."
        ),
    },
    "healthy": {
        "display_name": "Healthy Paddy",
        "description": (
            "No major pest symptoms detected in the uploaded image. Maintain good agronomic practices."
        ),
        "pesticides": [],
        "advice": (
            "Follow recommended nutrient management, proper spacing, water management and timely weed control. "
            "Regularly scout the field to detect any early pest or disease symptoms."
        ),
    },
}


def get_pest_knowledge(label: str):
    if not label:
        return None
    key = label.strip()
    if key in PEST_KNOWLEDGE:
        return PEST_KNOWLEDGE[key]
    lkey = key.lower()
    if lkey in PEST_KNOWLEDGE:
        return PEST_KNOWLEDGE[lkey]
    key2 = lkey.replace(" ", "_")
    return PEST_KNOWLEDGE.get(key2)


# -------------- HELPERS ------------------- #

def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def load_cnn_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"Model file not found at {MODEL_PATH}. "
            "Train the model first by running `python train_model.py`."
        )
    model = load_model(MODEL_PATH)
    # Load class indices
    if os.path.exists(CLASS_INDICES_PATH):
        with open(CLASS_INDICES_PATH, "r") as f:
            class_indices = json.load(f)
        # Invert dict: index -> class_name
        index_to_class = {int(v): k for k, v in class_indices.items()}
    else:
        # Fallback example labels – update for your own dataset
        index_to_class = {
            0: "brown_plant_hopper",
            1: "gundhi_bug",
            2: "leaf_folder",
            3: "stem_borer",
            4: "healthy",
        }
    return model, index_to_class


MODEL, INDEX_TO_CLASS = None, None

# Load the model once when the app starts (Flask 3 compatible)
try:
    MODEL, INDEX_TO_CLASS = load_cnn_model()
    print("✅ CNN model loaded successfully.")
except Exception as e:
    print("❌ Error loading model:", e)
    MODEL = None
    INDEX_TO_CLASS = {}


def prepare_image(img_path: str) -> np.ndarray:
    img = image.load_img(img_path, target_size=IMAGE_SIZE)
    img_array = image.img_to_array(img)
    img_array = img_array / 255.0  # rescale just like during training
    img_array = np.expand_dims(img_array, axis=0)
    return img_array


def generate_crop_advice(question: str, last_prediction: str | None = None) -> str:
    """
    Simple rule-based 'AI assistant' for crop-related queries.
    You can later plug in a real LLM API here if you want.
    """
    if not question:
        return "Please type your question about paddy crop or pests."

    q = question.lower()

    # If user is asking about pesticide or control
    if any(w in q for w in ["pesticide", "insecticide", "control", "medicine", "spray"]):
        if last_prediction:
            pest_info = get_pest_knowledge(last_prediction)
            if pest_info and pest_info.get("pesticides"):
                lines = []
                lines.append(
                    f"For the detected condition **{pest_info['display_name']}**, "
                    "here are some commonly mentioned options (always follow label & local expert advice):"
                )
                for p in pest_info["pesticides"]:
                    lines.append(f"- {p['name']} – {p['dose']} ({p['usage']})")
                lines.append(
                    "\nAlso remember to combine chemical control with field sanitation, balanced fertilizers "
                    "and water management."
                )
                return "\n".join(lines)
        return (
            "Pesticide choice depends on the exact pest, crop stage and local recommendations.\n"
            "First correctly identify the pest (e.g., brown planthopper, stem borer, gundhi bug). "
            "Once you know the pest, choose an insecticide that is specifically labeled for that pest and "
            "follow the dose on the label or as suggested by your local agriculture officer."
        )

    # Questions about yield / crop production
    if any(w in q for w in ["yield", "production", "increase", "improve", "low yield"]):
        return (
            "To improve paddy yield:\n"
            "1. Use healthy, certified seed of a recommended high-yielding variety.\n"
            "2. Follow recommended spacing and seed rate to avoid too-dense planting.\n"
            "3. Apply fertilizers based on soil test (balanced N-P-K) and split nitrogen doses.\n"
            "4. Maintain proper water management (alternate wetting and drying instead of continuous flooding).\n"
            "5. Monitor pests and diseases regularly and control them at economic threshold levels.\n"
            "6. Ensure timely weeding and avoid nutrient/water stress at panicle initiation and grain filling stage."
        )

    # Water management questions
    if "water" in q or "irrigation" in q:
        return (
            "For paddy, maintain 2–5 cm standing water during most of the crop growth, but avoid deep water.\n"
            "During tillering, practicing alternate wetting and drying (AWD) can save water and reduce BPH incidence.\n"
            "Do not keep the field continuously flooded in late stages; drain excess water before harvest."
        )

    # Fertilizer / urea questions
    if any(w in q for w in ["urea", "fertilizer", "npk", "nitrogen"]):
        return (
            "Use fertilizers based on a soil test whenever possible.\n"
            "As a general guideline for many rice systems, split nitrogen (urea) into 3–4 applications "
            "(basal, tillering, panicle initiation, and sometimes booting), while most phosphorus and potassium "
            "is applied as basal dose. Avoid very high nitrogen, as it increases pest and disease risk."
        )

    # Fallback generic answer
    return (
        "I can help with general guidance on paddy pests, fertilizers, water management and yield.\n"
        "Try asking things like:\n"
        "- 'What pesticide should I use for brown planthopper?'\n"
        "- 'How to increase paddy yield?'\n"
        "- 'How to manage stem borer in paddy?'\n"
        "For location-specific advice, please also consult your local agriculture officer or extension worker."
    )


# -------------- ROUTES ------------------- #

@app.route("/", methods=["GET", "POST"])
def index():
    prediction = None
    confidence = None
    file_url = None
    pest_info = None
    error_msg = None

    if request.method == "POST":
        if MODEL is None:
            error_msg = (
                "CNN model is not loaded. Please train the model first "
                "by running `python train_model.py`."
            )
            flash(error_msg, "error")
            return render_template("index.html")

        if "file" not in request.files:
            flash("No file part in the request.", "error")
            return redirect(request.url)

        file = request.files["file"]
        if file.filename == "":
            flash("Please choose an image file.", "error")
            return redirect(request.url)

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
            save_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(save_path)

            # Predict
            img_tensor = prepare_image(save_path)
            preds = MODEL.predict(img_tensor)
            pred_idx = int(np.argmax(preds, axis=1)[0])
            pred_prob = float(np.max(preds, axis=1)[0])
            pred_label = INDEX_TO_CLASS.get(pred_idx, f"class_{pred_idx}")

            prediction = pred_label
            confidence = round(pred_prob * 100, 2)
            file_url = url_for("static_uploaded_file", filename=filename)

            # Save last prediction in session for assistant
            session["last_prediction"] = pred_label

            # Pest-specific information
            pest_info = get_pest_knowledge(pred_label)
        else:
            flash("File type not allowed. Please upload a JPG or PNG image.", "error")

    return render_template(
        "index.html",
        prediction=prediction,
        confidence=confidence,
        file_url=file_url,
        pest_info=pest_info,
        error_msg=error_msg,
    )


@app.route("/assistant", methods=["GET", "POST"])
def assistant():
    question = ""
    answer = ""
    last_prediction = session.get("last_prediction")

    if request.method == "POST":
        question = request.form.get("question", "").strip()
        answer = generate_crop_advice(question, last_prediction=last_prediction)

    last_pest_info = get_pest_knowledge(last_prediction) if last_prediction else None

    return render_template(
        "assistant.html",
        question=question,
        answer=answer,
        last_prediction=last_prediction,
        last_pest_info=last_pest_info,
    )


@app.route("/uploads/<filename>")
def static_uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


# -------------- MAIN --------------------- #

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
