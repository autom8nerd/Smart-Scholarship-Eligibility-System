"""
Administrator Authentication Endpoints

Validates administrator credentials against configured environment variables
(ADMIN_EMAIL / ADMIN_PASSWORD) using constant-time comparison and issues
a signed JWT token upon successful authentication.
"""
import secrets

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from config.parametres import ADMIN_EMAIL, ADMIN_PASSWORD, JWT_DUREE_VALIDITE_MINUTES
from utilitaires.securite import creer_jeton_acces

routeur_auth = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"]
)


class RequeteConnexionAdmin(BaseModel):
    """Administrator login request payload"""
    email: str = Field(..., description="Administrator email address")
    password: str = Field(..., description="Administrator password")


class ReponseConnexionAdmin(BaseModel):
    """Administrator login response payload"""
    token: str
    token_type: str = "bearer"
    role: str = "admin"
    expire_dans_minutes: int


@routeur_auth.post("/connexion", response_model=ReponseConnexionAdmin)
async def connexion_admin(requete: RequeteConnexionAdmin):
    """
    Authenticate an administrator.

    Compares submitted credentials with ADMIN_EMAIL / ADMIN_PASSWORD
    using constant-time digest comparison, then issues a signed JWT valid
    for JWT_DUREE_VALIDITE_MINUTES minutes.

    Raises:
        HTTPException 401: Invalid or unconfigured credentials
    """
    identifiants_configures = bool(ADMIN_EMAIL) and bool(ADMIN_PASSWORD)
    email_correct = identifiants_configures and secrets.compare_digest(requete.email, ADMIN_EMAIL)
    mot_de_passe_correct = identifiants_configures and secrets.compare_digest(requete.password, ADMIN_PASSWORD)

    if not (email_correct and mot_de_passe_correct):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = creer_jeton_acces(sub=requete.email, role="admin")

    return ReponseConnexionAdmin(
        token=token,
        expire_dans_minutes=JWT_DUREE_VALIDITE_MINUTES
    )
