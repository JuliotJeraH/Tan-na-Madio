import React, { useState, useEffect } from 'react'
import { AlertCircle, Clock, CheckCircle, Truck } from 'lucide-react'
import { signalementAPI } from '../../api/signalements'
import { collecteAPI } from '../../api/collectes'
import StatCard from '../../components/common/StatCard'
import Badge from '../../components/common/Badge'
import Spinner from '../../components/common/Spinner'
import Button from '../../components/common/Button'
import { useNavigate } from 'react-router-dom'

const AgentDashboard = () => {
  const [stats, setStats] = useState(null)
  const [signalements, setSignalements] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [signalementsRes, collectesRes] = await Promise.all([
        signalementAPI.list({ statut: 'en_attente' }),
        collecteAPI.list({ statut: 'planifiee' })
      ])
      setSignalements(signalementsRes.data)
      setStats({
        enAttente: signalementsRes.data.length,
        collectesPlanifiees: collectesRes.data.length,
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleValider = async (id) => {
    try {
      await signalementAPI.valider(id)
      fetchData()
    } catch (error) {
      console.error('Error validating signalement:', error)
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
        <h1 className="text-2xl font-bold text-accent-900">Tableau de Bord Agent</h1>
        <p className="text-accent-500 mt-1">Validez et gérez les signalements</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard title="Signalements en attente" value={stats?.enAttente || 0} icon={AlertCircle} color="warning" />
        <StatCard title="Collectes planifiées" value={stats?.collectesPlanifiees || 0} icon={Clock} color="info" />
        <StatCard title="Validés ce mois" value="24" icon={CheckCircle} color="success" change="+8" />
      </div>

      {/* Signalements à valider */}
      <div className="bg-white rounded-xl border border-accent-200">
        <div className="px-6 py-4 border-b border-accent-200 flex justify-between items-center">
          <h3 className="font-semibold text-accent-900">Signalements à valider</h3>
          <Button variant="outline" size="sm" onClick={() => navigate('/agent/signalements')}>
            Voir tous
          </Button>
        </div>
        <div className="divide-y divide-accent-100">
          {signalements.slice(0, 5).map((signal) => (
            <div key={signal.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-accent-900">{signal.description?.substring(0, 60)}...</p>
                <p className="text-sm text-accent-400 mt-1">{signal.adresse}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant={signal.urgence === 'critique' ? 'danger' : signal.urgence === 'eleve' ? 'warning' : 'info'}>
                    {signal.urgence}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button size="sm" onClick={() => handleValider(signal.id)}>Valider</Button>
                <Button size="sm" variant="outline">Détails</Button>
              </div>
            </div>
          ))}
          {signalements.length === 0 && (
            <div className="px-6 py-8 text-center text-accent-400">
              Aucun signalement en attente
            </div>
          )}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-accent-200 p-5">
          <h3 className="font-semibold text-accent-900 mb-2">Planifier une collecte</h3>
          <p className="text-sm text-accent-500 mb-4">Organisez une nouvelle tournée de collecte</p>
          <Button onClick={() => navigate('/agent/planifier')}>Planifier</Button>
        </div>
        <div className="bg-white rounded-xl border border-accent-200 p-5">
          <h3 className="font-semibold text-accent-900 mb-2">Voir les collectes</h3>
          <p className="text-sm text-accent-500 mb-4">Suivez l'état des collectes en cours</p>
          <Button variant="outline" onClick={() => navigate('/agent/collectes')}>Voir les collectes</Button>
        </div>
      </div>
    </div>
  )
}

export default AgentDashboard