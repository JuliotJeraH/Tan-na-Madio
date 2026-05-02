import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, Truck, CheckCircle, Navigation } from 'lucide-react'
import { collecteAPI } from '../../api/collectes'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import CarteSignalements from '../../components/map/CarteSignalements'
import ItineraireOverlay from '../../components/map/ItineraireOverlay'

const DetailTournee = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [collecte, setCollecte] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showRoute, setShowRoute] = useState(false)

  useEffect(() => {
    fetchCollecte()
  }, [id])

  const fetchCollecte = async () => {
    try {
      const response = await collecteAPI.getById(id)
      setCollecte(response.data)
    } catch (error) {
      console.error('Error fetching collecte:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStart = async () => {
    try {
      await collecteAPI.update(id, { statut: 'en_cours', date_debut: new Date() })
      fetchCollecte()
    } catch (error) {
      console.error('Error starting collecte:', error)
    }
  }

  const handleComplete = async () => {
    try {
      await collecteAPI.complete(id)
      fetchCollecte()
    } catch (error) {
      console.error('Error completing collecte:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!collecte) {
    return (
      <div className="text-center py-12">
        <p className="text-accent-500">Collecte non trouvée</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/chauffeur')}>
          Retour
        </Button>
      </div>
    )
  }

  const getStatusLabel = (statut) => {
    const labels = {
      planifiee: 'Planifiée',
      en_cours: 'En cours',
      terminee: 'Terminée',
      annulee: 'Annulée',
    }
    return labels[statut] || statut
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/chauffeur')} className="p-2 rounded-lg hover:bg-accent-100">
          <ArrowLeft className="w-5 h-5 text-accent-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-accent-900">Détail de la tournée</h1>
          <p className="text-accent-500 mt-1">Collecte du {new Date(collecte.date_planifiee).toLocaleDateString('fr-FR')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="h-96 relative">
              <CarteSignalements signalements={collecte.signalements || []} />
              {showRoute && collecte.itineraire && (
                <ItineraireOverlay route={collecte.itineraire} camion={collecte.camion} />
              )}
            </div>
            <div className="p-4 border-t border-accent-200 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowRoute(!showRoute)}>
                <Navigation className="w-4 h-4 mr-2" />
                {showRoute ? 'Cacher' : 'Afficher'} l'itinéraire
              </Button>
            </div>
          </Card>
        </div>

        {/* Informations */}
        <div className="space-y-4">
          <Card>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-accent-500">Statut</p>
                <Badge variant={
                  collecte.statut === 'planifiee' ? 'info' :
                  collecte.statut === 'en_cours' ? 'warning' : 'success'
                }>
                  {getStatusLabel(collecte.statut)}
                </Badge>
              </div>
              <Truck className="w-8 h-8 text-accent-400" />
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <p className="text-sm text-accent-500">Camion</p>
                <p className="font-semibold">{collecte.camion?.immatriculation || 'Non assigné'}</p>
              </div>
              <div>
                <p className="text-sm text-accent-500">Zone</p>
                <p className="font-semibold">{collecte.zone?.nom || 'Non définie'}</p>
              </div>
              <div>
                <p className="text-sm text-accent-500">Date planifiée</p>
                <p className="font-semibold">{new Date(collecte.date_planifiee).toLocaleDateString('fr-FR')}</p>
              </div>
              {collecte.distance_km && (
                <div>
                  <p className="text-sm text-accent-500">Distance totale</p>
                  <p className="font-semibold">{collecte.distance_km} km</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t">
              {collecte.statut === 'planifiee' && (
                <Button className="flex-1" onClick={handleStart}>
                  Démarrer la tournée
                </Button>
              )}
              {collecte.statut === 'en_cours' && (
                <Button className="flex-1" onClick={handleComplete}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Terminer
                </Button>
              )}
            </div>
          </Card>

          {/* Points de collecte */}
          {collecte.signalements && collecte.signalements.length > 0 && (
            <Card>
              <h3 className="font-semibold text-accent-900 mb-3">
                Points à collecter ({collecte.signalements.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {collecte.signalements.map((signal, idx) => (
                  <div key={signal.id} className="flex items-start gap-2 p-2 hover:bg-accent-50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{signal.description?.substring(0, 40)}</p>
                      <p className="text-xs text-accent-400">{signal.adresse}</p>
                    </div>
                    <MapPin className="w-4 h-4 text-accent-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default DetailTournee