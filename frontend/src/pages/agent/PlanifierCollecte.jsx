import { useState } from 'react'
import { Card, Button, Modal } from '../../components/common'
import { motion } from 'framer-motion'
import { Plus, Calendar, Truck } from 'lucide-react'

export default function PlanifierCollecte() {
  const [showModal, setShowModal] = useState(false)
  const [collectes] = useState([
    { id: 1, date: '2026-04-30', camion: 'AB-123', points: 5, statut: 'planifiee' },
    { id: 2, date: '2026-05-01', camion: 'CD-456', points: 7, statut: 'planifiee' },
  ])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-909 mb-2">Planifier une Collecte</h1>
          <p className="text-gray-600">Créez et planifiez les tournées de collecte</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle collecte
        </Button>
      </div>

      {/* Planning calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendrier */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Calendrier des collectes</h3>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Calendrier interactif à intégrer</p>
          </div>
        </Card>

        {/* Prochaines collectes */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prochaines collectes</h3>
          <div className="space-y-3">
            {collectes.map((collecte) => (
              <div key={collecte.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-gray-900">{collecte.camion}</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {collecte.statut}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{collecte.date}</p>
                <p className="text-xs text-gray-600">{collecte.points} points</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal title="Planifier une nouvelle collecte" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Date</label>
              <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Camion</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option>Sélectionner un camion</option>
                <option>AB-123</option>
                <option>CD-456</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Zone</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option>Sélectionner une zone</option>
                <option>Zone 1</option>
                <option>Zone 2</option>
              </select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="primary" className="flex-1">Planifier</Button>
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
