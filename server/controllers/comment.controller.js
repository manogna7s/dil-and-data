import * as commentService from "../services/comment.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const create = asyncHandler(async (req, res) => {
  const item = await commentService.createComment(req.body);
  return sendSuccess(res, {
    statusCode: 201,
    message: "Comment submitted for review",
    data: item,
  });
});

export const update = asyncHandler(async (req, res) => {
  const item = await commentService.updateComment(req.params.id, req.body);
  return sendSuccess(res, { message: "Comment updated", data: item });
});

export const remove = asyncHandler(async (req, res) => {
  await commentService.deleteComment(req.params.id);
  return sendSuccess(res, { message: "Comment deleted", data: null });
});

export const listByContent = asyncHandler(async (req, res) => {
  const result = await commentService.listCommentsByContent(req.params.contentId, req.query, {
    publicOnly: true,
  });
  return sendSuccess(res, { message: "Comments list", data: result });
});

export const list = asyncHandler(async (req, res) => {
  const result = await commentService.listAllComments(req.query);
  return sendSuccess(res, { message: "Admin comments list", data: result });
});

export const listAdmin = asyncHandler(async (req, res) => {
  const result = await commentService.listCommentsByContent(req.params.contentId, req.query, {
    publicOnly: false,
  });
  return sendSuccess(res, { message: "Admin comments list", data: result });
});

export const moderate = asyncHandler(async (req, res) => {
  const item = await commentService.moderateComment(req.params.id, req.body.status);
  return sendSuccess(res, { message: "Comment moderated", data: item });
});

export const bulkModerate = asyncHandler(async (req, res) => {
  const result = await commentService.bulkModerateComments(req.body.ids, req.body.status);
  return sendSuccess(res, { message: "Comments moderated", data: result });
});

export const bulkRemove = asyncHandler(async (req, res) => {
  const result = await commentService.bulkDeleteComments(req.body.ids);
  return sendSuccess(res, { message: "Comments deleted", data: result });
});

export const reply = asyncHandler(async (req, res) => {
  const item = await commentService.replyToComment(req.params.id, {
    body: req.body.body,
    authorName: req.body.authorName || req.user?.name,
    authorEmail: req.body.authorEmail || req.user?.email,
  });
  return sendSuccess(res, { statusCode: 201, message: "Reply posted", data: item });
});

export default {
  create,
  update,
  remove,
  listByContent,
  list,
  listAdmin,
  moderate,
  bulkModerate,
  bulkRemove,
  reply,
};
