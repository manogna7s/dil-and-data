/**
 * Publish content whose scheduledFor has passed.
 * Called on a timer and before public reads.
 */
import Content from "../models/Content.js";

export async function publishDueScheduledContent() {
  const now = new Date();
  const result = await Content.updateMany(
    {
      status: "draft",
      scheduledFor: { $ne: null, $lte: now },
    },
    {
      $set: {
        status: "published",
        publishedAt: now,
      },
    }
  );
  return result.modifiedCount || 0;
}

export default { publishDueScheduledContent };
