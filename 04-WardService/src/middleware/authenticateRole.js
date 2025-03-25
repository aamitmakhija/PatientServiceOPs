// src/middleware/roleMiddleware.js
// eslint-disable-next-line no-unused-vars
const { authorizeRole } = require('./authorizeRole');

const authenticateRole = (role) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({ success: false, message: "Unauthorized: Role not found in token" });
    }

    if (userRole !== role) {
      return res.status(403).json({ success: false, message: "Forbidden: You do not have permission to perform this action" });
    }

    next(); // Proceed to the next middleware or route handler
  };
};

module.exports = { authenticateRole };