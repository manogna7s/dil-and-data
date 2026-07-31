import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import config from "./config/index.js";
import apiRoutes from "./routes/index.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";
import { apiRateLimiter } from "./middleware/rateLimit.middleware.js";

/**
 * Express application — middleware stack + API mount.
 * Separated from server.js for testability.
 */
const app = express();

app.set("trust proxy", 1);

app.use(
  helmet({
    // API is called cross-origin from the Vite app (different port).
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(compression());

/**
 * CORS — allow configured CLIENT_URL plus any localhost Vite port in development
 * (Vite bumps 5173 → 5174… when ports are busy).
 */
const extraOrigins = String(process.env.CLIENT_URLS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function normalizeOrigin(value = "") {
  return String(value).trim().replace(/\/$/, "");
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const allowed = new Set(
        [normalizeOrigin(config.clientUrl), ...extraOrigins.map(normalizeOrigin)].filter(
          Boolean
        )
      );
      if (allowed.has(normalizeOrigin(origin))) return callback(null, true);

      if (
        config.nodeEnv !== "production" &&
        /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
      ) {
        return callback(null, true);
      }

      // Reject without throwing — throwing makes cors return HTTP 500.
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));
app.use("/api", apiRateLimiter);

app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
