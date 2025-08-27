// API configuration for different environments
// This file manages the backend API URL for both development and production

// Get API URL from environment variable, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// API endpoints configuration
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    HEALTH: '/health',
    MODELS: '/models',
    MODEL_DOCUMENTATION: (modelId: string) => `/models/${modelId}/documentation`,
    PREDICT: (modelId: string) => `/predict/${modelId}`,
    TASKS: (taskId: string) => `/tasks/${taskId}`,
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function for API calls with error handling
export const apiCall = async (endpoint: string, options?: RequestInit) => {
  const url = buildApiUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

export default API_CONFIG;
