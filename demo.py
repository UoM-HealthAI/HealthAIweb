import gradio as gr
import pandas as pd
import scanpy as sc
import scvi
import matplotlib.pyplot as plt
from scipy.sparse import issparse
import io
import warnings
warnings.filterwarnings('ignore')
import matplotlib.pyplot as plt


def process_data(file, batch_column, max_genes=None, min_cells=3, min_genes=200):
    """Process uploaded data and prepare for scvi"""
    try:
        # Read the data
        if isinstance(file, str):
            # Direct file path (for demo data)
            adata = sc.read_h5ad(file)
        elif file.name.endswith('.csv'):
            adata = sc.read_csv(file.name, first_column_names=True)
        elif file.name.endswith('.h5ad'):
            adata = sc.read_h5ad(file.name)
        else:
            return None, "Unsupported file format. Please upload CSV or H5AD files"
        
        if issparse(adata.X):
            adata.X = adata.X.toarray()
        else:
            adata.X = adata.X.copy()
        
        # # Basic filtering
        # sc.pp.filter_cells(adata, min_genes=min_genes)
        # sc.pp.filter_genes(adata, min_cells=min_cells)
        
        # # Store raw counts
        # adata.raw = adata
        
        # # Select highly variable genes with robust error handling
        # if max_genes:
        #     sc.pp.highly_variable_genes(adata, n_top_genes=max_genes, batch_key=batch_column)
        #     adata = adata[:, adata.var.highly_variable]

        # # Setup scvi
        scvi.model.SCVI.setup_anndata(adata, batch_key=batch_column)
        
        info = f"Data processing completed:\nCells: {adata.n_obs}\nGenes: {adata.n_vars}\nBatch column: {batch_column}"
        return adata, info
    
    except Exception as e:
        return None, f"Data processing error: {str(e)}"


def train_scvi_model(adata, n_layers=2, n_latent=10, n_epochs=10, lr=1e-3):
    """Train scvi model"""
    try:
        # Create and train model
        model = scvi.model.SCVI(
            adata,
            n_layers=n_layers,
            n_latent=n_latent
        )
        
        model.train(max_epochs=n_epochs)

        
        return model, "Model training completed"
    
    except Exception as e:
        return None, f"Model training error: {str(e)}"


def perform_batch_correction(model, adata):
    """Perform batch correction using trained scvi model"""
    try:
        # Get latent representation - fix for scVI version compatibility
        if hasattr(model, 'get_latent_representation'):
            latent = model.get_latent_representation(adata)
        else:
            # Alternative method for newer scVI versions
            latent = model.get_latent_representation()
        
        adata.obsm["X_scvi"] = latent
        # Compute neighbors and UMAP on corrected data
        sc.pp.neighbors(adata, use_rep="X_scvi")
        sc.tl.umap(adata)
        
        return adata, "Batch correction completed"
    
    except Exception as e:
        return None, f"Batch correction error: {str(e)}"

def create_visualization(adata, batch_column, color_by="BATCH"):
    """Create before/after visualization"""
    try:
        fig, axes = plt.subplots(1, 2, figsize=(12, 5))
        
        # Before correction (using PCA)
        sc.pp.pca(adata)
        sc.pl.pca(adata, color=batch_column, ax=axes[0], show=False, frameon=False)
        axes[0].set_title("Before (PCA)")
        
        # After correction (using scvi latent space)
        sc.pl.umap(adata, color=batch_column, ax=axes[1], show=False, frameon=False)
        axes[1].set_title("After (scVI + UMAP)")
        
        plt.tight_layout()
        
        # Convert to PIL Image for gradio
        buf = io.BytesIO()
        plt.savefig(buf, format='png', dpi=150, bbox_inches='tight')
        buf.seek(0)
        plt.close()
        
        # Convert bytes to PIL Image
        from PIL import Image
        image = Image.open(buf)
        return image
    
    except Exception as e:
        return None


def export_results(adata, format_type="h5ad"):
    """Export corrected data"""
    try:
        if format_type == "h5ad":
            filename = "corrected_data.h5ad"
            adata.write(filename)
        elif format_type == "csv":
            filename = "corrected_data.csv"
            pd.DataFrame(adata.obsm["X_scvi"]).to_csv(filename)
        
        return filename
    
    except Exception as e:
        return None


def load_demo_data():
    """Load demo data (macaque.h5ad)"""
    try:
        import os
        demo_path = "macaque.h5ad"
        if os.path.exists(demo_path):
            return demo_path, "Demo data loaded: macaque.h5ad"
        else:
            return None, "Demo data file not found"
    except Exception as e:
        return None, f"Load demo data error: {str(e)}"


