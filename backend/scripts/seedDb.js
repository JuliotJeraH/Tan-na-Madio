// backend/scripts/setupDb.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'tananamadio',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function setupDatabase() {
  console.log('🚀 Initialisation de la base de données...');
  
  try {
    // Lire le fichier schema.sql
    const schemaPath = path.join(__dirname, '../src/config/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Exécuter le schéma
    await pool.query(schema);
    console.log('✅ Tables créées avec succès');
    
    // Vérifier que PostGIS est activé
    const postgisCheck = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'postgis'
      ) as installed
    `);
    
    if (postgisCheck.rows[0].installed) {
      console.log('✅ PostGIS est activé');
    } else {
      console.log('⚠️ Attention: PostGIS n\'est pas installé');
    }
    
    // Créer un admin par défaut si besoin
    const adminCheck = await pool.query(`
      SELECT id FROM utilisateurs WHERE email = 'admin@tananamadio.mg'
    `);
    
    if (adminCheck.rows.length === 0) {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await pool.query(`
        INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role)
        VALUES ('Système', 'Admin', 'admin@tananamadio.mg', $1, 'administrateur')
      `, [hashedPassword]);
      
      await pool.query(`
        INSERT INTO administrateurs (id, niveau)
        SELECT id, 3 FROM utilisateurs WHERE email = 'admin@tananamadio.mg'
      `);
      
      console.log('✅ Admin par défaut créé');
      console.log('📧 Email: admin@tananamadio.mg');
      console.log('🔑 Mot de passe: admin123');
    }
    
    console.log('\n🎉 Base de données prête !');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

setupDatabase();