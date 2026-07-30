import mongoose from "mongoose";

/**
 * Site-wide settings (singleton document).
 * Extend freely — socials, about blurb, feature flags.
 */
const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "site",
      unique: true,
    },
    siteName: {
      type: String,
      default: "DIL & DATA",
    },
    tagline: {
      type: String,
      default: "Stories, letters, and quiet observations",
    },
    about: {
      type: String,
      default: "",
    },
    socials: {
      type: [
        {
          id: String,
          label: String,
          href: String,
          handle: String,
        },
      ],
      default: [],
    },
    seoDefaults: {
      title: { type: String, default: "DIL & DATA" },
      description: { type: String, default: "" },
      image: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
