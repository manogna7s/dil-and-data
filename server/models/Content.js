import mongoose from "mongoose";

/**
 * CONTENT TYPES — extend this enum as the journal grows.
 * No new collection required for Books, Poetry, Coffee Journal, etc.
 */
export const CONTENT_TYPES = [
  "blog",
  "travel",
  "books",
  "photography",
  "diary",
  "poetry",
  "projects",
  "coffee-journal",
  "reading-notes",
  "monthly-letter",
];

export const CONTENT_STATUSES = ["draft", "published", "archived"];

const seoSchema = new mongoose.Schema(
  {
    title: { type: String, default: "", maxlength: 120 },
    description: { type: String, default: "", maxlength: 300 },
    image: { type: String, default: "" },
    canonicalSlug: { type: String, default: "" },
  },
  { _id: false }
);

const mediaRefSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
    alt: { type: String, default: "" },
    caption: { type: String, default: "" },
  },
  { _id: false }
);

/**
 * Polymorphic content document — the heart of the CMS.
 */
const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      default: "",
      maxlength: 500,
    },
    body: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    gallery: {
      type: [mediaRefSchema],
      default: [],
    },
    videos: {
      type: [mediaRefSchema],
      default: [],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: CONTENT_TYPES,
      default: "blog",
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    status: {
      type: String,
      enum: CONTENT_STATUSES,
      default: "draft",
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    readingTime: {
      type: Number,
      default: 1,
      min: 1,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    seo: {
      type: seoSchema,
      default: () => ({}),
    },
    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

contentSchema.index({ title: "text", excerpt: "text", body: "text", tags: "text" });
contentSchema.index({ type: 1, status: 1, publishedAt: -1 });
contentSchema.index({ featured: 1, status: 1, publishedAt: -1 });

const Content = mongoose.model("Content", contentSchema);

export default Content;
