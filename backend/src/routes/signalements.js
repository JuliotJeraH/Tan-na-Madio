// backend/src/routes/signalements.js
const express = require('express');
const router = express.Router();
const signalementController = require('../controllers/signalementController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Toutes les routes nécessitent authentification
router.use(verifyToken);

// Routes citoyen
router.post('/', checkRole(['citoyen', 'agent', 'administrateur']), signalementController.createSignalement);
router.get('/mes-signalements', checkRole(['citoyen']), signalementController.getMySignalements);

// Routes agent & admin
router.get('/', checkRole(['agent', 'administrateur']), signalementController.getAllSignalements);
router.get('/:id', checkRole(['agent', 'administrateur']), signalementController.getSignalementById);
router.put('/:id/statut', checkRole(['agent', 'administrateur']), signalementController.updateSignalementStatus);

// Routes admin uniquement
router.delete('/:id', checkRole(['administrateur']), signalementController.deleteSignalement);

module.exports = router;