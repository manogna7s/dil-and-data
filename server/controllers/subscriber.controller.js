import * as subscriberService from "../services/subscriber.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const subscribe = asyncHandler(async (req, res) => {
  const item = await subscriberService.subscribe(req.body);
  return sendSuccess(res, {
    statusCode: 201,
    message: "Subscribed successfully",
    data: item,
  });
});

export const unsubscribe = asyncHandler(async (req, res) => {
  const item = await subscriberService.unsubscribe(req.body.email);
  return sendSuccess(res, { message: "Unsubscribed successfully", data: item });
});

export const list = asyncHandler(async (req, res) => {
  const result = await subscriberService.listSubscribers(req.query);
  return sendSuccess(res, { message: "Subscribers list", data: result });
});

export default { subscribe, unsubscribe, list };
