"""
FastAPI Main Application for Ancil AI Decision Support System

This module configures and bootstraps the FastAPI application:
- CORS middleware whitelist for frontend communications
- RESTful API routers for all domain endpoints
- MongoDB connection and resource lifecycle management
- Application startup and graceful shutdown event hooks
"""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.parametres import (
    NOM_APP, VERSION_APP, DESCRIPTION_APP, ORIGINES_AUTORISEES,
    NIVEAU_JOURNAL, FORMAT_JOURNAL
)
from utilitaires.base_donnees import initialiser_bd, fermer_bd

# ============================================================================
# LOGGING CONFIGURATION
# ============================================================================
logging.basicConfig(level=NIVEAU_JOURNAL, format=FORMAT_JOURNAL)

# ============================================================================
# FASTAPI APPLICATION INITIALIZATION
# ============================================================================
application = FastAPI(
    title=NOM_APP,
    description=DESCRIPTION_APP,
    version=VERSION_APP,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# ============================================================================
# CORS MIDDLEWARE CONFIGURATION
# ============================================================================
application.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINES_AUTORISEES,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Type", "Content-Length", "X-Request-ID"],
    max_age=600,
)

# ============================================================================
# APPLICATION LIFECYCLE EVENT HANDLERS
# ============================================================================

@application.on_event("startup")
async def evenement_demarrage():
    """
    Application startup event handler.
    Initializes database indexes and preloads machine learning models.
    """
    print("[▶] Starting Ancil AI — Smart Enrollment & Scholarship Decision Support System...")
    try:
        initialiser_bd()
        print("[✓] System fully operational and database connected!")
    except Exception as e:
        print(f"[⚠] Startup warning encountered: {e}")


@application.on_event("shutdown")
async def evenement_arret():
    """
    Application shutdown event handler.
    Gracefully closes active database connections and frees resources.
    """
    print("[◼] Shutting down Ancil AI system...")
    fermer_bd()
    print("[✓] System shut down cleanly.")


# ============================================================================
# ROOT AND HEALTH CHECK ENDPOINTS
# ============================================================================

@application.get("/")
async def racine():
    """
    API Root Endpoint.
    Returns general system metadata and active API resource routes.
    """
    return {
        "nom": NOM_APP,
        "name": NOM_APP,
        "version": VERSION_APP,
        "statut": "operational",
        "status": "operational",
        "documentation": "/docs",
        "documentation_alternative": "/redoc",
        "points_acces": {
            "etudiants": "/api/v1/etudiants",
            "predictions": "/api/v1/predictions",
            "statistiques": "/api/v1/statistiques"
        }
    }


@application.get("/sante")
async def verifier_sante():
    """
    System Healthcheck Endpoint.
    Queried by container runtimes and load balancer monitors.
    """
    return {
        "statut": "healthy",
        "status": "healthy",
        "service": NOM_APP,
        "version": VERSION_APP,
        "api_disponible": True,
        "api_available": True
    }


# ============================================================================
# ROUTER REGISTRATION
# ============================================================================

from api.auth import routeur_auth
from api.etudiants import routeur_etudiants
from api.predictions import routeur_predictions
from api.statistiques import routeur_statistiques
from api.modeles import routeur_modeles
from api.quotas import routeur_quotas
from api.ml_ranking import routeur_ml_ranking

application.include_router(routeur_auth)
application.include_router(routeur_etudiants)
application.include_router(routeur_predictions)
application.include_router(routeur_statistiques)
application.include_router(routeur_modeles)
application.include_router(routeur_quotas)
application.include_router(routeur_ml_ranking)

# ============================================================================
# DIRECT EXECUTION ENTRYPOINT
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        application,
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
