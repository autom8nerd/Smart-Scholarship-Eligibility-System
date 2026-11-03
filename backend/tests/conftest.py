"""
Configuration pytest partagée : rend le dossier backend importable et
remplace MongoDB par une base en mémoire (mongomock) pour chaque test,
afin que la suite tourne sans dépendance externe (pas de serveur MongoDB requis).
"""
import os
import sys

# Permet "from application import application", "from config.parametres import ..."
# etc., exactement comme le fait application.py lui-même en exécution normale.
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# Doit être défini AVANT l'import de config.parametres (plus bas), qui lit
# ces variables une seule fois au chargement du module.
os.environ.setdefault("ADMIN_EMAIL", "admin@test.local")
os.environ.setdefault("ADMIN_PASSWORD", "mot-de-passe-de-test-1234")
os.environ.setdefault("JWT_SECRET_KEY", "cle-secrete-de-test-ne-jamais-utiliser-en-production")

import mongomock
import pytest
from fastapi.testclient import TestClient

from application import application
from utilitaires.base_donnees import GestionnaireBD


@pytest.fixture(autouse=True)
def base_donnees_en_memoire():
    """
    Remplace la connexion MongoDB réelle par une base mongomock isolée,
    recréée à zéro pour chaque test.
    """
    client_mock = mongomock.MongoClient()
    GestionnaireBD._client = client_mock
    GestionnaireBD._base_donnees = client_mock["test_admission_intelligente"]
    yield
    GestionnaireBD._client = None
    GestionnaireBD._base_donnees = None


@pytest.fixture
def client():
    """
    TestClient volontairement créé SANS "with" : cela évite de déclencher le
    lifespan startup/shutdown de l'application (qui appellerait
    initialiser_bd() et tenterait une vraie connexion MongoDB), tout en
    laissant fonctionner normalement le routage des requêtes.
    """
    return TestClient(application)


@pytest.fixture
def token_admin(client):
    """Jeton JWT admin valide, obtenu via le vrai endpoint de connexion."""
    reponse = client.post("/api/v1/auth/connexion", json={
        "email": os.environ["ADMIN_EMAIL"],
        "password": os.environ["ADMIN_PASSWORD"],
    })
    assert reponse.status_code == 200, reponse.text
    return reponse.json()["token"]
