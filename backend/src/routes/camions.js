// backend/src/routes/camions.js
const express = require('express');
const router = express.Router();
const camionController = require('../controllers/camionController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Toutes les routes nécessitent authentification
router.use(verifyToken);

// Routes accessibles aux admins et agents (lecture)
router.get('/', checkRole(['administrateur', 'agent']), camionController.getAllCamions);
router.get('/disponibles', checkRole(['administrateur', 'agent']), camionController.getCamionsDisponibles);

// Routes admin uniquement (écriture)
router.post('/', checkRole(['administrateur']), camionController.createCamion);
router.put('/:id', checkRole(['administrateur']), camionController.updateCamion);
router.delete('/:id', checkRole(['administrateur']), camionController.deleteCamion);

module.exports = router;