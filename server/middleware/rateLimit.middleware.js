import rateLimit from "express-rate-limit";
import config from "../config/index.js";

/**
 * Global API rate limiter — protects public endpoints from abuse.
 */
export const apiRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
    data: null,
    errors: null,
  },
});

/**
 * Stricter limiter for auth routes.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many auth attempts. Please try again later.",
    data: null,
    errors: null,
  },
});

export default apiRateLimiter;
