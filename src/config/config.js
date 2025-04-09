const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3001,

  // Frontend URL for redirects and CORS
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",

  // CORS configuration
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",

  // MongoDB config
  mongoUri: process.env.MONGO_URI,

  // JWT config
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "20m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "20d",
    emailVerificationExpiresIn: "24h",
    passwordResetExpiresIn: "1h",
  },

  // Security config
  security: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000, // 15 minutes in milliseconds
    csrfProtection: process.env.NODE_ENV === "production", // Enable in production
  },

  // Email config
  email: {
    host: process.env.EMAIL_HOST,
    port: Number.parseInt(process.env.EMAIL_PORT || "587", 10),
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM,
  },

  // Redis config
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number.parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD || "",
  },

  // File upload config
  fileUpload: {
    maxSize: Number.parseInt(process.env.MAX_FILE_SIZE || "10485760", 10), // 10MB default
    allowedTypes: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ],
  },
}

export default config
