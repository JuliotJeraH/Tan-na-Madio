/**
 * Format date to French locale
 */
export const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format date and time to French locale
 */
export const formatDateTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Get status color for display
 */
export const getStatusColor = (status) => {
  const colors = {
    pending: 'warning',
    in_progress: 'info',
    completed: 'success',
    rejected: 'danger',
    approved: 'success',
  }
  return colors[status] || 'default'
}

/**
 * Get status label in French
 */
export const getStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    in_progress: 'En cours',
    completed: 'Complété',
    rejected: 'Rejeté',
    approved: 'Approuvé',
  }
  return labels[status] || status
}

/**
 * Calculate distance between two coordinates (in km)
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return (R * c).toFixed(2)
}

/**
 * Validate email
 */
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Truncate text
 */
export const truncate = (text, length = 50) => {
  if (!text) return ''
  return text.length > length ? `${text.substring(0, length)}...` : text
}

/**
 * Merge classnames
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}
