# Model Registry Documentation Guide

This guide explains how to add new models to the HealthAI platform with proper documentation.

## Directory Structure

Each model should have its own directory in the `model_registry/` folder:

```
model_registry/
¢u¢w¢w scvi_model/
¢x   ¢u¢w¢w config.yaml
¢x   ¢u¢w¢w model.py
¢x   ¢|¢w¢w documentation.json
¢|¢w¢w your_new_model/
    ¢u¢w¢w config.yaml
    ¢u¢w¢w model.py
    ¢|¢w¢w documentation.json
```

## Adding a New Model

### 1. Create Model Directory
```bash
mkdir model_registry/your_new_model
```

### 2. Create Configuration File (`config.yaml`)
```yaml
name: "Your Model Name"
description: "Brief description of your model"
version: "1.0.0"
author: "Your Name"
requirements:
  - numpy>=1.21.0
  - pandas>=1.3.0
  - your-model-library>=2.0.0
```

### 3. Create Model Implementation (`model.py`)
```python
from core.model_interface import ModelInterface

class YourModel(ModelInterface):
    def __init__(self):
        super().__init__()
    
    def predict(self, data, parameters=None):
        # Your model implementation
        pass
    
    def get_model_info(self):
        return {
            "name": "Your Model Name",
            "version": "1.0.0",
            "description": "Brief description"
        }
```

### 4. Create Documentation File (`documentation.json`)

This is the most important file for the frontend display. It should contain:

```json
{
  "simple_explanation": "Clear explanation of what your model does and how it works",
  "when_to_use": [
    "Use case 1",
    "Use case 2",
    "Use case 3"
  ],
  "features": [
    "Key feature 1",
    "Key feature 2", 
    "Key feature 3"
  ],
  "technical_details": [
    "Technical detail 1",
    "Technical detail 2",
    "Technical detail 3"
  ],
  "citation": "Author, A. et al. (2023). Paper title. Journal Name, 1(1), 1-10.",
  "mathematical_formulation": "Mathematical description with LaTeX-style formatting:\n\n**Model equation:**\ny = f(x; £c)\n\n**Loss function:**\nL = -log p(y|x, £c)",
  "preprocessing_code": "# Preprocessing steps\nimport pandas as pd\nimport numpy as np\n\n# Load and clean data\ndata = pd.read_csv('your_data.csv')\n# Add preprocessing steps here",
  "code_example": "# Complete workflow example\nimport your_model_library as yml\n\n# Load data\ndata = yml.load_data('path/to/data')\n\n# Train model\nmodel = yml.YourModel()\nmodel.fit(data)\n\n# Make predictions\npredictions = model.predict(new_data)",
  "visualization_code": "# Visualization examples\nimport matplotlib.pyplot as plt\nimport seaborn as sns\n\n# Create plots\nplt.figure(figsize=(10, 6))\nplt.plot(results)\nplt.title('Model Results')\nplt.show()",
  "algorithm_description": "Detailed explanation of the algorithm and methodology",
  "figures": [
    {
      "url": "https://example.com/figure1.png",
      "caption": "Description of figure 1",
      "alt": "Alternative text for accessibility"
    },
    {
      "url": "https://example.com/figure2.png", 
      "caption": "Description of figure 2",
      "alt": "Alternative text for accessibility"
    }
  ]
}
```

## Documentation Fields Explained

| Field | Description | Required |
|-------|-------------|----------|
| `simple_explanation` | Clear, non-technical explanation | ? |
| `when_to_use` | Array of use cases | ? |
| `features` | Array of key features | ? |
| `technical_details` | Array of technical specifications | ? |
| `citation` | Academic citation | ? |
| `mathematical_formulation` | Math equations and formulas | ? |
| `preprocessing_code` | Data preprocessing examples | ? |
| `code_example` | Complete usage example | ? |
| `visualization_code` | Plotting and visualization code | ? |
| `algorithm_description` | Detailed algorithm explanation | ? |
| `figures` | Array of figure objects with URL, caption, alt | ? |

## Best Practices

### 1. Code Examples
- Use realistic, runnable code
- Include necessary imports
- Add comments explaining key steps
- Use placeholder data paths that users can replace

### 2. Figures
- Use high-quality images (PNG/SVG preferred)
- Host images on reliable CDN or include in assets
- Provide descriptive captions
- Include alt text for accessibility

### 3. Mathematical Formulations
- Use clear notation
- Explain variables and parameters
- Include key equations and derivations
- Format using markdown-style formatting

### 4. Writing Style
- Use clear, concise language
- Avoid jargon when possible
- Provide context for technical terms
- Structure information logically

## Testing Your Documentation

1. Add your model to the registry
2. Restart the backend server
3. Navigate to `/models` in the frontend
4. Click on your model to verify all sections display correctly
5. Test that code examples are syntactically correct
6. Verify figures load properly

## Figure Hosting Options

For production use, consider these options for hosting figures:

1. **Static Assets**: Place images in `backend/static/figures/model_name/`
2. **CDN**: Use services like Cloudinary, AWS S3, or similar
3. **GitHub**: Host in repository and use raw GitHub URLs
4. **Placeholder Services**: For development only (placeholder.com, etc.)

## Model Registry API

Once your model is added, it will be automatically available through:

- `GET /api/models` - Lists all models including yours
- `GET /api/models/{your_model_id}/documentation` - Returns your documentation
- `POST /api/predict/{your_model_id}` - Runs predictions with your model

## Troubleshooting

### Common Issues

1. **Documentation not loading**: Check JSON syntax in `documentation.json`
2. **Model not appearing**: Verify `config.yaml` format and model.py implementation
3. **Figures not displaying**: Check image URLs and accessibility
4. **Code formatting issues**: Ensure proper escaping of special characters in JSON

### Validation

You can validate your JSON documentation using online tools or:

```bash
python -m json.tool documentation.json
```

This will check for syntax errors and pretty-print the JSON.

