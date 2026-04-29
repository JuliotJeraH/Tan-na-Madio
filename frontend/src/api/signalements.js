import api from './axiosConfig'

export const signalementAPI = {
  list: (filters) => api.get('/signalements', { params: filters }),
  create: (data) => api.post('/signalements', data),
  getById: (id) => api.get(`/signalements/${id}`),
  update: (id, data) => api.patch(`/signalements/${id}`, data),
  delete: (id) => api.delete(`/signalements/${id}`),
  uploadPhoto: (id, file) => {
    const formData = new FormData()
    formData.append('photo', file)
    return api.post(`/signalements/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export default signalementAPI
