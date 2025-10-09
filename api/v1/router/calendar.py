from fastapi import APIRouter, HTTPException
from services.calendar_service import get_reserved_slots_service
from schemas.reserve_schema import ReservationConfirmSchema 


router = APIRouter(prefix="/calendar", tags=["calendar"])


@router.post("/confirm", response_model=ReservationConfirmSchema)
def confirm_reservation(data: ReservationConfirmSchema):
    """
    Confirm reservation data (validation and processing)
    """
    try:
        return data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/get_reserved")
def get_reserved_slots():
    """
    Get reserved time slots from Google Calendar
    """
    try:
        reserved_slots = get_reserved_slots_service()
        return {"success": True, "reserved_slots": reserved_slots}
    except Exception as e:
        return {"success": False, "error": str(e)}
