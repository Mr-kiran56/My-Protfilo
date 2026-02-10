import os
import torch
import joblib
import numpy as np
import logging
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch.nn.functional as F
from huggingface_hub import hf_hub_download

# ---------------- ENV FIXES ----------------
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
os.environ["HF_HUB_DISABLE_MEMORY_MAPPING"] = "1"

# ---------------- LOGGING ----------------
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# ---------------- DEVICE ----------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ---------------- HF MODEL INFO ----------------
HF_MODEL_ID = "KiranPunna/profile_intent"
LABEL_ENCODER_FILENAME = "label_encoder_p.pkl"

# ---------------- GLOBALS ----------------
tokenizer = None
model = None
label_encoder = None

NUM_ENCODER_CLASSES = None
NUM_MODEL_CLASSES = None


def load_intent_model():
    """
    Load tokenizer, model, and label encoder from Hugging Face Hub.
    Lazy loading (safe for Docker / Render / CI).
    """
    global tokenizer, model, label_encoder
    global NUM_ENCODER_CLASSES, NUM_MODEL_CLASSES

    if tokenizer is not None and model is not None:
        return

    logger.info("[IntentLLM] Loading model from Hugging Face...")

    # ---- Tokenizer ----
    tokenizer = AutoTokenizer.from_pretrained(
        HF_MODEL_ID,
        use_fast=True
    )

    # ---- Model ----
    model = AutoModelForSequenceClassification.from_pretrained(
        HF_MODEL_ID,
        torch_dtype=torch.float32,
        low_cpu_mem_usage=True
    )

    model.to(device)
    model.eval()

    # ---- Label Encoder ----
    label_encoder_path = hf_hub_download(
        repo_id=HF_MODEL_ID,
        filename=LABEL_ENCODER_FILENAME
    )

    label_encoder = joblib.load(label_encoder_path)

    if isinstance(label_encoder.classes_, list):
        label_encoder.classes_ = np.array(label_encoder.classes_)

    NUM_ENCODER_CLASSES = len(label_encoder.classes_)
    NUM_MODEL_CLASSES = model.config.num_labels

    logger.info("[IntentLLM] Model loaded successfully")
    logger.info(f"[IntentLLM] Model classes   : {NUM_MODEL_CLASSES}")
    logger.info(f"[IntentLLM] Encoder classes : {NUM_ENCODER_CLASSES}")
    logger.info(f"[IntentLLM] Encoder labels  : {label_encoder.classes_}")


def predict_intent(sentence: str):
    """
    Predict intent for a single sentence.
    Safe for CPU / Docker / Render.
    """
    try:
        if not sentence or len(sentence.strip()) < 3:
            return {"intent": "unknown", "conf": 0.0}

        # Ensure model is loaded
        load_intent_model()

        inputs = tokenizer(
            sentence,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=128
        )

        inputs = {k: v.to(device) for k, v in inputs.items()}

        with torch.no_grad():
            outputs = model(**inputs)

        probs = F.softmax(outputs.logits, dim=1)
        pred_id = int(torch.argmax(probs, dim=1).item())
        confidence = float(probs[0, pred_id].item())

        # Safety check
        if pred_id >= NUM_ENCODER_CLASSES:
            return {"intent": "unknown", "conf": round(confidence, 4)}

        intent = label_encoder.inverse_transform([pred_id])[0]

        return {
            "intent": intent,
            "conf": round(confidence, 4)
        }

    except Exception as e:
        logger.error(f"[IntentLLM] Prediction failed: {e}")


