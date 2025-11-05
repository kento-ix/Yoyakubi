from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from api.db.database import get_db
from api.models.orm_reservation import User
from api.services.auth_service import check_user_exists;

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/check_user/{line_id}")
def check_user(line_id: str, db: Session = Depends(get_db)):
    return check_user_exists(line_id, db)