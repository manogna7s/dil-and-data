import fs from "fs/promises";
import Media from "../models/Media.js";
import { AppError } from "../utils/AppError.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { getPagination, buildPaginationMeta } from "../utils/pagination.js";

export async function uploadMedia(file, { alt = "", caption = "", userId = null } = {}) {
  if (!file) throw new AppError("No file uploaded", 400);

  const resourceType = file.mimetype.startsWith("video/") ? "video" : "image";

  try {
    const uploaded = await uploadToCloudinary(file.path, { resourceType });

    const media = await Media.create({
      url: uploaded.url,
      publicId: uploaded.publicId,
      resourceType: uploaded.resourceType || resourceType,
      format: uploaded.format,
      width: uploaded.width,
      height: uploaded.height,
      bytes: uploaded.bytes,
      alt,
      caption,
      uploadedBy: userId,
    });

    return media;
  } finally {
    await fs.unlink(file.path).catch(() => {});
  }
}

export async function deleteMedia(id) {
  const media = await Media.findById(id);
  if (!media) throw new AppError("Media not found", 404);

  await deleteFromCloudinary(media.publicId, media.resourceType === "video" ? "video" : "image");
  await media.deleteOne();
  return media;
}

export async function listMedia(query = {}) {
  const { page, limit, skip } = getPagination(query);
  const filter = {};
  if (query.resourceType) filter.resourceType = query.resourceType;

  const [items, total] = await Promise.all([
    Media.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Media.countDocuments(filter),
  ]);

  return { items, pagination: buildPaginationMeta({ total, page, limit }) };
}

export default { uploadMedia, deleteMedia, listMedia };
