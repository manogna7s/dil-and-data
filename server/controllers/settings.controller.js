import * as settingsService from "../services/settings.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const get = asyncHandler(async (_req, res) => {
  const data = await settingsService.getSettings();
  return sendSuccess(res, { message: "Settings fetched", data });
});

export const update = asyncHandler(async (req, res) => {
  const data = await settingsService.updateSettings(req.body);
  return sendSuccess(res, { message: "Settings updated", data });
});

export default { get, update };
