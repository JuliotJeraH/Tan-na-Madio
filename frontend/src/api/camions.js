import api from './axiosConfig'

export const camionAPI = {
  list: (params) => api.get('/camions', { params }),
  getById: (id) => api.get(`/camions/${id}`),
  create: (data) => api.post('/camions', data),
  update: (id, data) => api.put(`/camions/${id}`, data),
  delete: (id) => api.delete(`/camions/${id}`),
  updateLocation: (id, location) => api.put(`/camions/${id}/location`, location),
  getDisponibles: () => api.get('/camions/disponibles'),
}

export default camionAPI