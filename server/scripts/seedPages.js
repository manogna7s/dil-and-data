/**
 * Seed CMS pages (home, about, and future journal shelves).
 *
 * Usage:
 *   npm run seed:pages
 *
 * Idempotent — upserts by slug. Set FORCE_SEED=true to rebuild blocks from defaults.
 */
import "dotenv/config";
import mongoose from "mongoose";
import config from "../config/index.js";
import { seedPage } from "../services/page.service.js";
import { createBlock } from "../constants/pageBlocks.js";

const IMG = {
  coffee: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&q=80",
  books: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1400&q=80",
  travel: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&q=80",
  flowers: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1400&q=80",
  mountains: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=80",
  journal: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=1400&q=80",
  library: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1400&q=80",
  nature: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&q=80",
  temple: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1400&q=80",
  goldenHour: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1400&q=80",
  portrait: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1000&q=80",
  bookshelf: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1400&q=80",
};

function homeBlocks() {
  return [
    createBlock("hero"),
    createBlock("featuredStory"),
    createBlock("photographyCarousel", {
      items: [
        { title: "Where the Trail Softens", location: "Himalayan foothills", src: IMG.mountains, alt: "Misty mountain peaks at dawn" },
        { title: "Steam & Stillness", location: "A quiet café morning", src: IMG.coffee, alt: "Coffee cup on a wooden table" },
        { title: "Well-Loved Pages", location: "Home library", src: IMG.books, alt: "Stack of open books" },
        { title: "Petals After Rain", location: "Neighborhood garden", src: IMG.flowers, alt: "Soft pink flowers" },
        { title: "Stone & Prayer", location: "South India", src: IMG.temple, alt: "Temple architecture" },
        { title: "Forest Breathing", location: "Somewhere green", src: IMG.nature, alt: "Forest canopy" },
        { title: "Maps & Suitcases", location: "On the road", src: IMG.travel, alt: "Travel essentials" },
        { title: "Golden Hour Letters", location: "Late afternoon light", src: IMG.goldenHour, alt: "Golden hour landscape" },
      ],
    }),
    createBlock("latestStories"),
    createBlock("categories"),
    createBlock("quote", {
      text: "Some days the best thing you can do is sit with a warm cup and let the world arrive slowly.",
      attribution: "Manogna",
      eyebrow: "Quote of the week",
    }),
    createBlock("aboutPreview", {
      name: "Manogna",
      role: "Writer · Builder · Observer",
      intro:
        "I write the way I make chai — slowly, with attention, and always with the hope that someone feels a little warmer afterward.",
      portrait: IMG.portrait,
    }),
    createBlock("newsletter"),
  ];
}

function aboutBlocks() {
  return [
    createBlock("richText", {
      eyebrow: "About",
      title: "Hello, I'm Manogna",
      html: "<p>I write the way I make chai — slowly, with attention, and always with the hope that someone feels a little warmer afterward.</p>",
    }),
    createBlock("image", {
      url: IMG.portrait,
      alt: "Manogna — portrait",
      caption: "Writer · Builder · Observer",
    }),
    createBlock("richText", {
      title: "",
      html: "<p>DIL & DATA began as two notebooks: one for the heart, one for the curious mind. Over time they became the same page.</p><p>Here you will find travel notes, bookish rabbit holes, soft photography, and the occasional love letter to code that finally compiled.</p><p>If you are the kind of person who underlines sentences and pauses for golden hour — welcome. You are among friends.</p>",
    }),
    createBlock("timeline", {
      title: "A quiet timeline",
      items: [
        { year: "2018", title: "First journal entry that felt like a letter", description: "I wrote to no one in particular and realized storytelling was how I make sense of the world." },
        { year: "2020", title: "Code became another kind of language", description: "Between algorithms and late-night commits, I found curiosity that refused to stay quiet." },
        { year: "2022", title: "Mountains, trains, and monsoon windows", description: "Travel taught me to notice — light on stone, strangers' kindness, the pause between stations." },
        { year: "2024", title: "DIL & DATA began as a notebook", description: "A place for heart and logic to sit at the same table." },
        { year: "2026", title: "Building a home for the words", description: "This site is the living journal — still becoming, always meant to be read slowly." },
      ],
    }),
    createBlock("richText", {
      title: "Things I love",
      html: "<ul><li><strong>Reading</strong> — Margins full of soft pencil</li><li><strong>Writing</strong> — Letters, essays, quiet fiction</li><li><strong>Travel</strong> — Trains, trails, temple towns</li><li><strong>Photography</strong> — Light before it leaves</li><li><strong>Coding</strong> — Curiosity with a keyboard</li></ul>",
      tone: "default",
    }),
    createBlock("bookshelf", {
      title: "Bookshelf",
      note: "A few companions that still live on my nightstand and in my margins.",
      items: [
        { title: "The House in the Cerulean Sea", author: "TJ Klune", note: "Soft magic, found family, and the courage to choose kindness.", cover: IMG.books },
        { title: "Atomic Habits", author: "James Clear", note: "Tiny rituals that quietly reshape a life.", cover: IMG.journal },
        { title: "Educated", author: "Tara Westover", note: "A reminder that becoming yourself is a long, brave climb.", cover: IMG.library },
        { title: "The Midnight Library", author: "Matt Haig", note: "Infinite doors, one heart.", cover: IMG.bookshelf },
      ],
    }),
    createBlock("richText", {
      title: "Fun facts",
      html: "<ul><li>I name Wi-Fi networks after book titles.</li><li>Monsoon season is my favorite season for thinking.</li><li>I have a playlist called “writing weather.”</li><li>The first thing I pack is always a notebook.</li></ul>",
    }),
    createBlock("faq", {
      title: "FAQ",
      items: [
        { question: "What is DIL & DATA?", answer: "A personal publishing space where stories, photography, books, and quiet tech curiosity live together." },
        { question: "How often do you publish?", answer: "When something feels worth keeping — usually a few thoughtful pieces a month." },
        { question: "Can I share your writing?", answer: "Yes, with credit and a link back." },
        { question: "Do you take collaborations?", answer: "Sometimes. Soft pitches and genuine curiosity are welcome via email." },
      ],
    }),
    createBlock("divider", { label: "A closing note" }),
    createBlock("quote", {
      text: "Some days the best thing you can do is sit with a warm cup and let the world arrive slowly.",
      attribution: "Manogna",
      eyebrow: "",
    }),
  ];
}

