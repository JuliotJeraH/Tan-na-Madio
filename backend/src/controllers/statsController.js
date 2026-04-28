// backend/src/controllers/statsController.js
const { query } = require('../config/db');
const User = require('../models/User');
const Signalement = require('../models/Signalement');
const Camion = require('../models/Camion');

exports.getDashboardStats = async (req, res) => {
  try {
    const [citoyensCount, agentsCount, signalementsStats, camionsStats] = await Promise.all([
      User.countByRole('citoyen'),
      User.countByRole('agent_municipal'),
      query(`SELECT statut, COUNT(*) FROM signalements GROUP BY statut`),
      Camion.findAll()
    ]);

    const stats = {};
    signalementsStats.rows.forEach(row => {
      stats[`signalements_${row.statut}`] = parseInt(row.count);
    });

    const totalSignalements = Object.values(stats).reduce((a, b) => a + b, 0);
    const signalementsTraites = (stats.signalements_collecte || 0) + (stats.signalements_valide || 0);

    res.json({
      total_citoyens: citoyensCount,
      total_agents: agentsCount,
      signalements: {
        en_attente: stats.signalements_en_attente || 0,
        en_cours: stats.signalements_en_cours || 0,
        traites: signalementsTraites,
        taux_traitement: totalSignalements > 0 ? ((signalementsTraites / totalSignalements) * 100).toFixed(1) : 0
      },
      camions: {
        total: camionsStats.length,
        disponibles: camionsStats.filter(c => c.statut === 'disponible').length,
        en_tournee: camionsStats.filter(c => c.statut === 'en_tournee').length,
        en_maintenance: camionsStats.filter(c => c.statut === 'en_maintenance').length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSignalementsStatsByZone = async (req, res) => {
  try {
    const stats = await Signalement.getStatsByZone();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSignalementsEvolution = async (req, res) => {
  try {
    const { jours = 30 } = req.query;
    const evolution = await Signalement.getEvolution(jours);
    res.json(evolution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAgentsPerformance = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        u.id, u.nom, u.prenom,
        COUNT(c.id) as total_collectes,
        COALESCE(SUM(c.poids_collecte_kg), 0) as total_poids,
        COALESCE(AVG(EXTRACT(EPOCH FROM (c.date_fin - c.date_debut))/3600), 0) as duree_moyenne_heures
      FROM utilisateurs u
      LEFT JOIN collectes c ON c.agent_id = u.id AND c.statut = 'terminee'
      WHERE u.role = 'agent_municipal'
      GROUP BY u.id, u.nom, u.prenom
      ORDER BY total_collectes DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCamionsOccupation = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        c.id, c.immatriculation, c.statut,
        col.id as collecte_encours_id,
        col.date_debut,
        z.nom as zone_nom
      FROM camions c
      LEFT JOIN collectes col ON col.camion_id = c.id AND col.statut = 'en_cours'
      LEFT JOIN zones z ON z.id = col.zone_id
      ORDER BY c.statut
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTraitementMoyen = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        AVG(EXTRACT(EPOCH FROM (date_traitement - created_at))/3600) as moyenne_heures
      FROM signalements
      WHERE date_traitement IS NOT NULL
    `);
    res.json({
      temps_moyen_traitement_heures: parseFloat(result.rows[0].moyenne_heures || 0).toFixed(1)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};