const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Get the token from the Authorization header

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Token required",
    });
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("[authenticateToken] Invalid token:", err.message);
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Invalid token",
      });
    }

    // Attach user to request
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;