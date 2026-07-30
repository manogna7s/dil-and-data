import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import contentRoutes from "./content.routes.js";
import categoryRoutes from "./category.routes.js";
import commentRoutes from "./comment.routes.js";
import likeRoutes from "./like.routes.js";
import subscriberRoutes from "./subscriber.routes.js";
import mediaRoutes from "./media.routes.js";
import settingsRoutes from "./settings.routes.js";

/**
 * Mount all API modules under /api.
 */
const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/content", contentRoutes);
router.use("/categories", categoryRoutes);
router.use("/comments", commentRoutes);
router.use("/likes", likeRoutes);
router.use("/subscribers", subscriberRoutes);
router.use("/media", mediaRoutes);
router.use("/settings", settingsRoutes);

export default router;
