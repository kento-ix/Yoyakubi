from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    line_channel_access_token: str = Field(..., env="LINE_CHANNEL_ACCESS_TOKEN")
    line_channel_secret: str = Field(..., env="LINE_CHANNEL_SECRET")

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
