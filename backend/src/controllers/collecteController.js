// backend/src/controllers/collecteController.js (version simplifiée utilisant le service)
const {
  planifierCollecteComplete,
  planifierCollecteGlouton,
  demarrerCollecte,
  terminerCollecteComplete,
  annulerCollecte,
  getCollecteDetails,
  getCollectesByAgent
} = require('../services/collecteService');
const Collecte = require('../models/Collecte');

// Planifier avec Dijkstra (optimal)
exports.planifierCollecte = async (req, res) => {
  try {
    if (req.user.role !== 'administrateur') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const { zone_id, camion_id, agent_id, date_planifiee, signalement_ids, algorithme = 'dijkstra' } = req.body;

    let collecte;
    if (algorithme === 'glouton') {
      collecte = await planifierCollecteGlouton({ zone_id, camion_id, agent_id, date_planifiee });
    } else {
      collecte = await planifierCollecteComplete({ zone_id, camion_id, agent_id, date_planifiee, signalement_ids });
    }

    res.status(201).json({
      message: 'Collecte planifiée avec succès',
      collecte
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Démarrer une collecte
exports.demarrerCollecte = async (req, res) => {
  try {
    const { id } = req.params;
    const collecte = await demarrerCollecte(id, req.user.id);
    res.json({ message: 'Collecte démarrée', collecte });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Terminer une collecte
exports.terminerCollecte = async (req, res) => {
  try {
    const { id } = req.params;
    const { poids_collectee, notes } = req.body;
    const collecte = await terminerCollecteComplete(id, req.user.id, poids_collectee, notes);
    res.json({ message: 'Collecte terminée', collecte });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Annuler une collecte
exports.annulerCollecte = async (req, res) => {
  try {
    if (req.user.role !== 'administrateur') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }
    const { id } = req.params;
    const collecte = await annulerCollecte(id);
    res.json({ message: 'Collecte annulée', collecte });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtenir les détails d'une collecte
exports.getCollecteById = async (req, res) => {
  try {
    const { id } = req.params;
    const collecte = await getCollecteDetails(id);
    if (!collecte) {
      return res.status(404).json({ error: 'Collecte non trouvée' });
    }
    res.json(collecte);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir les collectes de l'agent connecté
exports.getMyCollectes = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const collectes = await getCollectesByAgent(req.user.id, limit, offset);
    res.json(collectes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lister toutes les collectes (admin/agent)
exports.getAllCollectes = async (req, res) => {
  try {
    const { statut, zone_id, debut, fin, limit = 100, offset = 0 } = req.query;
    const collectes = await Collecte.findAll({ statut, zone_id, debut, fin, limit, offset });
    res.json(collectes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};