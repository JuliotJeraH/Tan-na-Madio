import { useState, useEffect, useCallback } from 'react'
import { camionAPI } from '../api/camions'

export const useCamions = (filters = {}) => {
  const [camions, setCamions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCamions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await camionAPI.list(filters)
      setCamions(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchCamions()
  }, [fetchCamions])

  return { camions, loading, error, refetch: fetchCamions }
}

export default useCamions