import React, { useState } from 'react'
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react'
import { useZones } from '../../hooks/useZones'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Spinner from '../../components/common/Spinner'
import Modal from '../../components/common/Modal'

const Zones = () => {
  const { zones, loading, refetch } = useZones()
  const [showModal, setShowModal] = useState(false)

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
          <h1 className="text-2xl font-bold text-accent-900">Gestion des Zones</h1>
          <p className="text-accent-500 mt-1">Définissez les secteurs de collecte</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une zone
        </Button>
      </div>

      {/* Grille des zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {zones.map((zone) => (
          <div key={zone.id} className="bg-white rounded-xl border border-accent-200 p-5 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-500" />
                <h3 className="font-semibold text-accent-900">{zone.nom}</h3>
              </div>
              <Badge variant={zone.actif ? 'success' : 'danger'}>{zone.actif ? 'Active' : 'Inactive'}</Badge>
            </div>
            
            <p className="text-sm text-accent-600 mb-4">{zone.description || 'Aucune description'}</p>
            
            <div className="flex justify-between text-sm mb-4">
              <span className="text-accent-500">Fréquence:</span>
              <span className="font-medium">Tous les {zone.frequence_collecte_jours || 7} jours</span>
            </div>
            
            <div className="flex gap-2 pt-3 border-t border-accent-100">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit2 className="w-4 h-4 mr-1" />
                Modifier
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 text-red-500">
                <Trash2 className="w-4 h-4 mr-1" />
                Supprimer
              </Button>
            </div>
          </div>
        ))}
      </div>

      {zones.length === 0 && (
        <div className="text-center py-12 text-accent-400 bg-white rounded-xl border border-accent-200">
          Aucune zone définie
        </div>
      )}

      {/* Modal Ajout */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Ajouter une zone">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-accent-700 mb-1">Nom de la zone</label>
            <input type="text" className="input-base" placeholder="Ex: Antananarivo Centre" />
          </div>
          <div>
            <label className="block text-sm font-medium text-accent-700 mb-1">Description</label>
            <textarea className="input-base resize-none h-24" placeholder="Description de la zone..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-accent-700 mb-1">Fréquence de collecte (jours)</label>
            <input type="number" className="input-base" defaultValue={7} />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">Ajouter</Button>
            <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">Annuler</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Zones