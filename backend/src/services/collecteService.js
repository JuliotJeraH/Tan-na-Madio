// backend/src/services/collecteService.js
const { query, transaction } = require('../config/db');
const { calculateOptimalRoute } = require('../algorithms/dijkstra');
const { greedyTSP } = require('../algorithms/glouton');

/**
 * Récupère les signalements en attente dans une zone
 */
async function getSignalementsEnAttente(zoneId, limit = 50) {
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
 * Récupère le centre de gravité d'une zone (point de départ)
 */
async function getZoneDepart(zoneId) {
  const result = await query(`
    SELECT 
      ST_X(ST_Centroid(geometrie::geometry)) as longitude,
      ST_Y(ST_Centroid(geometrie::geometry)) as latitude,
      nom
    FROM zones
    WHERE id = $1
  `, [zoneId]);
  
  return result.rows[0];
}

/**
 * Vérifie si un camion est disponible
 */
async function isCamionDisponible(camionId) {
  const result = await query(`
    SELECT id, statut FROM camions WHERE id = $1 AND statut = 'disponible'
  `, [camionId]);
  
  return result.rows.length > 0;
}

/**
 * Vérifie si un agent existe
 */
async function isAgentValide(agentId) {
  const result = await query(`
    SELECT id FROM utilisateurs WHERE id = $1 AND role = 'agent_municipal' AND actif = true
  `, [agentId]);
  
  return result.rows.length > 0;
}

/**
 * Planifier une collecte complète (avec itinéraire optimisé)
 */
async function planifierCollecteComplete(data) {
  const { zone_id, camion_id, agent_id, date_planifiee, signalement_ids = null } = data;
  
  return await transaction(async (client) => {
    // 1. Vérifier que le camion est disponible
    const camionDispo = await isCamionDisponible(camion_id);
    if (!camionDispo) {
      throw new Error('Camion non disponible');
    }
    
    // 2. Vérifier que l'agent existe
    const agentValide = await isAgentValide(agent_id);
    if (!agentValide) {
      throw new Error('Agent non trouvé ou inactif');
    }
    
    // 3. Récupérer les signalements à traiter
    let signalements;
    if (signalement_ids && signalement_ids.length > 0) {
      // Signalements spécifiques
      const result = await client.query(`
        SELECT 
          id,
          ST_X(localisation::geometry) as longitude,
          ST_Y(localisation::geometry) as latitude,
          urgence
        FROM signalements
        WHERE id = ANY($1::uuid[]) AND statut = 'en_attente'
      `, [signalement_ids]);
      signalements = result.rows;
      
      if (signalements.length !== signalement_ids.length) {
        throw new Error('Certains signalements n\'existent pas ou ne sont plus en attente');
      }
    } else {
      // Tous les signalements en attente de la zone
      signalements = await getSignalementsEnAttente(zone_id);
    }
    
    if (signalements.length === 0) {
      throw new Error('Aucun signalement à traiter dans cette zone');
    }
    
    // 4. Récupérer le point de départ (centre de la zone)
    const depart = await getZoneDepart(zone_id);
    if (!depart) {
      throw new Error('Zone non trouvée');
    }
    
    // 5. Construire les points pour l'algorithme
    const points = [
      {
        id: 'depart',
        longitude: parseFloat(depart.longitude),
        latitude: parseFloat(depart.latitude)
      },
      ...signalements.map(s => ({
        id: s.id,
        longitude: parseFloat(s.longitude),
        latitude: parseFloat(s.latitude),
        urgence: s.urgence,
        description: s.description
      }))
    ];
    
    // 6. Calculer l'itinéraire optimal (Dijkstra)
    const route = calculateOptimalRoute(points, 'depart');
    
    if (!route.itinerary || route.itinerary.length === 0) {
      throw new Error('Impossible de calculer un itinéraire');
    }
    
    // 7. Créer la collecte
    const collecte = await client.query(`
      INSERT INTO collectes (zone_id, camion_id, agent_id, date_planifiee, 
                             statut, itineraire, distance_km)
      VALUES ($1, $2, $3, $4, 'planifiee', $5, $6)
      RETURNING *
    `, [zone_id, camion_id, agent_id, date_planifiee, 
        JSON.stringify(route.itinerary), route.totalDistanceKm]);
    
    const collecteId = collecte.rows[0].id;
    
    // 8. Lier les signalements à la collecte et mettre à jour leur statut
    let ordre = 1;
    for (const point of route.itinerary) {
      if (point.id !== 'depart') {
        await client.query(`
          INSERT INTO collecte_signalements (collecte_id, signalement_id, ordre)
          VALUES ($1, $2, $3)
        `, [collecteId, point.id, ordre]);
        
        await client.query(`
          UPDATE signalements 
          SET statut = 'en_cours', updated_at = NOW()
          WHERE id = $1
        `, [point.id]);
        
        ordre++;
      }
    }
    
    // 9. Mettre à jour le statut du camion
    await client.query(`
      UPDATE camions SET statut = 'en_tournee', updated_at = NOW()
      WHERE id = $1
    `, [camion_id]);
    
    // 10. Retourner la collecte avec son itinéraire
    return {
      ...collecte.rows[0],
      itineraire: route.itinerary,
      distance_km: route.totalDistanceKm,
      nb_signalements: route.itinerary.filter(p => p.id !== 'depart').length
    };
  });
}

/**
 * Planifier une collecte avec algorithme glouton (plus rapide)
 */
async function planifierCollecteGlouton(data) {
  const { zone_id, camion_id, agent_id, date_planifiee } = data;
  
  return await transaction(async (client) => {
    // Vérifications
    const camionDispo = await isCamionDisponible(camion_id);
    if (!camionDispo) throw new Error('Camion non disponible');
    
    const agentValide = await isAgentValide(agent_id);
    if (!agentValide) throw new Error('Agent non trouvé');
    
    // Récupérer signalements
    const signalements = await getSignalementsEnAttente(zone_id);
    if (signalements.length === 0) throw new Error('Aucun signalement');
    
    // Récupérer point de départ
    const depart = await getZoneDepart(zone_id);
    
    // Points pour l'algorithme glouton
    const points = [
      {
        id: 'depart',
        longitude: parseFloat(depart.longitude),
        latitude: parseFloat(depart.latitude)
      },
      ...signalements.map(s => ({
        id: s.id,
        longitude: parseFloat(s.longitude),
        latitude: parseFloat(s.latitude)
      }))
    ];
    
    // Calcul glouton
    const route = greedyTSP(points, 'depart');
    
    // Créer collecte
    const collecte = await client.query(`
      INSERT INTO collectes (zone_id, camion_id, agent_id, date_planifiee, 
                             statut, itineraire, distance_km)
      VALUES ($1, $2, $3, $4, 'planifiee', $5, $6)
      RETURNING *
    `, [zone_id, camion_id, agent_id, date_planifiee, 
        JSON.stringify(route.itinerary), route.totalDistanceKm]);
    
    // Lier signalements
    for (let i = 0; i < route.itinerary.length; i++) {
      if (route.itinerary[i].id !== 'depart') {
        await client.query(`
          INSERT INTO collecte_signalements (collecte_id, signalement_id, ordre)
          VALUES ($1, $2, $3)
        `, [collecte.rows[0].id, route.itinerary[i].id, i + 1]);
        
        await client.query(`
          UPDATE signalements SET statut = 'en_cours', updated_at = NOW()
          WHERE id = $1
        `, [route.itinerary[i].id]);
      }
    }
    
    await client.query(`
      UPDATE camions SET statut = 'en_tournee', updated_at = NOW()
      WHERE id = $1
    `, [camion_id]);
    
    return collecte.rows[0];
  });
}

/**
 * Démarrer une collecte
 */
async function demarrerCollecte(collecteId, agentId) {
  return await transaction(async (client) => {
    // Vérifier que la collecte existe et est planifiée
    const collecte = await client.query(`
      SELECT * FROM collectes WHERE id = $1 AND statut = 'planifiee'
    `, [collecteId]);
    
    if (collecte.rows.length === 0) {
      throw new Error('Collecte non trouvée ou déjà démarrée');
    }
    
    // Vérifier que l'agent est bien assigné
    if (collecte.rows[0].agent_id !== agentId) {
      throw new Error('Vous n\'êtes pas assigné à cette collecte');
    }
    
    // Démarrer la collecte
    const result = await client.query(`
      UPDATE collectes 
      SET statut = 'en_cours', date_debut = NOW(), updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [collecteId]);
    
    return result.rows[0];
  });
}

/**
 * Terminer une collecte
 */
async function terminerCollecteComplete(collecteId, agentId, poids_kg, notes) {
  return await transaction(async (client) => {
    // Vérifier que la collecte est en cours
    const collecte = await client.query(`
      SELECT * FROM collectes WHERE id = $1 AND statut = 'en_cours'
    `, [collecteId]);
    
    if (collecte.rows.length === 0) {
      throw new Error('Collecte non trouvée ou non en cours');
    }
    
    // Vérifier l'agent
    if (collecte.rows[0].agent_id !== agentId) {
      throw new Error('Vous n\'êtes pas assigné à cette collecte');
    }
    
    // Terminer la collecte
    const result = await client.query(`
      UPDATE collectes 
      SET statut = 'terminee', 
          date_fin = NOW(),
          poids_collecte_kg = $1, 
          notes = $2, 
          updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `, [poids_kg, notes, collecteId]);
    
    // Marquer les signalements comme collectés
    await client.query(`
      UPDATE signalements
      SET statut = 'collecte', date_traitement = NOW(), updated_at = NOW()
      WHERE id IN (
        SELECT signalement_id FROM collecte_signalements WHERE collecte_id = $1
      )
    `, [collecteId]);
    
    // Mettre à jour le compteur de signalements traités
    await client.query(`
      UPDATE collectes
      SET nb_signalements_traites = (
        SELECT COUNT(*) FROM collecte_signalements WHERE collecte_id = $1
      )
      WHERE id = $1
    `, [collecteId]);
    
    // Remettre le camion disponible
    await client.query(`
      UPDATE camions SET statut = 'disponible', updated_at = NOW()
      WHERE id = $1
    `, [collecte.rows[0].camion_id]);
    
    return result.rows[0];
  });
}

/**
 * Annuler une collecte
 */
async function annulerCollecte(collecteId) {
  return await transaction(async (client) => {
    // Vérifier que la collecte existe et n'est pas terminée
    const collecte = await client.query(`
      SELECT * FROM collectes WHERE id = $1 AND statut != 'terminee'
    `, [collecteId]);
    
    if (collecte.rows.length === 0) {
      throw new Error('Collecte non trouvée ou déjà terminée');
    }
    
    // Annuler la collecte
    const result = await client.query(`
      UPDATE collectes 
      SET statut = 'annulee', updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [collecteId]);
    
    // Remettre les signalements en attente
    await client.query(`
      UPDATE signalements
      SET statut = 'en_attente', updated_at = NOW()
      WHERE id IN (
        SELECT signalement_id FROM collecte_signalements WHERE collecte_id = $1
      )
    `, [collecteId]);
    
    // Remettre le camion disponible
    await client.query(`
      UPDATE camions SET statut = 'disponible', updated_at = NOW()
      WHERE id = $1
    `, [collecte.rows[0].camion_id]);
    
    return result.rows[0];
  });
}

/**
 * Récupérer les détails d'une collecte avec son itinéraire
 */
async function getCollecteDetails(collecteId) {
  const result = await query(`
    SELECT 
      c.*,
      z.nom as zone_nom,
      cam.immatriculation as camion_immatriculation,
      cam.capacite_kg,
      u.nom as agent_nom,
      u.prenom as agent_prenom,
      (
        SELECT json_agg(
          json_build_object(
            'id', s.id,
            'description', s.description,
            'longitude', ST_X(s.localisation::geometry),
            'latitude', ST_Y(s.localisation::geometry),
            'ordre', cs.ordre,
            'statut', s.statut
          ) ORDER BY cs.ordre
        )
        FROM collecte_signalements cs
        LEFT JOIN signalements s ON s.id = cs.signalement_id
        WHERE cs.collecte_id = c.id
      ) as signalements
    FROM collectes c
    LEFT JOIN zones z ON z.id = c.zone_id
    LEFT JOIN camions cam ON cam.id = c.camion_id
    LEFT JOIN utilisateurs u ON u.id = c.agent_id
    WHERE c.id = $1
  `, [collecteId]);
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return result.rows[0];
}

/**
 * Récupérer les collectes d'un agent
 */
async function getCollectesByAgent(agentId, limit = 50, offset = 0) {
  const result = await query(`
    SELECT 
      c.id,
      c.zone_id,
      z.nom as zone_nom,
      c.date_planifiee,
      c.date_debut,
      c.date_fin,
      c.statut,
      c.distance_km,
      c.nb_signalements_traites,
      cam.immatriculation as camion_immatriculation
    FROM collectes c
    LEFT JOIN zones z ON z.id = c.zone_id
    LEFT JOIN camions cam ON cam.id = c.camion_id
    WHERE c.agent_id = $1
    ORDER BY c.date_planifiee DESC
    LIMIT $2 OFFSET $3
  `, [agentId, limit, offset]);
  
  return result.rows;
}

/**
 * Récupérer les statistiques des collectes par zone
 */
async function getStatsCollectesParZone(zoneId = null) {
  let queryText = `
    SELECT 
      z.id as zone_id,
      z.nom as zone_nom,
      COUNT(c.id) as total_collectes,
      COUNT(c.id) FILTER (WHERE c.statut = 'terminee') as collectes_terminees,
      COUNT(c.id) FILTER (WHERE c.statut = 'en_cours') as collectes_en_cours,
      COALESCE(AVG(c.distance_km), 0) as distance_moyenne_km,
      COALESCE(SUM(c.poids_collecte_kg), 0) as poids_total_kg,
      COALESCE(AVG(c.nb_signalements_traites), 0) as signalements_moyens_par_collecte
    FROM zones z
    LEFT JOIN collectes c ON c.zone_id = z.id
  `;
  
  const params = [];
  if (zoneId) {
    queryText += ` WHERE z.id = $1`;
    params.push(zoneId);
  }
  
  queryText += ` GROUP BY z.id, z.nom ORDER BY total_collectes DESC`;
  
  const result = await query(queryText, params);
  return result.rows;
}

module.exports = {
  // Fonctions principales
  planifierCollecteComplete,
  planifierCollecteGlouton,
  demarrerCollecte,
  terminerCollecteComplete,
  annulerCollecte,
  
  // Fonctions de lecture
  getCollecteDetails,
  getCollectesByAgent,
  getStatsCollectesParZone,
  
  // Fonctions utilitaires
  getSignalementsEnAttente,
  getZoneDepart,
  isCamionDisponible,
  isAgentValide
};