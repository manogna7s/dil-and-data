import { body, query } from "express-validator";

export const subscribeValidator = [
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("name").optional().trim().isLength({ max: 80 }),
];

export const unsubscribeValidator = [
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
];

export const listSubscribersValidator = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("active").optional().isIn(["true", "false"]),
  query("q").optional().isString().isLength({ max: 200 }),
];

export default { subscribeValidator, unsubscribeValidator, listSubscribersValidator };
