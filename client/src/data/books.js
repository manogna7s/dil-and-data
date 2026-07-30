import { IMAGES } from "./images.js";

/**
 * Bookshelf — later: GET /api/books or Goodreads sync
 */
export const BOOKS = [
  {
    id: "b-1",
    title: "The House in the Cerulean Sea",
    author: "TJ Klune",
    note: "Soft magic, found family, and the courage to choose kindness.",
    cover: IMAGES.books,
  },
  {
    id: "b-2",
    title: "Atomic Habits",
    author: "James Clear",
    note: "Tiny rituals that quietly reshape a life.",
    cover: IMAGES.journal,
  },
  {
    id: "b-3",
    title: "Educated",
    author: "Tara Westover",
    note: "A reminder that becoming yourself is a long, brave climb.",
    cover: IMAGES.library,
  },
  {
    id: "b-4",
    title: "The Midnight Library",
    author: "Matt Haig",
    note: "Infinite doors, one heart — and the beauty of the life you already have.",
    cover: IMAGES.bookshelf,
  },
];
