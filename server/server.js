import app from "./app.js";
import config from "./config/index.js";
import { connectDatabase } from "./config/db.js";
import { configureCloudinary } from "./config/cloudinary.js";
import { publishDueScheduledContent } from "./services/scheduler.service.js";

/**
 * Process entry — connect infrastructure, then listen.
 */
async function bootstrap() {
  if (config.nodeEnv === "production" && !config.mongoUri) {
    throw new Error("MONGODB_URI is required in production.");
  }

  configureCloudinary();

  if (config.mongoUri) {
    await connectDatabase();
    // Publish any posts whose schedule has already elapsed.
    publishDueScheduledContent().catch((err) =>
      console.warn("Scheduler warm-up failed:", err.message)
    );
    setInterval(() => {
      publishDueScheduledContent().catch((err) =>
        console.warn("Scheduler tick failed:", err.message)
      );
    }, 60 * 1000);
  } else {
    console.warn(
      "MONGODB_URI not set — API is running without a database connection."
    );
  }

  app.listen(config.port, () => {
    console.log(`DIL & DATA API running on port ${config.port}`);
    console.log(`Health: http://localhost:${config.port}/api/health`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
