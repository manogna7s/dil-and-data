import fs from "fs/promises";
import path from "path";
import Media from "../models/Media.js";
import { MEDIA_FOLDERS } from "../constants/mediaFolders.js";
import { AppError } from "../utils/AppError.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { getPagination, buildPaginationMeta } from "../utils/pagination.js";

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function resolveResourceType(file) {
  if (!file?.mimetype) return "auto";
  if (file.mimetype.startsWith("video/")) return "video";
  if (file.mimetype === "application/pdf") return "raw";
  if (file.mimetype.startsWith("image/")) return "image";
  return "auto";
}

function cloudinaryResourceType(doc) {
  if (doc.resourceType === "video") return "video";
  if (doc.resourceType === "raw") return "raw";
  return "image";
}

function titleFromFile(file, fallback = "") {
  if (fallback) return String(fallback).trim().slice(0, 200);
  const base = path.parse(file?.originalname || "untitled").name;
  return base.slice(0, 200) || "untitled";
}

function normalizeFolder(folder) {
  const value = String(folder || "gallery").trim().toLowerCase();
  if (MEDIA_FOLDERS.includes(value)) return value;
  return "gallery";
}

export async function uploadMedia(
  file,
  { alt = "", caption = "", title = "", folder = "gallery", userId = null } = {}
) {
  if (!file) throw new AppError("No file uploaded", 400);

  const resourceType = resolveResourceType(file);
  const logicalFolder = normalizeFolder(folder);

  try {
    const uploaded = await uploadToCloudinary(file.path, {
      resourceType,
      folder: logicalFolder,
    });

    const media = await Media.create({
      title: titleFromFile(file, title),
      url: uploaded.url,
      publicId: uploaded.publicId,
      resourceType: uploaded.resourceType || resourceType,
      format: uploaded.format,
      width: uploaded.width,
      height: uploaded.height,
      bytes: uploaded.bytes,
      alt: alt || "",
      caption: caption || "",
      folder: logicalFolder,
      uploadedBy: userId,
    });

    return media;
  } finally {
    await fs.unlink(file.path).catch(() => {});
  }
}

export async function uploadMany(files, options = {}) {
  if (!files?.length) throw new AppError("No files uploaded", 400);
  const items = [];
  for (const file of files) {
    // Sequential keeps Cloudinary rate calm; client already shows per-file progress for singles.
    items.push(await uploadMedia(file, options));
  }
  return items;
}

export async function updateMedia(id, payload = {}) {
  const media = await Media.findById(id);
  if (!media) throw new AppError("Media not found", 404);

  if (payload.title !== undefined) media.title = String(payload.title).trim().slice(0, 200);
  if (payload.alt !== undefined) media.alt = String(payload.alt).slice(0, 200);
  if (payload.caption !== undefined) media.caption = String(payload.caption).slice(0, 300);
  if (payload.folder !== undefined) media.folder = normalizeFolder(payload.folder);

  await media.save();
  return media;
}

/**
 * Replace binary on Cloudinary; keep the same Media document id.
 * Optionally apply crop coords as Cloudinary eager transform before store —
 * client usually sends an already-cropped blob.
 */
export async function replaceMedia(id, file, meta = {}) {
  const media = await Media.findById(id);
  if (!media) throw new AppError("Media not found", 404);
  if (!file) throw new AppError("No file uploaded", 400);

  const resourceType = resolveResourceType(file);
  const logicalFolder = normalizeFolder(meta.folder || media.folder);

  try {
    await deleteFromCloudinary(media.publicId, cloudinaryResourceType(media)).catch(() => {});

    const uploaded = await uploadToCloudinary(file.path, {
      resourceType,
      folder: logicalFolder,
    });

    media.url = uploaded.url;
    media.publicId = uploaded.publicId;
    media.resourceType = uploaded.resourceType || resourceType;
    media.format = uploaded.format || media.format;
    media.width = uploaded.width;
    media.height = uploaded.height;
    media.bytes = uploaded.bytes;
    media.folder = logicalFolder;
    if (meta.title !== undefined) media.title = String(meta.title).trim().slice(0, 200);
    if (meta.alt !== undefined) media.alt = String(meta.alt).slice(0, 200);
    if (meta.caption !== undefined) media.caption = String(meta.caption).slice(0, 300);

    await media.save();
    return media;
  } finally {
    await fs.unlink(file.path).catch(() => {});
  }
}

export async function deleteMedia(id) {
  const media = await Media.findById(id);
  if (!media) throw new AppError("Media not found", 404);

  await deleteFromCloudinary(media.publicId, cloudinaryResourceType(media));
  await media.deleteOne();
  return media;
}

export async function bulkDeleteMedia(ids = []) {
  const unique = [...new Set(ids.map(String).filter(Boolean))];
  if (!unique.length) throw new AppError("No media ids provided", 400);

  const docs = await Media.find({ _id: { $in: unique } });
  const deleted = [];

  for (const doc of docs) {
    await deleteFromCloudinary(doc.publicId, cloudinaryResourceType(doc)).catch(() => {});
    await doc.deleteOne();
    deleted.push(doc._id);
  }

  return { deletedCount: deleted.length, ids: deleted };
}

export async function listMedia(query = {}) {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.resourceType) filter.resourceType = query.resourceType;
  if (query.folder && query.folder !== "all") {
    filter.folder = normalizeFolder(query.folder);
  }

  if (query.q) {
    const keyword = escapeRegex(query.q.trim());
    filter.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { alt: { $regex: keyword, $options: "i" } },
      { caption: { $regex: keyword, $options: "i" } },
      { format: { $regex: keyword, $options: "i" } },
    ];
  }

  const [items, total] = await Promise.all([
    Media.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Media.countDocuments(filter),
  ]);

  return { items, pagination: buildPaginationMeta({ total, page, limit }) };
}

export async function getMediaById(id) {
  const media = await Media.findById(id);
  if (!media) throw new AppError("Media not found", 404);
  return media;
}

/**
 * Always return the default folders (auto-created shelf),
 * plus counts so empty folders still appear in the UI.
 */
export async function listFolders() {
  const counts = await Media.aggregate([
    { $group: { _id: "$folder", count: { $sum: 1 } } },
  ]);
  const countMap = Object.fromEntries(
    counts.map((row) => [row._id || "gallery", row.count])
  );

  return MEDIA_FOLDERS.map((name) => ({
    name,
    count: countMap[name] || 0,
  }));
}

export default {
  uploadMedia,
  uploadMany,
  updateMedia,
  replaceMedia,
  deleteMedia,
  bulkDeleteMedia,
  listMedia,
  getMediaById,
  listFolders,
};
