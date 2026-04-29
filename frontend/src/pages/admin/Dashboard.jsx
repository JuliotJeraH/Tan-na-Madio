import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Trash2, Truck, AlertCircle } from 'lucide-react'
import { statsAPI, userAPI } from '../../services/api'
import { Button, Card, CardBody, CardHeader, StatCard, LoadingState, ErrorState } from '../../components/common'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await statsAPI.getDashboard()
      setStats(response.data)
    } catch (err) {
      console.error('Error fetching stats:', err)
      setError('Erreur lors du chargement des statistiques')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingState message="Chargement du tableau de bord..." />
  if (error) return <ErrorState message={error} onRetry={fetchStats} />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-accent-900">Tableau de Bord Administrateur</h1>
        <p className="text-accent-600 mt-2">Vue d&apos;ensemble de la plateforme GreenCollect</p>
      </div>

      {/* Main Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Signalements totaux"
            value={stats.totalSignalements || 0}
            icon={AlertCircle}
            color="primary"
          />
          <StatCard
            title="Utilisateurs actifs"
            value={stats.activeUsers || 0}
            icon={Users}
            color="success"
          />
          <StatCard
            title="Collectes complétées"
            value={stats.completedCollectes || 0}
            icon={Trash2}
            color="info"
          />
          <StatCard
            title="Camions en service"
            value={stats.activeTrucks || 0}
            icon={Truck}
            color="warning"
          />
        </div>
      )}

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Users Management */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-lg text-accent-900 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Gestion des Utilisateurs
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-sm text-accent-600">
              Gérez les utilisateurs, définissez les rôles et contrôlez les accès.
            </p>
            <Button
              className="w-full"
              onClick={() => navigate('/admin/users')}
            >
              Gérer les utilisateurs
            </Button>
          </CardBody>
        </Card>

        {/* Zones Management */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-lg text-accent-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Gestion des Zones
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-sm text-accent-600">
              Créez et gérez les zones de collecte de votre territoire.
            </p>
            <Button
              className="w-full"
              onClick={() => navigate('/admin/zones')}
            >
              Gérer les zones
            </Button>
          </CardBody>
        </Card>

        {/* Camions Management */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-lg text-accent-900 flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Gestion des Camions
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-sm text-accent-600">
              Suivez la flotte de véhicules et leur état de fonctionnement.
            </p>
            <Button
              className="w-full"
              onClick={() => navigate('/admin/camions')}
            >
              Gérer les camions
            </Button>
          </CardBody>
        </Card>

        {/* Reports & Analytics */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-lg text-accent-900 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Rapports & Statistiques
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-sm text-accent-600">
              Consultez les rapports détaillés et les statistiques de performance.
            </p>
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => navigate('/admin/reports')}
            >
              Voir les rapports
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* System Status */}
      {stats && (
        <Card className="mt-8">
          <CardHeader>
            <h2 className="font-semibold text-lg text-accent-900">État du Système</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-between p-4 bg-accent-50 rounded-lg">
                <div>
                  <p className="text-sm text-accent-600">Signalements en attente</p>
                  <p className="text-2xl font-bold text-accent-900">{stats.pendingSignalements || 0}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="flex items-center justify-between p-4 bg-accent-50 rounded-lg">
                <div>
                  <p className="text-sm text-accent-600">Collectes en cours</p>
                  <p className="text-2xl font-bold text-accent-900">{stats.inProgressCollectes || 0}</p>
                </div>
                <Truck className="w-8 h-8 text-blue-500" />
              </div>
              <div className="flex items-center justify-between p-4 bg-accent-50 rounded-lg">
                <div>
                  <p className="text-sm text-accent-600">Efficacité moyenne</p>
                  <p className="text-2xl font-bold text-accent-900">{stats.averageEfficiency || '0'}%</p>
                </div>
                <Trash2 className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}

export default AdminDashboard
