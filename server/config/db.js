import mongoose from "mongoose";
import config from "./index.js";

/**
 * MongoDB Atlas connection.
 * Called once from server.js before listening.
 */
export async function connectDatabase() {
  if (!config.mongoUri) {
    throw new Error("MONGODB_URI is not set in environment variables");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(config.mongoUri);

  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}

export default connectDatabase;
