import { useState } from 'react'
import { useCamions } from '../../hooks/useCamions'
import { Card, Badge, Button, LoadingState, Modal } from '../../components/common'
import { motion } from 'framer-motion'
import { Edit2, Trash2, Plus } from 'lucide-react'

export default function GestionCamions() {
  const { camions, loading } = useCamions()
  const [showModal, setShowModal] = useState(false)

  if (loading) return <LoadingState message="Chargement des camions..." />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Camions</h1>
          <p className="text-gray-600">Gérez la flotte de collecte</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un camion
        </Button>
      </div>

      {/* Tableau */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Immatriculation</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Marque</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Capacité</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {camions.map((camion) => (
                <tr key={camion.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-semibold text-gray-900">{camion.immatriculation}</td>
                  <td className="px-6 py-4 text-gray-600">{camion.marque} {camion.modele}</td>
                  <td className="px-6 py-4 text-gray-600">{camion.capacite} kg</td>
                  <td className="px-6 py-4">
                    <Badge>{camion.statut_disponibilite}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Ajouter */}
      {showModal && (
        <Modal title="Ajouter un camion" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <input 
              type="text"
              placeholder="Immatriculation"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input 
              type="text"
              placeholder="Marque"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input 
              type="number"
              placeholder="Capacité (kg)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <div className="flex gap-2 pt-4">
              <Button variant="primary" className="flex-1">Ajouter</Button>
              <Button variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </motion.div>
  )
}
