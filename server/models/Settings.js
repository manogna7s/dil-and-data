import mongoose from "mongoose";

/**
 * Site-wide settings (singleton document).
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
      default: "A personal journal of heart, curiosity, and quiet strength",
    },
    about: {
      type: String,
      default:
        "Manogna writes DIL & DATA, home of Shakti's Blog. Short letters, soft frames, and quiet strength.",
    },
    logo: { type: String, default: "" },
    favicon: { type: String, default: "" },
    footer: {
      text: { type: String, default: "" },
      credit: { type: String, default: "" },
    },
    contact: {
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      note: { type: String, default: "" },
    },
    analytics: {
      googleAnalyticsId: { type: String, default: "" },
      plausibleDomain: { type: String, default: "" },
    },
    navigation: {
      type: [
        {
          label: String,
          href: String,
          enabled: { type: Boolean, default: true },
        },
      ],
      default: [],
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
      canonicalBase: { type: String, default: "" },
      ogTitle: { type: String, default: "" },
      ogDescription: { type: String, default: "" },
      ogImage: { type: String, default: "" },
      robots: { type: String, default: "index, follow" },
      twitterCard: { type: String, default: "summary_large_image" },
    },
    sitemap: {
      enabled: { type: Boolean, default: true },
      includePages: { type: Boolean, default: true },
      includeContent: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
