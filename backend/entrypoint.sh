#!/bin/sh
set -e

echo "=========================================================="
echo " Starting Ancil AI Backend Service..."
echo "=========================================================="

# Wait for MongoDB to become ready
echo "[*] Waiting for MongoDB to become ready..."
python - << 'EOF'
import os
import sys
import time
from pymongo import MongoClient

mongo_url = os.getenv("URL_MONGODB", "mongodb://mongodb:27017")
max_retries = 30
retry_interval = 2

for attempt in range(1, max_retries + 1):
    try:
        client = MongoClient(mongo_url, serverSelectionTimeoutMS=2000)
        client.admin.command('ping')
        print(f"[✓] Successfully connected to MongoDB at {mongo_url}")
        sys.exit(0)
    except Exception as e:
        print(f"[-] Waiting for MongoDB (attempt {attempt}/{max_retries})...")
        time.sleep(retry_interval)

print("[✗] Error: Could not connect to MongoDB after maximum retries.")
sys.exit(1)
EOF

# Ensure required directories exist
mkdir -p modeles_entraines donnees

# Check if pre-trained ML models exist; if missing, train them
python - << 'EOF'
import os
import sys

models = [
    "modele_regression_lineaire.pkl",
    "modele_arbre_decision.pkl",
    "modele_svm.pkl"
]
models_dir = os.path.join(os.path.dirname(__file__), "modeles_entraines")
missing = [m for m in models if not os.path.exists(os.path.join(models_dir, m))]

if missing:
    print(f"[*] Missing models: {missing}. Initiating dataset generation and training...")
    sys.exit(1)
else:
    print("[✓] All pre-trained ML models are present.")
    sys.exit(0)
EOF

if [ $? -ne 0 ]; then
    echo "[*] Generating synthetic dataset..."
    python generate_dataset.py
    echo "[*] Training machine learning models..."
    python train_models.py
fi

# Seed initial student records if database is empty
python - << 'EOF'
import os
import subprocess
from pymongo import MongoClient

try:
    mongo_url = os.getenv("URL_MONGODB", "mongodb://mongodb:27017")
    db_name = os.getenv("NOM_BASE_DONNEES", "admission_intelligente")
    client = MongoClient(mongo_url, serverSelectionTimeoutMS=3000)
    db = client[db_name]
    count = db.etudiants.count_documents({})
    if count == 0:
        print("[*] Database is empty. Seeding initial test students...")
        subprocess.run(["python", "insert_10_students.py"], check=True)
    else:
        print(f"[✓] Database already initialized with {count} student records.")
except Exception as e:
    print(f"[!] Warning during student seed check: {e}")
EOF

echo "[*] Starting FastAPI application on port 8000..."
exec uvicorn application:application --host 0.0.0.0 --port 8000
