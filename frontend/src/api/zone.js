import api from './axiosConfig'

export const zoneAPI = {
  list: (filters) => api.get('/zones', { params: filters }),
  create: (data) => api.post('/zones', data),
  getById: (id) => api.get(`/zones/${id}`),
  update: (id, data) => api.patch(`/zones/${id}`, data),
  delete: (id) => api.delete(`/zones/${id}`),
}

export default zoneAPI
