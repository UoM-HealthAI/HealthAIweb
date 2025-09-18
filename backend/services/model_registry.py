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
    # Try multiple possible locations and validate content
    possible_paths = [
        "./model_registry",     # Current directory (Render)
        "../model_registry",    # Parent directory
        "/app/model_registry",  # Docker container
        "/opt/render/project/src/model_registry"  # Render specific
    ]
    
    models_dir = None
    for path in possible_paths:
        if os.path.exists(path):
            # Validate that this directory contains our models
            expected_models = {"scvi_model", "image_classifier"}
            found_models = {d for d in os.listdir(path) 
                          if os.path.isdir(os.path.join(path, d)) and d in expected_models}
            
            if found_models:  # Only use this path if we found actual models
                print(f"Found models {found_models} in {path}")
                models_dir = path
                break
            else:
                print(f"No valid models found in {path}")
    
    print(f"Looking for models in: {models_dir}")
    
    # Step 2: Check if the folder exists
    if not models_dir or not os.path.exists(models_dir):
        print("Model registry folder not found in any of the expected locations!")
        print(f"Checked paths: {possible_paths}")
        return []
    
    # Step 3: Find all folders inside model_registry
    models = []
    
    # Define allowed models explicitly
    allowed_models = ["scvi_model", "image_classifier"]
    
    for item in os.listdir(models_dir):
        item_path = os.path.join(models_dir, item)
        
        # Only process allowed model directories
        if os.path.isdir(item_path) and item in allowed_models:
            print(f"Found model folder: {item}")
            
            # Add basic info with descriptions
            model_descriptions = {
                "scvi_model": "Dimensionality reduction & batch correction",
                "image_classifier": "Object recognition & image analysis"
            }
            
            # Custom name mapping for better display names
            model_names = {
                "scvi_model": "scVI Model",
                "image_classifier": "Image Classifier"
            }
            
            model_info = {
                "id": item,
                "name": model_names.get(item, item.replace("_", " ").title()),
                "description": model_descriptions.get(item, "AI model for data analysis"),
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