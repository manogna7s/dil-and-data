import { apiRequest } from "../services/api.js";
import { formatBlogDate } from "../utils/formatDate.js";

/** Public content helpers for live feed blocks (no auth). */

export async function fetchFeaturedContent(limit = 1) {
  const result = await apiRequest(`/content/featured?limit=${limit}`, { auth: false });
  return result.data;
}

export async function fetchRecentContent(limit = 6) {
  const result = await apiRequest(`/content/recent?limit=${limit}`, { auth: false });
  return result.data;
}

export async function fetchPublicCategories() {
  const result = await apiRequest("/categories", { auth: false });
  return result.data;
}

export function toCardProps(item) {
  if (!item) return null;
  return {
    id: item._id || item.id,
    title: item.title,
    excerpt: item.excerpt,
    coverImage: item.coverImage,
    image: item.coverImage,
    slug: item.slug,
    category: item.category?.title || item.category?.name || "",
    categoryName: item.category?.title || item.category?.name || "Journal",
    readingTime: item.readingTime || 1,
    publishedAt: item.publishedAt,
    date: item.publishedAt ? formatBlogDate(item.publishedAt) : "",
  };
}
