import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, User, Image } from 'lucide-react'
import { signalementAPI } from '../../services/api'
import { Button, Card, CardBody, CardHeader, Badge, LoadingState, ErrorState } from '../../components/common'

const SignalDetail = () => {
  const { id } = useParams()
  const [signalement, setSignalement] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchSignalement()
  }, [id])

  const fetchSignalement = async () => {
    try {
      setLoading(true)
      const response = await signalementAPI.getById(id)
      setSignalement(response.data)
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement du signalement')
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

  if (loading) return <LoadingState message="Chargement du signalement..." />
  if (error) return <ErrorState message={error} onRetry={fetchSignalement} />
  if (!signalement) return <ErrorState message="Signalement non trouvé" />

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <Card>
            <CardBody>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl font-bold text-accent-900 flex-1">
                  {signalement.description}
                </h1>
                <Badge variant={getStatusColor(signalement.status)}>
                  {getStatusLabel(signalement.status)}
                </Badge>
              </div>
              <p className="text-accent-600">
                Catégorie: <span className="font-semibold text-accent-900">{signalement.category}</span>
              </p>
            </CardBody>
          </Card>

          {/* Photo */}
          {signalement.photoUrl && (
            <Card>
              <CardBody>
                <div className="flex items-center gap-2 mb-4">
                  <Image className="w-5 h-5 text-accent-600" />
                  <h3 className="font-semibold text-accent-900">Photo du problème</h3>
                </div>
                <img
                  src={signalement.photoUrl}
                  alt="Problème signalé"
                  className="w-full rounded-lg object-cover max-h-96"
                />
              </CardBody>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-accent-900">Historique</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                  <div className="w-0.5 h-12 bg-accent-200"></div>
                </div>
                <div>
                  <p className="font-semibold text-accent-900">Signalement créé</p>
                  <p className="text-sm text-accent-600">
                    {new Date(signalement.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              {signalement.status !== 'pending' && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-accent-900">Validé par agent</p>
                    <p className="text-sm text-accent-600">
                      {signalement.updatedAt ? new Date(signalement.updatedAt).toLocaleDateString('fr-FR') : '-'}
                    </p>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Location */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-accent-900 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Localisation
              </h3>
            </CardHeader>
            <CardBody className="space-y-3">
              <div>
                <p className="text-sm text-accent-600 mb-1">Latitude</p>
                <p className="font-mono text-sm text-accent-900">{signalement.latitude}</p>
              </div>
              <div>
                <p className="text-sm text-accent-600 mb-1">Longitude</p>
                <p className="font-mono text-sm text-accent-900">{signalement.longitude}</p>
              </div>
              {signalement.address && (
                <div>
                  <p className="text-sm text-accent-600 mb-1">Adresse</p>
                  <p className="text-sm text-accent-900">{signalement.address}</p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Reporter Info */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-accent-900 flex items-center gap-2">
                <User className="w-5 h-5" />
                Signalé par
              </h3>
            </CardHeader>
            <CardBody>
              <p className="font-semibold text-accent-900">{signalement.citizen?.name || 'Anonyme'}</p>
              <p className="text-sm text-accent-600">{signalement.citizen?.email}</p>
            </CardBody>
          </Card>

          {/* Timeline Info */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-accent-900 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Dates
              </h3>
            </CardHeader>
            <CardBody className="space-y-3 text-sm">
              <div>
                <p className="text-accent-600">Créé le</p>
                <p className="font-semibold text-accent-900">
                  {new Date(signalement.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <p className="text-accent-600">Mis à jour le</p>
                <p className="font-semibold text-accent-900">
                  {new Date(signalement.updatedAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SignalDetail
