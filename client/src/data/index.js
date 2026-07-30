/**
 * Curated Unsplash placeholders — coffee, books, travel, nature, journal.
 * Replace with owned photography in a later phase.
 * Never hardcode image URLs inside components.
 */

export const PLACEHOLDER_IMAGES = {
  coffee:
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80",
  books:
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=80",
  travel:
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80",
  flowers:
    "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80",
  mountains:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
  journal:
    "https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200&q=80",
  library:
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80",
  paper:
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80",
  nature:
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
  cafe:
    "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1200&q=80",
  handwriting:
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
  portrait:
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80",
};

/** Sample editorial cards for component previews / empty layouts later */
export const PLACEHOLDER_POSTS = [
  {
    id: "1",
    title: "Morning Light & Quiet Pages",
    excerpt:
      "A slow morning with coffee, open windows, and the kind of silence that lets stories arrive.",
    image: PLACEHOLDER_IMAGES.coffee,
    category: "Journal",
    date: "March 12, 2026",
    slug: "morning-light-quiet-pages",
  },
  {
    id: "2",
    title: "Letters from the Mountains",
    excerpt:
      "What the altitude taught me about patience, breath, and writing less but meaning more.",
    image: PLACEHOLDER_IMAGES.mountains,
    category: "Travel",
    date: "February 28, 2026",
    slug: "letters-from-the-mountains",
  },
  {
    id: "3",
    title: "A Shelf of Soft Companions",
    excerpt:
      "On the books that feel like old friends — and why libraries still feel like home.",
    image: PLACEHOLDER_IMAGES.library,
    category: "Books",
    date: "January 19, 2026",
    slug: "shelf-of-soft-companions",
  },
];

export const PLACEHOLDER_CATEGORIES = [
  { id: "journal", name: "Journal", count: 12, image: PLACEHOLDER_IMAGES.journal },
  { id: "travel", name: "Travel", count: 8, image: PLACEHOLDER_IMAGES.travel },
  { id: "books", name: "Books", count: 15, image: PLACEHOLDER_IMAGES.books },
  { id: "nature", name: "Nature", count: 6, image: PLACEHOLDER_IMAGES.nature },
];

export const SOCIAL_LINKS = [
  { id: "instagram", label: "Instagram", href: "https://instagram.com" },
  { id: "twitter", label: "Twitter", href: "https://twitter.com" },
  { id: "pinterest", label: "Pinterest", href: "https://pinterest.com" },
  { id: "email", label: "Email", href: "mailto:hello@dilanddata.com" },
];
