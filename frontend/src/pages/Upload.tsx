import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function Upload() {
  // State management: information the component needs to remember
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState('scvi_model');
  const [parameters, setParameters] = useState({
    n_latent: 10,
    n_epochs: 50  // Reduced for faster testing
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hook for page navigation
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get model information from URL (?model=scvi_model format)
  React.useEffect(() => {
    const modelFromUrl = searchParams.get('model');
    if (modelFromUrl) {
      setSelectedModel(modelFromUrl);
    }
  }, [searchParams]);

  // Function executed when file is selected
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file format
      const allowedTypes = ['.csv', '.h5ad'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!allowedTypes.includes(fileExtension)) {
        setError('Unsupported file format. Please select a .csv or .h5ad file.');
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
      setError(null);
      console.log('Selected file:', file.name, 'Size:', file.size, 'bytes');
    }
  };

  // Function executed when parameter value changes
  const handleParameterChange = (name: string, value: number) => {
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
      const response = await fetch(`http://localhost:8000/predict/${selectedModel}`, {
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
      <h1 className="page-title">Upload Data</h1>
      <p>Upload your single-cell data file for analysis.</p>

      <form onSubmit={handleSubmit}>
        {/* Model selection */}
        <div className="card">
          <h3>1. Select Model</h3>
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
            className="form-control"
          >
            <option value="scvi_model">scVI Model</option>
          </select>
        </div>

        {/* File upload */}
        <div className="card">
          <h3>2. Choose File</h3>
          <input
            type="file"
            accept=".csv,.h5ad"
            onChange={handleFileChange}
            className="form-control"
          />
          {selectedFile && (
            <div style={{marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px'}}>
              <p><strong>Selected file:</strong> {selectedFile.name}</p>
              <p><strong>Size:</strong> {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          )}
        </div>

        {/* Parameter settings */}
        <div className="card">
          <h3>3. Set Parameters</h3>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <div>
              <label>
                Latent Dimensions:
                <input
                  type="number"
                  value={parameters.n_latent}
                  onChange={(e) => handleParameterChange('n_latent', parseInt(e.target.value))}
                  min="1"
                  max="50"
                  className="form-control"
                />
              </label>
            </div>
            <div>
              <label>
                Training Epochs:
                <input
                  type="number"
                  value={parameters.n_epochs}
                  onChange={(e) => handleParameterChange('n_epochs', parseInt(e.target.value))}
                  min="1"
                  max="1000"
                  className="form-control"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="card" style={{backgroundColor: '#fff5f5', borderColor: '#fed7d7'}}>
            <p style={{color: 'red', margin: 0}}>{error}</p>
          </div>
        )}

        {/* Upload button */}
        <div className="card">
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={!selectedFile || uploading}
            style={{width: '100%', fontSize: '1.2rem'}}
          >
            {uploading ? 'Processing...' : 'Start Analysis'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Upload;
