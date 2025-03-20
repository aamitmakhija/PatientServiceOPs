const permissions = require("../config/permissions");

const authorizeAction = (action) => {
  return (req, res, next) => {
    console.log(`Checking permissions for action: ${action}`);
    const { role } = req.user; // req.user should be set by authenticateToken middleware

    // Ensure permissions exist for the role and action
    if (!permissions[role] || !permissions[role].includes(action)) {
      console.log(`Permission denied for role: ${role} and action: ${action}`);
      return res.status(403).json({ message: "Access forbidden: Insufficient permissions" });
    }

    console.log(`Permission granted for role: ${role} and action: ${action}`);
    next();
  };
};

module.exports = authorizeAction;
