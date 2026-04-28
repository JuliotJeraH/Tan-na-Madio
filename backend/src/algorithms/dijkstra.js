// backend/src/algorithms/dijkstra.js

/**
 * Implémentation de l'algorithme de Dijkstra pour le calcul d'itinéraire optimal
 * entre des points de collecte (signalements)
 */

class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  enqueue(node, priority) {
    this.heap.push({ node, priority });
    this.bubbleUp(this.heap.length - 1);
  }

  dequeue() {
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return min;
  }

  bubbleUp(index) {
    const element = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (element.priority >= parent.priority) break;
      this.heap[parentIndex] = element;
      this.heap[index] = parent;
      index = parentIndex;
    }
  }

  sinkDown(index) {
    const length = this.heap.length;
    const element = this.heap[index];
    
    while (true) {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      let swap = null;
      let leftChild, rightChild;

      if (leftChildIndex < length) {
        leftChild = this.heap[leftChildIndex];
        if (leftChild.priority < element.priority) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this.heap[rightChildIndex];
        if ((swap === null && rightChild.priority < element.priority) ||
            (swap !== null && rightChild.priority < leftChild.priority)) {
          swap = rightChildIndex;
        }
      }

      if (swap === null) break;
      this.heap[index] = this.heap[swap];
      this.heap[swap] = element;
      index = swap;
    }
  }

  isEmpty() {
    return this.heap.length === 0;
  }
}

/**
 * Calcule la distance entre deux points (formule de Haversine)
 * @param {number} lat1 - Latitude du point 1
 * @param {number} lon1 - Longitude du point 1
 * @param {number} lat2 - Latitude du point 2
 * @param {number} lon2 - Longitude du point 2
 * @returns {number} Distance en mètres
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Rayon de la Terre en mètres
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Construit le graphe des distances entre tous les points
 * @param {Array} points - Liste des points avec {id, latitude, longitude}
 * @returns {Object} Matrice des distances
 */
function buildDistanceGraph(points) {
  const n = points.length;
  const graph = {};
  
  for (let i = 0; i < n; i++) {
    graph[points[i].id] = {};
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        const distance = haversineDistance(
          points[i].latitude, points[i].longitude,
          points[j].latitude, points[j].longitude
        );
        graph[points[i].id][points[j].id] = distance;
      }
    }
  }
  
  return graph;
}

/**
 * Algorithme de Dijkstra pour trouver le chemin le plus court
 * @param {Object} graph - Graphe des distances
 * @param {string} start - ID du point de départ
 * @param {Array} targets - Liste des IDs des points à visiter
 * @returns {Object} Chemin optimal et distance totale
 */
function dijkstra(graph, start, targets) {
  const distances = {};
  const previous = {};
  const unvisited = new Set([start, ...targets]);
  
  // Initialisation
  for (const node of unvisited) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[start] = 0;
  
  const queue = new PriorityQueue();
  queue.enqueue(start, 0);
  
  while (!queue.isEmpty()) {
    const { node: current } = queue.dequeue();
    
    if (current !== start && targets.includes(current)) {
      // On a trouvé un chemin vers une cible
      continue;
    }
    
    for (const [neighbor, weight] of Object.entries(graph[current] || {})) {
      if (!unvisited.has(neighbor)) continue;
      
      const newDist = distances[current] + weight;
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        previous[neighbor] = current;
        queue.enqueue(neighbor, newDist);
      }
    }
  }
  
  return { distances, previous };
}

/**
 * Calcule l'itinéraire optimal visitant tous les points
 * @param {Array} points - Liste des points avec {id, latitude, longitude}
 * @param {string} startPointId - ID du point de départ (ex: dépôt)
 * @returns {Object} Itinéraire optimisé
 */
