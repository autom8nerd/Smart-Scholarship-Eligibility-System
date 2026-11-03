import api from './api';

const predictionService = {
  // Predict financial capacity
  predictFinancialCapacity: async (data) => {
    try {
      const response = await api.post('/predictions/capacite-financiere', {
        donnees_academiques: {
          gpa: parseFloat(data.gpa),
          noteExamen: parseFloat(data.noteExamen),
        },
        donnees_financieres: {
          revenu: parseFloat(data.revenu),
          dependants: parseInt(data.dependants),
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Predict scholarship recommendation
  predictScholarship: async (data) => {
    try {
      const response = await api.post('/predictions/recommandation-bourse', {
        donnees_academiques: {
          gpa: parseFloat(data.gpa),
          noteExamen: parseFloat(data.noteExamen),
        },
        donnees_financieres: {
          revenu: parseFloat(data.revenu),
          dependants: parseInt(data.dependants),
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Predict enrollment probability
  predictEnrollment: async (data) => {
    try {
      const response = await api.post('/predictions/probabilite-inscription', {
        donnees_academiques: {
          gpa: parseFloat(data.gpa),
          noteExamen: parseFloat(data.noteExamen),
        },
        donnees_financieres: {
          revenu: parseFloat(data.revenu),
          dependants: parseInt(data.dependants),
        },
        donnees_contextuelles: {
          distance: parseFloat(data.distance),
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default predictionService;
