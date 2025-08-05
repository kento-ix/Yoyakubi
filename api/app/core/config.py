from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    line_client_channel_access_token: str = Field(..., env="LINE_CLIENT_CHANNEL_ACCESS_TOKEN")
    line_client_channel_secret: str = Field(..., env="LINE_CLIENT_CHANNEL_SECRET")

    line_business_channel_access_token: str = Field(..., env="LINE_BUSINESS_CHANNEL_SECRET_TOKEN")
    line_business_channel_secret: str = Field(..., env="LINE_BUSINESS_CHANNEL_SECRET")

    google_calendar_credentials_path: str = Field(..., env="GOOGLE_CALENDAR_CREDENTIALS_PATH")
    business_calendar_id: str = Field(..., env="BUSINESS_CALENDAR_ID")
    
    database_url: str = Field(..., env="DATABASE_URL")



    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
