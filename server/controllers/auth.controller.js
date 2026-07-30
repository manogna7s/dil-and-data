import {
  loginUser,
  getProfile,
  registerAdmin,
  setAuthCookie,
  clearAuthCookie,
} from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  setAuthCookie(res, result.token);

  return sendSuccess(res, {
    message: "Logged in successfully",
    data: result,
  });
});

export const logout = asyncHandler(async (_req, res) => {
  clearAuthCookie(res);
  return sendSuccess(res, { message: "Logged out successfully", data: null });
});

export const profile = asyncHandler(async (req, res) => {
  const user = await getProfile(req.user._id);
  return sendSuccess(res, { message: "Profile fetched", data: user });
});

export const register = asyncHandler(async (req, res) => {
  const result = await registerAdmin(req.body);
  setAuthCookie(res, result.token);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Account created",
    data: result,
  });
});

export default { login, logout, profile, register };
