import { useState } from 'react'
import { useZones } from '../../hooks/useZones'
import { Card, Badge, Button, LoadingState } from '../../components/common'
import { motion } from 'framer-motion'
import { Edit2, Trash2, Plus, MapPin } from 'lucide-react'

export default function Zones() {
  const { zones, loading } = useZones()
  const [showModal, setShowModal] = useState(false)

  if (loading) return <LoadingState message="Chargement des zones..." />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Zones</h1>
          <p className="text-gray-600">Gérez les zones de collecte</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter zone
        </Button>
      </div>

      {/* Grille des zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {zones.map((zone) => (
          <motion.div key={zone.id} whileHover={{ scale: 1.02 }}>
            <Card>
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-900">{zone.nom}</h3>
                  <p className="text-sm text-gray-600">{zone.secteur}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{zone.description}</p>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Signalements:</span>
                  <span className="font-semibold">{zone.signalements_count || 0}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1">
                  <Edit2 className="w-4 h-4 mr-1" />
                  Modifier
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 text-red-500">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Supprimer
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
