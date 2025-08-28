# Contributing to HealthAI Web Platform

Welcome to the HealthAI Web Platform! This guide helps you contribute to the project, whether you're adding new AI models, fixing bugs, or improving documentation. This platform is designed to make AI model usage accessible to lab members without coding experience.

## Quick Start for Lab Members

### Prerequisites
- Docker Desktop (required)
- Git (required)
- Code editor (VS Code recommended)

### Development Environment Setup
```bash
# 1. Clone the repository
git clone <repository-url>
cd HealthAIweb

# 2. Start all services with Docker
docker-compose up --build

# 3. Access the platform
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:8000
# - Demo: http://localhost:7862
```

## Project Structure

```
HealthAIweb/
├── backend/                 # FastAPI backend server
│   ├── main.py             # API endpoints
│   ├── services/           # Business logic
│   │   ├── model_registry.py
│   │   ├── model_executor.py
│   │   └── file_handler.py
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend application
│   ├── src/pages/         # Web pages (Home, Models, Upload, Results, Help)
│   ├── public/            # Static files
│   └── package.json       # Node.js dependencies
├── model_registry/         # AI models repository
│   └── scvi_model/        # Example: scVI model
│       ├── config.yaml    # Model configuration and documentation
│       └── model.py       # Model execution code
├── docker-compose.yml      # Docker services configuration
└── demo.py                # Gradio demo (standalone)
```

## Adding New AI Models

The platform uses a dynamic model registry system that automatically discovers and loads models. Lab members can add new models without modifying the core codebase.

### Step 1: Create Model Directory
```bash
mkdir model_registry/your_model_name
cd model_registry/your_model_name
```

### Step 2: Create config.yaml
Create a `config.yaml` file following this structure:

```yaml
# Basic model information
name: "Your Model Name"
version: "1.0.0"
description: "Brief description of what your model does"

# Model parameters that users can configure
parameters:
  your_parameter:
    type: "int"
    default: 10
    min: 1
    max: 100
    description: "Description of what this parameter does"
  
  user_configurable:
    - "your_parameter"

# Model interface - defines how the backend executes your model
interface:
  entry_point: "model.py"
  main_function: "run_your_model"
  runtime: "python"
  dependencies:
    - "your-package>=1.0.0"
    - "numpy>=1.20.0"

# Documentation for user-friendly display in the web interface
documentation:
  simple_explanation: "Easy-to-understand explanation of what your model does"
  when_to_use:
    - "When you want to analyze X type of data"
    - "When you need to perform Y analysis"
  features:
    - "Feature 1: Performs this specific analysis"
    - "Feature 2: Generates these outputs"
  technical_details:
    - "Framework: TensorFlow/PyTorch/Scikit-learn"
    - "Method: Deep Learning/Machine Learning approach"
    - "Memory: X GB RAM required"
    - "Processing Time: X minutes for typical datasets"
  citation: "Author, et al. (Year). Paper title. Journal, Volume(Issue), pages."
```

### Step 3: Create model.py
```python
def run_your_model(file_path: str, output_dir: str, **parameters):
    """
    Main function that executes your model
    
    Args:
        file_path: Path to input data file (.h5ad or .csv)
        output_dir: Directory to save output files
        **parameters: User-configured parameters from the web interface
    
    Returns:
        dict: Results summary with status and file information
    """
    # Your model implementation here
    # Example structure:
    
    # 1. Load and validate input data
    # 2. Apply your model/algorithm
    # 3. Generate outputs (plots, processed data, etc.)
    # 4. Save results to output_dir
    # 5. Return summary information
    
    return {
        "status": "success",
        "message": "Analysis completed successfully",
        "output_files": ["plot1.png", "processed_data.csv"]
    }
```

### Step 4: Test Your Model
1. Restart Docker services: `docker-compose down && docker-compose up --build`
2. Navigate to http://localhost:3000/models
3. Verify your model appears in the list
4. Click "Show Docs" to check documentation display
5. Test the complete workflow through the Upload page

## Development Workflow

### Making Changes
```bash
# 1. Create a feature branch
git checkout -b feature/your-feature-name

# 2. Develop using Docker environment
docker-compose up --build

# 3. Test thoroughly
# - Frontend functionality: http://localhost:3000
# - Backend API: http://localhost:8000/docs
# - Model integration with test data

# 4. Commit changes with descriptive messages
git add .
git commit -m "feat: add your feature description"

# 5. Push and create pull request
git push origin feature/your-feature-name
```

