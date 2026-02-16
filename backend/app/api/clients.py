from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils.auth import get_current_user
from app.models.user import User
from app.models.client import ClientProfile

router = APIRouter()


@router.get("")
def list_clients(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List client profiles for current user. (Stub - Phase 3)"""
    clients = db.query(ClientProfile).filter(ClientProfile.user_id == current_user.id).all()
    return {"items": clients}


@router.get("/{client_id}")
def get_client(
    client_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a client profile. (Stub - Phase 3)"""
    client = db.query(ClientProfile).filter(
        ClientProfile.id == client_id,
        ClientProfile.user_id == current_user.id,
    ).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client
