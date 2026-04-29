import { useState, useEffect } from 'react'
import { camionAPI } from '../api/camions'

export function useCamions(filters = {}) {
  const [camions, setCamions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCamions()
  }, [filters])

  const fetchCamions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await camionAPI.list(filters)
      setCamions(response.data)
    } catch (err) {
      setError(err.message)
      console.error('[v0] Error fetching camions:', err)
    } finally {
      setLoading(false)
    }
  }

  const getCamion = async (id) => {
    try {
      const response = await camionAPI.getById(id)
      return response.data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return { camions, loading, error, fetchCamions, getCamion }
}

export default useCamions
