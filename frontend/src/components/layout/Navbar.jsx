import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, LogOut, User, Bell } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../common/Button'

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const getRoleLabel = (role) => {
    const labels = {
      citoyen: 'Citoyen',
      agent_municipal: 'Agent Municipal',
      chauffeur: 'Chauffeur',
      administrateur: 'Administrateur',
    }
    return labels[role] || role
  }

  return (
    <nav className="bg-white border-b border-accent-200 shadow-sm sticky top-0 z-30">
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-accent-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-accent-600" />
          </button>
          <h1 className="text-xl font-semibold text-accent-800">Tanàna Madio</h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg hover:bg-accent-100 transition-colors relative">
            <Bell className="w-5 h-5 text-accent-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-accent-900">{user?.prenom} {user?.nom}</p>
              <p className="text-xs text-accent-500">{getRoleLabel(user?.role)}</p>
            </div>
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600" />
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar