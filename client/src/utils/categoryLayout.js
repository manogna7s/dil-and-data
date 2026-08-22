/** True when a category uses the polaroid bucket-list layout. */
export function isPolaroidCategory(category) {
  if (!category) return false;
  if (category.layout === "polaroid") return true;
  const slug = String(category.slug || "").toLowerCase();
  return slug.includes("bucket");
}

export default isPolaroidCategory;
