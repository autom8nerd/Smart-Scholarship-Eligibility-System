"""
API Endpoints for Machine Learning Candidate Ranking and Recommendations
Ranks pending candidates by merit and financial need respecting yearly quotas.
"""
import logging
from fastapi import APIRouter, HTTPException
from datetime import datetime
from typing import List, Dict, Any
from modeles.regression_lineaire import modele_regression
from modeles.arbre_decision import modele_arbre
from modeles.svm import modele_svm
from utilitaires.base_donnees import GestionnaireBD

logger = logging.getLogger(__name__)

routeur_ml_ranking = APIRouter(
    prefix="/api/v1/ml-ranking",
    tags=["ML Ranking & Recommendations"]
)

# Model information and descriptions
MODEL_EXPLANATIONS = {
    "regression_lineaire": {
        "nom": "Linear Regression",
        "description": "Linear regression model for continuous prediction",
        "fonctionnement": "Learns linear relationship between academic/financial features and financial capacity",
        "capacite": "Predicts continuous score (0-100) based on linear combination of features",
        "forces": ["Fast inference", "Interpretable coefficients", "Effective for linear relationships"],
        "limites": ["Assumes linear relationship", "Sensitive to outliers"],
        "features_utilisees": ["GPA", "Exam Score", "Income", "Dependents", "Distance"]
    },
    "arbre_decision": {
        "nom": "Decision Tree",
        "description": "Decision tree classifier for hierarchical allocation",
        "fonctionnement": "Learns a series of decision rules analyzing feature threshold boundaries",
        "capacite": "Classifies candidates into scholarship categories based on automatically discovered threshold rules",
        "forces": ["Captures non-linear relationships", "Robust to outliers", "Transparent decision path"],
        "limites": ["Can overfit if unpruned", "Sensitive to data variations"],
        "features_utilisees": ["GPA", "Exam Score", "Income", "Dependents", "Distance"]
    },
    "svm": {
        "nom": "Support Vector Machine (SVM)",
        "description": "Support vector machine for margin-maximizing classification",
        "fonctionnement": "Learns optimal hyperplane separating eligible from non-eligible candidates",
        "capacite": "Classifies candidates discriminatively with probability of acceptance",
        "forces": ["Highly effective in high dimensions", "Robust margin boundary", "Effective for complex patterns"],
        "limites": ["Less directly interpretable", "Requires standardized feature scaling"],
        "features_utilisees": ["GPA", "Exam Score", "Income", "Dependents", "Distance"]
    }
}


def extraire_features_etudiant(student: Dict[str, Any]) -> List[float]:
    """
    Extract ML feature vector from student entity.
    Features: [GPA, Exam Score, Income, Dependents, Distance]
    
    Handles both nested structure (from registration form) and flat structure (from database).
    
    Args:
        student: Student document from MongoDB
        
    Returns:
        List of 5 features for ML models
    """
    try:
        if not student:
            return [0, 0, 0, 0, 0]
        
        gpa = None
        
        # Check nested structure (from registration form)
        donnees_bac = student.get('donnees_baccalaureat')
        if donnees_bac and isinstance(donnees_bac, dict):
            gpa = (donnees_bac.get('notes_regionales', 0) + donnees_bac.get('note_generale', 0)) / 2
        
        # Check flat fields (from database)
        if not gpa or gpa == 0:
            notes_regionales = student.get('notes_regionales', 0)
            note_generale = student.get('note_generale', 0)
            if notes_regionales or note_generale:
                gpa = (float(notes_regionales) + float(note_generale)) / 2
        
        # Check pre-computed GPA
        if not gpa or gpa == 0:
            gpa_field = student.get('gpa', 0)
            if gpa_field:
                gpa = float(gpa_field)
        
        gpa = float(gpa) if gpa else 0
        
        # Standardized exam score
        note_examen = None
        
        donnees_diplome = student.get('donnees_diplome')
        if donnees_diplome and isinstance(donnees_diplome, dict):
            note_examen = donnees_diplome.get('notes_diplome')
        
        if not note_examen or note_examen == 0:
            note_examen = student.get('notes_diplome')
        
        if not note_examen or note_examen == 0:
            note_examen = student.get('exam_score')
        
        if not note_examen or note_examen == 0:
            note_examen = gpa
        
        note_examen = float(note_examen) if note_examen else 0
        
        # Financial indicators
        revenu = 0
        dependants = 0
        
        donnees_financieres = student.get('donnees_financieres')
        if donnees_financieres and isinstance(donnees_financieres, dict):
            revenu = donnees_financieres.get('revenu', 0)
            dependants = donnees_financieres.get('dependants', 0)
        else:
            revenu = student.get('revenu', 0)
            dependants = student.get('dependants', 0)
        
        revenu = float(revenu) if revenu else 0
        dependants = float(dependants) if dependants else 0
        
        # Geographic distance
        distance = 0
        donnees_contextuelles = student.get('donnees_contextuelles')
        if donnees_contextuelles and isinstance(donnees_contextuelles, dict):
            distance = donnees_contextuelles.get('distance', 0)
        else:
            distance = student.get('distance', 0)
        
        distance = float(distance) if distance else 0
        
        return [gpa, note_examen, revenu, dependants, distance]

    except Exception as e:
        logger.warning(f"Error extracting features: {e}")
        return [0, 0, 0, 0, 0]


