require("dotenv").config();
const mongoose = require("mongoose");

async function checkServicesData() {
  try {
    console.log("🔄 Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      bufferCommands: false,
      family: 4,
      retryWrites: true,
      w: "majority",
    });

    console.log("✅ Connected to MongoDB");

    // Check services collection
    const db = mongoose.connection.db;
    const servicesCollection = db.collection("services");

    const count = await servicesCollection.countDocuments();
    console.log(`📊 Services collection document count: ${count}`);

    if (count > 0) {
      console.log("\n📋 Sample documents:");
      const samples = await servicesCollection.find({}).limit(3).toArray();
      samples.forEach((doc, index) => {
        console.log(
          `${index + 1}. ${doc.name || doc.title || "Unnamed"} (ID: ${doc._id})`
        );
      });
    } else {
      console.log("⚠️ Services collection is empty!");

      // Check if there are any documents at all
      const allDocs = await servicesCollection.find({}).toArray();
      console.log("All docs:", allDocs);
    }

    await mongoose.connection.close();
    console.log("🔒 Connection closed");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

checkServicesData();
