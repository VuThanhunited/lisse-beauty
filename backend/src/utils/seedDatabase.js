const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { User, Service } = require("../models");
require("dotenv").config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📦 Connected to MongoDB");

    // Clear existing data (optional)
    await User.deleteMany({});
    await Service.deleteMany({});
    console.log("🗑️ Cleared existing data");

    // Create admin user
    const adminUser = await User.create({
      name: "Admin Lisse Beauty",
      email: process.env.ADMIN_EMAIL || "admin@lissebeauty.com",
      phone: "0912345678",
      password: process.env.ADMIN_PASSWORD || "admin123",
      role: "admin",
      isActive: true,
      isEmailVerified: true,
    });

    console.log("👤 Admin user created:", adminUser.email);

    // Create sample users
    const sampleUsers = [
      {
        name: "Nguyễn Thuỷ Tiên",
        email: "tien@example.com",
        phone: "0987654321",
        password: "password123",
        role: "user",
      },
      {
        name: "Nguyễn Hân Trúc",
        email: "truc@example.com",
        phone: "0976543210",
        password: "password123",
        role: "user",
      },
    ];

    const users = await User.create(sampleUsers);
    console.log(`👥 Created ${users.length} sample users`);

    // Create sample services
    const sampleServices = [
      {
        name: "Glowing Brow",
        description:
          "Glowing Brow là gì? Giải pháp chân mày tự nhiên, nhẹ nhàng, sắc nét không lộ dấu phun xăm",
        fullDescription:
          "Glowing Brow là kỹ thuật làm đẹp chân mày tiên tiến, tạo ra những đường nét tự nhiên và sắc nét mà không để lại dấu vết của phun xăm truyền thống.",
        image:
          "https://images.unsplash.com/photo-1637851496670-2bdc6c548d27?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHx3b21hbiUyMGV5ZWJyb3dzJTIwYmVhdXR5JTIwc2tpbmNhcmV8ZW58MHwxfHx8MTc1NjIyMTE3N3ww&ixlib=rb-4.1.0&q=85",
        price: 2500000,
        originalPrice: 3000000,
        duration: 120,
        category: "eyebrow",
        features: ["Tự nhiên như thật", "Không đau", "Bền màu lâu"],
        benefits: [
          "Tiết kiệm thời gian makeup",
          "Tự tin hơn",
          "Phù hợp mọi độ tuổi",
        ],
        isPopular: true,
        isFeatured: true,
        tags: ["chân mày", "tự nhiên", "glowing"],
        detailUrl: "/beauty-knowledge/glowing-brow",
        createdBy: adminUser._id,
      },
      {
        name: "Hairstroke",
        description:
          "Tạo sợi Hairstroke – Công nghệ chân mây tự nhiên như thật",
        fullDescription:
          "Tạo sợi Hairstroke là kỹ thuật làm đẹp chân mày tiên tiến nhất hiện nay, tạo ra từng sợi chân mày tự nhiên như thật.",
        image:
          "https://images.unsplash.com/photo-1579297462453-2ec77b1dd3ac?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHx3b21hbiUyMGV5ZWJyb3dzJTIwbmF0dXJhbCUyMGJlYXV0eXxlbnwwfDF8fHwxNzU2MjIxMTc4fDA&ixlib=rb-4.1.0&q=85",
        price: 2800000,
        originalPrice: 3200000,
        duration: 150,
        category: "eyebrow",
        features: [
          "Sợi chân mày sắc nét",
          "Công nghệ tiên tiến",
          "Phục hồi nhanh",
        ],
        benefits: ["Che khuyết điểm", "Tăng thẩm mỹ", "Bền đẹp lâu dài"],
        isPopular: true,
        isFeatured: true,
        tags: ["chân mày", "hairstroke", "sợi tự nhiên"],
        detailUrl: "/beauty-knowledge/hairstroke",
        createdBy: adminUser._id,
      },
    ];

    const services = await Service.create(sampleServices);
    console.log(`🎯 Created ${services.length} sample services`);

    console.log("✅ Database seeded successfully!");
    console.log("🔑 Admin login:", {
      email: adminUser.email,
      password: process.env.ADMIN_PASSWORD || "admin123",
    });
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("📦 Database connection closed");
  }
};

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