@routeur_ml_ranking.get("/models-info")
async def obtenir_info_modeles():
    """
    Get detailed architectural information about all 3 ML models.
    """
    try:
        return {
            "models": MODEL_EXPLANATIONS,
            "total_features": 5,
            "feature_names": ["GPA", "Exam Score", "Income", "Dependents", "Distance"]
        }
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error retrieving model information")
        raise HTTPException(status_code=500, detail="Internal server error")


@routeur_ml_ranking.get("/models-statistics")
async def obtenir_stats_modeles():
    """
    Get statistics about ML models including training distributions and prediction capacity.
    """
    try:
        collection_etudiants = GestionnaireBD.obtenir_collection_etudiants()
        total_students = collection_etudiants.count_documents({})
        approved_students = collection_etudiants.count_documents({"statut": "Approuvé"})
        rejected_students = collection_etudiants.count_documents({"statut": "Rejeté"})
        pending_students = collection_etudiants.count_documents({"statut": "En attente"})
        
        return {
            "training_data": {
                "total_etudiants": total_students,
                "etudiants_approuves": approved_students,
                "etudiants_rejetes": rejected_students,
                "etudiants_en_attente": pending_students,
                "contexte": "Models are trained on Moroccan student records adhering to Moroccan academic standards"
            },
            "models": {
                "regression_lineaire": {
                    **MODEL_EXPLANATIONS["regression_lineaire"],
                    "type": "Regression",
                    "output": "Continuous score 0-100",
                    "apprentissage": "Minimizes mean squared error between predictions and target capacity",
                    "capacite_prediction": "Estimates financial score based on linear combination of student features"
                },
                "arbre_decision": {
                    **MODEL_EXPLANATIONS["arbre_decision"],
                    "type": "Classification",
                    "output": "Multiclass scholarship tier (0-3)",
                    "apprentissage": "Learns conditional split thresholds maximizing information gain",
                    "capacite_prediction": "Classifies candidates via hierarchical decision boundary questions"
                },
                "svm": {
                    **MODEL_EXPLANATIONS["svm"],
                    "type": "Classification",
                    "output": "Multiclass probability index with confidence margin",
                    "apprentissage": "Learns maximum-margin hyperplane in standardized vector space",
                    "capacite_prediction": "Estimates candidate matriculation likelihood robustly in high dimensions"
                }
            },
            "ensemble_strategy": {
                "description": "All 3 models vote for each student candidate",
                "methode": "Weighted score synthesis and consensus agreement",
                "consensus": "Candidate recommended unanimously by all 3 models (high confidence)",
                "robustesse": "Multi-model ensemble minimizes variance of single model decisions"
            },
            "features_explanation": {
                "GPA": "Academic GPA score (regional + national baccalaureate average) / 2",
                "Exam Score": "Standardized examination or higher diploma GPA score",
                "Income": "Annual household family income in Dirhams (MAD) — financial need index",
                "Dependents": "Number of supported family dependents",
                "Distance": "Commute distance to university campus in kilometers"
            }
        }
        
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error retrieving model statistics")
        raise HTTPException(status_code=500, detail="Internal server error")


