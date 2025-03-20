const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");  // Authentication routes
const admissionRoutes = require("./routes/admissionRoutes"); // Admission service routes
const wardRoutes = require("./routes/wardRoutes"); // Ward service routes

dotenv.config();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", methods: ["GET", "POST", "PUT", "DELETE"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Routes
app.use("/api/auth", authRoutes);  // Mount auth routes at /api/auth
app.use("/api/admissions", admissionRoutes); // Admission service routes
app.use("/api/wards", wardRoutes); // Ward service routes

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Service is running..." });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("[Global Error Handler] Error:", err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({ success: false, message: "Validation error", errors: err.errors });
  }

  res.status(500).json({ success: false, message: "Internal server error" });
});

// Start the Express server
const port = process.env.PORT || 5003;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;