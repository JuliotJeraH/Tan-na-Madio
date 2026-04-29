import { useState } from 'react'
import { useCollectes } from '../../hooks/useCollectes'
import { Card, Badge, Button, LoadingState } from '../../components/common'
import { motion } from 'framer-motion'
import { Check, Clock, AlertCircle } from 'lucide-react'

export default function Collectes() {
  const { collectes, loading } = useCollectes()
  const [filter, setFilter] = useState('tous')

  if (loading) return <LoadingState message="Chargement des collectes..." />

  const filtered = collectes.filter(c =>
    filter === 'tous' || c.statut === filter
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Collectes</h1>
        <p className="text-gray-600">Planifiez et suivez les collectes</p>
      </div>

      {/* Filtres */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {['tous', 'planifiee', 'en_cours', 'completee'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filter === status
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tableau */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Camion</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Points</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((collecte) => (
                <tr key={collecte.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(collecte.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{collecte.camion.immatriculation}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{collecte.points_collecte.length} points</td>
                  <td className="px-6 py-4">
                    <Badge>{collecte.statut}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm">
                      {collecte.statut === 'completee' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-orange-600" />
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  )
}
