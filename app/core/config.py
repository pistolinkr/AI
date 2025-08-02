import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API 설정
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Outer - AI Coding Platform"
    
    # Gemini API
    GEMINI_API_KEY: str
    
    # Database
    DATABASE_URL: str = "sqlite:///./ai_coding_platform.db"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # JWT
    JWT_SECRET_KEY: str = "your-secret-key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # GitHub OAuth
    GITHUB_CLIENT_ID: Optional[str] = None
    GITHUB_CLIENT_SECRET: Optional[str] = None
    
    # Vercel
    VERCEL_TOKEN: Optional[str] = None
    
    # Figma
    FIGMA_ACCESS_TOKEN: Optional[str] = None
    
    # OpenAI (백업용)
    OPENAI_API_KEY: Optional[str] = None
    
    class Config:
        env_file = ".env"

settings = Settings() 