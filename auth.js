const jwt = require('jsonwebtoken');

// Middleware for authentication
exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified:', decoded); // ✅ Log token payload for debugging
    req.user = decoded; // Attach user data to request
    next();
  } catch (error) {
    console.error('❌ Invalid token:', error.message);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Middleware for Role-Based Access Control
exports.authorize = (roles) => (req, res, next) => {
  if (!req.user) {
    console.log('❌ User not authenticated');
    return res.status(401).json({ error: 'Unauthorized - No user info' });
  }
  
  if (!roles.includes(req.user.role)) {
    console.log(`❌ Access denied for role: ${req.user.role}`);
    return res.status(403).json({ error: 'Access denied' });
  }

  console.log(`✅ Access granted for role: ${req.user.role}`);
  next();
};
