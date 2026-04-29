import { useState, useEffect } from 'react'
import { signalementAPI } from '../services/api'

const useSignalements = (filters = {}) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = async () => {
    try {
      setLoading(true)
      const response = await signalementAPI.list(filters)
      setData(response.data)
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch()
  }, [JSON.stringify(filters)])

  return { data, loading, error, refetch: fetch }
}

export default useSignalements
