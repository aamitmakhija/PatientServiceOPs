const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Welcome route
app.get("/", (req, res) => {
  res.send("Welcome to the API Gateway! Use the appropriate endpoints for the services.");
});

// Reusable proxy middleware configuration
const configureProxy = (path, target, rewritePath) => createProxyMiddleware({
  target,
  changeOrigin: true,
  pathRewrite: { [`^${path}`]: rewritePath },
  onProxyReq: (proxyReq, req) => {
    console.log(`Forwarding request: ${req.method} ${req.url}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Response from service: ${proxyRes.statusCode} for ${req.url}`);
  }
});

// Service proxies
app.use("/auth", configureProxy("/auth", process.env.AUTH_SERVICE_URL, "/api/auth"));
app.use("/ward", configureProxy("/ward", process.env.WARD_SERVICE_URL, ""));
app.use("/patient", configureProxy("/patient", process.env.PATIENT_SERVICE_URL, ""));
app.use("/admission", configureProxy("/admission", process.env.ADMISSION_SERVICE_URL, ""));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Proxy error:", err);
  res.status(500).send("Something went wrong in the API Gateway.");
});

// Start the gateway
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
