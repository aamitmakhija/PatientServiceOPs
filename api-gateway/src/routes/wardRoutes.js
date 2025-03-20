// src/routes/wardRoutes.js
const express = require("express");
const router = express.Router();
const { createProxyMiddleware } = require("http-proxy-middleware");

// Proxy requests to Ward Service
router.use("/", createProxyMiddleware({
  target: process.env.WARD_SERVICE_URL,
  changeOrigin: true,
}));

module.exports = router;