import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Clock, AlertCircle, Eye } from 'lucide-react'
import { signalementAPI, statsAPI } from '../../services/api'
import { Button, Card, CardBody, CardHeader, Badge, StatCard, LoadingState, ErrorState } from '../../components/common'

const AgentDashboard = () => {
  const [signalements, setSignalements] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('pending')
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      fetchSignalements(),
      fetchStats(),
    ]).catch(() => {
      setError('Erreur lors du chargement des données')
    })
  }, [filter])

  const fetchSignalements = async () => {
    try {
      const response = await signalementAPI.list({ status: filter })
      setSignalements(response.data)
    } catch (err) {
      console.error('Error fetching signalements:', err)
      throw err
    }
  }

  const fetchStats = async () => {
    try {
      const response = await statsAPI.getDashboard()
      setStats(response.data)
    } catch (err) {
      console.error('Error fetching stats:', err)
      throw err
    }
  }

  const handleApprove = async (id) => {
    try {
      await signalementAPI.update(id, { status: 'approved' })
      fetchSignalements()
    } catch (err) {
      console.error('Error approving signalement:', err)
    }
  }

  const handleReject = async (id) => {
    try {
      await signalementAPI.update(id, { status: 'rejected' })
      fetchSignalements()
    } catch (err) {
      console.error('Error rejecting signalement:', err)
    }
  }

  if (loading) return <LoadingState message="Chargement du tableau de bord..." />
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-accent-900">Tableau de Bord Agent</h1>
        <p className="text-accent-600 mt-2">Validez et gérez les signalements de déchets</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Signalements à traiter"
            value={stats.pendingCount || 0}
            icon={Clock}
            color="warning"
          />
          <StatCard
            title="Validés ce mois"
            value={stats.approvedThisMonth || 0}
            icon={CheckCircle}
            color="success"
            change="+12% vs mois dernier"
          />
          <StatCard
            title="En cours de collecte"
            value={stats.inProgressCount || 0}
            icon={AlertCircle}
            color="info"
          />
        </div>
      )}

      {/* Signalements Section */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-lg text-accent-900">Signalements à Valider</h2>
        </CardHeader>
        <CardBody>
          {/* Filter */}
          <div className="mb-6 flex flex-wrap gap-2">
            {['pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-primary-500 text-white'
                    : 'bg-accent-100 text-accent-700 hover:bg-accent-200'
                }`}
              >
                {status === 'pending' && 'En attente'}
                {status === 'approved' && 'Approuvés'}
                {status === 'rejected' && 'Rejetés'}
              </button>
            ))}
          </div>

          {/* List */}
          {signalements.length === 0 ? (
            <p className="text-center text-accent-600 py-8">Aucun signalement trouvé</p>
          ) : (
            <div className="space-y-4">
              {signalements.map((signalement) => (
                <div
                  key={signalement.id}
                  className="border border-accent-200 rounded-lg p-4 hover:bg-accent-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-accent-900">{signalement.description}</h3>
                        <Badge variant="info">{signalement.category}</Badge>
                      </div>
                      <p className="text-sm text-accent-600 mb-3">
                        Signalé par {signalement.citizen?.name} le{' '}
                        {new Date(signalement.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {filter === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(signalement.id)}
                            className="text-green-600 border-green-200"
                          >
                            Valider
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleReject(signalement.id)}
                          >
                            Rejeter
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/agent/signalements/${signalement.id}`)}
                        className="gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Détails
                      </Button>
                    </div>
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

export default AgentDashboard
