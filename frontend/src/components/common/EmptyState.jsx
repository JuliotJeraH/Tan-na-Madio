import React from 'react'
import { Inbox } from 'lucide-react'

const EmptyState = ({ icon: Icon = Inbox, title = 'Aucun résultat', message = 'Aucune donnée à afficher' }) => (
  <div className="flex flex-col items-center justify-center py-12 gap-3">
    <Icon className="w-12 h-12 text-accent-300" />
    <p className="text-lg font-medium text-accent-700">{title}</p>
    <p className="text-sm text-accent-500">{message}</p>
  </div>
)

export default EmptyState
