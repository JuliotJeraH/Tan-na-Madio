// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import des routes
const authRoutes = require('./src/routes/auth');
const camionRoutes = require('./src/routes/camions');
const zoneRoutes = require('./src/routes/zones');
const signalementRoutes = require('./src/routes/signalements');
const collecteRoutes = require('./src/routes/collectes');
const statsRoutes = require('./src/routes/stats');

// Import de la connexion DB
const { testConnection } = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== CONFIGURATION CORS CORRECTE ==========
const corsOptions = {
  origin: ['http://localhost:3001', 'http://localhost:5173', 'http://127.0.0.1:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// ========== Autres middlewares ==========
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }  // ← Ajouter ceci
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Dossier uploads (statique)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ========== Routes ==========
app.use('/api/auth', authRoutes);
app.use('/api/camions', camionRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/signalements', signalementRoutes);
app.use('/api/collectes', collecteRoutes);
app.use('/api/stats', statsRoutes);

// ========== Route d'accueil ==========
app.get('/', (req, res) => {
  res.json({
    name: 'Tanàna Madio API',
    version: '1.0.0',
    description: 'Système Numérique de Gestion des Déchets Urbains',
    endpoints: {
      auth: '/api/auth',
      camions: '/api/camions',
      zones: '/api/zones',
      signalements: '/api/signalements',
      collectes: '/api/collectes',
      stats: '/api/stats'
    }
  });
});

// ========== Route 404 ==========
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// ========== Middleware d'erreur global ==========
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ========== Démarrage du serveur ==========
const startServer = async () => {
  try {
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
      console.log(`📡 CORS autorisé pour: http://localhost:3001`);
    });
  } catch (error) {
    console.error('❌ Erreur au démarrage:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;