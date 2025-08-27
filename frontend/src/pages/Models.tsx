import React, { useState, useEffect } from 'react';
import { API_CONFIG, buildApiUrl } from '../config/api';

// Type definition for model information (TypeScript)
interface Model {
  id: string;
  name: string;
  status: string;
}

// Type definition for model documentation
interface ModelDocumentation {
  simple_explanation: string;
  when_to_use: string[];
  features: string[];
  technical_details: string[];
  citation: string;
}

// Model documentation is now loaded dynamically from the backend API

function Models() {
  // State: information that the component needs to remember
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDocs, setExpandedDocs] = useState<{[key: string]: boolean}>({});
  const [modelDocs, setModelDocs] = useState<{[key: string]: ModelDocumentation}>({});

  // Function to fetch model list from backend
  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.MODELS));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setModels(data.models);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching models:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };

  // Function to load model documentation
  const loadModelDocumentation = async (modelId: string) => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.MODEL_DOCUMENTATION(modelId)));
      if (response.ok) {
        const data = await response.json();
        setModelDocs(prev => ({
          ...prev,
          [modelId]: data.documentation
        }));
      }
    } catch (error) {
      console.error('Failed to load documentation for', modelId, error);
    }
  };

  const toggleDocumentation = (modelId: string) => {
    setExpandedDocs(prev => ({
      ...prev,
      [modelId]: !prev[modelId]
    }));
    
    // Load documentation if not already loaded
    if (!modelDocs[modelId]) {
      loadModelDocumentation(modelId);
    }
  };

  // Screen to show while loading
  if (loading) {
    return (
      <div>
        <h2>Available AI Models</h2>
        <p>Loading models...</p>
      </div>
    );
  }

  // Screen to show if there's an error
  if (error) {
    return (
      <div>
        <h2>Available AI Models</h2>
        <div className="error" style={{color: 'red', padding: '1rem', border: '1px solid red', borderRadius: '4px'}}>
          <strong>Error loading models:</strong> {error}
          <br />
          <button onClick={fetchModels} style={{marginTop: '0.5rem'}}>Retry</button>
        </div>
      </div>
    );
  }

  // Main screen when models are loaded successfully
  return (
    <div>
      <h2>Available AI Models</h2>
      <p>Choose from our collection of pre-trained AI models for your data analysis needs.</p>
      
      {models.length === 0 ? (
        <p>No models available at the moment.</p>
      ) : (
        <>
          <div style={{display: 'grid', gap: '1.5rem'}}>
            {models.map((model) => (
              <div key={model.id} className="card" style={{border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden'}}>
                <div style={{padding: '1.5rem'}}>
                  {/* Header with model name and status */}
                  <div style={{marginBottom: '1.5rem'}}>
                    <h3 style={{margin: '0 0 0.75rem 0', color: '#333', fontSize: '1.5rem'}}>{model.name}</h3>
                    <span 
                      className={model.status === 'found' ? 'status-badge status-found' : 'status-badge status-not-found'}
                      style={{
                        padding: '0.4rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        backgroundColor: model.status === 'found' ? '#d4edda' : '#f8d7da',
                        color: model.status === 'found' ? '#155724' : '#721c24',
                        border: model.status === 'found' ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
                        display: 'inline-block'
                      }}
                    >
                      {model.status === 'found' ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                  
                  {/* Description */}
                  <p style={{margin: '0 0 1.5rem 0', color: '#666', fontSize: '1rem', lineHeight: '1.5'}}>
                    Click "Show Documentation" to learn about this model's capabilities and usage, or "Use Model" to start analyzing your data.
                  </p>
                  
                  {/* Action buttons - consistently aligned */}
                  <div style={{
                    display: 'flex', 
                    gap: '1rem', 
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}>
                    <button
                      onClick={() => toggleDocumentation(model.id)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: expandedDocs[model.id] ? '#6c757d' : '#17a2b8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        minWidth: '160px',
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      {expandedDocs[model.id] ? 'Hide Documentation' : 'Show Documentation'}
                    </button>
                    
                    <a
                      href={model.status === 'found' ? `/upload?model=${model.id}` : '#'}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: model.status === 'found' ? '#007bff' : '#6c757d',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        cursor: model.status === 'found' ? 'pointer' : 'not-allowed',
                        minWidth: '120px',
                        textAlign: 'center',
                        display: 'inline-block',
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      {model.status === 'found' ? 'Use Model' : 'Unavailable'}
                    </a>
                  </div>
                  
                  {/* Inline Documentation */}
                  {expandedDocs[model.id] && modelDocs[model.id] && (
                    <div style={{
                      marginTop: '1rem', 
                      padding: '1.5rem', 
                      background: '#f8f9fa', 
                      borderRadius: '8px',
                      border: '1px solid #e9ecef'
                    }}>
                      <h4 style={{color: '#495057', marginBottom: '1rem'}}>Model Documentation</h4>
                      
                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
                        {/* Simple Explanation */}
                        <div>
                          <h5 style={{color: '#28a745', marginBottom: '0.5rem'}}>What is this model?</h5>
                          <p style={{fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '500'}}>{modelDocs[model.id].simple_explanation}</p>
                        </div>

                        {/* When to Use */}
                        <div>
                          <h5 style={{color: '#28a745', marginBottom: '0.5rem'}}>When should I use this?</h5>
                          <ul style={{fontSize: '0.9rem', lineHeight: '1.5', paddingLeft: '1rem'}}>
                            {modelDocs[model.id].when_to_use.map((useCase, idx) => (
                              <li key={idx} style={{marginBottom: '0.4rem'}}>{useCase}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Features */}
                        <div>
                          <h5 style={{color: '#007bff', marginBottom: '0.5rem'}}>Features</h5>
                          <ul style={{fontSize: '0.9rem', lineHeight: '1.4', paddingLeft: '1rem'}}>
                            {modelDocs[model.id].features.map((feature, idx) => (
                              <li key={idx} style={{marginBottom: '0.3rem'}}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Technical Details */}
                        <div>
                          <h5 style={{color: '#007bff', marginBottom: '0.5rem'}}>Technical Details</h5>
                          <ul style={{fontSize: '0.85rem', lineHeight: '1.4', paddingLeft: '1rem'}}>
                            {modelDocs[model.id].technical_details.map((detail, idx) => (
                              <li key={idx} style={{marginBottom: '0.3rem'}}>{detail}</li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Citation */}
                        <div>
                          <h5 style={{color: '#6c757d', marginBottom: '0.5rem'}}>Citation</h5>
                          <p style={{fontSize: '0.85rem', color: '#666', fontStyle: 'italic'}}>
                            {modelDocs[model.id].citation}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Loading state for documentation */}
                  {expandedDocs[model.id] && !modelDocs[model.id] && (
                    <div style={{
                      marginTop: '1rem', 
                      padding: '1.5rem', 
                      background: '#f8f9fa', 
                      borderRadius: '8px',
                      border: '1px solid #e9ecef',
                      textAlign: 'center'
                    }}>
                      <p style={{color: '#666'}}>Loading documentation...</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="card" style={{background: '#e7f3ff', border: '1px solid #b8daff', marginTop: '2rem'}}>
            <h3 style={{color: '#004085', marginBottom: '1rem'}}>Quick Tips</h3>
            <ul style={{marginLeft: '1rem', color: '#004085'}}>
              <li><strong>Read the documentation</strong> first to understand model capabilities and requirements</li>
              <li><strong>Check file format requirements</strong> before uploading your data</li>
              <li><strong>Consider data size</strong> - larger datasets may take longer to process</li>
              <li><strong>Parameter tuning</strong> can significantly affect results quality</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default Models;