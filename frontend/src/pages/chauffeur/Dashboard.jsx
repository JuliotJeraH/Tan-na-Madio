import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navigation, MapPin, Clock, CheckCircle, Truck } from 'lucide-react'
import { collecteAPI } from '../../api/collectes'
import { camionAPI } from '../../api/camions'
import StatCard from '../../components/common/StatCard'
import Badge from '../../components/common/Badge'
import Spinner from '../../components/common/Spinner'
import Button from '../../components/common/Button'

const ChauffeurDashboard = () => {
  const [collectes, setCollectes] = useState([])
  const [camion, setCamion] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [collectesRes, camionsRes] = await Promise.all([
        collecteAPI.list({ statut: ['planifiee', 'en_cours'] }),
        camionAPI.list({ assigne_a_moi: true })
      ])
      setCollectes(collectesRes.data)
      setCamion(camionsRes.data[0])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartTournee = async (id) => {
    try {
      await collecteAPI.update(id, { statut: 'en_cours', date_debut: new Date() })
      fetchData()
    } catch (error) {
      console.error('Error starting tournee:', error)
    }
  }

  const handleCompleteTournee = async (id) => {
    try {
      await collecteAPI.complete(id)
      fetchData()
    } catch (error) {
      console.error('Error completing tournee:', error)
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
        <h1 className="text-2xl font-bold text-accent-900">Mes Tournées</h1>
        <p className="text-accent-500 mt-1">Gérez vos collectes de déchets</p>
      </div>

      {/* Camion info */}
      {camion && (
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm">Véhicule assigné</p>
              <p className="text-2xl font-bold">{camion.immatriculation}</p>
              <p className="text-primary-100 text-sm mt-1">{camion.modele}</p>
            </div>
            <Truck className="w-12 h-12 opacity-80" />
          </div>
          <div className="mt-4 pt-4 border-t border-primary-400">
            <div className="flex justify-between text-sm">
              <span>Charge actuelle</span>
              <span className="font-semibold">{camion.charge_actuelle || 0} / {camion.capacite_kg} kg</span>
            </div>
            <div className="w-full bg-primary-700 rounded-full h-2 mt-2">
              <div className="bg-white h-2 rounded-full" style={{ width: `${((camion.charge_actuelle || 0) / camion.capacite_kg) * 100}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard title="À faire" value={collectes.filter(c => c.statut === 'planifiee').length} icon={Clock} color="warning" />
        <StatCard title="En cours" value={collectes.filter(c => c.statut === 'en_cours').length} icon={Navigation} color="info" />
        <StatCard title="Terminées" value={collectes.filter(c => c.statut === 'terminee').length} icon={CheckCircle} color="success" />
      </div>

      {/* Liste des collectes */}
      <div className="space-y-3">
        {collectes.map((collecte) => (
          <div key={collecte.id} className="bg-white rounded-xl border border-accent-200 p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-accent-900">Collecte du {new Date(collecte.date_planifiee).toLocaleDateString('fr-FR')}</h3>
                  <Badge variant={collecte.statut === 'planifiee' ? 'warning' : collecte.statut === 'en_cours' ? 'info' : 'success'}>
                    {collecte.statut}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-accent-500 mb-3">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {collecte.zone?.nom || 'Zone non définie'}</span>
                  <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> {collecte.nb_signalements_traites || 0} signalements</span>
                </div>
                {collecte.distance_km && <p className="text-sm text-accent-500">Distance: {collecte.distance_km} km</p>}
              </div>
              <div className="flex gap-2">
                {collecte.statut === 'planifiee' && (
                  <Button size="sm" onClick={() => handleStartTournee(collecte.id)}>Démarrer</Button>
                )}
                {collecte.statut === 'en_cours' && (
                  <Button size="sm" onClick={() => handleCompleteTournee(collecte.id)}>Terminer</Button>
                )}
                <Button size="sm" variant="outline" onClick={() => navigate(`/chauffeur/tournee/${collecte.id}`)}>Détails</Button>
              </div>
            </div>
          </div>
        ))}

        {collectes.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-accent-200">
            <p className="text-accent-500">Aucune tournée planifiée</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChauffeurDashboard