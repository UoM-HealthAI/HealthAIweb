import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Result data type definition
interface TaskResult {
  task_id: string;
  status: string;
  message: string;
  results?: {
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
  error_details?: {
    error_message: string;
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
      const response = await fetch(`http://localhost:8000/tasks/${id}`);
      
      if (!response.ok) {
        throw new Error('Could not fetch results.');
      }
      
      const data = await response.json();
      console.log('Received results:', data);
      
      if (data.found && data.metadata) {
        setResult(data.metadata);
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
  const downloadFile = (filePath: string, fileName: string) => {
    // In reality, backend should provide file download API
    // Here we simply display the path
    console.log('Download:', filePath);
    alert(`Download feature is still under development.\nFile path: ${filePath}`);
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
      <h1 className="page-title">Analysis Results</h1>
      
              {/* Basic information */}
      <div className="card">
        <h3>Task Information</h3>
        <p><strong>Task ID:</strong> {result.task_id}</p>
        <p><strong>Status:</strong> 
          <span style={{
            color: result.status === 'completed' ? 'green' : 
                   result.status === 'failed' ? 'red' : 'orange',
            fontWeight: 'bold',
            marginLeft: '0.5rem'
          }}>
            {result.status}
          </span>
        </p>
        <p><strong>Message:</strong> {result.message}</p>
      </div>

      {/* Display results if successful */}
      {result.status === 'completed' && result.results && (
        <>
          {/* Visualization results */}
          {result.results.visualizations && (
            <div className="card">
              <h3>Visualizations</h3>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                {result.results.visualizations.umap_plot && (
                  <div>
                    <h4>UMAP Plot</h4>
                    <img 
                      src={`http://localhost:8000/${result.results.visualizations.umap_plot}`}
                      alt="UMAP Plot"
                      style={{width: '100%', maxWidth: '400px', border: '1px solid #ddd'}}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling!.textContent = 'Image not available';
                      }}
                    />
                    <p style={{fontSize: '0.9rem', color: '#666'}}>
                      UMAP visualization of the processed data
                    </p>
                  </div>
                )}
                {result.results.visualizations.loss_curve && (
                  <div>
                    <h4>Training Loss</h4>
                    <img 
                      src={`http://localhost:8000/${result.results.visualizations.loss_curve}`}
                      alt="Loss Curve"
                      style={{width: '100%', maxWidth: '400px', border: '1px solid #ddd'}}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling!.textContent = 'Image not available';
                      }}
                    />
                    <p style={{fontSize: '0.9rem', color: '#666'}}>
                      Model training loss curve
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Downloadable files */}
          {result.results.data_files && (
            <div className="card">
              <h3>Download Results</h3>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                {result.results.data_files.latent_representation && (
                  <div>
                    <h4>Latent Representation</h4>
                    <p>CSV file containing the processed latent representation</p>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => downloadFile(
                        result.results!.data_files!.latent_representation!, 
                        'latent_representation.csv'
                      )}
                    >
                      Download CSV
                    </button>
                  </div>
                )}
                {result.results.data_files.processed_data && (
                  <div>
                    <h4>Processed Data</h4>
                    <p>H5AD file containing the full processed dataset</p>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => downloadFile(
                        result.results!.data_files!.processed_data!, 
                        'processed_data.h5ad'
                      )}
                    >
                      Download H5AD
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Display error information if failed */}
      {result.status === 'failed' && result.error_details && (
        <div className="card" style={{backgroundColor: '#fff5f5', borderColor: '#fed7d7'}}>
          <h3>Error Details</h3>
          <p style={{color: 'red'}}>{result.error_details.error_message}</p>
        </div>
      )}
    </div>
  );
}

export default Results;
