import { Router } from "express";
import * as ctrl from "../controllers/media.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import {
  uploadMediaValidator,
  updateMediaValidator,
  mediaIdValidator,
  listMediaValidator,
  bulkDeleteValidator,
} from "../validators/media.validator.js";

const router = Router();

router.use(protect, adminOnly);

router.get("/folders", ctrl.folders);
router.get("/", listMediaValidator, validateRequest, ctrl.list);
router.get("/:id", mediaIdValidator, validateRequest, ctrl.getOne);

router.post(
  "/upload",
  upload.single("file"),
  uploadMediaValidator,
  validateRequest,
  ctrl.upload
);
router.post(
  "/upload/bulk",
  upload.array("files", 20),
  uploadMediaValidator,
  validateRequest,
  ctrl.uploadBulk
);
router.post(
  "/bulk-delete",
  bulkDeleteValidator,
  validateRequest,
  ctrl.bulkRemove
);

router.patch("/:id", updateMediaValidator, validateRequest, ctrl.update);
router.post(
  "/:id/replace",
  upload.single("file"),
  mediaIdValidator,
  uploadMediaValidator,
  validateRequest,
  ctrl.replace
);
router.delete("/:id", mediaIdValidator, validateRequest, ctrl.remove);

export default router;
