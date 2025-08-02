from fastapi import APIRouter
from app.api.v1.endpoints import figma, code_generation, deployment, projects

api_router = APIRouter()

api_router.include_router(figma.router, prefix="/figma", tags=["figma"])
api_router.include_router(code_generation.router, prefix="/code", tags=["code-generation"])
api_router.include_router(deployment.router, prefix="/deploy", tags=["deployment"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"]) 