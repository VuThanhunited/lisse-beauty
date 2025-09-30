const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { Service, Feedback } = require("../models");
require("dotenv").config();

const importFromJson = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📦 Connected to MongoDB");

    // Read and import services
    const servicesPath = path.join(
      __dirname,
      "../../data/services_import.json"
    );
    const servicesData = JSON.parse(fs.readFileSync(servicesPath, "utf8"));

    // Clear existing services
    await Service.deleteMany({});
    console.log("🗑️ Cleared existing services");

    // Insert services data
    const services = await Service.insertMany(servicesData);
    console.log(`🎯 Imported ${services.length} services`);

    // Read and import feedbacks
    const feedbacksPath = path.join(
      __dirname,
      "../../data/feedbacks_import.json"
    );
    const feedbacksData = JSON.parse(fs.readFileSync(feedbacksPath, "utf8"));

    // Clear existing feedbacks
    await Feedback.deleteMany({});
    console.log("🗑️ Cleared existing feedbacks");

    // Insert feedbacks data
    const feedbacks = await Feedback.insertMany(feedbacksData);
    console.log(`💬 Imported ${feedbacks.length} feedbacks`);

    console.log("✅ JSON data imported successfully!");
  } catch (error) {
    console.error("❌ Error importing JSON data:", error);
  } finally {
    await mongoose.connection.close();
    console.log("📦 Database connection closed");
  }
};

// Run the import function if this file is executed directly
if (require.main === module) {
  importFromJson();
}

module.exports = importFromJson;
