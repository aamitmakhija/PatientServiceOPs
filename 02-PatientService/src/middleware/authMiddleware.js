const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // Use req.get instead of req.header
  const token = req.get("Authorization")?.split(" ")[1];

  if (!token) {
    console.log("No token provided.");
    return res.status(401).json({ message: "Unauthorized: Token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification failed:", err.message);
      return res.status(403).json({ message: "Unauthorized: Invalid token" });
    }

    console.log("User authenticated:", user);
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
