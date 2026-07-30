import * as mediaService from "../services/media.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const upload = asyncHandler(async (req, res) => {
  const item = await mediaService.uploadMedia(req.file, {
    alt: req.body.alt,
    caption: req.body.caption,
    title: req.body.title,
    folder: req.body.folder,
    userId: req.user._id,
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: "Media uploaded",
    data: item,
  });
});

export const uploadBulk = asyncHandler(async (req, res) => {
  const items = await mediaService.uploadMany(req.files || [], {
    alt: req.body.alt,
    caption: req.body.caption,
    folder: req.body.folder,
    userId: req.user._id,
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: "Media uploaded",
    data: items,
  });
});

export const update = asyncHandler(async (req, res) => {
  const item = await mediaService.updateMedia(req.params.id, req.body);
  return sendSuccess(res, { message: "Media updated", data: item });
});

export const replace = asyncHandler(async (req, res) => {
  const item = await mediaService.replaceMedia(req.params.id, req.file, {
    title: req.body.title,
    alt: req.body.alt,
    caption: req.body.caption,
    folder: req.body.folder,
  });
  return sendSuccess(res, { message: "Media replaced", data: item });
});

export const remove = asyncHandler(async (req, res) => {
  await mediaService.deleteMedia(req.params.id);
  return sendSuccess(res, { message: "Media deleted", data: null });
});

export const bulkRemove = asyncHandler(async (req, res) => {
  const result = await mediaService.bulkDeleteMedia(req.body.ids);
  return sendSuccess(res, { message: "Media deleted", data: result });
});

export const list = asyncHandler(async (req, res) => {
  const result = await mediaService.listMedia(req.query);
  return sendSuccess(res, { message: "Media list", data: result });
});

export const getOne = asyncHandler(async (req, res) => {
  const item = await mediaService.getMediaById(req.params.id);
  return sendSuccess(res, { message: "Media fetched", data: item });
});

export const folders = asyncHandler(async (_req, res) => {
  const items = await mediaService.listFolders();
  return sendSuccess(res, { message: "Media folders", data: items });
});

export default {
  upload,
  uploadBulk,
  update,
  replace,
  remove,
  bulkRemove,
  list,
  getOne,
  folders,
};
