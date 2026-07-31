import mongoose from "mongoose";

/**
 * Nested comments with soft moderation (approval status).
 */
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      required: true,
      index: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true,
    },
    authorName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 80,
    },
    authorEmail: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },
    body: {
      type: String,
      required: [true, "Comment body is required"],
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "spam"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
