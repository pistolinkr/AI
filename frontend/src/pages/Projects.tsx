import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FolderIcon, PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface Project {
  id: string;
  name: string;
  description: string;
  framework: string;
  created_at: string;
  status: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/v1/projects/');
      if (response.data.success) {
        setProjects(response.data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('프로젝트 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await axios.delete(`/api/v1/projects/${projectId}`);
      toast.success('프로젝트가 삭제되었습니다.');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('프로젝트 삭제에 실패했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFrameworkIcon = (framework: string) => {
    const icons: { [key: string]: string } = {
      react: '⚛️',
      vue: '🟢',
      angular: '🔴',
      svelte: '🟠'
    };
    return icons[framework] || '📁';
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
              <FolderIcon className="w-6 h-6 mr-2 text-green-600" />
              프로젝트 관리
            </h1>
            <p className="text-gray-600">
              생성된 프로젝트들을 관리하고 수정할 수 있습니다.
            </p>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center">
            <PlusIcon className="w-4 h-4 mr-2" />
            새 프로젝트
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
          <FolderIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            프로젝트가 없습니다
          </h3>
          <p className="text-gray-500 mb-6">
            아직 생성된 프로젝트가 없습니다. 코드 생성기나 피그마 변환기를 사용해보세요.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getFrameworkIcon(project.framework)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.framework}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 text-gray-400 hover:text-blue-600">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-green-600">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{formatDate(project.created_at)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === 'created' ? 'bg-green-100 text-green-800' :
                  project.status === 'deployed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status === 'created' ? '생성됨' :
                   project.status === 'deployed' ? '배포됨' : project.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects; 