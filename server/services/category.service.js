import Category from "../models/Category.js";
import Content from "../models/Content.js";
import { AppError } from "../utils/AppError.js";
import { uniqueSlug } from "../utils/slug.js";

function pickCategoryFields(payload = {}) {
  const next = {};
  if (payload.title !== undefined) next.title = String(payload.title).trim();
  if (payload.description !== undefined) {
    next.description = payload.description == null ? "" : String(payload.description);
  }
  if (payload.coverImage !== undefined) {
    next.coverImage = payload.coverImage == null ? "" : String(payload.coverImage);
  }
  if (payload.icon !== undefined) {
    next.icon = payload.icon == null ? "" : String(payload.icon);
  }
  if (payload.isActive !== undefined) next.isActive = Boolean(payload.isActive);
  if (payload.layout !== undefined) {
    next.layout = payload.layout === "polaroid" ? "polaroid" : "default";
  }
  if (payload.slug !== undefined && payload.slug) next.slug = String(payload.slug).trim();
  return next;
}

export async function createCategory(payload) {
  const data = pickCategoryFields(payload);
  if (!data.title) throw new AppError("Title is required", 400);

  const slug = await uniqueSlug(Category, data.slug || data.title);
  const category = await Category.create({ ...data, slug });
  return category;
}

export async function updateCategory(id, payload) {
  const category = await Category.findById(id);
  if (!category) throw new AppError("Category not found", 404);

  const data = pickCategoryFields(payload);

  if (data.title || data.slug) {
    data.slug = await uniqueSlug(Category, data.slug || data.title, id);
  }

  Object.assign(category, data);
  await category.save();
  return category;
}

export async function deleteCategory(id) {
  const inUse = await Content.exists({ category: id });
  if (inUse) {
    throw new AppError("Cannot delete category that is used by content", 409);
  }

  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new AppError("Category not found", 404);
  return category;
}

export async function getCategoryById(id) {
  const category = await Category.findById(id);
  if (!category) throw new AppError("Category not found", 404);
  return category;
}

export async function getCategoryBySlug(slug) {
  const category = await Category.findOne({ slug, isActive: true });
  if (!category) throw new AppError("Category not found", 404);
  return category;
}

export async function listCategories({ includeInactive = false } = {}) {
  const filter = includeInactive ? {} : { isActive: true };
  const categories = await Category.find(filter).sort({ title: 1 });

  const withCounts = await Promise.all(
    categories.map(async (cat) => {
      const count = await Content.countDocuments({
        category: cat._id,
        status: "published",
      });
      return { ...cat.toObject(), count };
    })
  );

  return withCounts;
}

export default {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getCategoryBySlug,
  listCategories,
};
