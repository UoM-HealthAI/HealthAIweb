import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ModelParameterForm } from '../components/ModelParameterForm';
import { getModelConfig, getAllModelConfigs } from '../config/modelConfig';

function Upload() {
  // State management: information the component needs to remember
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState('scvi_model');
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hook for page navigation
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get current model configuration
  const currentModelConfig = getModelConfig(selectedModel);
  const allModelConfigs = getAllModelConfigs();

  // Initialize parameters when model changes
  React.useEffect(() => {
    if (currentModelConfig) {
      const defaultParams: Record<string, any> = {};
      currentModelConfig.parameters.forEach(param => {
        defaultParams[param.name] = param.defaultValue;
      });
      setParameters(defaultParams);
    }
  }, [selectedModel, currentModelConfig]);

  // Get model information from URL (?model=scvi_model format)
  React.useEffect(() => {
    const modelFromUrl = searchParams.get('model');
    if (modelFromUrl && getModelConfig(modelFromUrl)) {
      setSelectedModel(modelFromUrl);
    }
  }, [searchParams]);

  // Function executed when file is selected
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && currentModelConfig) {
      // Check file format based on current model configuration
      const allowedTypes = currentModelConfig.supportedFileTypes;
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!allowedTypes.includes(fileExtension)) {
        const allowedTypesStr = allowedTypes.join(', ');
        setError(`Unsupported file format. Please select a file with one of these extensions: ${allowedTypesStr}`);
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
      setError(null);
      console.log('Selected file:', file.name, 'Size:', file.size, 'bytes');
    }
  };

  // Function executed when parameter value changes
  const handleParameterChange = (name: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function executed when upload button is clicked
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent page refresh
    
    if (!selectedFile) {
      setError('Please select a file.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      console.log('Starting file upload...');
      
      // FormData: format used when sending files to server
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('parameters', JSON.stringify(parameters));

      // Send file to backend
      const response = await fetch(`/api/predict/${selectedModel}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed.');
      }

      const result = await response.json();
      console.log('Upload result:', result);

      // Navigate to results page if successful
      if (result.task_id) {
        navigate(`/results/${result.task_id}`);
      } else {
        throw new Error('Did not receive task ID.');
      }

    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div style={{textAlign: 'center', marginBottom: '2rem'}}>
        <h1 className="page-title">Upload Your Data</h1>
        <p style={{fontSize: '1.1rem', color: '#666', marginBottom: '1rem'}}>
          {currentModelConfig 
            ? `Upload your data for ${currentModelConfig.description.toLowerCase()} analysis`
            : 'Upload your data for AI-powered analysis'
          }
        </p>
        
        {selectedModel && (
          <div style={{
            display: 'inline-block',
            background: '#e7f3ff',
            border: '1px solid #b8daff',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            color: '#004085'
          }}>
            Selected Model: <strong>{selectedModel.replace('_', ' ').toUpperCase()}</strong>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Model selection */}
        <div className="card">
          <h3>Step 1: Select AI Model</h3>
          <p style={{color: '#666', marginBottom: '1rem'}}>
            Choose the AI model for your analysis. Each model is optimized for different types of analysis.
          </p>
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
            className="form-control"
            style={{fontSize: '1.1rem', padding: '0.75rem'}}
          >
            {allModelConfigs.map((config) => (
              <option key={config.id} value={config.id}>
                {config.name} - {config.description}
              </option>
            ))}
          </select>
          {!selectedModel && (
            <p style={{color: '#856404', marginTop: '0.5rem', fontSize: '0.9rem'}}>
              Tip: Read the model documentation to understand its capabilities
            </p>
          )}
        </div>

        {/* File upload */}
        <div className="card">
          <h3>Step 2: Upload Your Data File</h3>
          <p style={{color: '#666', marginBottom: '1rem'}}>
            {currentModelConfig 
              ? `Select your data file. Supported formats: ${currentModelConfig.supportedFileTypes.join(', ')}`
              : 'Select your data file for analysis.'
            }
          </p>
          
          <div style={{
            border: '2px dashed #ddd',
            borderRadius: '8px',
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: selectedFile ? '#f8f9fa' : '#fafafa',
            transition: 'all 0.3s ease'
          }}>
            <input
              type="file"
              accept={currentModelConfig ? currentModelConfig.supportedFileTypes.join(',') : '*'}
              onChange={handleFileChange}
              className="form-control"
              style={{marginBottom: '1rem'}}
            />
            
            {!selectedFile ? (
              <div>
                <p style={{color: '#666', margin: '0.5rem 0'}}>
                  Drag and drop your file here or click to browse
                </p>
                <p style={{color: '#888', fontSize: '0.9rem', margin: 0}}>
                  Maximum file size: 500MB
                </p>
              </div>
            ) : (
              <div style={{
                background: '#d4edda',
                border: '1px solid #c3e6cb',
                borderRadius: '4px',
                padding: '1rem',
                marginTop: '1rem'
              }}>
                <p style={{color: '#155724', margin: 0, fontWeight: 'bold'}}>
                  File Selected: {selectedFile.name}
                </p>
                <p style={{color: '#155724', margin: '0.5rem 0 0 0', fontSize: '0.9rem'}}>
                  Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>
          
          <div style={{
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '4px',
            padding: '0.75rem',
            marginTop: '1rem'
          }}>
            <p style={{color: '#856404', margin: 0, fontSize: '0.9rem'}}>
              <strong>Tip:</strong> {currentModelConfig ? currentModelConfig.tipText : 'Choose the appropriate file format for your selected model'}
            </p>
          </div>
        </div>

        {/* Parameter settings */}
        {currentModelConfig && currentModelConfig.parameters.length > 0 && (
          <div className="card">
            <h3>Step 3: Configure Parameters</h3>
            <p style={{color: '#666', marginBottom: '1rem'}}>
              Adjust model parameters to optimize results for your data. Default values work well for most datasets.
            </p>
            
            <ModelParameterForm
              parameters={currentModelConfig.parameters}
              values={parameters}
              onChange={handleParameterChange}
            />
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="card" style={{
            backgroundColor: '#f8d7da', 
            border: '1px solid #f5c6cb', 
            borderRadius: '8px'
          }}>
            <h4 style={{color: '#721c24', marginBottom: '0.5rem'}}>Error</h4>
            <p style={{color: '#721c24', margin: 0}}>{error}</p>
          </div>
        )}

        {/* Upload button */}
        <div className="card" style={{textAlign: 'center'}}>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={!selectedFile || uploading}
            style={{
              width: '100%', 
              fontSize: '1.3rem',
              padding: '1rem 2rem',
              background: uploading ? '#6c757d' : (!selectedFile ? '#dee2e6' : '#2c3e50'),
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: (!selectedFile || uploading) ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {uploading ? 'Processing Your Data...' : 
             !selectedFile ? 'Please Select a File First' : 
             'Start AI Analysis'}
          </button>
          
          {!uploading && selectedFile && (
            <p style={{
              color: '#666', 
              marginTop: '1rem', 
              fontSize: '0.9rem'
            }}>
              {currentModelConfig 
                ? `Estimated processing time: ${currentModelConfig.processingTimeEstimate}`
                : 'Processing time varies by model and data size'
              }
            </p>
          )}
          
          {uploading && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '4px'
            }}>
              <p style={{color: '#856404', margin: 0, fontSize: '0.9rem'}}>
                <strong>Processing your data...</strong><br/>
                Please don't close this page. You'll be redirected to results when complete.
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default Upload;
