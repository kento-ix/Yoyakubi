from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from core.config import settings

def get_calendar_service():
    """
    Creates a Google Calendar service object using service account credentials
    """
    creds = Credentials.from_service_account_file(
        settings.google_calendar_credentials_path,
        scopes=["https://www.googleapis.com/auth/calendar"]
    )
    service = build("calendar", "v3", credentials=creds)
    return service
