// src/middleware/authorizeRole.js
const authorizeRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    console.log("User role from JWT:", userRole);  // Add this for debugging
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to perform this action",
      });
    }
    next();
  };
};

module.exports = { authorizeRole };  // Ensure this export is present