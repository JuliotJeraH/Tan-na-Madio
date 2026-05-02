import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/common/Button'

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
      
      const user = JSON.parse(localStorage.getItem('user'))
      if (user?.role === 'administrateur') navigate('/admin')
      else if (user?.role === 'agent_municipal') navigate('/agent')
      else if (user?.role === 'chauffeur') navigate('/chauffeur')
      else navigate('/citoyen')
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">TM</span>
          </div>
          <h1 className="text-3xl font-bold text-accent-900">Tanàna Madio</h1>
          <p className="text-accent-600 mt-2">Système de Gestion des Déchets Urbains</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-accent-100">
          <h2 className="text-2xl font-semibold text-accent-900 mb-6">Connexion</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-accent-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-base pl-10"
                  placeholder="votre@email.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-accent-700 mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-base pl-10"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full">
              Se connecter
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-accent-600">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              S'inscrire
            </Link>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-xs font-semibold text-blue-900 mb-2">Comptes de démonstration:</p>
          <ul className="text-xs text-blue-800 space-y-1">
            <li><strong>Admin:</strong> admin@tananamadio.mg / Admin2025!</li>
            <li><strong>Agent:</strong> agent@tananamadio.mg / Agent2025!</li>
            <li><strong>Chauffeur:</strong> chauffeur@tananamadio.mg / Chauffeur2025!</li>
            <li><strong>Citoyen:</strong> citoyen@tananamadio.mg / Citoyen2025!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Login