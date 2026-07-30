import { body, param, query } from "express-validator";

export const uploadMediaValidator = [
  body("alt").optional().isLength({ max: 200 }),
  body("caption").optional().isLength({ max: 300 }),
];

export const mediaIdValidator = [param("id").isMongoId()];

export const listMediaValidator = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 50 }),
  query("resourceType").optional().isIn(["image", "video", "raw", "auto"]),
];

export default { uploadMediaValidator, mediaIdValidator, listMediaValidator };
