const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;
 const authHeader = req.headers.authorization || '';

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = authHeader.split(' ')[1];

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach decoded user data to request
      req.user = {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username,
        role: decoded.role || 'user', // Default to 'user' if role is not set
      };

      next(); // Pass control to next middleware/route
    } catch (error) {
      console.error('JWT verification failed:', error.message);
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

};

module.exports = protect;
