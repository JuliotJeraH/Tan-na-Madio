import api from './axiosConfig'

export const collecteAPI = {
  list: (filters) => api.get('/collectes', { params: filters }),
  create: (data) => api.post('/collectes', data),
  getById: (id) => api.get(`/collectes/${id}`),
  update: (id, data) => api.patch(`/collectes/${id}`, data),
  complete: (id) => api.patch(`/collectes/${id}/complete`),
}

export default collecteAPI
