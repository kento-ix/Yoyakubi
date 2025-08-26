from pathlib import Path
from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional

class Settings(BaseSettings):
    line_client_channel_access_token: Optional[str] = Field(None, env="LINE_CLIENT_CHANNEL_ACCESS_TOKEN")
    line_client_channel_secret: Optional[str] = Field(None, env="LINE_CLIENT_CHANNEL_SECRET")
    line_business_channel_access_token: Optional[str] = Field(None, env="LINE_BUSINESS_CHANNEL_SECRET_TOKEN")
    line_business_channel_secret: Optional[str] = Field(None, env="LINE_BUSINESS_CHANNEL_SECRET")
    google_calendar_credentials_path: Optional[str] = Field(None, env="GOOGLE_CALENDAR_CREDENTIALS_PATH")
    business_calendar_id: Optional[str] = Field(None, env="BUSINESS_CALENDAR_ID")
    database_url: Optional[str] = Field(None, env="DATABASE_URL")

    class Config:
        env_file = str(Path(__file__).resolve().parent.parent / ".env")
        extra = "ignore"


settings = Settings()