@routeur_ml_ranking.get("/rank-students/{year}")
async def ranger_etudiants_par_annee(year: int):
    """
    Rank pending candidates for a given academic year using all 3 ML models.
    Enforces yearly scholarship quota and computes consensus allocations.
    
    Args:
        year: Academic year to evaluate
        
    Returns:
        Dict with rankings from each model, consensus candidates, and merged priority order
    """
    try:
        collection_quotas = GestionnaireBD.obtenir_collection_quotas()
        quota = collection_quotas.find_one({"annee": year})
        
        if not quota:
            raise HTTPException(
                status_code=404,
                detail=f"No quota defined for year {year}. Please set quota first."
            )
        
        quota_nombre = quota.get("nombre_bourses", 0)
        
        collection_etudiants = GestionnaireBD.obtenir_collection_etudiants()
        pending_students = list(collection_etudiants.find({
            "statut": "En attente",
            "annee": year
        }))
        
        if not pending_students:
            return {
                "annee": year,
                "quota": quota_nombre,
                "total_etudiants_en_attente": 0,
                "regression_lineaire": {
                    "nom": "Linear Regression",
                    "top_candidates": [],
                    "scores": []
                },
                "arbre_decision": {
                    "nom": "Decision Tree",
                    "top_candidates": [],
                    "scores": []
                },
                "svm": {
                    "nom": "Support Vector Machine",
                    "top_candidates": [],
                    "scores": []
                },
                "consensus": {
                    "description": "Candidates recommended by all 3 models",
                    "candidates": []
                }
            }
        
        students_with_scores = []
        
        for student in pending_students:
            if not student:
                continue
                
            features = extraire_features_etudiant(student)
            
            # 1. Linear Regression Prediction
            try:
                score_regression = modele_regression.predire(features)
                if isinstance(score_regression, dict):
                    score_regression = score_regression.get('prediction', score_regression.get('score', 50.0))
                score_regression = float(score_regression)
            except Exception as e:
                logger.warning(f"Linear regression prediction fallback used: {e}")
                score_regression = 50.0
            
            # 2. Decision Tree Prediction
            try:
                score_arbre = modele_arbre.predire(features)
                if isinstance(score_arbre, dict):
                    score_arbre = score_arbre.get('prediction', score_arbre.get('score', 50.0))
                score_arbre = float(score_arbre)
                # Map 0-3 tier to 0-100 continuous scale
                score_arbre = (score_arbre / 3.0) * 100
            except Exception as e:
                logger.warning(f"Decision tree prediction fallback used: {e}")
                score_arbre = 50.0
            
            # 3. SVM Prediction
            try:
                score_svm = modele_svm.predire(features)
                if isinstance(score_svm, dict):
                    classe = score_svm.get('classe', 1)
                    confiance = score_svm.get('confiance', 0.5)
                    score_svm = ((classe / 2.0) * 80) + (confiance * 20)
                else:
                    score_svm = float(score_svm)
                    score_svm = (score_svm / 2.0) * 100
                score_svm = float(score_svm)
            except Exception as e:
                logger.warning(f"SVM prediction fallback used: {e}")
                score_svm = 50.0
            
            # Average score across models
            avg_score = (score_regression + score_arbre + score_svm) / 3
            
            # Financial need calculation (0-100)
            max_revenu = 50000
            student_revenu = student.get('revenu') if student.get('revenu') else student.get('donnees_financieres', {}).get('revenu', 0)
            student_dependants = student.get('dependants') if student.get('dependants') else student.get('donnees_financieres', {}).get('dependants', 0)
            
            financial_need = min(100, (max_revenu - float(student_revenu or 0)) / max_revenu * 100)
            dependant_factor = float(student_dependants or 0) * 5
            financial_need = min(100, financial_need + dependant_factor)
            
            # Academic GPA
            gpa_bac = student.get('gpa')
            if not gpa_bac:
                notes_reg = student.get('notes_regionales') or student.get('donnees_baccalaureat', {}).get('notes_regionales', 0)
                note_gen = student.get('note_generale') or student.get('donnees_baccalaureat', {}).get('note_generale', 0)
                gpa = (float(notes_reg or 0) + float(note_gen or 0)) / 2
            else:
                gpa = float(gpa_bac)
            
            gpa_score = (gpa / 20) * 100
            
            # Combined priority score: 60% Academic GPA + 40% Financial Need
            priority_score = (gpa_score * 0.60) + (financial_need * 0.40)
            
            # Recommended scholarship sponsorship tier
            if financial_need > 70:
                recommended_sponsorship = "Full"
            elif financial_need > 40:
                recommended_sponsorship = "Half"
            else:
                recommended_sponsorship = "Partial"
            
            gpa_flat = student.get('gpa')
            revenu_flat = student.get('revenu', 0)
            dependants_flat = student.get('dependants', 0)
            distance_flat = student.get('distance', 0)
            
            final_gpa = gpa_flat if gpa_flat else gpa
            final_revenu = revenu_flat if revenu_flat else student.get('donnees_financieres', {}).get('revenu', 0)
            final_dependants = dependants_flat if dependants_flat else student.get('donnees_financieres', {}).get('dependants', 0)
            final_distance = distance_flat if distance_flat else student.get('donnees_contextuelles', {}).get('distance', 0)
            
            students_with_scores.append({
                "idEtudiant": str(student.get("idEtudiant", student.get("_id"))),
                "prenom": student.get("prenom"),
                "nom": student.get("nom"),
                "email": student.get("email"),
                "gpa": round(final_gpa, 2) if final_gpa else 0,
                "revenu": round(final_revenu, 2) if final_revenu else 0,
                "dependants": int(final_dependants) if final_dependants else 0,
                "distance": round(final_distance, 2) if final_distance else 0,
                "type_sponsorship": student.get('type_sponsorship', 'Full'),
                "recommended_sponsorship": recommended_sponsorship,
                "financial_need": round(financial_need, 2),
                "priority_score": round(priority_score, 2),
                "score_regression": round(score_regression, 2),
                "score_arbre": round(score_arbre, 2),
                "score_svm": round(score_svm, 2),
                "average_score": round(avg_score, 2)
            })
        
        # Sort by priority score (financial need + academic performance)
        students_with_scores.sort(key=lambda x: (-x['priority_score'], -x['average_score']))
        
        top_candidates = students_with_scores[:quota_nombre]
        
        # Determine consensus candidates (recommended across all 3 models)
        regression_top_ids = {s['idEtudiant'] for s in sorted(
            students_with_scores, 
            key=lambda x: x['score_regression'], 
            reverse=True
        )[:quota_nombre]}
        
        arbre_top_ids = {s['idEtudiant'] for s in sorted(
            students_with_scores, 
            key=lambda x: x['score_arbre'], 
            reverse=True
        )[:quota_nombre]}
        
        svm_top_ids = {s['idEtudiant'] for s in sorted(
            students_with_scores, 
            key=lambda x: x['score_svm'], 
            reverse=True
        )[:quota_nombre]}
        
        consensus_ids = regression_top_ids & arbre_top_ids & svm_top_ids
        consensus_candidates = [s for s in students_with_scores if s['idEtudiant'] in consensus_ids]
        
        return {
            "annee": year,
            "quota": quota_nombre,
            "total_etudiants_en_attente": len(pending_students),
            "regression_lineaire": {
                "nom": "Linear Regression",
                "description": MODEL_EXPLANATIONS["regression_lineaire"]["description"],
                "fonctionnement": MODEL_EXPLANATIONS["regression_lineaire"]["fonctionnement"],
                "capacite": MODEL_EXPLANATIONS["regression_lineaire"]["capacite"],
                "top_candidates": sorted(
                    students_with_scores,
                    key=lambda x: x['score_regression'],
                    reverse=True
                )[:quota_nombre]
            },
            "arbre_decision": {
                "nom": "Decision Tree",
                "description": MODEL_EXPLANATIONS["arbre_decision"]["description"],
                "fonctionnement": MODEL_EXPLANATIONS["arbre_decision"]["fonctionnement"],
                "capacite": MODEL_EXPLANATIONS["arbre_decision"]["capacite"],
                "top_candidates": sorted(
                    students_with_scores,
                    key=lambda x: x['score_arbre'],
                    reverse=True
                )[:quota_nombre]
            },
            "svm": {
                "nom": "Support Vector Machine",
                "description": MODEL_EXPLANATIONS["svm"]["description"],
                "fonctionnement": MODEL_EXPLANATIONS["svm"]["fonctionnement"],
                "capacite": MODEL_EXPLANATIONS["svm"]["capacite"],
                "top_candidates": sorted(
                    students_with_scores,
                    key=lambda x: x['score_svm'],
                    reverse=True
                )[:quota_nombre]
            },
            "consensus": {
                "description": "Candidates unanimously recommended by all 3 models (high confidence)",
                "candidates": consensus_candidates,
                "count": len(consensus_candidates)
            },
            "merged_ranking": {
                "description": "All candidates ranked by consensus weighted priority score",
                "top_candidates": top_candidates,
                "remaining_candidates": students_with_scores[quota_nombre:] if quota_nombre < len(students_with_scores) else []
            }
        }
        
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error ranking students")
        raise HTTPException(status_code=500, detail="Internal server error")


@routeur_ml_ranking.get("/rank-summary/{year}")
async def obtenir_resume_rangement(year: int):
    """
    Get executive summary of candidate rankings and quota utilization.
    """
    try:
        ranking_data = await ranger_etudiants_par_annee(year)
        
        collection_etudiants = GestionnaireBD.obtenir_collection_etudiants()
        approved_count = collection_etudiants.count_documents({"statut": "Approuvé", "annee": year})
        if approved_count == 0:
            approved_count = collection_etudiants.count_documents({"statut": "Approuvé"})
        
        return {
            "annee": year,
            "quota": ranking_data["quota"],
            "total_etudiants": ranking_data["total_etudiants_en_attente"],
            "approved_count": approved_count,
            "consensus_count": ranking_data["consensus"]["count"],
            "consensus_candidates": ranking_data["consensus"]["candidates"][:5],
            "top_merged": ranking_data["merged_ranking"]["top_candidates"][:ranking_data["quota"]],
            "quota_remaining": max(0, ranking_data["quota"] - approved_count)
        }
        
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error generating ranking summary")
        raise HTTPException(status_code=500, detail="Internal server error")
