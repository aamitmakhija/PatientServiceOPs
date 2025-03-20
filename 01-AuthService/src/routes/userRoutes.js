const express = require("express");
const { createUser, setupAdmin } = require("../controllers/userController");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

// Route to create new users (admin-only)
router.post("/create-user", authenticateToken, authorizeRole("admin"), createUser);

// Route to set up the first admin (no password hashing here)
router.post("/setup-admin", setupAdmin);

module.exports = router;