import api from './axiosConfig'

export const camionAPI = {
  list: (filters) => api.get('/camions', { params: filters }),
  getById: (id) => api.get(`/camions/${id}`),
  updateLocation: (id, location) => api.patch(`/camions/${id}/location`, location),
  getRoute: (camionId) => api.get(`/camions/${camionId}/route`),
}

export default camionAPI
