import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephone: '',
    role: 'citoyen',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setLoading(true)
    try {
      const { confirmPassword, ...registerData } = formData
      await register(registerData)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">TM</span>
          </div>
          <h1 className="text-3xl font-bold text-accent-900">Tanàna Madio</h1>
          <p className="text-accent-600 mt-2">Rejoignez notre communauté</p>
        </div>

        {/* Formulaire */}
        <Card className="p-8">
          <h2 className="text-xl font-semibold text-accent-900 mb-6">Créer un compte</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-accent-700 mb-1">Nom *</label>
                <input
                  type="text"
                  name="nom"
                  className="input-base"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-accent-700 mb-1">Prénom *</label>
                <input
                  type="text"
                  name="prenom"
                  className="input-base"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-accent-700 mb-1">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent-400" />
                <input
                  type="email"
                  name="email"
                  className="input-base pl-10"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-accent-700 mb-1">Téléphone</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent-400" />
                <input
                  type="tel"
                  name="telephone"
                  className="input-base pl-10"
                  placeholder="+261 XX XXX XX"
                  value={formData.telephone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-accent-700 mb-1">Type de compte *</label>
              <select
                name="role"
                className="input-base"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="citoyen">Citoyen</option>
                <option value="agent_municipal">Agent Municipal</option>
                <option value="chauffeur">Chauffeur</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-accent-700 mb-1">Mot de passe *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent-400" />
                <input
                  type="password"
                  name="password"
                  className="input-base pl-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <p className="text-xs text-accent-400 mt-1">Minimum 6 caractères</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-accent-700 mb-1">Confirmer le mot de passe *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  className="input-base pl-10"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button type="submit" isLoading={loading} className="w-full">
              S'inscrire
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-accent-600">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">
              Se connecter
            </Link>
          </div>
        </Card>

        {/* Avantages */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center gap-3 text-sm text-accent-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Signalez les problèmes de propreté</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-accent-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Suivez le statut de vos signalements</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-accent-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Contribuez à une ville plus propre</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register