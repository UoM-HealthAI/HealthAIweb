"""
Model Execution Service
Manages the execution of AI models with standardized interface
"""

import os
import sys
import importlib.util
from pathlib import Path
from typing import Dict, Any, Optional
import yaml
from datetime import datetime

from core.model_interface import validate_model_result, create_error_result


class ModelExecutor:
    """Handles execution of AI models in the model registry"""
    
    def __init__(self):
        self.model_registry_path = self._find_model_registry()
        self.available_models = self._scan_available_models()
    
    def _find_model_registry(self) -> Path:
        """Find the model registry directory"""
        # Try Docker path first, then local path
        docker_path = Path("/app/model_registry")
        local_path = Path(__file__).parent.parent.parent / "model_registry"
        
        if docker_path.exists():
            return docker_path
        elif local_path.exists():
            return local_path
        else:
            raise FileNotFoundError("Model registry directory not found")
    
    def _scan_available_models(self) -> Dict[str, Dict[str, Any]]:
        """Scan for available models and their configurations"""
        models = {}
        
        if not self.model_registry_path.exists():
            return models
        
        for model_dir in self.model_registry_path.iterdir():
            if model_dir.is_dir():
                config_path = model_dir / "config.yaml"
                model_py_path = model_dir / "model.py"
                
                if config_path.exists() and model_py_path.exists():
                    try:
                        with open(config_path, 'r') as f:
                            config = yaml.safe_load(f)
                        
                        models[model_dir.name] = {
                            "config": config,
                            "model_path": model_py_path,
                            "directory": model_dir
                        }
                    except Exception as e:
                        print(f"Warning: Failed to load model {model_dir.name}: {e}")
        
        return models
    
    def get_model_info(self, model_id: str) -> Optional[Dict[str, Any]]:
        """Get information about a specific model"""
        return self.available_models.get(model_id)
    
    def list_available_models(self) -> Dict[str, Dict[str, Any]]:
        """Get list of all available models"""
        return self.available_models
    
    def execute_model(
        self,
        model_id: str,
        input_path: str,
        output_dir: str,
        parameters: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Execute a model with given parameters
        
        Args:
            model_id: ID of the model to execute
            input_path: Path to input data file
            output_dir: Directory to save results
            parameters: Model-specific parameters
            
        Returns:
            Standardized result dictionary
        """
        
        if parameters is None:
            parameters = {}
        
        # Input validation
        if not model_id:
            return create_error_result("Model ID is required", "missing_parameter")
        
        if not input_path:
            return create_error_result("Input path is required", "missing_parameter")
            
        if not output_dir:
            return create_error_result("Output directory is required", "missing_parameter")
        
        # Check if input file exists
        if not os.path.exists(input_path):
            return create_error_result(
                f"Input file not found: {input_path}",
                "file_not_found"
            )
        
        # Check if model exists
        model_info = self.get_model_info(model_id)
        if not model_info:
            return create_error_result(
                f"Model '{model_id}' not found. Available models: {list(self.available_models.keys())}",
                "model_not_found"
            )
        
        # Create output directory
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        try:
            # Load and execute the model
            result = self._load_and_run_model(
                model_info,
                input_path,
                str(output_path),
                parameters
            )
            
            # Validate result format
            try:
                validate_model_result(result)
                print(f"Model result validation passed for {model_id}")
            except ValueError as validation_error:
                print(f"Warning: Model result validation failed for {model_id}: {validation_error}")
                # Continue with execution but log validation issue
            
            # Add execution metadata
            if "metadata" not in result:
                result["metadata"] = {}
            
            result["metadata"].update({
                "model_id": model_id,
                "execution_timestamp": datetime.now().isoformat(),
                "input_file": input_path,
                "output_directory": str(output_path)
            })
            
            return result
            
        except ImportError as e:
            return create_error_result(
                f"Missing required libraries for model '{model_id}': {str(e)}",
                "dependency_error"
            )
        except FileNotFoundError as e:
            return create_error_result(
                f"Required file not found for model '{model_id}': {str(e)}",
                "file_not_found"
            )
        except PermissionError as e:
            return create_error_result(
                f"Permission denied during model execution: {str(e)}",
                "permission_error"
            )
        except MemoryError:
            return create_error_result(
                f"Out of memory during model '{model_id}' execution. Try with smaller data or adjust parameters.",
                "memory_error"
            )
        except TimeoutError:
            return create_error_result(
                f"Model '{model_id}' execution timed out",
                "timeout_error"
            )
        except Exception as e:
            return create_error_result(
                f"Model execution failed: {str(e)}",
                "execution_error"
            )
    
    def _load_and_run_model(
        self,
        model_info: Dict[str, Any],
        input_path: str,
        output_dir: str,
        parameters: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Load and execute model from its Python file"""
        
        model_path = model_info["model_path"]
        config = model_info["config"]
        
        # Get the main function name from config
        interface_config = config.get("interface", {})
        main_function = interface_config.get("main_function", "run_model")
        
        # Load the model module
        spec = importlib.util.spec_from_file_location("dynamic_model", model_path)
        module = importlib.util.module_from_spec(spec)
        
        # Add model directory to path so model can import local files
        model_dir = str(model_info["directory"])
        if model_dir not in sys.path:
            sys.path.insert(0, model_dir)
        
        try:
            spec.loader.exec_module(module)
            
            # Get the main function
            if not hasattr(module, main_function):
                raise AttributeError(f"Model does not have function '{main_function}'")
            
            model_function = getattr(module, main_function)
            
            # Merge default parameters with user parameters
            default_params = config.get("parameters", {}).get("default", {})
            final_params = {**default_params, **parameters}
            
            # Execute the model
            result = model_function(
                input_path=input_path,
                output_dir=output_dir,
                **final_params
            )
            
            # Validate result format
            try:
                validate_model_result(result)
                print(f"Model result validation passed for {model_id}")
            except ValueError as e:
                print(f"Warning: Model result validation failed for {model_id}: {e}")
                # Still return the result but log the validation issue
            
            return result
            
        finally:
            # Clean up path
            if model_dir in sys.path:
                sys.path.remove(model_dir)


# Global model executor instance
_model_executor = None

def get_model_executor() -> ModelExecutor:
    """Get global model executor instance"""
    global _model_executor
    if _model_executor is None:
        _model_executor = ModelExecutor()
    return _model_executor