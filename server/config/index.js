import dotenv from "dotenv";

dotenv.config();

/**
 * Central configuration — single place for env-backed settings.
 * Controllers/services import this instead of process.env directly.
 */
const config = {
  port: Number(process.env.PORT) || 5050,
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongoUri: process.env.MONGODB_URI || "",
  jwt: {
    secret: process.env.JWT_SECRET || "dev-only-change-me",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    cookieName: process.env.JWT_COOKIE_NAME || "dil_token",
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    folder: process.env.CLOUDINARY_FOLDER || "dil-and-data",
  },
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 200,
  },
};

export default config;
