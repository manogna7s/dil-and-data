import { validationResult } from "express-validator";
import { sendError } from "../utils/apiResponse.js";

/**
 * Runs after express-validator chains.
 * Returns 400 with field errors in the standard envelope.
 */
export function validateRequest(req, res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return sendError(res, {
      statusCode: 400,
      message: "Validation failed",
      errors,
    });
  }

  return next();
}

export default validateRequest;
