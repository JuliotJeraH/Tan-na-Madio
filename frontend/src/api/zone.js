import api from './axiosConfig'

export const zoneAPI = {
  list: (params) => api.get('/zones', { params }),
  getById: (id) => api.get(`/zones/${id}`),
  create: (data) => api.post('/zones', data),
  update: (id, data) => api.put(`/zones/${id}`, data),
  delete: (id) => api.delete(`/zones/${id}`),
}

export default zoneAPI