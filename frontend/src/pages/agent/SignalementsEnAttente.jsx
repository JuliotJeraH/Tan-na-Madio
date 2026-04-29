import { useState } from 'react'
import { useSignalements } from '../../hooks/useSignalements'
import { Card, Badge, Button, LoadingState, EmptyState } from '../../components/common'
import { motion } from 'framer-motion'
import { Check, X, Eye } from 'lucide-react'

export default function SignalementsEnAttente() {
  const { signalements, loading } = useSignalements({ statut: 'nouveau' })
  const [selectedSignal, setSelectedSignal] = useState(null)

  if (loading) return <LoadingState message="Chargement des signalements..." />

  const pendingSignals = signalements.filter(s => s.statut === 'nouveau')

  if (pendingSignals.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Signalements en Attente</h1>
        <EmptyState 
          icon="✅"
          title="Aucun signalement en attente"
          message="Tous les signalements ont été traités!"
        />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Signalements en Attente</h1>
        <p className="text-gray-600">Validez ou rejetez les nouveaux signalements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste */}
        <div className="lg:col-span-1 space-y-3">
          {pendingSignals.map((signal) => (
            <motion.div
              key={signal.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedSignal(signal)}
            >
              <Card 
                className={`cursor-pointer transition-all ${
                  selectedSignal?.id === signal.id 
                    ? 'bg-red-50 border-2 border-red-500' 
                    : 'border border-gray-200'
                }`}
              >
                <p className="font-semibold text-gray-900 mb-1">{signal.type}</p>
                <p className="text-sm text-gray-600 mb-2">{signal.description.substring(0, 50)}...</p>
                <p className="text-xs text-gray-500">
                  {new Date(signal.date_creation).toLocaleDateString('fr-FR')}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Détail */}
        {selectedSignal && (
          <div className="lg:col-span-2">
            <Card>
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedSignal.type}</h2>
                    <p className="text-gray-600">
                      Par: {selectedSignal.utilisateur?.nom}
                    </p>
                  </div>
                  <Badge>nouveau</Badge>
                </div>

                <p className="text-gray-700 mb-4">{selectedSignal.description}</p>

                {selectedSignal.photo && (
                  <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 h-48">
                    <img 
                      src={selectedSignal.photo} 
                      alt={selectedSignal.type}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Localisation</p>
                    <p className="font-semibold text-gray-900">
                      {selectedSignal.latitude.toFixed(2)}, {selectedSignal.longitude.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Date du signalement</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedSignal.date_creation).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Action</h3>
                <div className="flex gap-3">
                  <Button variant="primary" className="flex-1">
                    <Check className="w-4 h-4 mr-2" />
                    Valider et traiter
                  </Button>
                  <Button variant="danger" className="flex-1">
                    <X className="w-4 h-4 mr-2" />
                    Rejeter
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </motion.div>
  )
}
