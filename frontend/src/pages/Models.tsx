import React, { useState, useEffect } from 'react';

// Type definition for model information (TypeScript)
interface Model {
  id: string;
  name: string;
  status: string;
}

const scviDocumentation = {
  overview: "The scVI (Single-cell Variational Inference) model is a deep learning tool for single-cell RNA sequencing data analysis. It performs dimensionality reduction, batch correction, and data integration.",
  features: [
    "Dimensionality Reduction: Transforms high-dimensional gene expression data into low-dimensional representation",
    "Batch Correction: Removes technical batch effects while preserving biological variation", 
    "Data Integration: Combines multiple datasets for joint analysis",
    "Noise Modeling: Handles dropout and technical noise in scRNA-seq data"
  ],
  inputRequirements: {
    formats: [".h5ad files (AnnData format) - Recommended", ".csv files (genes as rows, cells as columns)"],
    requirements: ["Maximum file size: 500MB", "Minimum: 100 cells, 500 genes", "Raw or normalized count data"]
  },
  parameters: {
    userConfigurable: [
      "Latent Dimensions (default: 10, range: 5-50)",
      "Training Epochs (default: 400, range: 100-1000)"
    ],
    fixed: ["Learning Rate: 0.001", "Batch Size: 128"]
  },
  outputs: {
    visualizations: ["umap_plot.png - 2D UMAP visualization", "loss_curve.png - Training convergence plot"],
    dataFiles: [
      "latent_representation.csv - Low-dimensional cell embeddings",
      "processed_data.h5ad - Batch-corrected expression matrix", 
      "model_summary.json - Analysis summary"
    ]
  },
  usage: [
    "Prepare Data: Ensure correct format (.h5ad or .csv)",
    "Upload: Select scVI model and upload your file",
    "Configure: Adjust parameters if needed (default values work well)",
    "Run: Execute analysis and wait for completion",
    "Download: View results and download processed files"
  ],
  citation: "Lopez, R., et al. (2018). Deep generative modeling for single-cell transcriptomics. Nature Methods, 15(12), 1053-1058.",
  technicalDetails: [
    "Framework: scvi-tools",
    "Backend: PyTorch", 
    "Method: Variational Autoencoder",
    "Memory: 2-4GB RAM for typical datasets",
    "Processing Time: 2-10 minutes depending on data size"
  ]
};

