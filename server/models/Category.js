import mongoose from "mongoose";

/**
 * Categories — shared taxonomy across all content types.
 */
const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Category title is required"],
      trim: true,
      maxlength: 80,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      maxlength: 500,
    },
    coverImage: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    /** `polaroid` — bucket-list posts use floating polaroid + text rows */
    layout: {
      type: String,
      enum: ["default", "polaroid"],
      default: "default",
    },
  },
  { timestamps: true }
);

categorySchema.index({ title: "text", description: "text" });

const Category = mongoose.model("Category", categorySchema);

export default Category;
