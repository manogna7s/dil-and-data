import Settings from "../models/Settings.js";

export async function getSettings() {
  let settings = await Settings.findOne({ key: "site" });

  if (!settings) {
    settings = await Settings.create({ key: "site" });
  }

  return settings;
}

export async function updateSettings(payload) {
  const settings = await getSettings();
  Object.assign(settings, payload);
  await settings.save();
  return settings;
}

export default { getSettings, updateSettings };
