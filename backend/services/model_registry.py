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
    # In Docker container, it's mounted at /app/model_registry
    models_dir = "/app/model_registry"
    
    print(f"Looking for models in: {models_dir}")
    
    # Step 2: Check if the folder exists
    if not os.path.exists(models_dir):
        print("Model registry folder not found!")
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