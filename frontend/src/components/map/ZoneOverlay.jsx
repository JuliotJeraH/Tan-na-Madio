import { Polygon, Popup } from 'react-leaflet'

export default function ZoneOverlay({ zone, isSelected }) {
  const coordinates = zone.coordinates?.map(coord => [coord.lat, coord.lng]) || []

  return (
    <Polygon
      positions={coordinates}
      color={isSelected ? '#22c55e' : '#94a3b8'}
      fillColor={isSelected ? '#86efac' : '#e2e8f0'}
      fillOpacity={0.3}
      weight={isSelected ? 3 : 1}
    >
      <Popup>
        <div className="text-sm">
          <p className="font-semibold">{zone.nom}</p>
          <p className="text-gray-600">{zone.description}</p>
          <p className="text-xs text-gray-500 mt-1">
            Secteur: {zone.secteur}
          </p>
        </div>
      </Popup>
    </Polygon>
  )
}
