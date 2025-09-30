const mongoose = require("mongoose");
const MockDatabase = require("../services/mockDatabase");

const connectDB = async () => {
  try {
    // Check if MongoDB URI is provided
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI === "undefined") {
      console.warn("⚠️ MongoDB URI not provided, using Mock Database");
      global.useMockDatabase = true;
      await MockDatabase.connect();
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 60000, // Increase timeout to 60 seconds
      socketTimeoutMS: 75000, // Close sockets after 75 seconds of inactivity
      connectTimeoutMS: 60000, // Give up initial connection after 60 seconds
      maxPoolSize: 10, // Maintain up to 10 socket connections
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true,
      w: "majority",
    });

    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);

    // Ensure we use MongoDB instead of Mock Database
    global.useMockDatabase = false;

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("📦 MongoDB connection closed through app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.warn("🔄 Falling back to Mock Database");
    global.useMockDatabase = true;
    await MockDatabase.connect();
  }
};

module.exports = connectDB;
