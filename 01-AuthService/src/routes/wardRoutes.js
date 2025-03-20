const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

// Route for Clerks to assign wards
router.post("/assign", authenticateToken, authorizeRole("clerk"), (req, res) => {
  res.json({ message: "Ward assigned successfully (To be handled by Ward Service)." });
});

module.exports = router;