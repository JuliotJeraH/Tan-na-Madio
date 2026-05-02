import React, { useState, useEffect } from 'react'
import { TrendingUp, Users, Truck, AlertCircle, Calendar, Download } from 'lucide-react'
import { statsAPI } from '../../api/stats'
import StatCard from '../../components/common/StatCard'
import Spinner from '../../components/common/Spinner'
import Button from '../../components/common/Button'

const Stats = () => {
  const [stats, setStats] = useState(null)
  const [period, setPeriod] = useState('month')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [period])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await statsAPI.getDashboard()
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-accent-900">Statistiques Globales</h1>
          <p className="text-accent-500 mt-1">Analyse des performances du système</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border border-accent-200 rounded-lg text-sm"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Signalements" value={stats?.totalSignalements || 0} icon={AlertCircle} color="primary" />
        <StatCard title="Collectes" value={stats?.totalCollectes || 0} icon={Truck} color="success" />
        <StatCard title="Utilisateurs" value={stats?.totalUtilisateurs || 0} icon={Users} color="warning" />
        <StatCard title="Taux de réussite" value={`${stats?.tauxReussite || 0}%`} icon={TrendingUp} color="info" />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des signalements */}
        <div className="bg-white rounded-xl border border-accent-200 p-6">
          <h3 className="font-semibold text-accent-900 mb-4">Évolution des signalements</h3>
          <div className="h-64 flex items-center justify-center bg-accent-50 rounded-lg">
            <p className="text-accent-400">Graphique d'évolution à implémenter</p>
          </div>
        </div>

        {/* Répartition par zone */}
        <div className="bg-white rounded-xl border border-accent-200 p-6">
          <h3 className="font-semibold text-accent-900 mb-4">Répartition par zone</h3>
          <div className="space-y-3">
            {stats?.zones?.map((zone, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-accent-600">{zone.nom}</span>
                  <span className="font-semibold">{zone.count}</span>
                </div>
                <div className="w-full bg-accent-100 rounded-full h-2">
                  <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${(zone.count / (stats?.totalSignalements || 1)) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance des camions */}
      <div className="bg-white rounded-xl border border-accent-200 p-6">
        <h3 className="font-semibold text-accent-900 mb-4">Performance des camions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats?.camions?.slice(0, 4).map((camion) => (
            <div key={camion.id} className="flex items-center justify-between p-4 bg-accent-50 rounded-lg">
              <div>
                <p className="font-medium text-accent-900">{camion.immatriculation}</p>
                <p className="text-sm text-accent-500">{camion.nb_collectes} collectes</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary-600">{camion.efficacite}%</p>
                <p className="text-xs text-accent-400">efficacité</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Stats