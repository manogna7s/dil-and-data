import { IMAGES } from "./images.js";

const AUTHOR = {
  name: "Manogna",
  avatar: IMAGES.portrait,
  bio: "Writer, builder, and collector of quiet mornings.",
};

/**
 * Blog posts — later: GET /api/blogs, GET /api/blogs/:slug
 * Content blocks mirror a future CMS schema.
 */
export const BLOGS = [
  {
    id: "1",
    slug: "morning-coffee-quiet-thoughts",
    title: "Morning Coffee & Quiet Thoughts",
    excerpt:
      "Before the day asks for anything, there is steam, soft light, and a few honest sentences.",
    coverImage: IMAGES.coffee,
    category: "journal",
    categoryName: "Journal",
    author: AUTHOR,
    publishedAt: "2026-03-12",
    readingTime: 6,
    featured: true,
    popular: true,
    tags: ["rituals", "mornings", "writing"],
    headings: [
      { id: "the-first-cup", text: "The first cup" },
      { id: "what-silence-gives", text: "What silence gives" },
      { id: "a-small-practice", text: "A small practice" },
    ],
    content: [
      {
        type: "paragraph",
        dropCap: true,
        text: "There is a particular kindness in mornings that have not yet been claimed. The kettle softens the kitchen, the window holds a pale blue, and for a few minutes the world feels unfinished — in the best way.",
      },
      {
        type: "paragraph",
        text: "I do not chase productivity in these hours. I chase presence. A ceramic mug, a notebook that still smells faintly of paper, and the permission to write badly before I write truthfully.",
      },
      {
        type: "heading",
        id: "the-first-cup",
        text: "The first cup",
      },
      {
        type: "paragraph",
        text: "The first sip is always a little too hot. That is part of the ritual — waiting, breathing, letting the day arrive at the pace of cooling coffee rather than glowing screens.",
      },
      {
        type: "image",
        src: IMAGES.cafe,
        alt: "Morning light across a café table",
        caption: "Light finds the corners before we do.",
      },
      {
        type: "heading",
        id: "what-silence-gives",
        text: "What silence gives",
      },
      {
        type: "quote",
        text: "Quiet is not empty. It is full of answers we cannot hear when we are rushing.",
        attribution: "Manogna",
      },
      {
        type: "paragraph",
        text: "Silence has become a rare luxury, which is exactly why I protect it. In the hush, half-formed ideas become sentences. Worries shrink to their true size. Gratitude shows up without being invited.",
      },
      {
        type: "heading",
        id: "a-small-practice",
        text: "A small practice",
      },
      {
        type: "paragraph",
        text: "Three lines in a journal. Nothing more. Some mornings they are about weather. Some mornings they are about courage. All of them are proof that I showed up for myself before the world asked me to show up for it.",
      },
    ],
  },
  {
    id: "2",
    slug: "letters-i-never-sent",
    title: "Letters I Never Sent",
    excerpt:
      "Some words were never meant for inboxes — only for the honesty of an unsent page.",
    coverImage: IMAGES.writing,
    category: "reflections",
    categoryName: "Reflections",
    author: AUTHOR,
    publishedAt: "2026-02-28",
    readingTime: 8,
    featured: false,
    popular: true,
    tags: ["letters", "memory", "healing"],
    headings: [
      { id: "the-drawer", text: "The drawer of almosts" },
      { id: "why-we-write-anyway", text: "Why we write anyway" },
    ],
    content: [
      {
        type: "paragraph",
        dropCap: true,
        text: "I keep a folder named “Unsent.” It is not dramatic — just pages addressed to people who will never read them: a childhood friend, a version of myself from three years ago, a stranger who was kind on a difficult Tuesday.",
      },
      {
        type: "heading",
        id: "the-drawer",
        text: "The drawer of almosts",
      },
      {
        type: "paragraph",
        text: "Unsent letters are not failures of courage. They are a private form of closure — ink that does its work without needing a reply.",
      },
      {
        type: "quote",
        text: "Sometimes the bravest thing a letter can do is stay in the drawer.",
        attribution: "Manogna",
      },
      {
        type: "heading",
        id: "why-we-write-anyway",
        text: "Why we write anyway",
      },
      {
        type: "paragraph",
        text: "Because naming a feeling shrinks its power. Because paper is patient. Because someday I may open that folder and meet a softer version of the girl who needed to say it out loud.",
      },
      {
        type: "image",
        src: IMAGES.paper,
        alt: "Handwritten pages on a desk",
        caption: "Paper keeps secrets kindly.",
      },
    ],
  },
  {
    id: "3",
    slug: "why-mountains-feel-like-home",
    title: "Why Mountains Feel Like Home",
    excerpt:
      "Altitude teaches patience. Trails teach humility. Peaks teach you how small — and how held — you are.",
    coverImage: IMAGES.mountains,
    category: "travel",
    categoryName: "Travel",
    author: AUTHOR,
    publishedAt: "2026-02-10",
    readingTime: 7,
    featured: false,
    popular: true,
    tags: ["mountains", "nature", "belonging"],
    headings: [
      { id: "thin-air-clear-mind", text: "Thin air, clear mind" },
      { id: "the-way-down", text: "The way down" },
    ],
    content: [
      {
        type: "paragraph",
        dropCap: true,
        text: "I do not go to the mountains to conquer them. I go to remember that my timeline is not the only one that matters — rock and wind have been negotiating long before my worries arrived.",
      },
      {
        type: "heading",
        id: "thin-air-clear-mind",
        text: "Thin air, clear mind",
      },
      {
        type: "paragraph",
        text: "Every switchback is a small lesson in pacing. You cannot rush a mountain into revealing its view. You earn it with breath and blister and a willingness to pause.",
      },
      {
        type: "gallery",
        images: [
          { src: IMAGES.mountains, alt: "Snow-dusted ridgeline" },
          { src: IMAGES.nature, alt: "Forest path below the peaks" },
          { src: IMAGES.goldenHour, alt: "Golden light on distant hills" },
        ],
      },
      {
        type: "heading",
        id: "the-way-down",
        text: "The way down",
      },
      {
        type: "paragraph",
        text: "Coming down is often harder than going up — knees, gravity, the soft ache of leaving. But home, I have learned, is also the feeling of having been somewhere that asked nothing of you except honesty.",
      },
    ],
  },
  {
    id: "4",
    slug: "books-that-changed-me",
    title: "Books That Changed Me",
    excerpt:
      "Not every book rewires you — but a few leave fingerprints on how you see everything after.",
    coverImage: IMAGES.library,
    category: "books",
    categoryName: "Books",
    author: AUTHOR,
    publishedAt: "2026-01-19",
    readingTime: 9,
    featured: false,
    popular: false,
    tags: ["reading", "growth", "favorites"],
    headings: [
      { id: "the-ones-that-stay", text: "The ones that stay" },
      { id: "how-i-choose", text: "How I choose now" },
    ],
    content: [
      {
        type: "paragraph",
        dropCap: true,
        text: "Some books entertain. A rarer few rearrange the furniture in your mind so gently you only notice when you walk into a room differently.",
      },
      {
        type: "heading",
        id: "the-ones-that-stay",
        text: "The ones that stay",
      },
      {
        type: "paragraph",
        text: "I still underline sentences like I am leaving breadcrumbs for a future self. Dog-eared pages are not damage — they are maps of where I paused to feel something.",
      },
      {
        type: "image",
        src: IMAGES.bookshelf,
        alt: "Books lined on a wooden shelf",
        caption: "A shelf is a kind of autobiography.",
      },
      {
        type: "heading",
        id: "how-i-choose",
        text: "How I choose now",
      },
      {
        type: "paragraph",
        text: "Less by trend, more by hunger. If a book makes me slower, kinder, or more curious — it earns a permanent place beside the coffee stains and soft mornings.",
      },
    ],
  },
  {
    id: "5",
    slug: "the-joy-of-slow-living",
    title: "The Joy of Slow Living",
    excerpt:
      "Slowness is not laziness. It is the decision to taste your own life.",
    coverImage: IMAGES.slowLiving,
    category: "reflections",
    categoryName: "Reflections",
    author: AUTHOR,
    publishedAt: "2025-12-08",
    readingTime: 5,
    featured: false,
    popular: false,
    tags: ["slow-living", "mindfulness"],
    headings: [{ id: "permission", text: "Permission to pause" }],
    content: [
      {
        type: "paragraph",
        dropCap: true,
        text: "I used to treat rest like a reward for exhaustion. Now I treat it like a practice — something you schedule with the same respect you give a meeting.",
      },
      {
        type: "heading",
        id: "permission",
        text: "Permission to pause",
      },
      {
        type: "quote",
        text: "The art of doing nothing is really the art of being fully somewhere.",
        attribution: "Manogna",
      },
      {
        type: "paragraph",
        text: "Slow living, for me, looks like cooking without a podcast, walking without a destination, and letting an afternoon be deliciously unoptimized.",
      },
    ],
  },
  {
    id: "6",
    slug: "code-chaos-curiosity",
    title: "Code, Chaos & Curiosity",
    excerpt:
      "Between broken builds and sudden breakthroughs — a love letter to learning out loud.",
    coverImage: IMAGES.coding,
    category: "tech",
    categoryName: "Tech & Curiosity",
    author: AUTHOR,
    publishedAt: "2025-11-22",
    readingTime: 10,
    featured: false,
    popular: true,
    tags: ["coding", "learning", "curiosity"],
    headings: [
      { id: "beautiful-mess", text: "The beautiful mess" },
      { id: "a-snippet", text: "A tiny snippet of joy" },
    ],
    content: [
      {
        type: "paragraph",
        dropCap: true,
        text: "Learning to code feels a lot like learning a city — you get lost, you ask strangers (Stack Overflow), you eventually know which alley leads home.",
      },
      {
        type: "heading",
        id: "beautiful-mess",
        text: "The beautiful mess",
      },
      {
        type: "paragraph",
        text: "Chaos is not the enemy. Unexamined chaos is. Curiosity turns error messages into teachers and late nights into lore you will laugh about later.",
      },
      {
        type: "heading",
        id: "a-snippet",
        text: "A tiny snippet of joy",
      },
      {
        type: "code",
        language: "javascript",
        code: `// A small reminder I leave in side projects
const showUp = () => {
  console.log("One gentle commit at a time.");
};

showUp();`,
      },
      {
        type: "paragraph",
        text: "I do not write perfect systems. I write systems that teach me something — and that is enough for a Tuesday.",
      },
    ],
  },
  {
    id: "7",
    slug: "a-train-window-in-monsoon",
    title: "A Train Window in Monsoon",
    excerpt:
      "Rain stitches the landscape into watercolor. Somewhere between stations, the heart softens.",
    coverImage: IMAGES.train,
    category: "travel",
    categoryName: "Travel",
    author: AUTHOR,
    publishedAt: "2025-10-14",
    readingTime: 6,
    featured: false,
    popular: false,
    tags: ["monsoon", "trains", "india"],
    headings: [
      { id: "between-stations", text: "Between stations" },
      { id: "video-memory", text: "A moving memory" },
    ],
    content: [
      {
        type: "paragraph",
        dropCap: true,
        text: "Monsoon trains smell like wet steel and chai. The window becomes a cinema — green blurred into green, villages flickering past like half-remembered dreams.",
      },
      {
        type: "heading",
        id: "between-stations",
        text: "Between stations",
      },
      {
        type: "paragraph",
        text: "I press my forehead to the glass and practice the art of not arriving yet. The journey, for once, is the point.",
      },
      {
        type: "heading",
        id: "video-memory",
        text: "A moving memory",
      },
      {
        type: "video",
        poster: IMAGES.monsoon,
        title: "Rain along the tracks (placeholder)",
      },
      {
        type: "image",
        src: IMAGES.window,
        alt: "Raindrops on a train window",
        caption: "Every droplet a tiny lens.",
      },
    ],
  },
  {
    id: "8",
    slug: "the-art-of-doing-nothing",
    title: "The Art of Doing Nothing",
    excerpt:
      "An afternoon with no agenda, and the surprising richness that follows.",
    coverImage: IMAGES.flowers,
    category: "journal",
    categoryName: "Journal",
    author: AUTHOR,
    publishedAt: "2025-09-03",
    readingTime: 4,
    featured: false,
    popular: false,
    tags: ["rest", "presence"],
    headings: [{ id: "empty-hours", text: "Empty hours, full heart" }],
    content: [
      {
        type: "paragraph",
        dropCap: true,
        text: "Doing nothing is a skill. It requires unlearning the itch to fill every blank with noise, scrolling, or self-improvement.",
      },
      {
        type: "heading",
        id: "empty-hours",
        text: "Empty hours, full heart",
      },
      {
        type: "paragraph",
        text: "Last Sunday I watched light move across the wall for twenty minutes. It was not wasted. It was witnessing — and witnessing is a form of love.",
      },
      {
        type: "quote",
        text: "Nothing is sometimes the most honest something.",
        attribution: "Manogna",
      },
    ],
  },
  {
    id: "9",
    slug: "frames-of-golden-hour",
    title: "Frames of Golden Hour",
    excerpt:
      "When the light turns honey-colored, the ordinary world briefly becomes a painting.",
    coverImage: IMAGES.goldenHour,
    category: "photography",
    categoryName: "Photography",
    author: AUTHOR,
    publishedAt: "2025-08-18",
    readingTime: 5,
    featured: false,
    popular: false,
    tags: ["light", "photography"],
    headings: [{ id: "chasing-softness", text: "Chasing softness" }],
    content: [
      {
        type: "paragraph",
        dropCap: true,
        text: "Golden hour does not last. That is its lesson. You show up, you notice, you click — or you simply stand there and let the color happen to you.",
      },
      {
        type: "heading",
        id: "chasing-softness",
        text: "Chasing softness",
      },
      {
        type: "gallery",
        images: [
          { src: IMAGES.goldenHour, alt: "Warm sunset landscape" },
          { src: IMAGES.temple, alt: "Temple stones in evening light" },
          { src: IMAGES.flowers, alt: "Flowers catching late sun" },
        ],
      },
      {
        type: "paragraph",
        text: "I photograph less to capture perfection and more to thank the day for its brief generosity.",
      },
    ],
  },
];

