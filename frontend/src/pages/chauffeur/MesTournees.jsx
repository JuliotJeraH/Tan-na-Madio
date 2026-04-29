import { useState, useEffect } from 'react'
import { useCamions } from '../../hooks/useCamions'
import { Card, Badge, Button, LoadingState, EmptyState } from '../../components/common'
import { motion } from 'framer-motion'

export default function MesTournees() {
  const { camions, loading } = useCamions()
  const [selectedCamion, setSelectedCamion] = useState(null)

  if (loading) return <LoadingState message="Chargement des tournées..." />

  const tournees = camions.filter(c => c.statut_disponibilite === 'en_tournee')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Tournées</h1>
        <p className="text-gray-600">Gérez et suivez vos tournées de collecte</p>
      </div>

      {tournees.length === 0 ? (
        <EmptyState 
          icon="📭"
          title="Aucune tournée en cours"
          message="Vous n'avez pas de tournée active pour le moment"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tournees.map((tournee) => (
            <motion.div key={tournee.id} whileHover={{ scale: 1.02 }}>
              <Card 
                onClick={() => setSelectedCamion(tournee)}
                className="cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {tournee.immatriculation}
                    </h3>
                    <p className="text-sm text-gray-600">{tournee.marque} {tournee.modele}</p>
                  </div>
                  <Badge>{tournee.statut_disponibilite}</Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Charge actuelles:</span>
                    <span className="font-semibold">{tournee.charge_actuelle}/{tournee.capacite} kg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(tournee.charge_actuelle / tournee.capacite) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="primary" className="flex-1">
                    Voir détails
                  </Button>
                  <Button size="sm" variant="secondary" className="flex-1">
                    Itinéraire
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
