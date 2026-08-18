import app from "./app.js";
import config from "./config/index.js";
import { connectDatabase } from "./config/db.js";
import { configureCloudinary } from "./config/cloudinary.js";
import { publishDueScheduledContent } from "./services/scheduler.service.js";
import { setDatabaseReady } from "./config/dbReady.js";

/**
 * Process entry — bind the port first so cold starts can answer /health
 * while Mongo is still connecting.
 */
async function bootstrap() {
  if (config.nodeEnv === "production" && !config.mongoUri) {
    throw new Error("MONGODB_URI is required in production.");
  }

  configureCloudinary();

  app.listen(config.port, () => {
    console.log(`DIL & DATA API running on port ${config.port}`);
    console.log(`Health: http://localhost:${config.port}/api/health`);
  });

  if (config.mongoUri) {
    connectDatabase()
      .then(() => {
        setDatabaseReady(true);
        publishDueScheduledContent().catch((err) =>
          console.warn("Scheduler warm-up failed:", err.message)
        );
        setInterval(() => {
          publishDueScheduledContent().catch((err) =>
            console.warn("Scheduler tick failed:", err.message)
          );
        }, 60 * 1000);
      })
      .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
      });
  } else {
    setDatabaseReady(true);
    console.warn(
      "MONGODB_URI not set — API is running without a database connection."
    );
  }
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
