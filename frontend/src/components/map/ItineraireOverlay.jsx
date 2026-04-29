import { Polyline, Popup } from 'react-leaflet'

export default function ItineraireOverlay({ route, camion }) {
  if (!route || !route.coordinates) return null

  return (
    <Polyline
      positions={route.coordinates.map(coord => [coord.lat, coord.lng])}
      color="#22c55e"
      weight={3}
      opacity={0.7}
      dashArray="5, 5"
    >
      <Popup>
        <div className="text-sm">
          <p className="font-semibold">{camion?.immatriculation}</p>
          <p className="text-gray-600">{route.distance}km</p>
          <p className="text-gray-600">{route.duration}</p>
        </div>
      </Popup>
    </Polyline>
  )
}
