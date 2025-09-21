from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from services.calendar_service import get_reserved_slots_service

router = APIRouter(prefix="/calendar", tags=["calendar"])

class ServiceItem(BaseModel):
    id: str
    service_name: str
    description: str    
    duration: int
    price: int
    category: str

class ReservationConfirmSchema(BaseModel):
    date: str
    time: str
    endTime: str
    totalDuration: int
    totalPrice: int
    services: List[ServiceItem]

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
