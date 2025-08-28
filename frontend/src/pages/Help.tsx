import React from 'react';

function Help() {
  return (
    <div>
      <div style={{textAlign: 'center', marginBottom: '2rem'}}>
        <h1 className="page-title">HealthAI Web Platform User Guide</h1>
        <p style={{fontSize: '1.1rem', color: '#666'}}>
          Complete guide for analyzing single-cell RNA sequencing data with AI models
        </p>
      </div>

      {/* Quick Start Guide */}
      <div className="card">
        <h2>Quick Start Guide</h2>
        <p><strong>New to the platform? Follow these steps to analyze your data:</strong></p>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem'}}>
          <div style={{padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #007bff'}}>
            <h3 style={{color: '#007bff', marginBottom: '1rem'}}>Step 1: Choose Your Model</h3>
            <p style={{fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1rem'}}>
              Visit the <strong>Models</strong> page to explore available AI models and select the best one for your analysis needs.
            </p>
            <div style={{background: '#e7f3ff', padding: '0.8rem', borderRadius: '4px', fontSize: '0.85rem'}}>
              <strong>Tip:</strong> scVI model is excellent for batch effect removal and dimensionality reduction
            </div>
          </div>
          
          <div style={{padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #28a745'}}>
            <h3 style={{color: '#28a745', marginBottom: '1rem'}}>Step 2: Upload Your Data</h3>
            <p style={{fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1rem'}}>
              Go to the <strong>Upload</strong> page to upload your .h5ad or .csv file and configure analysis parameters.
            </p>
            <div style={{background: '#d4edda', padding: '0.8rem', borderRadius: '4px', fontSize: '0.85rem'}}>
              <strong>Recommended:</strong> .h5ad files provide faster and more accurate processing
            </div>
          </div>
          
          <div style={{padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #ffc107'}}>
            <h3 style={{color: '#e67e22', marginBottom: '1rem'}}>Step 3: View Results</h3>
            <p style={{fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1rem'}}>
              Check the <strong>Results</strong> page for analysis outputs, visualizations, and download processed data.
            </p>
            <div style={{background: '#fff3cd', padding: '0.8rem', borderRadius: '4px', fontSize: '0.85rem'}}>
              <strong>Processing Time:</strong> Analysis typically takes 2-10 minutes depending on data size
            </div>
          </div>
        </div>
      </div>

      {/* For Lab Members */}
      <div className="card">
        <h2>Lab-Specific Guidelines</h2>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem'}}>
          <div>
            <h3 style={{color: '#28a745', borderBottom: '2px solid #28a745', paddingBottom: '0.5rem'}}>Data Preparation</h3>
            <ul style={{paddingLeft: '1.2rem', lineHeight: '1.6'}}>
              <li><strong>Cell Ranger outputs</strong> can be used directly</li>
              <li><strong>Scanpy preprocessing</strong> recommended before uploading .h5ad files</li>
              <li><strong>Quality control</strong> filtering of dead cells and doublets is advised</li>
              <li><strong>Gene filtering</strong> remove lowly expressed genes for better results</li>
              <li><strong>File size</strong> keep under 500MB for optimal performance</li>
            </ul>
          </div>
          
          <div>
            <h3 style={{color: '#007bff', borderBottom: '2px solid #007bff', paddingBottom: '0.5rem'}}>Experiment-Specific Settings</h3>
            <ul style={{paddingLeft: '1.2rem', lineHeight: '1.6'}}>
              <li><strong>Batch effects present</strong> include batch information in obs metadata</li>
              <li><strong>Small datasets</strong> set n_epochs to 200-400</li>
              <li><strong>Large datasets</strong> increase n_latent to 30-50</li>
              <li><strong>Research-grade analysis</strong> use higher epoch counts (800-1000)</li>
              <li><strong>Quick testing</strong> use lower epoch counts (100-200)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Supported File Formats */}
      <div className="card">
        <h2>Supported File Formats</h2>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
          <div style={{border: '2px solid #28a745', borderRadius: '8px', padding: '1.5rem'}}>
            <h3 style={{color: '#28a745', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              H5AD Files (Highly Recommended)
            </h3>
            <ul style={{paddingLeft: '1.2rem', lineHeight: '1.5'}}>
              <li><strong>Format:</strong> AnnData HDF5 format</li>
              <li><strong>Advantages:</strong> Preserves metadata, faster processing</li>
              <li><strong>Use case:</strong> Standard output from Scanpy analysis</li>
              <li><strong>Size limit:</strong> Maximum 500MB</li>
            </ul>
            <div style={{background: '#d4edda', padding: '0.8rem', borderRadius: '4px', marginTop: '1rem', fontSize: '0.9rem'}}>
              <strong>Scanpy example:</strong><br/>
              <code>adata.write('your_data.h5ad')</code>
            </div>
          </div>
          
          <div style={{border: '2px solid #17a2b8', borderRadius: '8px', padding: '1.5rem'}}>
            <h3 style={{color: '#17a2b8', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              CSV Files
            </h3>
            <ul style={{paddingLeft: '1.2rem', lineHeight: '1.5'}}>
              <li><strong>Format:</strong> Comma-separated values</li>
              <li><strong>Structure:</strong> Genes (rows) x Cells (columns)</li>
              <li><strong>Use case:</strong> Simple count matrices without metadata</li>
              <li><strong>Size limit:</strong> Maximum 500MB</li>
            </ul>
            <div style={{background: '#d1ecf1', padding: '0.8rem', borderRadius: '4px', marginTop: '1rem', fontSize: '0.9rem'}}>
              <strong>Important:</strong> First column should contain gene names, first row should contain cell IDs
            </div>
          </div>
        </div>
      </div>

      {/* Data Requirements */}
      <div className="card">
        <h2>Data Requirements</h2>
        
        <div style={{background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '6px', padding: '1rem', marginBottom: '1rem'}}>
          <h4 style={{color: '#856404', marginTop: 0}}>Minimum Requirements</h4>
          <ul style={{color: '#856404', paddingLeft: '1.2rem'}}>
            <li>At least 100 cells</li>
            <li>At least 500 genes</li>
            <li>Raw or normalized count data</li>
            <li>Proper file formatting (see format specifications above)</li>
          </ul>
        </div>

        <div style={{background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '6px', padding: '1rem'}}>
          <h4 style={{color: '#155724', marginTop: 0}}>Recommendations for Best Results</h4>
          <ul style={{color: '#155724', paddingLeft: '1.2rem'}}>
            <li>1,000+ cells for robust statistical analysis</li>
            <li>2,000+ genes for comprehensive biological insights</li>
            <li>Include batch information in metadata when available</li>
            <li>Perform quality control filtering before upload</li>
            <li>Remove ambient RNA and doublets using standard tools</li>
          </ul>
        </div>
      </div>

      {/* Parameter Configuration */}
      <div className="card">
        <h2>Parameter Configuration Guide</h2>
        
        <div style={{background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e9ecef'}}>
          <h3 style={{color: '#495057', marginBottom: '1rem'}}>scVI Model Parameters</h3>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem'}}>
            <div>
              <h4 style={{color: '#007bff', marginBottom: '0.5rem'}}>Latent Dimensions</h4>
              <ul style={{fontSize: '0.9rem', paddingLeft: '1.2rem'}}>
                <li><strong>Range:</strong> 5-50</li>
                <li><strong>Default:</strong> 10</li>
                <li><strong>Small values (5-15):</strong> Faster analysis, simpler data structure</li>
                <li><strong>Large values (20-50):</strong> Complex datasets, detailed analysis</li>
              </ul>
            </div>
            
            <div>
              <h4 style={{color: '#007bff', marginBottom: '0.5rem'}}>Training Epochs</h4>
              <ul style={{fontSize: '0.9rem', paddingLeft: '1.2rem'}}>
                <li><strong>Range:</strong> 100-1000</li>
                <li><strong>Default:</strong> 400</li>
                <li><strong>Quick testing:</strong> 100-200</li>
                <li><strong>Research-grade:</strong> 600-1000</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="card">
        <h2>Frequently Asked Questions</h2>
        
        <div style={{marginTop: '1rem'}}>
          <details style={{marginBottom: '1rem', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px'}}>
            <summary style={{cursor: 'pointer', fontWeight: 'bold', fontSize: '1.05rem', color: '#007bff'}}>
              Q: Which model is best for my experimental data?
            </summary>
            <div style={{padding: '1rem 0', lineHeight: '1.6'}}>
              <p><strong>A:</strong> Model selection depends on your research goals:</p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li><strong>Batch effect removal needed:</strong> scVI model is highly recommended</li>
                <li><strong>Multi-lab data integration:</strong> scVI is most suitable</li>
                <li><strong>Dimensionality reduction and visualization:</strong> scVI provides excellent results</li>
                <li><strong>Cell type classification:</strong> Use scVI for dimensionality reduction, then downstream analysis</li>
              </ul>
            </div>
          </details>

          <details style={{marginBottom: '1rem', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px'}}>
            <summary style={{cursor: 'pointer', fontWeight: 'bold', fontSize: '1.05rem', color: '#007bff'}}>
              Q: File upload fails or takes too long
            </summary>
            <div style={{padding: '1rem 0', lineHeight: '1.6'}}>
              <p><strong>A:</strong> Try these troubleshooting steps:</p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>Verify file size is under 500MB limit</li>
                <li>Check internet connection stability</li>
                <li>Upload during off-peak hours (mornings or evenings)</li>
                <li>Compress large files by filtering low-quality cells/genes</li>
                <li>Use .h5ad format instead of .csv for better compression</li>
              </ul>
            </div>
          </details>

          <details style={{marginBottom: '1rem', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px'}}>
            <summary style={{cursor: 'pointer', fontWeight: 'bold', fontSize: '1.05rem', color: '#007bff'}}>
              Q: Analysis results seem incorrect or show errors
            </summary>
            <div style={{padding: '1rem 0', lineHeight: '1.6'}}>
              <p><strong>A:</strong> Common solutions:</p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li><strong>Data format verification:</strong> Ensure genes are rows and cells are columns</li>
                <li><strong>Quality control:</strong> Remove dead cells and doublets before analysis</li>
                <li><strong>Parameter adjustment:</strong> Increase epoch count or modify latent dimensions</li>
                <li><strong>Batch information:</strong> Verify correct batch column names in metadata</li>
                <li><strong>File integrity:</strong> Re-export data file and try uploading again</li>
              </ul>
            </div>
          </details>

          <details style={{marginBottom: '1rem', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px'}}>
            <summary style={{cursor: 'pointer', fontWeight: 'bold', fontSize: '1.05rem', color: '#007bff'}}>
              Q: How do I add a new model to the platform?
            </summary>
            <div style={{padding: '1rem 0', lineHeight: '1.6'}}>
              <p><strong>A:</strong> Follow the model addition guide:</p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li>Create new directory in model_registry folder</li>
                <li>Write config.yaml with model information and documentation</li>
                <li>Implement model.py with execution code</li>
                <li>Restart Docker services and verify in web interface</li>
                <li>Consult CONTRIBUTING.md for detailed instructions</li>
              </ul>
            </div>
          </details>

          <details style={{marginBottom: '1rem', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px'}}>
            <summary style={{cursor: 'pointer', fontWeight: 'bold', fontSize: '1.05rem', color: '#007bff'}}>
              Q: What should I do with the analysis outputs?
            </summary>
            <div style={{padding: '1rem 0', lineHeight: '1.6'}}>
              <p><strong>A:</strong> Typical outputs and their uses:</p>
              <ul style={{paddingLeft: '1.5rem'}}>
                <li><strong>UMAP visualization:</strong> Overview of cell populations and clustering</li>
                <li><strong>Latent representation:</strong> Low-dimensional embeddings for downstream analysis</li>
                <li><strong>Processed data file:</strong> Batch-corrected expression matrix</li>
                <li><strong>Analysis summary:</strong> Model parameters and quality metrics</li>
                <li><strong>Next steps:</strong> Use outputs for clustering, differential expression, or trajectory analysis</li>
              </ul>
            </div>
          </details>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="card">
        <h2>Technical Troubleshooting</h2>
        
        <div style={{marginTop: '1rem'}}>
          <div style={{marginBottom: '1.5rem', padding: '1rem', border: '1px solid #dc3545', borderRadius: '8px', background: '#f8d7da'}}>
            <h4 style={{color: '#721c24', marginTop: 0}}>Platform Not Loading</h4>
            <ul style={{color: '#721c24', paddingLeft: '1.2rem'}}>
              <li>Check if Docker services are running</li>
              <li>Verify port accessibility (3000 for frontend, 8000 for backend)</li>
              <li>Clear browser cache and cookies</li>
              <li>Try accessing from a different browser or incognito mode</li>
            </ul>
          </div>

          <div style={{marginBottom: '1.5rem', padding: '1rem', border: '1px solid #856404', borderRadius: '8px', background: '#fff3cd'}}>
            <h4 style={{color: '#856404', marginTop: 0}}>Analysis Stuck or Very Slow</h4>
            <ul style={{color: '#856404', paddingLeft: '1.2rem'}}>
              <li>Large datasets naturally take longer (up to 30 minutes for very large files)</li>
              <li>Check system resources - close other applications if needed</li>
              <li>Reduce dataset size by filtering or subsampling cells</li>
              <li>Lower parameter values (epochs, latent dimensions) for faster processing</li>
            </ul>
          </div>

          <div style={{marginBottom: '1.5rem', padding: '1rem', border: '1px solid #0c5460', borderRadius: '8px', background: '#d1ecf1'}}>
            <h4 style={{color: '#0c5460', marginTop: 0}}>Results Page Shows No Files</h4>
            <ul style={{color: '#0c5460', paddingLeft: '1.2rem'}}>
              <li>Wait additional time - analysis may still be processing</li>
              <li>Refresh the page to check for updates</li>
              <li>Verify the task ID in the URL is correct</li>
              <li>Check if analysis completed successfully (no error messages)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Getting Help */}
      <div className="card" style={{textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
        <h2 style={{color: 'white'}}>Need Additional Help?</h2>
        <p style={{fontSize: '1.1rem', marginBottom: '1.5rem', opacity: 0.9}}>
          If you continue experiencing issues or have questions about the platform:
        </p>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
          <div style={{padding: '1.5rem', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', backdropFilter: 'blur(10px)'}}>
            <h4 style={{color: 'white', marginBottom: '0.5rem'}}>Model Documentation</h4>
            <p style={{fontSize: '0.9rem', margin: 0, opacity: 0.9}}>Check the Models page for detailed information about each AI model and their capabilities</p>
          </div>
          
          <div style={{padding: '1.5rem', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', backdropFilter: 'blur(10px)'}}>
            <h4 style={{color: 'white', marginBottom: '0.5rem'}}>Lab Colleagues</h4>
            <p style={{fontSize: '0.9rem', margin: 0, opacity: 0.9}}>Ask experienced lab members who have used the platform before</p>
          </div>
          
          <div style={{padding: '1.5rem', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', backdropFilter: 'blur(10px)'}}>
            <h4 style={{color: 'white', marginBottom: '0.5rem'}}>Technical Support</h4>
            <p style={{fontSize: '0.9rem', margin: 0, opacity: 0.9}}>Contact system administrators or developers for technical issues</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;