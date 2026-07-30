import jwt from "jsonwebtoken";
import config from "../config/index.js";
import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";

function signToken(userId) {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

export function setAuthCookie(res, token) {
  const isProd = config.nodeEnv === "production";

  res.cookie(config.jwt.cookieName, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(config.jwt.cookieName, {
    httpOnly: true,
    sameSite: config.nodeEnv === "production" ? "none" : "lax",
    secure: config.nodeEnv === "production",
  });
}

/**
 * Auth business logic — kept out of controllers.
 */
export async function loginUser({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AppError("Account is inactive", 403);
  }

  const token = signToken(user._id);
  return { user: user.toSafeObject(), token };
}

export async function getProfile(userId) {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);
  return user.toSafeObject();
}

/**
 * Bootstrap first admin (optional seed helper).
 */
export async function registerAdmin({ name, email, password }) {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new AppError("Email already registered", 409);

  const adminCount = await User.countDocuments({ role: "admin" });
  const role = adminCount === 0 ? "admin" : "author";

  const user = await User.create({ name, email, password, role });
  const token = signToken(user._id);

  return { user: user.toSafeObject(), token };
}

export default {
  loginUser,
  getProfile,
  registerAdmin,
  setAuthCookie,
  clearAuthCookie,
};
