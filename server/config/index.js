import dotenv from "dotenv";

dotenv.config();

/**
 * Central configuration.
 * MongoDB and other integrations will plug in here later.
 */
const config = {
  port: process.env.PORT || 5050,
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};

export default config;
