import React from 'react';

function Home() {
  return (
    <div>
      <div style={{textAlign: 'center', marginBottom: '2rem'}}>
        <h1 className="page-title">HealthAI Web Platform</h1>
        <p style={{fontSize: '1.2rem', color: '#666', marginTop: '1rem'}}>
          Advanced AI-powered single-cell RNA sequencing analysis for researchers
        </p>
      </div>

      <div className="card" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', marginBottom: '2rem'}}>
        <h2 style={{color: 'white', marginBottom: '1rem'}}>Quick Start Guide</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem'}}>
          <div style={{background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px'}}>
            <h3 style={{color: 'white', marginBottom: '0.5rem'}}>Step 1: Explore Models</h3>
            <p>Browse available AI models and read their documentation to understand their capabilities.</p>
            <a href="/models" style={{color: '#ffd700', textDecoration: 'underline'}}>View Models</a>
          </div>
          <div style={{background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px'}}>
            <h3 style={{color: 'white', marginBottom: '0.5rem'}}>Step 2: Upload Data</h3>
            <p>Select a model and upload your single-cell data file for analysis.</p>
            <a href="/upload" style={{color: '#ffd700', textDecoration: 'underline'}}>Upload Data</a>
          </div>
          <div style={{background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px'}}>
            <h3 style={{color: 'white', marginBottom: '0.5rem'}}>Step 3: View Results</h3>
            <p>Download processed data, visualizations, and analysis reports.</p>
            <span style={{color: '#ffd700'}}>Results page available after upload</span>
          </div>
        </div>
      </div>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
        <div className="card">
          <h2>Supported File Formats</h2>
          <div style={{marginTop: '1rem'}}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '0.8rem', padding: '0.5rem', background: '#f8f9fa', borderRadius: '4px'}}>
              <span style={{color: '#28a745', fontWeight: 'bold', marginRight: '0.5rem'}}>?</span>
              <div>
                <strong>.h5ad</strong> - AnnData format
                <div style={{fontSize: '0.9rem', color: '#666'}}>Recommended for single-cell data</div>
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', padding: '0.5rem', background: '#f8f9fa', borderRadius: '4px'}}>
              <span style={{color: '#17a2b8', fontWeight: 'bold', marginRight: '0.5rem'}}>?</span>
              <div>
                <strong>.csv</strong> - CSV format
                <div style={{fontSize: '0.9rem', color: '#666'}}>Genes as rows, cells as columns</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Available Models</h2>
          <div style={{marginTop: '1rem'}}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '0.8rem', padding: '0.5rem', background: '#f8f9fa', borderRadius: '4px'}}>
              <span style={{color: '#007bff', fontWeight: 'bold', marginRight: '0.5rem'}}>AI</span>
              <div>
                <strong>scVI Model</strong>
                <div style={{fontSize: '0.9rem', color: '#666'}}>Dimensionality reduction & batch correction</div>
              </div>
            </div>
            <div style={{padding: '0.5rem', background: '#fff3cd', borderRadius: '4px', border: '1px solid #ffeaa7'}}>
              <span style={{color: '#856404', fontSize: '0.9rem'}}>More models coming soon!</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Important Notes</h2>
          <ul style={{marginTop: '1rem', paddingLeft: '1rem'}}>
            <li style={{marginBottom: '0.5rem'}}><strong>File Size:</strong> Maximum 500MB</li>
            <li style={{marginBottom: '0.5rem'}}><strong>Processing Time:</strong> 2-10 minutes depending on data size</li>
            <li style={{marginBottom: '0.5rem'}}><strong>Data Privacy:</strong> Files are processed securely and not stored permanently</li>
            <li><strong>Results:</strong> Download your results promptly as they may be cleaned up after 24 hours</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
