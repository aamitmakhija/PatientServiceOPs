const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const patientRoutes = require("./routes/patientRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Debugging Middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/patients", patientRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Patient Service is running...");
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Express Error:", err.stack);
  res.status(500).json({ message: "An unexpected error occurred", error: err.message });
});

module.exports = app;
