// backend/src/algorithms/glouton.js

/**
 * Algorithme glouton (Greedy) pour le calcul d'itinéraire
 * Plus rapide que Dijkstra mais moins optimal
 */

/**
 * Calcule la distance entre deux points
 */
function distance(point1, point2) {
  const R = 6371000;
  const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
  const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Algorithme glouton pour le voyageur de commerce
 * À chaque étape, va vers le point non visité le plus proche
 */
function greedyTSP(points, startPointId = null) {
  if (!points || points.length === 0) {
    return { itinerary: [], totalDistance: 0 };
  }
  
  let remaining = [...points];
  let startIndex = 0;
  
  if (startPointId) {
    startIndex = remaining.findIndex(p => p.id === startPointId);
    if (startIndex !== -1) {
      const start = remaining[startIndex];
      remaining.splice(startIndex, 1);
      remaining.unshift(start);
    }
  }
  
  const order = [remaining[0]];
  const visited = new Set([remaining[0].id]);
  let totalDistance = 0;
  let current = remaining[0];
  
  remaining.shift();
  
  while (remaining.length > 0) {
    let nearestIndex = 0;
    let nearestDist = distance(current, remaining[0]);
    
    for (let i = 1; i < remaining.length; i++) {
      const dist = distance(current, remaining[i]);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIndex = i;
      }
    }
    
    totalDistance += nearestDist;
    current = remaining[nearestIndex];
    order.push(current);
    remaining.splice(nearestIndex, 1);
  }
  
  // Retour au point de départ
  if (order.length > 1) {
    const returnDist = distance(current, order[0]);
    totalDistance += returnDist;
  }
  
  const itinerary = order.map((point, idx) => ({
    id: point.id,
    longitude: point.longitude,
    latitude: point.latitude,
    order: idx + 1
  }));
  
  return {
    itinerary,
    totalDistance: Math.round(totalDistance),
    totalDistanceKm: (totalDistance / 1000).toFixed(2),
    algorithm: 'greedy'
  };
}

/**
 * Regroupement par zones (clustering)
 * Pour optimiser les tournées par zone géographique
 */
function clusterByZone(points, maxPointsPerCluster = 10) {
  if (points.length <= maxPointsPerCluster) {
    return [points];
  }
  
  // Simplification : clustering par grille approximative
  const clusters = [];
  const sortedByLat = [...points].sort((a, b) => a.latitude - b.latitude);
  
  for (let i = 0; i < sortedByLat.length; i += maxPointsPerCluster) {
    clusters.push(sortedByLat.slice(i, i + maxPointsPerCluster));
  }
  
  return clusters;
}

module.exports = {
  greedyTSP,
  distance,
  clusterByZone
};