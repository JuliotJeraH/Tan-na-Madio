import React, { useState } from 'react'
import { useCamions } from '../../hooks/useCamions'
import { MapPin, Radio, Truck } from 'lucide-react'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'

const Camions = () => {
  const { camions, loading } = useCamions()
  const [selectedCamion, setSelectedCamion] = useState(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    )
  }

  const camionsDisponibles = camions.filter(c => c.statut === 'disponible')
  const camionsEnTournee = camions.filter(c => c.statut === 'en_tournee')
  const camionsMaintenance = camions.filter(c => c.statut === 'en_maintenance')

  if (camions.length === 0) {
    return (
      <EmptyState
        icon={Truck}
        title="Aucun camion"
        message="Aucun camion n'est enregistré dans le système"
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-accent-900">Suivi des Camions</h1>
        <p className="text-accent-500 mt-1">Localisez et coordonnez les tournées</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-accent-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{camionsDisponibles.length}</p>
          <p className="text-sm text-accent-500">Disponibles</p>
        </div>
        <div className="bg-white rounded-xl border border-accent-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{camionsEnTournee.length}</p>
          <p className="text-sm text-accent-500">En tournée</p>
        </div>
        <div className="bg-white rounded-xl border border-accent-200 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{camionsMaintenance.length}</p>
          <p className="text-sm text-accent-500">Maintenance</p>
        </div>
      </div>

      {/* Liste et détail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste */}
        <div className="lg:col-span-1 space-y-3">
          {camions.map((camion) => (
            <div
              key={camion.id}
              onClick={() => setSelectedCamion(camion)}
              className={`
                bg-white rounded-xl border p-4 cursor-pointer transition-all
                ${selectedCamion?.id === camion.id 
                  ? 'border-primary-500 shadow-md ring-2 ring-primary-200' 
                  : 'border-accent-200 hover:shadow-md'
                }
              `}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-accent-900">{camion.immatriculation}</h3>
                  <p className="text-sm text-accent-500">{camion.modele || 'Modèle inconnu'}</p>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${
                  camion.statut === 'disponible' ? 'bg-green-500' :
                  camion.statut === 'en_tournee' ? 'bg-blue-500' :
                  camion.statut === 'en_maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
              </div>
              <div className="space-y-1 text-xs text-accent-500">
                <p>Capacité: {camion.capacite_kg} kg</p>
                <p>Chauffeur: {camion.chauffeur?.nom || 'Non assigné'}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Détails */}
        {selectedCamion && (
          <div className="lg:col-span-2">
            <Card>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-accent-900">{selectedCamion.immatriculation}</h2>
                  <p className="text-accent-500">{selectedCamion.modele}</p>
                </div>
                <Badge variant={
                  selectedCamion.statut === 'disponible' ? 'success' :
                  selectedCamion.statut === 'en_tournee' ? 'info' :
                  selectedCamion.statut === 'en_maintenance' ? 'warning' : 'danger'
                }>
                  {selectedCamion.statut}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-accent-50 rounded-lg">
                  <p className="text-sm text-accent-500 mb-1">Capacité</p>
                  <p className="text-2xl font-bold text-primary-600">{selectedCamion.capacite_kg} kg</p>
                </div>
                <div className="p-4 bg-accent-50 rounded-lg">
                  <p className="text-sm text-accent-500 mb-1">Charge actuelle</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedCamion.charge_actuelle || 0} kg</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-accent-500 mb-2">Utilisation</p>
                <div className="w-full bg-accent-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary-500 h-2.5 rounded-full"
                    style={{ width: `${((selectedCamion.charge_actuelle || 0) / selectedCamion.capacite_kg) * 100}%` }}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-accent-900 mb-3">Informations</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-accent-500">Chauffeur</p>
                    <p className="font-medium">{selectedCamion.chauffeur?.nom || 'Non assigné'}</p>
                  </div>
                  <div>
                    <p className="text-accent-500">Dernière maintenance</p>
                    <p className="font-medium">{selectedCamion.derniere_maintenance 
                      ? new Date(selectedCamion.derniere_maintenance).toLocaleDateString('fr-FR')
                      : 'Non effectuée'}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t">
                <Button variant="primary" className="flex-1">
                  <Radio className="w-4 h-4 mr-2" />
                  Contacter chauffeur
                </Button>
                <Button variant="outline" className="flex-1">
                  <MapPin className="w-4 h-4 mr-2" />
                  Voir sur carte
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default Camions