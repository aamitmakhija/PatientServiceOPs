const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const patientRoutes = require("./routes/patientRoutes");
const healthRoutes = require("./routes/health");  // Ensure healthRoutes is imported

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Debugging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/patients", patientRoutes);  // Patient-related routes
app.use("/health", healthRoutes);          // Health check route

// Default route
app.get("/", (req, res) => {
  res.send("Patient Service is running...");
});

// Health route (if you need it directly in app.js)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Express Error:", err.stack);
  res.status(500).json({
    message: "An unexpected error occurred",
    error: err.message,
  });
});

module.exports = app;