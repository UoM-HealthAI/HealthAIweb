"""
Standard Model Interface Definition
All AI models must implement this interface for consistent execution
"""

from typing import Dict, Any, Protocol
from pathlib import Path


class ModelInterface(Protocol):
    """
    Standard interface that all AI models must implement
    
    This ensures consistent behavior across all models in the platform
    """
    
    def run_model(
        self,
        input_path: str,
        output_dir: str,
        **parameters
    ) -> Dict[str, Any]:
        """
        Execute the AI model with given parameters
        
        Args:
            input_path (str): Path to input data file (.csv or .h5ad)
            output_dir (str): Directory where results should be saved
            **parameters: Model-specific parameters from config.yaml
            
        Returns:
            Dict[str, Any]: Standardized result dictionary with following structure:
            {
                "status": "success" | "failed",
                "visualizations": {
                    "plot_name": "path/to/plot.png",
                    ...
                },
                "data_files": {
                    "file_name": "path/to/data.csv",
                    ...
                },
                "metadata": {
                    "execution_time": "2.5 minutes",
                    "parameters_used": {...},
                    "model_version": "1.0.0",
                    ...
                }
            }
        """
        ...


def validate_model_result(result: Dict[str, Any]) -> bool:
    """
    Validate that model result follows the standard format
    
    Args:
        result: Result dictionary from model execution
        
    Returns:
        bool: True if result format is valid
        
    Raises:
        ValueError: If result format is invalid
    """
    
    # Required top-level keys
    required_keys = {"status", "visualizations", "data_files", "metadata"}
    
    if not isinstance(result, dict):
        raise ValueError("Result must be a dictionary")
    
    missing_keys = required_keys - set(result.keys())
    if missing_keys:
        raise ValueError(f"Missing required keys: {missing_keys}")
    
    # Validate status
    if result["status"] not in ["success", "failed"]:
        raise ValueError("Status must be 'success' or 'failed'")
    
    # Validate visualizations structure
    if not isinstance(result["visualizations"], dict):
        raise ValueError("visualizations must be a dictionary")
    
    # Validate data_files structure
    if not isinstance(result["data_files"], dict):
        raise ValueError("data_files must be a dictionary")
    
    # Validate metadata structure
    if not isinstance(result["metadata"], dict):
        raise ValueError("metadata must be a dictionary")
    
    return True


def create_standard_result(
    status: str,
    visualizations: Dict[str, str] = None,
    data_files: Dict[str, str] = None,
    metadata: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Helper function to create standardized result dictionary
    
    Args:
        status: "success" or "failed"
        visualizations: Dictionary of visualization name -> file path
        data_files: Dictionary of data file name -> file path
        metadata: Dictionary of metadata information
        
    Returns:
        Standardized result dictionary
    """
    
    result = {
        "status": status,
        "visualizations": visualizations or {},
        "data_files": data_files or {},
        "metadata": metadata or {}
    }
    
    # Validate the result before returning
    validate_model_result(result)
    
    return result


# Standard error result for failed executions
def create_error_result(error_message: str, error_type: str = "execution_error") -> Dict[str, Any]:
    """
    Create standardized error result
    
    Args:
        error_message: Description of the error
        error_type: Type of error (execution_error, validation_error, etc.)
        
    Returns:
        Standardized error result dictionary
    """
    
    return create_standard_result(
        status="failed",
        metadata={
            "error_type": error_type,
            "error_message": error_message
        }
    )