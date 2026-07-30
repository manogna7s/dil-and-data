import { body, param, query } from "express-validator";

export const createCommentValidator = [
  body("content").isMongoId().withMessage("Valid content id is required"),
  body("authorName").trim().notEmpty().withMessage("Name is required").isLength({ max: 80 }),
  body("authorEmail").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("body").trim().notEmpty().withMessage("Comment body is required").isLength({ max: 2000 }),
  body("parent").optional({ nullable: true }).isMongoId(),
];

export const commentIdValidator = [param("id").isMongoId()];

export const moderateCommentValidator = [
  param("id").isMongoId(),
  body("status").isIn(["pending", "approved", "rejected", "spam"]),
];

export const listCommentsValidator = [
  param("contentId").isMongoId(),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 50 }),
];

export const listAllCommentsValidator = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("status").optional().isIn(["all", "pending", "approved", "rejected", "spam"]),
  query("q").optional().isString().isLength({ max: 200 }),
];

export const bulkCommentsValidator = [
  body("ids").isArray({ min: 1 }),
  body("ids.*").isMongoId(),
  body("status").optional().isIn(["pending", "approved", "rejected", "spam"]),
];

export const replyCommentValidator = [
  param("id").isMongoId(),
  body("body").trim().notEmpty().isLength({ max: 2000 }),
  body("authorName").optional().isLength({ max: 80 }),
];

export default {
  createCommentValidator,
  commentIdValidator,
  moderateCommentValidator,
  listCommentsValidator,
  listAllCommentsValidator,
  bulkCommentsValidator,
  replyCommentValidator,
};
