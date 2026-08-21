/** Mirrors server page block types for Studio UI. */

export const PAGE_BLOCK_TYPES = [
  { type: "hero", label: "Hero" },
  { type: "featuredStory", label: "Featured Story" },
  { type: "photographyCarousel", label: "Photography Carousel" },
  { type: "latestStories", label: "Latest Stories" },
  { type: "categories", label: "Categories" },
  { type: "quote", label: "Quote" },
  { type: "newsletter", label: "Newsletter" },
  { type: "aboutPreview", label: "About Preview" },
  { type: "features", label: "Features" },
  { type: "divider", label: "Divider" },
  { type: "image", label: "Image" },
  { type: "gallery", label: "Gallery" },
  { type: "video", label: "Video" },
  { type: "richText", label: "Rich Text" },
  { type: "timeline", label: "Timeline" },
  { type: "bookshelf", label: "Bookshelf" },
  { type: "faq", label: "FAQ" },
  { type: "cta", label: "CTA" },
  { type: "embed", label: "Embed" },
];

/** Brand section background presets (Studio + Section tone classes). */
export const SECTION_TONES = [
  { value: "default", label: "Default (page)" },
  { value: "surface", label: "Soft cream" },
  { value: "muted", label: "Warm beige" },
  { value: "white", label: "White" },
  { value: "blush", label: "Soft blush" },
];

/** Image placement relative to text / section. */
export const IMAGE_PLACEMENTS = [
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
];

/** Image display size. */
export const IMAGE_SIZES = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "full", label: "Full width" },
];

const SECTION_TONE_VALUES = new Set(SECTION_TONES.map((t) => t.value));

export function resolveSectionTone(tone, fallback = "default") {
  return SECTION_TONE_VALUES.has(tone) ? tone : fallback;
}

export function defaultBlockData(type) {
  const map = {
    hero: {
      eyebrow: "Shakti's Blog",
      title: "DIL & DATA",
      tagline: "A personal journal of heart, curiosity, and quiet strength",
      ctaLabel: "Enter the journal",
      ctaTo: "/blogs",
    },
    featuredStory: { source: "featured", contentId: "", tone: "default" },
    photographyCarousel: { title: "", items: [], tone: "surface" },
    latestStories: {
      title: "Latest stories",
      limit: 6,
      seeAllLabel: "View all",
      seeAllTo: "/blogs",
      contentType: "",
      tone: "default",
    },
    categories: { title: "Browse categories", tone: "muted" },
    quote: { text: "", attribution: "", eyebrow: "", tone: "default" },
    newsletter: { title: "", description: "", tone: "surface" },
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
    divider: { label: "", tone: "default" },
    image: { url: "", alt: "", caption: "", tone: "default" },
    gallery: { title: "", items: [], tone: "default" },
    video: { url: "", title: "", poster: "", tone: "default" },
    richText: { eyebrow: "", title: "", html: "", tone: "default" },
    timeline: { title: "Timeline", items: [], tone: "surface" },
    bookshelf: { title: "Bookshelf", note: "", items: [], tone: "muted" },
    faq: { title: "FAQ", items: [], tone: "surface" },
    cta: {
      title: "",
      description: "",
      buttonLabel: "Continue",
      buttonTo: "/",
      tone: "surface",
    },
    embed: { html: "", caption: "", tone: "default" },
  };
  return { ...(map[type] || {}) };
}

export function createBlock(type) {
  return {
    id: crypto.randomUUID(),
    type,
    enabled: true,
    data: defaultBlockData(type),
  };
}

export function blockLabel(type) {
  return PAGE_BLOCK_TYPES.find((b) => b.type === type)?.label || type;
}

export function pagePath(slug) {
  if (!slug || slug === "home") return "/";
  return `/${slug}`;
}
