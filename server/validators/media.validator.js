import { body, param, query } from "express-validator";
import { MEDIA_FOLDERS } from "../constants/mediaFolders.js";

export const uploadMediaValidator = [
  body("alt").optional().isLength({ max: 200 }),
  body("caption").optional().isLength({ max: 300 }),
  body("title").optional().isLength({ max: 200 }),
  body("folder").optional().isIn(MEDIA_FOLDERS),
];

export const updateMediaValidator = [
  param("id").isMongoId().withMessage("Invalid media id"),
  body("title").optional().isLength({ max: 200 }),
  body("alt").optional().isLength({ max: 200 }),
  body("caption").optional().isLength({ max: 300 }),
  body("folder").optional().isIn(MEDIA_FOLDERS),
];

export const mediaIdValidator = [param("id").isMongoId().withMessage("Invalid media id")];

export const listMediaValidator = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("resourceType").optional().isIn(["image", "video", "raw", "auto"]),
  query("folder").optional().isString(),
  query("q").optional().isString().isLength({ max: 200 }),
];

export const bulkDeleteValidator = [
  body("ids").isArray({ min: 1 }).withMessage("ids array is required"),
  body("ids.*").isMongoId().withMessage("Invalid media id"),
];

export default {
  uploadMediaValidator,
  updateMediaValidator,
  mediaIdValidator,
  listMediaValidator,
  bulkDeleteValidator,
};
