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

export function defaultBlockData(type) {
  const map = {
    hero: {
      eyebrow: "A personal journal",
      title: "DIL & DATA",
      tagline: "Stories, letters, and quiet observations",
      ctaLabel: "Begin reading",
      ctaTo: "/blogs",
      secondaryLabel: "Meet the author",
      secondaryTo: "/about",
    },
    featuredStory: { source: "featured", contentId: "" },
    photographyCarousel: { title: "", items: [] },
    latestStories: {
      title: "Latest stories",
      limit: 6,
      seeAllLabel: "View all",
      seeAllTo: "/blogs",
      contentType: "",
    },
    categories: { title: "Browse categories", tone: "muted" },
    quote: { text: "", attribution: "", eyebrow: "" },
    newsletter: { title: "", description: "" },
    aboutPreview: {
      name: "",
      role: "",
      intro: "",
      portrait: "",
      ctaLabel: "Read more about me",
      ctaTo: "/about",
    },
    divider: { label: "" },
    image: { url: "", alt: "", caption: "" },
    gallery: { title: "", items: [] },
    video: { url: "", title: "", poster: "" },
    richText: { eyebrow: "", title: "", html: "", tone: "default" },
    timeline: { title: "Timeline", items: [] },
    bookshelf: { title: "Bookshelf", note: "", items: [] },
    faq: { title: "FAQ", items: [] },
    cta: {
      title: "",
      description: "",
      buttonLabel: "Continue",
      buttonTo: "/",
      tone: "surface",
    },
    embed: { html: "", caption: "" },
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
