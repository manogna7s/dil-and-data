import mongoose from "mongoose";

/**
 * Likes — one like per visitor fingerprint (or user if logged in).
 * Supports anonymous likes via client fingerprint / IP hash later.
 */
const likeSchema = new mongoose.Schema(
  {
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    fingerprint: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

likeSchema.index({ content: 1, fingerprint: 1 }, { unique: true });

const Like = mongoose.model("Like", likeSchema);

export default Like;
