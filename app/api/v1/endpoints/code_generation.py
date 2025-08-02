from fastapi import APIRouter, HTTPException
from typing import Dict, Optional
from pydantic import BaseModel
from app.services.gemini_service import gemini_service

router = APIRouter()

class CodeGenerationRequest(BaseModel):
    description: str
    framework: str = "react"
    features: Optional[list] = []
    style_preference: Optional[str] = "modern"

class CodeOptimizationRequest(BaseModel):
    code: str
    optimization_type: str = "performance"
    language: str = "typescript"

class CodeDebugRequest(BaseModel):
    code: str
    error_message: str
    language: str = "typescript"

@router.post("/generate")
async def generate_code_from_description(request: CodeGenerationRequest):
    """텍스트 설명을 바탕으로 코드 생성"""
    try:
        result = await gemini_service.generate_code_from_description(
            request.description, request.framework
        )
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return {
            "success": True,
            "code": result,
            "framework": request.framework
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/optimize")
async def optimize_code(request: CodeOptimizationRequest):
    """코드 최적화"""
    try:
        optimized_code = await gemini_service.optimize_code(
            request.code, request.optimization_type
        )
        
        return {
            "success": True,
            "original_code": request.code,
            "optimized_code": optimized_code,
            "optimization_type": request.optimization_type
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/debug")
async def debug_code(request: CodeDebugRequest):
    """코드 디버깅"""
    try:
        debugged_code = await gemini_service.debug_code(
            request.code, request.error_message
        )
        
        return {
            "success": True,
            "original_code": request.code,
            "debugged_code": debugged_code,
            "error_message": request.error_message
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/enhance")
async def enhance_code(request: CodeOptimizationRequest):
    """코드 기능 향상"""
    try:
        # 기능 향상을 위한 프롬프트
        enhancement_prompt = f"""
        다음 코드를 기능적으로 향상시켜주세요:
        
        {request.code}
        
        향상 요구사항:
        1. 더 나은 사용자 경험
        2. 추가 기능 구현
        3. 코드 구조 개선
        4. 에러 처리 강화
        
        향상된 코드만 반환해주세요.
        """
        
        # Gemini 서비스의 모델을 직접 사용
        response = gemini_service.model.generate_content(enhancement_prompt)
        enhanced_code = response.text
        
        return {
            "success": True,
            "original_code": request.code,
            "enhanced_code": enhanced_code
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 