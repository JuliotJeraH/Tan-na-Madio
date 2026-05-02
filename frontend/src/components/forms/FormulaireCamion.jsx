import React, { useState } from 'react'
import { camionAPI } from '../../api/camions'
import Button from '../common/Button'

const FormulaireCamion = ({ camion, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    immatriculation: camion?.immatriculation || '',
    modele: camion?.modele || '',
    capacite_kg: camion?.capacite_kg || '',
    statut: camion?.statut || 'disponible',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (camion) {
        await camionAPI.update(camion.id, formData)
      } else {
        await camionAPI.create(formData)
      }
      onSuccess()
    } catch (error) {
      console.error('Error saving camion:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-accent-700 mb-1">Immatriculation</label>
        <input
          type="text"
          className="input-base"
          value={formData.immatriculation}
          onChange={(e) => setFormData({ ...formData, immatriculation: e.target.value })}
          required
          placeholder="Ex: 1234TGA"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-accent-700 mb-1">Modèle</label>
        <input
          type="text"
          className="input-base"
          value={formData.modele}
          onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
          placeholder="Ex: Renault Maxity"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-accent-700 mb-1">Capacité (kg)</label>
        <input
          type="number"
          className="input-base"
          value={formData.capacite_kg}
          onChange={(e) => setFormData({ ...formData, capacite_kg: e.target.value })}
          required
          placeholder="Ex: 15000"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-accent-700 mb-1">Statut</label>
        <select
          className="input-base"
          value={formData.statut}
          onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
        >
          <option value="disponible">Disponible</option>
          <option value="en_tournee">En tournée</option>
          <option value="en_maintenance">En maintenance</option>
          <option value="hors_service">Hors service</option>
        </select>
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="submit" isLoading={loading} className="flex-1">Enregistrer</Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Annuler</Button>
      </div>
    </form>
  )
}

export default FormulaireCamion