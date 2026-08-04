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
      tone: "default",
    },
    photographyCarousel: {
      title: "",
      items: [],
      tone: "surface",
    },
    latestStories: {
      title: "Latest stories",
      limit: 6,
      seeAllLabel: "View all",
      seeAllTo: "/blogs",
      contentType: "",
      tone: "default",
    },
    categories: {
      title: "Browse categories",
      tone: "muted",
    },
    quote: {
      text: "",
      attribution: "",
      eyebrow: "Quote of the week",
      tone: "default",
    },
    newsletter: {
      title: "",
      description: "",
      tone: "surface",
    },
    aboutPreview: {
      name: "",
      role: "",
      intro: "",
      portrait: "",
      ctaLabel: "Read more about me",
      ctaTo: "/about",
      tone: "surface",
    },
    features: {
      title: "What lives here",
      items: [],
      tone: "default",
    },
    divider: {
      label: "",
      tone: "default",
    },
    image: {
      url: "",
      alt: "",
      caption: "",
      tone: "default",
    },
    gallery: {
      title: "",
      items: [],
      tone: "default",
    },
    video: {
      url: "",
      title: "",
      poster: "",
      tone: "default",
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
      tone: "surface",
    },
    bookshelf: {
      title: "Bookshelf",
      note: "",
      items: [],
      tone: "muted",
    },
    faq: {
      title: "FAQ",
      items: [],
      tone: "surface",
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
      tone: "default",
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
