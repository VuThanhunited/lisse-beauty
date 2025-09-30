module.exports = {
  // Server configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database configuration
  DATABASE: {
    URI:
      process.env.MONGODB_URI ||
      "mongodb+srv://vtu21102000:Vuthanh1810@@cluster0.7t35nab.mongodb.net/",
    NAME: process.env.DB_NAME || "lisse_beauty",
  },

  // JWT configuration
  JWT: {
    SECRET: process.env.JWT_SECRET || "fallback-secret-key",
    EXPIRE: process.env.JWT_EXPIRE || "7d",
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "fallback-refresh-secret",
    REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || "30d",
  },

  // File upload configuration
  UPLOAD: {
    MAX_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
    PATH: process.env.UPLOAD_PATH || "./uploads",
    ALLOWED_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  },

  // CORS configuration
  CORS: {
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    ADMIN_URL: process.env.ADMIN_URL || "http://localhost:3001",
  },

  // Admin configuration
  ADMIN: {
    EMAIL: process.env.ADMIN_EMAIL || "admin@lissebeauty.com",
    PASSWORD: process.env.ADMIN_PASSWORD || "admin123",
  },

  // Email configuration (for future use)
  EMAIL: {
    HOST: process.env.EMAIL_HOST || "smtp.gmail.com",
    PORT: parseInt(process.env.EMAIL_PORT) || 587,
    USER: process.env.EMAIL_USER || "",
    PASS: process.env.EMAIL_PASS || "",
  },

  // Session configuration
  SESSION: {
    SECRET: process.env.SESSION_SECRET || "fallback-session-secret",
  },

  // Rate limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },
};
