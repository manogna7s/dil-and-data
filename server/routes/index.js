import { Router } from "express";
import healthRoutes from "./health.routes.js";

/**
 * Mount all API route modules under /api.
 */
const router = Router();

router.use("/health", healthRoutes);

export default router;
