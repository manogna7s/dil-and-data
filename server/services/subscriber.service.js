import Subscriber from "../models/Subscriber.js";
import { AppError } from "../utils/AppError.js";
import { getPagination, buildPaginationMeta } from "../utils/pagination.js";

export async function subscribe({ email, name = "" }) {
  const existing = await Subscriber.findOne({ email: email.toLowerCase() });

  if (existing) {
    if (existing.isActive) {
      throw new AppError("Already subscribed", 409);
    }
    existing.isActive = true;
    existing.unsubscribedAt = null;
    if (name) existing.name = name;
    await existing.save();
    return existing;
  }

  return Subscriber.create({ email, name });
}

export async function unsubscribe(email) {
  const subscriber = await Subscriber.findOne({ email: email.toLowerCase() });
  if (!subscriber) throw new AppError("Subscriber not found", 404);

  subscriber.isActive = false;
  subscriber.unsubscribedAt = new Date();
  await subscriber.save();
  return subscriber;
}

export async function listSubscribers(query = {}) {
  const { page, limit, skip } = getPagination(query);
  const filter = {};
  if (query.active === "true") filter.isActive = true;
  if (query.active === "false") filter.isActive = false;

  if (query.q) {
    const keyword = String(query.q).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { email: { $regex: keyword, $options: "i" } },
      { name: { $regex: keyword, $options: "i" } },
    ];
  }

  const [items, total] = await Promise.all([
    Subscriber.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Subscriber.countDocuments(filter),
  ]);

  return { items, pagination: buildPaginationMeta({ total, page, limit }) };
}

export async function deleteSubscriber(id) {
  const doc = await Subscriber.findByIdAndDelete(id);
  if (!doc) throw new AppError("Subscriber not found", 404);
  return doc;
}

export async function exportSubscribersCsv(query = {}) {
  const filter = {};
  if (query.active === "true") filter.isActive = true;
  if (query.active === "false") filter.isActive = false;

  const items = await Subscriber.find(filter).sort({ createdAt: -1 });
  const header = ["email", "name", "isActive", "createdAt", "unsubscribedAt"];
  const rows = items.map((s) =>
    [
      s.email,
      s.name || "",
      s.isActive ? "true" : "false",
      s.createdAt?.toISOString?.() || "",
      s.unsubscribedAt?.toISOString?.() || "",
    ]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(",")
  );

  return [header.join(","), ...rows].join("\n");
}

export default {
  subscribe,
  unsubscribe,
  listSubscribers,
  deleteSubscriber,
  exportSubscribersCsv,
};
