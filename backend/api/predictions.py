"""
API Endpoints for Machine Learning Predictions
Provides predictions for financial capacity, scholarship tier recommendations, and enrollment probability.
"""
import logging
from fastapi import APIRouter, HTTPException
from datetime import datetime
import uuid
from typing import Dict, Any
from api.schemas import (
    RequeteCapaciteFinanciere, ReponseCapaciteFinanciere,
    RequeteRecommandationBourse, ReponseRecommandationBourse,
    RequeteProabiliteInscription, ReponseProabiliteInscription
)
from modeles.regression_lineaire import modele_regression
from modeles.arbre_decision import modele_arbre
from modeles.svm import modele_svm
from utilitaires.base_donnees import GestionnaireBD

logger = logging.getLogger(__name__)

routeur_predictions = APIRouter(
    prefix="/api/v1/predictions",
    tags=["ML Predictions"]
)


@routeur_predictions.post("/capacite-financiere", response_model=ReponseCapaciteFinanciere)
async def predire_capacite_financiere(requete: RequeteCapaciteFinanciere):
    """
    Predict an applicant's financial capacity score.
    
    Uses trained Linear Regression model to estimate the candidate's
    financial capacity index on a scale of 0-100.
    
    Args:
        requete: Academic GPA and household financial data
        
    Returns:
        ReponseCapaciteFinanciere: Continuous score (0-100) and explanatory description
    """
    try:
        caracteristiques = [
            requete.donnees_academiques.gpa,
            requete.donnees_academiques.noteExamen,
            requete.donnees_financieres.revenu,
            requete.donnees_financieres.dependants
        ]
        
        score = modele_regression.predire(caracteristiques)
        
        if score >= 75:
            message = "High Financial Capacity — Self-sufficient economic profile"
        elif score >= 50:
            message = "Moderate Financial Capacity — Stable economic situation"
        elif score >= 25:
            message = "Limited Financial Capacity — Financial support advised"
        else:
            message = "Very Low Financial Capacity — High priority financial assistance recommended"
        
        try:
            collection_predictions = GestionnaireBD.obtenir_collection_predictions()
            collection_predictions.insert_one({
                "id_prediction": str(uuid.uuid4()),
                "type_prediction": "capacite_financiere",
                "donnees_entree": requete.dict(),
                "resultat": score,
                "message": message,
                "date_creation": datetime.utcnow()
            })
        except Exception as e:
            logger.warning(f"Failed to persist financial capacity prediction: {e}")
        
        return {
            "scoreFinancier": round(score, 2),
            "message": message,
            "details": {
                "gpa": requete.donnees_academiques.gpa,
                "noteExamen": requete.donnees_academiques.noteExamen,
                "revenu": requete.donnees_financieres.revenu,
                "dependants": requete.donnees_financieres.dependants
            }
        }
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error during financial capacity prediction")
        raise HTTPException(status_code=500, detail="Internal server error")


@routeur_predictions.post("/recommandation-bourse", response_model=ReponseRecommandationBourse)
async def predire_recommandation_bourse(requete: RequeteRecommandationBourse):
    """
    Recommend appropriate scholarship tier and coverage percentage.
    
    Uses trained Decision Tree model to classify candidates based on
    academic performance thresholds and financial burden.
    
    Args:
        requete: Academic GPA, family income, and dependent count
        
    Returns:
        ReponseRecommandationBourse: Recommended scholarship tier and coverage percentage
    """
    try:
        caracteristiques = [
            requete.donnees_academiques.gpa,
            requete.donnees_financieres.revenu,
            requete.donnees_financieres.dependants
        ]
        
        classe_bourse = modele_arbre.predire(caracteristiques)
        
        types_bourses = {
            0: {"nom": "No Scholarship", "pourcentage": 0},
            1: {"nom": "Partial Scholarship (25%)", "pourcentage": 25},
            2: {"nom": "Half Scholarship (50%)", "pourcentage": 50},
            3: {"nom": "Full Scholarship (100%)", "pourcentage": 100}
        }
        
        recommandation = types_bourses.get(classe_bourse, types_bourses[0])
        
        message = f"Recommendation: {recommandation['nom']} based on GPA ({requete.donnees_academiques.gpa}), income (₹{requete.donnees_financieres.revenu}), and dependents ({requete.donnees_financieres.dependants})"
        
        try:
            collection_predictions = GestionnaireBD.obtenir_collection_predictions()
            collection_predictions.insert_one({
                "id_prediction": str(uuid.uuid4()),
                "type_prediction": "recommandation_bourse",
                "donnees_entree": requete.dict(),
                "type_bourse": recommandation['nom'],
                "pourcentage": recommandation['pourcentage'],
                "date_creation": datetime.utcnow()
            })
        except Exception as e:
            logger.warning(f"Failed to persist scholarship recommendation: {e}")
        
        return {
            "typeBourse": recommandation['nom'],
            "pourcentage": recommandation['pourcentage'],
            "message": message,
            "details": {
                "gpa": requete.donnees_academiques.gpa,
                "revenu": requete.donnees_financieres.revenu,
                "dependants": requete.donnees_financieres.dependants
            }
        }
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error during scholarship recommendation prediction")
        raise HTTPException(status_code=500, detail="Internal server error")


