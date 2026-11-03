import api from './api';

const modelService = {
  // Get all models
  getAllModels: async () => {
    try {
      const response = await api.get('/modeles/');
      return response.data;
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  },

  // Get model performance
  getModelPerformance: async (modelId) => {
    try {
      const response = await api.get(`/modeles/${modelId}/performance`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching performance for model ${modelId}:`, error);
      throw error;
    }
  },

  // Get model statistics
  getModelStatistics: async (modelId) => {
    try {
      const response = await api.get(`/modeles/${modelId}/statistiques`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching statistics for model ${modelId}:`, error);
      throw error;
    }
  },

  // Get feature importance
  getFeatureImportance: async (modelId) => {
    try {
      const response = await api.get(`/modeles/${modelId}/importance-features`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching feature importance for model ${modelId}:`, error);
      throw error;
    }
  },
};

export default modelService;
