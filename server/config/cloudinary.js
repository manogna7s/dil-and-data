import { v2 as cloudinary } from "cloudinary";
import config from "./index.js";

/**
 * Cloudinary SDK setup for media uploads.
 * Returns null-safe config so the API can boot without credentials in local mocks.
 */
export function configureCloudinary() {
  const { cloudName, apiKey, apiSecret } = config.cloudinary;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn(
      "Cloudinary credentials missing — media upload endpoints will fail until configured."
    );
    return false;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return true;
}

export { cloudinary };
export default cloudinary;
