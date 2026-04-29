import { useState, useEffect } from 'react'
import { zoneAPI } from '../api/zone'

export function useZones(filters = {}) {
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchZones()
  }, [filters])

  const fetchZones = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await zoneAPI.list(filters)
      setZones(response.data)
    } catch (err) {
      setError(err.message)
      console.error('[v0] Error fetching zones:', err)
    } finally {
      setLoading(false)
    }
  }

  const getZone = async (id) => {
    try {
      const response = await zoneAPI.getById(id)
      return response.data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return { zones, loading, error, fetchZones, getZone }
}

export default useZones
