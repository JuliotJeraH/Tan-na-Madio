// Mock API pour testing du frontend sans backend
// À remplacer par les vrais endpoints quand le backend sera prêt

const MOCK_DELAY = 800; // Simule latence réseau

// Mock users database
const mockUsers = {
  'citoyen@greencollect.com': {
    id: 1,
    email: 'citoyen@greencollect.com',
    password: 'citoyen123',
    role: 'citoyen',
    name: 'Ahmed Ben Ali',
    phone: '+216 95 123 456',
    address: 'Rue de la Paix, Tunis'
  },
  'agent@greencollect.com': {
    id: 2,
    email: 'agent@greencollect.com',
    password: 'agent123',
    role: 'agent',
    name: 'Fatima Khalifa',
    phone: '+216 95 234 567',
    address: 'Ave. des Travailleurs, Sfax'
  },
  'chauffeur@greencollect.com': {
    id: 3,
    email: 'chauffeur@greencollect.com',
    password: 'chauffeur123',
    role: 'chauffeur',
    name: 'Mohamed El Ghannouchi',
    phone: '+216 95 345 678',
    address: 'Rue Bourguiba, Sousse'
  },
  'admin@greencollect.com': {
    id: 4,
    email: 'admin@greencollect.com',
    password: 'admin123',
    role: 'admin',
    name: 'Dr. Karim Mahjoub',
    phone: '+216 95 456 789',
    address: 'Quartier Affaires, Tunis'
  }
};

// Mock signalements (déchets)
const mockSignalements = [
  {
    id: 1,
    title: 'Tas de déchets dans la rue',
    description: 'Beaucoup de déchets accumulés près de la pharmacie',
    location: { lat: 36.8065, lng: 10.1815 },
    address: 'Rue de Rome, Tunis',
    status: 'validé',
    priority: 'high',
    type: 'déchets_ménagers',
    image: null,
    reportedBy: 1,
    reportedAt: new Date('2024-04-20'),
    validatedBy: 2,
    validatedAt: new Date('2024-04-20')
  },
  {
    id: 2,
    title: 'Dégâts environnementaux',
    description: 'Déchets plastiques aux abords du lac',
    location: { lat: 36.7739, lng: 10.2752 },
    address: 'Bords du Lac, Tunis',
    status: 'en_attente',
    priority: 'medium',
    type: 'pollution',
    image: null,
    reportedBy: 1,
    reportedAt: new Date('2024-04-25'),
    validatedBy: null,
    validatedAt: null
  },
  {
    id: 3,
    title: 'Encombrants devant le bâtiment',
    description: 'Vieux meubles et électroménagers abandonnés',
    location: { lat: 36.8009, lng: 10.1888 },
    address: 'Avenue Bourguiba, Tunis',
    status: 'collecté',
    priority: 'low',
    type: 'encombrants',
    image: null,
    reportedBy: 1,
    reportedAt: new Date('2024-04-15'),
    validatedBy: 2,
    validatedAt: new Date('2024-04-15'),
    collectedBy: 3,
    collectedAt: new Date('2024-04-22')
  }
];

// Mock camions
const mockCamions = [
  {
    id: 1,
    immatriculation: 'TUN-1001',
    marque: 'Renault',
    modele: 'Maxity',
    capacite: 15,
    status: 'en_tournée',
    currentLocation: { lat: 36.8065, lng: 10.1815 },
    chauffeur: 3,
    charge: 12
  },
  {
    id: 2,
    immatriculation: 'TUN-1002',
    marque: 'DAF',
    modele: 'FA',
    capacite: 25,
    status: 'au_depot',
    currentLocation: { lat: 36.7500, lng: 10.3000 },
    chauffeur: null,
    charge: 0
  }
];

