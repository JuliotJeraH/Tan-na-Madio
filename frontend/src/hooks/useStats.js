import { useState, useEffect } from 'react'
import { statsAPI } from '../api/stats'

export function useStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await statsAPI.getDashboard()
      setStats(response.data)
    } catch (err) {
      setError(err.message)
      console.error('[v0] Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const getSignalementStats = async (period = 'month') => {
    try {
      const response = await statsAPI.getSignalements(period)
      return response.data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return { stats, loading, error, fetchStats, getSignalementStats }
}

export default useStats
