import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

                                                
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(base_dir, ".env"))
load_dotenv(os.path.join(base_dir, "..", ".env"))

class Settings(BaseSettings):
    PROJECT_NAME: str = "LAPOR-AI Backend"
    VERSION: str = "1.5"
    API_V1_STR: str = "/api/v1"
    
              
    SECRET_KEY: str = os.getenv("SECRET_KEY") or "lapor-ai-super-secret-key-2026-fti-fest"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24        
    
                           
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY") or ""
    GEMINI_BASE_URL: str = os.getenv("GEMINI_BASE_URL") or "https://generativelanguage.googleapis.com/v1beta"
    PRIMARY_MODEL: str = os.getenv("PRIMARY_MODEL") or "gemini-3.6-flash"
    FALLBACK_MODEL: str = os.getenv("FALLBACK_MODEL") or "gemini-2.0-flash"
    
                           
    DATABASE_URL: str = os.getenv("DATABASE_URL") or "postgresql://postgres:password@localhost:5432/lapor_ai"
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 10

                      
    RESEND_API_KEY: str = os.getenv("RESEND_API_KEY", "")
    RESEND_FROM_EMAIL: str = os.getenv("RESEND_FROM_EMAIL", "LAPOR-AI <noreply@lapor-ai.web.id>")

    APP_BASE_URL: str = os.getenv("APP_BASE_URL", "")
    class Config:
        case_sensitive = True

settings = Settings()
