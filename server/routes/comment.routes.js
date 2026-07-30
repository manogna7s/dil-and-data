import { Router } from "express";
import * as ctrl from "../controllers/comment.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import {
  createCommentValidator,
  commentIdValidator,
  moderateCommentValidator,
  listCommentsValidator,
  listAllCommentsValidator,
  bulkCommentsValidator,
  replyCommentValidator,
} from "../validators/comment.validator.js";

const router = Router();

router.get(
  "/content/:contentId",
  listCommentsValidator,
  validateRequest,
  ctrl.listByContent
);
router.post("/", createCommentValidator, validateRequest, ctrl.create);

router.get(
  "/admin",
  protect,
  adminOnly,
  listAllCommentsValidator,
  validateRequest,
  ctrl.list
);
router.get(
  "/admin/content/:contentId",
  protect,
  adminOnly,
  listCommentsValidator,
  validateRequest,
  ctrl.listAdmin
);
router.post(
  "/admin/bulk-moderate",
  protect,
  adminOnly,
  bulkCommentsValidator,
  validateRequest,
  ctrl.bulkModerate
);
router.post(
  "/admin/bulk-delete",
  protect,
  adminOnly,
  bulkCommentsValidator,
  validateRequest,
  ctrl.bulkRemove
);
router.post(
  "/:id/reply",
  protect,
  adminOnly,
  replyCommentValidator,
  validateRequest,
  ctrl.reply
);
router.patch(
  "/:id/moderate",
  protect,
  adminOnly,
  moderateCommentValidator,
  validateRequest,
  ctrl.moderate
);
router.patch("/:id", protect, adminOnly, commentIdValidator, validateRequest, ctrl.update);
router.delete("/:id", protect, adminOnly, commentIdValidator, validateRequest, ctrl.remove);

export default router;
