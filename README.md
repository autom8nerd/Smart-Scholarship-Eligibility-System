#  Smart Enrollment & Scholarship Decision Support System

[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.3+-F7931E?style=flat-square&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)

An intelligent admission and scholarship decision support system for Moroccan students, powered by Machine Learning. Ancil AI uses three independent ML models (Linear Regression, Decision Tree, and Support Vector Machine) to predict financial capacity, allocate scholarship tiers, and estimate candidate enrollment likelihood through an automated consensus-based ranking engine.

---

## 🏛 System Architecture

```
                          +-----------------------+
                          |      Client Web       |
                          |   (Browser on :3000)  |
                          +-----------+-----------+
                                      |
                                      v
                          +-----------------------+
                          |    Frontend Nginx     |
                          |  (ancil_frontend:80)  |
                          +-----+-----------+-----+
                                |           |
             Static React Assets|           | Reverse Proxy (/api/)
                                |           v
                                |   +-----------------------+
                                |   |    FastAPI Backend    |
                                |   |  (ancil_backend:8000) |
                                |   +-----------+-----------+
                                |               |
                                |               | PyMongo Connection
                                |               v
                                |   +-----------------------+
                                +-->|        MongoDB        |
                                    | (ancil_mongodb:27017) |
                                    +-----------------------+
```

---

## ⚡ Core Features

### 🧠 Machine Learning Decision Engine
- **Linear Regression**: Predicts financial capacity continuous score ($0 - 100$) utilizing GPA, national exam scores, family income, number of dependents, and geographic distance.
- **Decision Tree Classifier**: Recommends appropriate scholarship tiers (`Full`, `Half`, `Partial`, or `None`) via interpretable conditional splits.
- **Support Vector Machine (SGD Classifier)**: Computes candidate enrollment probability (`Low`, `Medium`, `High`) based on socio-academic vectors.
- **Consensus Allocation Engine**: Synthesizes multi-model predictions into a weighted consensus score ($60\%$ Academic GPA $+ 40\%$ Financial Need) respecting yearly administrative scholarship quotas.

### 🛡 Admin Portal
- Comprehensive student records management (Full CRUD with real-time approval/rejection lifecycle).
- Annual scholarship quota planning and capacity limit enforcement.
- Tri-model consensus ranking table with interactive agreement indicators.
- Live model performance metrics (Accuracy, Precision, Recall, F1-Score, Confusion Matrices, and Feature Importance).
- Multi-format data exporting (PDF summaries, PNG visualizations, CSV records).

### 🎓 Student Portal
- Step-by-step registration aligned with the Moroccan Baccalaureate educational structure.
- Instant AI recommendation insights: financial capacity breakdown, recommended scholarship tier, and enrollment probability.
- Profile dashboard with downloadable official enrollment verification certificates.

### 📽 3D Interactive Presentation
- Built-in 15-slide interactive presentation powered by Framer Motion and Recharts.
- Complete walkthrough of ML theory, data preprocessing, mathematical formulas, and live metrics.

---

## 🚀 Quickstart Guide

### Option A: Turn-Key Docker Compose (Recommended)

Run the entire containerized stack (`MongoDB`, `FastAPI backend`, `React Nginx frontend`) with a single command:

```bash
docker compose up -d
```

Verify service status:
```bash
docker compose ps
```

The stack initializes automatically:
- **Web Portal**: [http://localhost:3000](http://localhost:3000)
- **FastAPI Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **MongoDB Database**: `mongodb://localhost:27017`

To shut down:
```bash
docker compose down
```

---

### Option B: Local Native Development

#### Prerequisites
- Python 3.11+ (or `uv`)
- Node.js 18+ and npm
- Running MongoDB instance (`mongodb://localhost:27017`)

#### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (using uv or standard python)
uv venv .venv --python 3.11
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
uv pip install -r requirements.txt

# Configure environment variables
cp .env.example .env

# Verify/Train ML models (generates 30k synthetic dataset if needed)
python generate_dataset.py
python train_models.py

# Start backend server
python run_server.py
```

The API server will listen at `http://localhost:8000`.

#### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Start local React development server
npm start
```

The React web application will open at `http://localhost:3000`.

---

## ⚙️ Environment Variables

Configuration is loaded from `.env` in the root and `backend/.env`:

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `URL_MONGODB` | `mongodb://localhost:27017` | MongoDB connection URI |
| `NOM_BASE_DONNEES` | `admission_intelligente` | MongoDB database name |
| `PORT_API` | `8000` | FastAPI HTTP listener port |
| `HOTE_API` | `0.0.0.0` | API bind address |
| `ADMIN_EMAIL` | `admin@ancil.ai` | Administrator login email |
| `ADMIN_PASSWORD` | `AdminPassword2026!` | Administrator login password |
| `JWT_SECRET_KEY` | *(Generated 64-char hex)* | Secret key for JWT signing |
| `REACT_APP_API_BASE_URL` | `http://localhost:8000/api/v1` | Frontend API client base URL |
| `FRONTEND_PORT` | `3000` | Frontend port for Docker |

---

## 📊 Dataset & Model Evaluation Metrics

To guarantee $100\%$ reproducibility without external opaque data dependencies, a 30,000-student synthetic dataset is generated by [`backend/generate_dataset.py`](backend/generate_dataset.py) using a fixed seed (`SEED = 42`).

Features follow realistic empirical distributions (log-normal household income, Poisson-distributed family dependents, exponential distance, Moroccan regional weighting), enriched with calibrated Gaussian noise to simulate real-world admissions complexities.

### Model Performance (30,000-Row Dataset, 80/20 Train/Test Split)

| Model Architecture | Target Variable | Evaluation Metric | Empirical Value |
| :--- | :--- | :--- | :--- |
| **Linear Regression** | Financial Capacity Score ($0 - 100$) | $R^2$ Score | `0.285` |
| | | RMSE | `12.14` |
| | | MAE | `9.67` |
| **Decision Tree** | Scholarship Tier (4 classes) | Accuracy | `46.5%` |
| | | Weighted F1 | `0.432` |
| **SGD Classifier ("SVM")** | Enrollment Probability (3 classes) | Accuracy | `46.9%` |
| | | Weighted F1 | `0.411` |

*Note: The SGD Classifier applies a persistent `StandardScaler` fitted concurrently during training to guarantee optimal hyperplane margin convergence.*

---

## 🧪 Automated Testing

Run the automated test suite covering authentication, student CRUD, prediction endpoints, ML consensus ranking, and quota limits:

```bash
pytest backend/tests/test_complet.py -v
```

All 17 integration and unit tests utilize an isolated in-memory MongoDB mock (`mongomock`), allowing the full suite to run seamlessly without an active external database daemon.

---

## 📖 Technical Documentation

- [Technical System Documentation](docs/DOCUMENTATION.md) — Comprehensive architecture, UML sequence flows, mathematical formulations, and component diagrams.
- [Presentation Guide](docs/PRESENTATION_README.md) — Walkthrough of the in-app 15-slide interactive presentation suite.
- [Implementation Specifications](IMPLEMENTATION.md) — Codebase translation and containerization progress ledger.

---

## 📄 License

Academic Project — *Smart Enrollment & Scholarship Decision Support System* (Academic Year 2025–2026).
