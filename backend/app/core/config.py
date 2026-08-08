import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "LAPOR-AI Backend"
    VERSION: str = "1.5"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "lapor-ai-super-secret-key-2026-fti-fest")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 1 day
    
    # LLM Provider (Gemini)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_BASE_URL: str = os.getenv("GEMINI_BASE_URL", "https://generativelanguage.googleapis.com/v1beta")
    PRIMARY_MODEL: str = os.getenv("PRIMARY_MODEL", "gemini-3.6-flash")
    FALLBACK_MODEL: str = os.getenv("FALLBACK_MODEL", "gemini-2.0-flash")
    
    # Database (PostgreSQL)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/lapor_ai")
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 10

    # Resend Email API
    RESEND_API_KEY: str = os.getenv("RESEND_API_KEY", "")
    RESEND_FROM_EMAIL: str = os.getenv("RESEND_FROM_EMAIL", "LAPOR-AI <noreply@lapor-ai.web.id>")

    class Config:
        case_sensitive = True

settings = Settings()
