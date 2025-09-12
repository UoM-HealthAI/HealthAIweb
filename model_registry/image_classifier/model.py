"""
Image Classification Model Implementation
Uses pre-trained ResNet model for image classification
"""

import os
import time
import json
import torch
import torchvision.transforms as transforms
import torchvision.models as models
from PIL import Image
import matplotlib.pyplot as plt
import pandas as pd
from typing import Dict, Any, List, Tuple
from pathlib import Path

# ImageNet class names (simplified version - first 20 classes for demo)
IMAGENET_CLASSES = [
    "tench", "goldfish", "great white shark", "tiger shark", "hammerhead",
    "electric ray", "stingray", "cock", "hen", "ostrich",
    "brambling", "goldfinch", "house finch", "junco", "indigo bunting",
    "robin", "bulbul", "jay", "magpie", "chickadee"
]

def run_image_classifier(
    input_path: str,
    output_dir: str,
    confidence_threshold: float = 0.5,
    top_k: int = 5,
    image_size: int = 224
) -> Dict[str, Any]:
    """
    Main image classification function used in our web application
    
    Args:
        input_path: Path to input image file
        output_dir: Directory to save results
        confidence_threshold: Minimum confidence for predictions
        top_k: Number of top predictions to return
        image_size: Size to resize image to (default: 224x224)
    
    Returns:
        Standardized result dictionary
    """
    
    start_time = time.time()
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"Processing {input_path} with Image Classification model...")
    print(f"Parameters: confidence_threshold={confidence_threshold}, top_k={top_k}")
    
    try:
        # Load and preprocess image
        image = _load_image(input_path, image_size)
        
        # Load pre-trained model
        model = _load_model()
        
        # Make predictions
        predictions = _predict_image(model, image, top_k)
        
        # Filter by confidence threshold
        filtered_predictions = [
            pred for pred in predictions 
            if pred['confidence'] >= confidence_threshold
        ]
        
        # Generate outputs
        _generate_visualizations(input_path, filtered_predictions, output_dir)
        _generate_data_files(filtered_predictions, output_dir)
        
        execution_time = time.time() - start_time
        print(f"Image classification completed in {execution_time:.2f} seconds")
        
        return {
            "status": "success",
            "visualizations": {
                "prediction_chart": os.path.join(output_dir, "prediction_chart.png"),
                "processed_image": os.path.join(output_dir, "processed_image.png")
            },
            "data_files": {
                "predictions": os.path.join(output_dir, "predictions.csv"),
                "confidence_scores": os.path.join(output_dir, "confidence_scores.json")
            },
            "metadata": {
                "execution_time": execution_time,
                "total_predictions": len(filtered_predictions),
                "confidence_threshold": confidence_threshold,
                "top_k": top_k,
                "model_summary": os.path.join(output_dir, "model_summary.json")
            }
        }
        
    except Exception as e:
        print(f"Error in image classification: {str(e)}")
        return {
            "status": "failed",
            "visualizations": {},
            "data_files": {},
            "metadata": {
                "error_message": str(e),
                "error_type": "classification_error"
            }
        }

