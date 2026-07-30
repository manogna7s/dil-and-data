import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { AppError } from "../utils/AppError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const allowed = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "application/pdf",
]);

function fileFilter(_req, file, cb) {
  if (!allowed.has(file.mimetype)) {
    return cb(
      new AppError("Unsupported file type. Use images, MP4/WebM, or PDF.", 400),
      false
    );
  }
  return cb(null, true);
}

/**
 * Multer instance — temp disk storage before Cloudinary upload.
 * 40MB ceiling covers video + PDF; images stay well under.
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 40 * 1024 * 1024 },
});

export default upload;
