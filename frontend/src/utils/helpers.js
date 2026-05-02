export const getStatusColor = (status) => {
  const colors = {
    en_attente: 'warning',
    valide: 'info',
    en_cours: 'info',
    collecte: 'success',
    rejete: 'danger',
    planifiee: 'info',
    terminee: 'success',
    annulee: 'danger',
    disponible: 'success',
    en_tournee: 'info',
    en_maintenance: 'warning',
    hors_service: 'danger',
  }
  return colors[status] || 'default'
}

export const getStatusLabel = (status) => {
  const labels = {
    en_attente: 'En attente',
    valide: 'Validé',
    en_cours: 'En cours',
    collecte: 'Collecté',
    rejete: 'Rejeté',
    planifiee: 'Planifiée',
    terminee: 'Terminée',
    annulee: 'Annulée',
    disponible: 'Disponible',
    en_tournee: 'En tournée',
    en_maintenance: 'En maintenance',
    hors_service: 'Hors service',
  }
  return labels[status] || status
}

export const getUrgencyColor = (urgence) => {
  const colors = {
    faible: 'info',
    moyen: 'warning',
    eleve: 'danger',
    critique: 'danger',
  }
  return colors[urgence] || 'default'
}

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return (R * c).toFixed(2)
}