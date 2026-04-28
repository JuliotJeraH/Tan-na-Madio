// backend/src/models/Zone.js
const { query } = require('../config/db');

class Zone {
  static async findAll() {
    const result = await query(`
      SELECT z.*,
             COUNT(s.id) as signalements_count
      FROM zones z
      LEFT JOIN signalements s ON s.zone_id = z.id AND s.statut != 'rejete'
      GROUP BY z.id
      ORDER BY z.nom
    `);
    return result.rows;
  }

  static async findById(id) {
    const result = await query(`
      SELECT z.*,
             ST_AsGeoJSON(z.geometrie) as geometrie_geojson,
             COUNT(s.id) as signalements_count
      FROM zones z
      LEFT JOIN signalements s ON s.zone_id = z.id AND s.statut != 'rejete'
      WHERE z.id = $1
      GROUP BY z.id
    `, [id]);
    return result.rows[0];
  }

  static async findActive() {
    const result = await query(`
      SELECT * FROM zones WHERE actif = true ORDER BY nom
    `);
    return result.rows;
  }

  static async findByPoint(longitude, latitude) {
    const result = await query(`
      SELECT id, nom
      FROM zones
      WHERE ST_Within(
        ST_SetSRID(ST_MakePoint($1, $2), 4326),
        geometrie::geometry
      )
      AND actif = true
      LIMIT 1
    `, [longitude, latitude]);
    return result.rows[0];
  }

  static async create({ nom, description, geometrie_geojson, frequence_collecte_jours }) {
    const result = await query(`
      INSERT INTO zones (nom, description, geometrie, centroide, frequence_collecte_jours)
      VALUES ($1, $2, ST_SetSRID(ST_GeomFromGeoJSON($3), 4326),
              ST_Centroid(ST_SetSRID(ST_GeomFromGeoJSON($3), 4326)), $4)
      RETURNING *
    `, [nom, description, geometrie_geojson, frequence_collecte_jours || 7]);
    return result.rows[0];
  }

  static async update(id, data) {
    const { nom, description, geometrie_geojson, frequence_collecte_jours, actif } = data;
    let queryStr = `UPDATE zones SET updated_at = NOW()`;
    const params = [];
    let paramCount = 1;

    if (nom !== undefined) {
      queryStr += `, nom = $${paramCount++}`;
      params.push(nom);
    }
    if (description !== undefined) {
      queryStr += `, description = $${paramCount++}`;
      params.push(description);
    }
    if (geometrie_geojson !== undefined) {
      queryStr += `, geometrie = ST_SetSRID(ST_GeomFromGeoJSON($${paramCount++}), 4326)`;
      queryStr += `, centroide = ST_Centroid(ST_SetSRID(ST_GeomFromGeoJSON($${paramCount++}), 4326))`;
      params.push(geometrie_geojson, geometrie_geojson);
    }
    if (frequence_collecte_jours !== undefined) {
      queryStr += `, frequence_collecte_jours = $${paramCount++}`;
      params.push(frequence_collecte_jours);
    }
    if (actif !== undefined) {
      queryStr += `, actif = $${paramCount++}`;
      params.push(actif);
    }

    queryStr += ` WHERE id = $${paramCount} RETURNING *`;
    params.push(id);

    const result = await query(queryStr, params);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query(`DELETE FROM zones WHERE id = $1 RETURNING id`, [id]);
    return result.rows[0];
  }
}

module.exports = Zone;