def _load_image(image_path: str, size: int = 224) -> torch.Tensor:
    """Load and preprocess image for classification"""
    print(f"Loading image: {image_path}")
    
    # Define image transformations
    transform = transforms.Compose([
        transforms.Resize((size, size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                           std=[0.229, 0.224, 0.225])
    ])
    
    # Load image
    image = Image.open(image_path).convert('RGB')
    image_tensor = transform(image).unsqueeze(0)  # Add batch dimension
    
    print(f"Image loaded and preprocessed: {image_tensor.shape}")
    return image_tensor

def _load_model():
    """Load pre-trained ResNet model"""
    print("Loading pre-trained ResNet model...")
    
    # Load pre-trained ResNet-18 (lighter than ResNet-50)
    model = models.resnet18(pretrained=True)
    model.eval()  # Set to evaluation mode
    
    print("Model loaded successfully")
    return model

def _predict_image(model, image_tensor: torch.Tensor, top_k: int = 5) -> List[Dict[str, Any]]:
    """Make predictions on the image"""
    print("Making predictions...")
    
    with torch.no_grad():
        outputs = model(image_tensor)
        probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
        
        # Get top-k predictions
        top_prob, top_indices = torch.topk(probabilities, top_k)
        
        predictions = []
        for i in range(top_k):
            class_idx = top_indices[i].item()
            confidence = top_prob[i].item()
            
            # Use simplified class names for demo
            class_name = IMAGENET_CLASSES[class_idx] if class_idx < len(IMAGENET_CLASSES) else f"class_{class_idx}"
            
            predictions.append({
                "class_name": class_name,
                "class_index": class_idx,
                "confidence": confidence
            })
    
    print(f"Generated {len(predictions)} predictions")
    return predictions

def _generate_visualizations(input_path: str, predictions: List[Dict[str, Any]], output_dir: str):
    """Generate visualization plots"""
    print("Generating visualizations...")
    
    # 1. Prediction confidence chart
    if predictions:
        plt.figure(figsize=(10, 6))
        classes = [pred['class_name'] for pred in predictions]
        confidences = [pred['confidence'] for pred in predictions]
        
        plt.barh(classes, confidences)
        plt.xlabel('Confidence Score')
        plt.title('Image Classification Results')
        plt.grid(True, alpha=0.3)
        
        # Add confidence values on bars
        for i, confidence in enumerate(confidences):
            plt.text(confidence + 0.01, i, f'{confidence:.3f}', 
                    va='center', fontsize=10)
        
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, "prediction_chart.png"), 
                   dpi=300, bbox_inches='tight')
        plt.close()
    
    # 2. Processed image with top prediction
    try:
        original_image = Image.open(input_path)
        plt.figure(figsize=(8, 8))
        plt.imshow(original_image)
        plt.axis('off')
        
        if predictions:
            top_prediction = predictions[0]
            title = f"Prediction: {top_prediction['class_name']}\nConfidence: {top_prediction['confidence']:.3f}"
            plt.title(title, fontsize=14, pad=20)
        else:
            plt.title("No predictions above threshold", fontsize=14, pad=20)
        
        plt.savefig(os.path.join(output_dir, "processed_image.png"), 
                   dpi=300, bbox_inches='tight')
        plt.close()
        
    except Exception as e:
        print(f"Warning: Could not generate processed image: {e}")

def _generate_data_files(predictions: List[Dict[str, Any]], output_dir: str):
    """Save prediction results to files"""
    print("Saving data files...")
    
    # Save predictions as CSV
    if predictions:
        df = pd.DataFrame(predictions)
        df.to_csv(os.path.join(output_dir, "predictions.csv"), index=False)
    else:
        # Create empty CSV with headers
        df = pd.DataFrame(columns=['class_name', 'class_index', 'confidence'])
        df.to_csv(os.path.join(output_dir, "predictions.csv"), index=False)
    
    # Save detailed confidence scores as JSON
    confidence_data = {
        "predictions": predictions,
        "total_predictions": len(predictions),
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    
    with open(os.path.join(output_dir, "confidence_scores.json"), 'w') as f:
        json.dump(confidence_data, f, indent=2)
    
    # Save model summary
    summary = {
        "model_type": "Image Classification",
        "architecture": "ResNet-18",
        "total_classes": len(IMAGENET_CLASSES),
        "predictions_made": len(predictions),
        "processing_date": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    
    with open(os.path.join(output_dir, "model_summary.json"), 'w') as f:
        json.dump(summary, f, indent=2)
    
    print("Data files saved successfully")

# Test function for development
if __name__ == "__main__":
    # This is for testing the model during development
    print("Image Classification Model - Test Mode")
    print("This would normally be called by the web application")
