import React, { useState, useEffect } from 'react';

// Type definition for model information (TypeScript)
interface Model {
  id: string;
  name: string;
  description?: string;
  status: string;
}

// Type definition for model documentation
interface ModelDocumentation {
  simple_explanation: string;
  when_to_use: string[];
  features: string[];
  technical_details: string[];
  citation: string;
  mathematical_formulation?: string;
  code_example?: string;
  algorithm_description?: string;
  preprocessing_code?: string;
  visualization_code?: string;
  figures?: {
    url: string;
    caption: string;
    alt: string;
  }[];
}

function Models() {
  // State: information that the component needs to remember
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedModels, setExpandedModels] = useState<{[key: string]: boolean}>({});
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [modelDocs, setModelDocs] = useState<{[key: string]: ModelDocumentation}>({});
  const [copiedState, setCopiedState] = useState<{[key: string]: boolean}>({});
  const [expandedContents, setExpandedContents] = useState<{[key: string]: boolean}>({});

  const copyToClipboard = async (text: string, key: string) => {
    try {
      if (navigator && 'clipboard' in navigator) {
        await navigator.clipboard.writeText(text || '');
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text || '';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedState(prev => ({ ...prev, [key]: true }));
      setTimeout(() => setCopiedState(prev => ({ ...prev, [key]: false })), 1500);
    } catch (e) {
      console.error('Clipboard copy failed', e);
    }
  };

  const downloadDocumentation = (format: 'md' | 'pdf') => {
    if (!selectedModel || !modelDocs[selectedModel]) return;
    
    const modelName = models.find(m => m.id === selectedModel)?.name || selectedModel;
    const doc = modelDocs[selectedModel];
    
    if (format === 'md') {
      const markdownContent = generateMarkdown(modelName, doc);
      const blob = new Blob([markdownContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedModel}-documentation.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      // For PDF, we'll create an HTML version and let the browser handle PDF generation
      const htmlContent = generateHTML(modelName, doc);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        newWindow.onload = () => {
          setTimeout(() => {
            newWindow.print();
          }, 500);
        };
      }
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  };

  const generateMarkdown = (modelName: string, doc: ModelDocumentation): string => {
    return `# ${modelName} Documentation

## Overview

### Description
${doc.simple_explanation}

### When to Use
${doc.when_to_use.map(item => `- ${item}`).join('\n')}

### Key Features
${doc.features.map(feature => `- ${feature}`).join('\n')}

### Technical Details
${doc.technical_details.map(detail => `- ${detail}`).join('\n')}

## Preprocessing

\`\`\`python
${doc.preprocessing_code || 'Standard preprocessing pipeline for data preparation.'}
\`\`\`

## Mathematical Formulation

${doc.mathematical_formulation || 'Mathematical formulation details.'}

## Code Example

\`\`\`python
${doc.code_example || 'Complete workflow example.'}
\`\`\`

## Visualization

\`\`\`python
${doc.visualization_code || 'Visualization pipeline for results analysis.'}
\`\`\`

## References

${doc.citation}

---
Generated from HealthAI Web Platform
`;
  };

  const generateHTML = (modelName: string, doc: ModelDocumentation): string => {
    return `<!DOCTYPE html>
<html>
<head>
    <title>${modelName} Documentation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
        h1 { color: #2c3e50; border-bottom: 3px solid #2c3e50; padding-bottom: 10px; }
        h2 { color: #2c3e50; border-bottom: 2px solid #2c3e50; padding-bottom: 8px; margin-top: 30px; }
        h3 { color: #34495e; margin-top: 25px; }
        pre { background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; }
        code { background: #f8f9fa; padding: 2px 4px; border-radius: 3px; }
        ul { padding-left: 20px; }
        li { margin-bottom: 5px; }
        .citation { background: #f8f9fa; padding: 15px; border-left: 4px solid #2c3e50; margin: 20px 0; }
    </style>
</head>
<body>
    <h1>${modelName} Documentation</h1>
    
    <h2>Overview</h2>
    <h3>Description</h3>
    <p>${doc.simple_explanation}</p>
    
    <h3>When to Use</h3>
    <ul>${doc.when_to_use.map(item => `<li>${item}</li>`).join('')}</ul>
    
    <h3>Key Features</h3>
    <ul>${doc.features.map(feature => `<li>${feature}</li>`).join('')}</ul>
    
    <h3>Technical Details</h3>
    <ul>${doc.technical_details.map(detail => `<li>${detail}</li>`).join('')}</ul>
    
    <h2>Preprocessing</h2>
    <pre><code>${doc.preprocessing_code || 'Standard preprocessing pipeline for data preparation.'}</code></pre>
    
    <h2>Mathematical Formulation</h2>
    <pre>${doc.mathematical_formulation || 'Mathematical formulation details.'}</pre>
    
    <h2>Code Example</h2>
    <pre><code>${doc.code_example || 'Complete workflow example.'}</code></pre>
    
    <h2>Visualization</h2>
    <pre><code>${doc.visualization_code || 'Visualization pipeline for results analysis.'}</code></pre>
    
    <h2>References</h2>
    <div class="citation">${doc.citation}</div>
    
    <hr>
    <p><em>Generated from HealthAI Web Platform</em></p>
</body>
</html>`;
  };

  // Function to fetch model list from backend
  useEffect(() => {
    fetchModels();
    // Initialize Models section as expanded
    setExpandedModels(prev => ({
      ...prev,
      'models-section': true
    }));
  }, []);

  const fetchModels = async () => {
    try {
      const response = await fetch('/api/models');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setModels(data.models);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching models:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };

  // Function to load model documentation
  const loadModelDocumentation = async (modelId: string) => {
    try {
      const response = await fetch(`/api/models/${modelId}/documentation`);
      if (response.ok) {
        const data = await response.json();
        setModelDocs(prev => ({
          ...prev,
          [modelId]: data.documentation
        }));
      } else {
         // Use fallback documentation based on model ID
         const fallbackDocs: ModelDocumentation = modelId === 'scvi_model' ? {
           simple_explanation: "scVI (single-cell Variational Inference) is a deep generative model for single-cell RNA sequencing data analysis. It uses variational autoencoders to learn a low-dimensional latent representation of cells while accounting for technical noise and batch effects.",
           when_to_use: [
             "Dimensionality reduction and visualization",
             "Batch effect correction across different experiments",
             "Differential expression analysis",
             "Cell type annotation and discovery",
             "Data integration across multiple datasets",
             "Imputation of dropout events"
           ],
           features: [
             "Handles zero-inflation in scRNA-seq data",
             "Batch effect correction",
             "Uncertainty quantification",
             "Scalable to large datasets (>1M cells)",
             "Integrates multiple datasets seamlessly",
             "GPU acceleration support"
           ],
           technical_details: [
             "Based on variational autoencoders (VAE)",
             "Uses negative binomial distribution for gene expression",
             "Incorporates batch information as covariates",
             "Amortized inference for scalability",
             "Deep neural networks for encoder/decoder",
             "Stochastic optimization with mini-batches"
           ],
           citation: "Lopez, R., Regier, J., Cole, M. B., Jordan, M. I., & Yosef, N. (2018). Deep generative modeling for single-cell transcriptomics. Nature methods, 15(12), 1053-1058.",
           mathematical_formulation: `The scVI model assumes the following generative process:

**Latent variables:**
- z ~ N(0, I) (latent representation)
- l ~ LogNormal(l_m, l_v) (library size)`,
         } : {
           simple_explanation: "Our Image Classifier is a state-of-the-art deep learning model based on ResNet-18 architecture, designed for accurate and efficient image classification. It excels at recognizing objects, scenes, and patterns in images with high precision.",
           when_to_use: [
             "Object recognition in medical images",
             "Disease detection from radiographs",
             "Cell type classification from microscopy",
             "Tissue sample analysis",
             "Quality control in medical imaging",
             "Automated image screening"
           ],
           features: [
             "ResNet-18 architecture for robust feature extraction",
             "Transfer learning from ImageNet pre-training",
             "Real-time inference capabilities",
             "High accuracy on medical imaging tasks",
             "Confidence score for predictions",
             "Multi-class classification support"
           ],
           technical_details: [
             "Deep residual learning architecture",
             "Batch normalization layers",
             "ReLU activation functions",
             "Global average pooling",
             "Softmax output layer",
             "Cross-entropy loss optimization"
           ],
           citation: "He, K., Zhang, X., Ren, S., & Sun, J. (2016). Deep residual learning for image recognition. In Proceedings of the IEEE conference on computer vision and pattern recognition (pp. 770-778).",
           mathematical_formulation: `The ResNet architecture introduces residual learning:

**Forward propagation:**
y = F(x, {Wi}) + x
where F(x, {Wi}) represents residual mapping to be learned

**Key equations:**
- Identity shortcut: y = x + F(x, {Wi})
- Bottleneck block: F = W3σ(W2σ(W1x))
- Loss function: L = -Σ(yi * log(ŷi))

**Observed variables:**
- x | z, l ~ NB(μ, θ) (gene expression counts)

Where the mean μ is parameterized as:
μ = ρ(z, s) * l

**Variational posterior:**
q(z, l | x, s) = q(z | x, s) * q(l | x, s)

**ELBO (Evidence Lower BOund):**
L = E_q[log p(x | z, l, s)] - KL[q(z | x, s) || p(z)] - KL[q(l | x, s) || p(l | s)]

**Training objective:**
The model is trained by maximizing the ELBO with respect to the neural network parameters θ and φ.`,
           preprocessing_code: `# Preprocessing and clustering
import scanpy as sc
import pandas as pd

# Load data
adata = sc.read_h5ad("your_data.h5ad")

# Basic filtering
sc.pp.filter_cells(adata, min_genes=200)
sc.pp.filter_genes(adata, min_cells=3)

# Calculate QC metrics
adata.var['mt'] = adata.var_names.str.startswith('MT-')
sc.pp.calculate_qc_metrics(adata, percent_top=None, log1p=False, inplace=True)

# Filter cells and genes
adata = adata[adata.obs.n_genes_by_counts < 2500, :]
adata = adata[adata.obs.pct_counts_mt < 20, :].copy()

# Normalize and log transform
sc.pp.normalize_total(adata, target_sum=1e4)
sc.pp.log1p(adata)

# Store raw data
adata.raw = adata

# Find highly variable genes
sc.pp.highly_variable_genes(adata, min_mean=0.0125, max_mean=3, min_disp=0.5)
adata = adata[:, adata.var.highly_variable]`,
           code_example: `# Complete scVI workflow
import scanpy as sc
import scvi
import matplotlib.pyplot as plt

# Load preprocessed data
adata = sc.read_h5ad("preprocessed_data.h5ad")

# Setup scVI
scvi.model.SCVI.setup_anndata(
    adata, 
    layer="counts",
    batch_key="batch",
    continuous_covariate_keys=["percent_mito", "n_genes"]
)

# Create and train model
model = scvi.model.SCVI(adata, n_layers=2, n_latent=30, gene_likelihood="nb")
model.train(max_epochs=400, early_stopping=True, train_size=0.9)

# Get latent representation
latent = model.get_latent_representation()
adata.obsm["X_scVI"] = latent

# Compute neighbors and UMAP
sc.pp.neighbors(adata, use_rep="X_scVI", n_neighbors=30)
sc.tl.umap(adata, min_dist=0.3)

# Clustering
sc.tl.leiden(adata, resolution=0.5)`,
           visualization_code: `# Visualization and analysis
import matplotlib.pyplot as plt
import seaborn as sns

# Plot UMAP
fig, axes = plt.subplots(1, 3, figsize=(15, 5))

sc.pl.umap(adata, color="batch", ax=axes[0], show=False, frameon=False)
axes[0].set_title("Batch")

sc.pl.umap(adata, color="leiden", ax=axes[1], show=False, frameon=False)
axes[1].set_title("Leiden Clusters")

sc.pl.umap(adata, color="cell_type", ax=axes[2], show=False, frameon=False)
axes[2].set_title("Cell Type")

plt.tight_layout()
plt.show()

# Differential expression
sc.tl.rank_genes_groups(adata, 'leiden', method='wilcoxon')
sc.pl.rank_genes_groups(adata, n_genes=5, sharey=False)

# Plot training history
train_elbo = model.history["elbo_train"]
val_elbo = model.history["elbo_validation"]

plt.figure(figsize=(8, 5))
plt.plot(train_elbo, label="Training")
plt.plot(val_elbo, label="Validation")
plt.xlabel("Epoch")
plt.ylabel("ELBO")
plt.legend()
plt.title("scVI Training Progress")
plt.show()`,
           algorithm_description: "The scVI algorithm uses a variational autoencoder framework to learn meaningful representations of single-cell data. The encoder network maps observed gene expression to latent variables, while the decoder reconstructs the original data. The model is trained using stochastic gradient descent to maximize the evidence lower bound (ELBO).",
           figures: [
             {
               url: "https://via.placeholder.com/600x400/e3f2fd/1976d2?text=scVI+Architecture",
               caption: "scVI model architecture showing the encoder-decoder structure with latent variables z and library size l.",
               alt: "scVI model architecture diagram"
             },
             {
               url: "https://via.placeholder.com/600x400/f3e5f5/7b1fa2?text=UMAP+Visualization",
               caption: "UMAP visualization of scVI latent representation colored by cell type, showing clear separation of different cell populations.",
               alt: "UMAP plot of scVI results"
             },
             {
               url: "https://via.placeholder.com/600x300/e8f5e8/388e3c?text=Training+Curve",
               caption: "Training curve showing convergence of the ELBO (Evidence Lower BOund) during model training.",
               alt: "scVI training curve"
             }
           ]
         };
        
        setModelDocs(prev => ({
          ...prev,
          [modelId]: fallbackDocs
        }));
      }
    } catch (error) {
      console.error('Failed to load documentation for', modelId, error);
    }
  };


  // Screen to show while loading
  if (loading) {
    return (
      <div className="models-page-container" style={{ display: 'flex', height: '100vh', maxWidth: '1600px', margin: '0 auto' }}>
        {/* Left Sidebar */}
        <div style={{
          width: '280px',
          backgroundColor: '#f8f9fa',
          padding: '20px 15px',
          borderRight: '1px solid #dee2e6',
          flexShrink: 0,
          marginRight: '30px'
        }}>
          <div style={{ marginBottom: '30px' }}>
            <span style={{ color: '#2c3e50', fontSize: '24px', fontWeight: 'bold' }}>🧬</span>
            <span style={{ marginLeft: '10px', fontSize: '18px', fontWeight: 'bold' }}>HealthAI</span>
          </div>
          
          <nav>
            <div style={{
              padding: '10px 15px',
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              borderRadius: '5px',
              borderLeft: '3px solid #1976d2',
              fontWeight: '600'
            }}>
              Models
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '40px 60px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px', color: '#2c3e50' }}>
            Available Models
          </h1>
          <p style={{ color: '#6c757d', marginBottom: '40px' }}>
            Loading models...
          </p>
        </div>
      </div>
    );
  }

  // Screen to show if there's an error
  if (error) {
    return (
      <div className="models-page-container" style={{ display: 'flex', height: '100vh', maxWidth: '1600px', margin: '0 auto' }}>
        {/* Left Sidebar */}
        <div style={{
          width: '280px',
          backgroundColor: '#f8f9fa',
          padding: '20px 15px',
          borderRight: '1px solid #dee2e6',
          flexShrink: 0,
          marginRight: '30px'
        }}>
          <div style={{ marginBottom: '30px' }}>
            <span style={{ color: '#2c3e50', fontSize: '24px', fontWeight: 'bold' }}>🧬</span>
            <span style={{ marginLeft: '10px', fontSize: '18px', fontWeight: 'bold' }}>HealthAI</span>
          </div>
          
          <nav>
            <div style={{
              padding: '10px 15px',
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              borderRadius: '5px',
              borderLeft: '3px solid #1976d2',
              fontWeight: '600'
            }}>
              Models
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '40px 60px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px', color: '#2c3e50' }}>
            Available Models
          </h1>
          <div style={{color: 'red', padding: '1rem', border: '1px solid red', borderRadius: '4px'}}>
            <strong>Error loading models:</strong> {error}
            <br />
            <button onClick={fetchModels} style={{marginTop: '10px', padding: '5px 10px'}}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main render - what the user sees
  return (
    <div className="models-page-container" style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif', maxWidth: '1600px', margin: '0 auto' }}>
       {/* Left Sidebar */}
       <div style={{
         width: '280px',
         backgroundColor: '#f8f9fa',
         padding: '20px 15px',
         borderRight: '1px solid #dee2e6',
         overflowY: 'auto',
         flexShrink: 0,
         marginRight: '30px'
       }}>
        {/* Logo */}
        <div style={{ marginBottom: '30px' }}>
          <span style={{ color: '#2c3e50', fontSize: '24px', fontWeight: 'bold' }}>🧬</span>
          <span style={{ marginLeft: '10px', fontSize: '18px', fontWeight: 'bold' }}>HealthAI</span>
        </div>
        
        {/* Navigation */}
        <nav>
          <div 
            onClick={() => setExpandedModels(prev => ({
              ...prev,
              'models-section': !prev['models-section']
            }))}
            style={{
              padding: '10px 15px',
              backgroundColor: '#f8f9fa',
              color: '#2c3e50',
              borderRadius: '5px',
              borderLeft: '3px solid #2c3e50',
              marginBottom: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e9ecef';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
            }}
          >
            <span style={{ fontWeight: '600' }}>Models</span>
            <span style={{ fontSize: '12px' }}>
              {expandedModels['models-section'] ? '▼' : '▶'}
            </span>
          </div>

          {/* Model List - Only show when Models section is expanded */}
          {expandedModels['models-section'] && models.map((model) => (
            <div key={model.id} style={{ marginBottom: '10px', marginLeft: '15px' }}>
              <div
                onClick={() => {
                  setSelectedModel(model.id);
                  loadModelDocumentation(model.id);
                  setExpandedContents(prev => ({
                    ...prev,
                    [model.id]: selectedModel === model.id ? !prev[model.id] : true
                  }));
                }}
                style={{
                  padding: '8px 15px',
                  cursor: 'pointer',
                  borderRadius: '5px',
                  backgroundColor: selectedModel === model.id ? '#e9ecef' : 'transparent',
                  border: selectedModel === model.id ? '1px solid #ced4da' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={(e) => {
                  if (selectedModel !== model.id) {
                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedModel !== model.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span>{model.name}</span>
                {selectedModel === model.id && (
                  <span style={{ fontSize: '10px', color: '#6c757d' }}>
                    {expandedContents[model.id] ? '▼' : '▶'}
                  </span>
                )}
              </div>
              
              {/* Contents Menu - Show when model is selected and contents are expanded */}
              {selectedModel === model.id && expandedContents[model.id] && (
                <div style={{ marginLeft: '20px', marginTop: '8px', borderLeft: '2px solid #e9ecef', paddingLeft: '12px' }}>
                  <div style={{ marginBottom: '6px', fontSize: '12px', fontWeight: '600', color: '#495057' }}>
                    Contents
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <a href="#overview" style={{ 
                      color: '#6c757d', 
                      textDecoration: 'none', 
                      fontSize: '12px',
                      display: 'block',
                      padding: '2px 0',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#2c3e50'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#6c757d'}
                    >
                      Overview
                    </a>
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <a href="#preprocessing" style={{ 
                      color: '#6c757d', 
                      textDecoration: 'none', 
                      fontSize: '12px',
                      display: 'block',
                      padding: '2px 0',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#2c3e50'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#6c757d'}
                    >
                      Preprocessing
                    </a>
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <a href="#mathematical-formulation" style={{ 
                      color: '#6c757d', 
                      textDecoration: 'none', 
                      fontSize: '12px',
                      display: 'block',
                      padding: '2px 0',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#2c3e50'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#6c757d'}
                    >
                      Mathematical Formulation
                    </a>
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <a href="#code-example" style={{ 
                      color: '#6c757d', 
                      textDecoration: 'none', 
                      fontSize: '12px',
                      display: 'block',
                      padding: '2px 0',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#2c3e50'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#6c757d'}
                    >
                      Code Example
                    </a>
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <a href="#visualization" style={{ 
                      color: '#6c757d', 
                      textDecoration: 'none', 
                      fontSize: '12px',
                      display: 'block',
                      padding: '2px 0',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#2c3e50'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#6c757d'}
                    >
                      Visualization
                    </a>
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <a href="#references" style={{ 
                      color: '#6c757d', 
                      textDecoration: 'none', 
                      fontSize: '12px',
                      display: 'block',
                      padding: '2px 0',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#2c3e50'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#6c757d'}
                    >
                      References
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

       {/* Main Content Area */}
       <div style={{ flex: 1, padding: '40px 60px', overflowY: 'auto', minWidth: 0, maxWidth: 'none' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px', color: '#2c3e50' }}>
            Available Models
          </h1>
          <p style={{ color: '#6c757d', marginBottom: '40px' }}>
            Choose from our collection of pre-trained AI models for various data analysis tasks
          </p>

          {/* Model Documentation Display */}
          {selectedModel && modelDocs[selectedModel] && (
            <div style={{
                 backgroundColor: '#ffffff',
                 border: '1px solid #e0e0e0',
                 borderRadius: '8px',
                 padding: '50px',
                 marginBottom: '30px',
                 boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                 maxWidth: 'none',
                 width: '100%'
               }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
                  <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>
                    {models.find(m => m.id === selectedModel)?.name}
                  </h2>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {/* Use Model Button */}
                  <button
                      onClick={() => window.location.href = `/upload?model=${selectedModel}`}
                    style={{
                        backgroundColor: '#2c3e50',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '6px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#34495e';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#2c3e50';
                    }}
                  >
                    Use Model
                  </button>
                    
                    {/* Download Buttons */}
                    <div 
                      style={{ position: 'relative', display: 'inline-block' }}
                      onMouseEnter={(e) => {
                        const dropdown = e.currentTarget.querySelector('.download-dropdown') as HTMLElement;
                        if (dropdown) dropdown.style.display = 'block';
                      }}
                      onMouseLeave={(e) => {
                        const dropdown = e.currentTarget.querySelector('.download-dropdown') as HTMLElement;
                        if (dropdown) dropdown.style.display = 'none';
                      }}
                    >
                  <button
                    style={{
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          padding: '12px 24px',
                          borderRadius: '6px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#5a6268';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#6c757d';
                        }}
                      >
                        Download ▼
                      </button>
                      <div 
                        className="download-dropdown"
                        style={{
                          position: 'absolute',
                          top: '100%',
                          right: 0,
                          backgroundColor: 'white',
                          border: '1px solid #dee2e6',
                          borderRadius: '6px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          minWidth: '140px',
                          zIndex: 1000,
                          display: 'none',
                          marginTop: '2px'
                        }}
                      >
                        <button
                          onClick={() => downloadDocumentation('md')}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: 'none',
                            background: 'transparent',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: '#2c3e50',
                            borderRadius: '6px 6px 0 0'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          Markdown (.md)
                        </button>
                        <hr style={{ margin: 0, border: 'none', borderTop: '1px solid #e9ecef' }} />
                        <button
                          onClick={() => downloadDocumentation('pdf')}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: 'none',
                            background: 'transparent',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: '#2c3e50',
                            borderRadius: '0 0 6px 6px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          PDF (Print)
                  </button>
                      </div>
                    </div>
                  </div>
                </div>

                 {/* All Content in One Page */}
                 <div>
                   {/* Overview Section */}
                   <div id="overview" style={{ marginBottom: '40px' }}>
                     <h3 style={{ color: '#2c3e50', fontSize: '22px', marginBottom: '20px', borderBottom: '2px solid #2c3e50', paddingBottom: '8px' }}>Overview</h3>
                     
                     <div style={{ marginBottom: '25px' }}>
                       <h4 style={{ color: '#2c3e50', fontSize: '18px', marginBottom: '10px' }}>Description</h4>
                       <p style={{ lineHeight: '2.0', color: '#555', fontSize: '16px', maxWidth: 'none' }}>
                         {modelDocs[selectedModel].simple_explanation}
                       </p>
                     </div>

                     {/* Model Architecture Figure */}
                     {modelDocs[selectedModel].figures && modelDocs[selectedModel].figures!.length > 0 && (
                       <div style={{ marginBottom: '25px', textAlign: 'center' }}>
                         <div style={{
                           padding: '2rem',
                           background: '#f8f9fa',
                           border: '1px solid #e9ecef',
                             borderRadius: '8px',
                           marginBottom: '10px'
                         }}>
                           <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Architecture Diagram</h4>
                           <div style={{ 
                             background: 'white',
                             padding: '20px',
                             borderRadius: '6px',
                             border: '1px solid #dee2e6',
                             display: 'flex',
                             justifyContent: 'center',
                             alignItems: 'center'
                           }}>
                             <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '100%', height: 'auto' }}>
                               <defs>
                                 <style>
                                   {`.title { font: bold 16px sans-serif; fill: #2c3e50; }
                                   .layer { font: 12px sans-serif; fill: #34495e; }
                                   .arrow { stroke: #2c3e50; stroke-width: 2; fill: none; marker-end: url(#arrowhead); }
                                   .block { fill: #ecf0f1; stroke: #34495e; stroke-width: 2; }
                                   .skip { stroke: #e74c3c; stroke-width: 2; fill: none; stroke-dasharray: 5,5; }`}
                                 </style>
                                 <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                   <polygon points="0 0, 10 3.5, 0 7" fill="#2c3e50" />
                                 </marker>
                               </defs>
                               
                               <text x="300" y="30" textAnchor="middle" className="title">ResNet-18 Architecture</text>
                               
                               <rect x="50" y="60" width="80" height="40" className="block"/>
                               <text x="90" y="85" textAnchor="middle" className="layer">Input</text>
                               <text x="90" y="110" textAnchor="middle" fontSize="10" fill="#7f8c8d">224×224×3</text>
                               
                               <rect x="180" y="60" width="80" height="40" className="block"/>
                               <text x="220" y="85" textAnchor="middle" className="layer">Conv1</text>
                               <text x="220" y="110" textAnchor="middle" fontSize="10" fill="#7f8c8d">112×112×64</text>
                               
                               <rect x="310" y="40" width="80" height="80" className="block"/>
                               <text x="350" y="65" textAnchor="middle" className="layer">ResBlock 1</text>
                               <rect x="320" y="75" width="60" height="15" fill="#3498db" opacity="0.7"/>
                               <text x="350" y="85" textAnchor="middle" fontSize="10" fill="white">Conv 3×3</text>
                               <rect x="320" y="95" width="60" height="15" fill="#3498db" opacity="0.7"/>
                               <text x="350" y="105" textAnchor="middle" fontSize="10" fill="white">Conv 3×3</text>
                               
                               <rect x="440" y="40" width="80" height="80" className="block"/>
                               <text x="480" y="65" textAnchor="middle" className="layer">ResBlock 2</text>
                               <rect x="450" y="75" width="60" height="15" fill="#3498db" opacity="0.7"/>
                               <text x="480" y="85" textAnchor="middle" fontSize="10" fill="white">Conv 3×3</text>
                               <rect x="450" y="95" width="60" height="15" fill="#3498db" opacity="0.7"/>
                               <text x="480" y="105" textAnchor="middle" fontSize="10" fill="white">Conv 3×3</text>
                               
                               <rect x="180" y="180" width="80" height="40" className="block"/>
                               <text x="220" y="205" textAnchor="middle" className="layer">Global Pool</text>
                               <text x="220" y="230" textAnchor="middle" fontSize="10" fill="#7f8c8d">1×1×512</text>
                               
                               <rect x="310" y="180" width="80" height="40" className="block"/>
                               <text x="350" y="205" textAnchor="middle" className="layer">FC</text>
                               <text x="350" y="230" textAnchor="middle" fontSize="10" fill="#7f8c8d">1000 classes</text>
                               
                               <rect x="440" y="180" width="80" height="40" className="block"/>
                               <text x="480" y="205" textAnchor="middle" className="layer">Output</text>
                               <text x="480" y="230" textAnchor="middle" fontSize="10" fill="#7f8c8d">Probabilities</text>
                               
                               <line x1="130" y1="80" x2="175" y2="80" className="arrow"/>
                               <line x1="260" y1="80" x2="305" y2="80" className="arrow"/>
                               <line x1="390" y1="80" x2="435" y2="80" className="arrow"/>
                               <line x1="480" y1="120" x2="480" y2="140" className="arrow"/>
                               <line x1="480" y1="140" x2="220" y2="140" className="arrow"/>
                               <line x1="220" y1="140" x2="220" y2="175" className="arrow"/>
                               <line x1="260" y1="200" x2="305" y2="200" className="arrow"/>
                               <line x1="390" y1="200" x2="435" y2="200" className="arrow"/>
                               
                               <path d="M 310 80 Q 280 50 280 80 Q 280 110 390 80" className="skip"/>
                               <path d="M 440 80 Q 410 50 410 80 Q 410 110 520 80" className="skip"/>
                               
                               <text x="300" y="45" fontSize="10" fill="#e74c3c">Skip Connection</text>
                               <text x="430" y="45" fontSize="10" fill="#e74c3c">Skip Connection</text>
                               
                               <text x="50" y="300" className="title">Key Components:</text>
                               <rect x="50" y="320" width="15" height="15" className="block"/>
                               <text x="75" y="332" fontSize="12" fill="#34495e">Convolutional Layer</text>
                               <line x1="50" y1="350" x2="80" y2="350" className="skip"/>
                               <text x="90" y="355" fontSize="12" fill="#e74c3c">Skip Connection</text>
                               <text x="50" y="380" fontSize="11" fill="#7f8c8d">Skip connections allow gradients to flow directly, enabling deeper networks</text>
                             </svg>
                           </div>
                         </div>
                         <p style={{ 
                           fontSize: '14px', 
                           color: '#666', 
                           fontStyle: 'italic', 
                           marginTop: '10px',
                           maxWidth: '600px',
                           margin: '10px auto 0'
                         }}>
                           {modelDocs[selectedModel].figures![0].caption}
                         </p>
                       </div>
                     )}

                     <div style={{ marginBottom: '25px' }}>
                       <h4 style={{ color: '#2c3e50', fontSize: '18px', marginBottom: '10px' }}>When to Use</h4>
                       <ul style={{ paddingLeft: '20px', lineHeight: '1.6', color: '#555', fontSize: '16px' }}>
                         {modelDocs[selectedModel].when_to_use.map((item, index) => (
                           <li key={index} style={{ marginBottom: '8px' }}>{item}</li>
                         ))}
                       </ul>
                     </div>

                     <div style={{ marginBottom: '25px' }}>
                       <h4 style={{ color: '#2c3e50', fontSize: '18px', marginBottom: '10px' }}>Key Features</h4>
                       <ul style={{ paddingLeft: '20px', lineHeight: '1.6', color: '#555', fontSize: '16px' }}>
                         {modelDocs[selectedModel].features.map((feature, index) => (
                           <li key={index} style={{ marginBottom: '8px' }}>{feature}</li>
                         ))}
                       </ul>
                     </div>

                     <div>
                       <h4 style={{ color: '#2c3e50', fontSize: '18px', marginBottom: '10px' }}>Technical Details</h4>
                       <ul style={{ paddingLeft: '20px', lineHeight: '1.6', color: '#555', fontSize: '16px' }}>
                         {modelDocs[selectedModel].technical_details.map((detail, index) => (
                           <li key={index} style={{ marginBottom: '8px' }}>{detail}</li>
                         ))}
                       </ul>
                     </div>
                   </div>

                   {/* Preprocessing Section */}
                   <div id="preprocessing" style={{ marginBottom: '40px' }}>
                     <h3 style={{ color: '#2c3e50', fontSize: '22px', marginBottom: '20px', borderBottom: '2px solid #2c3e50', paddingBottom: '8px' }}>Preprocessing</h3>
                     <p style={{ marginBottom: '20px', color: '#555', fontSize: '16px', lineHeight: '1.8', maxWidth: 'none' }}>
                       Proper preprocessing is crucial for scVI performance. Follow these steps to prepare your data:
                     </p>
                     <div style={{ position: 'relative' }}>
                       <button
                         onClick={() => copyToClipboard(modelDocs[selectedModel].preprocessing_code || '', `${selectedModel}-preproc`)}
                         style={{
                           position: 'absolute',
                           top: '10px',
                           right: '10px',
                           backgroundColor: '#2c3e50',
                           color: 'white',
                           border: 'none',
                           padding: '5px 10px',
                           borderRadius: '4px',
                           fontSize: '12px',
                           cursor: 'pointer',
                           zIndex: 1
                         }}
                         title="Copy code to clipboard"
                       >
                         {copiedState[`${selectedModel}-preproc`] ? 'Copied' : 'Copy'}
                       </button>
                       <div style={{
                         backgroundColor: '#f8f9fa',
                         border: '1px solid #e9ecef',
                         borderRadius: '8px',
                         padding: '25px',
                         fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                         fontSize: '14px',
                         lineHeight: '1.6',
                         whiteSpace: 'pre-line',
                         color: '#495057',
                         overflow: 'auto'
                       }}>
                         {modelDocs[selectedModel].preprocessing_code || 'Standard preprocessing pipeline for single-cell RNA sequencing data preparation.'}
                       </div>
                     </div>
                   </div>

                   {/* Mathematical Formulation Section */}
                   <div id="mathematical-formulation" style={{ marginBottom: '40px' }}>
                     <h3 style={{ color: '#2c3e50', fontSize: '22px', marginBottom: '20px', borderBottom: '2px solid #2c3e50', paddingBottom: '8px' }}>Mathematical Formulation</h3>
                     <div style={{
                       backgroundColor: '#f8f9fa',
                       border: '1px solid #e9ecef',
                       borderRadius: '8px',
                       padding: '25px',
                       fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                       fontSize: '14px',
                       lineHeight: '1.6',
                       whiteSpace: 'pre-line',
                       color: '#495057'
                     }}>
                         {modelDocs[selectedModel].mathematical_formulation || 'Probabilistic generative model based on variational autoencoders for single-cell RNA sequencing data analysis.'}
                     </div>
                   </div>

                   {/* Code Example Section */}
                   <div id="code-example" style={{ marginBottom: '40px' }}>
                     <h3 style={{ color: '#2c3e50', fontSize: '22px', marginBottom: '20px', borderBottom: '2px solid #2c3e50', paddingBottom: '8px' }}>Code Example</h3>
                     <p style={{ marginBottom: '20px', color: '#555', fontSize: '16px', lineHeight: '1.8', maxWidth: 'none' }}>
                       Complete workflow for training and using scVI on your single-cell data:
                     </p>
                     <div style={{ position: 'relative' }}>
                       <button
                         onClick={() => copyToClipboard(modelDocs[selectedModel].code_example || '', `${selectedModel}-code`)}
                         style={{
                           position: 'absolute',
                           top: '10px',
                           right: '10px',
                           backgroundColor: '#2c3e50',
                           color: 'white',
                           border: 'none',
                           padding: '5px 10px',
                           borderRadius: '4px',
                           fontSize: '12px',
                           cursor: 'pointer',
                           zIndex: 1
                         }}
                         title="Copy code to clipboard"
                       >
                         {copiedState[`${selectedModel}-code`] ? 'Copied' : 'Copy'}
                       </button>
                       <div style={{
                         backgroundColor: '#f8f9fa',
                         border: '1px solid #e9ecef',
                         borderRadius: '8px',
                         padding: '25px',
                         fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                         fontSize: '14px',
                         lineHeight: '1.6',
                         whiteSpace: 'pre-line',
                         color: '#495057',
                         overflow: 'auto'
                       }}>
                         {modelDocs[selectedModel].code_example || 'Complete scVI training workflow with model setup, training, and downstream analysis.'}
                       </div>
                     </div>
                   </div>

                   {/* Visualization Section */}
                   <div id="visualization" style={{ marginBottom: '40px' }}>
                     <h3 style={{ color: '#2c3e50', fontSize: '22px', marginBottom: '20px', borderBottom: '2px solid #2c3e50', paddingBottom: '8px' }}>Visualization</h3>
                     <p style={{ marginBottom: '20px', color: '#555', fontSize: '16px', lineHeight: '1.8', maxWidth: 'none' }}>
                       Visualize and analyze your scVI results:
                     </p>
                     
                     {/* Classification Results Figure */}
                       <div style={{ marginBottom: '25px', textAlign: 'center' }}>
                       <div style={{
                         padding: '2rem',
                         background: '#f8f9fa',
                         border: '1px solid #e9ecef',
                             borderRadius: '8px',
                         marginBottom: '10px'
                       }}>
                         <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Classification Results</h4>
                         <div style={{ 
                           background: 'white',
                           padding: '20px',
                           borderRadius: '6px',
                           border: '1px solid #dee2e6'
                         }}>
                           <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                             <div style={{ 
                               width: '100px', 
                               height: '100px', 
                               background: '#ecf0f1', 
                               border: '2px solid #34495e',
                               borderRadius: '8px',
                               display: 'flex',
                               alignItems: 'center',
                               justifyContent: 'center',
                               marginRight: '20px'
                             }}>
                               <span style={{ color: '#34495e', fontSize: '12px' }}>Input Image</span>
                             </div>
                             <div style={{ flex: 1 }}>
                               <h5 style={{ color: '#2c3e50', marginBottom: '15px' }}>Top-5 Predictions</h5>
                               <div style={{ textAlign: 'left' }}>
                                 <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                                   <div style={{ width: '200px', height: '20px', background: '#3498db', marginRight: '10px', borderRadius: '3px' }}></div>
                                   <span style={{ fontSize: '14px' }}>1. Golden Retriever (94.2%)</span>
                                 </div>
                                 <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                                   <div style={{ width: '150px', height: '20px', background: '#3498db', opacity: 0.7, marginRight: '10px', borderRadius: '3px' }}></div>
                                   <span style={{ fontSize: '14px' }}>2. Labrador Retriever (3.8%)</span>
                                 </div>
                                 <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                                   <div style={{ width: '100px', height: '20px', background: '#3498db', opacity: 0.5, marginRight: '10px', borderRadius: '3px' }}></div>
                                   <span style={{ fontSize: '14px' }}>3. Cocker Spaniel (1.2%)</span>
                                 </div>
                                 <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                                   <div style={{ width: '50px', height: '20px', background: '#3498db', opacity: 0.3, marginRight: '10px', borderRadius: '3px' }}></div>
                                   <span style={{ fontSize: '14px' }}>4. Beagle (0.5%)</span>
                                 </div>
                                 <div style={{ display: 'flex', alignItems: 'center' }}>
                                   <div style={{ width: '30px', height: '20px', background: '#3498db', opacity: 0.2, marginRight: '10px', borderRadius: '3px' }}></div>
                                   <span style={{ fontSize: '14px' }}>5. Setter (0.3%)</span>
                                 </div>
                               </div>
                             </div>
                           </div>
                           <div style={{ borderTop: '1px solid #e9ecef', paddingTop: '15px', fontSize: '12px', color: '#6c757d' }}>
                             Model: ResNet-18 | Dataset: ImageNet (1000 classes) | Processing Time: ~50ms
                           </div>
                         </div>
                       </div>
                         <p style={{ 
                           fontSize: '14px', 
                           color: '#666', 
                           fontStyle: 'italic', 
                           marginTop: '10px',
                           maxWidth: '600px',
                           margin: '10px auto 0'
                         }}>
                         Example classification results showing top-5 predictions with confidence scores for an input image.
                         </p>
                       </div>

                     <div style={{ position: 'relative' }}>
                       <button
                         onClick={() => copyToClipboard(modelDocs[selectedModel].visualization_code || '', `${selectedModel}-viz`)}
                         style={{
                           position: 'absolute',
                           top: '10px',
                           right: '10px',
                           backgroundColor: '#2c3e50',
                           color: 'white',
                           border: 'none',
                           padding: '5px 10px',
                           borderRadius: '4px',
                           fontSize: '12px',
                           cursor: 'pointer',
                           zIndex: 1
                         }}
                         title="Copy code to clipboard"
                       >
                         {copiedState[`${selectedModel}-viz`] ? 'Copied' : 'Copy'}
                       </button>
                       <div style={{
                         backgroundColor: '#f8f9fa',
                         border: '1px solid #e9ecef',
                         borderRadius: '8px',
                         padding: '25px',
                         fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                         fontSize: '14px',
                         lineHeight: '1.6',
                         whiteSpace: 'pre-line',
                         color: '#495057',
                         overflow: 'auto'
                       }}>
                         {modelDocs[selectedModel].visualization_code || 'Comprehensive visualization pipeline for scVI results including UMAP plots, training diagnostics, and differential expression analysis.'}
                       </div>
                     </div>

                     {/* Confidence Distribution Chart */}
                       <div style={{ marginTop: '25px', textAlign: 'center' }}>
                       <div style={{
                         padding: '2rem',
                         background: '#f8f9fa',
                         border: '1px solid #e9ecef',
                             borderRadius: '8px',
                         marginBottom: '10px'
                       }}>
                         <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Confidence Distribution</h4>
                         <div style={{ 
                           background: 'white',
                           padding: '20px',
                           borderRadius: '6px',
                           border: '1px solid #dee2e6'
                         }}>
                           <div style={{ marginBottom: '20px' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', height: '150px', marginBottom: '10px' }}>
                               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px' }}>
                                 <div style={{ width: '40px', height: '20px', background: '#e74c3c', marginBottom: '5px' }}></div>
                                 <span style={{ fontSize: '12px', color: '#666' }}>0.0-0.2</span>
                               </div>
                               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px' }}>
                                 <div style={{ width: '40px', height: '40px', background: '#e74c3c', marginBottom: '5px' }}></div>
                                 <span style={{ fontSize: '12px', color: '#666' }}>0.2-0.4</span>
                               </div>
                               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px' }}>
                                 <div style={{ width: '40px', height: '60px', background: '#f39c12', marginBottom: '5px' }}></div>
                                 <span style={{ fontSize: '12px', color: '#666' }}>0.4-0.6</span>
                               </div>
                               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px' }}>
                                 <div style={{ width: '40px', height: '110px', background: '#f39c12', marginBottom: '5px' }}></div>
                                 <span style={{ fontSize: '12px', color: '#666' }}>0.6-0.8</span>
                               </div>
                               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px' }}>
                                 <div style={{ width: '40px', height: '150px', background: '#27ae60', marginBottom: '5px' }}></div>
                                 <span style={{ fontSize: '12px', color: '#666' }}>0.8-1.0</span>
                               </div>
                             </div>
                             <div style={{ textAlign: 'center', marginTop: '20px' }}>
                               <span style={{ fontSize: '14px', color: '#2c3e50', fontWeight: '500' }}>Confidence Score Range</span>
                             </div>
                           </div>
                           <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '15px' }}>
                             <div style={{ display: 'flex', alignItems: 'center' }}>
                               <div style={{ width: '15px', height: '15px', background: '#27ae60', marginRight: '5px' }}></div>
                               <span style={{ fontSize: '12px' }}>High Confidence (&ge;0.8)</span>
                             </div>
                             <div style={{ display: 'flex', alignItems: 'center' }}>
                               <div style={{ width: '15px', height: '15px', background: '#f39c12', marginRight: '5px' }}></div>
                               <span style={{ fontSize: '12px' }}>Medium Confidence (0.4-0.8)</span>
                             </div>
                             <div style={{ display: 'flex', alignItems: 'center' }}>
                               <div style={{ width: '15px', height: '15px', background: '#e74c3c', marginRight: '5px' }}></div>
                               <span style={{ fontSize: '12px' }}>Low Confidence (&lt;0.4)</span>
                             </div>
                           </div>
                           <div style={{ borderTop: '1px solid #e9ecef', paddingTop: '15px', marginTop: '15px', fontSize: '12px', color: '#6c757d' }}>
                             Total Predictions: 1000 | High Confidence: 642 (64.2%)
                           </div>
                         </div>
                       </div>
                         <p style={{ 
                           fontSize: '14px', 
                           color: '#666', 
                           fontStyle: 'italic', 
                           marginTop: '10px',
                           maxWidth: '600px',
                           margin: '10px auto 0'
                         }}>
                         Confidence score distribution across different object categories, demonstrating the model's prediction certainty.
                         </p>
                       </div>
                   </div>

                   {/* References Section */}
                   <div id="references" style={{ marginBottom: '20px' }}>
                     <h3 style={{ color: '#2c3e50', fontSize: '22px', marginBottom: '20px', borderBottom: '2px solid #2c3e50', paddingBottom: '8px' }}>References</h3>
                     <div style={{
                       backgroundColor: '#f8f9fa',
                       border: '1px solid #e9ecef',
                       borderRadius: '8px',
                       padding: '25px',
                       lineHeight: '1.6'
                     }}>
                       <p style={{ margin: 0, color: '#495057', fontSize: '16px' }}>
                         {modelDocs[selectedModel].citation}
                       </p>
                       <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
                         <p><strong>Additional Resources:</strong></p>
                         <ul style={{ paddingLeft: '20px', margin: '10px 0 0 0' }}>
                           <li><a href="https://scvi-tools.org/" target="_blank" rel="noopener noreferrer" style={{ color: '#2c3e50' }}>scvi-tools Documentation</a></li>
                           <li><a href="https://github.com/scverse/scvi-tools" target="_blank" rel="noopener noreferrer" style={{ color: '#2c3e50' }}>GitHub Repository</a></li>
                           <li><a href="https://scvi-tools.org/en/stable/tutorials/notebooks/api_overview.html" target="_blank" rel="noopener noreferrer" style={{ color: '#2c3e50' }}>API Overview Tutorial</a></li>
                         </ul>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            )}

          {/* Default content when no model is selected */}
          {!selectedModel && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#6c757d'
            }}>
              <h3 style={{ marginBottom: '15px' }}>Select a model to view documentation</h3>
              <p>Click on a model in the sidebar to explore its features and documentation.</p>
            </div>
           )}
         </div>
     </div>
  );
}

export default Models;