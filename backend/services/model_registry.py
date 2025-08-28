"""
Model Registry Service
Scans model_registry/ folder and reads config.yaml files
"""

import os
from typing import List, Dict, Any

def scan_models() -> List[Dict[str, Any]]:
    """
    Scan model_registry folder and return list of available models
    
    Returns:
        List[Dict]: List of model information
    """
    print("Starting model scan...")
    
    # Step 1: Find the model_registry folder
    # Try multiple possible locations
    possible_paths = [
        "/app/model_registry",  # Docker container
        "./model_registry",     # Current directory (Render)
        "../model_registry",    # Parent directory
        "/opt/render/project/src/model_registry"  # Render specific
    ]
    
    models_dir = None
    for path in possible_paths:
        if os.path.exists(path):
            models_dir = path
            break
    
    print(f"Looking for models in: {models_dir}")
    
    # Step 2: Check if the folder exists
    if not models_dir or not os.path.exists(models_dir):
        print("Model registry folder not found in any of the expected locations!")
        print(f"Checked paths: {possible_paths}")
        return []
    
    # Step 3: Find all folders inside model_registry
    models = []
    
    for item in os.listdir(models_dir):
        item_path = os.path.join(models_dir, item)
        
        # Only process directories (skip files)
        if os.path.isdir(item_path):
            print(f"Found model folder: {item}")
            
            # For now, just add basic info
            model_info = {
                "id": item,
                "name": item.replace("_", " ").title(),
                "status": "found"
            }
            
            models.append(model_info)
    
    print(f"Found {len(models)} models")
    return models


if __name__ == "__main__":
    # Test the scanner
    print("Testing Model Scanner...")
    result = scan_models()
    print("Result:", result) 