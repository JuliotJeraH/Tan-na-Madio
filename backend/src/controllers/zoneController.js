// backend/src/controllers/zoneController.js
const Zone = require('../models/Zone');

exports.createZone = async (req, res) => {
  try {
    if (req.user.role !== 'administrateur') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const { nom, description, geometrie_geojson, frequence_collecte_jours } = req.body;
    const zone = await Zone.create({ nom, description, geometrie_geojson, frequence_collecte_jours });

    res.status(201).json({ message: 'Zone créée', zone });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllZones = async (req, res) => {
  try {
    const zones = await Zone.findAll();
    res.json(zones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getZoneById = async (req, res) => {
  try {
    const { id } = req.params;
    const zone = await Zone.findById(id);
    if (!zone) {
      return res.status(404).json({ error: 'Zone non trouvée' });
    }
    res.json(zone);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateZone = async (req, res) => {
  try {
    if (req.user.role !== 'administrateur') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const { id } = req.params;
    const { nom, description, geometrie_geojson, frequence_collecte_jours, actif } = req.body;

    const zone = await Zone.update(id, { nom, description, geometrie_geojson, frequence_collecte_jours, actif });
    if (!zone) {
      return res.status(404).json({ error: 'Zone non trouvée' });
    }

    res.json({ message: 'Zone modifiée', zone });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteZone = async (req, res) => {
  try {
    if (req.user.role !== 'administrateur') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const { id } = req.params;
    const result = await Zone.delete(id);
    if (!result) {
      return res.status(404).json({ error: 'Zone non trouvée' });
    }

    res.json({ message: 'Zone supprimée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};