// backend/src/controllers/signalementController.js
const Signalement = require('../models/Signalement');
const Zone = require('../models/Zone');

exports.createSignalement = async (req, res) => {
  try {
    const { longitude, latitude, description, urgence, photo_url } = req.body;

    const signalement = await Signalement.create({
      citoyen_id: req.user.id,
      localisation_lng: longitude,
      localisation_lat: latitude,
      description,
      urgence,
      photo_url
    });

    res.status(201).json({ message: 'Signalement envoyé', signalement });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllSignalements = async (req, res) => {
  try {
    const { statut, zone_id, debut, fin, limit, offset } = req.query;
    const signalements = await Signalement.findAll({ statut, zone_id, debut, fin, limit, offset });
    res.json(signalements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMySignalements = async (req, res) => {
  try {
    const signalements = await Signalement.findByCitoyen(req.user.id);
    res.json(signalements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSignalementById = async (req, res) => {
  try {
    const { id } = req.params;
    const signalement = await Signalement.findById(id);
    if (!signalement) {
      return res.status(404).json({ error: 'Signalement non trouvé' });
    }
    res.json(signalement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSignalementStatus = async (req, res) => {
  try {
    if (req.user.role !== 'administrateur' && req.user.role !== 'agent_municipal') {
      return res.status(403).json({ error: 'Accès réservé aux agents et admins' });
    }

    const { id } = req.params;
    const { statut } = req.body;

    const signalement = await Signalement.updateStatus(id, statut, req.user.id);
    if (!signalement) {
      return res.status(404).json({ error: 'Signalement non trouvé' });
    }

    res.json({ message: 'Statut mis à jour', signalement });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSignalement = async (req, res) => {
  try {
    if (req.user.role !== 'administrateur') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const { id } = req.params;
    const result = await Signalement.delete(id);
    if (!result) {
      return res.status(404).json({ error: 'Signalement non trouvé' });
    }

    res.json({ message: 'Signalement supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await Signalement.getStatsByZone();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEvolution = async (req, res) => {
  try {
    const { jours = 30 } = req.query;
    const evolution = await Signalement.getEvolution(jours);
    res.json(evolution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};