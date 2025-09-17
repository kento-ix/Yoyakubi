from fastapi import APIRouter
from services.calendar_service import get_reserved_slots_service

router = APIRouter(prefix="/calendar", tags=["calendar"])

@router.get("/get_reserved")
def get_reserved_slots():
    try:
        reserved_slots = get_reserved_slots_service()
        return {"success": True, "reserved_slots": reserved_slots}
    except Exception as e:
        return {"success": False, "error": str(e)}
