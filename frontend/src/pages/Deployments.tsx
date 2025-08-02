import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { RocketLaunchIcon, GlobeAltIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface Deployment {
  id: string;
  project_name: string;
  platform: string;
  status: string;
  url?: string;
  created_at: string;
  updated_at: string;
}

const Deployments: React.FC = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeployments();
  }, []);

  const fetchDeployments = async () => {
    try {
      // 실제로는 배포 목록 API를 호출
      // 임시 데이터 사용
      const mockDeployments: Deployment[] = [
        {
          id: '1',
          project_name: 'Todo App',
          platform: 'vercel',
          status: 'deployed',
          url: 'https://todo-app-123.vercel.app',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:35:00Z'
        },
        {
          id: '2',
          project_name: 'Portfolio Website',
          platform: 'github-pages',
          status: 'building',
          created_at: '2024-01-15T09:15:00Z',
          updated_at: '2024-01-15T09:15:00Z'
        }
      ];
      setDeployments(mockDeployments);
    } catch (error) {
      console.error('Error fetching deployments:', error);
      toast.error('배포 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDeployment = async (deploymentId: string) => {
    if (!confirm('정말로 이 배포를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await axios.delete(`/api/v1/deploy/${deploymentId}`);
      toast.success('배포가 삭제되었습니다.');
      fetchDeployments();
    } catch (error) {
      console.error('Error deleting deployment:', error);
      toast.error('배포 삭제에 실패했습니다.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'building':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'deployed':
        return '배포됨';
      case 'building':
        return '배포 중';
      case 'failed':
        return '실패';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'bg-green-100 text-green-800';
      case 'building':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'vercel':
        return '▲';
      case 'github-pages':
        return '📚';
      case 'netlify':
        return '🌐';
      default:
        return '🚀';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <RocketLaunchIcon className="w-6 h-6 mr-2 text-orange-600" />
              배포 관리
            </h1>
            <p className="text-gray-600">
              배포된 프로젝트들을 관리하고 모니터링할 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {deployments.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
          <RocketLaunchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            배포된 프로젝트가 없습니다
          </h3>
          <p className="text-gray-500 mb-6">
            아직 배포된 프로젝트가 없습니다. 코드를 생성하고 배포해보세요.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
              코드 생성하기
            </button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700">
              피그마 변환하기
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {deployments.map((deployment) => (
            <div key={deployment.id} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getPlatformIcon(deployment.platform)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{deployment.project_name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{deployment.platform}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(deployment.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deployment.status)}`}>
                      {getStatusText(deployment.status)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {deployment.url && (
                    <a
                      href={deployment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <GlobeAltIcon className="w-4 h-4 mr-1" />
                      사이트 보기
                    </a>
                  )}
                  
                  <div className="text-sm text-gray-500">
                    {formatDate(deployment.updated_at)}
                  </div>
                  
                  <button
                    onClick={() => handleDeleteDeployment(deployment.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Platform Info */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">지원되는 배포 플랫폼</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">▲</span>
              <h3 className="font-medium">Vercel</h3>
            </div>
            <p className="text-sm text-gray-600">모던 프론트엔드 배포 플랫폼</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">📚</span>
              <h3 className="font-medium">GitHub Pages</h3>
            </div>
            <p className="text-sm text-gray-600">무료 정적 사이트 호스팅</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">🌐</span>
              <h3 className="font-medium">Netlify</h3>
            </div>
            <p className="text-sm text-gray-600">올인원 웹 프로젝트 플랫폼</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deployments; 