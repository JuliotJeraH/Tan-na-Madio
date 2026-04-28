// backend/src/models/Camion.js
const { query } = require('../config/db');

class Camion {
  static async findAll() {
    const result = await query(`
      SELECT c.*, ch.nom as chauffeur_nom, ch.prenom as chauffeur_prenom
      FROM camions c
      LEFT JOIN chauffeurs ch ON ch.camion_id = c.id
      ORDER BY c.created_at DESC
    `);
    return result.rows;
  }

  static async findById(id) {
    const result = await query(`
      SELECT c.*, ch.nom as chauffeur_nom, ch.prenom as chauffeur_prenom
      FROM camions c
      LEFT JOIN chauffeurs ch ON ch.camion_id = c.id
      WHERE c.id = $1
    `, [id]);
    return result.rows[0];
  }

  static async findByStatut(statut) {
    const result = await query(`
      SELECT * FROM camions WHERE statut = $1
    `, [statut]);
    return result.rows;
  }

  static async findDisponibles() {
    return await this.findByStatut('disponible');
  }

  static async create({ immatriculation, modele, capacite_kg, chauffeur_id }) {
    const result = await query(`
      INSERT INTO camions (immatriculation, modele, capacite_kg, chauffeur_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [immatriculation, modele, capacite_kg, chauffeur_id]);
    return result.rows[0];
  }

  static async update(id, data) {
    const { immatriculation, modele, capacite_kg, statut, chauffeur_id } = data;
    const result = await query(`
      UPDATE camions
      SET immatriculation = COALESCE($1, immatriculation),
          modele = COALESCE($2, modele),
          capacite_kg = COALESCE($3, capacite_kg),
          statut = COALESCE($4, statut),
          chauffeur_id = COALESCE($5, chauffeur_id),
          updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `, [immatriculation, modele, capacite_kg, statut, chauffeur_id, id]);
    return result.rows[0];
  }

  static async updatePosition(id, longitude, latitude) {
    const result = await query(`
      UPDATE camions
      SET position_actuelle = ST_SetSRID(ST_MakePoint($1, $2), 4326),
          updated_at = NOW()
      WHERE id = $3
      RETURNING id, ST_X(position_actuelle::geometry) as longitude, ST_Y(position_actuelle::geometry) as latitude
    `, [longitude, latitude, id]);
    return result.rows[0];
  }

  static async updateStatut(id, statut) {
    const result = await query(`
      UPDATE camions SET statut = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [statut, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query(`DELETE FROM camions WHERE id = $1 RETURNING id`, [id]);
    return result.rows[0];
  }
}

module.exports = Camion;