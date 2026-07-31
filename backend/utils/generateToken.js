const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'veloura_luxury_secret_jwt_key_2026_plum_cream', {
    expiresIn: '30d'
  });
};

module.exports = generateToken;
