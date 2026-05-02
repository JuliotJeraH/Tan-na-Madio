import React, { useState } from 'react'
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react'
import { useCamions } from '../../hooks/useCamions'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Spinner from '../../components/common/Spinner'
import Modal from '../../components/common/Modal'
import FormulaireCamion from '../../components/forms/FormulaireCamion'

const GestionCamions = () => {
  const { camions, loading, refetch } = useCamions()
  const [showModal, setShowModal] = useState(false)
  const [selectedCamion, setSelectedCamion] = useState(null)

  const handleEdit = (camion) => {
    setSelectedCamion(camion)
    setShowModal(true)
  }

  const handleAdd = () => {
    setSelectedCamion(null)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedCamion(null)
    refetch()
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
          <h1 className="text-2xl font-bold text-accent-900">Gestion des Camions</h1>
          <p className="text-accent-500 mt-1">Gérez la flotte de collecte</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un camion
        </Button>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl border border-accent-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent-50 border-b border-accent-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-accent-900">Immatriculation</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-accent-900">Modèle</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-accent-900">Capacité (kg)</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-accent-900">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-accent-900">Chauffeur</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-accent-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent-100">
              {camions.map((camion) => (
                <tr key={camion.id} className="hover:bg-accent-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-accent-900">{camion.immatriculation}</td>
                  <td className="px-6 py-4 text-accent-600">{camion.modele || '-'}</td>
                  <td className="px-6 py-4 text-accent-600">{camion.capacite_kg}</td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      camion.statut === 'disponible' ? 'success' :
                      camion.statut === 'en_tournee' ? 'info' :
                      camion.statut === 'en_maintenance' ? 'warning' : 'danger'
                    }>
                      {camion.statut}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-accent-600">{camion.chauffeur?.nom || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(camion)} className="p-1 hover:bg-accent-100 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4 text-accent-500" />
                      </button>
                      <button className="p-1 hover:bg-red-100 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {camions.length === 0 && (
          <div className="text-center py-12 text-accent-400">
            Aucun camion enregistré
          </div>
        )}
      </div>

      {/* Modal Formulaire */}
      <Modal isOpen={showModal} onClose={handleCloseModal} title={selectedCamion ? 'Modifier le camion' : 'Ajouter un camion'}>
        <FormulaireCamion camion={selectedCamion} onSuccess={handleCloseModal} onCancel={handleCloseModal} />
      </Modal>
    </div>
  )
}

export default GestionCamions