import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Camera, Send, AlertCircle, CheckCircle } from 'lucide-react'
import { signalementAPI } from '../../services/api'
import { Button, Input, Card, CardBody, LoadingState, ErrorState } from '../../components/common'

const SignalReport = () => {
  const [formData, setFormData] = useState({
    description: '',
    category: 'general',
    latitude: '',
    longitude: '',
  })
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const categories = [
    'general',
    'déchets_volumineux',
    'encombrants',
    'déchets_dangereux',
    'autre',
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }))
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await signalementAPI.create(formData)
      
      if (photo) {
        await signalementAPI.uploadPhoto(response.data.id, photo)
      }

      setSuccess(true)
      setTimeout(() => {
        navigate('/citoyen')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du signalement')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <LoadingState message="Création du signalement..." />

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-accent-900">Signaler un problème</h1>
        <p className="text-accent-600 mt-2">Aidez-nous à maintenir notre quartier propre</p>
      </div>

      {success && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardBody className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <p className="font-semibold text-green-900">Signalement créé avec succès</p>
              <p className="text-sm text-green-800">Vous allez être redirigé dans quelques secondes...</p>
            </div>
          </CardBody>
        </Card>
      )}

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardBody className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </CardBody>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-accent-700 mb-2">
            Description du problème
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Décrivez le problème de propreté en détail..."
            className="input-base resize-none h-32"
            required
            disabled={isLoading}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-accent-700 mb-2">
            Catégorie
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-base"
            disabled={isLoading}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Photo Upload */}
        <Card>
          <CardBody>
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
                disabled={isLoading}
              />
              {preview ? (
                <img src={preview} alt="Preview" className="w-32 h-32 rounded-lg object-cover" />
              ) : (
                <div className="w-32 h-32 bg-accent-100 rounded-lg flex items-center justify-center">
                  <Camera className="w-8 h-8 text-accent-400" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-accent-900 mb-2">Photo du problème</p>
                <p className="text-sm text-accent-600 mb-3">
                  {preview ? 'Photo sélectionnée' : 'Aucune photo sélectionnée'}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                  disabled={isLoading}
                >
                  <Camera className="w-4 h-4" />
                  Sélectionner une photo
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Location */}
        <Card>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-accent-700 mb-2">
                Latitude
              </label>
              <Input
                name="latitude"
                type="number"
                step="0.0001"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="48.8566"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-accent-700 mb-2">
                Longitude
              </label>
              <Input
                name="longitude"
                type="number"
                step="0.0001"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="2.3522"
                disabled={isLoading}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleGetLocation}
              className="gap-2 w-full"
              disabled={isLoading}
            >
              <MapPin className="w-4 h-4" />
              Utiliser ma position
            </Button>
          </CardBody>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            className="flex-1 gap-2"
            disabled={isLoading}
            isLoading={isLoading}
          >
            <Send className="w-4 h-4" />
            Envoyer le signalement
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/citoyen')}
            disabled={isLoading}
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SignalReport
