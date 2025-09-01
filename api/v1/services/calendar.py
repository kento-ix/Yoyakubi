from fastapi import APIRouter
from core.google_calendar import get_calendar_service
from core.config import settings
from datetime import datetime, timedelta
import pytz

router = APIRouter(prefix="/calendar", tags=["calendar"])

@router.post("/add_reserve")
def add_reserved():
    """
        Add reserve to calendar
    """

    

@router.get("/get_reserved")
def get_reserved_slots():
    """
    Return a week events, grouped by date and including title
    """
    try:
        service = get_calendar_service()
        tz = pytz.timezone("Asia/Tokyo")
        today = datetime.now(tz)
        end_day = today + timedelta(days=6, hours=23, minutes=59, seconds=59)

        events_result = service.events().list(
            calendarId=settings.business_calendar_id,
            timeMin=today.isoformat(),
            timeMax=end_day.isoformat(),
            singleEvents=True,
            orderBy="startTime"
        ).execute()

        events = events_result.get("items", [])

        reserved_slots = []

        for event in events:
            event_id = event.get("id")
            title = event.get("summary", "")
            start_dt = datetime.fromisoformat(event["start"].get("dateTime")).astimezone(tz)
            end_dt = datetime.fromisoformat(event["end"].get("dateTime")).astimezone(tz)

            slot_times = []
            slot_time = start_dt
            while slot_time <= end_dt:
                slot_times.append(slot_time.strftime("%H:%M"))
                slot_time += timedelta(minutes=30)

            date_str = start_dt.strftime("%Y-%m-%d")

            date_entry = next((d for d in reserved_slots if d["date"] == date_str), None)
            booking_entry = {"id": event_id, "title": title, "times": slot_times}

            if date_entry:
                date_entry["bookings"].append(booking_entry)
            else:
                reserved_slots.append({"date": date_str, "bookings": [booking_entry]})

        return {"success": True, "reserved_slots": reserved_slots}

    except Exception as e:
        return {"success": False, "error": str(e)}
