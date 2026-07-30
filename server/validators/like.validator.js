import { body, param, query } from "express-validator";

export const toggleLikeValidator = [
  body("contentId").isMongoId().withMessage("Valid content id is required"),
  body("fingerprint").trim().notEmpty().withMessage("Fingerprint is required"),
];

export const likeStatusValidator = [
  param("contentId").isMongoId(),
  query("fingerprint").trim().notEmpty(),
];

export default { toggleLikeValidator, likeStatusValidator };
