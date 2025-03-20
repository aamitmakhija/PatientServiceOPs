const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

// Route for Clerks to register patients
router.post("/register", authenticateToken, authorizeRole("clerk"), (req, res) => {
  res.json({ message: "Patient registered successfully (To be handled by Patient Service)." });
});

module.exports = router;