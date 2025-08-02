import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CodeBracketIcon, 
  PaintBrushIcon, 
  FolderIcon, 
  RocketLaunchIcon,
  SparklesIcon,
  BoltIcon,
  GlobeAltIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const features = [
    {
      title: 'AI Code Generation',
      description: '텍스트 설명을 바탕으로 완전한 웹 애플리케이션을 생성합니다.',
      icon: SparklesIcon,
      href: '/code-generator',
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500'
    },
    {
      title: 'Figma to Code',
      description: '피그마 디자인을 실제 코드로 변환합니다.',
      icon: PaintBrushIcon,
      href: '/figma-to-code',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      title: 'Project Management',
      description: '생성된 프로젝트를 관리하고 수정합니다.',
      icon: FolderIcon,
      href: '/projects',
      color: 'bg-gradient-to-r from-green-500 to-emerald-500'
    },
    {
      title: 'Auto Deployment',
      description: 'Vercel, GitHub Pages 등에 자동으로 배포합니다.',
      icon: RocketLaunchIcon,
      href: '/deployments',
      color: 'bg-gradient-to-r from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { name: 'Generated Projects', value: '127', icon: CodeBracketIcon },
    { name: 'Active Deployments', value: '89', icon: RocketLaunchIcon },
    { name: 'Figma Conversions', value: '43', icon: PaintBrushIcon },
    { name: 'Success Rate', value: '98%', icon: BoltIcon }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI로 코딩하는 미래를 경험하세요
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Gemini API를 활용한 강력한 AI 코딩 플랫폼으로 
          피그마 디자인을 코드로 변환하고 자동 배포까지 한 번에 해결하세요.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/code-generator"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            코드 생성 시작하기
          </Link>
          <Link
            to="/figma-to-code"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            피그마 변환하기
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">주요 기능</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.title}
              to={feature.href}
              className="group block bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${feature.color}`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="ml-4 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white p-8 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">작동 방식</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold text-lg">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">설명 입력</h3>
            <p className="text-gray-600">원하는 웹사이트나 앱에 대한 설명을 입력하거나 피그마 파일을 업로드하세요.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 font-bold text-lg">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">AI 코드 생성</h3>
            <p className="text-gray-600">Gemini AI가 설명을 분석하여 완전한 React/TypeScript 코드를 생성합니다.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 font-bold text-lg">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">자동 배포</h3>
            <p className="text-gray-600">생성된 코드를 Vercel이나 GitHub Pages에 자동으로 배포합니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 