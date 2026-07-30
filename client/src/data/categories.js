import { IMAGES } from "./images.js";

/**
 * Categories — later: GET /api/categories
 */
export const CATEGORIES = [
  {
    id: "journal",
    slug: "journal",
    name: "Journal",
    description:
      "Quiet mornings, handwritten notes, and the small rituals that hold a life together.",
    image: IMAGES.journal,
  },
  {
    id: "travel",
    slug: "travel",
    name: "Travel",
    description:
      "Train windows, mountain air, and cities that leave a soft imprint.",
    image: IMAGES.travel,
  },
  {
    id: "books",
    slug: "books",
    name: "Books",
    description:
      "Pages that changed me, shelves that feel like home, and stories worth keeping.",
    image: IMAGES.books,
  },
  {
    id: "photography",
    slug: "photography",
    name: "Photography",
    description:
      "Light, texture, and the frames that make ordinary days feel cinematic.",
    image: IMAGES.goldenHour,
  },
  {
    id: "reflections",
    slug: "reflections",
    name: "Reflections",
    description:
      "Letters never sent, slow living, and the art of doing nothing well.",
    image: IMAGES.slowLiving,
  },
  {
    id: "tech",
    slug: "tech",
    name: "Tech & Curiosity",
    description:
      "Code, chaos, and the curious mind behind the screen.",
    image: IMAGES.coding,
  },
];

export function getCategoryBySlug(slug) {
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}
