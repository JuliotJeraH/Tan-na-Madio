// backend/src/models/Collecte.js
const { query, transaction } = require('../config/db');

class Collecte {
  static async findAll(filters = {}) {
    const { statut, zone_id, debut, fin, limit = 100, offset = 0 } = filters;
    let sql = `
      SELECT c.*,
             z.nom as zone_nom,
             cam.immatriculation as camion_immatriculation,
             u.nom as agent_nom, u.prenom as agent_prenom,
             COUNT(cs.signalement_id) as signalements_count
      FROM collectes c
      LEFT JOIN zones z ON z.id = c.zone_id
      LEFT JOIN camions cam ON cam.id = c.camion_id
      LEFT JOIN utilisateurs u ON u.id = c.agent_id
      LEFT JOIN collecte_signalements cs ON cs.collecte_id = c.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (statut) {
      sql += ` AND c.statut = $${paramCount++}`;
      params.push(statut);
    }
    if (zone_id) {
      sql += ` AND c.zone_id = $${paramCount++}`;
      params.push(zone_id);
    }
    if (debut) {
      sql += ` AND c.date_planifiee >= $${paramCount++}`;
      params.push(debut);
    }
    if (fin) {
      sql += ` AND c.date_planifiee <= $${paramCount++}`;
      params.push(fin);
    }

    sql += ` GROUP BY c.id, z.nom, cam.immatriculation, u.nom, u.prenom
             ORDER BY c.date_planifiee DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await query(`
      SELECT c.*,
             z.nom as zone_nom, z.geometrie as zone_geometrie,
             cam.immatriculation as camion_immatriculation, cam.capacite_kg,
             u.nom as agent_nom, u.prenom as agent_prenom, u.email as agent_email,
             (SELECT json_agg(json_build_object(
               'id', s.id,
               'description', s.description,
               'localisation', json_build_object('longitude', ST_X(s.localisation::geometry), 'latitude', ST_Y(s.localisation::geometry)),
               'ordre', cs.ordre
             )) FROM collecte_signalements cs
               LEFT JOIN signalements s ON s.id = cs.signalement_id
             WHERE cs.collecte_id = c.id
             ORDER BY cs.ordre) as signalements
      FROM collectes c
      LEFT JOIN zones z ON z.id = c.zone_id
      LEFT JOIN camions cam ON cam.id = c.camion_id
      LEFT JOIN utilisateurs u ON u.id = c.agent_id
      WHERE c.id = $1
    `, [id]);
    return result.rows[0];
  }

  static async findByAgent(agentId, limit = 50) {
    const result = await query(`
      SELECT c.*, z.nom as zone_nom, cam.immatriculation as camion_immatriculation
      FROM collectes c
      LEFT JOIN zones z ON z.id = c.zone_id
      LEFT JOIN camions cam ON cam.id = c.camion_id
      WHERE c.agent_id = $1
      ORDER BY c.date_planifiee DESC
      LIMIT $2
    `, [agentId, limit]);
    return result.rows;
  }

  static async create({ camion_id, agent_id, zone_id, date_planifiee, signalement_ids = [] }) {
    return await transaction(async (client) => {
      // Créer la collecte
      const result = await client.query(`
        INSERT INTO collectes (camion_id, agent_id, zone_id, date_planifiee, statut)
        VALUES ($1, $2, $3, $4, 'planifiee')
        RETURNING *
      `, [camion_id, agent_id, zone_id, date_planifiee]);

      const collecte = result.rows[0];

      // Ajouter les signalements associés
      for (let i = 0; i < signalement_ids.length; i++) {
        await client.query(`
          INSERT INTO collecte_signalements (collecte_id, signalement_id, ordre)
          VALUES ($1, $2, $3)
        `, [collecte.id, signalement_ids[i], i + 1]);

        // Mettre à jour le statut des signalements
        await client.query(`
          UPDATE signalements SET statut = 'en_cours', updated_at = NOW()
          WHERE id = $1
        `, [signalement_ids[i]]);
      }

      return collecte;
    });
  }

  static async demarrer(id) {
    const result = await query(`
      UPDATE collectes
      SET statut = 'en_cours', date_debut = NOW(), updated_at = NOW()
      WHERE id = $1 AND statut = 'planifiee'
      RETURNING *
    `, [id]);
    return result.rows[0];
  }

  static async terminer(id, { poids_collecte_kg, distance_km, notes }) {
    return await transaction(async (client) => {
      // Terminer la collecte
      const result = await client.query(`
        UPDATE collectes
        SET statut = 'terminee',
            date_fin = NOW(),
            poids_collecte_kg = COALESCE($1, poids_collecte_kg),
            distance_km = COALESCE($2, distance_km),
            notes = COALESCE($3, notes),
            updated_at = NOW()
        WHERE id = $4
        RETURNING *
      `, [poids_collecte_kg, distance_km, notes, id]);

      const collecte = result.rows[0];

      // Mettre à jour les signalements associés
      await client.query(`
        UPDATE signalements
        SET statut = 'collecte',
            date_traitement = NOW(),
            updated_at = NOW()
        WHERE id IN (
          SELECT signalement_id FROM collecte_signalements WHERE collecte_id = $1
        )
      `, [id]);

      // Compter le nombre de signalements traités
      const countResult = await client.query(`
        UPDATE collectes
        SET nb_signalements_traites = (
          SELECT COUNT(*) FROM collecte_signalements WHERE collecte_id = $1
        )
        WHERE id = $1
      `, [id]);

      return collecte;
    });
  }

  static async annuler(id) {
    const result = await query(`
      UPDATE collectes
      SET statut = 'annulee', updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [id]);
    return result.rows[0];
  }

  static async updateItineraire(id, itineraireJson) {
    const result = await query(`
      UPDATE collectes
      SET itineraire = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [itineraireJson, id]);
    return result.rows[0];
  }
}

module.exports = Collecte;