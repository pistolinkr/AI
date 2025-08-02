import google.generativeai as genai
from typing import Dict, List, Optional
import json
import re
from app.core.config import settings

class GeminiService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')
        
    async def generate_code_from_figma(self, figma_data: Dict, framework: str = "react") -> Dict:
        """피그마 디자인을 코드로 변환"""
        
        prompt = f"""
        피그마 디자인을 {framework} 코드로 변환해주세요.
        
        피그마 데이터:
        {json.dumps(figma_data, indent=2, ensure_ascii=False)}
        
        요구사항:
        1. 모던하고 반응형 디자인
        2. TypeScript 사용
        3. Tailwind CSS 스타일링
        4. 컴포넌트 기반 구조
        5. 접근성 고려
        
        다음 형식으로 응답해주세요:
        {{
            "components": [
                {{
                    "name": "ComponentName",
                    "code": "// TypeScript/React 코드",
                    "dependencies": ["react", "tailwindcss"]
                }}
            ],
            "main_file": "// 메인 App.tsx 코드",
            "package_json": {{
                "dependencies": {{}},
                "devDependencies": {{}}
            }},
            "readme": "프로젝트 설명"
        }}
        """
        
        try:
            response = self.model.generate_content(prompt)
            result = json.loads(response.text)
            return result
        except Exception as e:
            return {"error": str(e)}
    
    async def generate_code_from_description(self, description: str, framework: str = "react") -> Dict:
        """텍스트 설명을 코드로 변환"""
        
        prompt = f"""
        다음 설명을 바탕으로 {framework} 애플리케이션을 만들어주세요:
        
        {description}
        
        요구사항:
        1. 완전한 웹 애플리케이션
        2. TypeScript 사용
        3. 모던 UI/UX
        4. 반응형 디자인
        5. 실제 배포 가능한 코드
        
        다음 형식으로 응답해주세요:
        {{
            "components": [
                {{
                    "name": "ComponentName",
                    "code": "// TypeScript/React 코드",
                    "dependencies": ["react", "tailwindcss"]
                }}
            ],
            "main_file": "// 메인 App.tsx 코드",
            "package_json": {{
                "dependencies": {{}},
                "devDependencies": {{}}
            }},
            "readme": "프로젝트 설명"
        }}
        """
        
        try:
            response = self.model.generate_content(prompt)
            result = json.loads(response.text)
            return result
        except Exception as e:
            return {"error": str(e)}
    
    async def optimize_code(self, code: str, optimization_type: str = "performance") -> str:
        """코드 최적화"""
        
        prompt = f"""
        다음 코드를 {optimization_type} 관점에서 최적화해주세요:
        
        {code}
        
        최적화 포인트:
        1. 성능 개선
        2. 코드 가독성
        3. 모범 사례 적용
        4. 버그 수정
        
        최적화된 코드만 반환해주세요.
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"최적화 실패: {str(e)}"
    
    async def debug_code(self, code: str, error_message: str) -> str:
        """코드 디버깅"""
        
        prompt = f"""
        다음 코드에서 발생한 오류를 수정해주세요:
        
        코드:
        {code}
        
        오류 메시지:
        {error_message}
        
        수정된 코드와 설명을 제공해주세요.
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"디버깅 실패: {str(e)}"

gemini_service = GeminiService() 