export function getBlogBySlug(slug) {
  return BLOGS.find((b) => b.slug === slug) ?? null;
}

export function getFeaturedBlog() {
  return BLOGS.find((b) => b.featured) ?? BLOGS[0];
}

export function getLatestBlogs(limit = 6) {
  return [...BLOGS]
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, limit);
}

export function getPopularBlogs(limit = 4) {
  return BLOGS.filter((b) => b.popular).slice(0, limit);
}

export function getRelatedBlogs(slug, limit = 3) {
  const current = getBlogBySlug(slug);
  if (!current) return getLatestBlogs(limit);
  return BLOGS.filter(
    (b) => b.slug !== slug && b.category === current.category
  ).slice(0, limit);
}

export function getAdjacentBlogs(slug) {
  const ordered = [...BLOGS].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );
  const index = ordered.findIndex((b) => b.slug === slug);
  return {
    previous: index < ordered.length - 1 ? ordered[index + 1] : null,
    next: index > 0 ? ordered[index - 1] : null,
  };
}

export function getBlogsByCategory(categorySlug) {
  return BLOGS.filter((b) => b.category === categorySlug);
}

export function formatBlogDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Card-shaped posts for BlogCard compatibility */
export function toBlogCard(blog) {
  return {
    id: blog.id,
    title: blog.title,
    excerpt: blog.excerpt,
    image: blog.coverImage,
    category: blog.categoryName,
    date: formatBlogDate(blog.publishedAt),
    slug: blog.slug,
  };
}

/** @deprecated */
export const PLACEHOLDER_POSTS = getLatestBlogs(3).map(toBlogCard);
