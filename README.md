# AI Coding Platform

Gemini API를 활용한 AI 코딩 플랫폼입니다. 피그마 디자인을 코드로 변환하고, 텍스트 설명을 바탕으로 완전한 웹 애플리케이션을 생성하며, 자동 배포까지 지원합니다.

## 🚀 주요 기능

- **AI 코드 생성**: 텍스트 설명을 바탕으로 React/TypeScript 코드 생성
- **피그마 to 코드**: 피그마 디자인을 실제 웹 코드로 변환
- **자동 배포**: Vercel, GitHub Pages 등에 자동 배포
- **프로젝트 관리**: 생성된 프로젝트 관리 및 수정
- **실시간 미리보기**: 코드 생성 결과 실시간 확인

## 🛠️ 기술 스택

### Backend
- **FastAPI**: 고성능 Python 웹 프레임워크
- **Gemini API**: Google의 AI 모델 활용
- **SQLAlchemy**: 데이터베이스 ORM
- **Redis**: 캐싱 및 세션 관리

### Frontend
- **React 18**: 사용자 인터페이스
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 스타일링
- **React Router**: 라우팅
- **Axios**: HTTP 클라이언트

### 배포 플랫폼
- **Vercel**: 프론트엔드 배포
- **GitHub Pages**: 정적 사이트 호스팅
- **Netlify**: 올인원 웹 플랫폼

## 📦 설치 및 실행

### 1. 환경 설정

```bash
# 저장소 클론
git clone <repository-url>
cd ai-coding-platform

# Python 가상환경 생성
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Python 의존성 설치
pip install -r requirements.txt
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Database
DATABASE_URL=sqlite:///./ai_coding_platform.db

# JWT Secret
JWT_SECRET_KEY=your_jwt_secret_key_here

# GitHub OAuth (선택사항)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Vercel (선택사항)
VERCEL_TOKEN=your_vercel_token

# Figma (선택사항)
FIGMA_ACCESS_TOKEN=your_figma_access_token
```

### 3. 백엔드 실행

```bash
# 백엔드 서버 실행
python main.py
```

백엔드는 `http://localhost:8000`에서 실행됩니다.

### 4. 프론트엔드 실행

```bash
# 프론트엔드 디렉토리로 이동
cd frontend

# Node.js 의존성 설치
npm install

# 개발 서버 실행
npm start
```

프론트엔드는 `http://localhost:3000`에서 실행됩니다.

## 🎯 사용 방법

### 1. AI 코드 생성

1. **코드 생성기** 페이지로 이동
2. 원하는 프레임워크 선택 (React, Vue, Angular, Svelte)
3. 프로젝트 설명 입력
4. **코드 생성하기** 버튼 클릭
5. 생성된 코드 확인 및 배포

### 2. 피그마 to 코드 변환

1. **피그마 to 코드** 페이지로 이동
2. 피그마 파일 URL 입력
3. 프레임워크 선택
4. **코드로 변환하기** 버튼 클릭
5. 변환된 코드 확인 및 배포

### 3. 프로젝트 배포

1. 생성된 코드에서 **배포하기** 버튼 클릭
2. 배포 플랫폼 선택 (Vercel, GitHub Pages, Netlify)
3. 배포 완료 후 사이트 URL 확인

## 📚 API 문서

API 문서는 `http://localhost:8000/docs`에서 확인할 수 있습니다.

### 주요 엔드포인트

- `POST /api/v1/code/generate`: 텍스트 설명을 바탕으로 코드 생성
- `POST /api/v1/figma/to-code`: 피그마 디자인을 코드로 변환
- `POST /api/v1/deploy/deploy`: 프로젝트 배포
- `GET /api/v1/projects/`: 프로젝트 목록 조회

## 🔧 개발 가이드

### 프로젝트 구조

```
ai-coding-platform/
├── app/                    # FastAPI 백엔드
│   ├── api/               # API 엔드포인트
│   ├── core/              # 설정 및 유틸리티
│   └── services/          # 비즈니스 로직
├── frontend/              # React 프론트엔드
│   ├── src/
│   │   ├── components/    # 재사용 가능한 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   └── services/      # API 호출 서비스
│   └── public/            # 정적 파일
├── requirements.txt       # Python 의존성
└── main.py               # 앱 진입점
```

### 새로운 기능 추가

1. **백엔드**: `app/services/`에 새로운 서비스 클래스 추가
2. **API**: `app/api/v1/endpoints/`에 새로운 엔드포인트 추가
3. **프론트엔드**: `frontend/src/pages/`에 새로운 페이지 추가

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🙏 감사의 말

- [Google Gemini API](https://ai.google.dev/) - AI 모델 제공
- [Figma API](https://www.figma.com/developers) - 디자인 데이터 접근
- [Vercel](https://vercel.com/) - 배포 플랫폼
- [FastAPI](https://fastapi.tiangolo.com/) - 웹 프레임워크
- [React](https://reactjs.org/) - 프론트엔드 라이브러리

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요. 