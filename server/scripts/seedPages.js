/**
 * Seed CMS pages (home, about).
 *
 * Usage:
 *   npm run seed:pages
 *   FORCE_SEED=true npm run seed:pages   # rebuild blocks from defaults
 *
 * Home stays free of stock photos / dummy posts — live feed blocks
 * only appear after you publish from Creator Studio.
 */
import "dotenv/config";
import mongoose from "mongoose";
import config from "../config/index.js";
import { seedPage } from "../services/page.service.js";
import { createBlock } from "../constants/pageBlocks.js";

function homeBlocks() {
  return [
    createBlock("hero", {
      eyebrow: "Shakti's Blog",
      title: "DIL & DATA",
      tagline: "A personal journal of heart, curiosity, and quiet strength",
      ctaLabel: "Enter the journal",
      ctaTo: "/blogs",
      secondaryLabel: "About Manogna",
      secondaryTo: "/about",
    }),
    createBlock("richText", {
      eyebrow: "Why this name",
      title: "Shakti's Blog",
      html:
        "<p>Once, in a game, I named myself <em>shaktishaali</em> — and yes, I laughed about it too. But I loved the word so much that it stayed with me. Shakti's Blog is that name grown up: a quiet home for strength, softness, and stories that feel true.</p>",
    }),
    createBlock("aboutPreview", {
      name: "Manogna",
      role: "Writer behind DIL & DATA",
      intro:
        "I write slowly — about feeling, noticing, and becoming. Short letters, soft frames, and the occasional rabbit hole. This space is mine; you're welcome to sit with it a while.",
      portrait: "",
      ctaLabel: "More about me",
      ctaTo: "/about",
    }),
    createBlock("features", {
      title: "What lives here",
      items: [
        {
          title: "My personal blog",
          description:
            "The heart of this house — essays, diary notes, and stories published only when they feel ready.",
        },
        {
          title: "Letters after midnight",
          description:
            "Quiet pages written when the world softens — honesty without performance.",
        },
        {
          title: "Golden-hour frames",
          description:
            "Photography that keeps light before it leaves — square corners, no filter theater.",
        },
        {
          title: "Margins & nightstands",
          description:
            "Books that leave fingerprints on the mind — underlines, dog-ears, and soft reviews.",
        },
        {
          title: "Soft maps & temple towns",
          description:
            "Travel remembered as atmosphere: trains, stone, monsoon windows, and kind strangers.",
        },
        {
          title: "Curiosity with a keyboard",
          description:
            "Building things carefully — code as craft, not noise.",
        },
      ],
    }),
    // Live feeds — render nothing until you publish from Studio
    createBlock("featuredStory"),
    createBlock("latestStories", {
      title: "Latest from Shakti's Blog",
      limit: 6,
      seeAllLabel: "All stories",
      seeAllTo: "/blogs",
    }),
    createBlock("newsletter"),
  ];
}

function aboutBlocks() {
  return [
    createBlock("richText", {
      eyebrow: "About",
      title: "Hello, I'm Manogna",
      html:
        "<p>I keep DIL & DATA as a notebook for the heart and the curious mind — the same page, shared carefully.</p><p>Shakti's Blog is where the writing lives. The name began as a game-handle I adored (<em>shaktishaali</em>) and became a promise to write with strength and softness at once.</p><p>Upload a portrait and flesh this page out anytime in Creator Studio — until then, this is enough.</p>",
    }),
    createBlock("divider", { label: "A quiet close" }),
    createBlock("quote", {
      text: "Some days the best thing you can do is sit with a warm cup and let the world arrive slowly.",
      attribution: "Manogna",
      eyebrow: "",
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

  // Hide previously seeded shelf pages with stock imagery from the public nav
  if (process.env.FORCE_SEED === "true") {
    const result = await mongoose.connection.db.collection("pages").updateMany(
      { slug: { $nin: ["home", "about"] } },
      { $set: { showInNav: false, status: "draft" } }
    );
    console.log("Archived extra shelf pages:", result.modifiedCount);

    await mongoose.connection.db.collection("settings").updateOne(
      { key: "site" },
      {
        $set: {
          siteName: "DIL & DATA",
          tagline: "A personal journal of heart, curiosity, and quiet strength",
          about:
            "Manogna writes DIL & DATA — home of Shakti's Blog. Short letters, soft frames, and quiet strength.",
          "seoDefaults.title": "DIL & DATA · Shakti's Blog",
          "seoDefaults.description":
            "A personal journal by Manogna — heart, curiosity, and quiet strength.",
        },
        $setOnInsert: { key: "site" },
      },
      { upsert: true }
    );
    console.log("Updated site settings branding");
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
