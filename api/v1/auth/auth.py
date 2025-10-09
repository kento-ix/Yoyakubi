from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from api.db.database import get_db
from api.models.orm_reservation import User

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.get("/check_user/{line_id}")
def check_user(line_id: str, db: Session = Depends(get_db)):
    """
        Check if LINE ID is registerd or not
    """
    user = db.query(User).filter(User.line_id == line_id).first()
    if user:
        return {"registered": True, "user_id": user.id}
    return {"registered": False}
