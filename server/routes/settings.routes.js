import { Router } from "express";
import * as ctrl from "../controllers/settings.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", ctrl.get);
router.patch("/", protect, adminOnly, ctrl.update);

export default router;
