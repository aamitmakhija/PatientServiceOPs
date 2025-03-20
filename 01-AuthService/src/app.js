const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);  // Auth routes for login
app.use("/api/users", userRoutes);  // User routes for setup-admin, create-user

// Default route
app.get("/", (req, res) => {
  console.log("[DEBUG] Authentication Service is Running...");
  res.send("Authentication Service is running...");
});

module.exports = app;