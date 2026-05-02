import React, { useState } from 'react'
import { useCollectes } from '../../hooks/useCollectes'
import { Calendar, Truck, MapPin, CheckCircle, Clock } from 'lucide-react'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'

const Collectes = () => {
  const { collectes, loading, completeCollecte } = useCollectes()
  const [filter, setFilter] = useState('tous')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    )
  }

  const filteredCollectes = collectes.filter(c => {
    if (filter === 'tous') return true
    return c.statut === filter
  })

  const getStatusVariant = (statut) => {
    const variants = {
      planifiee: 'info',
      en_cours: 'warning',
      terminee: 'success',
      annulee: 'danger',
    }
    return variants[statut] || 'default'
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

  if (collectes.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="Aucune collecte"
        message="Aucune collecte n'a été planifiée pour le moment"
        actionText="Planifier une collecte"
        action={() => window.location.href = '/agent/planifier'}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-accent-900">Gestion des Collectes</h1>
        <p className="text-accent-500 mt-1">Planifiez et suivez les collectes</p>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        {['tous', 'planifiee', 'en_cours', 'terminee'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === status
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-accent-100 text-accent-600 hover:bg-accent-200'
            }`}
          >
            {status === 'tous' ? 'Toutes' : getStatusLabel(status)}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="space-y-3">
        {filteredCollectes.map((collecte) => (
          <Card key={collecte.id} className="hover:shadow-md transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-accent-900">
                    Collecte du {new Date(collecte.date_planifiee).toLocaleDateString('fr-FR')}
                  </h3>
                  <Badge variant={getStatusVariant(collecte.statut)}>
                    {getStatusLabel(collecte.statut)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-accent-500">
                  <span className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    {collecte.camion?.immatriculation || 'Camion non assigné'}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {collecte.zone?.nom || 'Zone non définie'}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {collecte.nb_signalements_traites || 0} signalements
                  </span>
                </div>
                
                {collecte.distance_km && (
                  <p className="text-sm text-accent-400 mt-2">
                    📏 Distance: {collecte.distance_km} km
                  </p>
                )}
              </div>
              
              <div className="flex gap-2">
                {collecte.statut === 'planifiee' && (
                  <Button size="sm">Démarrer</Button>
                )}
                {collecte.statut === 'en_cours' && (
                  <Button size="sm" onClick={() => completeCollecte(collecte.id)}>
                    Terminer
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  Détails
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Collectes