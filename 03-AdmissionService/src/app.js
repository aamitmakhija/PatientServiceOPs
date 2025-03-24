require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const admissionRoutes = require("./routes/admissionRoutes"); // Import admission routes
const authRoutes = require("./routes/authRoutes"); // Import auth routes
const healthRoutes = require('./routes/health');  // Correct path should be './routes/health'


const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*", // Adjust for security in production
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Routes
app.use("/api/admissions", admissionRoutes);
app.use("/api/auth", authRoutes);  // Use authentication routes

// Health check route
app.use('/health', healthRoutes);  // Health route for service status

// Default route
app.get("/", (req, res) => {
  res.status(200).json({ status: "Admission Service is running..." });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("[Global Error Handler] Error:", err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({ success: false, message: "Validation error", errors: err.errors });
  }

  res.status(500).json({ success: false, message: "Internal server error" });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log("Gracefully shutting down...");
  // Add shutdown logic here (e.g., closing DB connection, server cleanup)
  process.exit(0); // Exit gracefully
});

// Start the Express server
const port = process.env.PORT || 5003;
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;