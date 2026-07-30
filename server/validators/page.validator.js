import { body, param, query } from "express-validator";
import { PAGE_BLOCK_TYPES, PAGE_STATUSES } from "../constants/pageBlocks.js";

export const createPageValidator = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 120 }),
  body("slug").optional().trim().isLength({ max: 120 }),
  body("status").optional().isIn(PAGE_STATUSES),
  body("showInNav").optional().isBoolean(),
  body("navLabel").optional().isLength({ max: 40 }),
  body("navOrder").optional().isInt(),
  body("blocks").optional().isArray(),
  body("blocks.*.type").optional().isIn(PAGE_BLOCK_TYPES),
  body("seo.title").optional().isLength({ max: 120 }),
  body("seo.description").optional().isLength({ max: 300 }),
];

export const updatePageValidator = [
  param("id").isMongoId(),
  body("title").optional().trim().notEmpty().isLength({ max: 120 }),
  body("slug").optional().trim().isLength({ max: 120 }),
  body("status").optional().isIn(PAGE_STATUSES),
  body("showInNav").optional().isBoolean(),
  body("navLabel").optional().isLength({ max: 40 }),
  body("navOrder").optional().isInt(),
  body("blocks").optional().isArray(),
  body("blocks.*.type").optional().isIn(PAGE_BLOCK_TYPES),
];

export const pageIdValidator = [param("id").isMongoId()];
export const pageSlugValidator = [param("slug").trim().notEmpty()];

export const listPagesValidator = [
  query("status").optional().isIn(PAGE_STATUSES),
];

export default {
  createPageValidator,
  updatePageValidator,
  pageIdValidator,
  pageSlugValidator,
  listPagesValidator,
};
