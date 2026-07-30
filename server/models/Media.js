import mongoose from "mongoose";

/**
 * Media library — Cloudinary-backed assets with alt/caption for accessibility & SEO.
 */
const mediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
      index: true,
    },
    resourceType: {
      type: String,
      enum: ["image", "video", "raw", "auto"],
      default: "image",
    },
    format: {
      type: String,
      default: "",
    },
    width: Number,
    height: Number,
    bytes: Number,
    alt: {
      type: String,
      default: "",
      maxlength: 200,
    },
    caption: {
      type: String,
      default: "",
      maxlength: 300,
    },
    folder: {
      type: String,
      default: "",
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const Media = mongoose.model("Media", mediaSchema);

export default Media;
