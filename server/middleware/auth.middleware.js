import jwt from "jsonwebtoken";
import config from "../config/index.js";
import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Require a valid JWT (cookie or Authorization Bearer).
 */
export const protect = asyncHandler(async (req, _res, next) => {
  let token = req.cookies?.[config.jwt.cookieName];

  const header = req.headers.authorization;
  if (!token && header?.startsWith("Bearer ")) {
    token = header.slice(7);
  }

  if (!token) {
    throw new AppError("Authentication required", 401);
  }

  const decoded = jwt.verify(token, config.jwt.secret);
  const user = await User.findById(decoded.id);

  if (!user || !user.isActive) {
    throw new AppError("User not found or inactive", 401);
  }

  req.user = user;
  next();
});

/**
 * Restrict to one or more roles (e.g. admin).
 */
export function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission for this action", 403));
    }
    return next();
  };
}

export const adminOnly = authorize("admin");

export default { protect, authorize, adminOnly };
