// backend/src/routes/stats.js
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Toutes les routes nécessitent authentification et rôle admin
router.use(verifyToken);
router.use(checkRole(['administrateur']));

router.get('/dashboard', statsController.getDashboardStats);
router.get('/signalements/par-zone', statsController.getSignalementsStatsByZone);
router.get('/signalements/evolution', statsController.getSignalementsEvolution);
router.get('/agents/performance', statsController.getAgentsPerformance);
router.get('/camions/occupation', statsController.getCamionsOccupation);
router.get('/traitement-moyen', statsController.getTraitementMoyen);

module.exports = router;