require("dotenv").config();

// Parse MongoDB URI để kiểm tra thông tin
const mongoUri = process.env.MONGODB_URI;
console.log("🔍 Analyzing MongoDB URI:");
console.log("Full URI:", mongoUri);

if (mongoUri) {
  // Extract components
  const match = mongoUri.match(
    /mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/(.+)/
  );

  if (match) {
    const [, username, password, host, database] = match;
    console.log("\n📊 URI Components:");
    console.log("Protocol: mongodb+srv://");
    console.log("Username:", username);
    console.log("Password:", password.replace(/./g, "*")); // Hide password
    console.log("Host:", host);
    console.log("Database:", database);

    // Check for common issues
    console.log("\n🔍 Validation:");
    console.log("Username length:", username.length);
    console.log("Password length:", password.length);
    console.log(
      "Host contains @@:",
      host.includes("@@") ? "❌ DOUBLE @ FOUND!" : "✅ OK"
    );
    console.log(
      "Has special chars in password:",
      /[^a-zA-Z0-9]/.test(password) ? "⚠️ Yes (may need encoding)" : "✅ No"
    );
  } else {
    console.log("❌ Invalid URI format");
  }
} else {
  console.log("❌ MONGODB_URI not found");
}
