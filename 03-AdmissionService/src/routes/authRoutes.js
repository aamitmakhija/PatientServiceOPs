const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/authController"); // Import loginUser controller

// POST route to handle login
router.post("/login", loginUser);

module.exports = router;