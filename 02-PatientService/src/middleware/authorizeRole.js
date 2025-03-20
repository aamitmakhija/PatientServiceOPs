const permissions = require("../config/permissions");

const authorizeRole = (action) => {
  return (req, res, next) => {
    console.log(`Verifying role authorization for action: ${action}`);

    // Ensure req.user is populated by previous middleware (authenticateToken)
    if (!req.user || !req.user.role) {
      console.log("User information is missing. Cannot authorize role.");
      return res.status(401).json({ message: "Unauthorized: User information required." });
    }

    const { role } = req.user;

    // Check if the action is allowed for the user's role
    if (!permissions[role] || !permissions[role].includes(action)) {
      console.log(`Role: ${role} is not permitted to perform action: ${action}`);
      return res.status(403).json({ message: "Access forbidden: Insufficient permissions." });
    }

    console.log(`Role: ${role} is authorized to perform action: ${action}`);
    next(); // Proceed to the next middleware or controller
  };
};

module.exports = authorizeRole;
