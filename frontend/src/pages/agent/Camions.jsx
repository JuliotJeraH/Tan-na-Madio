import { useState } from 'react'
import { useCamions } from '../../hooks/useCamions'
import { Card, Badge, Button, LoadingState, EmptyState } from '../../components/common'
import { motion } from 'framer-motion'
import { MapPin, Radio } from 'lucide-react'

export default function Camions() {
  const { camions, loading } = useCamions()
  const [selectedCamion, setSelectedCamion] = useState(null)

  if (loading) return <LoadingState message="Chargement des camions..." />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Suivi des Camions</h1>
        <p className="text-gray-600">Localisez et coordonnez les tournées</p>
      </div>

      {camions.length === 0 ? (
        <EmptyState 
          icon="🚚"
          title="Aucun camion disponible"
          message="Aucun camion n'est assigné pour le moment"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des camions */}
          <div className="lg:col-span-1 space-y-3">
            {camions.map((camion) => (
              <motion.div
                key={camion.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedCamion(camion)}
              >
                <Card 
                  className={`cursor-pointer transition-all ${
                    selectedCamion?.id === camion.id 
                      ? 'bg-green-50 border-2 border-green-500' 
                      : 'border border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{camion.immatriculation}</h3>
                      <p className="text-sm text-gray-600">{camion.marque}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      camion.statut_disponibilite === 'disponible' 
                        ? 'bg-green-500' 
                        : 'bg-orange-500'
                    }`} />
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p>Charge: {camion.charge_actuelle}/{camion.capacite} kg</p>
                    <p>Chauffeur: {camion.chauffeur?.nom || 'Non assigné'}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Détails du camion sélectionné */}
          {selectedCamion && (
            <div className="lg:col-span-2">
              <Card>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedCamion.immatriculation}</h2>
                    <p className="text-gray-600">{selectedCamion.marque} {selectedCamion.modele}</p>
                  </div>
                  <Badge>{selectedCamion.statut_disponibilite}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Charge actuelle</p>
                    <p className="text-2xl font-bold text-green-600">{selectedCamion.charge_actuelle} kg</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Capacité</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedCamion.capacite} kg</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Utilisation</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: `${(selectedCamion.charge_actuelle / selectedCamion.capacite) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {Math.round((selectedCamion.charge_actuelle / selectedCamion.capacite) * 100)}% utilisé
                  </p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Informations</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Chauffeur</p>
                      <p className="font-semibold text-gray-900">{selectedCamion.chauffeur?.nom || 'Non assigné'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Dernière localisation</p>
                      <p className="font-semibold text-gray-900">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Paris (48.8°N)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6 pt-6 border-t">
                  <Button variant="primary" className="flex-1">
                    <Radio className="w-4 h-4 mr-2" />
                    Contacter chauffeur
                  </Button>
                  <Button variant="secondary" className="flex-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    Voir sur carte
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
