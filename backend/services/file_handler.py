"""
File handling and validation service
Validates uploaded files and ensures they meet requirements
"""

import os
import pandas as pd
from pathlib import Path
from typing import Dict, Any, Tuple
from fastapi import HTTPException


class FileValidator:
    """Handles file validation for uploaded data"""
    
    # Maximum file size: 500MB
    MAX_FILE_SIZE = 500 * 1024 * 1024  # 500MB in bytes
    
    # Supported file extensions
    SUPPORTED_EXTENSIONS = {".csv", ".h5ad"}
    
    @classmethod
    def validate_file(cls, file_path: Path, file_size: int) -> Dict[str, Any]:
        """
        Validate uploaded file
        
        Args:
            file_path: Path to the uploaded file
            file_size: Size of the file in bytes
            
        Returns:
            Dict with validation results and file info
            
        Raises:
            HTTPException: If file validation fails
        """
        
        # Input validation
        if not file_path.exists():
            raise HTTPException(status_code=400, detail="Uploaded file does not exist")
        
        if file_size <= 0:
            raise HTTPException(status_code=400, detail="File is empty")
            
        # Check file size
        if file_size > cls.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413, 
                detail=f"File too large. Maximum size is {cls.MAX_FILE_SIZE // 1024 // 1024}MB, got {file_size // 1024 // 1024}MB"
            )
        
        # Check file extension
        file_extension = file_path.suffix.lower()
        if file_extension not in cls.SUPPORTED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file format '{file_extension}'. Supported formats: {', '.join(cls.SUPPORTED_EXTENSIONS)}"
            )
        
        # Validate file content based on extension
        validation_result = {
            "is_valid": True,
            "file_type": file_extension,
            "file_size": file_size,
            "validation_details": {}
        }
        
        # Add warnings based on file size
        warnings = []
        if file_size < 1024:  # Less than 1KB
            warnings.append("File is very small, may not contain meaningful data")
        elif file_size > 100 * 1024 * 1024:  # More than 100MB
            warnings.append("Large file may take longer to process")
            
        try:
            if file_extension == ".csv":
                validation_result["validation_details"] = cls._validate_csv(file_path)
            elif file_extension == ".h5ad":
                validation_result["validation_details"] = cls._validate_h5ad(file_path)
                
        except ValueError as e:
            # Handle known validation errors
            raise HTTPException(
                status_code=400,
                detail=f"File content validation failed: {str(e)}"
            )
        except FileNotFoundError:
            raise HTTPException(
                status_code=400,
                detail="File not found during validation"
            )
        except PermissionError:
            raise HTTPException(
                status_code=403,
                detail="Permission denied accessing file"
            )
        except Exception as e:
            # Handle unexpected errors
            raise HTTPException(
                status_code=500,
                detail=f"Unexpected validation error: {str(e)} (Type: {e.__class__.__name__})"
            )
        
        # Add warnings to result
        if warnings:
            validation_result["warnings"] = warnings
        
        return validation_result
    
    @classmethod
    def _validate_csv(cls, file_path: Path) -> Dict[str, Any]:
        """Validate CSV file structure"""
        try:
            # Try to read the CSV file
            df = pd.read_csv(file_path, nrows=5)  # Read only first 5 rows for validation
            
            rows, cols = df.shape
            
            # Basic validation
            if cols < 2:
                raise ValueError("CSV file must have at least 2 columns")
            
            return {
                "format": "csv",
                "columns": cols,
                "sample_rows": rows,
                "column_names": list(df.columns[:10]),  # First 10 column names
                "status": "valid"
            }
            
        except pd.errors.EmptyDataError:
            raise ValueError("CSV file is empty")
        except pd.errors.ParserError as e:
            raise ValueError(f"CSV parsing error: {str(e)}")
    
    @classmethod
    def _validate_h5ad(cls, file_path: Path) -> Dict[str, Any]:
        """Validate H5AD file structure"""
        try:
            # For now, we'll do basic file existence and extension check
            # Real h5ad validation would require scanpy/anndata libraries
            
            if not file_path.exists():
                raise ValueError("H5AD file does not exist")
            
            # Check if file can be opened (basic check)
            with open(file_path, 'rb') as f:
                # Read first few bytes to check if it's a valid HDF5 file
                header = f.read(8)
                if not header.startswith(b'\x89HDF'):
                    raise ValueError("Invalid H5AD file format")
            
            return {
                "format": "h5ad", 
                "status": "valid",
                "note": "Basic format validation passed. Full validation requires data loading."
            }
            
        except Exception as e:
            raise ValueError(f"H5AD validation error: {str(e)}")


def validate_uploaded_file(file_path: Path, file_size: int) -> Dict[str, Any]:
    """
    Main function to validate uploaded files
    
    Args:
        file_path: Path to uploaded file
        file_size: Size of file in bytes
        
    Returns:
        Validation results dictionary
    """
    return FileValidator.validate_file(file_path, file_size)