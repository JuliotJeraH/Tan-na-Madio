import { useState } from 'react'
import { useStats } from '../../hooks/useStats'
import { Card, StatCard, LoadingState } from '../../components/common'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Truck, AlertCircle } from 'lucide-react'

export default function Stats() {
  const { stats, loading } = useStats()

  if (loading) return <LoadingState message="Chargement des statistiques..." />

  const mockStats = {
    signalements_total: 156,
    signalements_resolus: 142,
    signalements_en_attente: 14,
    camions_actifs: 8,
    utilisateurs_actifs: 45,
    collectes_ce_mois: 312,
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistiques Globales</h1>
        <p className="text-gray-600">Vue d'ensemble du système de gestion des déchets</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<AlertCircle className="w-6 h-6" />}
          title="Signalements"
          value={mockStats.signalements_total}
          subtitle={`${mockStats.signalements_resolus} résolus`}
          color="bg-red-100 text-red-600"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Collectes ce mois"
          value={mockStats.collectes_ce_mois}
          subtitle={"+12% vs mois dernier"}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          icon={<Truck className="w-6 h-6" />}
          title="Camions actifs"
          value={mockStats.camions_actifs}
          subtitle="8/10 disponibles"}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          icon={<Users className="w-6 h-6" />}
          title="Utilisateurs actifs"
          value={mockStats.utilisateurs_actifs}
          subtitle="+3 cette semaine"}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Signalements par statut</h3>
          <div className="space-y-3">
            {[
              { label: 'Résolus', value: 142, color: 'bg-green-500' },
              { label: 'En traitement', value: 10, color: 'bg-orange-500' },
              { label: 'En attente', value: 4, color: 'bg-red-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${item.color} h-2 rounded-full`}
                    style={{ width: `${(item.value / 156) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance camions</h3>
          <div className="space-y-4">
            {[
              { name: 'Camion AB-123', charge: 85, collectes: 12 },
              { name: 'Camion CD-456', charge: 62, collectes: 8 },
              { name: 'Camion EF-789', charge: 95, collectes: 15 },
            ].map((camion) => (
              <div key={camion.name}>
                <p className="font-semibold text-gray-900 mb-1">{camion.name}</p>
                <p className="text-sm text-gray-600 mb-2">Charge: {camion.charge}% | Collectes: {camion.collectes}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${camion.charge}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  )
}
