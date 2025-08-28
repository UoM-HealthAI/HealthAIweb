from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uuid
import os
import json
from pathlib import Path

# Import our services
from services.model_registry import scan_models
from services.file_handler import validate_uploaded_file
from services.model_executor import get_model_executor
from core.model_interface import validate_model_result, create_error_result

# Create FastAPI app
app = FastAPI(
    title="HealthAI Web Platform",
    description="A platform for running AI models on health data",
    version="0.1.0"
)

# Initialize required directories
def init_directories():
    """Create necessary directories for file storage"""
    directories = ["uploads", "outputs"]
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        print(f"Directory ready: {directory}/")

# Initialize on startup
init_directories()

# Mount static files for serving output files
app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

# Mount React frontend (for production deployment)
frontend_build_path = Path("../frontend/build")
if frontend_build_path.exists():
    app.mount("/static", StaticFiles(directory="../frontend/build/static"), name="static")
    

else:
    print("Frontend build directory not found. Running in development mode.")

# CORS settings (for frontend connection)
# Get allowed origins from environment variable for deployment
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def _make_paths_relative(file_paths: dict, base_dir: str = "outputs") -> dict:
    """Convert absolute file paths to relative paths for API responses"""
    if not isinstance(file_paths, dict):
        return file_paths
    
    relative_paths = {}
    for key, value in file_paths.items():
        if isinstance(value, dict):
            relative_paths[key] = _make_paths_relative(value, base_dir)
        elif isinstance(value, str) and os.path.isabs(value):
            # Convert absolute path to relative path from base_dir
            try:
                relative_paths[key] = os.path.relpath(value, base_dir)
            except ValueError:
                # If relative path conversion fails, keep original
                relative_paths[key] = value
        else:
            relative_paths[key] = value
    
    return relative_paths


@app.get("/")
async def root():
    """Basic health check endpoint"""
    return {
        "message": "HealthAI Web Platform API", 
        "status": "running",
        "version": "0.1.0"
    }

@app.get("/health")
async def health_check():
    """Health check for monitoring"""
    return {"status": "healthy"}

@app.get("/api/health")
async def api_health_check():
    """API health check"""
    return {"status": "healthy"}

# Week 2: Model-related endpoints
@app.get("/api/models")
async def get_models():
    """Get list of available AI models"""
    models = scan_models()
    return {
        "status": "success",
        "count": len(models),
        "models": models
    }

