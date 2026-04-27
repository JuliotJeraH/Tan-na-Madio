-- =============================================================
--  TANÀNA MADIO — Schéma de Base de Données
--  PostgreSQL + PostGIS
--  Système Numérique de Gestion des Déchets Urbains
-- =============================================================

-- Activer l'extension géospatiale PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================
--  TYPES ÉNUMÉRÉS
-- =============================================================

CREATE TYPE role_utilisateur AS ENUM (
  'citoyen',
  'agent_municipal',
  'chauffeur',
  'administrateur'
);

CREATE TYPE statut_signalement AS ENUM (
  'en_attente',    -- Signalement reçu, non traité
  'valide',        -- Validé par un agent
  'en_cours',      -- En cours de collecte
  'collecte',      -- Déchet collecté
  'rejete'         -- Signalement rejeté (doublon, erreur)
);

CREATE TYPE statut_collecte AS ENUM (
  'planifiee',     -- Tournée planifiée
  'en_cours',      -- Tournée en cours
  'terminee',      -- Tournée terminée
  'annulee'        -- Tournée annulée
);

CREATE TYPE statut_camion AS ENUM (
  'disponible',
  'en_tournee',
  'en_maintenance',
  'hors_service'
);

CREATE TYPE niveau_urgence AS ENUM (
  'faible',
  'moyen',
  'eleve',
  'critique'
);

-- =============================================================
--  TABLE : utilisateurs (classe abstraite Utilisateur)
-- =============================================================

CREATE TABLE utilisateurs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom           VARCHAR(100)  NOT NULL,
  prenom        VARCHAR(100)  NOT NULL,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  mot_de_passe  VARCHAR(255)  NOT NULL,          -- bcrypt hash
  role          role_utilisateur NOT NULL,
  telephone     VARCHAR(20),
  actif         BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Index pour la recherche rapide par email (table de hachage simulée)
CREATE UNIQUE INDEX idx_utilisateurs_email ON utilisateurs (email);
CREATE INDEX idx_utilisateurs_role ON utilisateurs (role);

-- =============================================================
--  TABLE : citoyens (étend Utilisateur)
-- =============================================================

CREATE TABLE citoyens (
  id          UUID PRIMARY KEY REFERENCES utilisateurs(id) ON DELETE CASCADE,
  quartier    VARCHAR(150),
  points_eco  INTEGER NOT NULL DEFAULT 0          -- Système de gamification
);

-- =============================================================
--  TABLE : agents_municipaux (étend Utilisateur)
-- =============================================================

CREATE TABLE agents_municipaux (
  id          UUID PRIMARY KEY REFERENCES utilisateurs(id) ON DELETE CASCADE,
  matricule   VARCHAR(50)  NOT NULL UNIQUE,
  zone_id     UUID                                -- Référencé après création de zones
);

-- =============================================================
--  TABLE : administrateurs (étend Utilisateur)
-- =============================================================

CREATE TABLE administrateurs (
  id      UUID PRIMARY KEY REFERENCES utilisateurs(id) ON DELETE CASCADE,
  niveau  INTEGER NOT NULL DEFAULT 1 CHECK (niveau BETWEEN 1 AND 3)
  -- 1 = admin standard, 2 = super admin, 3 = admin système
);

-- =============================================================
--  TABLE : zones (secteurs de la ville)
-- =============================================================

