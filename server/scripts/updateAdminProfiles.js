/**
 * One-time update: set admin name and bio.
 * Usage: node scripts/updateAdminProfiles.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import config from "../config/index.js";
import User from "../models/User.js";

async function main() {
  if (!config.mongoUri) {
    throw new Error("MONGODB_URI is required");
  }

  await mongoose.connect(config.mongoUri);

  const result = await User.updateMany(
    { role: "admin" },
    { $set: { name: "Shakti", bio: "Author of Dil & Data." } }
  );

  console.log(`Matched: ${result.matchedCount}`);
  console.log(`Modified: ${result.modifiedCount}`);

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error.message || error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
