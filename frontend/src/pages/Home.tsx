import React from 'react';

function Home() {
  return (
    <div>
      <div style={{textAlign: 'center', marginBottom: '2rem'}}>
        <h1 className="page-title">HealthAI Web Platform</h1>
        <p style={{fontSize: '1.2rem', color: '#666', marginTop: '1rem'}}>
          Advanced AI-powered analysis platform for biomedical research
        </p>
      </div>

      <div className="card" style={{background: '#fafafa', border: '1px solid #e0e0e0', marginBottom: '2rem'}}>
        <h2 style={{color: '#2c3e50', marginBottom: '1.5rem', fontWeight: '500'}}>Quick Start Guide</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem'}}>
          <div style={{
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '4px', 
            border: '1px solid #e0e0e0',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '160px'
          }}>
            <h3 style={{color: '#2c3e50', marginBottom: '0.8rem', fontWeight: '500', fontSize: '1.1rem'}}>Step 1: Explore Models</h3>
            <p style={{color: '#666', marginBottom: 'auto', lineHeight: '1.5', fontSize: '0.95rem'}}>
              Browse available AI models and read their documentation to understand their capabilities.
            </p>
            <a href="/models" style={{
              color: '#007bff', 
              textDecoration: 'none', 
              fontWeight: '500',
              marginTop: '1rem',
              fontSize: '0.95rem'
            }}>View Models</a>
          </div>
          <div style={{
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '4px', 
            border: '1px solid #e0e0e0',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '160px'
          }}>
            <h3 style={{color: '#2c3e50', marginBottom: '0.8rem', fontWeight: '500', fontSize: '1.1rem'}}>Step 2: Upload Data</h3>
            <p style={{color: '#666', marginBottom: 'auto', lineHeight: '1.5', fontSize: '0.95rem'}}>
              Select a model and upload your data file for analysis.
            </p>
            <a href="/upload" style={{
              color: '#007bff', 
              textDecoration: 'none', 
              fontWeight: '500',
              marginTop: '1rem',
              fontSize: '0.95rem'
            }}>Upload Data</a>
          </div>
          <div style={{
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '4px', 
            border: '1px solid #e0e0e0',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '160px'
          }}>
            <h3 style={{color: '#2c3e50', marginBottom: '0.8rem', fontWeight: '500', fontSize: '1.1rem'}}>Step 3: View Results</h3>
            <p style={{color: '#666', marginBottom: 'auto', lineHeight: '1.5', fontSize: '0.95rem'}}>
              Download processed data, visualizations, and analysis reports.
            </p>
            <span style={{
              color: '#888', 
              fontStyle: 'italic',
              marginTop: '1rem',
              fontSize: '0.9rem'
            }}>Results page available after upload</span>
          </div>
        </div>
      </div>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
        <div className="card">
          <h2 style={{color: '#2c3e50', fontWeight: '500', marginBottom: '1.2rem'}}>Supported File Formats</h2>
          <div style={{marginTop: '1rem'}}>
            <div style={{padding: '1rem', background: '#fafafa', borderRadius: '4px', marginBottom: '0.8rem', borderLeft: '3px solid #28a745'}}>
              <div style={{fontWeight: '500', color: '#28a745', marginBottom: '0.4rem', fontSize: '0.95rem'}}>.h5ad - AnnData format</div>
              <div style={{fontSize: '0.9rem', color: '#666', lineHeight: '1.4'}}>Single-cell RNA sequencing data</div>
            </div>
            <div style={{padding: '1rem', background: '#fafafa', borderRadius: '4px', marginBottom: '0.8rem', borderLeft: '3px solid #17a2b8'}}>
              <div style={{fontWeight: '500', color: '#17a2b8', marginBottom: '0.4rem', fontSize: '0.95rem'}}>.csv - CSV format</div>
              <div style={{fontSize: '0.9rem', color: '#666', lineHeight: '1.4'}}>Tabular data (genes as rows, cells as columns)</div>
            </div>
            <div style={{padding: '1rem', background: '#fafafa', borderRadius: '4px', borderLeft: '3px solid #6f42c1'}}>
              <div style={{fontWeight: '500', color: '#6f42c1', marginBottom: '0.4rem', fontSize: '0.95rem'}}>.jpg, .png - Image formats</div>
              <div style={{fontSize: '0.9rem', color: '#666', lineHeight: '1.4'}}>Medical images for classification analysis</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 style={{color: '#2c3e50', fontWeight: '500', marginBottom: '1.2rem'}}>Available Models</h2>
          <div style={{marginTop: '1rem'}}>
            <div style={{padding: '1rem', background: '#fafafa', borderRadius: '4px', marginBottom: '0.8rem', borderLeft: '3px solid #007bff'}}>
              <div style={{fontWeight: '500', color: '#007bff', marginBottom: '0.5rem', fontSize: '0.95rem'}}>scVI Model</div>
              <div style={{fontSize: '0.9rem', color: '#666', marginBottom: '0.6rem', lineHeight: '1.4'}}>
                Advanced dimensionality reduction and batch effect correction for single-cell RNA sequencing data
              </div>
              <div style={{fontSize: '0.85rem', color: '#888', lineHeight: '1.3'}}>
                | UMAP visualization | Latent representation | Processed datasets (.h5ad, .csv)
              </div>
            </div>
            <div style={{padding: '1rem', background: '#fafafa', borderRadius: '4px', marginBottom: '0.8rem', borderLeft: '3px solid #6f42c1'}}>
              <div style={{fontWeight: '500', color: '#6f42c1', marginBottom: '0.5rem', fontSize: '0.95rem'}}>Image Classifier</div>
              <div style={{fontSize: '0.9rem', color: '#666', marginBottom: '0.6rem', lineHeight: '1.4'}}>
                Object recognition and classification using ResNet deep learning architecture
              </div>
              <div style={{fontSize: '0.85rem', color: '#888', lineHeight: '1.3'}}>
                | Top-K predictions | Confidence scores | Classification charts (.png, .csv, .json)
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 style={{color: '#2c3e50', fontWeight: '500', marginBottom: '1.2rem'}}>Important Notes</h2>
          <div style={{marginTop: '1rem'}}>
            <div style={{padding: '0.8rem', marginBottom: '0.7rem', background: '#fafafa', borderRadius: '4px', borderLeft: '3px solid #6c757d'}}>
              <strong style={{color: '#2c3e50', fontSize: '0.9rem'}}>File Size:</strong> <span style={{color: '#666', fontSize: '0.9rem'}}>Maximum 500MB</span>
            </div>
            <div style={{padding: '0.8rem', marginBottom: '0.7rem', background: '#fafafa', borderRadius: '4px', borderLeft: '3px solid #6c757d'}}>
              <strong style={{color: '#2c3e50', fontSize: '0.9rem'}}>Processing Time:</strong> <span style={{color: '#666', fontSize: '0.9rem'}}>2-10 minutes depending on data complexity</span>
            </div>
            <div style={{padding: '0.8rem', marginBottom: '0.7rem', background: '#fafafa', borderRadius: '4px', borderLeft: '3px solid #6c757d'}}>
              <strong style={{color: '#2c3e50', fontSize: '0.9rem'}}>Data Privacy:</strong> <span style={{color: '#666', fontSize: '0.9rem'}}>Files are processed securely and not stored permanently</span>
            </div>
            <div style={{padding: '0.8rem', background: '#fafafa', borderRadius: '4px', borderLeft: '3px solid #6c757d'}}>
              <strong style={{color: '#2c3e50', fontSize: '0.9rem'}}>Results:</strong> <span style={{color: '#666', fontSize: '0.9rem'}}>Download your results promptly as they may be cleaned up after 24 hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
