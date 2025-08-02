import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { PaintBrushIcon, CodeBracketIcon, PlayIcon } from '@heroicons/react/24/outline';
import CodeEditor from '../components/CodeEditor';
import axios from 'axios';

const FigmaToCode: React.FC = () => {
  const [figmaUrl, setFigmaUrl] = useState('');
  const [framework, setFramework] = useState('react');
  const [isConverting, setIsConverting] = useState(false);
  const [convertedCode, setConvertedCode] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('main_file');

  const frameworks = [
    { id: 'react', name: 'React + TypeScript', icon: '⚛️' },
    { id: 'vue', name: 'Vue.js + TypeScript', icon: '🟢' },
    { id: 'angular', name: 'Angular', icon: '🔴' },
    { id: 'svelte', name: 'Svelte', icon: '🟠' }
  ];

  const extractFigmaFileKey = (url: string): string | null => {
    const match = url.match(/figma\.com\/file\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  const handleConvert = async () => {
    if (!figmaUrl.trim()) {
      toast.error('피그마 URL을 입력해주세요.');
      return;
    }

    const fileKey = extractFigmaFileKey(figmaUrl);
    if (!fileKey) {
      toast.error('올바른 피그마 URL을 입력해주세요.');
      return;
    }

    setIsConverting(true);
    try {
      const response = await axios.post('/api/v1/figma/to-code', {
        file_key: fileKey,
        framework: framework,
        include_images: true
      });

      if (response.data.success) {
        setConvertedCode(response.data.code);
        toast.success('피그마 디자인이 성공적으로 코드로 변환되었습니다!');
      } else {
        toast.error('변환에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error converting Figma:', error);
      toast.error('변환 중 오류가 발생했습니다.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleDeploy = async () => {
    if (!convertedCode) {
      toast.error('먼저 피그마를 변환해주세요.');
      return;
    }

    try {
      const response = await axios.post('/api/v1/deploy/deploy', {
        project_data: convertedCode,
        project_name: `figma-project-${Date.now()}`,
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
          <PaintBrushIcon className="w-6 h-6 mr-2 text-purple-600" />
          피그마 to 코드 변환기
        </h1>
        <p className="text-gray-600 mb-6">
          피그마 디자인 파일을 실제 웹 코드로 변환합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">피그마 설정</h2>
            
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
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
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
                  피그마 URL
                </label>
                <input
                  type="url"
                  value={figmaUrl}
                  onChange={(e) => setFigmaUrl(e.target.value)}
                  placeholder="https://www.figma.com/file/..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  피그마 파일의 공유 URL을 입력하세요.
                </p>
              </div>

              <button
                onClick={handleConvert}
                disabled={isConverting || !figmaUrl.trim()}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isConverting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    변환 중...
                  </>
                ) : (
                  <>
                    <PaintBrushIcon className="w-5 h-5 mr-2" />
                    코드로 변환하기
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">사용 방법</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                <p>피그마에서 변환하고 싶은 디자인 파일을 엽니다.</p>
              </div>
              <div className="flex items-start">
                <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                <p>Share 버튼을 클릭하고 "Copy link"를 선택합니다.</p>
              </div>
              <div className="flex items-start">
                <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                <p>복사된 URL을 위 입력창에 붙여넣고 변환을 시작합니다.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          {convertedCode ? (
            <>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">변환된 코드</h2>
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
                      {['main_file', 'components', 'design_tokens'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`text-sm font-medium ${
                            activeTab === tab
                              ? 'text-purple-600 border-b-2 border-purple-600'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {tab === 'main_file' ? 'App.tsx' : 
                           tab === 'components' ? 'Components' : 'Design Tokens'}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {activeTab === 'main_file' && (
                      <CodeEditor
                        code={convertedCode.main_file || '// 코드가 없습니다.'}
                        language="typescript"
                        readOnly
                      />
                    )}
                    {activeTab === 'components' && (
                      <div className="space-y-4">
                        {convertedCode.components?.map((component: any, index: number) => (
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
                    {activeTab === 'design_tokens' && (
                      <CodeEditor
                        code={JSON.stringify(convertedCode.design_tokens || {}, null, 2)}
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
                  피그마를 변환해보세요
                </h3>
                <p className="text-gray-500">
                  왼쪽에서 피그마 URL을 입력하고 변환을 시작하세요.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FigmaToCode; 