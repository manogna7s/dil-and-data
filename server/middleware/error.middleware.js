import { AppError } from "../utils/AppError.js";
import { sendError } from "../utils/apiResponse.js";
import config from "../config/index.js";

/**
 * 404 for unknown API routes.
 */
export function notFoundHandler(req, _res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

/**
 * Centralized error handler — always returns the standard envelope.
 */
export function errorHandler(err, _req, res, _next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || null;

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.values(err.errors || {}).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    message = `Duplicate value for ${field}`;
    errors = [{ field, message }];
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  if (err.name === "MulterError") {
    statusCode = 400;
    message = err.message || "Upload failed";
  }

  if (config.nodeEnv === "development" && statusCode === 500) {
    console.error(err);
  }

  return sendError(res, { statusCode, message, errors });
}

export default { notFoundHandler, errorHandler };
