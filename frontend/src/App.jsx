import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// Layout Components
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import ProtectedRoute from './components/layout/ProtectedRoute'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminGestionCamions from './pages/admin/GestionCamions'
import AdminStats from './pages/admin/Stats'
import AdminUtilisateurs from './pages/admin/Utilisateurs'
import AdminZones from './pages/admin/Zones'

// Agent Pages
import AgentDashboard from './pages/agent/Dashboard'
import AgentCamions from './pages/agent/Camions'
import AgentCollectes from './pages/agent/Collectes'
import AgentPlanifierCollecte from './pages/agent/PlanifierCollecte'
import AgentSignalementsEnAttente from './pages/agent/SignalementsEnAttente'

// Chauffeur Pages
import ChauffeurDashboard from './pages/chauffeur/Dashboard'
import ChauffeurDetailTournee from './pages/chauffeur/DetailTournee'
import ChauffeurMesTournees from './pages/chauffeur/MesTournees'

// Citoyen Pages
import CitoyenDashboard from './pages/citoyen/Dashboard'
import CitoyenMesSignalements from './pages/citoyen/MesSignalements'
import CitoyenSignaler from './pages/citoyen/Signaler'

// Home Page
const HomePage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white">
    <div className="text-center px-4">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 rounded-2xl mb-6 shadow-lg">
        <span className="text-white font-bold text-3xl">TM</span>
      </div>
      <h1 className="text-5xl font-bold text-accent-900 mb-4">Tanàna Madio</h1>
      <p className="text-xl text-accent-600 mb-8 max-w-md">
        Système Numérique de Gestion des Déchets Urbains
      </p>
      <div className="flex gap-4 justify-center">
        <a href="/login" className="btn-primary">Se connecter</a>
        <a href="/register" className="btn-outline">S'inscrire</a>
      </div>
    </div>
  </div>
)

// Layout wrapper with sidebar for authenticated users
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  
  return (
    <div className="flex h-screen bg-accent-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['administrateur']}>
              <AppLayout><AdminDashboard /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/camions" element={
            <ProtectedRoute allowedRoles={['administrateur']}>
              <AppLayout><AdminGestionCamions /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/stats" element={
            <ProtectedRoute allowedRoles={['administrateur']}>
              <AppLayout><AdminStats /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/utilisateurs" element={
            <ProtectedRoute allowedRoles={['administrateur']}>
              <AppLayout><AdminUtilisateurs /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/zones" element={
            <ProtectedRoute allowedRoles={['administrateur']}>
              <AppLayout><AdminZones /></AppLayout>
            </ProtectedRoute>
          } />

          {/* Agent Routes */}
          <Route path="/agent" element={
            <ProtectedRoute allowedRoles={['agent_municipal']}>
              <AppLayout><AgentDashboard /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/agent/camions" element={
            <ProtectedRoute allowedRoles={['agent_municipal']}>
              <AppLayout><AgentCamions /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/agent/collectes" element={
            <ProtectedRoute allowedRoles={['agent_municipal']}>
              <AppLayout><AgentCollectes /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/agent/planifier" element={
            <ProtectedRoute allowedRoles={['agent_municipal']}>
              <AppLayout><AgentPlanifierCollecte /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/agent/signalements" element={
            <ProtectedRoute allowedRoles={['agent_municipal']}>
              <AppLayout><AgentSignalementsEnAttente /></AppLayout>
            </ProtectedRoute>
          } />

          {/* Chauffeur Routes */}
          <Route path="/chauffeur" element={
            <ProtectedRoute allowedRoles={['chauffeur']}>
              <AppLayout><ChauffeurDashboard /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/chauffeur/tournees" element={
            <ProtectedRoute allowedRoles={['chauffeur']}>
              <AppLayout><ChauffeurMesTournees /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/chauffeur/tournee/:id" element={
            <ProtectedRoute allowedRoles={['chauffeur']}>
              <AppLayout><ChauffeurDetailTournee /></AppLayout>
            </ProtectedRoute>
          } />

          {/* Citoyen Routes */}
          <Route path="/citoyen" element={
            <ProtectedRoute allowedRoles={['citoyen']}>
              <AppLayout><CitoyenDashboard /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/citoyen/mes-signalements" element={
            <ProtectedRoute allowedRoles={['citoyen']}>
              <AppLayout><CitoyenMesSignalements /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/citoyen/signaler" element={
            <ProtectedRoute allowedRoles={['citoyen']}>
              <AppLayout><CitoyenSignaler /></AppLayout>
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App