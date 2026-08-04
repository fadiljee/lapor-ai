import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "LAPOR-AI Backend"
    VERSION: str = "1.5"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "lapor-ai-super-secret-key-2026-fti-fest")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 1 day
    
    # LLM Provider
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    PRIMARY_MODEL: str = os.getenv("PRIMARY_MODEL", "llama-3.3-70b-versatile")
    FALLBACK_MODEL: str = os.getenv("FALLBACK_MODEL", "llama3-8b-8192")
    
    # Database (PostgreSQL)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/lapor_ai")
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 10

    class Config:
        case_sensitive = True

settings = Settings()
