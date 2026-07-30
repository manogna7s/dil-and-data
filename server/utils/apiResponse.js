/**
 * Consistent API envelope for every endpoint.
 * { success, message, data, errors }
 */
export function sendSuccess(res, { statusCode = 200, message = "OK", data = null } = {}) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    errors: null,
  });
}

export function sendError(res, { statusCode = 500, message = "Error", errors = null } = {}) {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    errors,
  });
}

export default { sendSuccess, sendError };
