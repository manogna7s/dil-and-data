import { Router } from "express";
import * as ctrl from "../controllers/subscriber.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { param } from "express-validator";
import {
  subscribeValidator,
  unsubscribeValidator,
  listSubscribersValidator,
} from "../validators/subscriber.validator.js";

const router = Router();

router.post("/subscribe", subscribeValidator, validateRequest, ctrl.subscribe);
router.post("/unsubscribe", unsubscribeValidator, validateRequest, ctrl.unsubscribe);
router.get(
  "/",
  protect,
  adminOnly,
  listSubscribersValidator,
  validateRequest,
  ctrl.list
);
router.get("/export", protect, adminOnly, listSubscribersValidator, validateRequest, ctrl.exportCsv);
router.delete(
  "/:id",
  protect,
  adminOnly,
  [param("id").isMongoId()],
  validateRequest,
  ctrl.remove
);

export default router;
