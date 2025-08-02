#!/bin/bash

echo "🚀 AI Coding Platform 시작하기"

# Python 가상환경 확인 및 생성
if [ ! -d "venv" ]; then
    echo "📦 Python 가상환경 생성 중..."
    python3 -m venv venv
fi

# 가상환경 활성화
echo "🔧 가상환경 활성화 중..."
source venv/bin/activate

# Python 의존성 설치
echo "📚 Python 패키지 설치 중..."
pip install -r requirements.txt

# 환경 변수 파일 확인
if [ ! -f ".env" ]; then
    echo "⚠️  .env 파일이 없습니다. env.example을 복사하여 설정하세요."
    echo "cp env.example .env"
    echo "그리고 .env 파일에서 API 키들을 설정하세요."
    exit 1
fi

# 백엔드 서버 시작
echo "🔧 백엔드 서버 시작 중..."
python main.py &

# 백엔드 서버 시작 대기
sleep 3

# 프론트엔드 의존성 설치 및 시작
echo "🎨 프론트엔드 설정 중..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "📦 Node.js 패키지 설치 중..."
    npm install
fi

echo "🚀 프론트엔드 서버 시작 중..."
npm start 