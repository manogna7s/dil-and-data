/**
 * Health check — used by monitors and deploys.
 */
export function getHealth(_req, res) {
  res.status(200).json({
    success: true,
    message: "DIL & DATA API Running",
    data: {
      status: "OK",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    errors: null,
  });
}

export default { getHealth };
