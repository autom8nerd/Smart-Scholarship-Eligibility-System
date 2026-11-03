import api from './api';

const mlRankingService = {
  // Get information about all ML models
  getModelsInfo: async () => {
    try {
      const response = await api.get('/ml-ranking/models-info');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get ranked students for a given year using all models
  rankStudentsByYear: async (year) => {
    try {
      const response = await api.get(`/ml-ranking/rank-students/${year}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a summary of rankings
  getRankingSummary: async (year) => {
    try {
      const response = await api.get(`/ml-ranking/rank-summary/${year}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default mlRankingService;
