import httpx
import json
import os
import subprocess
from typing import Dict, List, Optional
from app.core.config import settings

class DeploymentService:
    def __init__(self):
        self.vercel_token = settings.VERCEL_TOKEN
        
    async def deploy_to_vercel(self, project_data: Dict, project_name: str) -> Dict:
        """Vercel에 프로젝트 배포"""
        
        try:
            # 임시 디렉토리 생성
            temp_dir = f"/tmp/{project_name}"
            os.makedirs(temp_dir, exist_ok=True)
            
            # package.json 생성
            package_json = project_data.get("package_json", {})
            with open(f"{temp_dir}/package.json", "w") as f:
                json.dump(package_json, f, indent=2)
            
            # 메인 파일 생성
            main_file = project_data.get("main_file", "")
            with open(f"{temp_dir}/src/App.tsx", "w") as f:
                f.write(main_file)
            
            # 컴포넌트 파일들 생성
            components = project_data.get("components", [])
            for component in components:
                component_name = component["name"]
                component_code = component["code"]
                with open(f"{temp_dir}/src/components/{component_name}.tsx", "w") as f:
                    f.write(component_code)
            
            # README 생성
            readme = project_data.get("readme", "")
            with open(f"{temp_dir}/README.md", "w") as f:
                f.write(readme)
            
            # Vercel CLI 설치 및 배포
            result = subprocess.run([
                "npx", "vercel", "--token", self.vercel_token,
                "--yes", "--prod"
            ], cwd=temp_dir, capture_output=True, text=True)
            
            if result.returncode == 0:
                # 배포 URL 추출
                deployment_url = self._extract_vercel_url(result.stdout)
                return {
                    "success": True,
                    "url": deployment_url,
                    "project_id": project_name
                }
            else:
                return {
                    "success": False,
                    "error": result.stderr
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def deploy_to_github_pages(self, project_data: Dict, repo_name: str) -> Dict:
        """GitHub Pages에 배포"""
        
        try:
            # GitHub 저장소 생성
            repo_url = await self._create_github_repo(repo_name)
            
            # 로컬 저장소 초기화
            temp_dir = f"/tmp/{repo_name}"
            os.makedirs(temp_dir, exist_ok=True)
            
            # 파일들 생성
            await self._create_project_files(temp_dir, project_data)
            
            # Git 초기화 및 푸시
            subprocess.run(["git", "init"], cwd=temp_dir)
            subprocess.run(["git", "add", "."], cwd=temp_dir)
            subprocess.run(["git", "commit", "-m", "Initial commit"], cwd=temp_dir)
            subprocess.run(["git", "branch", "-M", "main"], cwd=temp_dir)
            subprocess.run(["git", "remote", "add", "origin", repo_url], cwd=temp_dir)
            subprocess.run(["git", "push", "-u", "origin", "main"], cwd=temp_dir)
            
            # GitHub Pages 활성화
            pages_url = await self._enable_github_pages(repo_name)
            
            return {
                "success": True,
                "url": pages_url,
                "repo_url": repo_url
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def _create_github_repo(self, repo_name: str) -> str:
        """GitHub 저장소 생성"""
        
        headers = {
            "Authorization": f"token {settings.GITHUB_CLIENT_SECRET}",
            "Accept": "application/vnd.github.v3+json"
        }
        
        data = {
            "name": repo_name,
            "description": f"AI-generated project: {repo_name}",
            "private": False,
            "auto_init": False
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.github.com/user/repos",
                headers=headers,
                json=data
            )
            
            if response.status_code == 201:
                return response.json()["clone_url"]
            else:
                raise Exception(f"GitHub repo creation failed: {response.text}")
    
    async def _enable_github_pages(self, repo_name: str) -> str:
        """GitHub Pages 활성화"""
        
        headers = {
            "Authorization": f"token {settings.GITHUB_CLIENT_SECRET}",
            "Accept": "application/vnd.github.v3+json"
        }
        
        data = {
            "source": {
                "branch": "main",
                "path": "/"
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://api.github.com/repos/{repo_name}/pages",
                headers=headers,
                json=data
            )
            
            if response.status_code == 201:
                return f"https://{repo_name}.github.io"
            else:
                raise Exception(f"GitHub Pages activation failed: {response.text}")
    
    async def _create_project_files(self, temp_dir: str, project_data: Dict):
        """프로젝트 파일들 생성"""
        
        # package.json
        package_json = project_data.get("package_json", {})
        with open(f"{temp_dir}/package.json", "w") as f:
            json.dump(package_json, f, indent=2)
        
        # 메인 파일
        main_file = project_data.get("main_file", "")
        os.makedirs(f"{temp_dir}/src", exist_ok=True)
        with open(f"{temp_dir}/src/App.tsx", "w") as f:
            f.write(main_file)
        
        # 컴포넌트들
        components = project_data.get("components", [])
        os.makedirs(f"{temp_dir}/src/components", exist_ok=True)
        for component in components:
            component_name = component["name"]
            component_code = component["code"]
            with open(f"{temp_dir}/src/components/{component_name}.tsx", "w") as f:
                f.write(component_code)
        
        # README
        readme = project_data.get("readme", "")
        with open(f"{temp_dir}/README.md", "w") as f:
            f.write(readme)
    
    def _extract_vercel_url(self, output: str) -> str:
        """Vercel CLI 출력에서 URL 추출"""
        lines = output.split("\n")
        for line in lines:
            if "https://" in line and "vercel.app" in line:
                return line.strip()
        return ""

deployment_service = DeploymentService() 