"""
API routes for managing yearly scholarship quotas
"""
import logging
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from utilitaires.base_donnees import GestionnaireBD
from utilitaires.securite import exiger_role_admin

logger = logging.getLogger(__name__)

routeur_quotas = APIRouter(
    prefix="/api/v1/quotas",
    tags=["Quotas"]
)

@routeur_quotas.get("/")
async def obtenir_tous_quotas():
    """
    Retrieve all yearly scholarship quotas.
    
    Returns:
        dict: List of all quotas sorted by academic year
    """
    try:
        collection_quotas = GestionnaireBD.obtenir_collection_quotas()
        quotas = list(collection_quotas.find().sort("annee", -1))
        
        for quota in quotas:
            quota['_id'] = str(quota['_id'])
        
        return {
            "total": len(quotas),
            "quotas": quotas
        }
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error retrieving scholarship quotas")
        raise HTTPException(status_code=500, detail="Internal server error")

@routeur_quotas.get("/{annee}")
async def obtenir_quota_annee(annee: int):
    """
    Retrieve scholarship quota for a designated academic year.
    
    Args:
        annee: Academic year
        
    Returns:
        dict: Quota allocation for the specified year
    """
    try:
        collection_quotas = GestionnaireBD.obtenir_collection_quotas()
        quota = collection_quotas.find_one({"annee": annee})
        
        if not quota:
            raise HTTPException(
                status_code=404,
                detail=f"Quota for year {annee} not found"
            )
        
        quota['_id'] = str(quota['_id'])
        return quota
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error retrieving scholarship quota")
        raise HTTPException(status_code=500, detail="Internal server error")

@routeur_quotas.post("/{annee}")
async def creer_ou_mettre_a_jour_quota(annee: int, nombre_bourses: int, utilisateur_admin: dict = Depends(exiger_role_admin)):
    """
    Create or update yearly scholarship quota (Administrator only).

    Args:
        annee: Academic year
        nombre_bourses: Number of available scholarships

    Returns:
        dict: Created or updated quota entity

    Raises:
        HTTPException 400: Negative scholarship count
        HTTPException 401: Authentication required
        HTTPException 403: Forbidden (Admin role required)
    """
    try:
        if nombre_bourses < 0:
            raise HTTPException(
                status_code=400,
                detail="Number of scholarships cannot be negative"
            )
        
        collection_quotas = GestionnaireBD.obtenir_collection_quotas()
        quota_existant = collection_quotas.find_one({"annee": annee})
        
        if quota_existant:
            result = collection_quotas.update_one(
                {"annee": annee},
                {
                    "$set": {
                        "nombre_bourses": nombre_bourses,
                        "derniere_mise_a_jour": datetime.utcnow()
                    }
                }
            )
            if result.modified_count == 0:
                raise HTTPException(
                    status_code=400,
                    detail="No modifications performed"
                )
        else:
            collection_quotas.insert_one({
                "annee": annee,
                "nombre_bourses": nombre_bourses,
                "date_creation": datetime.utcnow(),
                "derniere_mise_a_jour": datetime.utcnow()
            })
        
        quota = collection_quotas.find_one({"annee": annee})
        quota['_id'] = str(quota['_id'])
        
        return {
            "success": True,
            "message": f"Quota for year {annee} updated: {nombre_bourses} scholarships",
            "quota": quota
        }
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error creating or updating scholarship quota")
        raise HTTPException(status_code=500, detail="Internal server error")

@routeur_quotas.delete("/{annee}")
async def supprimer_quota(annee: int, utilisateur_admin: dict = Depends(exiger_role_admin)):
    """
    Delete scholarship quota for a designated academic year (Administrator only).

    Args:
        annee: Academic year

    Returns:
        dict: Deletion confirmation message
    """
    try:
        collection_quotas = GestionnaireBD.obtenir_collection_quotas()
        result = collection_quotas.delete_one({"annee": annee})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=404,
                detail=f"Quota for year {annee} not found"
            )
        
        return {
            "success": True,
            "message": f"Quota for year {annee} deleted successfully"
        }
    except HTTPException:
        raise
    except Exception:
        logger.exception("Error deleting scholarship quota")
        raise HTTPException(status_code=500, detail="Internal server error")
