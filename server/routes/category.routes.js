import { Router } from "express";
import * as ctrl from "../controllers/category.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
} from "../validators/category.validator.js";

const router = Router();

router.get("/", ctrl.list);
router.get("/slug/:slug", ctrl.getBySlug);
router.get("/admin", protect, adminOnly, ctrl.listAdmin);
router.get("/:id", categoryIdValidator, validateRequest, ctrl.getOne);

router.post("/", protect, adminOnly, createCategoryValidator, validateRequest, ctrl.create);
router.patch("/:id", protect, adminOnly, updateCategoryValidator, validateRequest, ctrl.update);
router.delete("/:id", protect, adminOnly, categoryIdValidator, validateRequest, ctrl.remove);

export default router;
