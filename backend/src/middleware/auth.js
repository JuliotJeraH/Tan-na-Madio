// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');

// Vérifier le token JWT
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Accès non autorisé. Token manquant.' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré. Veuillez vous reconnecter.' });
    }
    return res.status(401).json({ error: 'Token invalide.' });
  }
};

// Vérifier le(s) rôle(s) autorisé(s)
exports.checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Accès refusé. Rôle requis : ${allowedRoles.join(' ou ')}` 
      });
    }
    
    next();
  };
};

// Vérifier que l'utilisateur est propriétaire de la ressource (optionnel)
exports.isOwner = (getResourceUserId) => {
  return async (req, res, next) => {
    try {
      const resourceUserId = await getResourceUserId(req);
      
      if (req.user.role === 'administrateur') {
        return next(); // Admin peut tout faire
      }
      
      if (req.user.id !== resourceUserId) {
        return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à modifier cette ressource.' });
      }
      
      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
};