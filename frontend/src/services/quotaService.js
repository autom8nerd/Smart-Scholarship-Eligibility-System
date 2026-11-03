import api from './api';

const quotaService = {
  // Get all yearly scholarship quotas
  getAllQuotas: async () => {
    try {
      const response = await api.get('/quotas/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get quota for specific year
  getQuotaByYear: async (year) => {
    try {
      const response = await api.get(`/quotas/${year}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create or update quota for a year
  setQuota: async (year, nombreBourses) => {
    try {
      const response = await api.post(`/quotas/${year}`, null, {
        params: { nombre_bourses: nombreBourses }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete quota for a year
  deleteQuota: async (year) => {
    try {
      const response = await api.delete(`/quotas/${year}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default quotaService;
