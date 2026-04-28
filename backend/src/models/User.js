// backend/src/models/User.js
const { query } = require('../config/db');

class User {
  static async findAll() {
    const result = await query(`
      SELECT id, nom, prenom, email, role, telephone, actif, created_at
      FROM utilisateurs
      ORDER BY created_at DESC
    `);
    return result.rows;
  }

  static async findById(id) {
    const result = await query(`
      SELECT id, nom, prenom, email, role, telephone, actif, created_at
      FROM utilisateurs
      WHERE id = $1
    `, [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await query(`
      SELECT * FROM utilisateurs WHERE email = $1
    `, [email]);
    return result.rows[0];
  }

  static async findByRole(role) {
    const result = await query(`
      SELECT id, nom, prenom, email, telephone, actif, created_at
      FROM utilisateurs
      WHERE role = $1
    `, [role]);
    return result.rows;
  }

  static async create({ nom, prenom, email, mot_de_passe, role, telephone }) {
    const result = await query(`
      INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role, telephone)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, nom, prenom, email, role, telephone, actif, created_at
    `, [nom, prenom, email, mot_de_passe, role, telephone]);
    return result.rows[0];
  }

  static async update(id, data) {
    const { nom, prenom, email, role, telephone, actif } = data;
    const result = await query(`
      UPDATE utilisateurs
      SET nom = $1, prenom = $2, email = $3, role = $4, telephone = $5, actif = $6, updated_at = NOW()
      WHERE id = $7
      RETURNING id, nom, prenom, email, role, telephone, actif, created_at
    `, [nom, prenom, email, role, telephone, actif, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query(`DELETE FROM utilisateurs WHERE id = $1 RETURNING id`, [id]);
    return result.rows[0];
  }

  static async countByRole(role) {
    const result = await query(`SELECT COUNT(*) FROM utilisateurs WHERE role = $1`, [role]);
    return parseInt(result.rows[0].count);
  }
}

module.exports = User;