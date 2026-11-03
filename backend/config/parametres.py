"""
Centralized Configuration Settings for Smart Scholarship Decision Support System
Contains application constants, environment variables, and model configurations.
"""
import os
import secrets
from dotenv import load_dotenv

# Load environment variables from .env (checks cwd, backend dir, and root repo dir)
load_dotenv()
_backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(_backend_dir, ".env"))
load_dotenv(os.path.join(os.path.dirname(_backend_dir), ".env"))

# ============================================================================
# DATABASE CONFIGURATION
# ============================================================================
URL_MONGODB = os.getenv("URL_MONGODB", "mongodb://localhost:27017")
NOM_BASE_DONNEES = os.getenv("NOM_BASE_DONNEES", "admission_intelligente")

# ============================================================================
# FASTAPI API CONFIGURATION
# ============================================================================
HOTE_API = os.getenv("HOTE_API", "0.0.0.0")
PORT_API = int(os.getenv("PORT_API", 8000))
ENVIRONNEMENT_FASTAPI = os.getenv("ENVIRONNEMENT_FASTAPI", "developpement")
RECHARGER_SERVEUR = ENVIRONNEMENT_FASTAPI == "developpement"

# ============================================================================
# DIRECTORY PATHS
# ============================================================================
# REPERTOIRE_RACINE points to the backend directory
REPERTOIRE_RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHEMIN_MODELES_ENTRAINES = os.path.join(REPERTOIRE_RACINE, "modeles_entraines")
CHEMIN_DONNEES = os.path.join(REPERTOIRE_RACINE, "donnees")

# Ensure required directories exist
os.makedirs(CHEMIN_MODELES_ENTRAINES, exist_ok=True)
os.makedirs(CHEMIN_DONNEES, exist_ok=True)

# ============================================================================
# CORS CONFIGURATION - Whitelist client origins
# ============================================================================
# Explicit origins whitelist - never use "*" here when allow_credentials=True
ORIGINES_AUTORISEES = [
    "http://localhost:3000",      # React dev server
    "http://localhost:8080",      # Alternative port
    "http://localhost:5000",      # Alternative backend port
    "http://127.0.0.1:3000",      # Localhost loopback
]

# In production, specify CORS_ORIGINES_SUPPLEMENTAIRES in .env
_origines_supplementaires = os.getenv("CORS_ORIGINES_SUPPLEMENTAIRES", "")
if _origines_supplementaires:
    ORIGINES_AUTORISEES.extend(
        origine.strip() for origine in _origines_supplementaires.split(",") if origine.strip()
    )

# ============================================================================
# ADMIN AUTHENTICATION AND JWT CONFIGURATION
# ============================================================================
# Admin credentials configured via environment variables
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
if not ADMIN_EMAIL or not ADMIN_PASSWORD:
    print(
        "[⚠] ADMIN_EMAIL / ADMIN_PASSWORD not configured in environment: "
        "Administrator authentication is disabled until credentials are provided."
    )

JWT_ALGORITHME = "HS256"
JWT_DUREE_VALIDITE_MINUTES = 480  # 8 hours

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not JWT_SECRET_KEY:
    JWT_SECRET_KEY = secrets.token_hex(32)
    print(
        "[⚠] JWT_SECRET_KEY not set in environment: Generated ephemeral development secret key. "
        "All emitted tokens will invalidate upon process restart. Set JWT_SECRET_KEY in production."
    )

# ============================================================================
# PAGINATION CONFIGURATION
# ============================================================================
SAUT_PAR_DEFAUT = 0              # Default offset skip
LIMITE_PAR_DEFAUT = 10           # Default page limit
LIMITE_MAX = 100                 # Maximum items limit

# ============================================================================
# LOGGING CONFIGURATION
# ============================================================================
NIVEAU_JOURNAL = os.getenv("NIVEAU_JOURNAL", "INFO")
FORMAT_JOURNAL = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

