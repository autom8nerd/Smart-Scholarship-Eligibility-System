"""
API Endpoints for Student Management
Handles registration, authentication, querying, updating, and lifecycle approvals.
"""
import logging
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
import uuid
from datetime import datetime
from api.schemas import InscriptionEtudiant, ResultatEtudiant, RequeteConnexionEtudiant
from utilitaires.base_donnees import GestionnaireBD
from utilitaires.securite import exiger_role_admin
from passlib.context import CryptContext

logger = logging.getLogger(__name__)

# Password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# MongoDB projection to strip password hash on query responses
PROJECTION_SANS_MOT_DE_PASSE = {"motDePasse": 0}

# Create router with /api/v1/etudiants prefix
routeur_etudiants = APIRouter(
    prefix="/api/v1/etudiants",
    tags=["Student Management"],
    responses={404: {"description": "Student not found"}}
)


@routeur_etudiants.post("/enregistrer", response_model=ResultatEtudiant)
async def enregistrer_etudiant(etudiant: InscriptionEtudiant):
    """
    Register a new student applicant in the system.
    
    Generates a unique ID and persists candidate records in MongoDB.
    
    Validations:
    - Unique email per academic year
    - Valid academic and financial feature objects
    
    Args:
        etudiant: Complete student registration payload
        
    Returns:
        ResultatEtudiant: Created student entity with assigned ID and timestamps
        
    Raises:
        HTTPException 400: Email already registered for the specified academic year
        HTTPException 500: Internal server error during registration
    """
    try:
        collection_etudiants = GestionnaireBD.obtenir_collection_etudiants()
        
        # Check if email is already registered for this academic year
        inscription_existante = collection_etudiants.find_one({
            "email": etudiant.email,
            "annee": etudiant.annee
        })
        
        if inscription_existante:
            raise HTTPException(
                status_code=400,
                detail=f"A student with email ({etudiant.email}) is already registered for academic year {etudiant.annee}. Only one registration per year is allowed."
            )
        
        # Generate unique student ID if not provided
        id_etudiant = etudiant.idEtudiant or str(uuid.uuid4())
        maintenant = datetime.utcnow()
        
        # Hash password before storage
        mot_de_passe_hache = pwd_context.hash(etudiant.password)
        
        # Prepare document for MongoDB
        document_etudiant = {
            "idEtudiant": id_etudiant,
            "prenom": etudiant.prenom,
            "nom": etudiant.nom,
            "email": etudiant.email,
            "phone": etudiant.phone,
            "address": etudiant.address,
            "motDePasse": mot_de_passe_hache,
            "annee": etudiant.annee,
            "niveau_etude": etudiant.niveau_etude,
            "donnees_baccalaureat": etudiant.donnees_baccalaureat.dict(),
            "donnees_diplome": etudiant.donnees_diplome.dict() if etudiant.donnees_diplome else None,
            "donnees_financieres": etudiant.donnees_financieres.dict(),
            "donnees_contextuelles": etudiant.donnees_contextuelles.dict(),
            "type_sponsorship": etudiant.type_sponsorship,
            "statut": "En attente",
            "dateCreation": maintenant,
            "dateModification": maintenant
        }
        
        collection_etudiants.insert_one(document_etudiant)
        
        return {
            "idEtudiant": id_etudiant,
            "prenom": etudiant.prenom,
            "nom": etudiant.nom,
            "email": etudiant.email,
            "phone": etudiant.phone,
            "address": etudiant.address,
            "annee": etudiant.annee,
            "niveau_etude": etudiant.niveau_etude,
            "donnees_baccalaureat": etudiant.donnees_baccalaureat.dict(),
            "donnees_diplome": etudiant.donnees_diplome.dict() if etudiant.donnees_diplome else None,
            "donnees_financieres": etudiant.donnees_financieres.dict(),
            "donnees_contextuelles": etudiant.donnees_contextuelles.dict(),
            "type_sponsorship": etudiant.type_sponsorship,
            "statut": "En attente",
            "dateCreation": maintenant,
            "dateModification": maintenant
        }
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error registering student record")
        raise HTTPException(status_code=500, detail="Internal server error")


@routeur_etudiants.get("/")
async def lister_etudiants(saut: int = 0, limite: int = 10):
    """
    Retrieve paginated list of registered students.
    
    Args:
        saut: Document offset skip count
        limite: Maximum document return count
        
    Returns:
        dict: Total count, skip, limit, and student records list
    """
    try:
        collection_etudiants = GestionnaireBD.obtenir_collection_etudiants()
        
        etudiants = list(
            collection_etudiants.find({}, PROJECTION_SANS_MOT_DE_PASSE)
        )
        
        for etudiant in etudiants:
            etudiant['_id'] = str(etudiant['_id'])
        
        return {
            "total": collection_etudiants.count_documents({}),
            "saut": saut,
            "limite": limite,
            "etudiants": etudiants
        }
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error retrieving student records")
        raise HTTPException(status_code=500, detail="Internal server error")


@routeur_etudiants.post("/connexion")
async def connexion_etudiant(requete: RequeteConnexionEtudiant):
    """
    Authenticate a student using email and password.
    
    Args:
        requete: Student email and password
        
    Returns:
        dict: Access token and student profile data
        
    Raises:
        HTTPException 401: Invalid credentials
    """
    try:
        collection_etudiants = GestionnaireBD.obtenir_collection_etudiants()
        
        etudiant = collection_etudiants.find_one({"email": requete.email})
        
        if not etudiant:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )
        
        if not pwd_context.verify(requete.password, etudiant.get("motDePasse", "")):
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        token = "student-token-" + str(uuid.uuid4())

        etudiant['_id'] = str(etudiant['_id'])
        etudiant.pop("motDePasse", None)

        return {
            "token": token,
            "etudiant": etudiant
        }
        
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error during student authentication")
        raise HTTPException(status_code=500, detail="Internal server error")


