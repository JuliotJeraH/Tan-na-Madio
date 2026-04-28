// backend/src/config/app.js
module.exports = {
  // Configuration JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_key_change_me',
    expiresIn: '24h',
    refreshExpiresIn: '7d'
  },
  
  // Configuration upload
  upload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
    destination: './uploads/'
  },
  
  // Configuration pagination
  pagination: {
    defaultLimit: 20,
    maxLimit: 100
  },
  
  // Configuration Dijkstra
  dijkstra: {
    maxPoints: 50, // Nombre max de points à calculer
    timeoutMs: 5000 // Timeout du calcul
  }
};