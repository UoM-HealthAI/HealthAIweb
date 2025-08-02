# Contribution Guide

## Adding New Models

This guide explains how to add new AI models to the HealthAI platform.

## Quick Start

To add a new model, you need to create **two files**:

1. `model_registry/your_model/config.yaml` - Model configuration
2. `model_registry/your_model/model.py` - Model implementation

## Step 1: Create Model Directory

Create a new folder in the model registry:

```bash
mkdir model_registry/your_model_name
```

## Step 2: Create config.yaml

Create a configuration file with the following structure:

```yaml
# Model metadata
metadata:
  name: "Your Model Name"
  description: "Brief description of what your model does"
  version: "1.0.0"

# Input specifications
input:
  supported_formats:
    - ".h5ad"  # Add supported file formats
    - ".csv"
  max_file_size: "500MB"

# Processing parameters
parameters:
  default:
    param1: 10        # Your model parameters
    param2: 400
  
  user_configurable:
    - "param1"        # Parameters users can adjust
    - "param2"

# Output specifications
output:
  visualization:
    - "plot1.png"     # Output visualization files
    - "plot2.png"
  
  data_files:
    - "results.csv"   # Output data files
    - "processed.h5ad"
  
  metadata:
    - "summary.json"  # Analysis summary

# Model interface
interface:
  entry_point: "model.py"
  main_function: "run_your_model"  # Your main function name
  runtime: "python"
  dependencies:
    - "pandas>=1.5.0"  # Required packages
    - "numpy>=1.20.0"
```

## Step 3: Create model.py

Implement your model with the standard interface:

```python
"""
Your Model Implementation
"""

import os
import json
from pathlib import Path
from typing import Dict, Any

def run_your_model(
    input_path: str,
    output_dir: str,
    param1: int = 10,
    param2: int = 400,
    **kwargs
) -> Dict[str, Any]:
    """
    Your model's main function
    
    Args:
        input_path (str): Path to input data file
        output_dir (str): Directory to save output files
        param1 (int): Your parameter 1
        param2 (int): Your parameter 2
        **kwargs: Additional parameters
        
    Returns:
        Dict[str, Any]: Result dictionary with file paths
    """
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Your model logic here
    print(f"Processing {input_path} with your model...")
    
    # Define output paths (match config.yaml)
    output_files = {
        "visualizations": {
            "plot1": os.path.join(output_dir, "plot1.png"),
            "plot2": os.path.join(output_dir, "plot2.png")
        },
        "data_files": {
            "results": os.path.join(output_dir, "results.csv"),
            "processed": os.path.join(output_dir, "processed.h5ad")
        },
        "metadata": {
            "summary": os.path.join(output_dir, "summary.json")
        }
    }
    
    # Create your output files here
    # ... your model implementation ...
    
    # Return standardized result
    result = {
        "status": "success",
        "visualizations": output_files["visualizations"],
        "data_files": output_files["data_files"],
        "metadata": {
            "summary": output_files["metadata"]["summary"],
            "parameters_used": {
                "param1": param1,
                "param2": param2
            },
            "input_file": input_path
        }
    }
    
    return result
```

## Step 4: Test Your Model

### Test Model Scanner
Check if your model is detected:

```bash
# In Docker container
docker-compose exec backend python /app/services/model_registry.py
```

### Test API
Check if your model appears in the API:

```bash
curl http://localhost:8000/models
```

You should see your model in the JSON response.

## Step 5: Add Documentation (Optional)

To add user documentation for your model:

1. Create `docs/docs/models/your_model.md`
2. Add it to `docs/mkdocs.yml` navigation
3. Restart docs service

## Model Requirements

### File Naming
- Use lowercase with underscores: `pca_analysis`, `clustering_model`
- Avoid spaces and special characters

### Function Naming
- Main function: `run_[model_name]`
- Example: `run_pca_analysis`, `run_clustering_model`

### Output Format
Always return a dictionary with:
- `status`: "success" or "error"
- `visualizations`: Dict of plot file paths
- `data_files`: Dict of data file paths  
- `metadata`: Dict with summary and parameters

## Troubleshooting

### Model Not Detected
- Check folder name and file structure
- Verify config.yaml syntax
- Restart backend service

### API Errors
- Check function name matches config.yaml
- Verify parameter names and types
- Review error logs

## Example Models

See existing models for reference:
- `model_registry/scvi_model/` - Complete example implementation

## Need Help?

- Review existing model implementations
- Check the system logs for errors
- Ensure all required files are present