require("dotenv").config();
const mongoose = require("mongoose");

async function testMongoConnection() {
  try {
    console.log("🔄 Testing MongoDB Atlas connection...");
    console.log("URI:", process.env.MONGODB_URI.replace(/:[^:@]*@/, ":***@")); // Hide password

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      maxIdleTimeMS: 30000,
      bufferCommands: false,
      family: 4,
      retryWrites: true,
      w: "majority",
    });

    console.log("✅ MongoDB Atlas Connected Successfully!");
    console.log(`📦 Connected to: ${conn.connection.host}`);
    console.log(`🗄️ Database: ${conn.connection.name}`);

    // Test listing collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(`📊 Collections found: ${collections.length}`);
    if (collections.length > 0) {
      collections.forEach((col) => console.log(`  - ${col.name}`));
    }

    await mongoose.connection.close();
    console.log("🔒 Connection closed successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection failed:", error.message);
    console.error("Error code:", error.code);
    console.error("Error name:", error.name);
  }
}

testMongoConnection();