### Git Commit Message Conventions
- `feat:` - New features or model additions
- `fix:` - Bug fixes
- `docs:` - Documentation updates
- `style:` - Code formatting or UI improvements
- `refactor:` - Code restructuring without functionality changes
- `test:` - Adding or updating tests

## Docker Development Environment

### Essential Commands
```bash
# Start all services
docker-compose up --build

# Start specific service
docker-compose up backend

# View service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop all services
docker-compose down

# Rebuild without cache
docker-compose build --no-cache

# Check running services status
docker-compose ps
```

### Hot Reload Configuration
The development environment includes hot reload for both frontend and backend:
- **Frontend**: React hot reload automatically updates on code changes
- **Backend**: FastAPI auto-reload restarts server on Python file changes
- **Model Registry**: Changes require service restart to reload model configurations

## Platform Architecture

### Frontend (React + TypeScript)
- **Home**: Landing page with platform overview
- **Models**: Dynamic model listing with documentation from config.yaml
- **Upload**: File upload and parameter configuration interface
- **Results**: Analysis results display and file downloads
- **Help**: User guide and troubleshooting

### Backend (FastAPI)
- **Model Registry Service**: Scans and loads model configurations
- **Model Executor**: Handles model execution and parameter validation
- **File Handler**: Manages uploads and downloads
- **API Endpoints**: RESTful API for frontend communication

### Model Integration
- **Dynamic Discovery**: Models automatically detected from model_registry/
- **Configuration-Driven**: All model information specified in config.yaml
- **Isolated Execution**: Each model runs in its own execution context
- **Standardized Interface**: Consistent API regardless of underlying model

## Troubleshooting

### Common Development Issues

**Docker services not starting**
- Ensure Docker Desktop is running and fully initialized
- Check `docker info` to verify Docker daemon connection
- Verify port availability (3000, 8000, 7862)

**Frontend not updating**
- Hot reload is enabled by default
- If changes don't appear, restart frontend: `docker-compose restart frontend`
- Check browser console for errors

**Backend API errors**
- View logs: `docker-compose logs backend`
- Verify model registry structure and config.yaml syntax
- Check Python dependencies in requirements.txt

**Model not appearing in interface**
- Validate config.yaml syntax using online YAML validator
- Ensure all required fields are present in configuration
- Restart services to reload model registry: `docker-compose restart backend`

**File upload or processing failures**
- Check file size limits (500MB maximum)
- Verify file format (.h5ad or .csv with correct structure)
- Review model-specific requirements in documentation

### Getting Help
1. Check existing issues in the repository
2. Review working examples in `model_registry/scvi_model/`
3. Consult the Help page in the web interface
4. Ask team members or create new issues for persistent problems

## Testing Guidelines

### Manual Testing Checklist
- [ ] Frontend loads without errors at http://localhost:3000
- [ ] All navigation pages work correctly
- [ ] Models appear correctly in /models page
- [ ] Model documentation displays from config.yaml
- [ ] File upload functions in /upload page
- [ ] Parameter configuration works as expected
- [ ] Results page shows analysis outputs
- [ ] Backend API accessible at http://localhost:8000/docs

### Test Data
Use the provided `macaque.h5ad` file for testing scVI model functionality and verifying the complete analysis pipeline.

## Lab-Specific Considerations

### Design Principles
- **Non-coder friendly**: Interface should be usable without programming knowledge
- **Self-documenting**: All models include comprehensive user documentation
- **Consistent workflow**: Standardized process across all models
- **Educational**: Clear explanations of what each model does and when to use it

### Model Addition Guidelines
- Include clear, non-technical explanations in documentation
- Provide realistic parameter ranges and defaults
- Specify input data requirements and formatting
- Document expected outputs and their interpretation
- Include relevant citations for academic use

### User Experience Focus
- Clear error messages and troubleshooting guidance
- Intuitive parameter selection with helpful descriptions
- Visual feedback during long-running analyses
- Comprehensive help documentation with real-world examples

---

## Future Development

The platform is designed to be extensible and maintainable:
- **Scalable Architecture**: Easy addition of new models and features
- **Modern Tech Stack**: React, FastAPI, Docker for reliability
- **Documentation-First**: All features thoroughly documented
- **Community-Friendly**: Clear contribution guidelines for lab members

For deployment guidelines and production considerations, consult with the platform maintainers.

**Happy developing!**