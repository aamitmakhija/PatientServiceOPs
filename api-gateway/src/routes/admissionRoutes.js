// src/routes/admissionRoutes.js
const express = require("express");
const router = express.Router();
const { createProxyMiddleware } = require("http-proxy-middleware");

// Proxy requests to Admission Service
router.use("/", createProxyMiddleware({
  target: process.env.ADMISSION_SERVICE_URL,
  changeOrigin: true,
}));

module.exports = router;