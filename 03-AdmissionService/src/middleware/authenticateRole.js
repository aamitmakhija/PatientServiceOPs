const authenticateRole = (requiredRole) => {
    return (req, res, next) => {
      const userRole = req.user.role; // Assuming the role is stored in the JWT payload
  
      if (userRole !== requiredRole) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You do not have permission to perform this action.",
        });
      }
  
      next(); // If role matches, proceed to the next middleware or route handler
    };
  };
  
  module.exports = authenticateRole;