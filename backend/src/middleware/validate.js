// backend/src/middleware/validate.js

// Middleware de validation générique
exports.validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Données invalides',
        details: error.details.map(d => d.message)
      });
    }
    
    next();
  };
};

// Schémas de validation (Joi)
const Joi = require('joi');

exports.schemas = {
  // Validation inscription
  register: Joi.object({
    nom: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('citoyen', 'agent', 'administrateur').default('citoyen'),
    telephone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
    adresse: Joi.string().max(255).optional()
  }),
  
  // Validation connexion
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  
  // Validation camion
  camion: Joi.object({
    immatriculation: Joi.string().min(5).max(20).required(),
    capacite: Joi.number().positive().required(),
    type_carburant: Joi.string().max(50).optional(),
    date_mise_service: Joi.date().optional(),
    statut: Joi.string().valid('disponible', 'en_service', 'en_maintenance').default('disponible')
  }),
  
  // Validation signalement
  signalement: Joi.object({
    localisation: Joi.object({
      lat: Joi.number().min(-90).max(90).required(),
      lng: Joi.number().min(-180).max(180).required()
    }).required(),
    description: Joi.string().max(500).optional(),
    type_dechet: Joi.string().valid('menager', 'encombrant', 'dechet_vert', 'recyclable').default('menager'),
    photo_url: Joi.string().uri().optional()
  }),
  
  // Validation collecte
  collecte: Joi.object({
    zone_id: Joi.number().integer().positive().required(),
    camion_id: Joi.number().integer().positive().required(),
    agent_id: Joi.number().integer().positive().required(),
    signalement_id: Joi.number().integer().positive().optional(),
    date_planifiee: Joi.date().min('now').required()
  }),
  
  // Validation zone
  zone: Joi.object({
    nom: Joi.string().min(2).max(100).required(),
    description: Joi.string().optional(),
    geometrie: Joi.object().required(),
    couleur: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional(),
    frequence_collecte: Joi.string().valid('quotidien', '3x/semaine', 'hebdomadaire').default('hebdomadaire')
  })
};