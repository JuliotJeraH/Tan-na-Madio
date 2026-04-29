import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  verifyToken: () => api.get('/auth/verify'),
}

// Signalements API
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

// Camions API
export const camionAPI = {
  list: (filters) => api.get('/camions', { params: filters }),
  getById: (id) => api.get(`/camions/${id}`),
  updateLocation: (id, location) => api.patch(`/camions/${id}/location`, location),
  getRoute: (camionId) => api.get(`/camions/${camionId}/route`),
}

// Collectes API
export const collecteAPI = {
  list: (filters) => api.get('/collectes', { params: filters }),
  create: (data) => api.post('/collectes', data),
  getById: (id) => api.get(`/collectes/${id}`),
  update: (id, data) => api.patch(`/collectes/${id}`, data),
  complete: (id) => api.patch(`/collectes/${id}/complete`),
}

// Zones API
export const zoneAPI = {
  list: (filters) => api.get('/zones', { params: filters }),
  create: (data) => api.post('/zones', data),
  getById: (id) => api.get(`/zones/${id}`),
  update: (id, data) => api.patch(`/zones/${id}`, data),
  delete: (id) => api.delete(`/zones/${id}`),
}

// Stats API
export const statsAPI = {
  getDashboard: () => api.get('/stats/dashboard'),
  getSignalements: (period) => api.get(`/stats/signalements?period=${period}`),
  getCollectes: (period) => api.get(`/stats/collectes?period=${period}`),
  getEfficiency: () => api.get('/stats/efficiency'),
}

// Users API
export const userAPI = {
  list: (filters) => api.get('/users', { params: filters }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.patch(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getProfile: () => api.get('/users/profile/me'),
}

export default api
