import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { SparklesIcon, CodeBracketIcon, PlayIcon } from '@heroicons/react/24/outline';
import CodeEditor from '../components/CodeEditor';
import axios from 'axios';

const CodeGenerator: React.FC = () => {
  const [description, setDescription] = useState('');
  const [framework, setFramework] = useState('react');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('description');

  const frameworks = [
    { id: 'react', name: 'React + TypeScript', icon: '⚛️' },
    { id: 'vue', name: 'Vue.js + TypeScript', icon: '🟢' },
    { id: 'angular', name: 'Angular', icon: '🔴' },
    { id: 'svelte', name: 'Svelte', icon: '🟠' }
  ];

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error('프로젝트 설명을 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await axios.post('/api/v1/code/generate', {
        description: description,
        framework: framework
      });

      if (response.data.success) {
        setGeneratedCode(response.data.code);
        toast.success('코드가 성공적으로 생성되었습니다!');
      } else {
        toast.error('코드 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error generating code:', error);
      toast.error('코드 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeploy = async () => {
    if (!generatedCode) {
      toast.error('먼저 코드를 생성해주세요.');
      return;
    }

    try {
      const response = await axios.post('/api/v1/deploy/deploy', {
        project_data: generatedCode,
        project_name: `project-${Date.now()}`,
        platform: 'vercel'
      });

      if (response.data.success) {
        toast.success('배포가 시작되었습니다!');
        window.open(response.data.deployment_url, '_blank');
      } else {
        toast.error('배포에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deploying:', error);
      toast.error('배포 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <SparklesIcon className="w-6 h-6 mr-2 text-blue-600" />
          AI 코드 생성기
        </h1>
        <p className="text-gray-600 mb-6">
          원하는 웹 애플리케이션에 대한 설명을 입력하면 AI가 완전한 코드를 생성합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">프로젝트 설정</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  프레임워크 선택
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {frameworks.map((fw) => (
                    <button
                      key={fw.id}
                      onClick={() => setFramework(fw.id)}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        framework === fw.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{fw.icon}</span>
                        <span className="text-sm font-medium">{fw.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  프로젝트 설명
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="예: 사용자가 할 일을 관리할 수 있는 Todo 앱을 만들어주세요. 추가, 삭제, 완료 표시 기능이 필요합니다."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !description.trim()}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    생성 중...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    코드 생성하기
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Example Prompts */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">예시 프롬프트</h3>
            <div className="space-y-3">
              {[
                "이커머스 상품 목록 페이지를 만들어주세요. 상품 카드, 필터링, 검색 기능이 필요합니다.",
                "개인 포트폴리오 웹사이트를 만들어주세요. 자기소개, 프로젝트 갤러리, 연락처 섹션이 필요합니다.",
                "날씨 정보를 보여주는 대시보드를 만들어주세요. 현재 날씨, 일주일 예보, 위치 검색 기능이 필요합니다."
              ].map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setDescription(prompt)}
                  className="w-full text-left p-3 text-sm text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          {generatedCode ? (
            <>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">생성된 코드</h2>
                  <button
                    onClick={handleDeploy}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center"
                  >
                    <PlayIcon className="w-4 h-4 mr-1" />
                    배포하기
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <div className="flex space-x-4">
                      {['main_file', 'components', 'package_json'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`text-sm font-medium ${
                            activeTab === tab
                              ? 'text-blue-600 border-b-2 border-blue-600'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {tab === 'main_file' ? 'App.tsx' : 
                           tab === 'components' ? 'Components' : 'package.json'}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {activeTab === 'main_file' && (
                      <CodeEditor
                        code={generatedCode.main_file || '// 코드가 없습니다.'}
                        language="typescript"
                        readOnly
                      />
                    )}
                    {activeTab === 'components' && (
                      <div className="space-y-4">
                        {generatedCode.components?.map((component: any, index: number) => (
                          <div key={index} className="border border-gray-200 rounded-lg">
                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                              <h4 className="text-sm font-medium text-gray-700">
                                {component.name}.tsx
                              </h4>
                            </div>
                            <CodeEditor
                              code={component.code || '// 코드가 없습니다.'}
                              language="typescript"
                              readOnly
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    {activeTab === 'package_json' && (
                      <CodeEditor
                        code={JSON.stringify(generatedCode.package_json || {}, null, 2)}
                        language="json"
                        readOnly
                      />
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-center py-12">
                <CodeBracketIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  코드를 생성해보세요
                </h3>
                <p className="text-gray-500">
                  왼쪽에서 프로젝트 설명을 입력하고 코드 생성을 시작하세요.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeGenerator; 