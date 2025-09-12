import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ModelResultsDisplay } from '../components/ModelResultsDisplay';
import { getModelConfig } from '../config/modelConfig';

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
      visualizations?: Record<string, string>;
      data_files?: Record<string, string>;
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
      
      const response = await fetch(`/api/tasks/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Results data:', data);
      
      if (data.found) {
        setResult(data);
      } else {
        setError('Task not found');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };

  // Function to download files
  const downloadFile = async (filePath: string, filename: string) => {
    try {
      console.log('Downloading file:', filePath, 'as:', filename);
      
      // Create absolute URL if needed
      const url = filePath.startsWith('http') ? filePath : `${window.location.origin}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
      
      // Fetch the file content
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
      }
      
      // Get the blob
      const blob = await response.blob();
      
      // Create download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(link.href);
      
    } catch (err) {
      console.error('Download error:', err);
      alert(`Download failed: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: '3rem'}}>
        <h2>Loading Results...</h2>
        <p style={{color: '#666'}}>Please wait while we fetch your analysis results</p>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '2rem auto'
        }}></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div style={{textAlign: 'center', padding: '3rem'}}>
        <h2 style={{color: '#dc3545'}}>Error Loading Results</h2>
        <p style={{color: '#666', marginBottom: '2rem'}}>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show results if available
  if (!result) {
    return (
      <div style={{textAlign: 'center', padding: '3rem'}}>
        <h2>No Results Found</h2>
        <p style={{color: '#666'}}>The requested analysis results could not be found.</p>
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

      {/* Task Information Card */}
      <div className="card" style={{marginBottom: '2rem'}}>
        <h3 style={{color: '#495057', marginBottom: '1rem'}}>Task Information</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '0.5rem 2rem',
          alignItems: 'center'
        }}>
          <strong>Task ID:</strong>
          <span style={{fontFamily: 'monospace', fontSize: '0.9rem'}}>{result.metadata.task_id}</span>
          
          <strong>Model:</strong>
          <span>{result.metadata.model_id.replace('_', ' ')}</span>
          
          <strong>Input File:</strong>
          <span>{result.metadata.filename}</span>
          
          <strong>Status:</strong>
          <span style={{
            color: result.metadata.status === 'completed' ? '#28a745' : 
                   result.metadata.status === 'failed' ? '#dc3545' : '#ffc107',
            fontWeight: 'bold'
          }}>
            {result.metadata.status}
          </span>
          
          <strong>Parameters:</strong>
          <span style={{fontFamily: 'monospace', fontSize: '0.9rem'}}>
            {JSON.stringify(result.metadata.parameters)}
          </span>
        </div>
      </div>

      {/* Display results if successful */}
      {result?.metadata?.status === 'completed' && result?.metadata?.execution_result && (
        <>
          {/* Dynamic Results Display */}
          {(() => {
            const modelConfig = getModelConfig(result.metadata.model_id);
            if (!modelConfig) {
              return (
                <div className="card">
                  <h3 style={{color: '#dc3545'}}>Configuration Error</h3>
                  <p>Model configuration not found for: {result.metadata.model_id}</p>
                </div>
              );
            }
            
            return (
              <ModelResultsDisplay
                modelConfig={modelConfig}
                visualizations={result.metadata.execution_result.visualizations || {}}
                dataFiles={result.metadata.execution_result.data_files || {}}
                onDownload={downloadFile}
              />
            );
          })()}
        </>
      )}

      {/* Display error information if failed */}
      {result.metadata.status === 'failed' && (
        <div className="card" style={{
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb'
        }}>
          <h3 style={{color: '#721c24', marginBottom: '1rem'}}>Error Details</h3>
          <p style={{color: '#721c24', margin: 0}}>
            Analysis failed. Please try again.
          </p>
        </div>
      )}
    </div>
  );
}

export default Results;