# ============================================================================
# APPLICATION METADATA
# ============================================================================
NOM_APP = "Smart Enrollment & Scholarship Decision Support System"
VERSION_APP = "1.0.0"
DESCRIPTION_APP = "Intelligent admissions and scholarship allocation engine powered by machine learning to predict financial need, recommend scholarship tiers, and evaluate enrollment likelihood."

# ============================================================================
# MACHINE LEARNING MODEL CONFIGURATIONS
# ============================================================================

# Linear Regression - Financial capacity scoring
CONFIG_REGRESSION_LINEAIRE = {
    "nom_modele": "Linear Regression",
    "description": "Prediction of applicant financial capacity and socioeconomic need",
    "caracteristiques_entree": ["GPA", "Exam Score", "Family Income", "Dependents"],
    "plage_sortie": (0, 100),
    "unite_sortie": "score",
    "metrique_precision": "RMSE",
    "fichier_modele": "modele_regression_lineaire.pkl"
}

# Decision Tree - Scholarship tier allocation
CONFIG_ARBRE_DECISION = {
    "nom_modele": "Decision Tree Classifier",
    "description": "Recommendation of scholarship tier and sponsorship coverage",
    "caracteristiques_entree": ["GPA", "Family Income", "Dependents"],
    "profondeur_max": 5,
    "echantillons_min_division": 10,
    "echantillons_min_feuille": 5,
    "classes_sortie": {
        0: {"nom": "No Scholarship", "pourcentage": 0},
        1: {"nom": "Partial Scholarship (25%)", "pourcentage": 25},
        2: {"nom": "Half Scholarship (50%)", "pourcentage": 50},
        3: {"nom": "Full Scholarship (100%)", "pourcentage": 100}
    },
    "metrique_precision": "Accuracy",
    "fichier_modele": "modele_arbre_decision.pkl"
}

# Support Vector Machine - Enrollment likelihood estimation
CONFIG_SVM = {
    "nom_modele": "Support Vector Machine (SVM / SGDClassifier)",
    "description": "Prediction of candidate matriculation and enrollment likelihood",
    "caracteristiques_entree": ["GPA", "Exam Score", "Family Income", "Commute Distance"],
    "noyau": "rbf",
    "gamma": "scale",
    "classes_sortie": {
        0: {"nom": "Low Probability", "intervalle": (0.0, 0.33)},
        1: {"nom": "Medium Probability", "intervalle": (0.33, 0.67)},
        2: {"nom": "High Probability", "intervalle": (0.67, 1.0)}
    },
    "metrique_precision": "Accuracy",
    "fichier_modele": "modele_svm.pkl"
}

# ============================================================================
# INPUT DATA VALIDATION BOUNDS
# ============================================================================
VALIDATION_GPA = {
    "min": 0.0,
    "max": 10.0,
    "description": "Academic GPA / CGPA score (scale 0 to 10)"
}

VALIDATION_EXAMEN = {
    "min": 0,
    "max": 100,
    "description": "Standardized exam score (scale 0 to 100)"
}

VALIDATION_REVENU = {
    "min": 0,
    "description": "Annual household income (must be non-negative)"
}

VALIDATION_DEPENDANTS = {
    "min": 0,
    "max": 15,
    "description": "Number of family dependents (0 to 15)"
}

VALIDATION_DISTANCE = {
    "min": 0,
    "description": "Commute distance to campus in km (must be non-negative)"
}

# ============================================================================
# MESSAGES AND RESPONSES
# ============================================================================
MESSAGES_SUCCES = {
    "modele_charge": "ML model loaded successfully",
    "prediction_complete": "Prediction generated successfully",
    "etudiant_enregistre": "Student record registered successfully",
    "base_donnees_connectee": "Connected to MongoDB database"
}

MESSAGES_ERREUR = {
    "modele_non_charge": "Machine learning model could not be loaded",
    "parametres_invalides": "Invalid input parameters",
    "base_donnees_indisponible": "Database service is unavailable",
    "etudiant_non_trouve": "Student record not found",
    "erreur_interne": "Internal server error occurred"
}
