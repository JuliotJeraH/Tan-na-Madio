import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navigation, MapPin, Clock, CheckCircle } from 'lucide-react'
import { collecteAPI, camionAPI } from '../../services/api'
import { Button, Card, CardBody, CardHeader, Badge, StatCard, LoadingState, ErrorState } from '../../components/common'

const ChauffeurDashboard = () => {
  const [collectes, setCollectes] = useState([])
  const [camion, setCamion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('pending')
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      fetchCollectes(),
      fetchCamion(),
    ]).catch(() => {
      setError('Erreur lors du chargement des tournées')
    })
  }, [filter])

  const fetchCollectes = async () => {
    try {
      const response = await collecteAPI.list({ status: filter })
      setCollectes(response.data)
    } catch (err) {
      console.error('Error fetching collectes:', err)
      throw err
    }
  }

  const fetchCamion = async () => {
    try {
      const response = await camionAPI.list()
      if (response.data.length > 0) {
        setCamion(response.data[0])
      }
    } catch (err) {
      console.error('Error fetching camion:', err)
    }
  }

  const handleCompleteCollecte = async (id) => {
    try {
      await collecteAPI.complete(id)
      fetchCollectes()
    } catch (err) {
      console.error('Error completing collecte:', err)
    }
  }

  const handleStartRoute = async () => {
    if (camion) {
      try {
        const response = await camionAPI.getRoute(camion.id)
        navigate(`/chauffeur/route/${camion.id}`, { state: { route: response.data } })
      } catch (err) {
        console.error('Error getting route:', err)
      }
    }
  }

  if (loading) return <LoadingState message="Chargement de vos tournées..." />
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-accent-900">Mes Tournées</h1>
          <p className="text-accent-600 mt-2">Gérez vos collectes de déchets</p>
        </div>
        {camion && (
          <Button onClick={handleStartRoute} className="gap-2">
            <Navigation className="w-4 h-4" />
            Démarrer la tournée
          </Button>
        )}
      </div>

      {/* Camion Info */}
      {camion && (
        <Card className="mb-8">
          <CardBody className="flex items-center justify-between">
            <div>
              <p className="text-sm text-accent-600">Véhicule assigné</p>
              <p className="text-lg font-semibold text-accent-900">
                {camion.licensePlate}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-accent-600">Capacité restante</p>
              <p className="text-lg font-semibold text-accent-900">
                {camion.currentCapacity || '0'} / {camion.maxCapacity || '0'} kg
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Collectes à faire"
          value={collectes.filter((c) => c.status === 'pending').length}
          icon={Clock}
          color="warning"
        />
        <StatCard
          title="En cours"
          value={collectes.filter((c) => c.status === 'in_progress').length}
          icon={Navigation}
          color="info"
        />
        <StatCard
          title="Complétées"
          value={collectes.filter((c) => c.status === 'completed').length}
          icon={CheckCircle}
          color="success"
        />
      </div>

      {/* Collectes Section */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-lg text-accent-900">Collectes</h2>
        </CardHeader>
        <CardBody>
          {/* Filter */}
          <div className="mb-6 flex flex-wrap gap-2">
            {['pending', 'in_progress', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-primary-500 text-white'
                    : 'bg-accent-100 text-accent-700 hover:bg-accent-200'
                }`}
              >
                {status === 'pending' && 'À faire'}
                {status === 'in_progress' && 'En cours'}
                {status === 'completed' && 'Complétées'}
              </button>
            ))}
          </div>

          {/* List */}
          {collectes.length === 0 ? (
            <p className="text-center text-accent-600 py-8">Aucune collecte trouvée</p>
          ) : (
            <div className="space-y-4">
              {collectes.map((collecte) => (
                <div
                  key={collecte.id}
                  className="border border-accent-200 rounded-lg p-4 hover:bg-accent-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-accent-900">
                          Collecte #{collecte.id}
                        </h3>
                        <Badge
                          variant={
                            collecte.status === 'pending'
                              ? 'warning'
                              : collecte.status === 'in_progress'
                                ? 'info'
                                : 'success'
                          }
                        >
                          {collecte.status === 'pending' && 'À faire'}
                          {collecte.status === 'in_progress' && 'En cours'}
                          {collecte.status === 'completed' && 'Complétée'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-accent-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        {collecte.zone?.name || 'Zone inconnue'}
                      </div>
                      <p className="text-sm text-accent-500">
                        {collecte.signalements?.length || 0} signalements à traiter
                      </p>
                    </div>
                    {filter === 'pending' && (
                      <Button
                        onClick={() => handleCompleteCollecte(collecte.id)}
                        className="gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Marquer complète
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

export default ChauffeurDashboard
