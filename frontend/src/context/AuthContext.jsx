import React, { createContext, useState, useEffect } from 'react'
import { authAPI } from '../api/auth'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (token && storedUser) {
      try {
        const response = await authAPI.getProfile()
        setUser(response.data)
      } catch (error) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
      }
    }
    setIsLoading(false)
  }

  const login = async (email, password) => {
    const response = await authAPI.login(email, password)
    // Le backend retourne: { token, user: { id, nom, prenom, email, role } }
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    setUser(response.data.user)
    return response.data
  }

  const register = async (userData) => {
    const response = await authAPI.register(userData)
    // Le backend retourne: { message, user }
    if (response.data.user) {
      // Après inscription, on peut connecter automatiquement
      return await login(userData.email, userData.password)
    }
    return response.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}