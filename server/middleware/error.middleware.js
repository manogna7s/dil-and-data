/**
 * Global error handler placeholder.
 * Expand with logging and typed error responses in later phases.
 */
export function errorHandler(err, _req, res, _next) {
  console.error(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
}

/**
 * 404 handler for unknown API routes.
 */
export function notFoundHandler(_req, res) {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
}
