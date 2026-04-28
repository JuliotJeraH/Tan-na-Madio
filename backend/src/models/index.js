// backend/src/models/index.js
// Version PostgreSQL natif (sans Sequelize)

const User = require('./User');
const Camion = require('./Camion');
const Zone = require('./Zone');
const Signalement = require('./Signalement');
const Collecte = require('./Collecte');

module.exports = {
  User,
  Camion,
  Zone,
  Signalement,
  Collecte,
};