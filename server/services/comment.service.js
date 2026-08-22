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

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Global moderation inbox */
export async function listAllComments(query = {}) {
  const filter = {};
  if (query.status && query.status !== "all") filter.status = query.status;

  if (query.q) {
    const keyword = escapeRegex(query.q.trim());
    filter.$or = [
      { authorName: { $regex: keyword, $options: "i" } },
      { authorEmail: { $regex: keyword, $options: "i" } },
      { body: { $regex: keyword, $options: "i" } },
    ];
  }

  const { page, limit, skip } = getPagination(query);

  const [items, total] = await Promise.all([
    Comment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("content", "title slug type"),
    Comment.countDocuments(filter),
  ]);

  return { items, pagination: buildPaginationMeta({ total, page, limit }) };
}

export async function moderateComment(id, status) {
  const comment = await Comment.findById(id);
  if (!comment) throw new AppError("Comment not found", 404);
  comment.status = status;
  await comment.save();
  return comment.populate("content", "title slug type");
}

export async function bulkModerateComments(ids = [], status) {
  const unique = [...new Set(ids.map(String))];
  if (!unique.length) throw new AppError("No comment ids provided", 400);
  if (!["pending", "approved", "rejected", "spam"].includes(status)) {
    throw new AppError("Invalid status", 400);
  }

  await Comment.updateMany({ _id: { $in: unique } }, { $set: { status } });
  return { updatedCount: unique.length, status };
}

export async function bulkDeleteComments(ids = []) {
  const unique = [...new Set(ids.map(String))];
  if (!unique.length) throw new AppError("No comment ids provided", 400);

  const result = await Comment.deleteMany({
    $or: [{ _id: { $in: unique } }, { parent: { $in: unique } }],
  });

  return { deletedCount: result.deletedCount || 0 };
}

/** Admin reply — auto-approved */
export async function replyToComment(parentId, { body, authorName = "Shakti", authorEmail = "" }) {
  const parent = await Comment.findById(parentId);
  if (!parent) throw new AppError("Parent comment not found", 404);

  const reply = await Comment.create({
    content: parent.content,
    parent: parent._id,
    authorName,
    authorEmail: authorEmail || "studio@dilanddata.com",
    body,
    status: "approved",
  });

  return reply.populate("content", "title slug type");
}

export default {
  createComment,
  updateComment,
  deleteComment,
  listCommentsByContent,
  listAllComments,
  moderateComment,
  bulkModerateComments,
  bulkDeleteComments,
  replyToComment,
};
