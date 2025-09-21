from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from model.reserve_schema import ReservationCreate
from services.reserve_service import create_reservation_db
from services.calendar_service import add_reservation_to_calendar
from typing import Dict, Any

router = APIRouter(prefix="/reserve", tags=["reserve"])


@router.post("/add_reserve")
def create_reservation(reservation: ReservationCreate, db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Create a new reservation
    """
    try:
        new_reserve = create_reservation_db(reservation, db)
        calendar_event = add_reservation_to_calendar(new_reserve, db)
        
        return {
            "success": True,
            "reserve_id": new_reserve.id,
            "calendar_event": calendar_event
        }
        
    except Exception as e:
        db.rollback()
        import traceback
        print("Error description:", traceback.format_exc())
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to create reservation: {str(e)}"
        )