def main_pipeline(file, batch_column, max_genes, min_cells, min_genes, 
                 n_layers, n_latent, n_epochs, lr):
    """Main processing pipeline"""
    if file is None:
        return None, "Please upload data file or click Load Demo Data", None
    
    # Step 1: Process data
    adata, msg1 = process_data(file, batch_column, max_genes, min_cells, min_genes)
    if adata is None:
        return None, msg1, None
    
    # Step 2: Train model
    model, msg2 = train_scvi_model(adata, n_layers, n_latent, n_epochs, lr)
    if model is None:
        return None, msg2, None
    
    # Step 3: Perform batch correction
    adata, msg3 = perform_batch_correction(model, adata)
    if adata is None:
        return None, msg3, None
    
    # Step 4: Create visualization
    viz = create_visualization(adata, batch_column)
    
    # Store results globally for export
    global corrected_adata
    corrected_adata = adata
    
    return viz, f"{msg1}\n{msg2}\n{msg3}", "Processing completed, ready to download results"

# Global variable to store results
corrected_adata = None

def download_results(format_type):
    """Download corrected results"""
    global corrected_adata
    if corrected_adata is None:
        return None
    
    filename = export_results(corrected_adata, format_type)
    return filename

# Create Gradio interface
with gr.Blocks(title="scVI Batch Correction Tool") as demo:
    gr.Markdown("# scVI Batch Correction Tool")
    gr.Markdown("Upload single-cell data and perform batch correction using scVI")
    
    with gr.Row():
        with gr.Column(scale=1):
            gr.Markdown("### Data Input")
            file_input = gr.File(label="Upload Data File (CSV/H5AD)", file_types=[".csv", ".h5ad"])
            
            with gr.Row():
                demo_button = gr.Button("Load Demo Data (macaque.h5ad)", variant="secondary")
                quick_train_button = gr.Button("Quick Train Demo", variant="primary")
            
            demo_status = gr.Textbox(label="Demo Status", value="Click button above to load demo data")
            batch_column = gr.Textbox(label="Batch Column Name", value="BATCH", placeholder="e.g.: BATCH, batch, sample, condition")
            
            gr.Markdown("### Data Preprocessing Parameters")
            max_genes = gr.Number(label="Max Genes (optional)", value=2000, precision=0)
            min_cells = gr.Number(label="Min Cells", value=3, precision=0)
            min_genes = gr.Number(label="Min Genes", value=200, precision=0)
            
            gr.Markdown("### Model Parameters")
            n_layers = gr.Number(label="Number of Layers", value=2, precision=0)
            n_latent = gr.Number(label="Latent Dimensions", value=10, precision=0)
            n_epochs = gr.Number(label="Training Epochs", value=100, precision=0)
            lr = gr.Number(label="Learning Rate", value=1e-3, precision=6)
            
            run_button = gr.Button("Run Batch Correction", variant="primary")
        
        with gr.Column(scale=2):
            gr.Markdown("### Results")
            status_output = gr.Textbox(label="Status Information", lines=10)
            image_output = gr.Image(label="Visualization Results")
            
            gr.Markdown("### Download Results")
            download_status = gr.Textbox(label="Download Status", value="Please run analysis first")
            format_choice = gr.Radio(["h5ad", "csv"], label="Download Format", value="h5ad")
            download_button = gr.Button("Download Results")
            file_output = gr.File(label="Download File")
    
    # Event handlers
    def handle_demo_load():
        demo_path, msg = load_demo_data()
        if demo_path:
            return gr.update(value=demo_path), msg
        else:
            return gr.update(), msg
    
    def handle_quick_train():
        demo_path, msg = load_demo_data()
        if demo_path:
            # Use demo data with optimized parameters for quick training
            return main_pipeline(
                file=demo_path,
                batch_column="BATCH",
                max_genes=2000,
                min_cells=3,
                min_genes=200,
                n_layers=2,
                n_latent=10,
                n_epochs=50,  # Reduced epochs for quick demo
                lr=1e-3
            )
        else:
            return None, msg, None
    
    demo_button.click(
        fn=handle_demo_load,
        outputs=[file_input, demo_status]
    )
    
    quick_train_button.click(
        fn=handle_quick_train,
        outputs=[image_output, status_output, download_status]
    )
    
    run_button.click(
        fn=main_pipeline,
        inputs=[file_input, batch_column, max_genes, min_cells, min_genes, 
                n_layers, n_latent, n_epochs, lr],
        outputs=[image_output, status_output, download_status]
    )
    
    download_button.click(
        fn=download_results,
        inputs=[format_choice],
        outputs=[file_output]
    )
    
    gr.Markdown("""
    ### Usage Instructions
    1. **Quick Demo**: Click "Quick Train Demo" button to use built-in macaque.h5ad data for demonstration
    2. **Custom Data**: Upload single-cell data file (CSV format: rows=cells, columns=genes; H5AD format: scanpy standard)
    3. Specify batch column name (column containing batch information)
    4. Adjust preprocessing and model parameters
    5. Click "Run Batch Correction" to start processing
    6. View visualization results and download processed data
    
    ### Demo Data Information
    - **macaque.h5ad**: Macaque single-cell data with multiple batches
    - **Batch Column**: Use "BATCH" as batch column name
    - **Quick Training**: Uses optimized parameters for fast demonstration
    
    ### Notes
    - Ensure correct data format and batch column exists
    - Training time depends on data size and parameter settings
    - Demo data training takes approximately 2-5 minutes
    """)

if __name__ == "__main__":
    demo.launch(server_port=7862)