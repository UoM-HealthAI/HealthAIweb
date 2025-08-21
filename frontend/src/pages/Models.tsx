import React, { useState, useEffect } from 'react';

// �� ������ ��� Ÿ�� ���� (TypeScript��)
interface Model {
  id: string;
  name: string;
  status: string;
}

function Models() {
  // ����(state): ������Ʈ�� ����ؾ� �� ������
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // �鿣�忡�� �� ����� �������� �Լ�
  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      console.log('�鿣�忡�� �� ����� �������� ��...');
      const response = await fetch('http://localhost:8000/models');
      
      if (!response.ok) {
        throw new Error('�� ����� ������ �� �����ϴ�');
      }
      
      const data = await response.json();
      console.log('���� ������:', data);
      
      setModels(data.models || []);
      setLoading(false);
    } catch (err) {
      console.error('���� �߻�:', err);
      setError(err instanceof Error ? err.message : '�� �� ���� ����');
      setLoading(false);
    }
  };

  // �ε� ���� �� ������ ȭ��
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

  // ������ �߻����� �� ������ ȭ��
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
