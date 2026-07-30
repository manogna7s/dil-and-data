import mongoose from "mongoose";
import { PAGE_BLOCK_TYPES, PAGE_STATUSES } from "../constants/pageBlocks.js";

const blockSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: PAGE_BLOCK_TYPES,
    },
    enabled: { type: Boolean, default: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const seoSchema = new mongoose.Schema(
  {
    title: { type: String, default: "", maxlength: 120 },
    description: { type: String, default: "", maxlength: 300 },
    image: { type: String, default: "" },
  },
  { _id: false }
);

/**
 * CMS page — ordered blocks drive the public site.
 * New journal shelves = new Page docs, not new React routes.
 */
const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 120,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 120,
    },
    status: {
      type: String,
      enum: PAGE_STATUSES,
      default: "draft",
      index: true,
    },
    showInNav: {
      type: Boolean,
      default: false,
      index: true,
    },
    navLabel: {
      type: String,
      default: "",
      maxlength: 40,
    },
    navOrder: {
      type: Number,
      default: 100,
    },
    seo: {
      type: seoSchema,
      default: () => ({}),
    },
    blocks: {
      type: [blockSchema],
      default: [],
    },
  },
  { timestamps: true }
);

pageSchema.index({ status: 1, showInNav: 1, navOrder: 1 });

const Page = mongoose.model("Page", pageSchema);

export default Page;
