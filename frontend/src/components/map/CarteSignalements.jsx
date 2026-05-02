import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const getMarkerColor = (urgence) => {
  switch (urgence) {
    case 'critique': return '#ef4444'
    case 'eleve': return '#f97316'
    case 'moyen': return '#eab308'
    case 'faible': return '#22c55e'
    default: return '#6b7280'
  }
}

const CarteSignalements = ({ signalements, center = [-18.8792, 47.5079], zoom = 12, onMarkerClick }) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '500px', width: '100%', borderRadius: '0.75rem' }}
      className="z-10"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      
      {signalements?.map((signalement) => {
        const lat = signalement.localisation?.coordinates?.[1] || signalement.latitude
        const lng = signalement.localisation?.coordinates?.[0] || signalement.longitude
        
        if (!lat || !lng) return null
        
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: ${getMarkerColor(signalement.urgence)}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">🗑️</div>`,
        })
        
        return (
          <Marker
            key={signalement.id}
            position={[lat, lng]}
            icon={customIcon}
            eventHandlers={{ click: () => onMarkerClick?.(signalement) }}
          >
            <Popup>
              <div className="p-2 max-w-xs">
                <p className="font-semibold text-accent-900">{signalement.description?.substring(0, 50)}</p>
                <p className="text-xs text-accent-500 mt-1">{signalement.adresse}</p>
                <div className="mt-2 flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full bg-${getMarkerColor(signalement.urgence)}/10 text-${getMarkerColor(signalement.urgence)}`}>
                    {signalement.urgence}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}

export default CarteSignalements