import React, { useState, useEffect } from 'react'
import { Check, X, Eye, MapPin, Clock } from 'lucide-react'
import { signalementAPI } from '../../api/signalements'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Spinner from '../../components/common/Spinner'
import Modal from '../../components/common/Modal'
import CarteSignalements from '../../components/map/CarteSignalements'

const SignalementsEnAttente = () => {
  const [signalements, setSignalements] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSignal, setSelectedSignal] = useState(null)

  useEffect(() => {
    fetchSignalements()
  }, [])

  const fetchSignalements = async () => {
    try {
      const response = await signalementAPI.list({ statut: 'en_attente' })
      setSignalements(response.data)
    } catch (error) {
      console.error('Error fetching signalements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleValider = async (id) => {
    try {
      await signalementAPI.valider(id)
      fetchSignalements()
      setSelectedSignal(null)
    } catch (error) {
      console.error('Error validating:', error)
    }
  }

  const handleRejeter = async (id) => {
    try {
      await signalementAPI.rejeter(id)
      fetchSignalements()
      setSelectedSignal(null)
    } catch (error) {
      console.error('Error rejecting:', error)
    }
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
      <div>
        <h1 className="text-2xl font-bold text-accent-900">Signalements en Attente</h1>
        <p className="text-accent-500 mt-1">Validez ou rejetez les nouveaux signalements</p>
      </div>

      {/* Carte */}
      <div className="bg-white rounded-xl border border-accent-200 p-4">
        <h3 className="font-semibold text-accent-900 mb-3">Visualisation sur la carte</h3>
        <div className="h-80 rounded-lg overflow-hidden">
          <CarteSignalements signalements={signalements} />
        </div>
      </div>

      {/* Liste des signalements */}
      <div className="grid grid-cols-1 gap-4">
        {signalements.map((signal) => (
          <div key={signal.id} className="bg-white rounded-xl border border-accent-200 p-5 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-accent-900">{signal.description}</h3>
                  <Badge variant={signal.urgence === 'critique' ? 'danger' : 'warning'}>{signal.urgence}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-accent-500 mb-3">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {signal.adresse || 'Adresse non spécifiée'}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(signal.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
                <p className="text-accent-600 text-sm mb-4">Signalé par: <span className="font-medium">{signal.citoyen?.nom} {signal.citoyen?.prenom}</span></p>
              </div>
              <div className="flex gap-2 ml-4">
                <Button size="sm" onClick={() => handleValider(signal.id)}>
                  <Check className="w-4 h-4 mr-1" />
                  Valider
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedSignal(signal)}>
                  <Eye className="w-4 h-4 mr-1" />
                  Détails
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleRejeter(signal.id)}>
                  <X className="w-4 h-4 mr-1" />
                  Rejeter
                </Button>
              </div>
            </div>
          </div>
        ))}

        {signalements.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-accent-200">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-accent-500">Aucun signalement en attente</p>
            <p className="text-sm text-accent-400">Tous les signalements ont été traités</p>
          </div>
        )}
      </div>

      {/* Modal Détails */}
      {selectedSignal && (
        <Modal isOpen={!!selectedSignal} onClose={() => setSelectedSignal(null)} title="Détails du signalement">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-accent-500">Description</label>
              <p className="text-accent-900 mt-1">{selectedSignal.description}</p>
            </div>
            <div>
              <label className="text-sm text-accent-500">Adresse</label>
              <p className="text-accent-900 mt-1">{selectedSignal.adresse || 'Non spécifiée'}</p>
            </div>
            <div>
              <label className="text-sm text-accent-500">Urgence</label>
              <div className="mt-1"><Badge variant={selectedSignal.urgence === 'critique' ? 'danger' : 'warning'}>{selectedSignal.urgence}</Badge></div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button className="flex-1" onClick={() => handleValider(selectedSignal.id)}>Valider</Button>
              <Button variant="danger" className="flex-1" onClick={() => handleRejeter(selectedSignal.id)}>Rejeter</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default SignalementsEnAttente