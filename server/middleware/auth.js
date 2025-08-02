const jwt = require('jsonwebtoken');
const { pool } = require('../database-sqlite');

// Authentication middleware (REQUIREMENT #5)
// This function checks if user exists and isn't blocked before each request
const authenticateToken = async (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if user exists and isn't blocked (REQUIREMENT #5)
    const result = await pool.query(
      'SELECT id, email, name, status FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    // Check if user is blocked
    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'User account is blocked' });
    }

    // Add user info to request object
    req.user = user;
    next();
    
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = {
  authenticateToken
}; 