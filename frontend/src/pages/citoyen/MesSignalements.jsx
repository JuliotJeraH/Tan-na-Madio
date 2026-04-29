import { useState, useEffect } from 'react'
import { useSignalements } from '../../hooks/useSignalements'
import { Card, Badge, Button, LoadingState, EmptyState } from '../../components/common'
import { motion } from 'framer-motion'
import { Eye, Trash2 } from 'lucide-react'

export default function MesSignalements() {
  const { signalements, loading } = useSignalements({ user_id: 'current' })
  const [filter, setFilter] = useState('tous')

  const filtered = signalements.filter(s => 
    filter === 'tous' || s.statut === filter
  )

  if (loading) return <LoadingState message="Chargement vos signalements..." />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Signalements</h1>
        <p className="text-gray-600">Suivi de l'historique de vos signalements</p>
      </div>

      {/* Filtres */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {['tous', 'nouveau', 'en_traitement', 'resolu'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filter === status
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState 
          icon="📋"
          title="Aucun signalement"
          message={filter === 'tous' 
            ? "Vous n'avez pas encore signalé de déchets" 
            : `Aucun signalement ${filter}`
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((signal, idx) => (
            <motion.div
              key={signal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{signal.type}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(signal.date_creation).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <Badge>{signal.statut}</Badge>
                </div>

                <p className="text-gray-700 mb-4 flex-grow">{signal.description}</p>

                {signal.photo && (
                  <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 h-32">
                    <img 
                      src={signal.photo} 
                      alt={signal.type}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="primary" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    Voir
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
