import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Plus, Eye, Clock, CheckCircle } from 'lucide-react'
import { signalementAPI } from '../../api/signalements'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Spinner from '../../components/common/Spinner'
import CarteSignalements from '../../components/map/CarteSignalements'

const CitoyenDashboard = () => {
  const [signalements, setSignalements] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchSignalements()
  }, [])

  const fetchSignalements = async () => {
    try {
      const response = await signalementAPI.list({ mes_signalements: true })
      setSignalements(response.data)
    } catch (error) {
      console.error('Error fetching signalements:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (statut) => {
    const variants = {
      en_attente: 'warning',
      valide: 'info',
      en_cours: 'info',
      collecte: 'success',
      rejete: 'danger',
    }
    return variants[statut] || 'default'
  }

  const getStatusLabel = (statut) => {
    const labels = {
      en_attente: 'En attente',
      valide: 'Validé',
      en_cours: 'En cours',
      collecte: 'Collecté',
      rejete: 'Rejeté',
    }
    return labels[statut] || statut
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
          <h1 className="text-2xl font-bold text-accent-900">Mes Signalements</h1>
          <p className="text-accent-500 mt-1">Suivez l'état de vos signalements</p>
        </div>
        <Button onClick={() => navigate('/citoyen/signaler')}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau signalement
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-accent-200 p-4 text-center">
          <p className="text-2xl font-bold text-primary-600">{signalements.length}</p>
          <p className="text-sm text-accent-500">Total</p>
        </div>
        <div className="bg-white rounded-xl border border-accent-200 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{signalements.filter(s => s.statut === 'en_attente').length}</p>
          <p className="text-sm text-accent-500">En attente</p>
        </div>
        <div className="bg-white rounded-xl border border-accent-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{signalements.filter(s => s.statut === 'en_cours').length}</p>
          <p className="text-sm text-accent-500">En cours</p>
        </div>
        <div className="bg-white rounded-xl border border-accent-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{signalements.filter(s => s.statut === 'collecte').length}</p>
          <p className="text-sm text-accent-500">Collectés</p>
        </div>
      </div>

      {/* Carte */}
      <div className="bg-white rounded-xl border border-accent-200 p-4">
        <h3 className="font-semibold text-accent-900 mb-3">Carte des signalements</h3>
        <div className="h-80 rounded-lg overflow-hidden">
          <CarteSignalements signalements={signalements} />
        </div>
      </div>

      {/* Liste des signalements */}
      <div className="space-y-3">
        <h3 className="font-semibold text-accent-900">Historique</h3>
        {signalements.slice(0, 5).map((signal) => (
          <div key={signal.id} className="bg-white rounded-xl border border-accent-200 p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-medium text-accent-900">{signal.description?.substring(0, 80)}...</p>
                  <Badge variant={getStatusBadge(signal.statut)}>{getStatusLabel(signal.statut)}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-accent-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {signal.adresse || 'Adresse non spécifiée'}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(signal.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate(`/citoyen/mes-signalements/${signal.id}`)}>
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {signalements.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-accent-200">
            <MapPin className="w-12 h-12 text-accent-300 mx-auto mb-3" />
            <p className="text-accent-500">Aucun signalement</p>
            <Button variant="outline" className="mt-3" onClick={() => navigate('/citoyen/signaler')}>
              Signaler un problème
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CitoyenDashboard