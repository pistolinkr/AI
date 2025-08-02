from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Optional
from pydantic import BaseModel
from app.services.figma_service import figma_service
from app.services.gemini_service import gemini_service

router = APIRouter()

class FigmaFileRequest(BaseModel):
    file_key: str
    node_id: Optional[str] = None

class FigmaToCodeRequest(BaseModel):
    file_key: str
    node_id: Optional[str] = None
    framework: str = "react"
    include_images: bool = True

@router.post("/file")
async def get_figma_file(request: FigmaFileRequest):
    """피그마 파일 데이터 가져오기"""
    try:
        data = await figma_service.get_file_data(request.file_key, request.node_id)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/to-code")
async def figma_to_code(request: FigmaToCodeRequest):
    """피그마 디자인을 코드로 변환"""
    try:
        # 피그마 데이터 가져오기
        figma_data = await figma_service.get_file_data(request.file_key, request.node_id)
        
        # 디자인 토큰 추출
        design_tokens = await figma_service.extract_design_tokens(figma_data)
        
        # 코드 구조 파싱
        code_structure = await figma_service.parse_figma_to_code_structure(figma_data)
        
        # Gemini로 코드 생성
        generated_code = await gemini_service.generate_code_from_figma(
            figma_data, request.framework
        )
        
        # 이미지 처리 (필요시)
        images = {}
        if request.include_images:
            # 이미지 노드 ID 추출 및 다운로드 로직
            pass
        
        return {
            "success": True,
            "code": generated_code,
            "design_tokens": design_tokens,
            "structure": code_structure,
            "images": images
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/design-tokens/{file_key}")
async def extract_design_tokens(file_key: str, node_id: Optional[str] = None):
    """피그마에서 디자인 토큰 추출"""
    try:
        figma_data = await figma_service.get_file_data(file_key, node_id)
        design_tokens = await figma_service.extract_design_tokens(figma_data)
        return {"success": True, "design_tokens": design_tokens}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 