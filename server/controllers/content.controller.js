import * as contentService from "../services/content.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const create = asyncHandler(async (req, res) => {
  const item = await contentService.createContent(req.body, req.user._id);
  return sendSuccess(res, {
    statusCode: 201,
    message: "Content created",
    data: item,
  });
});

export const update = asyncHandler(async (req, res) => {
  const item = await contentService.updateContent(req.params.id, req.body);
  return sendSuccess(res, { message: "Content updated", data: item });
});

export const remove = asyncHandler(async (req, res) => {
  await contentService.deleteContent(req.params.id);
  return sendSuccess(res, { message: "Content deleted", data: null });
});

export const publish = asyncHandler(async (req, res) => {
  const item = await contentService.publishContent(req.params.id);
  return sendSuccess(res, { message: "Content published", data: item });
});

export const draft = asyncHandler(async (req, res) => {
  const item = await contentService.saveDraft(req.params.id);
  return sendSuccess(res, { message: "Saved as draft", data: item });
});

export const getOne = asyncHandler(async (req, res) => {
  const item = await contentService.getContentById(req.params.id);
  return sendSuccess(res, { message: "Content fetched", data: item });
});

export const getBySlug = asyncHandler(async (req, res) => {
  const item = await contentService.getContentBySlug(req.params.slug, {
    publicOnly: true,
  });
  return sendSuccess(res, { message: "Content fetched", data: item });
});

export const list = asyncHandler(async (req, res) => {
  const result = await contentService.listContent(req.query, { publicOnly: true });
  return sendSuccess(res, {
    message: "Content list",
    data: result,
  });
});

export const listAdmin = asyncHandler(async (req, res) => {
  const result = await contentService.listContent(req.query, { publicOnly: false });
  return sendSuccess(res, {
    message: "Admin content list",
    data: result,
  });
});

export const featured = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 6;
  const items = await contentService.getFeaturedContent(limit);
  return sendSuccess(res, { message: "Featured content", data: items });
});

export const recent = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 6;
  const items = await contentService.getRecentContent(limit);
  return sendSuccess(res, { message: "Recent content", data: items });
});

export default {
  create,
  update,
  remove,
  publish,
  draft,
  getOne,
  getBySlug,
  list,
  listAdmin,
  featured,
  recent,
};
