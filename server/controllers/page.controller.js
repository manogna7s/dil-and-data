import * as pageService from "../services/page.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { PAGE_BLOCK_TYPES, defaultBlockData } from "../constants/pageBlocks.js";

export const create = asyncHandler(async (req, res) => {
  const page = await pageService.createPage(req.body);
  return sendSuccess(res, { statusCode: 201, message: "Page created", data: page });
});

export const update = asyncHandler(async (req, res) => {
  const page = await pageService.updatePage(req.params.id, req.body);
  return sendSuccess(res, { message: "Page updated", data: page });
});

export const remove = asyncHandler(async (req, res) => {
  await pageService.deletePage(req.params.id);
  return sendSuccess(res, { message: "Page deleted", data: null });
});

export const getOne = asyncHandler(async (req, res) => {
  const page = await pageService.getPageById(req.params.id);
  return sendSuccess(res, { message: "Page fetched", data: page });
});

export const getBySlug = asyncHandler(async (req, res) => {
  const page = await pageService.getPageBySlug(req.params.slug, { publicOnly: true });
  return sendSuccess(res, { message: "Page fetched", data: page });
});

/** Studio preview — draft pages too */
export const getBySlugAdmin = asyncHandler(async (req, res) => {
  const page = await pageService.getPageBySlug(req.params.slug, { publicOnly: false });
  return sendSuccess(res, { message: "Page fetched", data: page });
});

export const list = asyncHandler(async (req, res) => {
  const pages = await pageService.listPages({ status: req.query.status });
  return sendSuccess(res, { message: "Pages list", data: pages });
});

export const nav = asyncHandler(async (_req, res) => {
  const pages = await pageService.listNavPages();
  return sendSuccess(res, { message: "Nav pages", data: pages });
});

export const blockTypes = asyncHandler(async (_req, res) => {
  const types = PAGE_BLOCK_TYPES.map((type) => ({
    type,
    defaults: defaultBlockData(type),
  }));
  return sendSuccess(res, { message: "Block types", data: types });
});

export default {
  create,
  update,
  remove,
  getOne,
  getBySlug,
  getBySlugAdmin,
  list,
  nav,
  blockTypes,
};
