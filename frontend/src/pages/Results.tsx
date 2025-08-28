import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_CONFIG, buildApiUrl } from '../config/api';

// Result data type definition matching API response
interface TaskResult {
  task_id: string;
  found: boolean;
  metadata: {
    task_id: string;
    model_id: string;
    filename: string;
    file_size: number;
    parameters: any;
    status: string;
    validation: any;
    execution_result: {
      status: string;
      visualizations?: {
        umap_plot?: string;
        loss_curve?: string;
      };
      data_files?: {
        latent_representation?: string;
        processed_data?: string;
      };
      metadata?: any;
    };
  };
}

function Results() {
  // Get task ID from URL (/results/abc123 gets abc123 part)
  const { taskId } = useParams<{ taskId: string }>();
  
  // State management
  const [result, setResult] = useState<TaskResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch results when page loads
  useEffect(() => {
    if (taskId) {
      fetchResult(taskId);
    }
  }, [taskId]);

  // Function to fetch results from backend
  const fetchResult = async (id: string) => {
    try {
      console.log('Fetching results... Task ID:', id);
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.TASKS(id)));
      
      if (!response.ok) {
        throw new Error('Could not fetch results.');
      }
      
      const data = await response.json();
      console.log('Received results:', data);
      
      if (data.found && data.metadata) {
        setResult(data);
      } else {
        throw new Error('Results not found.');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };

  // File download function
  const downloadFile = async (filePath: string, fileName: string) => {
    try {
      const response = await fetch(buildApiUrl(`/${filePath}`));
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    }
  };

  // Loading
  if (loading) {
    return (
      <div>
        <h1 className="page-title">Analysis Results</h1>
        <div className="card">
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  // Error occurred
  if (error) {
    return (
      <div>
        <h1 className="page-title">Analysis Results</h1>
        <div className="card">
          <p style={{color: 'red'}}>Error: {error}</p>
          <button className="btn btn-primary" onClick={() => taskId && fetchResult(taskId)}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No results
  if (!result) {
    return (
      <div>
        <h1 className="page-title">Analysis Results</h1>
        <div className="card">
          <p>No results found.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{textAlign: 'center', marginBottom: '2rem'}}>
        <h1 className="page-title">Analysis Results</h1>
        <p style={{fontSize: '1.1rem', color: '#666'}}>
          View your processed data, visualizations, and download files
        </p>
      </div>
      
      {/* Basic information */}
      <div className="card">
        <h3 style={{color: '#495057', marginBottom: '1rem'}}>Task Information</h3>
        <p><strong>Task ID:</strong> {result.task_id}</p>
        <p><strong>Model:</strong> {result.metadata.model_id}</p>
        <p><strong>Input File:</strong> {result.metadata.filename}</p>
        <p><strong>Status:</strong> 
          <span style={{
            color: result.metadata.status === 'completed' ? 'green' : 
                   result.metadata.status === 'failed' ? 'red' : 'orange',
            fontWeight: 'bold',
            marginLeft: '0.5rem'
          }}>
            {result.metadata.status}
          </span>
        </p>
        <p><strong>Parameters:</strong> {JSON.stringify(result.metadata.parameters)}</p>
      </div>

      {/* Display results if successful */}
      
      {result?.metadata?.status === 'completed' && result?.metadata?.execution_result && (
        <>
          {/* Visualization results */}
          {result.metadata.execution_result.visualizations && (
            <div className="card">
              <h3 style={{color: '#495057', marginBottom: '1rem'}}>Data Visualizations</h3>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
                {result.metadata.execution_result.visualizations.umap_plot && (
                  <div style={{
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    padding: '1rem',
                    background: '#f8f9fa'
                  }}>
                    <h4 style={{color: '#007bff', marginBottom: '1rem'}}>UMAP Visualization</h4>
                    <div style={{textAlign: 'center', marginBottom: '1rem'}}>
                      <img 
                        src={buildApiUrl(`/${result.metadata.execution_result.visualizations.umap_plot}`)}
                        alt="UMAP Plot"
                        style={{
                          width: '100%', 
                          maxWidth: '400px', 
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          background: 'white'
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling!.textContent = 'Image not available';
                        }}
                      />
                      <p style={{fontSize: '0.9rem', color: '#666', marginTop: '0.5rem'}}>
                        2D representation of your single-cell data
                      </p>
                    </div>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => downloadFile(result.metadata.execution_result.visualizations!.umap_plot!, 'umap_plot.png')}
                      style={{width: '100%'}}
                    >
                      Download UMAP Plot
                    </button>
                  </div>
                )}
                {result.metadata.execution_result.visualizations.loss_curve && (
                  <div style={{
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    padding: '1rem',
                    background: '#f8f9fa'
                  }}>
                    <h4 style={{color: '#007bff', marginBottom: '1rem'}}>Training Progress</h4>
                    <div style={{textAlign: 'center', marginBottom: '1rem'}}>
                      <img 
                        src={buildApiUrl(`/${result.metadata.execution_result.visualizations.loss_curve}`)}
                        alt="Loss Curve"
                        style={{
                          width: '100%', 
                          maxWidth: '400px', 
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          background: 'white'
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling!.textContent = 'Image not available';
                        }}
                      />
                      <p style={{fontSize: '0.9rem', color: '#666', marginTop: '0.5rem'}}>
                        Model training convergence over epochs
                      </p>
                    </div>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => downloadFile(result.metadata.execution_result.visualizations!.loss_curve!, 'loss_curve.png')}
                      style={{width: '100%'}}
                    >
                      Download Loss Curve
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Downloadable files */}
          {result.metadata.execution_result.data_files && (
            <div className="card">
              <h3 style={{color: '#495057', marginBottom: '1rem'}}>Download Processed Data</h3>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
                {result.metadata.execution_result.data_files.latent_representation && (
                  <div style={{
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    padding: '1rem',
                    background: '#f8f9fa'
                  }}>
                    <h4 style={{color: '#28a745', marginBottom: '0.5rem'}}>Latent Representation</h4>
                    <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
                      CSV file containing the low-dimensional embeddings of your cells
                    </p>
                    <div style={{background: '#e8f5e8', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem'}}>
                      <small style={{color: '#155724'}}>
                        <strong>Usage:</strong> Import into Python/R for further analysis or visualization
                      </small>
                    </div>
                    <button 
                      className="btn btn-success"
                      onClick={() => downloadFile(
                        result.metadata.execution_result.data_files!.latent_representation!, 
                        'latent_representation.csv'
                      )}
                      style={{width: '100%'}}
                    >
                      Download CSV File
                    </button>
                  </div>
                )}
                {result.metadata.execution_result.data_files.processed_data && (
                  <div style={{
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    padding: '1rem',
                    background: '#f8f9fa'
                  }}>
                    <h4 style={{color: '#28a745', marginBottom: '0.5rem'}}>Processed Dataset</h4>
                    <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
                      Complete H5AD file with batch-corrected data and metadata
                    </p>
                    <div style={{background: '#e8f5e8', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem'}}>
                      <small style={{color: '#155724'}}>
                        <strong>Usage:</strong> Load directly into scanpy, scvi-tools, or other analysis tools
                      </small>
                    </div>
                    <button 
                      className="btn btn-success"
                      onClick={() => downloadFile(
                        result.metadata.execution_result.data_files!.processed_data!, 
                        'processed_data.h5ad'
                      )}
                      style={{width: '100%'}}
                    >
                      Download H5AD File
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Display error information if failed */}
      {result.metadata.status === 'failed' && (
        <div className="card" style={{backgroundColor: '#fff5f5', borderColor: '#fed7d7'}}>
          <h3>Error Details</h3>
          <p style={{color: 'red'}}>Analysis failed. Please try again.</p>
        </div>
      )}
    </div>
  );
}

export default Results;
