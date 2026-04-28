// backend/src/models/Signalement.js
const { query } = require('../config/db');

class Signalement {
  static async findAll(filters = {}) {
    const { statut, zone_id, debut, fin, limit = 100, offset = 0 } = filters;
    let sql = `
      SELECT s.*,
             ST_X(s.localisation::geometry) as longitude,
             ST_Y(s.localisation::geometry) as latitude,
             u.nom as citoyen_nom, u.prenom as citoyen_prenom, u.telephone as citoyen_telephone,
             z.nom as zone_nom
      FROM signalements s
      LEFT JOIN utilisateurs u ON u.id = s.citoyen_id
      LEFT JOIN zones z ON z.id = s.zone_id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (statut) {
      sql += ` AND s.statut = $${paramCount++}`;
      params.push(statut);
    }
    if (zone_id) {
      sql += ` AND s.zone_id = $${paramCount++}`;
      params.push(zone_id);
    }
    if (debut) {
      sql += ` AND s.created_at >= $${paramCount++}`;
      params.push(debut);
    }
    if (fin) {
      sql += ` AND s.created_at <= $${paramCount++}`;
      params.push(fin);
    }

    sql += ` ORDER BY s.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await query(`
      SELECT s.*,
             ST_X(s.localisation::geometry) as longitude,
             ST_Y(s.localisation::geometry) as latitude,
             u.nom as citoyen_nom, u.prenom as citoyen_prenom, u.email as citoyen_email, u.telephone as citoyen_telephone,
             z.nom as zone_nom
      FROM signalements s
      LEFT JOIN utilisateurs u ON u.id = s.citoyen_id
      LEFT JOIN zones z ON z.id = s.zone_id
      WHERE s.id = $1
    `, [id]);
    return result.rows[0];
  }

  static async findByCitoyen(citoyenId, limit = 50) {
    const result = await query(`
      SELECT s.*,
             ST_X(s.localisation::geometry) as longitude,
             ST_Y(s.localisation::geometry) as latitude,
             z.nom as zone_nom
      FROM signalements s
      LEFT JOIN zones z ON z.id = s.zone_id
      WHERE s.citoyen_id = $1
      ORDER BY s.created_at DESC
      LIMIT $2
    `, [citoyenId, limit]);
    return result.rows;
  }

  static async create({ citoyen_id, localisation_lng, localisation_lat, description, urgence, photo_url }) {
    const result = await query(`
      INSERT INTO signalements (citoyen_id, localisation, description, urgence, photo_url)
      VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4, $5, $6)
      RETURNING id, citoyen_id, zone_id, description, urgence, statut, photo_url, created_at,
                ST_X(localisation::geometry) as longitude, ST_Y(localisation::geometry) as latitude
    `, [citoyen_id, localisation_lng, localisation_lat, description, urgence || 'moyen', photo_url]);
    return result.rows[0];
  }

  static async updateStatus(id, statut, validePar = null) {
    const result = await query(`
      UPDATE signalements
      SET statut = $1,
          date_validation = CASE WHEN $1 = 'valide' OR $1 = 'traite' THEN NOW() ELSE date_validation END,
          valide_par = COALESCE($2, valide_par),
          updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `, [statut, validePar, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query(`DELETE FROM signalements WHERE id = $1 RETURNING id`, [id]);
    return result.rows[0];
  }

  static async getStatsByZone() {
    const result = await query(`
      SELECT * FROM statistiques_zones
    `);
    return result.rows;
  }

  static async getEvolution(jours = 30) {
    const result = await query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM signalements
      WHERE created_at >= NOW() - INTERVAL '1 day' * $1
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [jours]);
    return result.rows;
  }
}

module.exports = Signalement;