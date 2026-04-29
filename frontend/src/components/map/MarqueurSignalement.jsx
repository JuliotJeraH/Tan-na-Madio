import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

const getMarkerColor = (status) => {
  switch (status) {
    case 'nouveau':
      return '#ef4444'
    case 'en_traitement':
      return '#f97316'
    case 'resolu':
      return '#22c55e'
    default:
      return '#6b7280'
  }
}

export default function MarqueurSignalement({ signalement, onClick }) {
  const icon = L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${getMarkerColor(signalement.status)};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      ">
        📍
      </div>
    `,
  })

  return (
    <Marker
      position={[signalement.latitude, signalement.longitude]}
      icon={icon}
      eventHandlers={{ click: onClick }}
    >
      <Popup>
        <div className="text-sm max-w-xs">
          <p className="font-semibold">{signalement.type}</p>
          <p className="text-gray-600">{signalement.description}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(signalement.date_creation).toLocaleDateString('fr-FR')}
          </p>
          <div className="mt-2">
            <span className={`px-2 py-1 rounded text-white text-xs font-semibold
              ${signalement.status === 'nouveau' ? 'bg-red-500' : ''}
              ${signalement.status === 'en_traitement' ? 'bg-orange-500' : ''}
              ${signalement.status === 'resolu' ? 'bg-green-500' : ''}
            `}>
              {signalement.status}
            </span>
          </div>
        </div>
      </Popup>
    </Marker>
  )
}
