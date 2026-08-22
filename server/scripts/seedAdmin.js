/**
 * Optional seed — create the first admin user.
 *
 * Usage:
 *   node scripts/seedAdmin.js
 *
 * Requires MONGODB_URI and will skip if an admin already exists
 * unless FORCE_SEED=true.
 */
import "dotenv/config";
import mongoose from "mongoose";
import config from "../config/index.js";
import User from "../models/User.js";

async function seed() {
  if (!config.mongoUri) {
    throw new Error("MONGODB_URI is required to seed");
  }

  await mongoose.connect(config.mongoUri);

  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin && process.env.FORCE_SEED !== "true") {
    console.log("Admin already exists:", existingAdmin.email);
    await mongoose.disconnect();
    return;
  }

  const email = process.env.SEED_ADMIN_EMAIL || "admin@dilanddata.com";
  const password = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const name = process.env.SEED_ADMIN_NAME || "Shakti";

  await User.deleteMany({ email });
  const admin = await User.create({
    name,
    email,
    password,
    role: "admin",
    bio: "Author of Dil & Data.",
  });

  console.log("Admin created:", admin.email);
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
