import { cloudinary } from "../config/cloudinary.js";
import config from "../config/index.js";
import { AppError } from "./AppError.js";

/**
 * Upload a local/temp file path to Cloudinary.
 */
export async function uploadToCloudinary(filePath, options = {}) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: config.cloudinary.folder,
      resource_type: options.resourceType || "auto",
      ...options,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      resourceType: result.resource_type,
    };
  } catch (error) {
    throw new AppError(`Cloudinary upload failed: ${error.message}`, 502);
  }
}

/**
 * Delete an asset by public_id.
 */
export async function deleteFromCloudinary(publicId, resourceType = "image") {
  if (!publicId) return null;

  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    throw new AppError(`Cloudinary delete failed: ${error.message}`, 502);
  }
}

export default { uploadToCloudinary, deleteFromCloudinary };
