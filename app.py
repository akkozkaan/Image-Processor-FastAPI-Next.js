from fastapi import FastAPI, File, UploadFile
import cv2
import numpy as np
from PIL import Image
import io
import tensorflow as tf
import requests
from bs4 import BeautifulSoup
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# CORS settings
origins = [
    "http://localhost:3000",  # Next.js frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # domains that are allowed to make requests
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# eBay API credentials
EBAY_APP_ID = "SENIN_EBAY_APP_ID"  # Add your eBay App ID here

def load_model():
    model = tf.keras.applications.MobileNetV2(weights="imagenet")
    return model

model = load_model()

def process_image(image_bytes: bytes):
    image = Image.open(io.BytesIO(image_bytes))
    image = image.resize((224, 224))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    return image

def predict(image):
    predictions = model.predict(image)
    decoded_predictions = tf.keras.applications.mobilenet_v2.decode_predictions(predictions, top=3)[0]
    return [{"label": label, "probability": float(prob)} for (_, label, prob) in decoded_predictions]

# eBay API ile ürün arama
def get_similar_products(query):
    url = "https://svcs.ebay.com/services/search/FindingService/v1"
    params = {
        "OPERATION-NAME": "findItemsByKeywords",
        "SERVICE-VERSION": "1.0.0",
        "SECURITY-APPNAME": EBAY_APP_ID,
        "RESPONSE-DATA-FORMAT": "JSON",
        "keywords": query,
        "paginationInput.entriesPerPage": 5  # Sadece 5 ürün döndürelim
    }
    
    response = requests.get(url, params=params)
    data = response.json()

    products = []
    if "findItemsByKeywordsResponse" in data:
        items = data["findItemsByKeywordsResponse"][0]["searchResult"][0].get("item", [])
        
        for item in items:
            title = item["title"][0]
            price = item["sellingStatus"][0]["currentPrice"][0]["__value__"]
            link = item["viewItemURL"][0]
            
            products.append({
                "title": title,
                "price": f"{price} USD",
                "link": link
            })
    
    return products

@app.post("/analyze/")
async def analyze_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = process_image(image_bytes)
    predictions = predict(image)
    
    # En yüksek tahminle etiketin adını al
    predicted_label = predictions[0]['label']
    
    # eBay'de benzer ürünleri bul
    similar_products = get_similar_products(predicted_label)
    
    return {"predictions": predictions, "similar_products": similar_products}
