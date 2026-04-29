import React from 'react'
import { TrendingUp } from 'lucide-react'

const StatCard = ({
  title,
  value,
  icon: Icon,
  change,
  color = 'primary',
  className = '',
}) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-700 border-primary-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
  }

  return (
    <div className={`card p-6 ${colorClasses[color]} border-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-accent-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-accent-900">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              {change}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]} bg-opacity-50`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard
