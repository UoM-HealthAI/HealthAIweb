from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import our Model Scanner
from services.model_registry import scan_models

# Create FastAPI app
app = FastAPI(
    title="HealthAI Web Platform",
    description="A platform for running AI models on health data",
    version="0.1.0"
)

# CORS settings (for frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# Week 2: Model-related endpoints
@app.get("/models")
async def get_models():
    """Get list of available AI models"""
    models = scan_models()
    return {
        "status": "success",
        "count": len(models),
        "models": models
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 