@routeur_etudiants.get("/connexion/verifier/{email}")
async def verifier_etudiant(email: str):
    """
    Verify student record existence by email address.
    
    Args:
        email: Student email to query
        
    Returns:
        dict: Student entity data or 404
    """
    try:
        collection_etudiants = GestionnaireBD.obtenir_collection_etudiants()
        
        etudiant = collection_etudiants.find_one({"email": email}, PROJECTION_SANS_MOT_DE_PASSE)

        if not etudiant:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

        etudiant['_id'] = str(etudiant['_id'])
        return etudiant

    except HTTPException:
        raise
    except Exception:
        logger.exception("Error verifying student record")
        raise HTTPException(status_code=500, detail="Internal server error")


@routeur_etudiants.get("/{id_etudiant}")
async def recuperer_etudiant(id_etudiant: str):
    """
    Retrieve specific student details by unique identifier.
    
    Args:
        id_etudiant: Unique student ID
        
    Returns:
        dict: Complete student entity
    """
    try:
        collection_etudiants = GestionnaireBD.obtenir_collection_etudiants()
        etudiant = collection_etudiants.find_one({"idEtudiant": id_etudiant}, PROJECTION_SANS_MOT_DE_PASSE)

        if not etudiant:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

        etudiant['_id'] = str(etudiant['_id'])
        return etudiant
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error fetching student record")
        raise HTTPException(status_code=500, detail="Internal server error")


@routeur_etudiants.put("/{id_etudiant}")
async def mettre_a_jour_etudiant(id_etudiant: str, donnees: dict):
    """
    Update student record fields.
    
    Args:
        id_etudiant: Unique student ID
        donnees: Updated dictionary attributes
        
    Returns:
        dict: Updated student record
    """
    try:
        collection_etudiants = GestionnaireBD.obtenir_collection_etudiants()
        
        etudiant = collection_etudiants.find_one({"idEtudiant": id_etudiant})
        if not etudiant:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )
        
        donnees["dateModification"] = datetime.utcnow()
        
        result = collection_etudiants.update_one(
            {"idEtudiant": id_etudiant},
            {"$set": donnees}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=400,
                detail="No modifications performed"
            )
        
        etudiant_mis_a_jour = collection_etudiants.find_one({"idEtudiant": id_etudiant}, PROJECTION_SANS_MOT_DE_PASSE)
        etudiant_mis_a_jour['_id'] = str(etudiant_mis_a_jour['_id'])
        return etudiant_mis_a_jour
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error updating student record")
        raise HTTPException(status_code=500, detail="Internal server error")


@routeur_etudiants.delete("/{id_etudiant}")
async def supprimer_etudiant(id_etudiant: str, utilisateur_admin: dict = Depends(exiger_role_admin)):
    """
    Delete student record from database (Administrator only).
    
    Args:
        id_etudiant: Unique student ID
        
    Returns:
        dict: Deletion confirmation message
    """
    try:
        collection_etudiants = GestionnaireBD.obtenir_collection_etudiants()
        
        result = collection_etudiants.delete_one({"idEtudiant": id_etudiant})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )
        
        return {"message": "Student successfully deleted"}
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error deleting student record")
        raise HTTPException(status_code=500, detail="Internal server error")


@routeur_etudiants.patch("/{id_etudiant}/approuver")
async def approuver_etudiant(id_etudiant: str, utilisateur_admin: dict = Depends(exiger_role_admin)):
    """
    Approve student scholarship application (Administrator only).
    
    Args:
        id_etudiant: Unique student ID
        
    Returns:
        dict: Approved student entity
    """
    try:
        collection_etudiants = GestionnaireBD.obtenir_collection_etudiants()
        
        result = collection_etudiants.update_one(
            {"idEtudiant": id_etudiant},
            {
                "$set": {
                    "statut": "Approuvé",
                    "dateModification": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )
        
        etudiant = collection_etudiants.find_one({"idEtudiant": id_etudiant}, PROJECTION_SANS_MOT_DE_PASSE)
        etudiant['_id'] = str(etudiant['_id'])
        return etudiant
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error approving student application")
        raise HTTPException(status_code=500, detail="Internal server error")


@routeur_etudiants.patch("/{id_etudiant}/rejeter")
async def rejeter_etudiant(id_etudiant: str, utilisateur_admin: dict = Depends(exiger_role_admin)):
    """
    Reject student scholarship application (Administrator only).
    
    Args:
        id_etudiant: Unique student ID
        
    Returns:
        dict: Rejected student entity
    """
    try:
        collection_etudiants = GestionnaireBD.obtenir_collection_etudiants()
        
        result = collection_etudiants.update_one(
            {"idEtudiant": id_etudiant},
            {
                "$set": {
                    "statut": "Rejeté",
                    "dateModification": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )
        
        etudiant = collection_etudiants.find_one({"idEtudiant": id_etudiant}, PROJECTION_SANS_MOT_DE_PASSE)
        etudiant['_id'] = str(etudiant['_id'])
        return etudiant
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error rejecting student application")
        raise HTTPException(status_code=500, detail="Internal server error")
