import React from 'react';

function Home() {
  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem',
      fontFamily: '"Times New Roman", serif',
      lineHeight: '1.6'
    }}>
      {/* Header */}
      <header style={{
        textAlign: 'center',
        marginBottom: '4rem',
        paddingBottom: '2rem',
        borderBottom: '2px solid #e0e0e0'
      }}>
        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: '400',
          color: '#2c3e50',
          marginBottom: '1rem',
          letterSpacing: '0.02em'
        }}>
          HealthAI Web Platform
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#5a5a5a',
          fontStyle: 'italic',
          marginBottom: '3rem'
        }}>
          AI-powered biomedical data analysis platform
        </p>
        
        {/* Usage Guide */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2rem',
          maxWidth: '800px',
          margin: '0 auto',
          marginBottom: '2rem'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '1.5rem',
            border: '1px solid #d0d0d0',
            backgroundColor: '#fafafa'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '0.5rem'
            }}>
              Step 1
            </div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              Select Model
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: '#666',
              fontStyle: 'italic'
            }}>
              Choose appropriate algorithm for your data type
            </div>
          </div>
          
          <div style={{
            textAlign: 'center',
            padding: '1.5rem',
            border: '1px solid #d0d0d0',
            backgroundColor: '#fafafa'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '0.5rem'
            }}>
              Step 2
            </div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              Upload & Configure
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: '#666',
              fontStyle: 'italic'
            }}>
              Upload data files and set analysis parameters
            </div>
          </div>
          
          <div style={{
            textAlign: 'center',
            padding: '1.5rem',
            border: '1px solid #d0d0d0',
            backgroundColor: '#fafafa'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '0.5rem'
            }}>
              Step 3
            </div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              Download Results
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: '#666',
              fontStyle: 'italic'
            }}>
              Retrieve processed data and visualization files
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          <a href="/models" style={{
            background: '#2c3e50',
            color: 'white',
            padding: '0.8rem 2rem',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            border: '2px solid #2c3e50',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = '#2c3e50';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2c3e50';
            e.currentTarget.style.color = 'white';
          }}
          >
            Explore Models
          </a>
          <a href="/upload" style={{
            background: 'white',
            color: '#2c3e50',
            padding: '0.8rem 2rem',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            border: '2px solid #2c3e50',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2c3e50';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = '#2c3e50';
          }}
          >
            Start Analysis
          </a>
        </div>
      </header>

      {/* Available Models Section */}
      <section style={{ marginBottom: '5rem' }}>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: '500',
          color: '#2c3e50',
          marginBottom: '2.5rem',
          textAlign: 'center',
          borderBottom: '2px solid #2c3e50',
          paddingBottom: '1rem'
        }}>
          Available Models
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '200px 1fr',
          border: '2px solid #2c3e50'
        }}>
          {/* Table Header */}
          <div style={{
            backgroundColor: '#2c3e50',
            color: 'white',
            padding: '1rem',
            fontWeight: '600',
            borderRight: '1px solid #2c3e50'
          }}>
            Model
          </div>
          <div style={{
            backgroundColor: '#2c3e50',
            color: 'white',
            padding: '1rem',
            fontWeight: '600'
          }}>
            Specifications
          </div>
          
          {/* scVI Model Row */}
          <div style={{
            padding: '1.5rem 1rem',
            borderRight: '1px solid #d0d0d0',
            borderBottom: '1px solid #d0d0d0',
            fontWeight: '600',
            backgroundColor: '#f9f9f9'
          }}>
            scVI Model
          </div>
          <div style={{
            padding: '1.5rem 1rem',
            borderBottom: '1px solid #d0d0d0',
            lineHeight: '1.8'
          }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Purpose:</strong> Single-cell RNA-seq analysis with batch correction
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Input:</strong> .h5ad, .csv (genes x cells matrix)
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Output:</strong> UMAP visualizations, latent representations
            </div>
            <div>
              <strong>Applications:</strong> Cell clustering, dimensionality reduction
            </div>
          </div>
          
          {/* Image Classifier Row */}
          <div style={{
            padding: '1.5rem 1rem',
            borderRight: '1px solid #d0d0d0',
            fontWeight: '600',
            backgroundColor: '#f9f9f9'
          }}>
            Image Classifier
          </div>
          <div style={{
            padding: '1.5rem 1rem',
            lineHeight: '1.8'
          }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Purpose:</strong> Deep learning-based object recognition
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Input:</strong> .jpg, .png (max 10MB)
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Output:</strong> Classification results, confidence scores
            </div>
            <div>
              <strong>Applications:</strong> Object detection, medical imaging
            </div>
          </div>
        </div>
      </section>

      {/* Data Requirements Section */}
      <section style={{ marginBottom: '5rem' }}>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: '500',
          color: '#2c3e50',
          marginBottom: '2.5rem',
          textAlign: 'center',
          borderBottom: '2px solid #2c3e50',
          paddingBottom: '1rem'
        }}>
          Data Requirements
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem'
        }}>
          {/* Single-cell RNA-seq Block */}
          <div style={{
            border: '2px solid #2c3e50',
            padding: '0'
          }}>
            <div style={{
              backgroundColor: '#2c3e50',
              color: 'white',
              padding: '1rem',
              fontWeight: '600',
              fontSize: '1.1rem'
            }}>
              Single-cell RNA-seq Data
            </div>
            <div style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              lineHeight: '1.8'
            }}>
              <div style={{ marginBottom: '0.8rem' }}>
                <strong>Format:</strong> .h5ad (AnnData) or .csv
              </div>
              <div style={{ marginBottom: '0.8rem' }}>
                <strong>Structure:</strong> Genes as rows, cells as columns
              </div>
              <div style={{ marginBottom: '0.8rem' }}>
                <strong>Minimum size:</strong> 100+ cells, 500+ genes
              </div>
              <div>
                <strong>Size limit:</strong> 500MB maximum
              </div>
            </div>
          </div>
          
          {/* Image Data Block */}
          <div style={{
            border: '2px solid #2c3e50',
            padding: '0'
          }}>
            <div style={{
              backgroundColor: '#2c3e50',
              color: 'white',
              padding: '1rem',
              fontWeight: '600',
              fontSize: '1.1rem'
            }}>
              Image Data
            </div>
            <div style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              lineHeight: '1.8'
            }}>
              <div style={{ marginBottom: '0.8rem' }}>
                <strong>Format:</strong> .jpg, .jpeg, .png
              </div>
              <div style={{ marginBottom: '0.8rem' }}>
                <strong>Quality:</strong> Clear, well-lit images
              </div>
              <div style={{ marginBottom: '0.8rem' }}>
                <strong>Resolution:</strong> Any size (auto-resized)
              </div>
              <div>
                <strong>Size limit:</strong> 10MB per image
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Information Section */}
      <section style={{ marginBottom: '5rem' }}>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: '500',
          color: '#2c3e50',
          marginBottom: '2.5rem',
          textAlign: 'center',
          borderBottom: '2px solid #2c3e50',
          paddingBottom: '1rem'
        }}>
          System Information
        </h2>
        
        <div style={{
          border: '2px solid #2c3e50'
        }}>
          <div style={{
            backgroundColor: '#2c3e50',
            color: 'white',
            padding: '1rem',
            fontWeight: '600',
            fontSize: '1.1rem'
          }}>
            Processing & Output Details
          </div>
          <div style={{
            padding: '2rem',
            backgroundColor: 'white',
            lineHeight: '1.8'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '2rem' 
            }}>
              <div>
                <h4 style={{ 
                  fontWeight: '600', 
                  marginBottom: '1rem', 
                  color: '#2c3e50' 
                }}>
                  Processing Information
                </h4>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong>Processing time:</strong> 2-10 minutes (data size dependent)
                </div>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong>Data privacy:</strong> Secure processing, no permanent storage
                </div>
                <div>
                  <strong>Results retention:</strong> 24 hours (download promptly)
                </div>
              </div>
              
              <div>
                <h4 style={{ 
                  fontWeight: '600', 
                  marginBottom: '1rem', 
                  color: '#2c3e50' 
                }}>
                  Output Interpretation
                </h4>
                <div style={{ marginBottom: '0.8rem' }}>
                  <strong>scVI:</strong> UMAP plots, latent representations
                </div>
                <div>
                  <strong>Classifier:</strong> Prediction charts, confidence scores
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
