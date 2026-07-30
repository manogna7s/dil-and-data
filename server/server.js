import app from "./app.js";
import config from "./config/index.js";
import { connectDatabase } from "./config/db.js";
import { configureCloudinary } from "./config/cloudinary.js";

/**
 * Process entry — connect infrastructure, then listen.
 */
async function bootstrap() {
  configureCloudinary();

  if (config.mongoUri) {
    await connectDatabase();
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
