# config2.py
from pathlib import Path
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    # line_client_access_token: str = Field(..., env="LINE_CLIENT_ACCESS_TOKEN")
    # line_client_secret: str = Field(..., env="LINE_CLIENT_SECRET")
    # line_business_access_token: str = Field(..., env="LINE_BUSINESS_SECRET_TOKEN")
    # line_business_secret: str = Field(..., env="LINE_BUSINESS_SECRET")
    google_calendar_credentials_path: str = Field(..., env="GOOGLE_CALENDAR_CREDENTIALS_PATH")
    business_calendar_id: str = Field(..., env="BUSINESS_CALENDAR_ID")
    # database_url: str = Field(..., env="DATABASE_URL")

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
