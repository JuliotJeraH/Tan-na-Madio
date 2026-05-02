import React from 'react'
import { Polyline, Popup } from 'react-leaflet'

const ItineraireOverlay = ({ route, camion, isVisible = true }) => {
  if (!isVisible || !route || !route.coordinates || route.coordinates.length === 0) {
    return null
  }

  // Convertir les coordonnées au format Leaflet [lat, lng]
  const positions = route.coordinates.map(coord => [coord.lat || coord[1], coord.lng || coord[0]])

  // Calculer la distance totale
  const totalDistance = route.distance_km || route.distance || 
    (route.coordinates.length * 0.5).toFixed(1)

  // Calculer le temps estimé
  const estimatedTime = route.temps_min || route.duration ||
    Math.round(totalDistance * 3) // 3 minutes par km en moyenne

  return (
    <Polyline
      positions={positions}
      color="#22c55e"
      weight={4}
      opacity={0.8}
      dashArray="8, 8"
      smoothFactor={1}
    >
      <Popup>
        <div className="text-sm min-w-[180px]">
          <p className="font-semibold text-accent-900 mb-2">
            {camion?.immatriculation || 'Itinéraire optimisé'}
          </p>
          <div className="space-y-1 text-accent-600">
            <p>📏 Distance: {totalDistance} km</p>
            <p>⏱️ Temps estimé: {estimatedTime} min</p>
            <p>📍 {route.coordinates.length} points</p>
          </div>
          <div className="mt-2 pt-2 border-t border-accent-200">
            <p className="text-xs text-green-600">✅ Chemin optimal (Dijkstra)</p>
          </div>
        </div>
      </Popup>
    </Polyline>
  )
}

export default ItineraireOverlay