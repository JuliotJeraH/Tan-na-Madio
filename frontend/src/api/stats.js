import api from './axiosConfig'

export const statsAPI = {
  getDashboard: () => api.get('/stats/dashboard'),
  getSignalementsParZone: () => api.get('/stats/signalements/par-zone'),
  getSignalementsEvolution: (jours) => api.get(`/stats/signalements/evolution?jours=${jours}`),
  getAgentsPerformance: () => api.get('/stats/agents/performance'),
  getCamionsOccupation: () => api.get('/stats/camions/occupation'),
  getTraitementMoyen: () => api.get('/stats/traitement-moyen'),
}

export default statsAPI