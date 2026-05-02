import React from 'react'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

const getMarkerColor = (urgence) => {
  switch (urgence) {
    case 'critique': return '#ef4444' // Rouge
    case 'eleve': return '#f97316'    // Orange
    case 'moyen': return '#eab308'    // Jaune
    case 'faible': return '#22c55e'   // Vert
    default: return '#6b7280'         // Gris
  }
}

const getMarkerIcon = (urgence) => {
  const color = getMarkerColor(urgence)
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        cursor: pointer;
        transition: transform 0.2s;
      ">
        🗑️
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  })
}

const MarqueurSignalement = ({ signalement, onClick }) => {
  const lat = signalement.localisation?.coordinates?.[1] || signalement.latitude
  const lng = signalement.localisation?.coordinates?.[0] || signalement.longitude
  
  if (!lat || !lng) return null

  const getStatusLabel = (statut) => {
    const labels = {
      en_attente: 'En attente',
      valide: 'Validé',
      en_cours: 'En cours',
      collecte: 'Collecté',
      rejete: 'Rejeté',
    }
    return labels[statut] || statut
  }

  return (
    <Marker
      position={[lat, lng]}
      icon={getMarkerIcon(signalement.urgence)}
      eventHandlers={{ click: () => onClick?.(signalement) }}
    >
      <Popup>
        <div className="text-sm max-w-xs p-1">
          <p className="font-semibold text-accent-900 mb-1">
            {signalement.description?.substring(0, 60) || 'Signalement'}
          </p>
          <p className="text-xs text-accent-500 mb-2">{signalement.adresse || 'Adresse non spécifiée'}</p>
          <div className="flex gap-2 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full bg-${getMarkerColor(signalement.urgence)}/20 text-${signalement.urgence === 'critique' ? 'red' : signalement.urgence === 'eleve' ? 'orange' : signalement.urgence === 'moyen' ? 'yellow' : 'green'}-700`}>
              {signalement.urgence}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent-100 text-accent-600">
              {getStatusLabel(signalement.statut)}
            </span>
          </div>
          <p className="text-xs text-accent-400">
            {new Date(signalement.created_at).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </Popup>
    </Marker>
  )
}

export default MarqueurSignalement