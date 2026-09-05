import "dotenv/config";
import mongoose from "mongoose";
import Settings from "../models/Settings.js";

async function run() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI required");
  await mongoose.connect(process.env.MONGODB_URI);
  const settings = await Settings.findOne({ key: "site" });
  if (!settings) throw new Error("Settings not found");
  settings.seoDefaults = {
    ...(typeof settings.seoDefaults?.toObject === "function"
      ? settings.seoDefaults.toObject()
      : { ...(settings.seoDefaults || {}) }),
    canonicalBase: "https://www.dilanddata.in",
  };
  await settings.save();
  console.log("canonicalBase:", settings.seoDefaults.canonicalBase);
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error(err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
