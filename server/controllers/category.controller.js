import * as categoryService from "../services/category.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const create = asyncHandler(async (req, res) => {
  const item = await categoryService.createCategory(req.body);
  return sendSuccess(res, { statusCode: 201, message: "Category created", data: item });
});

export const update = asyncHandler(async (req, res) => {
  const item = await categoryService.updateCategory(req.params.id, req.body);
  return sendSuccess(res, { message: "Category updated", data: item });
});

export const remove = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  return sendSuccess(res, { message: "Category deleted", data: null });
});

export const getOne = asyncHandler(async (req, res) => {
  const item = await categoryService.getCategoryById(req.params.id);
  return sendSuccess(res, { message: "Category fetched", data: item });
});

export const getBySlug = asyncHandler(async (req, res) => {
  const item = await categoryService.getCategoryBySlug(req.params.slug);
  return sendSuccess(res, { message: "Category fetched", data: item });
});

export const list = asyncHandler(async (_req, res) => {
  const items = await categoryService.listCategories();
  return sendSuccess(res, { message: "Categories list", data: items });
});

export const listAdmin = asyncHandler(async (_req, res) => {
  const items = await categoryService.listCategories({ includeInactive: true });
  return sendSuccess(res, { message: "Admin categories list", data: items });
});

export default { create, update, remove, getOne, getBySlug, list, listAdmin };
