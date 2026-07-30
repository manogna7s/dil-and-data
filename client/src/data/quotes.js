/**
 * Quotes — later: GET /api/quotes or site settings
 */
export const QUOTES = [
  {
    id: "q-1",
    text: "Some days the best thing you can do is sit with a warm cup and let the world arrive slowly.",
    attribution: "Manogna",
    featured: true,
  },
  {
    id: "q-2",
    text: "Mountains do not ask you to be impressive. They only ask you to keep walking.",
    attribution: "Manogna",
    featured: false,
  },
  {
    id: "q-3",
    text: "A good book is a quiet room you can enter from anywhere.",
    attribution: "Manogna",
    featured: false,
  },
];

export function getFeaturedQuote() {
  return QUOTES.find((q) => q.featured) ?? QUOTES[0];
}
