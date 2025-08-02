import httpx
from typing import Dict, List, Optional
from app.core.config import settings

class FigmaService:
    def __init__(self):
        self.access_token = settings.FIGMA_ACCESS_TOKEN
        self.base_url = "https://api.figma.com/v1"
        
    async def get_file_data(self, file_key: str, node_id: Optional[str] = None) -> Dict:
        """피그마 파일 데이터 가져오기"""
        
        headers = {
            "X-Figma-Token": self.access_token
        }
        
        url = f"{self.base_url}/files/{file_key}"
        if node_id:
            url += f"?ids={node_id}"
            
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            return response.json()
    
    async def get_file_images(self, file_key: str, node_ids: List[str], format: str = "svg") -> Dict:
        """피그마 이미지 가져오기"""
        
        headers = {
            "X-Figma-Token": self.access_token
        }
        
        ids = ",".join(node_ids)
        url = f"{self.base_url}/images/{file_key}?ids={ids}&format={format}"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            return response.json()
    
    async def extract_design_tokens(self, figma_data: Dict) -> Dict:
        """피그마 데이터에서 디자인 토큰 추출"""
        
        design_tokens = {
            "colors": {},
            "typography": {},
            "spacing": {},
            "components": []
        }
        
        def extract_node(node):
            if "fills" in node:
                for fill in node["fills"]:
                    if fill.get("type") == "SOLID":
                        color = fill["color"]
                        color_key = f"color-{len(design_tokens['colors'])}"
                        design_tokens["colors"][color_key] = {
                            "r": color["r"],
                            "g": color["g"], 
                            "b": color["b"],
                            "a": color.get("a", 1)
                        }
            
            if "style" in node and "fontFamily" in node["style"]:
                font_key = f"font-{len(design_tokens['typography'])}"
                design_tokens["typography"][font_key] = {
                    "fontFamily": node["style"]["fontFamily"],
                    "fontSize": node["style"].get("fontSize", 16),
                    "fontWeight": node["style"].get("fontWeight", 400)
                }
            
            if "children" in node:
                for child in node["children"]:
                    extract_node(child)
        
        # 문서 전체 순회
        if "document" in figma_data:
            extract_node(figma_data["document"])
        
        return design_tokens
    
    async def parse_figma_to_code_structure(self, figma_data: Dict) -> Dict:
        """피그마 데이터를 코드 구조로 파싱"""
        
        code_structure = {
            "components": [],
            "layout": {},
            "styles": {}
        }
        
        def parse_node(node, parent_name=""):
            component = {
                "name": node.get("name", "Unknown"),
                "type": node.get("type", "FRAME"),
                "bounds": node.get("absoluteBoundingBox", {}),
                "children": [],
                "styles": {}
            }
            
            # 스타일 정보 추출
            if "fills" in node:
                component["styles"]["background"] = node["fills"]
            
            if "strokes" in node:
                component["styles"]["border"] = node["strokes"]
            
            if "style" in node:
                component["styles"]["typography"] = node["style"]
            
            # 자식 요소 처리
            if "children" in node:
                for child in node["children"]:
                    child_component = parse_node(child, component["name"])
                    component["children"].append(child_component)
            
            return component
        
        if "document" in figma_data:
            code_structure["components"] = [parse_node(figma_data["document"])]
        
        return code_structure

figma_service = FigmaService() 