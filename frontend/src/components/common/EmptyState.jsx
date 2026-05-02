import React from 'react'
import { Inbox } from 'lucide-react'

const EmptyState = ({ 
  icon: Icon = Inbox, 
  title = 'Aucune donnée', 
  message = 'Aucune information à afficher pour le moment',
  action,
  actionText 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-accent-400" />
      </div>
      <h3 className="text-lg font-semibold text-accent-900 mb-2">{title}</h3>
      <p className="text-accent-500 max-w-sm">{message}</p>
      {action && actionText && (
        <button
          onClick={action}
          className="mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}

export default EmptyState