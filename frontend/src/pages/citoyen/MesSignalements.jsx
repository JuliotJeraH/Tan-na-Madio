import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSignalements } from '../../hooks/useSignalements'
import { Eye, MapPin, Clock, Trash2, Filter } from 'lucide-react'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'

const MesSignalements = () => {
  const { signalements, loading, rejeterSignalement } = useSignalements({ mes_signalements: true })
  const [filter, setFilter] = useState('tous')
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    )
  }

  const getStatusVariant = (statut) => {
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

  const filteredSignalements = signalements.filter(s => {
    if (filter === 'tous') return true
    return s.statut === filter
  })

  const stats = {
    total: signalements.length,
    enAttente: signalements.filter(s => s.statut === 'en_attente').length,
    enCours: signalements.filter(s => s.statut === 'en_cours' || s.statut === 'valide').length,
    collectes: signalements.filter(s => s.statut === 'collecte').length,
  }

  if (signalements.length === 0) {
    return (
      <EmptyState
        icon={MapPin}
        title="Aucun signalement"
        message="Vous n'avez pas encore signalé de problème"
        actionText="Signaler un problème"
        action={() => navigate('/citoyen/signaler')}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-accent-900">Mes Signalements</h1>
          <p className="text-accent-500 mt-1">Suivez l'évolution de vos signalements</p>
        </div>
        <Button onClick={() => navigate('/citoyen/signaler')}>
          Nouveau signalement
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-accent-200 p-4 text-center">
          <p className="text-2xl font-bold text-primary-600">{stats.total}</p>
          <p className="text-sm text-accent-500">Total</p>
        </div>
        <div className="bg-white rounded-xl border border-accent-200 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.enAttente}</p>
          <p className="text-sm text-accent-500">En attente</p>
        </div>
        <div className="bg-white rounded-xl border border-accent-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.enCours}</p>
          <p className="text-sm text-accent-500">En cours</p>
        </div>
        <div className="bg-white rounded-xl border border-accent-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.collectes}</p>
          <p className="text-sm text-accent-500">Collectés</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        {['tous', 'en_attente', 'valide', 'en_cours', 'collecte', 'rejete'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === status
                ? 'bg-primary-500 text-white'
                : 'bg-accent-100 text-accent-600 hover:bg-accent-200'
            }`}
          >
            {status === 'tous' ? 'Tous' : getStatusLabel(status)}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="space-y-3">
        {filteredSignalements.map((signal) => (
          <Card key={signal.id} className="hover:shadow-md transition-all">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="font-semibold text-accent-900">
                    {signal.description?.substring(0, 80)}...
                  </h3>
                  <Badge variant={getStatusVariant(signal.statut)}>
                    {getStatusLabel(signal.statut)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-accent-500 mb-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {signal.adresse || 'Adresse non spécifiée'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(signal.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                
                {signal.urgence && (
                  <div className="mt-2">
                    <Badge variant={
                      signal.urgence === 'critique' ? 'danger' :
                      signal.urgence === 'eleve' ? 'warning' : 'info'
                    }>
                      Urgence: {signal.urgence}
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => navigate(`/citoyen/mes-signalements/${signal.id}`)}>
                  <Eye className="w-4 h-4 mr-1" />
                  Détails
                </Button>
                {signal.statut === 'en_attente' && (
                  <Button size="sm" variant="ghost" className="text-red-500" onClick={() => rejeterSignalement(signal.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default MesSignalements