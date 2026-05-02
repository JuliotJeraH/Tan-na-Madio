import { useState, useEffect, useCallback } from 'react'
import { zoneAPI } from '../api/zone'

export const useZones = (filters = {}) => {
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchZones = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await zoneAPI.list(filters)
      setZones(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement')
      console.error('Error fetching zones:', err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchZones()
  }, [fetchZones])

  const createZone = async (data) => {
    try {
      const response = await zoneAPI.create(data)
      await fetchZones()
      return response.data
    } catch (err) {
      setError(err.response?.data?.message)
      throw err
    }
  }

  const updateZone = async (id, data) => {
    try {
      const response = await zoneAPI.update(id, data)
      await fetchZones()
      return response.data
    } catch (err) {
      setError(err.response?.data?.message)
      throw err
    }
  }

  const deleteZone = async (id) => {
    try {
      await zoneAPI.delete(id)
      await fetchZones()
    } catch (err) {
      setError(err.response?.data?.message)
      throw err
    }
  }

  return { 
    zones, 
    loading, 
    error, 
    refetch: fetchZones,
    createZone,
    updateZone,
    deleteZone
  }
}

export default useZones