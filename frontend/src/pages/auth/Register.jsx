import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Button, Input, LoadingState } from '../../components/common'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'citoyen',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setIsLoading(true)
    try {
      await register(formData)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur d\'inscription')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <LoadingState message="Création du compte..." />

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-500 rounded-lg mb-4">
            <span className="text-white font-bold text-xl">GC</span>
          </div>
          <h1 className="text-3xl font-bold text-accent-900">GreenCollect</h1>
          <p className="text-accent-600 mt-2">Rejoignez notre communauté</p>
        </div>

        {/* Form Card */}
        <div className="card p-8 mb-6">
          <h2 className="text-xl font-semibold text-accent-900 mb-6">Créer un compte</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nom complet"
              type="text"
              icon={User}
              placeholder="Jean Dupont"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />

            <Input
              label="Email"
              type="email"
              icon={Mail}
              placeholder="votre@email.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />

            <div>
              <label className="block text-sm font-medium text-accent-700 mb-2">Type de compte</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-base"
                disabled={isLoading}
              >
                <option value="citoyen">Citoyen</option>
                <option value="agent">Agent municipal</option>
                <option value="chauffeur">Chauffeur</option>
              </select>
            </div>

            <Input
              label="Mot de passe"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              helpText="Au minimum 8 caractères"
            />

            <Input
              label="Confirmer le mot de passe"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
            />

            <Button type="submit" className="w-full" disabled={isLoading} isLoading={isLoading}>
              S&apos;inscrire
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-accent-600">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" className="text-primary-500 font-semibold hover:underline">
              Se connecter
            </Link>
          </div>
        </div>

        {/* Benefits */}
        <div className="card p-4 space-y-3">
          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-sm text-accent-700">Signalez les problèmes de propreté</p>
          </div>
          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-sm text-accent-700">Suivez le statut de vos signalements</p>
          </div>
          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-sm text-accent-700">Contribuez à un environnement plus propre</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
