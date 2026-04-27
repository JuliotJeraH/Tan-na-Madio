// =============================================================
//  config/db.js — Connexion PostgreSQL + PostGIS
//  Tanàna Madio
// =============================================================

const { Pool } = require('pg');

// Pool de connexions — réutilise les connexions existantes
// au lieu d'en créer une nouvelle par requête
const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'tananamadio',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',

  // Taille du pool : min connexions actives, max simultanées
  min: 2,
  max: 10,

  // Timeout si aucune connexion disponible dans le pool (30s)
  connectionTimeoutMillis: 30000,

  // Ferme les connexions inactives après 10 minutes
  idleTimeoutMillis: 600000,

  // SSL en production uniquement
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: true }
    : false,
});

// Vérification de la connexion au démarrage
pool.on('connect', (client) => {
  // Active PostGIS pour chaque nouvelle connexion du pool
  client.query("SET search_path TO public;");
});

pool.on('error', (err) => {
  console.error('[DB] Erreur inattendue sur le pool :', err.message);
  process.exit(1);
});

// =============================================================
//  Fonctions utilitaires
// =============================================================

/**
 * Exécute une requête SQL simple
 * @param {string} text   - Requête SQL avec paramètres ($1, $2…)
 * @param {Array}  params - Valeurs des paramètres
 * @returns {Promise<QueryResult>}
 */
const query = (text, params) => pool.query(text, params);

/**
 * Obtient un client dédié pour les transactions
 * TOUJOURS utiliser try/finally pour libérer le client
 *
 * @example
 * const client = await getClient();
 * try {
 *   await client.query('BEGIN');
 *   await client.query('INSERT INTO ...');
 *   await client.query('COMMIT');
 * } catch (e) {
 *   await client.query('ROLLBACK');
 *   throw e;
 * } finally {
 *   client.release();
 * }
 */
const getClient = () => pool.connect();

/**
 * Exécute un bloc de requêtes dans une transaction atomique
 * @param {Function} callback - Fonction async recevant le client
 * @returns {Promise<*>} Résultat du callback
 */
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

/**
 * Vérifie que la connexion à la base de données fonctionne
 * Appelé au démarrage du serveur
 */
const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW() AS heure, PostGIS_Version() AS postgis');
    console.log(`[DB] Connecté à PostgreSQL — ${res.rows[0].heure}`);
    console.log(`[DB] PostGIS version : ${res.rows[0].postgis}`);
    return true;
  } catch (err) {
    console.error('[DB] Impossible de se connecter :', err.message);
    throw err;
  }
};

module.exports = {
  query,
  getClient,
  transaction,
  testConnection,
  pool,
};
