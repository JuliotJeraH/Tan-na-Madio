import { useState, useEffect, useCallback } from 'react'
import { statsAPI } from '../api/stats'

export const useStats = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await statsAPI.getDashboard()
      setStats(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement')
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const getSignalementStats = async (period = 'month') => {
    try {
      const response = await statsAPI.getSignalements({ period })
      return response.data
    } catch (err) {
      setError(err.response?.data?.message)
      throw err
    }
  }

  const getCollecteStats = async (period = 'month') => {
    try {
      const response = await statsAPI.getCollectes({ period })
      return response.data
    } catch (err) {
      setError(err.response?.data?.message)
      throw err
    }
  }

  const getEfficiency = async () => {
    try {
      const response = await statsAPI.getEfficiency()
      return response.data
    } catch (err) {
      setError(err.response?.data?.message)
      throw err
    }
  }

  return { 
    stats, 
    loading, 
    error, 
    refetch: fetchStats,
    getSignalementStats,
    getCollecteStats,
    getEfficiency
  }
}

export default useStats