import { useState, useEffect, useCallback } from 'react'
import { collecteAPI } from '../api/collectes'

export const useCollectes = (filters = {}) => {
  const [collectes, setCollectes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCollectes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await collecteAPI.list(filters)
      setCollectes(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement')
      console.error('Error fetching collectes:', err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchCollectes()
  }, [fetchCollectes])

  const createCollecte = async (data) => {
    try {
      const response = await collecteAPI.create(data)
      await fetchCollectes()
      return response.data
    } catch (err) {
      setError(err.response?.data?.message)
      throw err
    }
  }

  const updateCollecte = async (id, data) => {
    try {
      const response = await collecteAPI.update(id, data)
      await fetchCollectes()
      return response.data
    } catch (err) {
      setError(err.response?.data?.message)
      throw err
    }
  }

  const completeCollecte = async (id) => {
    try {
      const response = await collecteAPI.complete(id)
      await fetchCollectes()
      return response.data
    } catch (err) {
      setError(err.response?.data?.message)
      throw err
    }
  }

  return { 
    collectes, 
    loading, 
    error, 
    refetch: fetchCollectes,
    createCollecte,
    updateCollecte,
    completeCollecte
  }
}

export default useCollectes