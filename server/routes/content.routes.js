import { Router } from "express";
import * as ctrl from "../controllers/content.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import {
  createContentValidator,
  updateContentValidator,
  contentIdValidator,
  contentSlugValidator,
  listContentValidator,
} from "../validators/content.validator.js";

const router = Router();

/** Public */
router.get("/", listContentValidator, validateRequest, ctrl.list);
router.get("/featured", ctrl.featured);
router.get("/recent", ctrl.recent);
router.get("/slug/:slug", contentSlugValidator, validateRequest, ctrl.getBySlug);

/** Admin / author */
router.get(
  "/admin",
  protect,
  adminOnly,
  listContentValidator,
  validateRequest,
  ctrl.listAdmin
);
router.get("/:id", contentIdValidator, validateRequest, protect, adminOnly, ctrl.getOne);
router.post("/", protect, adminOnly, createContentValidator, validateRequest, ctrl.create);
router.patch("/:id", protect, adminOnly, updateContentValidator, validateRequest, ctrl.update);
router.delete("/:id", protect, adminOnly, contentIdValidator, validateRequest, ctrl.remove);
router.post("/:id/publish", protect, adminOnly, contentIdValidator, validateRequest, ctrl.publish);
router.post("/:id/draft", protect, adminOnly, contentIdValidator, validateRequest, ctrl.draft);

export default router;
