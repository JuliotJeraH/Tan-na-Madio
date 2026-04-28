// backend/src/controllers/collecteController.js
const Collecte = require('../models/Collecte');
const Camion = require('../models/Camion');
const Signalement = require('../models/Signalement');

exports.planifierCollecte = async (req, res) => {
  try {
    if (req.user.role !== 'administrateur') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const { camion_id, agent_id, zone_id, date_planifiee, signalement_ids } = req.body;

    const camion = await Camion.findById(camion_id);
    if (!camion || camion.statut !== 'disponible') {
      return res.status(400).json({ error: 'Camion non disponible' });
    }

    const collecte = await Collecte.create({
      camion_id, agent_id, zone_id, date_planifiee, signalement_ids
    });

    await Camion.updateStatut(camion_id, 'en_tournee');

    res.status(201).json({ message: 'Collecte planifiée', collecte });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.demarrerCollecte = async (req, res) => {
  try {
    const { id } = req.params;
    const collecte = await Collecte.findById(id);

    if (!collecte) {
      return res.status(404).json({ error: 'Collecte non trouvée' });
    }

    if (collecte.agent_id !== req.user.id && req.user.role !== 'administrateur') {
      return res.status(403).json({ error: 'Vous n\'êtes pas assigné à cette collecte' });
    }

    const updated = await Collecte.demarrer(id);
    res.json({ message: 'Collecte démarrée', collecte: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.terminerCollecte = async (req, res) => {
  try {
    const { id } = req.params;
    const { poids_collecte_kg, distance_km, notes } = req.body;

    const collecte = await Collecte.findById(id);
    if (!collecte) {
      return res.status(404).json({ error: 'Collecte non trouvée' });
    }

    if (collecte.agent_id !== req.user.id && req.user.role !== 'administrateur') {
      return res.status(403).json({ error: 'Vous n\'êtes pas assigné à cette collecte' });
    }

    const updated = await Collecte.terminer(id, { poids_collecte_kg, distance_km, notes });
    await Camion.updateStatut(collecte.camion_id, 'disponible');

    res.json({ message: 'Collecte terminée', collecte: updated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllCollectes = async (req, res) => {
  try {
    const { statut, zone_id, debut, fin, limit, offset } = req.query;
    const collectes = await Collecte.findAll({ statut, zone_id, debut, fin, limit, offset });
    res.json(collectes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyCollectes = async (req, res) => {
  try {
    const collectes = await Collecte.findByAgent(req.user.id);
    res.json(collectes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCollecteById = async (req, res) => {
  try {
    const { id } = req.params;
    const collecte = await Collecte.findById(id);
    if (!collecte) {
      return res.status(404).json({ error: 'Collecte non trouvée' });
    }
    res.json(collecte);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.annulerCollecte = async (req, res) => {
  try {
    if (req.user.role !== 'administrateur') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const { id } = req.params;
    const collecte = await Collecte.findById(id);

    if (!collecte) {
      return res.status(404).json({ error: 'Collecte non trouvée' });
    }

    const updated = await Collecte.annuler(id);

    if (collecte.camion_id) {
      await Camion.updateStatut(collecte.camion_id, 'disponible');
    }

    res.json({ message: 'Collecte annulée', collecte: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};