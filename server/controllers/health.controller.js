/**
 * Health check controller.
 * Confirms the API process is alive — used by monitors and deploys.
 */
export function getHealth(_req, res) {
  res.status(200).json({
    status: "OK",
    message: "DIL & DATA API Running",
  });
}
