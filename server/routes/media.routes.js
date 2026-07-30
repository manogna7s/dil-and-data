import { Router } from "express";
import * as ctrl from "../controllers/media.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import {
  uploadMediaValidator,
  mediaIdValidator,
  listMediaValidator,
} from "../validators/media.validator.js";

const router = Router();

router.use(protect, adminOnly);

router.get("/", listMediaValidator, validateRequest, ctrl.list);
router.post(
  "/upload",
  upload.single("file"),
  uploadMediaValidator,
  validateRequest,
  ctrl.upload
);
router.delete("/:id", mediaIdValidator, validateRequest, ctrl.remove);

export default router;
