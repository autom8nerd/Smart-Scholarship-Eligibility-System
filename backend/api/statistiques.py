"""
API Endpoints for Statistics and Visualizations
Provides aggregated operational statistics and triggers Matplotlib chart rendering.
"""
import logging
from fastapi import APIRouter, HTTPException
from typing import Dict, List, Optional
from datetime import datetime
from utilitaires.base_donnees import GestionnaireBD
from utilitaires.visualisations import visualiseur
from config.parametres import CHEMIN_DONNEES
import os

logger = logging.getLogger(__name__)

routeur_statistiques = APIRouter(
    prefix="/api/v1/statistiques",
    tags=["Statistics and Visualizations"]
)


@routeur_statistiques.get("/resume")
async def obtenir_resume_statistiques():
    """
    Retrieve system summary statistics.
    
    Returns total counts of student entities and ML predictions categorized by model type.
    
    Returns:
        dict: Global system statistics
    """
    try:
        col_etudiants = GestionnaireBD.obtenir_collection_etudiants()
        col_predictions = GestionnaireBD.obtenir_collection_predictions()
        
        total_etudiants = col_etudiants.count_documents({})
        total_predictions = col_predictions.count_documents({})
        
        pipeline = [
            {
                "$group": {
                    "_id": "$type_prediction",
                    "nombre": {"$sum": 1}
                }
            }
        ]
        predictions_par_type = list(col_predictions.aggregate(pipeline))
        
        return {
            "total_etudiants": total_etudiants,
            "total_predictions": total_predictions,
            "predictions_par_type": {
                p["_id"]: p["nombre"] for p in predictions_par_type
            },
            "date_generation": datetime.utcnow().isoformat()
        }
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error retrieving summary statistics")
        raise HTTPException(status_code=500, detail="Internal server error")


@routeur_statistiques.get("/etudiants-par-annee")
async def obtenir_etudiants_par_annee():
    """
    Retrieve candidate distribution grouped by academic year.
    
    Returns:
        dict: Student count distribution per academic year
    """
    try:
        col_etudiants = GestionnaireBD.obtenir_collection_etudiants()
        
        pipeline = [
            {
                "$group": {
                    "_id": "$annee",
                    "nombre": {"$sum": 1}
                }
            },
            {
                "$sort": {"_id": -1}
            }
        ]
        
        resultats = list(col_etudiants.aggregate(pipeline))
        
        return {
            "etudiants_par_annee": {
                str(r["_id"]): r["nombre"] for r in resultats
            }
        }
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error retrieving students by year")
        raise HTTPException(status_code=500, detail="Internal server error")


@routeur_statistiques.post("/generer-graphique-capacite")
async def generer_graphique_capacite_financiere():
    """
    Generate and persist financial capacity distribution chart.
    
    Returns:
        dict: File path and summary statistics
    """
    try:
        col_predictions = GestionnaireBD.obtenir_collection_predictions()
        
        predictions = list(col_predictions.find(
            {"type_prediction": "capacite_financiere"},
            {"donnees_sortie.scoreFinancier": 1}
        ))
        
        if not predictions:
            return {
                "message": "No financial capacity predictions available",
                "chemin": None
            }
        
        scores = [p.get("donnees_sortie", {}).get("scoreFinancier", 0) 
                 for p in predictions]
        
        chemin = visualiseur.visualiser_distribution_capacite_financiere(scores)
        
        return {
            "message": "Chart generated successfully",
            "chemin": chemin,
            "nombre_predictions": len(predictions),
            "score_moyen": sum(scores) / len(scores) if scores else 0
        }
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error generating financial capacity chart")
        raise HTTPException(status_code=500, detail="Internal server error")


@routeur_statistiques.post("/generer-graphique-bourses")
async def generer_graphique_distribution_bourses():
    """
    Generate and persist scholarship tier allocation distribution chart.
    
    Returns:
        dict: Output file path and frequency distribution
    """
    try:
        col_predictions = GestionnaireBD.obtenir_collection_predictions()
        
        pipeline = [
            {"$match": {"type_prediction": "recommandation_bourse"}},
            {
                "$group": {
                    "_id": "$donnees_sortie.type_bourse",
                    "nombre": {"$sum": 1}
                }
            }
        ]
        
        resultats = list(col_predictions.aggregate(pipeline))
        distribution = {r["_id"]: r["nombre"] for r in resultats}
        
        if not distribution:
            return {
                "message": "No scholarship recommendations available",
                "chemin": None
            }
        
        chemin = visualiseur.visualiser_distribution_bourses(distribution)
        
        return {
            "message": "Chart generated successfully",
            "chemin": chemin,
            "distribution": distribution,
            "total_recommendations": sum(distribution.values())
        }
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error generating scholarship distribution chart")
        raise HTTPException(status_code=500, detail="Internal server error")


@routeur_statistiques.post("/generer-graphique-inscriptions")
async def generer_graphique_probabilites_inscription():
    """
    Generate and persist enrollment probability distribution chart.
    
    Returns:
        dict: Output file path and tier distribution
    """
    try:
        col_predictions = GestionnaireBD.obtenir_collection_predictions()
        
        pipeline = [
            {"$match": {"type_prediction": "probabilite_inscription"}},
            {
                "$group": {
                    "_id": "$donnees_sortie.niveau",
                    "nombre": {"$sum": 1}
                }
            }
        ]
        
        resultats = list(col_predictions.aggregate(pipeline))
        distribution = {r["_id"]: r["nombre"] for r in resultats}
        
        if not distribution:
            return {
                "message": "No enrollment predictions available",
                "chemin": None
            }
        
        chemin = visualiseur.visualiser_probabilites_inscription(distribution)
        
        return {
            "message": "Chart generated successfully",
            "chemin": chemin,
            "distribution": distribution,
            "total_predictions": sum(distribution.values())
        }
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error generating enrollment probability chart")
        raise HTTPException(status_code=500, detail="Internal server error")


@routeur_statistiques.get("/telech/graphiques")
async def lister_graphiques_disponibles():
    """
    List all generated chart image assets on filesystem.
    
    Returns:
        dict: Array of generated PNG charts with timestamps and file sizes
    """
    try:
        chemin_graphiques = os.path.join(CHEMIN_DONNEES, "graphiques")
        
        if not os.path.exists(chemin_graphiques):
            return {"graphiques": [], "total": 0}
        
        graphiques = []
        for fichier in os.listdir(chemin_graphiques):
            if fichier.endswith('.png'):
                chemin_complet = os.path.join(chemin_graphiques, fichier)
                graphiques.append({
                    "nom": fichier,
                    "chemin": chemin_complet,
                    "date_creation": datetime.fromtimestamp(
                        os.path.getmtime(chemin_complet)
                    ).isoformat(),
                    "taille_kb": os.path.getsize(chemin_complet) / 1024
                })
        
        graphiques.sort(key=lambda x: x["date_creation"], reverse=True)
        
        return {
            "graphiques": graphiques,
            "total": len(graphiques)
        }
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error listing chart files")
        raise HTTPException(status_code=500, detail="Internal server error")
