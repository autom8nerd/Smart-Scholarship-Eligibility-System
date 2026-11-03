import api from './api';

const statisticsService = {
  // Get statistics summary
  getStatisticsSummary: async () => {
    try {
      const response = await api.get('/statistiques/resume');
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics summary:', error);
      throw error;
    }
  },

  // Get visualizations
  getVisualizations: async (type) => {
    try {
      const response = await api.get(`/statistiques/visualisations/${type}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching visualizations:', error);
      throw error;
    }
  },

  // Get aggregated statistics
  getAggregatedStats: async () => {
    try {
      const response = await api.get('/statistiques/aggregees');
      return response.data;
    } catch (error) {
      console.error('Error fetching aggregated stats:', error);
      throw error;
    }
  },

  // Get students by year
  getStudentsByYear: async () => {
    try {
      const response = await api.get('/statistiques/etudiants-par-annee');
      return response.data;
    } catch (error) {
      console.error('Error fetching students by year:', error);
      throw error;
    }
  },

  // Generate financial capacity chart
  generateFinancialCapacityChart: async () => {
    try {
      const response = await api.post('/statistiques/generer-graphique-capacite');
      return response.data;
    } catch (error) {
      console.error('Error generating financial capacity chart:', error);
      throw error;
    }
  },

  // Generate scholarship distribution chart
  generateScholarshipChart: async () => {
    try {
      const response = await api.post('/statistiques/generer-graphique-bourses');
      return response.data;
    } catch (error) {
      console.error('Error generating scholarship chart:', error);
      throw error;
    }
  },

  // Generate enrollment probability chart
  generateEnrollmentChart: async () => {
    try {
      const response = await api.post('/statistiques/generer-graphique-inscriptions');
      return response.data;
    } catch (error) {
      console.error('Error generating enrollment chart:', error);
      throw error;
    }
  },

  // List available charts
  listAvailableCharts: async () => {
    try {
      const response = await api.get('/statistiques/telech/graphiques');
      return response.data;
    } catch (error) {
      console.error('Error listing charts:', error);
      throw error;
    }
  },
};

export default statisticsService;
