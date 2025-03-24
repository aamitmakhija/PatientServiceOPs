require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 5002;

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// Connect to MongoDB
const startServer = async () => {
  try {
    await connectDB();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Patient Service is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);  // Exit with failure status if connection fails
  }
};

startServer();