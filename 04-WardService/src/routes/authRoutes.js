// src/routes/authRoutes.js

const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/authController");

// Login route (handles user authentication)
router.post("/login", loginUser);

module.exports = router;
