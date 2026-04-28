module.exports = { buildGraph: () => ({}) };
// backend/src/services/grapheService.js
const { query } = require('../config/db');
const { calculateOptimalRoute } = require('../algorithms/dijkstra');

/**
 * Récupère les signalements à traiter dans une zone
 */
async function getSignalementsForZone(zoneId, limit = 50) {
  const result = await query(`
    SELECT 
      s.id,
      s.description,
      ST_X(s.localisation::geometry) as longitude,
      ST_Y(s.localisation::geometry) as latitude,
      s.urgence,
      s.created_at
    FROM signalements s
    WHERE s.zone_id = $1 AND s.statut = 'en_attente'
    ORDER BY 
      CASE s.urgence 
        WHEN 'critique' THEN 1
        WHEN 'eleve' THEN 2
        WHEN 'moyen' THEN 3
        WHEN 'faible' THEN 4
      END,
      s.created_at ASC
    LIMIT $2
  `, [zoneId, limit]);
  
  return result.rows;
}

/**
 * Récupère le centre de gravité d'une zone (départ de la tournée)
 */
async function getZoneCentroid(zoneId) {
  const result = await query(`
    SELECT 
      ST_X(ST_Centroid(geometrie::geometry)) as longitude,
      ST_Y(ST_Centroid(geometrie::geometry)) as latitude
    FROM zones
    WHERE id = $1
  `, [zoneId]);
  
  return result.rows[0];
}

/**
 * Calcule l'itinéraire optimal pour une collecte
 */
async function calculateCollecteItinerary(zoneId, signalementIds = null) {
  // Récupérer les signalements
  let signalements;
  if (signalementIds && signalementIds.length > 0) {
    const result = await query(`
      SELECT 
        id,
        ST_X(localisation::geometry) as longitude,
        ST_Y(localisation::geometry) as latitude,
        urgence
      FROM signalements
      WHERE id = ANY($1::uuid[])
    `, [signalementIds]);
    signalements = result.rows;
  } else {
    signalements = await getSignalementsForZone(zoneId);
  }
  
  if (signalements.length === 0) {
    return { error: 'Aucun signalement à traiter', itinerary: [], totalDistance: 0 };
  }
  
  // Récupérer le point de départ (centre de la zone)
  const centroid = await getZoneCentroid(zoneId);
  
  // Ajouter le point de départ à la liste
  const allPoints = [
    {
      id: 'start',
      longitude: parseFloat(centroid.longitude),
      latitude: parseFloat(centroid.latitude)
    },
    ...signalements.map(s => ({
      id: s.id,
      longitude: parseFloat(s.longitude),
      latitude: parseFloat(s.latitude),
      urgence: s.urgence
    }))
  ];
  
  // Calculer l'itinéraire
  const result = calculateOptimalRoute(allPoints, 'start');
  
  // Retirer le point de départ du résultat final
  result.itinerary = result.itinerary.filter(p => p.id !== 'start');
  
  return result;
}

/**
 * Sauvegarde l'itinéraire dans la collecte
 */
async function saveItineraryToCollecte(collecteId, itinerary, totalDistance) {
  const result = await query(`
    UPDATE collectes
    SET itineraire = $1, distance_km = $2, updated_at = NOW()
    WHERE id = $3
    RETURNING id
  `, [JSON.stringify(itinerary), totalDistance / 1000, collecteId]);
  
  return result.rows[0];
}

/**
 * Récupère le graphe routier (nœuds et arêtes) depuis PostgreSQL
 */
async function getRoadGraph() {
  const nodes = await query(`
    SELECT id, ST_X(position::geometry) as longitude, ST_Y(position::geometry) as latitude
    FROM noeuds_graphe
  `);
  
  const edges = await query(`
    SELECT noeud_source, noeud_dest, distance_m, temps_min
    FROM aretes_graphe
  `);
  
  return { nodes: nodes.rows, edges: edges.rows };
}

module.exports = {
  getSignalementsForZone,
  getZoneCentroid,
  calculateCollecteItinerary,
  saveItineraryToCollecte,
  getRoadGraph
};