import { useState } from 'react'
import { Card, Badge, Button, LoadingState, Modal } from '../../components/common'
import { motion } from 'framer-motion'
import { Edit2, Trash2, Plus, Shield } from 'lucide-react'

export default function Utilisateurs() {
  const [users] = useState([
    { id: 1, email: 'citoyen@greencollect.com', nom: 'Jean Dupont', role: 'citoyen', statut: 'actif' },
    { id: 2, email: 'agent@greencollect.com', nom: 'Marie Martin', role: 'agent', statut: 'actif' },
    { id: 3, email: 'chauffeur@greencollect.com', nom: 'Pierre Durand', role: 'chauffeur', statut: 'actif' },
  ])
  const [showModal, setShowModal] = useState(false)

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800'
      case 'agent':
        return 'bg-blue-100 text-blue-800'
      case 'chauffeur':
        return 'bg-orange-100 text-orange-800'
      case 'citoyen':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Utilisateurs</h1>
          <p className="text-gray-600">Gérez les accès et rôles des utilisateurs</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter utilisateur
        </Button>
      </div>

      {/* Tableau */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nom</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Rôle</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-semibold text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 text-gray-600">{user.nom}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge>{user.statut}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Shield className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <Modal title="Ajouter un utilisateur" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <input type="email" placeholder="Email" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            <input type="text" placeholder="Nom" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option>Sélectionner un rôle</option>
              <option>citoyen</option>
              <option>agent</option>
              <option>chauffeur</option>
            </select>
            <div className="flex gap-2 pt-4">
              <Button variant="primary" className="flex-1">Ajouter</Button>
              <Button variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>Annuler</Button>
            </div>
          </div>
        </Modal>
      )}
    </motion.div>
  )
}
