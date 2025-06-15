const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next(); // User is admin, proceed to next middleware/route
  }
  return res.status(403).json({ message: 'Forbidden: Admin access required' });
};

module.exports = isAdmin; // Export the isAdmin middleware to be used in routes