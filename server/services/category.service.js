import Category from "../models/Category.js";
import Content from "../models/Content.js";
import { AppError } from "../utils/AppError.js";
import { uniqueSlug } from "../utils/slug.js";

export async function createCategory(payload) {
  const slug = await uniqueSlug(Category, payload.slug || payload.title);
  const category = await Category.create({ ...payload, slug });
  return category;
}

export async function updateCategory(id, payload) {
  const category = await Category.findById(id);
  if (!category) throw new AppError("Category not found", 404);

  if (payload.title || payload.slug) {
    payload.slug = await uniqueSlug(Category, payload.slug || payload.title, id);
  }

  Object.assign(category, payload);
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
