const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    console.log("Attempting to connect to MongoDB at:", mongoUri);

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Retry connection for up to 30 seconds
    });

    console.log("Connected to MongoDB Atlas successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit the process with a failure code if DB connection fails
  }
};

// Graceful shutdown with timeout for MongoDB disconnection
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed on application termination");
    process.exit(0);
  } catch (err) {
    console.error("Error during MongoDB shutdown:", err);
    process.exit(1);
  }
});

module.exports = connectDB;