import { body, param, query } from "express-validator";
import { CONTENT_TYPES, CONTENT_STATUSES } from "../models/Content.js";

export const createContentValidator = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 200 }),
  body("excerpt").optional().isLength({ max: 500 }),
  body("body").optional().isString(),
  body("type").optional().isIn(CONTENT_TYPES).withMessage("Invalid content type"),
  body("status").optional().isIn(CONTENT_STATUSES),
  body("category").optional({ nullable: true }).isMongoId(),
  body("tags").optional().isArray(),
  body("featured").optional().isBoolean(),
  body("coverImage").optional().isString(),
  body("gallery").optional().isArray(),
  body("videos").optional().isArray(),
  body("scheduledFor").optional({ nullable: true }).isISO8601().toDate(),
  body("seo.title").optional().isLength({ max: 120 }),
  body("seo.description").optional().isLength({ max: 300 }),
  body("seo.image").optional().isString(),
];

export const updateContentValidator = [
  param("id").isMongoId().withMessage("Invalid content id"),
  body("title").optional().trim().notEmpty().isLength({ max: 200 }),
  body("slug").optional().trim().isLength({ max: 220 }),
  body("excerpt").optional().isLength({ max: 500 }),
  body("body").optional().isString(),
  body("type").optional().isIn(CONTENT_TYPES),
  body("status").optional().isIn(CONTENT_STATUSES),
  body("category").optional({ nullable: true }).isMongoId(),
  body("tags").optional().isArray(),
  body("featured").optional().isBoolean(),
  body("coverImage").optional().isString(),
  body("gallery").optional().isArray(),
  body("videos").optional().isArray(),
  body("scheduledFor").optional({ nullable: true }).isISO8601().toDate(),
  body("seo").optional().isObject(),
  body("seo.title").optional().isLength({ max: 120 }),
  body("seo.description").optional().isLength({ max: 300 }),
  body("seo.image").optional().isString(),
];

export const contentIdValidator = [
  param("id").isMongoId().withMessage("Invalid content id"),
];

export const contentSlugValidator = [
  param("slug").trim().notEmpty().withMessage("Slug is required"),
];

export const listContentValidator = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("type").optional().isIn(CONTENT_TYPES),
  query("status").optional().isIn(CONTENT_STATUSES),
  query("featured").optional().isIn(["true", "false"]),
  query("sort").optional().isIn(["newest", "oldest", "popular", "featured"]),
  query("q").optional().isString().isLength({ max: 200 }),
  query("keyword").optional().isString().isLength({ max: 200 }),
];

export default {
  createContentValidator,
  updateContentValidator,
  contentIdValidator,
  contentSlugValidator,
  listContentValidator,
};