CREATE TABLE zones (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom           VARCHAR(150)  NOT NULL,
  description   TEXT,
  -- Polygone géospatial délimitant la zone (PostGIS)
  geometrie     GEOGRAPHY(POLYGON, 4326),
  -- Centroïde calculé pour l'algorithme de Dijkstra
  centroide     GEOGRAPHY(POINT, 4326),
  frequence_collecte_jours  INTEGER DEFAULT 7,   -- Tous les N jours
  actif         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_zones_geometrie ON zones USING GIST (geometrie);
CREATE INDEX idx_zones_centroide ON zones USING GIST (centroide);

-- Ajout de la clé étrangère zone_id sur agents_municipaux
ALTER TABLE agents_municipaux
  ADD CONSTRAINT fk_agent_zone
  FOREIGN KEY (zone_id) REFERENCES zones(id) ON DELETE SET NULL;

-- =============================================================
--  TABLE : camions
-- =============================================================

CREATE TABLE camions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  immatriculation VARCHAR(20)  NOT NULL UNIQUE,
  modele          VARCHAR(100),
  capacite_kg     DECIMAL(10,2) NOT NULL,         -- Capacité en kg
  statut          statut_camion NOT NULL DEFAULT 'disponible',
  -- Position GPS actuelle du camion (mise à jour en temps réel)
  position_actuelle GEOGRAPHY(POINT, 4326),
  chauffeur_id    UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
  derniere_maintenance TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_camions_statut ON camions (statut);
CREATE INDEX idx_camions_position ON camions USING GIST (position_actuelle);

-- Table chauffeurs (étend Utilisateur)
CREATE TABLE chauffeurs (
  id          UUID PRIMARY KEY REFERENCES utilisateurs(id) ON DELETE CASCADE,
  numero_permis VARCHAR(50)  NOT NULL UNIQUE,
  camion_id   UUID REFERENCES camions(id) ON DELETE SET NULL
);

-- =============================================================
--  TABLE : signalements (points de déchets signalés)
-- =============================================================

CREATE TABLE signalements (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  citoyen_id      UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  zone_id         UUID REFERENCES zones(id) ON DELETE SET NULL,

  -- Géolocalisation PostGIS (longitude, latitude en WGS84)
  localisation    GEOGRAPHY(POINT, 4326) NOT NULL,
  adresse         VARCHAR(255),                   -- Adresse textuelle optionnelle

  -- Détails du signalement
  description     TEXT,
  urgence         niveau_urgence NOT NULL DEFAULT 'moyen',
  statut          statut_signalement NOT NULL DEFAULT 'en_attente',

  -- Photo du déchet (chemin vers fichier uploadé)
  photo_url       VARCHAR(500),

  -- Validation par un agent
  valide_par      UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
  date_validation TIMESTAMPTZ,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index géospatial pour les requêtes de carte
CREATE INDEX idx_signalements_localisation ON signalements USING GIST (localisation);
CREATE INDEX idx_signalements_statut ON signalements (statut);
CREATE INDEX idx_signalements_citoyen ON signalements (citoyen_id);
CREATE INDEX idx_signalements_zone ON signalements (zone_id);
CREATE INDEX idx_signalements_urgence ON signalements (urgence);
-- Index pour les requêtes de date (statistiques)
CREATE INDEX idx_signalements_created_at ON signalements (created_at DESC);

-- =============================================================
--  TABLE : noeuds_graphe (pour l'algorithme de Dijkstra)
--  Représente les intersections/points du réseau routier
-- =============================================================

CREATE TABLE noeuds_graphe (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom         VARCHAR(150),
  position    GEOGRAPHY(POINT, 4326) NOT NULL,
  zone_id     UUID REFERENCES zones(id) ON DELETE CASCADE
);

CREATE INDEX idx_noeuds_position ON noeuds_graphe USING GIST (position);

-- =============================================================
--  TABLE : aretes_graphe (liaisons entre noeuds — Dijkstra)
-- =============================================================

CREATE TABLE aretes_graphe (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  noeud_source    UUID NOT NULL REFERENCES noeuds_graphe(id) ON DELETE CASCADE,
  noeud_dest      UUID NOT NULL REFERENCES noeuds_graphe(id) ON DELETE CASCADE,
  -- Distance en mètres (poids de l'arête pour Dijkstra)
  distance_m      DECIMAL(10,2) NOT NULL,
  -- Temps de trajet estimé en minutes
  temps_min       DECIMAL(8,2),
  -- Bidirectionnel par défaut
  bidirectionnel  BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(noeud_source, noeud_dest)
);

CREATE INDEX idx_aretes_source ON aretes_graphe (noeud_source);
CREATE INDEX idx_aretes_dest ON aretes_graphe (noeud_dest);

-- =============================================================
--  TABLE : collectes (tournées de collecte planifiées)
-- =============================================================

CREATE TABLE collectes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  camion_id       UUID NOT NULL REFERENCES camions(id) ON DELETE RESTRICT,
  agent_id        UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE RESTRICT,
  zone_id         UUID REFERENCES zones(id) ON DELETE SET NULL,

  statut          statut_collecte NOT NULL DEFAULT 'planifiee',

  -- Dates
  date_planifiee  TIMESTAMPTZ NOT NULL,
  date_debut      TIMESTAMPTZ,
  date_fin        TIMESTAMPTZ,

  -- Itinéraire optimisé par Dijkstra (liste ordonnée de coordonnées GeoJSON)
  itineraire      JSONB,

  -- Statistiques de la tournée
  distance_km     DECIMAL(8,2),
  nb_signalements_traites INTEGER DEFAULT 0,
  poids_collecte_kg DECIMAL(10,2),

  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_collectes_statut ON collectes (statut);
CREATE INDEX idx_collectes_camion ON collectes (camion_id);
CREATE INDEX idx_collectes_date ON collectes (date_planifiee DESC);
CREATE INDEX idx_collectes_zone ON collectes (zone_id);

-- =============================================================
--  TABLE : collecte_signalements (liaison collecte ↔ signalement)
-- =============================================================

CREATE TABLE collecte_signalements (
  collecte_id     UUID NOT NULL REFERENCES collectes(id) ON DELETE CASCADE,
  signalement_id  UUID NOT NULL REFERENCES signalements(id) ON DELETE CASCADE,
  ordre           INTEGER,                        -- Ordre de passage dans la tournée
  collecte_fait   BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (collecte_id, signalement_id)
);

-- =============================================================
--  TABLE : refresh_tokens (gestion des sessions JWT)
-- =============================================================

CREATE TABLE refresh_tokens (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  token       VARCHAR(512) NOT NULL UNIQUE,
  expire_at   TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_expire ON refresh_tokens (expire_at);

-- =============================================================
--  TABLE : logs_activite (audit trail)
-- =============================================================

CREATE TABLE logs_activite (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
  action      VARCHAR(100) NOT NULL,             -- ex: 'SIGNALEMENT_CREER'
  entite      VARCHAR(50),                       -- ex: 'signalement'
  entite_id   UUID,
  details     JSONB,
  ip_address  INET,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_logs_user ON logs_activite (user_id);
CREATE INDEX idx_logs_created ON logs_activite (created_at DESC);
CREATE INDEX idx_logs_action ON logs_activite (action);

-- =============================================================
--  TRIGGERS : mise à jour automatique de updated_at
-- =============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_utilisateurs_updated_at
  BEFORE UPDATE ON utilisateurs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_camions_updated_at
  BEFORE UPDATE ON camions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_signalements_updated_at
  BEFORE UPDATE ON signalements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_collectes_updated_at
  BEFORE UPDATE ON collectes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================
--  TRIGGER : affectation automatique de zone lors d'un signalement
--  Trouve la zone dont le polygone contient le point signalé
-- =============================================================

CREATE OR REPLACE FUNCTION affecter_zone_signalement()
RETURNS TRIGGER AS $$
BEGIN
  SELECT id INTO NEW.zone_id
  FROM zones
  WHERE ST_Within(
    NEW.localisation::geometry,
    geometrie::geometry
  )
  AND actif = TRUE
  LIMIT 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_signalement_zone
  BEFORE INSERT ON signalements
  FOR EACH ROW EXECUTE FUNCTION affecter_zone_signalement();

-- =============================================================
--  VUE : signalements_carte (pour l'API carte)
-- =============================================================

CREATE OR REPLACE VIEW signalements_carte AS
SELECT
  s.id,
  s.statut,
  s.urgence,
  s.description,
  s.photo_url,
  s.created_at,
  ST_X(s.localisation::geometry)  AS longitude,
  ST_Y(s.localisation::geometry)  AS latitude,
  z.nom                            AS zone_nom,
  u.nom || ' ' || u.prenom        AS citoyen_nom
FROM signalements s
LEFT JOIN zones z ON z.id = s.zone_id
LEFT JOIN utilisateurs u ON u.id = s.citoyen_id
WHERE s.statut != 'rejete';

-- =============================================================
--  VUE : statistiques_zones (pour le dashboard)
-- =============================================================

CREATE OR REPLACE VIEW statistiques_zones AS
SELECT
  z.id,
  z.nom,
  COUNT(s.id)                                          AS total_signalements,
  COUNT(s.id) FILTER (WHERE s.statut = 'en_attente')  AS en_attente,
  COUNT(s.id) FILTER (WHERE s.statut = 'collecte')    AS collectes,
  COUNT(s.id) FILTER (WHERE s.urgence = 'critique')   AS urgents,
  AVG(
    EXTRACT(EPOCH FROM (s.date_validation - s.created_at)) / 3600
  ) FILTER (WHERE s.date_validation IS NOT NULL)       AS delai_moyen_heures
FROM zones z
LEFT JOIN signalements s ON s.zone_id = z.id
GROUP BY z.id, z.nom;

-- =============================================================
--  DONNÉES INITIALES (seed)
-- =============================================================

-- Administrateur par défaut (mot de passe: Admin2025! — à changer)
-- Hash bcrypt généré en dehors du SQL, inséré ici pour initialisation
INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role)
VALUES (
  'Système', 'Admin',
  'admin@tananamadio.mg',
  '$2b$12$placeholder_remplacer_par_vrai_hash',
  'administrateur'
);

INSERT INTO administrateurs (id, niveau)
SELECT id, 3 FROM utilisateurs WHERE email = 'admin@tananamadio.mg';

-- =============================================================
--  FIN DU SCHÉMA
-- =============================================================
