import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Button, Input, LoadingState } from '../../components/common'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <LoadingState message="Connexion en cours..." />

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-500 rounded-lg mb-4">
            <span className="text-white font-bold text-xl">GC</span>
          </div>
          <h1 className="text-3xl font-bold text-accent-900">GreenCollect</h1>
          <p className="text-accent-600 mt-2">Gestion intelligente des déchets</p>
        </div>

        {/* Form Card */}
        <div className="card p-8 mb-6">
          <h2 className="text-xl font-semibold text-accent-900 mb-6">Se connecter</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              icon={Mail}
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />

            <Input
              label="Mot de passe"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />

            <Button type="submit" className="w-full" disabled={isLoading} isLoading={isLoading}>
              Se connecter
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-accent-600">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-primary-500 font-semibold hover:underline">
              S&apos;inscrire
            </Link>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="card p-4 bg-blue-50 border-blue-200">
          <p className="text-xs font-semibold text-blue-900 mb-2">Comptes de démonstration:</p>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>Admin: admin@greencollect.com / admin123</li>
            <li>Agent: agent@greencollect.com / agent123</li>
            <li>Chauffeur: chauffeur@greencollect.com / chauffeur123</li>
            <li>Citoyen: citoyen@greencollect.com / citoyen123</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Login
