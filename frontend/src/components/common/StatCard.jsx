import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'primary', 
  change, 
  changeType = 'up',
  className = '' 
}) => {
  const colorClasses = {
    primary: 'bg-primary-50 border-primary-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    danger: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
  }

  const iconColorClasses = {
    primary: 'text-primary-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    info: 'text-blue-600',
    purple: 'text-purple-600',
  }

  return (
    <div className={`bg-white rounded-xl border ${colorClasses[color]} p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-accent-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-accent-900">{value}</p>
          
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {changeType === 'up' ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{change}</span>
            </div>
          )}
        </div>
        
        {Icon && (
          <div className={`p-3 rounded-xl ${colorClasses[color]} bg-opacity-50`}>
            <Icon className={`w-6 h-6 ${iconColorClasses[color]}`} />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard