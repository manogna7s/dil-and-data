/**
 * Data barrel — pages import from here.
 * Later phases: thin wrappers that call services/ → APIs.
 */

export { IMAGES, PLACEHOLDER_IMAGES } from "./images.js";
export {
  CATEGORIES,
  getCategoryBySlug,
} from "./categories.js";
export { PHOTOGRAPHY } from "./photography.js";
export { QUOTES, getFeaturedQuote } from "./quotes.js";
export { BOOKS } from "./books.js";
export { TIMELINE } from "./timeline.js";
export { FAQ } from "./faq.js";
export {
  SOCIALS,
  FOOTER_SOCIALS,
  CONTACT_SOCIALS,
  SOCIAL_LINKS,
} from "./socials.js";
export { ABOUT } from "./about.js";
export {
  BLOGS,
  getBlogBySlug,
  getFeaturedBlog,
  getLatestBlogs,
  getPopularBlogs,
  getRelatedBlogs,
  getAdjacentBlogs,
  getBlogsByCategory,
  formatBlogDate,
  toBlogCard,
  PLACEHOLDER_POSTS,
} from "./blogs.js";

/** Categories with live article counts from blogs */
import { CATEGORIES as CATS } from "./categories.js";
import { BLOGS as POSTS } from "./blogs.js";

export function getCategoriesWithCounts() {
  return CATS.map((cat) => ({
    ...cat,
    count: POSTS.filter((b) => b.category === cat.slug).length,
    href: `/categories?category=${cat.slug}`,
  }));
}

export const PLACEHOLDER_CATEGORIES = getCategoriesWithCounts().map((c) => ({
  id: c.id,
  name: c.name,
  count: c.count,
  image: c.image,
}));
