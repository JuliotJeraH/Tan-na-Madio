import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useCamions } from '../../hooks/useCamions'
import { Card, Button, Badge, LoadingState } from '../../components/common'
import { MapContainer, TileLayer } from 'react-leaflet'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Clock, Truck } from 'lucide-react'

export default function DetailTournee() {
  const { id } = useParams()
  const { loading } = useCamions()
  const [tournee, setTournee] = useState(null)

  useEffect(() => {
    // Mock data - remplacer par vraie API
    setTournee({
      id,
      immatriculation: 'AB-123-CD',
      marque: 'Iveco',
      modele: 'Ecolis',
      charge_actuelle: 4500,
      capacite: 6000,
      latitude: 48.8566,
      longitude: 2.3522,
      statut: 'en_tournee',
      collectes: [
        { id: 1, adresse: '123 Rue de la Paix', statut: 'collecte' },
        { id: 2, adresse: '456 Boulevard Saint-Germain', statut: 'collecte' },
        { id: 3, adresse: '789 Avenue des Champs', statut: 'en_attente' },
      ]
    })
  }, [id])

  if (loading || !tournee) return <LoadingState message="Chargement des détails..." />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <Button variant="ghost" size="sm" className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations camion */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{tournee.immatriculation}</h1>
                <p className="text-gray-600">{tournee.marque} {tournee.modele}</p>
              </div>
              <Badge>{tournee.statut}</Badge>
            </div>

            {/* Capacité */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Charge</h3>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">{tournee.charge_actuelle} kg / {tournee.capacite} kg</span>
                <span className="font-semibold">{Math.round((tournee.charge_actuelle / tournee.capacite) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${(tournee.charge_actuelle / tournee.capacite) * 100}%` }}
                />
              </div>
            </div>

            {/* Carte */}
            <div className="mb-6 bg-gray-100 rounded-lg overflow-hidden h-64">
              <MapContainer 
                center={[tournee.latitude, tournee.longitude]} 
                zoom={13} 
                className="h-full w-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap'
                />
              </MapContainer>
            </div>
          </Card>

          {/* Collectes */}
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Collectes prévues</h3>
            <div className="space-y-3">
              {tournee.collectes.map((collecte, idx) => (
                <div key={collecte.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-500 text-white">
                      {idx + 1}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-900">{collecte.adresse}</p>
                    <Badge>{collecte.statut}</Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MapPin className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card className="sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <Button variant="primary" className="w-full">
                <Clock className="w-4 h-4 mr-2" />
                Démarrer collecte
              </Button>
              <Button variant="secondary" className="w-full">
                <MapPin className="w-4 h-4 mr-2" />
                Itinéraire optimal
              </Button>
              <Button variant="secondary" className="w-full">
                <Truck className="w-4 h-4 mr-2" />
                Marquer comme complète
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
