const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ success: false, message: "Access Denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // This will add user details to req.user
    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid Token" });
  }
};

module.exports = authenticateToken;