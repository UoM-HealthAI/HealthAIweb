import React, { useState, useEffect } from 'react';

// Type definition for model information (TypeScript)
interface Model {
  id: string;
  name: string;
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
  const [expandedDocs, setExpandedDocs] = useState<{[key: string]: boolean}>({});
  const [modelDocs, setModelDocs] = useState<{[key: string]: ModelDocumentation}>({});
  const [copiedState, setCopiedState] = useState<{[key: string]: boolean}>({});

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
         // Use fallback documentation if API doesn't exist yet
         const fallbackDocs: ModelDocumentation = {
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
- l ~ LogNormal(l_m, l_v) (library size)

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
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* Left Sidebar */}
        <div style={{
          width: '180px',
          backgroundColor: '#f8f9fa',
          padding: '15px 5px',
          borderRight: '1px solid #dee2e6',
          flexShrink: 0,
          marginRight: '10px'
        }}>
          <div style={{ marginBottom: '30px' }}>
            <span style={{ color: '#ff6b35', fontSize: '24px', fontWeight: 'bold' }}>🧬</span>
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
        <div style={{ flex: 1, padding: '40px 15px' }}>
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
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* Left Sidebar */}
        <div style={{
          width: '180px',
          backgroundColor: '#f8f9fa',
          padding: '15px 5px',
          borderRight: '1px solid #dee2e6',
          flexShrink: 0,
          marginRight: '10px'
        }}>
          <div style={{ marginBottom: '30px' }}>
            <span style={{ color: '#ff6b35', fontSize: '24px', fontWeight: 'bold' }}>🧬</span>
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
        <div style={{ flex: 1, padding: '40px 15px' }}>
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
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif', width: '100%', maxWidth: '100vw' }}>
       {/* Left Sidebar */}
       <div style={{
         width: '180px',
         backgroundColor: '#f8f9fa',
         padding: '15px 5px',
         borderRight: '1px solid #dee2e6',
         overflowY: 'auto',
         flexShrink: 0,
         marginRight: '10px'
       }}>
        {/* Logo */}
        <div style={{ marginBottom: '30px' }}>
          <span style={{ color: '#ff6b35', fontSize: '24px', fontWeight: 'bold' }}>🧬</span>
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
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              borderRadius: '5px',
              borderLeft: '3px solid #1976d2',
              marginBottom: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d1ecf1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#e3f2fd';
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
                  setExpandedDocs(prev => ({
                    ...prev,
                    [model.id]: true
                  }));
                  loadModelDocumentation(model.id);
                }}
                style={{
                  padding: '8px 15px',
                  cursor: 'pointer',
                  borderRadius: '5px',
                  backgroundColor: expandedDocs[model.id] ? '#e8f4f8' : 'transparent',
                  border: expandedDocs[model.id] ? '1px solid #b3d9ff' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  if (!expandedDocs[model.id]) {
                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!expandedDocs[model.id]) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {model.name}
              </div>
            </div>
          ))}
        </nav>
      </div>

       {/* Main Content Area */}
       <div style={{ flex: 1, display: 'flex' }}>
         {/* Central Content */}
         <div style={{ flex: 1, padding: '40px 15px', overflowY: 'auto', minWidth: 0, maxWidth: 'none' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px', color: '#2c3e50' }}>
            Available Models
          </h1>
          <p style={{ color: '#6c757d', marginBottom: '40px' }}>
            Choose from our collection of pre-trained AI models for single-cell data analysis
          </p>

          {/* Model Documentation Display */}
          {models.map((model) => (
            expandedDocs[model.id] && modelDocs[model.id] && (
               <div key={`${model.id}-docs`} style={{
                 backgroundColor: '#ffffff',
                 border: '1px solid #e0e0e0',
                 borderRadius: '8px',
                 padding: '15px',
                 marginBottom: '30px',
                 boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
               }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
                  <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>
                    {model.name}
                  </h2>
                  <button
                    onClick={() => window.location.href = `/upload?model=${model.id}`}
                    style={{
                      backgroundColor: '#007bff',
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
                      e.currentTarget.style.backgroundColor = '#0056b3';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#007bff';
                    }}
                  >
                    Use Model
                  </button>
                </div>

                 {/* All Content in One Page */}
                 <div>
                   {/* Overview Section */}
                   <div id="overview" style={{ marginBottom: '40px' }}>
                     <h3 style={{ color: '#2c3e50', fontSize: '22px', marginBottom: '20px', borderBottom: '2px solid #007bff', paddingBottom: '8px' }}>Overview</h3>
                     
                     <div style={{ marginBottom: '25px' }}>
                       <h4 style={{ color: '#2c3e50', fontSize: '18px', marginBottom: '10px' }}>Description</h4>
                       <p style={{ lineHeight: '1.8', color: '#555', fontSize: '16px', maxWidth: '100%' }}>
                         {modelDocs[model.id].simple_explanation}
                       </p>
                     </div>

                     {/* Model Architecture Figure */}
                     {modelDocs[model.id].figures && modelDocs[model.id].figures!.length > 0 && (
                       <div style={{ marginBottom: '25px', textAlign: 'center' }}>
                         <img 
                           src={modelDocs[model.id].figures![0].url}
                           alt={modelDocs[model.id].figures![0].alt}
                           style={{ 
                             maxWidth: '100%', 
                             height: 'auto', 
                             border: '1px solid #e0e0e0',
                             borderRadius: '8px',
                             boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                           }}
                         />
                         <p style={{ 
                           fontSize: '14px', 
                           color: '#666', 
                           fontStyle: 'italic', 
                           marginTop: '10px',
                           maxWidth: '600px',
                           margin: '10px auto 0'
                         }}>
                           {modelDocs[model.id].figures![0].caption}
                         </p>
                       </div>
                     )}

                     <div style={{ marginBottom: '25px' }}>
                       <h4 style={{ color: '#2c3e50', fontSize: '18px', marginBottom: '10px' }}>When to Use</h4>
                       <ul style={{ paddingLeft: '20px', lineHeight: '1.6', color: '#555', fontSize: '16px' }}>
                         {modelDocs[model.id].when_to_use.map((item, index) => (
                           <li key={index} style={{ marginBottom: '8px' }}>{item}</li>
                         ))}
                       </ul>
                     </div>

                     <div style={{ marginBottom: '25px' }}>
                       <h4 style={{ color: '#2c3e50', fontSize: '18px', marginBottom: '10px' }}>Key Features</h4>
                       <ul style={{ paddingLeft: '20px', lineHeight: '1.6', color: '#555', fontSize: '16px' }}>
                         {modelDocs[model.id].features.map((feature, index) => (
                           <li key={index} style={{ marginBottom: '8px' }}>{feature}</li>
                         ))}
                       </ul>
                     </div>

                     <div>
                       <h4 style={{ color: '#2c3e50', fontSize: '18px', marginBottom: '10px' }}>Technical Details</h4>
                       <ul style={{ paddingLeft: '20px', lineHeight: '1.6', color: '#555', fontSize: '16px' }}>
                         {modelDocs[model.id].technical_details.map((detail, index) => (
                           <li key={index} style={{ marginBottom: '8px' }}>{detail}</li>
                         ))}
                       </ul>
                     </div>
                   </div>

                   {/* Preprocessing Section */}
                   <div id="preprocessing" style={{ marginBottom: '40px' }}>
                     <h3 style={{ color: '#2c3e50', fontSize: '22px', marginBottom: '20px', borderBottom: '2px solid #007bff', paddingBottom: '8px' }}>Preprocessing</h3>
                     <p style={{ marginBottom: '20px', color: '#555', fontSize: '16px', lineHeight: '1.8', maxWidth: '100%' }}>
                       Proper preprocessing is crucial for scVI performance. Follow these steps to prepare your data:
                     </p>
                     <div style={{ position: 'relative' }}>
                       <button
                         onClick={() => copyToClipboard(modelDocs[model.id].preprocessing_code || '', `${model.id}-preproc`)}
                         style={{
                           position: 'absolute',
                           top: '10px',
                           right: '10px',
                           backgroundColor: '#007bff',
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
                         {copiedState[`${model.id}-preproc`] ? 'Copied' : 'Copy'}
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
                         {modelDocs[model.id].preprocessing_code || 'Standard preprocessing pipeline for single-cell RNA sequencing data preparation.'}
                       </div>
                     </div>
                   </div>

                   {/* Mathematical Formulation Section */}
                   <div id="mathematical-formulation" style={{ marginBottom: '40px' }}>
                     <h3 style={{ color: '#2c3e50', fontSize: '22px', marginBottom: '20px', borderBottom: '2px solid #007bff', paddingBottom: '8px' }}>Mathematical Formulation</h3>
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
                         {modelDocs[model.id].mathematical_formulation || 'Probabilistic generative model based on variational autoencoders for single-cell RNA sequencing data analysis.'}
                     </div>
                   </div>

                   {/* Code Example Section */}
                   <div id="code-example" style={{ marginBottom: '40px' }}>
                     <h3 style={{ color: '#2c3e50', fontSize: '22px', marginBottom: '20px', borderBottom: '2px solid #007bff', paddingBottom: '8px' }}>Code Example</h3>
                     <p style={{ marginBottom: '20px', color: '#555', fontSize: '16px', lineHeight: '1.8', maxWidth: '100%' }}>
                       Complete workflow for training and using scVI on your single-cell data:
                     </p>
                     <div style={{ position: 'relative' }}>
                       <button
                         onClick={() => copyToClipboard(modelDocs[model.id].code_example || '', `${model.id}-code`)}
                         style={{
                           position: 'absolute',
                           top: '10px',
                           right: '10px',
                           backgroundColor: '#007bff',
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
                         {copiedState[`${model.id}-code`] ? 'Copied' : 'Copy'}
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
                         {modelDocs[model.id].code_example || 'Complete scVI training workflow with model setup, training, and downstream analysis.'}
                       </div>
                     </div>
                   </div>

                   {/* Visualization Section */}
                   <div id="visualization" style={{ marginBottom: '40px' }}>
                     <h3 style={{ color: '#2c3e50', fontSize: '22px', marginBottom: '20px', borderBottom: '2px solid #007bff', paddingBottom: '8px' }}>Visualization</h3>
                     <p style={{ marginBottom: '20px', color: '#555', fontSize: '16px', lineHeight: '1.8', maxWidth: '100%' }}>
                       Visualize and analyze your scVI results:
                     </p>
                     
                     {/* UMAP Visualization Figure */}
                     {modelDocs[model.id].figures && modelDocs[model.id].figures!.length > 1 && (
                       <div style={{ marginBottom: '25px', textAlign: 'center' }}>
                         <img 
                           src={modelDocs[model.id].figures![1].url}
                           alt={modelDocs[model.id].figures![1].alt}
                           style={{ 
                             maxWidth: '100%', 
                             height: 'auto', 
                             border: '1px solid #e0e0e0',
                             borderRadius: '8px',
                             boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                           }}
                         />
                         <p style={{ 
                           fontSize: '14px', 
                           color: '#666', 
                           fontStyle: 'italic', 
                           marginTop: '10px',
                           maxWidth: '600px',
                           margin: '10px auto 0'
                         }}>
                           {modelDocs[model.id].figures![1].caption}
                         </p>
                       </div>
                     )}

                     <div style={{ position: 'relative' }}>
                       <button
                         onClick={() => copyToClipboard(modelDocs[model.id].visualization_code || '', `${model.id}-viz`)}
                         style={{
                           position: 'absolute',
                           top: '10px',
                           right: '10px',
                           backgroundColor: '#007bff',
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
                         {copiedState[`${model.id}-viz`] ? 'Copied' : 'Copy'}
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
                         {modelDocs[model.id].visualization_code || 'Comprehensive visualization pipeline for scVI results including UMAP plots, training diagnostics, and differential expression analysis.'}
                       </div>
                     </div>

                     {/* Training Curve Figure */}
                     {modelDocs[model.id].figures && modelDocs[model.id].figures!.length > 2 && (
                       <div style={{ marginTop: '25px', textAlign: 'center' }}>
                         <img 
                           src={modelDocs[model.id].figures![2].url}
                           alt={modelDocs[model.id].figures![2].alt}
                           style={{ 
                             maxWidth: '100%', 
                             height: 'auto', 
                             border: '1px solid #e0e0e0',
                             borderRadius: '8px',
                             boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                           }}
                         />
                         <p style={{ 
                           fontSize: '14px', 
                           color: '#666', 
                           fontStyle: 'italic', 
                           marginTop: '10px',
                           maxWidth: '600px',
                           margin: '10px auto 0'
                         }}>
                           {modelDocs[model.id].figures![2].caption}
                         </p>
                       </div>
                     )}
                   </div>

                   {/* References Section */}
                   <div id="references" style={{ marginBottom: '20px' }}>
                     <h3 style={{ color: '#2c3e50', fontSize: '22px', marginBottom: '20px', borderBottom: '2px solid #007bff', paddingBottom: '8px' }}>References</h3>
                     <div style={{
                       backgroundColor: '#f8f9fa',
                       border: '1px solid #e9ecef',
                       borderRadius: '8px',
                       padding: '25px',
                       lineHeight: '1.6'
                     }}>
                       <p style={{ margin: 0, color: '#495057', fontSize: '16px' }}>
                         {modelDocs[model.id].citation}
                       </p>
                       <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
                         <p><strong>Additional Resources:</strong></p>
                         <ul style={{ paddingLeft: '20px', margin: '10px 0 0 0' }}>
                           <li><a href="https://scvi-tools.org/" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>scvi-tools Documentation</a></li>
                           <li><a href="https://github.com/scverse/scvi-tools" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>GitHub Repository</a></li>
                           <li><a href="https://scvi-tools.org/en/stable/tutorials/notebooks/api_overview.html" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>API Overview Tutorial</a></li>
                         </ul>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            )
          ))}

          {/* Default content when no model is selected */}
          {!models.some(model => expandedDocs[model.id]) && (
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

         {/* Right Sidebar - Table of Contents */}
         <div style={{
           width: '200px',
           backgroundColor: '#f8f9fa',
           padding: '15px 8px',
           borderLeft: '1px solid #dee2e6',
           overflowY: 'auto',
           flexShrink: 0,
           marginLeft: '10px'
         }}>
           {models.some(model => expandedDocs[model.id]) ? (
             <>
               <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#2c3e50' }}>
                 Contents
               </h3>
               <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                 <li style={{ marginBottom: '8px' }}>
                   <a href="#overview" style={{ color: '#007bff', textDecoration: 'none', fontSize: '14px' }}>
                     Overview
                   </a>
                 </li>
                 <li style={{ marginBottom: '8px' }}>
                   <a href="#preprocessing" style={{ color: '#007bff', textDecoration: 'none', fontSize: '14px' }}>
                     Preprocessing
                   </a>
                 </li>
                 <li style={{ marginBottom: '8px' }}>
                   <a href="#mathematical-formulation" style={{ color: '#007bff', textDecoration: 'none', fontSize: '14px' }}>
                     Mathematical Formulation
                   </a>
                 </li>
                 <li style={{ marginBottom: '8px' }}>
                   <a href="#code-example" style={{ color: '#007bff', textDecoration: 'none', fontSize: '14px' }}>
                     Code Example
                   </a>
                 </li>
                 <li style={{ marginBottom: '8px' }}>
                   <a href="#visualization" style={{ color: '#007bff', textDecoration: 'none', fontSize: '14px' }}>
                     Visualization
                   </a>
                 </li>
                 <li style={{ marginBottom: '8px' }}>
                   <a href="#references" style={{ color: '#007bff', textDecoration: 'none', fontSize: '14px' }}>
                     References
                   </a>
                 </li>
               </ul>
             </>
           ) : (
             <div style={{ color: '#6c757d', fontSize: '14px', textAlign: 'center', marginTop: '50px' }}>
               Select a model to view contents
             </div>
           )}
         </div>
       </div>
     </div>
  );
}

export default Models;