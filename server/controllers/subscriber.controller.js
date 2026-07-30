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

export const remove = asyncHandler(async (req, res) => {
  await subscriberService.deleteSubscriber(req.params.id);
  return sendSuccess(res, { message: "Subscriber deleted", data: null });
});

export const exportCsv = asyncHandler(async (req, res) => {
  const csv = await subscriberService.exportSubscribersCsv(req.query);
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="subscribers-${Date.now()}.csv"`
  );
  return res.status(200).send(csv);
});

export default { subscribe, unsubscribe, list, remove, exportCsv };
