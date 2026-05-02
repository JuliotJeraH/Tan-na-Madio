import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Truck, 
  MapPin, 
  Users, 
  FileText, 
  BarChart,
  Home,
  ClipboardList,
  Calendar,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth()

  const menuItems = {
    administrateur: [
      { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/admin/camions', icon: Truck, label: 'Camions' },
      { path: '/admin/zones', icon: MapPin, label: 'Zones' },
      { path: '/admin/utilisateurs', icon: Users, label: 'Utilisateurs' },
      { path: '/admin/stats', icon: BarChart, label: 'Statistiques' },
    ],
    agent_municipal: [
      { path: '/agent', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/agent/signalements', icon: AlertCircle, label: 'Signalements' },
      { path: '/agent/collectes', icon: ClipboardList, label: 'Collectes' },
      { path: '/agent/planifier', icon: Calendar, label: 'Planifier' },
      { path: '/agent/camions', icon: Truck, label: 'Camions' },
    ],
    chauffeur: [
      { path: '/chauffeur', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/chauffeur/tournees', icon: Truck, label: 'Mes Tournées' },
    ],
    citoyen: [
      { path: '/citoyen', icon: Home, label: 'Accueil' },
      { path: '/citoyen/signaler', icon: MapPin, label: 'Signaler' },
      { path: '/citoyen/mes-signalements', icon: FileText, label: 'Mes Signalements' },
    ],
  }

  const items = menuItems[user?.role] || []

  return (
    <div
      className={`
        fixed left-0 top-0 h-full bg-white border-r border-accent-200 shadow-lg
        transition-all duration-300 z-40 flex flex-col
        ${isOpen ? 'w-64' : 'w-20'}
      `}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-accent-200">
        <span className={`font-bold text-primary-600 ${isOpen ? 'text-xl' : 'text-sm'}`}>
          {isOpen ? 'Tanàna Madio' : 'TM'}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200
              ${isActive 
                ? 'bg-primary-50 text-primary-600' 
                : 'text-accent-600 hover:bg-accent-100'
              }
              ${!isOpen && 'justify-center'}
            `}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="text-sm font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-20 bg-white border border-accent-200 rounded-full p-1 shadow-md hover:shadow-lg transition-all"
      >
        {isOpen ? (
          <ChevronLeft className="w-4 h-4 text-accent-600" />
        ) : (
          <ChevronRight className="w-4 h-4 text-accent-600" />
        )}
      </button>
    </div>
  )
}

export default Sidebar