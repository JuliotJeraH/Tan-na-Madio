import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Truck, MapPin, Clock, AlertCircle } from 'lucide-react'
import { collecteAPI } from '../../api/collectes'
import { camionAPI } from '../../api/camions'
import { zoneAPI } from '../../api/zone'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Spinner from '../../components/common/Spinner'

const PlanifierCollecte = () => {
  const [formData, setFormData] = useState({
    camion_id: '',
    zone_id: '',
    date_planifiee: '',
    notes: '',
  })
  const [camions, setCamions] = useState([])
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [camionsRes, zonesRes] = await Promise.all([
        camionAPI.list({ statut: 'disponible' }),
        zoneAPI.list({ actif: true })
      ])
      setCamions(camionsRes.data)
      setZones(zonesRes.data)
    } catch (err) {
      setError('Erreur de chargement des données')
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      await collecteAPI.create(formData)
      setSuccess(true)
      setTimeout(() => navigate('/agent/collectes'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la planification')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-accent-900 mb-2">Collecte planifiée !</h2>
        <p className="text-accent-500">La tournée a été créée avec succès.</p>
        <p className="text-sm text-accent-400 mt-2">Redirection en cours...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-accent-900">Planifier une Collecte</h1>
        <p className="text-accent-500 mt-1">Organisez une nouvelle tournée de collecte</p>
      </div>

      {/* Formulaire */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-accent-700 mb-2">
              <Truck className="w-4 h-4 inline mr-1" />
              Camion *
            </label>
            <select
              className="input-base"
              value={formData.camion_id}
              onChange={(e) => setFormData({ ...formData, camion_id: e.target.value })}
              required
            >
              <option value="">Sélectionner un camion</option>
              {camions.map((camion) => (
                <option key={camion.id} value={camion.id}>
                  {camion.immatriculation} - {camion.modele || 'Modèle inconnu'} ({camion.capacite_kg} kg)
                </option>
              ))}
            </select>
            {camions.length === 0 && (
              <p className="text-sm text-yellow-600 mt-1">⚠️ Aucun camion disponible</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-accent-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Zone *
            </label>
            <select
              className="input-base"
              value={formData.zone_id}
              onChange={(e) => setFormData({ ...formData, zone_id: e.target.value })}
              required
            >
              <option value="">Sélectionner une zone</option>
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.nom} - Tous les {zone.frequence_collecte_jours || 7} jours
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-accent-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date planifiée *
            </label>
            <input
              type="date"
              className="input-base"
              value={formData.date_planifiee}
              onChange={(e) => setFormData({ ...formData, date_planifiee: e.target.value })}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-accent-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Notes
            </label>
            <textarea
              className="input-base resize-none h-24"
              placeholder="Instructions particulières pour le chauffeur..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" isLoading={loading} disabled={camions.length === 0} className="flex-1">
              Planifier la collecte
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/agent')} className="flex-1">
              Annuler
            </Button>
          </div>
        </form>
      </Card>

      {/* Info */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <p className="text-sm text-blue-800">
          💡 Les tournées sont optimisées automatiquement avec l'algorithme de Dijkstra.
          Le chauffeur recevra l'itinéraire le plus court pour collecter tous les signalements de la zone.
        </p>
      </div>
    </div>
  )
}

export default PlanifierCollecte