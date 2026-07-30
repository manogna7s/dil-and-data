import * as likeService from "../services/like.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const toggle = asyncHandler(async (req, res) => {
  const result = await likeService.toggleLike({
    contentId: req.body.contentId,
    fingerprint: req.body.fingerprint,
    userId: req.user?._id || null,
  });

  return sendSuccess(res, {
    message: result.liked ? "Liked" : "Unliked",
    data: result,
  });
});

export const status = asyncHandler(async (req, res) => {
  const result = await likeService.getLikeStatus(
    req.params.contentId,
    req.query.fingerprint
  );
  return sendSuccess(res, { message: "Like status", data: result });
});

export default { toggle, status };
