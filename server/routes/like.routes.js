import { Router } from "express";
import * as ctrl from "../controllers/like.controller.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import {
  toggleLikeValidator,
  likeStatusValidator,
} from "../validators/like.validator.js";

const router = Router();

router.post("/toggle", toggleLikeValidator, validateRequest, ctrl.toggle);
router.get(
  "/:contentId/status",
  likeStatusValidator,
  validateRequest,
  ctrl.status
);

export default router;