@app.get("/api/models/{model_id}/documentation")
async def get_model_documentation(model_id: str):
    """Get documentation for a specific model"""
    try:
        model_executor = get_model_executor()
        if model_id not in model_executor.available_models:
            raise HTTPException(status_code=404, detail=f"Model '{model_id}' not found")
        
        model_info = model_executor.available_models[model_id]
        config = model_info["config"]
        documentation = config.get("documentation", {})
        
        if not documentation:
            raise HTTPException(status_code=404, detail=f"No documentation found for model '{model_id}'")
        
        return {
            "status": "success",
            "model_id": model_id,
            "documentation": documentation
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving documentation: {str(e)}")

# Week 3: File upload and prediction endpoints
@app.post("/api/predict/{model_id}")
async def predict_with_model(
    model_id: str,
    file: UploadFile = File(...),
    parameters: str = Form("{}")
):
    """
    Upload a file and run prediction with specified model
    
    Args:
        model_id: ID of the model to use (e.g., 'scvi_model')
        file: Uploaded data file (.csv or .h5ad)
        parameters: JSON string with model parameters
    
    Returns:
        JSON response with task_id and upload status
    """
    # Generate unique task ID
    task_id = str(uuid.uuid4())
    
    try:
        # Parse parameters
        params = json.loads(parameters) if parameters else {}
        if not isinstance(params, dict):
            raise ValueError("Parameters must be a JSON object")
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid parameters JSON: {str(e)}")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # Create directories for this task
    uploads_dir = Path("uploads") / task_id
    uploads_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        # Save uploaded file
        file_path = uploads_dir / file.filename
        
        # Validate filename
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        # Check for potentially dangerous filenames
        if '..' in file.filename or '/' in file.filename or '\\' in file.filename:
            raise HTTPException(status_code=400, detail="Invalid filename")
        
        # Read and save file content
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")
            
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Validate uploaded file
        validation_result = validate_uploaded_file(file_path, len(content))
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except OSError as e:
        raise HTTPException(status_code=500, detail=f"File system error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error during file upload: {str(e)}")
    
    # Create output directory for this task
    output_dir = Path("outputs") / task_id
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Execute the model
    model_executor = get_model_executor()
    try:
        execution_result = model_executor.execute_model(
            model_id=model_id,
            input_path=str(file_path),
            output_dir=str(output_dir),
            parameters=params
        )
        
        # Additional result validation at API level
        validate_model_result(execution_result)
        
    except Exception as e:
        # If model execution fails, create standardized error result
        execution_result = create_error_result(
            error_message=f"Model execution failed: {str(e)}",
            error_type="execution_error"
        )
    
    # Determine overall status
    overall_status = "completed" if execution_result["status"] == "success" else "failed"
    
    # Save task metadata
    metadata = {
        "task_id": task_id,
        "model_id": model_id,
        "filename": file.filename,
        "file_size": len(content),
        "parameters": params,
        "status": overall_status,
        "validation": validation_result,
        "execution_result": execution_result
    }
    
    metadata_path = uploads_dir / "metadata.json"
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)
    
    # Prepare standardized API response
    response = {
        "task_id": task_id,
        "status": overall_status,
        "message": f"File '{file.filename}' processed successfully" if overall_status == "completed" else f"Processing failed: {execution_result.get('metadata', {}).get('error_message', 'Unknown error')}",
        "request_info": {
            "model_id": model_id,
            "filename": file.filename,
            "file_size": len(content),
            "parameters": params
        },
        "validation": validation_result
    }
    
    # Add execution results if successful
    if overall_status == "completed":
        # Convert absolute paths to relative paths for API response
        relative_visualizations = _make_paths_relative(execution_result.get("visualizations", {}))
        relative_data_files = _make_paths_relative(execution_result.get("data_files", {}))
        
        response.update({
            "results": {
                "visualizations": relative_visualizations,
                "data_files": relative_data_files,
                "metadata": execution_result.get("metadata", {})
            }
        })
    else:
        # For failed executions, include error details
        response.update({
            "error_details": execution_result.get("metadata", {})
        })
    
    return response

@app.get("/api/tasks/{task_id}")
async def get_task_result(task_id: str):
    """
    Get the result of a specific task
    
    Args:
        task_id: UUID of the task to check
        
    Returns:
        Task metadata and results
    """
    
    # Check if task exists
    task_dir = Path("uploads") / task_id
    metadata_path = task_dir / "metadata.json"
    
    if not metadata_path.exists():
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    
    # Load task metadata
    try:
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
        
        return {
            "task_id": task_id,
            "found": True,
            "metadata": metadata
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading task metadata: {str(e)}")

@app.get("/api/tasks")
async def list_all_tasks():
    """Get list of all tasks (recent first)"""
    
    uploads_dir = Path("uploads")
    if not uploads_dir.exists():
        return {"tasks": []}
    
    tasks = []
    
    for task_dir in uploads_dir.iterdir():
        if task_dir.is_dir():
            metadata_path = task_dir / "metadata.json"
            if metadata_path.exists():
                try:
                    with open(metadata_path, 'r') as f:
                        metadata = json.load(f)
                    
                    # Add basic task info
                    tasks.append({
                        "task_id": task_dir.name,
                        "model_id": metadata.get("model_id"),
                        "filename": metadata.get("filename"),
                        "status": metadata.get("status"),
                        "file_size": metadata.get("file_size")
                    })
                    
                except Exception:
                    # Skip tasks with corrupted metadata
                    continue
    
    # Sort by task_id (which is UUID, roughly chronological)
    tasks.sort(key=lambda x: x["task_id"], reverse=True)
    
    return {
        "total_tasks": len(tasks),
        "tasks": tasks
    }

# Serve React app for frontend routes (must be last!)
frontend_build_path = Path("../frontend/build")
if frontend_build_path.exists():
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        """Serve React app for frontend routes - this catches all unmatched routes"""
        # At this point, all API routes have been checked and didn't match
        # So this must be a frontend route - serve index.html
        return FileResponse("../frontend/build/index.html")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 