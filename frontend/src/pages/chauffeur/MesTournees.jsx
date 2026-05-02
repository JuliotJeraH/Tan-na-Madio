import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCollectes } from '../../hooks/useCollectes'
import { Calendar, Truck, MapPin, Clock, ChevronRight } from 'lucide-react'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'

const MesTournees = () => {
  const { collectes, loading } = useCollectes({ assigne_a_moi: true })
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    )
  }

  const collectesPlanifiees = collectes.filter(c => c.statut === 'planifiee')
  const collectesEnCours = collectes.filter(c => c.statut === 'en_cours')
  const collectesTerminees = collectes.filter(c => c.statut === 'terminee')

  if (collectes.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="Aucune tournée"
        message="Vous n'avez pas encore de tournées assignées"
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-accent-900">Mes Tournées</h1>
        <p className="text-accent-500 mt-1">Gérez et suivez vos collectes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-accent-200 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{collectesPlanifiees.length}</p>
          <p className="text-sm text-accent-500">Planifiées</p>
        </div>
        <div className="bg-white rounded-xl border border-accent-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{collectesEnCours.length}</p>
          <p className="text-sm text-accent-500">En cours</p>
        </div>
        <div className="bg-white rounded-xl border border-accent-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{collectesTerminees.length}</p>
          <p className="text-sm text-accent-500">Terminées</p>
        </div>
      </div>

      {/* Liste */}
      <div className="space-y-3">
        <h3 className="font-semibold text-accent-900">Tournées à venir</h3>
        {collectesPlanifiees.map((collecte) => (
          <TourneeCard key={collecte.id} collecte={collecte} />
        ))}

        {collectesEnCours.length > 0 && (
          <>
            <h3 className="font-semibold text-accent-900 mt-6">Tournées en cours</h3>
            {collectesEnCours.map((collecte) => (
              <TourneeCard key={collecte.id} collecte={collecte} />
            ))}
          </>
        )}

        {collectesTerminees.length > 0 && (
          <>
            <h3 className="font-semibold text-accent-900 mt-6">Historique</h3>
            {collectesTerminees.slice(0, 5).map((collecte) => (
              <TourneeCard key={collecte.id} collecte={collecte} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

// Composant interne pour une carte de tournée
const TourneeCard = ({ collecte }) => {
  const navigate = useNavigate()
  
  const getStatusVariant = (statut) => {
    const variants = {
      planifiee: 'info',
      en_cours: 'warning',
      terminee: 'success',
    }
    return variants[statut] || 'default'
  }

  return (
    <Card className="hover:shadow-md transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-accent-900">
              Collecte du {new Date(collecte.date_planifiee).toLocaleDateString('fr-FR')}
            </h3>
            <Badge variant={getStatusVariant(collecte.statut)}>
              {collecte.statut === 'planifiee' ? 'Planifiée' : 
               collecte.statut === 'en_cours' ? 'En cours' : 'Terminée'}
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
              <Clock className="w-4 h-4" />
              {collecte.nb_signalements_traites || 0} signalements
            </span>
          </div>
        </div>
        
        <Button size="sm" onClick={() => navigate(`/chauffeur/tournee/${collecte.id}`)}>
          Voir détails
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </Card>
  )
}

export default MesTournees