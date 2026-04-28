// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Routes publiques
router.post('/register', authController.register);
router.post('/login', authController.login);

// Routes protégées (utilisateur connecté)
router.get('/profile', verifyToken, authController.getProfile);

// Routes admin uniquement
router.get('/users', verifyToken, checkRole(['administrateur']), authController.getAllUsers);
router.put('/users/:id', verifyToken, checkRole(['administrateur']), authController.updateUser);
router.delete('/users/:id', verifyToken, checkRole(['administrateur']), authController.deleteUser);

// Routes agent uniquement
router.get('/agent/signalements', verifyToken, checkRole(['agent']), authController.getAgentSignalements);

module.exports = router;