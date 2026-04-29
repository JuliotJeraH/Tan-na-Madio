import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../common/Button'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleNavigation = (path) => {
    navigate(path)
    setIsOpen(false)
  }

  return (
    <nav className="bg-white border-b border-accent-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNavigation('/')}
          >
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">GC</span>
            </div>
            <span className="font-bold text-accent-900 hidden sm:inline">GreenCollect</span>
          </div>

          {/* Desktop Menu */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-6">
              {user?.role === 'admin' && (
                <>
                  <button
                    onClick={() => handleNavigation('/admin')}
                    className="text-accent-700 hover:text-primary-500 transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleNavigation('/admin/users')}
                    className="text-accent-700 hover:text-primary-500 transition-colors"
                  >
                    Utilisateurs
                  </button>
                </>
              )}
              {user?.role === 'agent' && (
                <>
                  <button
                    onClick={() => handleNavigation('/agent')}
                    className="text-accent-700 hover:text-primary-500 transition-colors"
                  >
                    Signalements
                  </button>
                  <button
                    onClick={() => handleNavigation('/agent/collectes')}
                    className="text-accent-700 hover:text-primary-500 transition-colors"
                  >
                    Collectes
                  </button>
                </>
              )}
              {user?.role === 'chauffeur' && (
                <>
                  <button
                    onClick={() => handleNavigation('/chauffeur')}
                    className="text-accent-700 hover:text-primary-500 transition-colors"
                  >
                    Mes Tournées
                  </button>
                </>
              )}
              {user?.role === 'citoyen' && (
                <>
                  <button
                    onClick={() => handleNavigation('/citoyen')}
                    className="text-accent-700 hover:text-primary-500 transition-colors"
                  >
                    Signaler
                  </button>
                  <button
                    onClick={() => handleNavigation('/citoyen/historique')}
                    className="text-accent-700 hover:text-primary-500 transition-colors"
                  >
                    Mes Signalements
                  </button>
                </>
              )}
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-accent-600" />
                  <span className="text-sm text-accent-700">{user?.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                  Se connecter
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  S&apos;inscrire
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-accent-700 hover:text-primary-500"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-accent-200 py-4 space-y-3">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 text-sm text-accent-700">
                  Connecté en tant que: <strong>{user?.name}</strong>
                </div>
                {user?.role === 'admin' && (
                  <>
                    <button
                      onClick={() => handleNavigation('/admin')}
                      className="block w-full text-left px-4 py-2 text-accent-700 hover:bg-accent-50"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => handleNavigation('/admin/users')}
                      className="block w-full text-left px-4 py-2 text-accent-700 hover:bg-accent-50"
                    >
                      Utilisateurs
                    </button>
                  </>
                )}
                {user?.role === 'agent' && (
                  <>
                    <button
                      onClick={() => handleNavigation('/agent')}
                      className="block w-full text-left px-4 py-2 text-accent-700 hover:bg-accent-50"
                    >
                      Signalements
                    </button>
                    <button
                      onClick={() => handleNavigation('/agent/collectes')}
                      className="block w-full text-left px-4 py-2 text-accent-700 hover:bg-accent-50"
                    >
                      Collectes
                    </button>
                  </>
                )}
                {user?.role === 'citoyen' && (
                  <>
                    <button
                      onClick={() => handleNavigation('/citoyen')}
                      className="block w-full text-left px-4 py-2 text-accent-700 hover:bg-accent-50"
                    >
                      Signaler
                    </button>
                    <button
                      onClick={() => handleNavigation('/citoyen/historique')}
                      className="block w-full text-left px-4 py-2 text-accent-700 hover:bg-accent-50"
                    >
                      Mes Signalements
                    </button>
                  </>
                )}
                <hr className="my-2" />
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-medium"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handleNavigation('/login')}
                >
                  Se connecter
                </Button>
                <Button className="w-full" onClick={() => handleNavigation('/register')}>
                  S&apos;inscrire
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
