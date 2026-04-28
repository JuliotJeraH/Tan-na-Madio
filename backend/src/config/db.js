// backend/src/config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'tananamadio',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  min: 2,
  max: 10,
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 600000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false,
});

// Tester la connexion et activer PostGIS
pool.on('connect', async (client) => {
  await client.query('CREATE EXTENSION IF NOT EXISTS postgis;');
  console.log('[DB] Connecté à PostgreSQL avec PostGIS');
});

pool.on('error', (err) => {
  console.error('[DB] Erreur inattendue:', err.message);
});

// Fonctions utilitaires
const query = (text, params) => pool.query(text, params);
const getClient = () => pool.connect();

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

const testConnection = async () => {
  const res = await pool.query('SELECT NOW() as heure, PostGIS_Version() as postgis');
  console.log(`[DB] Connecté — ${res.rows[0].heure}`);
  console.log(`[DB] PostGIS: ${res.rows[0].postgis}`);
  return true;
};

module.exports = {
  pool,
  query,
  getClient,
  transaction,
  testConnection,
};