@routeur_predictions.post("/probabilite-inscription", response_model=ReponseProabiliteInscription)
async def predire_probabilite_inscription(requete: RequeteProabiliteInscription):
    """
    Predict candidate matriculation and enrollment likelihood.
    
    Uses trained SVM / SGDClassifier to classify enrollment likelihood
    with confidence margin.
    
    Args:
        requete: Academic scores, family income, and commute distance
        
    Returns:
        ReponseProabiliteInscription: Probability tier and confidence rating
    """
    try:
        caracteristiques = [
            requete.donnees_academiques.gpa,
            requete.donnees_academiques.noteExamen,
            requete.donnees_financieres.revenu,
            requete.donnees_contextuelles.distance
        ]
        
        prediction = modele_svm.predire(caracteristiques)
        
        niveaux = {
            0: "Low Probability",
            1: "Medium Probability",
            2: "High Probability"
        }
        
        niveau = niveaux.get(prediction['classe'], "Unknown Probability")
        confiance = prediction.get('confiance', 0.5)
        
        message = f"Enrollment prediction confidence: {confiance*100:.1f}%"
        
        try:
            collection_predictions = GestionnaireBD.obtenir_collection_predictions()
            collection_predictions.insert_one({
                "id_prediction": str(uuid.uuid4()),
                "type_prediction": "probabilite_inscription",
                "donnees_entree": requete.dict(),
                "niveau": niveau,
                "confiance": confiance,
                "date_creation": datetime.utcnow()
            })
        except Exception as e:
            logger.warning(f"Failed to persist enrollment prediction: {e}")
        
        return {
            "probabiliteInscription": niveau,
            "confiance": round(confiance, 3),
            "message": message,
            "details": {
                "gpa": requete.donnees_academiques.gpa,
                "noteExamen": requete.donnees_academiques.noteExamen,
                "revenu": requete.donnees_financieres.revenu,
                "distance": requete.donnees_contextuelles.distance
            }
        }
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error during enrollment probability prediction")
        raise HTTPException(status_code=500, detail="Internal server error")