function calculateOptimalRoute(points, startPointId = null) {
  if (!points || points.length === 0) {
    return { itinerary: [], totalDistance: 0, error: 'Aucun point fourni' };
  }
  
  // Ajouter un point de départ par défaut si non spécifié
  let allPoints = [...points];
  let startId = startPointId;
  
  if (!startId) {
    // Utiliser le premier point comme départ
    startId = points[0].id;
  }
  
  // Construire le graphe
  const graph = buildDistanceGraph(allPoints);
  
  // Algorithme glouton pour le problème du voyageur de commerce
  const visited = new Set();
  const order = [startId];
  let current = startId;
  let totalDistance = 0;
  
  visited.add(startId);
  
  const remainingPoints = allPoints.filter(p => p.id !== startId);
  
  while (visited.size < allPoints.length) {
    let nearest = null;
    let nearestDist = Infinity;
    
    for (const point of remainingPoints) {
      if (!visited.has(point.id)) {
        const dist = graph[current][point.id];
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = point;
        }
      }
    }
    
    if (nearest) {
      order.push(nearest.id);
      totalDistance += nearestDist;
      visited.add(nearest.id);
      current = nearest.id;
    } else {
      break;
    }
  }
  
  // Créer l'itinéraire avec les détails
  const itinerary = order.map(id => {
    const point = allPoints.find(p => p.id === id);
    return {
      id: point.id,
      longitude: point.longitude,
      latitude: point.latitude,
      order: order.indexOf(id) + 1
    };
  });
  
  return {
    itinerary,
    totalDistance: Math.round(totalDistance),
    totalDistanceKm: (totalDistance / 1000).toFixed(2),
    numberOfPoints: order.length
  };
}

/**
 * Calcule l'itinéraire en utilisant un graphe routier (avec arêtes)
 * @param {Object} db - Connexion PostgreSQL
 * @param {string} startNodeId - ID du nœud de départ
 * @param {string} endNodeId - ID du nœud d'arrivée
 * @returns {Promise<Object>} Chemin avec les coordonnées
 */
async function calculateRouteWithRoadGraph(db, startNodeId, endNodeId) {
  // Requête PostgreSQL pour Dijkstra avec pgRouting ou fonction récursive
  const query = `
    WITH RECURSIVE dijkstra AS (
      SELECT 
        noeud_source as node,
        noeud_source as prev,
        0 as distance,
        ARRAY[noeud_source] as path
      FROM aretes_graphe
      WHERE noeud_source = $1
      
      UNION ALL
      
      SELECT 
        a.noeud_dest as node,
        a.noeud_source as prev,
        d.distance + a.distance_m as distance,
        d.path || a.noeud_dest as path
      FROM aretes_graphe a
      INNER JOIN dijkstra d ON d.node = a.noeud_source
      WHERE NOT a.noeud_dest = ANY(d.path)
    )
    SELECT node, distance, path
    FROM dijkstra
    WHERE node = $2
    ORDER BY distance
    LIMIT 1
  `;
  
  const result = await db.query(query, [startNodeId, endNodeId]);
  
  if (result.rows.length === 0) {
    return { error: 'Aucun chemin trouvé' };
  }
  
  // Récupérer les coordonnées des nœuds
  const nodesQuery = `
    SELECT id, ST_X(position::geometry) as longitude, ST_Y(position::geometry) as latitude
    FROM noeuds_graphe
    WHERE id = ANY($1::uuid[])
  `;
  
  const nodesResult = await db.query(nodesQuery, [result.rows[0].path]);
  
  return {
    path: result.rows[0].path,
    totalDistance: result.rows[0].distance,
    totalDistanceKm: (result.rows[0].distance / 1000).toFixed(2),
    coordinates: nodesResult.rows.map(row => ({
      id: row.id,
      longitude: parseFloat(row.longitude),
      latitude: parseFloat(row.latitude)
    }))
  };
}

module.exports = {
  calculateOptimalRoute,
  calculateRouteWithRoadGraph,
  haversineDistance,
  dijkstra,
  PriorityQueue
};