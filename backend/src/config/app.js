// =============================================================
//  config/app.js — Configuration globale de l'application
//  Tanàna Madio
// =============================================================

require('dotenv').config();

const config = {
  // -----------------------------------------------------------
  //  Serveur
  // -----------------------------------------------------------
  server: {
    port:    parseInt(process.env.PORT) || 3000,
    env:     process.env.NODE_ENV || 'development',
    isProd:  process.env.NODE_ENV === 'production',
  },

  // -----------------------------------------------------------
  //  Base de données
  // -----------------------------------------------------------
  db: {
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT) || 5432,
    name:     process.env.DB_NAME     || 'tananamadio',
    user:     process.env.DB_USER     || 'postgres',
    password: process.env.DB_PASSWORD || '',
  },

  // -----------------------------------------------------------
  //  JWT — Authentification
  // -----------------------------------------------------------
  jwt: {
    secret:          process.env.JWT_SECRET        || 'changez_ce_secret_en_production',
    refreshSecret:   process.env.JWT_REFRESH_SECRET || 'changez_ce_refresh_secret',
    // Access token expire vite (sécurité)
    expiresIn:       process.env.JWT_EXPIRES_IN    || '15m',
    // Refresh token dure plus longtemps (confort utilisateur)
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
  },

  // -----------------------------------------------------------
  //  Upload de fichiers (photos de signalements)
  // -----------------------------------------------------------
  upload: {
    dir:        process.env.UPLOAD_DIR  || './uploads',
    maxSizeMb:  parseInt(process.env.UPLOAD_MAX_MB) || 5,
    // Types MIME autorisés
    mimeTypes:  ['image/jpeg', 'image/png', 'image/webp'],
  },

  // -----------------------------------------------------------
  //  CORS — Origines autorisées
  // -----------------------------------------------------------
  cors: {
    origins: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',')
      : ['http://localhost:3000', 'http://localhost:5173'],
  },

  // -----------------------------------------------------------
  //  Pagination par défaut
  // -----------------------------------------------------------
  pagination: {
    defaultLimit: 20,
    maxLimit:     100,
  },

  // -----------------------------------------------------------
  //  Algorithmes (Dijkstra / Glouton)
  // -----------------------------------------------------------
  algorithmes: {
    // Rayon de recherche des signalements proches d'un noeud (mètres)
    rayonRechercheM: parseInt(process.env.RAYON_RECHERCHE_M) || 500,
    // Capacité max par tournée (en kg)
    capaciteMaxKg:   parseInt(process.env.CAPACITE_MAX_KG)   || 5000,
  },
};

// Validation des variables critiques en production
if (config.server.isProd) {
  const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'DB_PASSWORD'];
  const missing  = required.filter(k => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(`[Config] Variables d'environnement manquantes : ${missing.join(', ')}`);
  }
}

module.exports = config;
