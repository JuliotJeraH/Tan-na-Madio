import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Plus, Eye } from 'lucide-react'
import { signalementAPI } from '../../services/api'
import { Button, Card, CardBody, Badge, LoadingState, ErrorState, EmptyState } from '../../components/common'

const CitoyenDashboard = () => {
  const [signalements, setSignalements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    fetchSignalements()
  }, [filter])

  const fetchSignalements = async () => {
    try {
      setLoading(true)
      const params = filter !== 'all' ? { status: filter } : {}
      const response = await signalementAPI.list(params)
      setSignalements(response.data)
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement des signalements')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      in_progress: 'info',
      completed: 'success',
      rejected: 'danger',
    }
    return colors[status] || 'default'
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      in_progress: 'En cours',
      completed: 'Complété',
      rejected: 'Rejeté',
    }
    return labels[status] || status
  }

  if (loading) return <LoadingState message="Chargement de vos signalements..." />
  if (error) return <ErrorState message={error} onRetry={fetchSignalements} />

  const filteredSignalements = signalements.filter((s) => {
    if (filter === 'all') return true
    return s.status === filter
  })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-accent-900">Mes Signalements</h1>
          <p className="text-accent-600 mt-2">Signalez les problèmes de propreté dans votre quartier</p>
        </div>
        <Button
          onClick={() => navigate('/citoyen/signaler')}
          className="gap-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Nouveau Signalement
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardBody className="text-center">
            <p className="text-2xl font-bold text-primary-500">{signalements.length}</p>
            <p className="text-sm text-accent-600">Total</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-2xl font-bold text-yellow-500">
              {signalements.filter((s) => s.status === 'pending').length}
            </p>
            <p className="text-sm text-accent-600">En attente</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-2xl font-bold text-blue-500">
              {signalements.filter((s) => s.status === 'in_progress').length}
            </p>
            <p className="text-sm text-accent-600">En cours</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-2xl font-bold text-green-500">
              {signalements.filter((s) => s.status === 'completed').length}
            </p>
            <p className="text-sm text-accent-600">Complétés</p>
          </CardBody>
        </Card>
      </div>

      {/* Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {['all', 'pending', 'in_progress', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? 'bg-primary-500 text-white'
                : 'bg-accent-100 text-accent-700 hover:bg-accent-200'
            }`}
          >
            {status === 'all' ? 'Tous' : getStatusLabel(status)}
          </button>
        ))}
      </div>

      {/* List */}
      {filteredSignalements.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="Aucun signalement"
          message="Commencez par signaler un problème de propreté"
        />
      ) : (
        <div className="space-y-4">
          {filteredSignalements.map((signalement) => (
            <Card key={signalement.id} hoverable>
              <CardBody className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-accent-900">{signalement.description}</h3>
                    <Badge variant={getStatusColor(signalement.status)}>
                      {getStatusLabel(signalement.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-accent-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    {signalement.address || 'Adresse non disponible'}
                  </div>
                  <p className="text-sm text-accent-500">
                    Signalé le {new Date(signalement.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/citoyen/signalements/${signalement.id}`)}
                  className="gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Détails
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default CitoyenDashboard
