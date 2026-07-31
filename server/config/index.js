import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";
const jwtSecret = process.env.JWT_SECRET || "";

if (nodeEnv === "production") {
  if (!jwtSecret || jwtSecret === "dev-only-change-me") {
    throw new Error(
      "JWT_SECRET must be set to a strong unique value in production."
    );
  }
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required in production.");
  }
  if (!process.env.CLIENT_URL) {
    throw new Error("CLIENT_URL is required in production.");
  }
}

/**
 * Central configuration — single place for env-backed settings.
 * Controllers/services import this instead of process.env directly.
 */
const config = {
  port: Number(process.env.PORT) || 5050,
  nodeEnv,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  /** Public API origin for robots Sitemap line (defaults to same host as requests). */
  apiPublicUrl: (process.env.API_PUBLIC_URL || "").replace(/\/$/, ""),
  mongoUri: process.env.MONGODB_URI || "",
  allowRegister: process.env.ALLOW_REGISTER === "true",
  jwt: {
    secret: jwtSecret || "dev-only-change-me",
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
    max: Number(process.env.RATE_LIMIT_MAX) || 1000,
  },
};

export default config;