function Models() {
  // State: information that the component needs to remember
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDocs, setExpandedDocs] = useState<{[key: string]: boolean}>({});

  // Function to fetch model list from backend
  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      console.log('Fetching model list from backend...');
      const response = await fetch('/models');
      
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

  const toggleDocumentation = (modelId: string) => {
    setExpandedDocs(prev => ({
      ...prev,
      [modelId]: !prev[modelId]
    }));
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
      <div style={{textAlign: 'center', marginBottom: '2rem'}}>
        <h1 className="page-title">Available AI Models</h1>
        <p style={{fontSize: '1.1rem', color: '#666'}}>
          Choose the best model for your single-cell RNA sequencing analysis
        </p>
      </div>
      
      {models.length === 0 ? (
        <div className="card" style={{textAlign: 'center', padding: '2rem'}}>
          <h3>No Models Available</h3>
          <p>Please check back later or contact the administrator.</p>
        </div>
      ) : (
        <>
          <div className="models-grid">
            {models.map((model) => (
              <div key={model.id} className="card" style={{
                border: model.status === 'found' ? '2px solid #28a745' : '2px solid #dc3545',
                position: 'relative'
              }}>
                {model.status === 'found' && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#28a745',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    READY
                  </div>
                )}
                
                <div style={{marginBottom: '1rem'}}>
                  <h3 style={{marginBottom: '0.5rem', display: 'flex', alignItems: 'center'}}>
                    {model.name}
                  </h3>
                  <div style={{
                    padding: '0.5rem',
                    background: model.status === 'found' ? '#d4edda' : '#f8d7da',
                    borderRadius: '4px',
                    marginBottom: '1rem'
                  }}>
                    <span style={{
                      color: model.status === 'found' ? '#155724' : '#721c24',
                      fontWeight: 'bold'
                    }}>
                      Status: {model.status === 'found' ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  
                  {model.id === 'scvi_model' && (
                    <div style={{marginBottom: '1rem', fontSize: '0.95rem', color: '#666'}}>
                      <p><strong>Features:</strong></p>
                      <ul style={{marginLeft: '1rem', marginTop: '0.5rem'}}>
                        <li>Dimensionality reduction</li>
                        <li>Batch effect correction</li>
                        <li>Data integration</li>
                        <li>Noise modeling</li>
                      </ul>
                    </div>
                  )}
                </div>
                
                <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                  <button 
                    onClick={() => toggleDocumentation(model.id)}
                    className="btn btn-secondary"
                    style={{flex: '1', minWidth: '120px'}}
                  >
                    {expandedDocs[model.id] ? 'Hide Documentation' : 'Show Documentation'}
                  </button>
                  <a 
                    href={`/upload?model=${model.id}`}
                    className="btn btn-primary"
                    style={{flex: '1', textAlign: 'center', textDecoration: 'none', minWidth: '120px'}}
                  >
                    {model.status === 'found' ? 'Use Model' : 'Unavailable'}
                  </a>
                </div>
                
                {/* Inline Documentation */}
                {expandedDocs[model.id] && model.id === 'scvi_model' && (
                  <div style={{
                    marginTop: '1rem', 
                    padding: '1.5rem', 
                    background: '#f8f9fa', 
                    borderRadius: '8px',
                    border: '1px solid #e9ecef'
                  }}>
                    <h4 style={{color: '#495057', marginBottom: '1rem'}}>scVI Model Documentation</h4>
                    
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
                      {/* Overview */}
                      <div>
                        <h5 style={{color: '#007bff', marginBottom: '0.5rem'}}>Overview</h5>
                        <p style={{fontSize: '0.9rem', lineHeight: '1.5'}}>{scviDocumentation.overview}</p>
                      </div>
                      
                      {/* Features */}
                      <div>
                        <h5 style={{color: '#007bff', marginBottom: '0.5rem'}}>Features</h5>
                        <ul style={{fontSize: '0.9rem', lineHeight: '1.4', paddingLeft: '1rem'}}>
                          {scviDocumentation.features.map((feature, idx) => (
                            <li key={idx} style={{marginBottom: '0.3rem'}}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Input Requirements */}
                      <div>
                        <h5 style={{color: '#007bff', marginBottom: '0.5rem'}}>Input Requirements</h5>
                        <div style={{marginBottom: '0.8rem'}}>
                          <strong style={{fontSize: '0.9rem'}}>Supported Formats:</strong>
                          <ul style={{fontSize: '0.85rem', marginTop: '0.3rem', paddingLeft: '1rem'}}>
                            {scviDocumentation.inputRequirements.formats.map((format, idx) => (
                              <li key={idx}>{format}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <strong style={{fontSize: '0.9rem'}}>Requirements:</strong>
                          <ul style={{fontSize: '0.85rem', marginTop: '0.3rem', paddingLeft: '1rem'}}>
                            {scviDocumentation.inputRequirements.requirements.map((req, idx) => (
                              <li key={idx}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      {/* Parameters */}
                      <div>
                        <h5 style={{color: '#007bff', marginBottom: '0.5rem'}}>Parameters</h5>
                        <div style={{marginBottom: '0.8rem'}}>
                          <strong style={{fontSize: '0.9rem'}}>User Configurable:</strong>
                          <ul style={{fontSize: '0.85rem', marginTop: '0.3rem', paddingLeft: '1rem'}}>
                            {scviDocumentation.parameters.userConfigurable.map((param, idx) => (
                              <li key={idx}>{param}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <strong style={{fontSize: '0.9rem'}}>Fixed Parameters:</strong>
                          <ul style={{fontSize: '0.85rem', marginTop: '0.3rem', paddingLeft: '1rem'}}>
                            {scviDocumentation.parameters.fixed.map((param, idx) => (
                              <li key={idx}>{param}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      {/* Output Files */}
                      <div>
                        <h5 style={{color: '#007bff', marginBottom: '0.5rem'}}>Output Files</h5>
                        <div style={{marginBottom: '0.8rem'}}>
                          <strong style={{fontSize: '0.9rem'}}>Visualizations:</strong>
                          <ul style={{fontSize: '0.85rem', marginTop: '0.3rem', paddingLeft: '1rem'}}>
                            {scviDocumentation.outputs.visualizations.map((viz, idx) => (
                              <li key={idx}>{viz}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <strong style={{fontSize: '0.9rem'}}>Data Files:</strong>
                          <ul style={{fontSize: '0.85rem', marginTop: '0.3rem', paddingLeft: '1rem'}}>
                            {scviDocumentation.outputs.dataFiles.map((file, idx) => (
                              <li key={idx}>{file}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      {/* Usage Steps */}
                      <div>
                        <h5 style={{color: '#007bff', marginBottom: '0.5rem'}}>Usage Steps</h5>
                        <ol style={{fontSize: '0.9rem', lineHeight: '1.4', paddingLeft: '1rem'}}>
                          {scviDocumentation.usage.map((step, idx) => (
                            <li key={idx} style={{marginBottom: '0.3rem'}}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                    
                    {/* Citation and Technical Details */}
                    <div style={{marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #dee2e6'}}>
                      <div style={{marginBottom: '1rem'}}>
                        <h5 style={{color: '#007bff', marginBottom: '0.5rem'}}>Citation</h5>
                        <p style={{fontSize: '0.85rem', fontStyle: 'italic', background: '#fff', padding: '0.5rem', borderRadius: '4px'}}>
                          {scviDocumentation.citation}
                        </p>
                      </div>
                      
                      <div>
                        <h5 style={{color: '#007bff', marginBottom: '0.5rem'}}>Technical Details</h5>
                        <ul style={{fontSize: '0.85rem', lineHeight: '1.4', paddingLeft: '1rem', columns: 2}}>
                          {scviDocumentation.technicalDetails.map((detail, idx) => (
                            <li key={idx} style={{marginBottom: '0.3rem', breakInside: 'avoid'}}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
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
