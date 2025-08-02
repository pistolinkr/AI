from fastapi import APIRouter, HTTPException
from typing import Dict, Optional
from pydantic import BaseModel
from app.services.deployment_service import deployment_service

router = APIRouter()

class DeploymentRequest(BaseModel):
    project_data: Dict
    project_name: str
    platform: str = "vercel"  # vercel, github-pages, netlify

class DeploymentStatusRequest(BaseModel):
    project_id: str
    platform: str

@router.post("/deploy")
async def deploy_project(request: DeploymentRequest):
    """프로젝트 배포"""
    try:
        if request.platform == "vercel":
            result = await deployment_service.deploy_to_vercel(
                request.project_data, request.project_name
            )
        elif request.platform == "github-pages":
            result = await deployment_service.deploy_to_github_pages(
                request.project_data, request.project_name
            )
        else:
            raise HTTPException(status_code=400, detail="Unsupported platform")
        
        if result["success"]:
            return {
                "success": True,
                "deployment_url": result.get("url"),
                "project_id": result.get("project_id"),
                "platform": request.platform
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/status/{project_id}")
async def get_deployment_status(project_id: str, platform: str = "vercel"):
    """배포 상태 확인"""
    try:
        # 실제 구현에서는 배포 플랫폼 API를 호출하여 상태 확인
        return {
            "success": True,
            "project_id": project_id,
            "platform": platform,
            "status": "deployed",  # deployed, building, failed
            "last_updated": "2024-01-01T00:00:00Z"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{project_id}")
async def delete_deployment(project_id: str, platform: str = "vercel"):
    """배포 삭제"""
    try:
        # 실제 구현에서는 배포 플랫폼 API를 호출하여 삭제
        return {
            "success": True,
            "project_id": project_id,
            "platform": platform,
            "message": "Deployment deleted successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/platforms")
async def get_supported_platforms():
    """지원되는 배포 플랫폼 목록"""
    return {
        "success": True,
        "platforms": [
            {
                "id": "vercel",
                "name": "Vercel",
                "description": "Modern frontend deployment platform",
                "features": ["automatic deployments", "preview deployments", "custom domains"]
            },
            {
                "id": "github-pages",
                "name": "GitHub Pages",
                "description": "Static site hosting from GitHub repositories",
                "features": ["free hosting", "custom domains", "HTTPS"]
            },
            {
                "id": "netlify",
                "name": "Netlify",
                "description": "All-in-one platform for web projects",
                "features": ["continuous deployment", "form handling", "serverless functions"]
            }
        ]
    } 