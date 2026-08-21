import { body, param } from "express-validator";

/** Treat missing / null / empty string as "not provided". */
const optionalEmpty = { values: "falsy" };

export const createCategoryValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 80 })
    .withMessage("Title must be 80 characters or fewer"),
  body("description")
    .optional(optionalEmpty)
    .isString()
    .isLength({ max: 500 })
    .withMessage("Description must be 500 characters or fewer"),
  body("coverImage").optional(optionalEmpty).isString().withMessage("Cover image must be a string"),
  body("icon").optional(optionalEmpty).isString().withMessage("Icon must be a string"),
  body("isActive").optional().isBoolean().withMessage("isActive must be true or false"),
  body("slug").optional(optionalEmpty).isString().isLength({ max: 100 }),
];

export const updateCategoryValidator = [
  param("id").isMongoId(),
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 80 })
    .withMessage("Title must be 80 characters or fewer"),
  body("description")
    .optional(optionalEmpty)
    .isString()
    .isLength({ max: 500 })
    .withMessage("Description must be 500 characters or fewer"),
  body("coverImage").optional(optionalEmpty).isString().withMessage("Cover image must be a string"),
  body("icon").optional(optionalEmpty).isString().withMessage("Icon must be a string"),
  body("isActive").optional().isBoolean().withMessage("isActive must be true or false"),
  body("slug").optional(optionalEmpty).isString().isLength({ max: 100 }),
];

export const categoryIdValidator = [param("id").isMongoId()];

export default {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
};
