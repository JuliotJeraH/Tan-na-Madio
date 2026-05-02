import React from 'react'
import { Polygon, Popup } from 'react-leaflet'

const ZoneOverlay = ({ zone, isSelected = false, onClick }) => {
  if (!zone || !zone.geometrie || !zone.geometrie.coordinates) {
    return null
  }

  // Extraire les coordonnées du polygone
  let coordinates = zone.geometrie.coordinates
  
  // Si c'est un polygone GeoJSON standard
  if (coordinates[0] && Array.isArray(coordinates[0])) {
    coordinates = coordinates[0]
  }
  
  // Convertir au format Leaflet [lat, lng]
  const positions = coordinates.map(coord => [coord[1], coord[0]])

  const fillColor = isSelected ? '#86efac' : '#e2e8f0'
  const borderColor = isSelected ? '#22c55e' : '#94a3b8'

  return (
    <Polygon
      positions={positions}
      color={borderColor}
      fillColor={fillColor}
      fillOpacity={0.3}
      weight={isSelected ? 3 : 1.5}
      smoothFactor={1}
      eventHandlers={{ click: () => onClick?.(zone) }}
    >
      <Popup>
        <div className="text-sm min-w-[160px]">
          <p className="font-semibold text-accent-900">{zone.nom}</p>
          <p className="text-xs text-accent-500 mt-1">{zone.description || 'Aucune description'}</p>
          <div className="mt-2 pt-2 border-t border-accent-200">
            <p className="text-xs text-accent-600">
              🗑️ Signalements: {zone.signalements_count || 0}
            </p>
            <p className="text-xs text-accent-600">
              📅 Collecte: Tous les {zone.frequence_collecte_jours || 7} jours
            </p>
          </div>
        </div>
      </Popup>
    </Polygon>
  )
}

export default ZoneOverlay