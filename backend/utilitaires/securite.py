"""
Security Utilities: JWT token issuance, verification, and FastAPI authorization dependencies.
"""
import logging
from datetime import datetime, timedelta

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from config.parametres import JWT_SECRET_KEY, JWT_ALGORITHME, JWT_DUREE_VALIDITE_MINUTES

logger = logging.getLogger(__name__)

_schema_bearer = HTTPBearer(auto_error=False)


def creer_jeton_acces(sub: str, role: str) -> str:
    """
    Issue a signed JWT token for an authenticated user.

    Args:
        sub: Subject identifier (administrator email address)
        role: Assigned authorization role (e.g. "admin")

    Returns:
        str: Encoded JWT access token
    """
    expiration = datetime.utcnow() + timedelta(minutes=JWT_DUREE_VALIDITE_MINUTES)
    charge_utile = {"sub": sub, "role": role, "exp": expiration}
    return jwt.encode(charge_utile, JWT_SECRET_KEY, algorithm=JWT_ALGORITHME)


def obtenir_utilisateur_courant(
    identifiants: HTTPAuthorizationCredentials = Depends(_schema_bearer)
) -> dict:
    """
    FastAPI Dependency: Decodes and validates the JWT presented in
    the Authorization: Bearer <token> header.

    Raises:
        HTTPException 401: If token is missing, expired, or invalid
    """
    if identifiants is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        return jwt.decode(identifiants.credentials, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHME])
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired, please log in again",
        )
    except jwt.InvalidTokenError:
        logger.warning("Authentication attempt with invalid JWT token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )


def exiger_role_admin(utilisateur: dict = Depends(obtenir_utilisateur_courant)) -> dict:
    """
    FastAPI Dependency: Verifies that authenticated subject possesses administrator privileges.

    Raises:
        HTTPException 401: Inherited from obtenir_utilisateur_courant
        HTTPException 403: If token is valid but subject lacks admin role
    """
    if utilisateur.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator access required",
        )
    return utilisateur
