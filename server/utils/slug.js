import slugify from "slugify";

/**
 * Build a URL-safe slug from a title.
 */
export function createSlug(text) {
  return slugify(String(text || ""), {
    lower: true,
    strict: true,
    trim: true,
  });
}

/**
 * Ensure slug uniqueness against a Mongoose model.
 * Appends -2, -3… when collisions exist.
 */
export async function uniqueSlug(Model, base, excludeId = null) {
  let slug = createSlug(base) || `item-${Date.now()}`;
  let candidate = slug;
  let counter = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Model.exists(query);
    if (!exists) return candidate;
    candidate = `${slug}-${counter}`;
    counter += 1;
  }
}

export default { createSlug, uniqueSlug };
