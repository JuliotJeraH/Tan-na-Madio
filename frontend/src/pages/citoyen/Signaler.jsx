import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Camera, Send, AlertCircle, CheckCircle, Upload } from 'lucide-react'
import { signalementAPI } from '../../api/signalements'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

const Signaler = () => {
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
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }))
      }, (err) => {
        setError('Impossible d\'obtenir votre position')
      })
    } else {
      setError('Géolocalisation non supportée')
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
    setError(null)

    try {
      const response = await signalementAPI.create(formData)
      
      if (photo && response.data.id) {
        await signalementAPI.uploadPhoto(response.data.id, photo)
      }
      
      setSuccess(true)
      setTimeout(() => navigate('/citoyen'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du signalement')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-xl font-bold text-accent-900 mb-2">Signalement envoyé !</h2>
        <p className="text-accent-500">Merci pour votre contribution à une ville plus propre.</p>
        <p className="text-sm text-accent-400 mt-2">Redirection en cours...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-accent-900">Signaler un problème</h1>
        <p className="text-accent-500 mt-1">Aidez-nous à maintenir votre quartier propre</p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-accent-700 mb-2">Description *</label>
          <textarea
            className="input-base resize-none h-32"
            placeholder="Décrivez le problème (déchets, encombrants, etc.)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        {/* Adresse */}
        <div>
          <label className="block text-sm font-medium text-accent-700 mb-2">Adresse</label>
          <input
            type="text"
            className="input-base"
            placeholder="Rue, quartier, ville"
            value={formData.adresse}
            onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
          />
        </div>

        {/* Urgence */}
        <div>
          <label className="block text-sm font-medium text-accent-700 mb-2">Niveau d'urgence</label>
          <select
            className="input-base"
            value={formData.urgence}
            onChange={(e) => setFormData({ ...formData, urgence: e.target.value })}
          >
            <option value="faible">Faible - Peu de déchets</option>
            <option value="moyen">Moyen - Accumulation notable</option>
            <option value="eleve">Élevé - Grande quantité</option>
            <option value="critique">Critique - Danger sanitaire</option>
          </select>
        </div>

        {/* Localisation */}
        <div className="bg-accent-50 rounded-xl p-4">
          <label className="block text-sm font-medium text-accent-700 mb-3">Localisation</label>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              className="input-base"
              placeholder="Latitude"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
            />
            <input
              type="text"
              className="input-base"
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
        <div className="bg-accent-50 rounded-xl p-4">
          <label className="block text-sm font-medium text-accent-700 mb-3">Photo (optionnel)</label>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          
          {preview ? (
            <div className="relative">
              <img src={preview} alt="Aperçu" className="w-full h-48 object-cover rounded-lg" />
              <button
                type="button"
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                onClick={() => { setPhoto(null); setPreview(null); }}
              >
                <AlertCircle className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="w-full h-32 border-2 border-dashed border-accent-300 rounded-lg flex flex-col items-center justify-center hover:border-primary-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="w-8 h-8 text-accent-400 mb-2" />
              <span className="text-sm text-accent-500">Cliquez pour ajouter une photo</span>
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button type="submit" isLoading={loading} className="flex-1">
            <Send className="w-4 h-4 mr-2" />
            Envoyer
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/citoyen')} className="flex-1">
            Annuler
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Signaler