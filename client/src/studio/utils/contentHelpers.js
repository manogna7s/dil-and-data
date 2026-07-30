/** Shared publishing desk options — mirrors server Content enums. */

export const CONTENT_TYPE_OPTIONS = [
  { value: "blog", label: "Blog" },
  { value: "travel", label: "Travel" },
  { value: "books", label: "Books" },
  { value: "photography", label: "Photography" },
  { value: "diary", label: "Diary" },
  { value: "poetry", label: "Poetry" },
  { value: "projects", label: "Projects" },
  { value: "coffee-journal", label: "Coffee journal" },
  { value: "reading-notes", label: "Reading notes" },
  { value: "monthly-letter", label: "Monthly letter" },
];

export const CONTENT_STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export const CONTENT_SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "popular", label: "Popular" },
  { value: "featured", label: "Featured first" },
];

export function estimateReadingTime(html) {
  const text = String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return 1;
  return Math.max(1, Math.ceil(text.split(" ").filter(Boolean).length / 200));
}

export function formatStudioDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function toDatetimeLocal(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromDatetimeLocal(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export function parseLineList(text) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((url) => ({ url, publicId: "", alt: "", caption: "" }));
}

export function mediaListToText(list) {
  if (!Array.isArray(list)) return "";
  return list.map((item) => (typeof item === "string" ? item : item?.url || "")).filter(Boolean).join("\n");
}

export function toMediaRef(item) {
  if (!item) return null;
  if (typeof item === "string") {
    return { url: item, publicId: "", alt: "", caption: "" };
  }
  return {
    url: item.url || "",
    publicId: item.publicId || "",
    alt: item.alt || "",
    caption: item.caption || "",
  };
}

export function normalizeMediaList(list) {
  if (!Array.isArray(list)) return [];
  return list.map(toMediaRef).filter((item) => item?.url);
}
