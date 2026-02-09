import torch
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from torchvision import transforms
from PIL import Image
import io
import base64
import os

from fruit_veg_cnn.models.model import MiniVGG

app = FastAPI(title="FruitVeg AI Service")

class ImageRequest(BaseModel):
    image: str

IMG_SIZE = 100
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_SAVE_PATH = os.path.join(BASE_DIR, '.././modelDictionaries/model.pth')
CLASSES_SAVE_PATH = os.path.join(BASE_DIR, '.././classes/classes.txt')

device = torch.device("cpu")


if os.path.exists(CLASSES_FILE):
    with open(CLASSES_FILE, 'r') as f:
        class_names = [line.strip() for line in f]
    print(f"✓ Found {len(class_names)} classes")
else:
    print(f"⚠ ERROR: classes.txt not found.")
    class_names = ["Unknown"] * 20
l
model = MiniVGG(num_classes=len(class_names))

if os.path.exists(MODEL_PATH):
    print(f"✓ Loading model from {MODEL_PATH}")
    try:
        model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
        model.eval()
    except RuntimeError as e:
        print(f"CRITICAL ERROR: \n{e}")
else:
    print("WARNING: Model file not found.")

transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])


CONFIDENCE_THRESHOLD = 0.60 
@app.post("/predict")
async def predict(req: ImageRequest):
    try:
        if "," in req.image:
            image_data = req.image.split(",")[1]
        else:
            image_data = req.image
            
        image_bytes = base64.b64decode(image_data)
        
        # Preprocessing
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        tensor = transform(image).unsqueeze(0).to(device)
        
        # Inference
        with torch.no_grad():
            outputs = model(tensor)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
            confidence, predicted_idx = torch.max(probabilities, 0)
            
        conf_score = confidence.item()

        if conf_score < CONFIDENCE_THRESHOLD:
            return {
                "prediction": "Unsure",
                "confidence": f"{conf_score:.2f}",
                "message": "I am not confident enough to make a prediction."
            }

        predicted_class = class_names[predicted_idx.item()]

        return {
            "prediction": predicted_class,
            "confidence": f"{conf_score:.2f}"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=5000)