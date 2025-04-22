const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'space_invaders_secret_token');
    
    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth; 