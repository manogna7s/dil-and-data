import Settings from "../models/Settings.js";

const ALLOWED = [
  "siteName",
  "tagline",
  "about",
  "logo",
  "favicon",
  "footer",
  "contact",
  "analytics",
  "navigation",
  "socials",
  "seoDefaults",
  "sitemap",
];

export async function getSettings() {
  let settings = await Settings.findOne({ key: "site" });

  if (!settings) {
    settings = await Settings.create({ key: "site" });
  }

  return settings;
}

export async function updateSettings(payload = {}) {
  const settings = await getSettings();

  for (const key of ALLOWED) {
    if (payload[key] === undefined) continue;
    if (
      key === "footer" ||
      key === "contact" ||
      key === "analytics" ||
      key === "seoDefaults" ||
      key === "sitemap"
    ) {
      const current =
        typeof settings[key]?.toObject === "function"
          ? settings[key].toObject()
          : { ...(settings[key] || {}) };
      settings[key] = { ...current, ...payload[key] };
    } else {
      settings[key] = payload[key];
    }
  }

  await settings.save();
  return settings;
}

export default { getSettings, updateSettings };
