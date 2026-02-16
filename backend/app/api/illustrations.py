from fastapi import APIRouter, Depends
from app.utils.auth import get_current_user
from app.models.user import User

router = APIRouter()


@router.post("/generate")
def generate_illustration(current_user: User = Depends(get_current_user)):
    """Generate PDF illustration. (Stub - Phase 4)"""
    return {"message": "Illustration endpoint - Phase 4", "pdf_url": None}
