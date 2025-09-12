/**
 * Model Configuration System
 * Centralized configuration for all models to make adding new models easier
 */

export interface ModelParameter {
  name: string;
  label: string;
  type: 'number' | 'string' | 'boolean' | 'select';
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  description: string;
  helpText: string;
}

export interface ModelVisualization {
  key: string;
  title: string;
  description: string;
  fileExtension: string;
}

export interface ModelDataFile {
  key: string;
  title: string;
  description: string;
  fileExtension: string;
  helpText: string;
}

export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  category: 'single_cell' | 'image_analysis' | 'text_analysis' | 'other';
  supportedFileTypes: string[];
  parameters: ModelParameter[];
  visualizations: ModelVisualization[];
  dataFiles: ModelDataFile[];
  uploadHelpText: string;
  processingTimeEstimate: string;
  tipText: string;
}

// Model Configurations
export const MODEL_CONFIGS: Record<string, ModelConfig> = {
  scvi_model: {
    id: 'scvi_model',
    name: 'scVI Model',
    description: 'Dimensionality reduction & batch correction',
    category: 'single_cell',
    supportedFileTypes: ['.csv', '.h5ad'],
    parameters: [
      {
        name: 'n_latent',
        label: 'Latent Dimensions',
        type: 'number',
        defaultValue: 10,
        min: 5,
        max: 50,
        description: 'Lower-dimensional representation size (5-50)',
        helpText: 'Default: 10. Higher values (15-50) for complex data, lower (5-8) for simple data or quick testing.'
      },
      {
        name: 'n_epochs',
        label: 'Training Epochs',
        type: 'number',
        defaultValue: 400,
        min: 100,
        max: 1000,
        description: 'Number of training iterations (100-1000)',
        helpText: 'Default: 400. Use 100-200 for quick testing, 300-500 for standard analysis, 500-1000 for high quality.'
      }
    ],
    visualizations: [
      {
        key: 'umap_plot',
        title: 'UMAP Visualization',
        description: '2D representation of your single-cell data',
        fileExtension: '.png'
      },
      {
        key: 'loss_curve',
        title: 'Training Progress',
        description: 'Model training convergence over epochs',
        fileExtension: '.png'
      }
    ],
    dataFiles: [
      {
        key: 'latent_representation',
        title: 'Latent Representation',
        description: 'CSV file containing the low-dimensional embeddings of your cells',
        fileExtension: '.csv',
        helpText: 'Use this file for downstream analysis or visualization in other tools'
      },
      {
        key: 'processed_data',
        title: 'Processed Dataset',
        description: 'Complete H5AD file with batch-corrected data and metadata',
        fileExtension: '.h5ad',
        helpText: 'Compatible with scanpy and other single-cell analysis tools'
      }
    ],
    uploadHelpText: '.h5ad files are recommended as they preserve metadata and are faster to process',
    processingTimeEstimate: '2-10 minutes depending on data size',
    tipText: '.h5ad files are recommended as they preserve metadata and are faster to process'
  },

  image_classifier: {
    id: 'image_classifier',
    name: 'Image Classifier',
    description: 'Object recognition & image analysis',
    category: 'image_analysis',
    supportedFileTypes: ['.jpg', '.jpeg', '.png'],
    parameters: [
      {
        name: 'confidence_threshold',
        label: 'Confidence Threshold',
        type: 'number',
        defaultValue: 0.5,
        min: 0.1,
        max: 1.0,
        step: 0.1,
        description: 'Minimum confidence for predictions (0.1-1.0)',
        helpText: 'Default: 0.5. Higher values (0.7-0.9) for more confident predictions, lower (0.1-0.4) for more results.'
      },
      {
        name: 'top_k',
        label: 'Top K Predictions',
        type: 'number',
        defaultValue: 5,
        min: 1,
        max: 10,
        description: 'Number of top predictions to return (1-10)',
        helpText: 'Default: 5. Use 1-3 for simple classification, 5-10 for detailed analysis.'
      }
    ],
    visualizations: [
      {
        key: 'prediction_chart',
        title: 'Classification Results',
        description: 'Top predictions with confidence scores',
        fileExtension: '.png'
      },
      {
        key: 'processed_image',
        title: 'Processed Image',
        description: 'Original image with top prediction',
        fileExtension: '.png'
      }
    ],
    dataFiles: [
      {
        key: 'predictions',
        title: 'Prediction Results',
        description: 'CSV file containing all predictions with confidence scores',
        fileExtension: '.csv',
        helpText: 'Includes class names, probabilities, and ranking information'
      },
      {
        key: 'confidence_scores',
        title: 'Confidence Scores',
        description: 'JSON file with detailed confidence scores and metadata',
        fileExtension: '.json',
        helpText: 'Machine-readable format for further analysis'
      }
    ],
    uploadHelpText: 'High resolution images (1024x1024 or higher) provide better classification accuracy',
    processingTimeEstimate: '1-5 seconds per image',
    tipText: 'High resolution images (1024x1024 or higher) provide better classification accuracy'
  }
};

// Helper functions
export const getModelConfig = (modelId: string): ModelConfig | undefined => {
  return MODEL_CONFIGS[modelId];
};

export const getAllModelConfigs = (): ModelConfig[] => {
  return Object.values(MODEL_CONFIGS);
};

export const getModelsByCategory = (category: string): ModelConfig[] => {
  return Object.values(MODEL_CONFIGS).filter(config => config.category === category);
};
