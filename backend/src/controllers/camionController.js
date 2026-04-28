// backend/src/controllers/camionController.js
const Camion = require('../models/Camion');

exports.createCamion = async (req, res) => {
  try {
    if (req.user.role !== 'administrateur') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const { immatriculation, modele, capacite_kg, chauffeur_id } = req.body;
    const camion = await Camion.create({ immatriculation, modele, capacite_kg, chauffeur_id });

    res.status(201).json({ message: 'Camion ajouté', camion });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllCamions = async (req, res) => {
  try {
    const camions = await Camion.findAll();
    res.json(camions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCamionsDisponibles = async (req, res) => {
  try {
    const camions = await Camion.findDisponibles();
    res.json(camions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCamion = async (req, res) => {
  try {
    if (req.user.role !== 'administrateur') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const { id } = req.params;
    const { immatriculation, modele, capacite_kg, statut, chauffeur_id } = req.body;

    const camion = await Camion.update(id, { immatriculation, modele, capacite_kg, statut, chauffeur_id });
    if (!camion) {
      return res.status(404).json({ error: 'Camion non trouvé' });
    }

    res.json({ message: 'Camion modifié', camion });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updatePosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { longitude, latitude } = req.body;

    const camion = await Camion.updatePosition(id, longitude, latitude);
    if (!camion) {
      return res.status(404).json({ error: 'Camion non trouvé' });
    }

    res.json({ message: 'Position mise à jour', camion });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCamion = async (req, res) => {
  try {
    if (req.user.role !== 'administrateur') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const { id } = req.params;
    const result = await Camion.delete(id);
    if (!result) {
      return res.status(404).json({ error: 'Camion non trouvé' });
    }

    res.json({ message: 'Camion supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};