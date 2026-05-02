import api from './axiosConfig'

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  getAllUsers: () => api.get('/auth/users'),
  updateUser: (id, data) => api.put(`/auth/users/${id}`, data),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
}

// Ajouter cet export pour userAPI
export const userAPI = {
  list: () => authAPI.getAllUsers(),
  getById: (id) => api.get(`/auth/users/${id}`),
  create: (data) => authAPI.register(data),
  update: (id, data) => authAPI.updateUser(id, data),
  delete: (id) => authAPI.deleteUser(id),
  getProfile: () => authAPI.getProfile(),
}

export default authAPI