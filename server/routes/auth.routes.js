import { Router } from "express";
import {
  login,
  logout,
  profile,
  register,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { authRateLimiter } from "../middleware/rateLimit.middleware.js";
import {
  loginValidator,
  registerValidator,
} from "../validators/auth.validator.js";

const router = Router();

router.post("/login", authRateLimiter, loginValidator, validateRequest, login);
router.post("/register", authRateLimiter, registerValidator, validateRequest, register);
router.post("/logout", logout);
router.get("/profile", protect, profile);

export default router;
