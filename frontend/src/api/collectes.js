import api from './axiosConfig'

export const collecteAPI = {
  list: (params) => api.get('/collectes', { params }),
  getById: (id) => api.get(`/collectes/${id}`),
  planifier: (data) => api.post('/collectes/planifier', data),
  demarrer: (id) => api.put(`/collectes/${id}/demarrer`),
  terminer: (id, data) => api.put(`/collectes/${id}/terminer`, data),
  annuler: (id) => api.put(`/collectes/${id}/annuler`),
  getMesCollectes: () => api.get('/collectes/mes-collectes'),
}

export default collecteAPI