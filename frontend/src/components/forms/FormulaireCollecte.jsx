import React, { useState, useEffect } from 'react'
import { collecteAPI } from '../../api/collectes'
import { camionAPI } from '../../api/camions'
import { zoneAPI } from '../../api/zone'
import Button from '../common/Button'

const FormulaireCollecte = ({ collecte, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    camion_id: collecte?.camion_id || '',
    zone_id: collecte?.zone_id || '',
    date_planifiee: collecte?.date_planifiee?.split('T')[0] || '',
    notes: collecte?.notes || '',
  })
  const [camions, setCamions] = useState([])
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

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
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (collecte) {
        await collecteAPI.update(collecte.id, formData)
      } else {
        await collecteAPI.create(formData)
      }
      onSuccess()
    } catch (error) {
      console.error('Error saving collecte:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return <div className="text-center py-8">Chargement...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-accent-700 mb-1">Camion *</label>
        <select
          className="input-base"
          value={formData.camion_id}
          onChange={(e) => setFormData({ ...formData, camion_id: e.target.value })}
          required
        >
          <option value="">Sélectionner un camion</option>
          {camions.map((camion) => (
            <option key={camion.id} value={camion.id}>
              {camion.immatriculation} - {camion.modele || 'Modèle inconnu'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-accent-700 mb-1">Zone *</label>
        <select
          className="input-base"
          value={formData.zone_id}
          onChange={(e) => setFormData({ ...formData, zone_id: e.target.value })}
          required
        >
          <option value="">Sélectionner une zone</option>
          {zones.map((zone) => (
            <option key={zone.id} value={zone.id}>{zone.nom}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-accent-700 mb-1">Date planifiée *</label>
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
        <label className="block text-sm font-medium text-accent-700 mb-1">Notes</label>
        <textarea
          className="input-base resize-none h-24"
          placeholder="Instructions particulières..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" isLoading={loading} className="flex-1">
          {collecte ? 'Modifier' : 'Créer'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Annuler
        </Button>
      </div>
    </form>
  )
}

export default FormulaireCollecte