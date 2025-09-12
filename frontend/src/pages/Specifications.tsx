import React from 'react';

function Specifications() {
  return (
    <div>
      <div style={{textAlign: 'center', marginBottom: '2rem'}}>
        <h1 className="page-title">Specifications</h1>
        <p style={{fontSize: '1.2rem', color: '#666', marginTop: '1rem'}}>
          Technical specifications for models, data formats, and parameters
        </p>
      </div>


      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
        
        {/* Data Requirements */}
        <div className="card">
          <h2 style={{color: '#2c3e50', fontWeight: '500', marginBottom: '1.2rem'}}>Data Requirements</h2>
          
          <div style={{marginBottom: '1.5rem'}}>
            <h3 style={{color: '#2c3e50', fontSize: '1rem', marginBottom: '0.8rem', borderBottom: '1px solid #e0e0e0', paddingBottom: '0.3rem'}}>
              scVI Model
            </h3>
            <ul style={{fontSize: '0.9rem', color: '#666', paddingLeft: '1.2rem', lineHeight: '1.5'}}>
              <li><strong>Format:</strong> .h5ad (preferred) or .csv</li>
              <li><strong>Structure:</strong> Genes as rows, cells as columns</li>
              <li><strong>Size:</strong> 100+ cells, 500+ genes minimum</li>
              <li><strong>Data:</strong> Raw or normalized count matrices</li>
            </ul>
          </div>
          
          <div>
            <h3 style={{color: '#2c3e50', fontSize: '1rem', marginBottom: '0.8rem', borderBottom: '1px solid #e0e0e0', paddingBottom: '0.3rem'}}>
              Image Classifier
            </h3>
            <ul style={{fontSize: '0.9rem', color: '#666', paddingLeft: '1.2rem', lineHeight: '1.5'}}>
              <li><strong>Format:</strong> .jpg, .jpeg, .png</li>
              <li><strong>Size:</strong> Maximum 10MB per image</li>
              <li><strong>Quality:</strong> Clear, well-lit images preferred</li>
              <li><strong>Resolution:</strong> Any size (auto-resized)</li>
            </ul>
        </div>
      </div>

        {/* Key Parameters */}
      <div className="card">
          <h2 style={{color: '#2c3e50', fontWeight: '500', marginBottom: '1.2rem'}}>Key Parameters</h2>
          
          <div style={{marginBottom: '1.5rem'}}>
            <h3 style={{color: '#2c3e50', fontSize: '1rem', marginBottom: '0.8rem', borderBottom: '1px solid #e0e0e0', paddingBottom: '0.3rem'}}>
              scVI Model
            </h3>
            <div style={{fontSize: '0.9rem', color: '#666', lineHeight: '1.5'}}>
              <p><strong>Latent Dimensions (5-50):</strong> Higher values for complex datasets</p>
              <p><strong>Training Epochs (100-1000):</strong> More epochs for better results</p>
              <p><strong>Gene Likelihood:</strong> ZINB for raw counts, NB for normalized</p>
            </div>
          </div>
          
          <div>
            <h3 style={{color: '#2c3e50', fontSize: '1rem', marginBottom: '0.8rem', borderBottom: '1px solid #e0e0e0', paddingBottom: '0.3rem'}}>
              Image Classifier
            </h3>
            <div style={{fontSize: '0.9rem', color: '#666', lineHeight: '1.5'}}>
              <p><strong>Top-K Predictions (1-10):</strong> Number of predictions to show</p>
              <p><strong>Confidence Threshold (0.1-0.9):</strong> Minimum confidence for results</p>
          </div>
        </div>
      </div>

        {/* Results Guide */}
      <div className="card">
          <h2 style={{color: '#2c3e50', fontWeight: '500', marginBottom: '1.2rem'}}>Results Interpretation</h2>
          
          <div style={{marginBottom: '1.5rem'}}>
            <h3 style={{color: '#2c3e50', fontSize: '1rem', marginBottom: '0.8rem', borderBottom: '1px solid #e0e0e0', paddingBottom: '0.3rem'}}>
              scVI Output Files
            </h3>
            <ul style={{fontSize: '0.9rem', color: '#666', paddingLeft: '1.2rem', lineHeight: '1.5'}}>
              <li><strong>UMAP plot:</strong> Cell clustering visualization</li>
              <li><strong>Latent data (.csv):</strong> For downstream analysis</li>
              <li><strong>Processed data (.h5ad):</strong> Batch-corrected expression</li>
              <li><strong>Loss curve:</strong> Training convergence check</li>
            </ul>
          </div>

          <div>
            <h3 style={{color: '#2c3e50', fontSize: '1rem', marginBottom: '0.8rem', borderBottom: '1px solid #e0e0e0', paddingBottom: '0.3rem'}}>
              Image Classifier Output
            </h3>
            <ul style={{fontSize: '0.9rem', color: '#666', paddingLeft: '1.2rem', lineHeight: '1.5'}}>
              <li><strong>Prediction chart (.png):</strong> Top predictions with scores</li>
              <li><strong>Results (.csv):</strong> Class names and confidence values</li>
              <li><strong>Confidence data (.json):</strong> Detailed prediction metadata</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Specifications;