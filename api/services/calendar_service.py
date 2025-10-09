from core.google_calendar import get_calendar_service
from core.config import settings
from datetime import datetime, timedelta
import pytz
from models.orm_reservation import Reserve
from sqlalchemy.orm import Session
from typing import Dict, Any


def get_reserved_slots_service():
    """
    Get event weekly from Google Calendar
    """
    tz = pytz.timezone("Asia/Tokyo")
    today = datetime.now(tz)
    end_day = today + timedelta(days=6, hours=23, minutes=59, seconds=59)

    service = get_calendar_service()
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

    return reserved_slots

def add_reservation_to_calendar(reserve: Reserve, db: Session) -> Dict[str, Any]:
    """
    Add reservation to Google Calendar
    """
    # Get calendar service
    service = get_calendar_service()
    
    # Set timezone
    tz = pytz.timezone("Asia/Tokyo")
    

    start_datetime = datetime.combine(reserve.date, reserve.start_time)
    end_datetime = datetime.combine(reserve.date, reserve.end_time)

    start_datetime = tz.localize(start_datetime)
    end_datetime = tz.localize(end_datetime)
    
    db.refresh(reserve, ['user', 'reserve_services'])
    

    user_name = f"{reserve.user.first_name or ''} {reserve.user.last_name or ''}".strip()
    if not user_name:
        user_name = "お客様"
    
    service_names = []
    for reserve_service in reserve.reserve_services:
        db.refresh(reserve_service, ['service'])
        service_names.append(reserve_service.service.service_name)
    
    event_title = f"{user_name} - {', '.join(service_names)}"
    
    event = {
        'summary': event_title,
        'start': {
            'dateTime': start_datetime.isoformat(),
            'timeZone': 'Asia/Tokyo',
        },
        'end': {
            'dateTime': end_datetime.isoformat(),
            'timeZone': 'Asia/Tokyo',
        },
        'description': f"予約ID: {reserve.id}\n合計時間: {reserve.total_duration}分\n合計料金: ¥{reserve.total_price:,}",
    }
    
    created_event = service.events().insert(
        calendarId=settings.business_calendar_id,
        body=event
    ).execute()
    
    return {
        'event_id': created_event.get('id'),
        'event_link': created_event.get('htmlLink'),
        'event_title': event_title
    }
