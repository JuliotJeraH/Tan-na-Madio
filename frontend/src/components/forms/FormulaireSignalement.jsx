import React, { useState, useRef } from 'react'
import { signalementAPI } from '../../api/signalements'
import { Camera, MapPin, X } from 'lucide-react'
import Button from '../common/Button'

const FormulaireSignalement = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    description: '',
    adresse: '',
    urgence: 'moyen',
    latitude: '',
    longitude: '',
  })
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }))
      })
    }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await signalementAPI.create(formData)
      
      if (photo && response.data.id) {
        await signalementAPI.uploadPhoto(response.data.id, photo)
      }
      
      onSuccess()
    } catch (error) {
      console.error('Error creating signalement:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-accent-700 mb-1">Description *</label>
        <textarea
          className="input-base resize-none h-24"
          placeholder="Décrivez le problème..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-accent-700 mb-1">Adresse</label>
        <input
          type="text"
          className="input-base"
          placeholder="Rue, quartier, ville"
          value={formData.adresse}
          onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-accent-700 mb-1">Urgence</label>
        <select
          className="input-base"
          value={formData.urgence}
          onChange={(e) => setFormData({ ...formData, urgence: e.target.value })}
        >
          <option value="faible">Faible</option>
          <option value="moyen">Moyen</option>
          <option value="eleve">Élevé</option>
          <option value="critique">Critique</option>
        </select>
      </div>

      {/* Localisation */}
      <div className="bg-accent-50 rounded-lg p-4">
        <label className="block text-sm font-medium text-accent-700 mb-2">Localisation</label>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <input
            type="text"
            className="input-base text-sm"
            placeholder="Latitude"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
          />
          <input
            type="text"
            className="input-base text-sm"
            placeholder="Longitude"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
          />
        </div>
        <Button type="button" variant="outline" size="sm" onClick={handleGetLocation} className="w-full">
          <MapPin className="w-4 h-4 mr-2" />
          Utiliser ma position
        </Button>
      </div>

      {/* Photo */}
      <div>
        <label className="block text-sm font-medium text-accent-700 mb-2">Photo</label>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
        
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Aperçu" className="w-full h-32 object-cover rounded-lg" />
            <button
              type="button"
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              onClick={() => { setPhoto(null); setPreview(null); }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="w-full h-32 border-2 border-dashed border-accent-300 rounded-lg flex flex-col items-center justify-center hover:border-primary-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="w-8 h-8 text-accent-400 mb-2" />
            <span className="text-sm text-accent-500">Ajouter une photo</span>
          </button>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" isLoading={loading} className="flex-1">Envoyer</Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Annuler</Button>
      </div>
    </form>
  )
}

export default FormulaireSignalement