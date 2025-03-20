require("dotenv").config(); // Load environment variables
const app = require("./app"); // Import the app setup from app.js
const connectDB = require("./config/db"); // Import the database connection logic

// Check for critical environment variables
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables.");
}

// Connect to MongoDB with error handling
connectDB()
  .then(() => {
    // Start the server only if the DB connection is successful
    const port = process.env.PORT || 5003; // Default to port 5000 if PORT is not defined

    if (!process.env.PORT) {
      console.warn("Warning: PORT environment variable is not set, using default port 5003");
    }

    app.listen(port, (err) => {
      if (err) {
        console.error("Error starting server:", err.message);
        process.exit(1); // Exit with failure code if server fails to start
      }
      console.log(`Server is running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1); // Exit with failure code if DB connection fails
  });

// Graceful shutdown for server and MongoDB
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  try {
    await app.close(); // If you have a close method in app, or you can forcefully close the server
    await mongoose.connection.close(); // Close MongoDB connection
    console.log("Server and MongoDB connection closed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error during graceful shutdown:", err.message);
    process.exit(1);
  }
});