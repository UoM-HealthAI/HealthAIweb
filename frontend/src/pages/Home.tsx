import React from 'react';

function Home() {
  return (
    <div>
      <h1 className="page-title">Welcome to HealthAI Web Platform</h1>
      <div className="card">
        <h2>Getting Started</h2>
        <p>
          This platform allows researchers to analyze their single-cell data using AI models.
        </p>
        <ol>
          <li>Go to <strong>Models</strong> to see available AI models</li>
          <li>Go to <strong>Upload</strong> to upload your data file</li>
          <li>View your results when processing is complete</li>
        </ol>
      </div>
      
      <div className="card">
        <h2>Supported File Formats</h2>
        <ul>
          <li><strong>.h5ad</strong> - AnnData format (recommended)</li>
          <li><strong>.csv</strong> - CSV format</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
