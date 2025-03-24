require("dotenv").config();
const express = require("express");
const app = require("./app");
const connectDB = require("./config/db");
const morgan = require('morgan');
const healthRoutes = require('./routes/health');

// Middleware
app.use(morgan('combined')); // Log HTTP requests
app.use(express.json()); // For parsing application/json

// Health Check Route
app.use('/health', healthRoutes);

// Connect to MongoDB before starting the server
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5001;
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Auth Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();