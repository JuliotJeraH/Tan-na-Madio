import React, { useState, useEffect } from 'react'
import { Users, Truck, AlertCircle, CheckCircle, TrendingUp, MapPin } from 'lucide-react'
import { statsAPI } from '../../api/stats'
import { signalementAPI } from '../../api/signalements'
import { collecteAPI } from '../../api/collectes'
import StatCard from '../../components/common/StatCard'
import Spinner from '../../components/common/Spinner'
import Badge from '../../components/common/Badge'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentSignalements, setRecentSignalements] = useState([])
  const [recentCollectes, setRecentCollectes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, signalementsRes, collectesRes] = await Promise.all([
        statsAPI.getDashboard(),
        signalementAPI.list({ limit: 5 }),
        collecteAPI.list({ limit: 5 })
      ])
      setStats(statsRes.data)
      setRecentSignalements(signalementsRes.data)
      setRecentCollectes(collectesRes.data)
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-accent-900">Tableau de Bord Administrateur</h1>
        <p className="text-accent-500 mt-1">Vue d'ensemble de la plateforme Tanàna Madio</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Signalements"
          value={stats?.totalSignalements || 0}
          icon={AlertCircle}
          color="primary"
          change="+12% ce mois"
        />
        <StatCard
          title="Utilisateurs"
          value={stats?.totalUtilisateurs || 0}
          icon={Users}
          color="success"
        />
        <StatCard
          title="Collectes"
          value={stats?.totalCollectes || 0}
          icon={Truck}
          color="warning"
        />
        <StatCard
          title="Taux de réussite"
          value={`${stats?.tauxReussite || 0}%`}
          icon={CheckCircle}
          color="info"
          change="+5%"
        />
      </div>

      {/* Graphiques rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signalements par statut */}
        <div className="bg-white rounded-xl border border-accent-200 p-6">
          <h3 className="font-semibold text-accent-900 mb-4">Signalements par statut</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-accent-600">En attente</span>
                <span className="font-semibold">{stats?.signalementsEnAttente || 0}</span>
              </div>
              <div className="w-full bg-accent-100 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${((stats?.signalementsEnAttente || 0) / (stats?.totalSignalements || 1)) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-accent-600">En cours</span>
                <span className="font-semibold">{stats?.signalementsEnCours || 0}</span>
              </div>
              <div className="w-full bg-accent-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${((stats?.signalementsEnCours || 0) / (stats?.totalSignalements || 1)) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-accent-600">Collectés</span>
                <span className="font-semibold">{stats?.signalementsCollectes || 0}</span>
              </div>
              <div className="w-full bg-accent-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${((stats?.signalementsCollectes || 0) / (stats?.totalSignalements || 1)) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Performance mensuelle */}
        <div className="bg-white rounded-xl border border-accent-200 p-6">
          <h3 className="font-semibold text-accent-900 mb-4">Performance mensuelle</h3>
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-primary-500 mx-auto mb-3" />
              <p className="text-accent-600">Graphique détaillé disponible</p>
              <p className="text-sm text-accent-400">dans la section Statistiques</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dernières activités */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Derniers signalements */}
        <div className="bg-white rounded-xl border border-accent-200">
          <div className="px-6 py-4 border-b border-accent-200">
            <h3 className="font-semibold text-accent-900">Derniers signalements</h3>
          </div>
          <div className="divide-y divide-accent-100">
            {recentSignalements.slice(0, 4).map((signal) => (
              <div key={signal.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-accent-900">{signal.description?.substring(0, 40)}...</p>
                  <p className="text-xs text-accent-400 mt-1">{signal.adresse}</p>
                </div>
                <Badge variant={signal.statut === 'en_attente' ? 'warning' : signal.statut === 'collecte' ? 'success' : 'info'}>
                  {signal.statut}
                </Badge>
              </div>
            ))}
            {recentSignalements.length === 0 && (
              <div className="px-6 py-8 text-center text-accent-400">Aucun signalement récent</div>
            )}
          </div>
        </div>

        {/* Dernières collectes */}
        <div className="bg-white rounded-xl border border-accent-200">
          <div className="px-6 py-4 border-b border-accent-200">
            <h3 className="font-semibold text-accent-900">Dernières collectes</h3>
          </div>
          <div className="divide-y divide-accent-100">
            {recentCollectes.slice(0, 4).map((collecte) => (
              <div key={collecte.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-accent-900">Collecte du {new Date(collecte.date_planifiee).toLocaleDateString('fr-FR')}</p>
                  <p className="text-xs text-accent-400 mt-1">{collecte.nb_signalements_traites || 0} signalements</p>
                </div>
                <Badge variant={collecte.statut === 'planifiee' ? 'info' : collecte.statut === 'terminee' ? 'success' : 'warning'}>
                  {collecte.statut}
                </Badge>
              </div>
            ))}
            {recentCollectes.length === 0 && (
              <div className="px-6 py-8 text-center text-accent-400">Aucune collecte récente</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard