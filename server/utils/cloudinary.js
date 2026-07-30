import { cloudinary } from "../config/cloudinary.js";
import config from "../config/index.js";
import { AppError } from "./AppError.js";

/**
 * Resolve Cloudinary folder path: root / optional logical subfolder.
 */
export function resolveCloudinaryFolder(logicalFolder = "") {
  const root = config.cloudinary.folder || "dil-and-data";
  const sub = String(logicalFolder || "").trim().replace(/^\/+|\/+$/g, "");
  return sub ? `${root}/${sub}` : root;
}

/**
 * Upload a local/temp file path to Cloudinary.
 */
export async function uploadToCloudinary(filePath, options = {}) {
  try {
    const { folder, resourceType, publicId, overwrite, invalidate, ...rest } = options;
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder ? resolveCloudinaryFolder(folder) : resolveCloudinaryFolder(""),
      resource_type: resourceType || "auto",
      public_id: publicId,
      overwrite: overwrite === true,
      invalidate: invalidate === true,
      ...rest,
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
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType || "image",
    });
  } catch (error) {
    throw new AppError(`Cloudinary delete failed: ${error.message}`, 502);
  }
}

/**
 * Rename / move display path on Cloudinary (optional; used for replace overwrite).
 */
export async function renameOnCloudinary(fromPublicId, toPublicId, resourceType = "image") {
  try {
    return await cloudinary.uploader.rename(fromPublicId, toPublicId, {
      resource_type: resourceType,
      overwrite: true,
    });
  } catch (error) {
    throw new AppError(`Cloudinary rename failed: ${error.message}`, 502);
  }
}

export default { uploadToCloudinary, deleteFromCloudinary, renameOnCloudinary, resolveCloudinaryFolder };
