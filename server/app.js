import express from "express";
import cors from "cors";
import config from "./config/index.js";
import apiRoutes from "./routes/index.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";

/**
 * Express application factory.
 * Separated from server.js so the app can be tested without listening.
 */
const app = express();

app.use(
  cors({
    origin: config.clientUrl,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
