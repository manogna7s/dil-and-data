import Comment from "../models/Comment.js";
import Content from "../models/Content.js";
import { AppError } from "../utils/AppError.js";
import { getPagination, buildPaginationMeta } from "../utils/pagination.js";

export async function createComment(payload) {
  const content = await Content.findById(payload.content);
  if (!content || content.status !== "published") {
    throw new AppError("Content not found", 404);
  }

  if (payload.parent) {
    const parent = await Comment.findById(payload.parent);
    if (!parent) throw new AppError("Parent comment not found", 404);
  }

  return Comment.create(payload);
}

export async function updateComment(id, payload) {
  const comment = await Comment.findById(id);
  if (!comment) throw new AppError("Comment not found", 404);

  Object.assign(comment, payload);
  await comment.save();
  return comment;
}

export async function deleteComment(id) {
  const comment = await Comment.findByIdAndDelete(id);
  if (!comment) throw new AppError("Comment not found", 404);

  await Comment.deleteMany({ parent: id });
  return comment;
}

export async function listCommentsByContent(contentId, query = {}, { publicOnly = true } = {}) {
  const filter = { content: contentId };
  if (publicOnly) filter.status = "approved";
  else if (query.status) filter.status = query.status;

  const { page, limit, skip } = getPagination(query);

  const [items, total] = await Promise.all([
    Comment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Comment.countDocuments(filter),
  ]);

  return { items, pagination: buildPaginationMeta({ total, page, limit }) };
}

export async function moderateComment(id, status) {
  const comment = await Comment.findById(id);
  if (!comment) throw new AppError("Comment not found", 404);
  comment.status = status;
  await comment.save();
  return comment;
}

export default {
  createComment,
  updateComment,
  deleteComment,
  listCommentsByContent,
  moderateComment,
};
