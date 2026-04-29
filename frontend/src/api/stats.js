import api from './axiosConfig'

export const statsAPI = {
  getDashboard: () => api.get('/stats/dashboard'),
  getSignalements: (period) => api.get(`/stats/signalements?period=${period}`),
  getCollectes: (period) => api.get(`/stats/collectes?period=${period}`),
  getEfficiency: () => api.get('/stats/efficiency'),
}

export default statsAPI