function shelfPage(title, eyebrow, blurb, image) {
  return [
    createBlock("hero", {
      eyebrow,
      title,
      tagline: blurb,
      ctaLabel: "Browse stories",
      ctaTo: "/blogs",
      secondaryLabel: "Home",
      secondaryTo: "/",
    }),
    createBlock("image", { url: image, alt: title, caption: "" }),
    createBlock("richText", {
      title: `Welcome to ${title}`,
      html: `<p>${blurb}</p><p>Edit this page in Creator Studio — add galleries, timelines, quotes, or latest stories without touching React.</p>`,
    }),
    createBlock("latestStories", {
      title: "From this shelf",
      limit: 6,
    }),
    createBlock("cta", {
      title: "Want to keep reading?",
      description: "The full journal lives on the blogs shelf.",
      buttonLabel: "Open blogs",
      buttonTo: "/blogs",
    }),
  ];
}

const PAGES = [
  {
    title: "Home",
    slug: "home",
    status: "published",
    showInNav: true,
    navLabel: "Home",
    navOrder: 1,
    blocks: homeBlocks(),
  },
  {
    title: "About",
    slug: "about",
    status: "published",
    showInNav: true,
    navLabel: "About",
    navOrder: 2,
    blocks: aboutBlocks(),
  },
  {
    title: "Travel",
    slug: "travel",
    status: "published",
    showInNav: true,
    navLabel: "Travel",
    navOrder: 10,
    blocks: shelfPage("Travel", "Journeys", "Trains, trails, temple towns, and the pause between stations.", IMG.travel),
  },
  {
    title: "Books",
    slug: "books",
    status: "published",
    showInNav: true,
    navLabel: "Books",
    navOrder: 11,
    blocks: shelfPage("Books", "Reading notes", "Margins, nightstands, and sentences worth underlining.", IMG.books),
  },
  {
    title: "Diary",
    slug: "diary",
    status: "published",
    showInNav: true,
    navLabel: "Diary",
    navOrder: 12,
    blocks: shelfPage("Diary", "Soft letters", "Quiet days, monsoon windows, and notes to self.", IMG.journal),
  },
  {
    title: "Photography",
    slug: "photography",
    status: "published",
    showInNav: true,
    navLabel: "Photography",
    navOrder: 13,
    blocks: shelfPage("Photography", "Frames", "Light before it leaves — soft frames from the road and home.", IMG.mountains),
  },
  {
    title: "Projects",
    slug: "projects",
    status: "published",
    showInNav: true,
    navLabel: "Projects",
    navOrder: 14,
    blocks: shelfPage("Projects", "Building", "Curiosity with a keyboard — things made carefully.", IMG.library),
  },
  {
    title: "Coffee Journal",
    slug: "coffee-journal",
    status: "published",
    showInNav: true,
    navLabel: "Coffee",
    navOrder: 15,
    blocks: shelfPage("Coffee Journal", "Steam & stillness", "Café mornings, warm cups, and slow thinking.", IMG.coffee),
  },
];

async function run() {
  if (!config.mongoUri) throw new Error("MONGODB_URI is required");
  await mongoose.connect(config.mongoUri);

  for (const page of PAGES) {
    const existing = await mongoose.connection.db.collection("pages").findOne({ slug: page.slug });
    if (existing && process.env.FORCE_SEED !== "true") {
      console.log("Skip (exists):", page.slug, "— set FORCE_SEED=true to rebuild blocks");
      continue;
    }
    const saved = await seedPage(page);
    console.log("Upserted page:", saved.slug, `(${saved.blocks.length} blocks)`);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

run().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