@routeur_predictions.get("/etudiant/{id_etudiant}/recommandations")
async def obtenir_recommandations_etudiant(id_etudiant: str) -> Dict[str, Any]:
    """
    Compute comprehensive tri-model AI recommendations for designated student candidate.
    
    Aggregates profile attributes and runs all 3 ML models to deliver
    an integrated decision support evaluation.
    
    Args:
        id_etudiant: Unique student ID
        
    Returns:
        Dict containing financial capacity, scholarship tier, enrollment likelihood, and synthesis
    """
    try:
        collection_etudiants = GestionnaireBD.obtenir_collection_etudiants()
        etudiant = collection_etudiants.find_one({"idEtudiant": id_etudiant})
        
        if not etudiant:
            raise HTTPException(
                status_code=404,
                detail=f"Student with ID {id_etudiant} not found"
            )
        
        donnees_baccalaureat = etudiant.get("donnees_baccalaureat", {})
        donnees_diplome = etudiant.get("donnees_diplome", {})
        donnees_financieres = etudiant.get("donnees_financieres", {})
        donnees_contextuelles = etudiant.get("donnees_contextuelles", {})
        
        if donnees_baccalaureat:
            note_regionale = float(donnees_baccalaureat.get("notes_regionales", 0) or 0)
            note_generale = float(donnees_baccalaureat.get("note_generale", 0) or 0)
            note_diplome = float(donnees_diplome.get("notes_diplome", 0) or 0) if donnees_diplome else 0
        else:
            note_regionale = float(etudiant.get("notes_regionales", 0) or 0)
            note_generale = float(etudiant.get("note_generale", 0) or 0)
            note_diplome = float(etudiant.get("notes_diplome", 0) or 0)
        
        gpa = (note_regionale + note_generale) / 2
        note_examen = note_diplome if note_diplome > 0 else note_generale
        
        if donnees_financieres:
            revenu = float(donnees_financieres.get("revenu", 0) or 0)
            dependants = int(donnees_financieres.get("dependants", 0) or 0)
        else:
            revenu = float(etudiant.get("revenu", 0) or 0)
            dependants = int(etudiant.get("dependants", 0) or 0)
        
        if donnees_contextuelles:
            distance = float(donnees_contextuelles.get("distance", 0) or 0)
        else:
            distance = float(etudiant.get("distance", 0) or 0)
        
        # 1. Financial capacity scoring
        caracteristiques_financieres = [gpa, note_examen, revenu, dependants, distance]
        score_financier = modele_regression.predire(caracteristiques_financieres)
        
        niveaux_capacite = {
            (0, 30): ("Low Capacity", "Student requires substantial financial assistance"),
            (30, 60): ("Moderate Capacity", "Student would benefit from partial financial aid"),
            (60, 100): ("High Capacity", "Student demonstrates solid financial self-sufficiency")
        }
        
        niveau_capacite = "Moderate Capacity"
        message_capacite = "Standard financial capacity profile"
        for (min_val, max_val), (niveau, msg) in niveaux_capacite.items():
            if min_val <= score_financier < max_val:
                niveau_capacite = niveau
                message_capacite = msg
                break
        
        # 2. Scholarship tier recommendation
        caracteristiques_bourse = [gpa, note_examen, revenu, dependants, distance]
        prediction_bourse = modele_arbre.predire(caracteristiques_bourse)
        
        types_bourse = {
            0: ("None", 0, "Academic profile or family income does not warrant scholarship aid"),
            1: ("Partial", 2500, "Partial scholarship (25%) recommended for minimal assistance"),
            2: ("Half", 5000, "Half scholarship (50%) recommended for moderate assistance"),
            3: ("Full", 10000, "Full scholarship (100%) recommended — high priority candidate")
        }
        
        type_bourse, montant_bourse, message_bourse = types_bourse.get(
            prediction_bourse,
            ("None", 0, "Scholarship tier undetermined")
        )
        
        # 3. Enrollment likelihood prediction
        caracteristiques_inscription = [gpa, note_examen, revenu, dependants, distance]
        resultat_svm = modele_svm.predire(caracteristiques_inscription)
        prediction_inscription = resultat_svm['classe']
        confiance_inscription = resultat_svm['confiance']
        
        niveaux_proba = {
            0: "Low (< 50%)",
            1: "Medium (50-75%)",
            2: "High (> 75%)"
        }
        
        niveau_inscription = niveaux_proba.get(prediction_inscription, "Unknown Probability")
        
        # 4. Multi-model synthesis
        score_global = (score_financier / 100) * 0.3 + (prediction_bourse / 3) * 0.4 + (prediction_inscription / 2) * 0.3
        
        if score_global >= 0.7 and type_bourse in ["Full", "Complète"]:
            decision_globale = "Full Scholarship Recommended"
            couleur_decision = "green"
            justification = f"Outstanding academic profile (GPA: {gpa:.2f}), significant financial need, and high enrollment probability. Highest committee priority."
        elif score_global >= 0.5 or type_bourse in ["Partial", "Half", "Partielle", "Moitié"]:
            decision_globale = "Partial Scholarship Recommended"
            couleur_decision = "yellow"
            justification = f"Strong academic profile (GPA: {gpa:.2f}) with moderate financial burden. Partial scholarship allocation appropriate."
        else:
            decision_globale = "No Scholarship Recommended"
            couleur_decision = "red"
            justification = f"Sufficient financial capacity (Score: {score_financier:.0f}/100) or academic performance does not meet scholarship thresholds currently."
        
        return {
            "idEtudiant": id_etudiant,
            "nomComplet": f"{etudiant.get('prenom', '')} {etudiant.get('nom', '')}",
            "capaciteFinanciere": {
                "score": round(score_financier, 1),
                "niveau": niveau_capacite,
                "message": message_capacite
            },
            "recommandationBourse": {
                "type": type_bourse,
                "montant": montant_bourse,
                "message": message_bourse
            },
            "probabiliteInscription": {
                "niveau": niveau_inscription,
                "confiance": round(confiance_inscription * 100, 1),
                "prediction": int(prediction_inscription)
            },
            "recommandationGlobale": {
                "decision": decision_globale,
                "couleur": couleur_decision,
                "justification": justification,
                "scoreGlobal": round(score_global * 100, 1)
            },
            "details": {
                "gpa": gpa,
                "noteExamen": note_examen,
                "revenu": revenu,
                "dependants": dependants,
                "distance": distance
            }
        }
        
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error generating student recommendations")
        raise HTTPException(status_code=500, detail="Internal server error")
