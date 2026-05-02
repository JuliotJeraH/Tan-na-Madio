#!/usr/bin/env node
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Connexion à PostgreSQL (sans base de données spécifique)
const adminPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: 'postgres',
});

async function resetDatabase() {
  const dbName = process.env.DB_NAME || 'tananamadio';
  let client;

  try {
    console.log('🔧 Réinitialisation de la base de données...\n');

    client = await adminPool.connect();

    // Terminer les connexions existantes
    console.log(`🛑 Fermeture des connexions existantes...`);
    await client.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = $1
      AND pid <> pg_backend_pid();
    `, [dbName]);

    // Supprimer la base
    console.log(`🗑️ Suppression de la base de données '${dbName}'...`);
    try {
      await client.query(`DROP DATABASE IF EXISTS ${dbName}`);
      console.log(`✅ Base de données supprimée\n`);
    } catch (dropError) {
      if (!dropError.message.includes('does not exist')) {
        throw dropError;
      }
    }

    client.release();

    // Créer une nouvelle base
    client = await adminPool.connect();
    console.log(`📦 Création de la base de données '${dbName}'...`);
    await client.query(`CREATE DATABASE ${dbName}`);
    console.log(`✅ Nouvelle base de données créée\n`);
    client.release();

    // Exécuter le schéma
    console.log('📋 Création des tables...');
    const pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: dbName,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
    });

    try {
      const schemaPath = path.join(__dirname, '../src/config/schema.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      
      // Diviser et exécuter les requêtes
      const statements = schemaSql.split(';').filter(s => s.trim().length > 0);
      
      for (const statement of statements) {
        try {
          await pool.query(statement + ';');
        } catch (err) {
          if (!err.message.includes('already exists')) {
            console.error('Erreur SQL:', err.message);
          }
        }
      }
      
      console.log('✅ Schéma créé avec succès\n');
    } catch (schemaError) {
      throw schemaError;
    }

    // Insérer les données de test
    console.log('🌱 Insertion des données initiales...');
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    try {
      await pool.query(`
        INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role, telephone)
        VALUES 
          ('Admin', 'Système', 'admin@tananamadio.mg', $1, 'administrateur', '0340000000'),
          ('Agent', 'Test', 'agent@tananamadio.mg', $1, 'agent_municipal', '0341111111'),
          ('Chauffeur', 'Test', 'chauffeur@tananamadio.mg', $1, 'chauffeur', '0342222222'),
          ('Citoyen', 'Test', 'citoyen@tananamadio.mg', $1, 'citoyen', '0343333333')
        ON CONFLICT DO NOTHING
      `, [hashedPassword]);
      
      console.log('✅ Utilisateurs de test créés\n');
    } catch (seedError) {
      console.warn('⚠️ Erreur lors de l\'insertion des données:', seedError.message);
    }

    await pool.end();

    console.log('✅ Base de données réinitialisée avec succès!');
    console.log('\n📝 Utilisateurs de test:');
    console.log('   Email: admin@tananamadio.mg | Mot de passe: password123 | Rôle: Admin');
    console.log('   Email: agent@tananamadio.mg | Mot de passe: password123 | Rôle: Agent');
    console.log('   Email: chauffeur@tananamadio.mg | Mot de passe: password123 | Rôle: Chauffeur');
    console.log('   Email: citoyen@tananamadio.mg | Mot de passe: password123 | Rôle: Citoyen\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error.message);
    process.exit(1);
  } finally {
    try {
      await adminPool.end();
    } catch (e) {
      // ignore
    }
  }
}

resetDatabase();