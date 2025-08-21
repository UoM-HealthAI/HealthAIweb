import React, { useState, useEffect } from 'react';

// Type definition for model information (TypeScript)
interface Model {
  id: string;
  name: string;
  status: string;
}

function Models() {
  // State: information that the component needs to remember
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch model list from backend
  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      console.log('Fetching model list from backend...');
      const response = await fetch('http://localhost:8000/models');
      
      if (!response.ok) {
        throw new Error('Could not fetch model list');
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      setModels(data.models || []);
      setLoading(false);
    } catch (err) {
      console.error('Error occurred:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };

  // Screen to show while loading
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

  // Screen to show when error occurs
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
