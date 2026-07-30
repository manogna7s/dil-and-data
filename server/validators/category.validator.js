import { body, param } from "express-validator";

export const createCategoryValidator = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 80 }),
  body("description").optional().isLength({ max: 500 }),
  body("coverImage").optional().isString(),
  body("icon").optional().isString(),
];

export const updateCategoryValidator = [
  param("id").isMongoId(),
  body("title").optional().trim().notEmpty().isLength({ max: 80 }),
  body("description").optional().isLength({ max: 500 }),
];

export const categoryIdValidator = [param("id").isMongoId()];

export default {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
};
