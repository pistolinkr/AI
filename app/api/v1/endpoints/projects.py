from fastapi import APIRouter, HTTPException
from typing import Dict, List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class ProjectCreateRequest(BaseModel):
    name: str
    description: str
    framework: str = "react"
    source_type: str = "description"  # description, figma, code
    source_data: Dict

class ProjectUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    code: Optional[Dict] = None

# 임시 프로젝트 저장소 (실제로는 데이터베이스 사용)
projects_db = {}

@router.post("/")
async def create_project(request: ProjectCreateRequest):
    """새 프로젝트 생성"""
    try:
        project_id = f"proj_{len(projects_db) + 1}"
        
        project = {
            "id": project_id,
            "name": request.name,
            "description": request.description,
            "framework": request.framework,
            "source_type": request.source_type,
            "source_data": request.source_data,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            "status": "created"
        }
        
        projects_db[project_id] = project
        
        return {
            "success": True,
            "project": project
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/")
async def list_projects():
    """프로젝트 목록 조회"""
    try:
        return {
            "success": True,
            "projects": list(projects_db.values())
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{project_id}")
async def get_project(project_id: str):
    """프로젝트 상세 조회"""
    try:
        if project_id not in projects_db:
            raise HTTPException(status_code=404, detail="Project not found")
        
        return {
            "success": True,
            "project": projects_db[project_id]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{project_id}")
async def update_project(project_id: str, request: ProjectUpdateRequest):
    """프로젝트 수정"""
    try:
        if project_id not in projects_db:
            raise HTTPException(status_code=404, detail="Project not found")
        
        project = projects_db[project_id]
        
        if request.name:
            project["name"] = request.name
        if request.description:
            project["description"] = request.description
        if request.code:
            project["code"] = request.code
        
        project["updated_at"] = datetime.now().isoformat()
        
        return {
            "success": True,
            "project": project
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{project_id}")
async def delete_project(project_id: str):
    """프로젝트 삭제"""
    try:
        if project_id not in projects_db:
            raise HTTPException(status_code=404, detail="Project not found")
        
        del projects_db[project_id]
        
        return {
            "success": True,
            "message": "Project deleted successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{project_id}/export")
async def export_project(project_id: str, format: str = "zip"):
    """프로젝트 내보내기"""
    try:
        if project_id not in projects_db:
            raise HTTPException(status_code=404, detail="Project not found")
        
        project = projects_db[project_id]
        
        # 실제 구현에서는 프로젝트 파일들을 압축하여 다운로드 링크 생성
        return {
            "success": True,
            "download_url": f"/api/v1/projects/{project_id}/download",
            "format": format
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 