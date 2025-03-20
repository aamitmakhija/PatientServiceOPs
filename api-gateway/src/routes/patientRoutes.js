// src/routes/patientRoutes.js
const express = require("express");
const router = express.Router();
const { createProxyMiddleware } = require("http-proxy-middleware");

// Proxy requests to Patient Service
router.use("/", createProxyMiddleware({
  target: process.env.PATIENT_SERVICE_URL,
  changeOrigin: true,
}));

module.exports = router;