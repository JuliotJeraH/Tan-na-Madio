import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Shield, UserCheck } from 'lucide-react'
import { userAPI } from '../../api/auth'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Spinner from '../../components/common/Spinner'
import Modal from '../../components/common/Modal'

const Utilisateurs = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await userAPI.list()
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
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

  const getRoleColor = (role) => {
    const colors = {
      citoyen: 'success',
      agent_municipal: 'info',
      chauffeur: 'warning',
      administrateur: 'danger',
    }
    return colors[role] || 'default'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-accent-900">Gestion des Utilisateurs</h1>
          <p className="text-accent-500 mt-1">Gérez les comptes et les accès</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un utilisateur
        </Button>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-accent-200 p-4 text-center">
          <p className="text-2xl font-bold text-primary-600">{users.length}</p>
          <p className="text-sm text-accent-500">Total</p>
        </div>
        <div className="bg-white rounded-xl border border-accent-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{users.filter(u => u.actif).length}</p>
          <p className="text-sm text-accent-500">Actifs</p>
        </div>
        <div className="bg-white rounded-xl border border-accent-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{users.filter(u => u.role === 'agent_municipal').length}</p>
          <p className="text-sm text-accent-500">Agents</p>
        </div>
        <div className="bg-white rounded-xl border border-accent-200 p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{users.filter(u => u.role === 'chauffeur').length}</p>
          <p className="text-sm text-accent-500">Chauffeurs</p>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl border border-accent-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent-50 border-b border-accent-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-accent-900">Nom</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-accent-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-accent-900">Rôle</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-accent-900">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-accent-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-accent-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-accent-900">{user.prenom} {user.nom}</td>
                  <td className="px-6 py-4 text-accent-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <Badge variant={getRoleColor(user.role)}>{getRoleLabel(user.role)}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.actif ? 'success' : 'danger'}>{user.actif ? 'Actif' : 'Inactif'}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-accent-100 rounded-lg transition-colors">
                        <Shield className="w-4 h-4 text-accent-500" />
                      </button>
                      <button className="p-1 hover:bg-accent-100 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4 text-accent-500" />
                      </button>
                      <button className="p-1 hover:bg-red-100 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ajout */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Ajouter un utilisateur">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-accent-700 mb-1">Nom</label>
            <input type="text" className="input-base" placeholder="Nom" />
          </div>
          <div>
            <label className="block text-sm font-medium text-accent-700 mb-1">Prénom</label>
            <input type="text" className="input-base" placeholder="Prénom" />
          </div>
          <div>
            <label className="block text-sm font-medium text-accent-700 mb-1">Email</label>
            <input type="email" className="input-base" placeholder="email@exemple.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-accent-700 mb-1">Rôle</label>
            <select className="input-base">
              <option value="citoyen">Citoyen</option>
              <option value="agent_municipal">Agent Municipal</option>
              <option value="chauffeur">Chauffeur</option>
              <option value="administrateur">Administrateur</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">Ajouter</Button>
            <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">Annuler</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Utilisateurs