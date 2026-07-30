import { Router } from "express";
import * as ctrl from "../controllers/page.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import {
  createPageValidator,
  updatePageValidator,
  pageIdValidator,
  pageSlugValidator,
  listPagesValidator,
} from "../validators/page.validator.js";

const router = Router();

/** Public */
router.get("/nav", ctrl.nav);
router.get("/slug/:slug", pageSlugValidator, validateRequest, ctrl.getBySlug);

/** Admin */
router.get(
  "/admin",
  protect,
  adminOnly,
  listPagesValidator,
  validateRequest,
  ctrl.list
);
router.get("/admin/block-types", protect, adminOnly, ctrl.blockTypes);
router.get(
  "/admin/slug/:slug",
  protect,
  adminOnly,
  pageSlugValidator,
  validateRequest,
  ctrl.getBySlugAdmin
);
router.get("/admin/:id", protect, adminOnly, pageIdValidator, validateRequest, ctrl.getOne);
router.post("/", protect, adminOnly, createPageValidator, validateRequest, ctrl.create);
router.patch("/:id", protect, adminOnly, updatePageValidator, validateRequest, ctrl.update);
router.delete("/:id", protect, adminOnly, pageIdValidator, validateRequest, ctrl.remove);

export default router;