// Mock zones
const mockZones = [
  {
    id: 1,
    name: 'Zone Médina',
    description: 'Centre historique de Tunis',
    polygon: [[36.8065, 10.1815], [36.8100, 10.1900], [36.8050, 10.1950]],
    responsable: 2,
    status: 'active'
  },
  {
    id: 2,
    name: 'Zone Lac 1',
    description: 'Quartier Nord près du lac',
    polygon: [[36.7800, 10.2700], [36.7850, 10.2800], [36.7750, 10.2900]],
    responsable: 2,
    status: 'active'
  }
];

// Mock stats
const mockStats = {
  totalSignalements: 156,
  signalementsPendants: 12,
  signalementsValides: 89,
  signalementsCollectes: 55,
  totalCamions: 8,
  camilonsActifs: 3,
  totalAgents: 12,
  totalChauffeurs: 15,
  avgResponseTime: 4.5, // heures
  completionRate: 87 // %
};

// Simule un délai réseau
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuth = {
  login: async (email, password) => {
    await delay(MOCK_DELAY);
    const user = mockUsers[email];
    
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    
    if (user.password !== password) {
      throw new Error('Mot de passe incorrect');
    }

    // Retourne token mock et user data
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    }));

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    };
  },

  register: async (userData) => {
    await delay(MOCK_DELAY);
    
    if (mockUsers[userData.email]) {
      throw new Error('Cet email est déjà enregistré');
    }

    const newId = Math.max(...Object.values(mockUsers).map(u => u.id)) + 1;
    const newUser = {
      id: newId,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'citoyen',
      name: userData.name,
      phone: userData.phone || '',
      address: userData.address || ''
    };

    mockUsers[userData.email] = newUser;

    const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name
    }));

    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name
      }
    };
  },

  logout: async () => {
    await delay(300);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const mockSignalements_Api = {
  getAll: async () => {
    await delay(MOCK_DELAY);
    return mockSignalements;
  },

  getById: async (id) => {
    await delay(MOCK_DELAY);
    return mockSignalements.find(s => s.id === id);
  },

  create: async (data) => {
    await delay(MOCK_DELAY);
    const newSignalement = {
      id: Math.max(...mockSignalements.map(s => s.id)) + 1,
      ...data,
      status: 'en_attente',
      reportedAt: new Date(),
      reportedBy: JSON.parse(localStorage.getItem('user')).id
    };
    mockSignalements.push(newSignalement);
    return newSignalement;
  },

  update: async (id, data) => {
    await delay(MOCK_DELAY);
    const index = mockSignalements.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Signalement non trouvé');
    mockSignalements[index] = { ...mockSignalements[index], ...data };
    return mockSignalements[index];
  }
};

export const mockCamions_Api = {
  getAll: async () => {
    await delay(MOCK_DELAY);
    return mockCamions;
  },

  getById: async (id) => {
    await delay(MOCK_DELAY);
    return mockCamions.find(c => c.id === id);
  },

  updateLocation: async (id, location) => {
    await delay(MOCK_DELAY);
    const camion = mockCamions.find(c => c.id === id);
    if (!camion) throw new Error('Camion non trouvé');
    camion.currentLocation = location;
    return camion;
  }
};

export const mockZones_Api = {
  getAll: async () => {
    await delay(MOCK_DELAY);
    return mockZones;
  },

  getById: async (id) => {
    await delay(MOCK_DELAY);
    return mockZones.find(z => z.id === id);
  }
};

export const mockStats_Api = {
  getGlobal: async () => {
    await delay(MOCK_DELAY);
    return mockStats;
  },

  getByRole: async (role) => {
    await delay(MOCK_DELAY);
    // Retourne des stats en fonction du rôle
    if (role === 'chauffeur') {
      return {
        ...mockStats,
        collectesAujourd: 5,
        km: 48.3,
        tonnageCollecte: 8.5
      };
    }
    if (role === 'agent') {
      return {
        ...mockStats,
        validationsAujourd: 8,
        pourcentageValidation: 85,
        signalementsMoyens: 12
      };
    }
    return mockStats;
  }
};

export default {
  mockAuth,
  mockSignalements_Api,
  mockCamions_Api,
  mockZones_Api,
  mockStats_Api
};
