import React, { useState, useEffect } from 'react';

// 모델 정보를 담는 타입 정의 (TypeScript용)
interface Model {
  id: string;
  name: string;
  status: string;
}

function Models() {
  // 상태(state): 컴포넌트가 기억해야 할 정보들
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 백엔드에서 모델 목록을 가져오는 함수
  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      console.log('백엔드에서 모델 목록을 가져오는 중...');
      const response = await fetch('http://localhost:8000/models');
      
      if (!response.ok) {
        throw new Error('모델 목록을 가져올 수 없습니다');
      }
      
      const data = await response.json();
      console.log('받은 데이터:', data);
      
      setModels(data.models || []);
      setLoading(false);
    } catch (err) {
      console.error('에러 발생:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
      setLoading(false);
    }
  };

  // 로딩 중일 때 보여줄 화면
  if (loading) {
    return (
      <div>
        <h1 className="page-title">Available Models</h1>
        <div className="card">
          <p>Loading models...</p>
        </div>
      </div>
    );
  }

  // 에러가 발생했을 때 보여줄 화면
  if (error) {
    return (
      <div>
        <h1 className="page-title">Available Models</h1>
        <div className="card">
          <p style={{color: 'red'}}>Error: {error}</p>
          <button className="btn btn-primary" onClick={fetchModels}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Available Models</h1>
      <p>Select a model to use for your data analysis.</p>
      
      {models.length === 0 ? (
        <div className="card">
          <p>No models available.</p>
        </div>
      ) : (
        models.map((model) => (
          <div key={model.id} className="card">
            <h3>{model.name}</h3>
            <p>Status: <span style={{color: model.status === 'found' ? 'green' : 'red'}}>
              {model.status}
            </span></p>
            <div style={{marginTop: '1rem'}}>
              <a 
                href={`http://localhost:8001/models/${model.id}/`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{marginRight: '1rem'}}
              >
                ? Documentation
              </a>
              <a 
                href={`/upload?model=${model.id}`}
                className="btn btn-primary"
              >
                Use This Model
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Models;
