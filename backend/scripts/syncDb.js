// backend/scripts/seedDb.js
require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'tananamadio',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function seedDatabase() {
  console.log('🌱 Insertion des données de test...');
  
  try {
    // Vérifier si des données existent déjà
    const check = await pool.query(`SELECT COUNT(*) FROM utilisateurs`);
    if (parseInt(check.rows[0].count) > 3) {
      console.log('⚠️ Des données existent déjà. Utilise npm run db:reset pour tout réinitialiser.');
      process.exit(0);
    }
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // 1. Créer les utilisateurs
    const users = await pool.query(`
      INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role, telephone)
      VALUES 
        ('Rabe', 'Jean', 'agent.rabe@tananamadio.mg', $1, 'agent_municipal', '0341111111'),
        ('Rasoa', 'Marie', 'citoyen.rasoa@gmail.com', $1, 'citoyen', '0342222222'),
        ('Rajaonary', 'Tovo', 'citoyen.raja@gmail.com', $1, 'citoyen', '0343333333'),
        ('Andrian', 'Mamy', 'chauffeur.andrian@tananamadio.mg', $1, 'chauffeur', '0344444444')
      RETURNING id, email, role
    `, [hashedPassword]);
    
    console.log(`✅ ${users.rows.length} utilisateurs créés`);
    
    // Récupérer les IDs
    const agentId = users.rows.find(u => u.role === 'agent_municipal').id;
    const chauffeurId = users.rows.find(u => u.role === 'chauffeur').id;
    const citoyen1Id = users.rows.find(u => u.email === 'citoyen.rasoa@gmail.com').id;
    const citoyen2Id = users.rows.find(u => u.email === 'citoyen.raja@gmail.com').id;
    
    // 2. Créer les zones (avec géométries PostGIS)
    const zones = await pool.query(`
      INSERT INTO zones (nom, description, geometrie, frequence_collecte_jours)
      VALUES 
        ('Analakely', 'Centre-ville - Marché et commerces', 
         ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[47.50,-18.90],[47.52,-18.90],[47.52,-18.92],[47.50,-18.92],[47.50,-18.90]]]}'), 
         1),
        ('67ha', 'Quartier résidentiel', 
         ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[47.53,-18.91],[47.55,-18.91],[47.55,-18.93],[47.53,-18.93],[47.53,-18.91]]]}'), 
         3),
        ('Andraharo', 'Zone universitaire', 
         ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[47.51,-18.88],[47.53,-18.88],[47.53,-18.90],[47.51,-18.90],[47.51,-18.88]]]}'), 
         7)
      RETURNING id, nom
    `);
    
    console.log(`✅ ${zones.rows.length} zones créées`);
    
    const zoneAnalakelyId = zones.rows.find(z => z.nom === 'Analakely').id;
    const zone67haId = zones.rows.find(z => z.nom === '67ha').id;
    const zoneAndraharoId = zones.rows.find(z => z.nom === 'Andraharo').id;
    
    // 3. Créer les camions
    const camions = await pool.query(`
      INSERT INTO camions (immatriculation, modele, capacite_kg, chauffeur_id)
      VALUES 
        ('001-TANA-01', 'Mercedes-Benz Actros', 8000, $1),
        ('002-TANA-02', 'Renault D Wide', 12000, NULL),
        ('003-TANA-03', 'Isuzu Elf', 3500, NULL)
      RETURNING id, immatriculation
    `, [chauffeurId]);
    
    console.log(`✅ ${camions.rows.length} camions créés`);
    
    const camion1Id = camions.rows[0].id;
    const camion2Id = camions.rows[1].id;
    
    // 4. Créer les signalements
    const signalements = await pool.query(`
      INSERT INTO signalements (citoyen_id, localisation, description, urgence, zone_id)
      VALUES 
        ($1, ST_SetSRID(ST_MakePoint(47.51, -18.905), 4326), 'Tas d''ordures devant le marché Analakely', 'eleve', $2),
        ($3, ST_SetSRID(ST_MakePoint(47.54, -18.92), 4326), 'Déchets encombrants (canapé, pneus) 67ha', 'moyen', $4),
        ($1, ST_SetSRID(ST_MakePoint(47.52, -18.89), 4326), 'Branches et déchets verts non collectés', 'faible', $5),
        ($3, ST_SetSRID(ST_MakePoint(47.505, -18.895), 4326), 'Bouteilles plastiques recyclables abandonnées', 'critique', $2),
        ($1, ST_SetSRID(ST_MakePoint(47.515, -18.91), 4326), 'Sac poubelle déchiré par des chiens', 'moyen', $2)
      RETURNING id, description
    `, [citoyen1Id, zoneAnalakelyId, citoyen2Id, zone67haId, zoneAndraharoId]);
    
    console.log(`✅ ${signalements.rows.length} signalements créés`);
    
    const signalementIds = signalements.rows.map(s => s.id);
    
    // 5. Créer les collectes
    const collectes = await pool.query(`
      INSERT INTO collectes (camion_id, agent_id, zone_id, date_planifiee, statut)
      VALUES 
        ($1, $2, $3, NOW() + INTERVAL '1 day', 'planifiee'),
        ($4, $2, $5, NOW() - INTERVAL '2 days', 'terminee'),
        ($1, $2, $6, NOW() - INTERVAL '5 days', 'terminee')
      RETURNING id
    `, [camion1Id, agentId, zoneAnalakelyId, camion2Id, zone67haId, zoneAndraharoId]);
    
    console.log(`✅ ${collectes.rows.length} collectes créées`);
    
    // 6. Lier les collectes aux signalements
    await pool.query(`
      INSERT INTO collecte_signalements (collecte_id, signalement_id, ordre)
      VALUES 
        ($1, $2, 1),
        ($1, $3, 2),
        ($4, $5, 1)
    `, [collectes.rows[0].id, signalementIds[0], signalementIds[4], collectes.rows[1].id, signalementIds[1]]);
    
    console.log('✅ Liaisons collecte-signalements créées');
    
    console.log('\n🌱 Seed terminé avec succès !');
    console.log('\n📋 Comptes de test:');
    console.log('   Admin: admin@tananamadio.mg / admin123');
    console.log('   Agent: agent.rabe@tananamadio.mg / password123');
    console.log('   Citoyen: citoyen.rasoa@gmail.com / password123');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

seedDatabase();