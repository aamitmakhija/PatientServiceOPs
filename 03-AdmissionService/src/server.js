require("dotenv").config(); // Load environment variables
const app = require("./app"); // Import the app setup from app.js
const connectDB = require("./config/db"); // Import the database connection logic
const mongoose = require("mongoose"); // Import mongoose for closing the connection later
const morgan = require('morgan');
const healthRoutes = require('./routes/health'); 

app.use('/health', healthRoutes);

// Use morgan for logging HTTP requests
app.use(morgan('combined'));

// Check for critical environment variables
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables.");
}

// Connect to MongoDB with error handling
const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB
    const port = process.env.PORT || 5003; // Default to port 5003 if PORT is not defined

    if (!process.env.PORT) {
      console.warn("Warning: PORT environment variable is not set, using default port 5003");
    }

    const server = app.listen(port, () => {
      console.log(`Server is running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${port}`);
    });

    // Graceful shutdown for server and MongoDB
    process.on("SIGINT", async () => {
      console.log("Shutting down gracefully...");
      try {
        server.close(() => {
          console.log("HTTP server closed.");
        });
        await mongoose.connection.close(); // Close MongoDB connection
        console.log("MongoDB connection closed successfully.");
        process.exit(0);
      } catch (err) {
        console.error("Error during graceful shutdown:", err.message);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit with failure code if DB connection fails
  }
};

startServer();