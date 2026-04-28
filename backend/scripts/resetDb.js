// backend/scripts/resetDb.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'tananamadio',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function resetDatabase() {
  console.log('⚠️  ATTENTION: Cela va SUPPRIMER toutes les données !');
  console.log('🔴 Tapez "CONFIRMER" pour continuer:');
  
  // Simple confirmation (si exécuté en ligne de commande)
  process.stdin.on('data', async (data) => {
    const input = data.toString().trim();
    if (input === 'CONFIRMER') {
      console.log('🔄 Suppression et recréation de la base...');
      
      try {
        // Supprimer toutes les tables
        await pool.query(`
          DROP SCHEMA public CASCADE;
          CREATE SCHEMA public;
          GRANT ALL ON SCHEMA public TO public;
        `);
        
        console.log('✅ Base nettoyée');
        
        // Réexécuter setup
        require('./setupDb');
        
        process.stdin.pause();
      } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
      }
    } else {
      console.log('❌ Annulé. Redémarrez avec la confirmation exacte "CONFIRMER"');
      process.exit(0);
    }
  });
}

resetDatabase();