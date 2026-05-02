import { useState, useEffect, useCallback } from 'react'
import { signalementAPI } from '../api/signalements'

export const useSignalements = (filters = {}) => {
  const [signalements, setSignalements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSignalements = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await signalementAPI.list(filters)
      setSignalements(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement')
      console.error('Error fetching signalements:', err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchSignalements()
  }, [fetchSignalements])

  const createSignalement = async (data, photo = null) => {
    try {
      const response = await signalementAPI.create(data)
      if (photo && response.data.id) {
        await signalementAPI.uploadPhoto(response.data.id, photo)
      }
      await fetchSignalements()
      return response.data
    } catch (err) {
      setError(err.response?.data?.message)
      throw err
    }
  }

  const updateSignalement = async (id, data) => {
    try {
      const response = await signalementAPI.update(id, data)
      await fetchSignalements()
      return response.data
    } catch (err) {
      setError(err.response?.data?.message)
      throw err
    }
  }

  const validerSignalement = async (id) => {
    try {
      const response = await signalementAPI.valider(id)
      await fetchSignalements()
      return response.data
    } catch (err) {
      setError(err.response?.data?.message)
      throw err
    }
  }

  const rejeterSignalement = async (id) => {
    try {
      const response = await signalementAPI.rejeter(id)
      await fetchSignalements()
      return response.data
    } catch (err) {
      setError(err.response?.data?.message)
      throw err
    }
  }

  return { 
    signalements, 
    loading, 
    error, 
    refetch: fetchSignalements,
    createSignalement,
    updateSignalement,
    validerSignalement,
    rejeterSignalement
  }
}

export default useSignalements