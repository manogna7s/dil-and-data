/**
 * Block-based page builder — type registry shared by API validation & Studio.
 * Adding a block type: append here, add defaultData, add a React renderer.
 */

export const PAGE_BLOCK_TYPES = [
  "hero",
  "featuredStory",
  "photographyCarousel",
  "latestStories",
  "categories",
  "quote",
  "newsletter",
  "aboutPreview",
  "features",
  "divider",
  "image",
  "gallery",
  "video",
  "richText",
  "timeline",
  "bookshelf",
  "faq",
  "cta",
  "embed",
];

export const PAGE_STATUSES = ["draft", "published"];

/** Slugs reserved for non-CMS public routes */
export const RESERVED_PAGE_SLUGS = [
  "blogs",
  "categories",
  "contact",
  "studio",
  "api",
  "login",
  "admin",
];

export function defaultBlockData(type) {
  const defaults = {
    hero: {
      eyebrow: "Shakti's Blog",
      title: "DIL & DATA",
      tagline: "A personal journal of heart, curiosity, and quiet strength",
      ctaLabel: "Enter the journal",
      ctaTo: "/blogs",
      secondaryLabel: "About Manogna",
      secondaryTo: "/about",
    },
    featuredStory: {
      source: "featured",
      contentId: "",
    },
    photographyCarousel: {
      title: "",
      items: [],
    },
    latestStories: {
      title: "Latest stories",
      limit: 6,
      seeAllLabel: "View all",
      seeAllTo: "/blogs",
      contentType: "",
    },
    categories: {
      title: "Browse categories",
      tone: "muted",
    },
    quote: {
      text: "",
      attribution: "",
      eyebrow: "Quote of the week",
    },
    newsletter: {
      title: "",
      description: "",
    },
    aboutPreview: {
      name: "",
      role: "",
      intro: "",
      portrait: "",
      ctaLabel: "Read more about me",
      ctaTo: "/about",
    },
    features: {
      title: "What lives here",
      items: [],
    },
    divider: {
      label: "",
    },
    image: {
      url: "",
      alt: "",
      caption: "",
    },
    gallery: {
      title: "",
      items: [],
    },
    video: {
      url: "",
      title: "",
      poster: "",
    },
    richText: {
      eyebrow: "",
      title: "",
      html: "",
      tone: "default",
    },
    timeline: {
      title: "A quiet timeline",
      items: [],
    },
    bookshelf: {
      title: "Bookshelf",
      note: "",
      items: [],
    },
    faq: {
      title: "FAQ",
      items: [],
    },
    cta: {
      title: "",
      description: "",
      buttonLabel: "Continue",
      buttonTo: "/",
      tone: "surface",
    },
    embed: {
      html: "",
      caption: "",
    },
  };

  return { ...(defaults[type] || {}) };
}

export function createBlock(type, data = {}) {
  return {
    id: crypto.randomUUID(),
    type,
    enabled: true,
    data: { ...defaultBlockData(type), ...data },
  };
}

export default {
  PAGE_BLOCK_TYPES,
  PAGE_STATUSES,
  RESERVED_PAGE_SLUGS,
  defaultBlockData,
  createBlock,
};
