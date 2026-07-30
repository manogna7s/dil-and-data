import Like from "../models/Like.js";
import Content from "../models/Content.js";
import { AppError } from "../utils/AppError.js";

export async function toggleLike({ contentId, fingerprint, userId = null }) {
  const content = await Content.findById(contentId);
  if (!content || content.status !== "published") {
    throw new AppError("Content not found", 404);
  }

  const existing = await Like.findOne({ content: contentId, fingerprint });

  if (existing) {
    await existing.deleteOne();
    content.likesCount = Math.max(0, content.likesCount - 1);
    await content.save({ validateBeforeSave: false });
    return { liked: false, likesCount: content.likesCount };
  }

  await Like.create({
    content: contentId,
    fingerprint,
    user: userId,
  });

  content.likesCount += 1;
  await content.save({ validateBeforeSave: false });

  return { liked: true, likesCount: content.likesCount };
}

export async function getLikeStatus(contentId, fingerprint) {
  const [liked, content] = await Promise.all([
    Like.exists({ content: contentId, fingerprint }),
    Content.findById(contentId).select("likesCount"),
  ]);

  if (!content) throw new AppError("Content not found", 404);

  return {
    liked: Boolean(liked),
    likesCount: content.likesCount,
  };
}

export default { toggleLike, getLikeStatus };
