// backend/src/routes/collectes.js
const express = require('express');
const router = express.Router();
const collecteController = require('../controllers/collecteController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Toutes les routes nécessitent authentification
router.use(verifyToken);

// Routes agent
router.get('/mes-collectes', checkRole(['agent']), collecteController.getMyCollectes);
router.put('/:id/demarrer', checkRole(['agent']), collecteController.demarrerCollecte);
router.put('/:id/terminer', checkRole(['agent']), collecteController.terminerCollecte);

// Routes agent & admin (lecture)
router.get('/', checkRole(['agent', 'administrateur']), collecteController.getAllCollectes);
router.get('/:id', checkRole(['agent', 'administrateur']), collecteController.getCollecteById);

// Routes admin uniquement
router.post('/planifier', checkRole(['administrateur']), collecteController.planifierCollecte);
router.put('/:id/annuler', checkRole(['administrateur']), collecteController.annulerCollecte);

module.exports = router;