/* Route path constants — keep URLs in one place */

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  BLOGS: "/blogs",
  BLOG: "/blogs/:slug",
  CATEGORIES: "/categories",
  CATEGORY: "/categories/:slug",
  CONTACT: "/contact",
  NOT_FOUND: "*",
  STUDIO: "/studio",
  STUDIO_LOGIN: "/studio/login",
};

/** Build a category archive URL from slug or id. */
export function categoryPath(slugOrId) {
  if (!slugOrId) return ROUTES.CATEGORIES;
  return `${ROUTES.CATEGORIES}/${encodeURIComponent(String(slugOrId))}`;
}

export const SITE = {
  NAME: "DIL & DATA",
  AUTHOR: "Manogna",
  BLOG_NAME: "Stories",
  TAGLINE: "The Everything Journal of a Slightly Strange Girl.",
  STUDIO_NAME: "Creator Studio",
  CANONICAL_BASE: "https://www.dilanddata.in",
};
