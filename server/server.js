import app from "./app.js";
import config from "./config/index.js";

/**
 * Process entry point.
 * Boots the HTTP server on the configured port.
 */
app.listen(config.port, () => {
  console.log(`DIL & DATA API running on port ${config.port}`);
  console.log(`Health: http://localhost:${config.port}/api/health`);
});
