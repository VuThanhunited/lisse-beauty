require("do    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 75000,
      connectTimeoutMS: 60000,
      maxPoolSize: 10,
      maxIdleTimeMS: 30000,
      bufferCommands: false,
      family: 4,
      retryWrites: true,
      w: 'majority'
    });g();
const mongoose = require("mongoose");

async function testConnection() {
  try {
    console.log("🔄 Testing MongoDB Atlas connection...");
    console.log(
      "MONGODB_URI:",
      process.env.MONGODB_URI ? "✅ Found" : "❌ Not found"
    );

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 75000,
      connectTimeoutMS: 60000,
      maxPoolSize: 10,
      maxIdleTimeMS: 30000,
      bufferCommands: false,
      bufferMaxEntries: 0,
      family: 4,
      retryWrites: true,
      w: "majority",
    });

    console.log("✅ MongoDB Atlas Connected Successfully!");
    console.log(`📦 Connected to: ${conn.connection.host}`);
    console.log(`🗄️ Database: ${conn.connection.name}`);

    // Test a simple query
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(`📊 Collections found: ${collections.length}`);
    collections.forEach((col) => console.log(`  - ${col.name}`));

    await mongoose.connection.close();
    console.log("🔒 Connection closed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
}

testConnection();
