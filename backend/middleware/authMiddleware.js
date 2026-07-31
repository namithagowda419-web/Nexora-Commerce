const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'veloura_luxury_secret_jwt_key_2026_plum_cream');

      if (req.dbConnected) {
        try {
          req.user = await User.findById(decoded.id).select('-password');
        } catch (e) {}
      }

      if (!req.user) {
        const isAdmin = decoded.id === 'user-admin-1' || String(decoded.id).includes('admin');
        req.user = {
          _id: decoded.id || 'user-customer-1',
          name: isAdmin ? 'Nexora Admin' : 'Jane Customer',
          email: isAdmin ? 'admin@nexora.com' : 'user@nexora.com',
          role: isAdmin ? 'admin' : 'user',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
        };
      }
      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
