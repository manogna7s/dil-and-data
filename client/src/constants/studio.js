/**
 * Studio route constants — keep CMS URLs in one place.
 */
export const STUDIO = {
  ROOT: "/studio",
  LOGIN: "/studio/login",
  DASHBOARD: "/studio",
  CONTENT: "/studio/content",
  CONTENT_NEW: "/studio/content/new",
  CONTENT_EDIT: "/studio/content/:id",
  MEDIA: "/studio/media",
  PAGES: "/studio/pages",
  CATEGORIES: "/studio/categories",
  COMMENTS: "/studio/comments",
  SUBSCRIBERS: "/studio/subscribers",
  SEO: "/studio/seo",
  SETTINGS: "/studio/settings",
};

export const STUDIO_NAV = [
  { id: "dashboard", label: "Dashboard", path: STUDIO.DASHBOARD, end: true },
  { id: "content", label: "Content", path: STUDIO.CONTENT },
  { id: "media", label: "Media", path: STUDIO.MEDIA },
  { id: "pages", label: "Pages", path: STUDIO.PAGES },
  { id: "categories", label: "Categories", path: STUDIO.CATEGORIES },
  { id: "comments", label: "Comments", path: STUDIO.COMMENTS },
  { id: "subscribers", label: "Subscribers", path: STUDIO.SUBSCRIBERS },
  { id: "seo", label: "SEO", path: STUDIO.SEO },
  { id: "settings", label: "Settings", path: STUDIO.SETTINGS },
];
