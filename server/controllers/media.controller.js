import * as mediaService from "../services/media.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const upload = asyncHandler(async (req, res) => {
  const item = await mediaService.uploadMedia(req.file, {
    alt: req.body.alt,
    caption: req.body.caption,
    userId: req.user._id,
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: "Media uploaded",
    data: item,
  });
});

export const remove = asyncHandler(async (req, res) => {
  await mediaService.deleteMedia(req.params.id);
  return sendSuccess(res, { message: "Media deleted", data: null });
});

export const list = asyncHandler(async (req, res) => {
  const result = await mediaService.listMedia(req.query);
  return sendSuccess(res, { message: "Media list", data: result });
});

export default { upload, remove, list };
