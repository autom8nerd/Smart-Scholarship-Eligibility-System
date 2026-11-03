"""
Pydantic Data Schemas for Validation and Serialization
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, Literal
from datetime import datetime

# ============================================================================
# SCHEMAS FOR MOROCCAN EDUCATIONAL SYSTEM
# ============================================================================

class DonneesBaccalaureat(BaseModel):
    """Moroccan Baccalaureate examination data"""
    notes_regionales: float = Field(..., ge=0, le=20, description="Baccalaureate regional exam score (0-20)")
    note_generale: float = Field(..., ge=0, le=20, description="Baccalaureate general exam score (0-20)")
    option: Literal["Maths", "Physique", "SVT"] = Field(..., description="Baccalaureate track / branch")

    class Config:
        json_schema_extra = {
            "example": {
                "notes_regionales": 16.5,
                "note_generale": 17.0,
                "option": "Maths"
            }
        }


class DonneesDiplome(BaseModel):
    """Higher education diploma records (Bac+2 and above)"""
    notes_diplome: float = Field(..., ge=0, le=20, description="Higher education diploma GPA (0-20)")
    option: str = Field(..., description="Field of study specialization (e.g. Computer Science, Business)")

    class Config:
        json_schema_extra = {
            "example": {
                "notes_diplome": 15.5,
                "option": "Informatique"
            }
        }


# ============================================================================
# REQUEST INPUT SCHEMAS - Received from Client
# ============================================================================

class DonneesAcademiques(BaseModel):
    """Student academic performance metrics"""
    gpa: float = Field(..., ge=0, le=20, description="Academic GPA score (scale 0-20)")
    noteExamen: float = Field(..., ge=0, le=100, description="Standardized test score (scale 0-100)")

    class Config:
        json_schema_extra = {
            "example": {
                "gpa": 16.5,
                "noteExamen": 85
            }
        }


class DonneesFianciales(BaseModel):
    """Student household financial profile"""
    revenu: float = Field(..., ge=0, description="Annual household income (MAD)")
    dependants: int = Field(..., ge=0, le=15, description="Number of family dependents")

    class Config:
        json_schema_extra = {
            "example": {
                "revenu": 25000,
                "dependants": 3
            }
        }


class DonneesContextuelles(BaseModel):
    """Geographic and contextual indicators"""
    distance: float = Field(..., ge=0, description="Commute distance to university campus (km)")

    class Config:
        json_schema_extra = {
            "example": {
                "distance": 50.5
            }
        }


class RequeteCapaciteFinanciere(BaseModel):
    """Request payload for financial capacity score prediction"""
    donnees_academiques: DonneesAcademiques
    donnees_financieres: DonneesFianciales


class RequeteRecommandationBourse(BaseModel):
    """Request payload for scholarship tier prediction"""
    donnees_academiques: DonneesAcademiques
    donnees_financieres: DonneesFianciales


class RequeteProabiliteInscription(BaseModel):
    """Request payload for enrollment likelihood prediction"""
    donnees_academiques: DonneesAcademiques
    donnees_financieres: DonneesFianciales
    donnees_contextuelles: DonneesContextuelles


class InscriptionEtudiant(BaseModel):
    """Registration request payload for new student applicant"""
    idEtudiant: Optional[str] = None
    prenom: str = Field(..., min_length=1, description="Student first name")
    nom: str = Field(..., min_length=1, description="Student last name")
    email: str = Field(..., pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$', description="Unique student email address")
    password: str = Field(..., min_length=6, description="Account password (minimum 6 characters)")
    phone: Optional[str] = None
    address: Optional[str] = None
    annee: int = Field(..., ge=2020, le=2100, description="Academic year of admission")
    
    # Academic stage
    niveau_etude: Literal["Baccalauréat", "Bac+2", "Bac+3", "Bac+4"] = Field(..., description="Educational level attained")
    
    # Requested scholarship tier
    type_sponsorship: Literal["Full", "Partial", "Half", "None", "Complète", "Partielle", "Moitié", "Aucune"] = Field("Full", description="Requested scholarship sponsorship type")
    
    # Baccalaureate records (mandatory for all candidates)
    donnees_baccalaureat: DonneesBaccalaureat
    
    # Diploma records (optional for Bac+2 and higher)
    donnees_diplome: Optional[DonneesDiplome] = None
    
    # Financial and contextual data
    donnees_financieres: DonneesFianciales
    donnees_contextuelles: DonneesContextuelles

    class Config:
        json_schema_extra = {
            "example": {
                "prenom": "Aarav",
                "nom": "Sharma",
                "email": "aarav.sharma@example.com",
                "password": "secure_password_123",
                "phone": "+919876543210",
                "address": "Hamirpur, Himachal Pradesh, India",
                "annee": 2026,
                "niveau_etude": "Baccalauréat",
                "type_sponsorship": "Full",
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
        }


class RequeteConnexionEtudiant(BaseModel):
    """Student authentication request payload"""
    email: str = Field(..., pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$', description="Student email address")
    password: str = Field(..., min_length=1, description="Account password")


class ReponseConnexionEtudiant(BaseModel):
    """Student authentication response payload"""
    token: str
    etudiant: Dict[str, Any]


# ============================================================================
# RESPONSE SCHEMAS - Returned to Client
# ============================================================================

class ReponseCapaciteFinanciere(BaseModel):
    """Response payload for financial capacity score"""
    scoreFinancier: float = Field(..., ge=0, le=100)
    message: str
    details: Optional[Dict[str, Any]] = None


class ReponseRecommandationBourse(BaseModel):
    """Response payload for scholarship recommendation"""
    typeBourse: str
    pourcentage: int = Field(..., ge=0, le=100)
    message: str
    details: Optional[Dict[str, Any]] = None


class ReponseProabiliteInscription(BaseModel):
    """Response payload for enrollment probability"""
    probabiliteInscription: str
    confiance: float = Field(..., ge=0, le=1)
    message: str
    details: Optional[Dict[str, Any]] = None


class ResultatEtudiant(BaseModel):
    """Complete student entity result payload"""
    idEtudiant: str
    prenom: str
    nom: str
    email: str
    annee: int
    dateCreation: datetime
    dateModification: datetime
    scoreFinancier: Optional[float] = None
    typeBourse: Optional[str] = None
    pourcentageBourse: Optional[int] = None
    probabiliteInscription: Optional[str] = None
    confianceInscription: Optional[float] = None


class StatistiquesSysteme(BaseModel):
    """Aggregated system statistics payload"""
    totalEtudiants: int
    totalTraites: int
    scoreMoyenFinancier: float
    confianceMoyenneInscription: float
    distributionBourses: Dict[str, int]
    distributionProbabilites: Dict[str, int]
    tauxTraitement: float
