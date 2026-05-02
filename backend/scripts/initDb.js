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
  database: 'postgres', // Se connecter à la base de données 'postgres' pour créer la nouvelle base
});

async function initDatabase() {
  const dbName = process.env.DB_NAME || 'tananamadio';
  let client;

  try {
    console.log('🔧 Initialisation de la base de données...\n');

    // 1. Créer la base de données
    console.log(`📦 Création de la base de données '${dbName}'...`);
    try {
      client = await adminPool.connect();
      
      // Vérifier si la base existe
      const result = await client.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        [dbName]
      );
      
      if (result.rows.length === 0) {
        await client.query(`CREATE DATABASE ${dbName}`);
        console.log(`✅ Base de données '${dbName}' créée\n`);
      } else {
        console.log(`⚠️ Base de données '${dbName}' existe déjà\n`);
      }
    } finally {
      if (client) client.release();
    }

    // 2. Exécuter le schéma
    console.log('📋 Exécution du schéma SQL...');
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
      
      // Exécuter le schéma
      await pool.query(schemaSql);
      console.log('✅ Schéma SQL exécuté avec succès\n');
    } catch (schemaError) {
      // Les erreurs liées aux types/extensions existantes sont ignorées
      if (schemaError.message.includes('already exists')) {
        console.log('ℹ️ Les objets de base de données existent déjà\n');
      } else {
        throw schemaError;
      }
    }

    // 3. Insérer les données de test
    console.log('🌱 Insertion des données de test...');
    try {
      const seedPath = path.join(__dirname, '../scripts/seedDb.js');
      require(seedPath);
    } catch (seedError) {
      console.warn('⚠️ Seed script error (peut être normal):', seedError.message);
    }

    console.log('✅ Base de données initialisée avec succès!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error.message);
    process.exit(1);
  } finally {
    await adminPool.end();
  }
}

initDatabase();
