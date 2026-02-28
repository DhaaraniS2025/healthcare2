from flask import Flask, render_template, request, jsonify
import tensorflow as tf
import numpy as np
import cv2
import os
import uuid
from tensorflow.keras.applications import efficientnet

app = Flask(__name__)

model_path = os.path.join("model", "lung_cancer_model.h5")
lung_model = tf.keras.models.load_model(model_path)

Img = 224

def preprocess(path):
    img = cv2.imread(path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (Img, Img))
    img = img.astype("float32")
    img = efficientnet.preprocess_input(img)
    img = np.expand_dims(img, 0)
    return img

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/lung")
def lung_page():
    return render_template("lung.html")

@app.route("/breast")
def breast_page():
    return render_template("cann.html")

@app.route("/health")
def health_page():
    return render_template("welb.html")

@app.route("/lung_predict", methods=["POST"])
def lung_predict():
    if "image" not in request.files:
        return jsonify({"error": "No file uploaded"})

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "No file selected"})

    temp_name = str(uuid.uuid4()) + ".jpg"
    file.save(temp_name)

    try:
        x = preprocess(temp_name)
        p = float(lung_model.predict(x, verbose=0)[0][0])
        confidence = round(p * 100, 2)

        if p >= 0.60:
            result = "Cancerous pattern detected"
        elif p <= 0.40:
            result = "Non-cancerous pattern detected"
        else:
            result = "Inconclusive result — further clinical review recommended"

    except Exception:
        result = "Prediction error"
        confidence = None

    if os.path.exists(temp_name):
        os.remove(temp_name)

    return jsonify({
        "result": result,
        "confidence": confidence
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)