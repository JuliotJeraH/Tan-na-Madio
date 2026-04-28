// backend/src/routes/zones.js
const express = require('express');
const router = express.Router();
const zoneController = require('../controllers/zoneController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Routes publiques (lecture uniquement, tous les rôles)
router.get('/', verifyToken, zoneController.getAllZones);
router.get('/:id', verifyToken, zoneController.getZoneById);

// Routes admin uniquement
router.post('/', verifyToken, checkRole(['administrateur']), zoneController.createZone);
router.put('/:id', verifyToken, checkRole(['administrateur']), zoneController.updateZone);
router.delete('/:id', verifyToken, checkRole(['administrateur']), zoneController.deleteZone);

module.exports = router;