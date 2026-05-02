import api from './axiosConfig'

export const signalementAPI = {
  list: (params) => api.get('/signalements', { params }),
  getById: (id) => api.get(`/signalements/${id}`),
  create: (data) => api.post('/signalements', data),
  updateStatus: (id, statut) => api.put(`/signalements/${id}/statut`, { statut }),
  delete: (id) => api.delete(`/signalements/${id}`),
  getMesSignalements: () => api.get('/signalements/mes-signalements'),
  getStats: () => api.get('/signalements/stats'),
  getEvolution: (jours) => api.get(`/signalements/evolution?jours=${jours}`),
}

export default signalementAPI