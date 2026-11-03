"""
Suite de tests pytest pour l'API du système d'admission intelligent

Utilise une base MongoDB en mémoire (mongomock, cf. conftest.py) : aucun
serveur MongoDB réel n'est nécessaire pour exécuter ces tests.

Lancer avec: pytest backend/tests/test_complet.py -v
"""
import os


DONNEES_ETUDIANT_VALIDE = {
    "prenom": "Ahmed",
    "nom": "Hassan",
    "email": "ahmed.hassan@example.com",
    "password": "motdepasse123",
    "phone": "+212612345678",
    "address": "Casablanca, Morocco",
    "annee": 2026,
    "niveau_etude": "Baccalauréat",
    "type_sponsorship": "Partielle",
    "donnees_baccalaureat": {
        "notes_regionales": 16.5,
        "note_generale": 17.0,
        "option": "Maths"
    },
    "donnees_financieres": {
        "revenu": 25000,
        "dependants": 3
    },
    "donnees_contextuelles": {
        "distance": 50.5
    }
}


# ============================================================================
# ENDPOINTS DE BASE
# ============================================================================

def test_racine_retourne_200(client):
    reponse = client.get("/")
    assert reponse.status_code == 200


def test_sante_retourne_200(client):
    reponse = client.get("/sante")
    assert reponse.status_code == 200


# ============================================================================
# INSCRIPTION ÉTUDIANT
# ============================================================================

def test_inscription_etudiant_reussie(client):
    reponse = client.post("/api/v1/etudiants/enregistrer", json=DONNEES_ETUDIANT_VALIDE)
    assert reponse.status_code == 200
    corps = reponse.json()
    assert corps["email"] == DONNEES_ETUDIANT_VALIDE["email"]
    assert "motDePasse" not in corps


def test_inscription_email_deja_utilise_meme_annee_retourne_400(client):
    client.post("/api/v1/etudiants/enregistrer", json=DONNEES_ETUDIANT_VALIDE)
    reponse = client.post("/api/v1/etudiants/enregistrer", json=DONNEES_ETUDIANT_VALIDE)
    assert reponse.status_code == 400


# ============================================================================
# CONNEXION ÉTUDIANT
# ============================================================================

def test_connexion_etudiant_reussie(client):
    client.post("/api/v1/etudiants/enregistrer", json=DONNEES_ETUDIANT_VALIDE)

    reponse = client.post("/api/v1/etudiants/connexion", json={
        "email": DONNEES_ETUDIANT_VALIDE["email"],
        "password": DONNEES_ETUDIANT_VALIDE["password"]
    })

    assert reponse.status_code == 200
    corps = reponse.json()
    assert "token" in corps
    assert "motDePasse" not in corps["etudiant"]


def test_connexion_etudiant_mauvais_mot_de_passe_retourne_401(client):
    client.post("/api/v1/etudiants/enregistrer", json=DONNEES_ETUDIANT_VALIDE)

    reponse = client.post("/api/v1/etudiants/connexion", json={
        "email": DONNEES_ETUDIANT_VALIDE["email"],
        "password": "mauvais_mot_de_passe"
    })

    assert reponse.status_code == 401


def test_connexion_etudiant_inexistant_retourne_401(client):
    reponse = client.post("/api/v1/etudiants/connexion", json={
        "email": "personne@example.com",
        "password": "peu-importe"
    })
    assert reponse.status_code == 401


# ============================================================================
# AUTHENTIFICATION ADMIN
# ============================================================================

def test_connexion_admin_reussie(client):
    reponse = client.post("/api/v1/auth/connexion", json={
        "email": os.environ["ADMIN_EMAIL"],
        "password": os.environ["ADMIN_PASSWORD"]
    })

    assert reponse.status_code == 200
    corps = reponse.json()
    assert "token" in corps
    assert corps["role"] == "admin"


def test_connexion_admin_mauvais_mot_de_passe_retourne_401(client):
    reponse = client.post("/api/v1/auth/connexion", json={
        "email": os.environ["ADMIN_EMAIL"],
        "password": "mauvais_mot_de_passe"
    })
    assert reponse.status_code == 401


# ============================================================================
# AUTORISATION SUR LES ENDPOINTS ADMIN
# ============================================================================

def test_endpoint_admin_sans_token_retourne_401(client):
    reponse = client.delete("/api/v1/etudiants/un-id-quelconque")
    assert reponse.status_code == 401


def test_endpoint_admin_avec_token_invalide_retourne_401(client):
    reponse = client.delete(
        "/api/v1/etudiants/un-id-quelconque",
        headers={"Authorization": "Bearer ceci-nest-pas-un-jwt-valide"}
    )
    assert reponse.status_code == 401


def test_endpoint_admin_avec_token_valide_reussit(client, token_admin):
    inscription = client.post("/api/v1/etudiants/enregistrer", json=DONNEES_ETUDIANT_VALIDE)
    id_etudiant = inscription.json()["idEtudiant"]

    reponse = client.delete(
        f"/api/v1/etudiants/{id_etudiant}",
        headers={"Authorization": f"Bearer {token_admin}"}
    )

    assert reponse.status_code == 200


def test_approuver_etudiant_sans_token_retourne_401(client):
    reponse = client.patch("/api/v1/etudiants/un-id-quelconque/approuver")
    assert reponse.status_code == 401


def test_approuver_etudiant_avec_token_valide_reussit(client, token_admin):
    inscription = client.post("/api/v1/etudiants/enregistrer", json=DONNEES_ETUDIANT_VALIDE)
    id_etudiant = inscription.json()["idEtudiant"]

    reponse = client.patch(
        f"/api/v1/etudiants/{id_etudiant}/approuver",
        headers={"Authorization": f"Bearer {token_admin}"}
    )

    assert reponse.status_code == 200
    assert reponse.json()["statut"] == "Approuvé"


# ============================================================================
# PRÉDICTIONS ML
# ============================================================================

def test_prediction_capacite_financiere(client):
    reponse = client.post("/api/v1/predictions/capacite-financiere", json={
        "donnees_academiques": {"gpa": 16, "noteExamen": 85},
        "donnees_financieres": {"revenu": 25000, "dependants": 2}
    })

    assert reponse.status_code == 200
    assert 0 <= reponse.json()["scoreFinancier"] <= 100


def test_prediction_gpa_invalide_retourne_422(client):
    reponse = client.post("/api/v1/predictions/capacite-financiere", json={
        "donnees_academiques": {"gpa": 25, "noteExamen": 85},  # GPA > 20, invalide
        "donnees_financieres": {"revenu": 25000, "dependants": 2}
    })
    assert reponse.status_code == 422


def test_prediction_parametres_manquants_retourne_422(client):
    reponse = client.post("/api/v1/predictions/capacite-financiere", json={
        "donnees_academiques": {"gpa": 16}
        # donnees_financieres manquant
    })
    assert reponse.status_code == 422
