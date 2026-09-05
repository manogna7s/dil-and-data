import "dotenv/config";
import mongoose from "mongoose";
import Settings from "../models/Settings.js";
import Page from "../models/Page.js";
import Content from "../models/Content.js";

const OLD = "A Personal Journal: Footnotes to an Unfinished Life.";
const NEW = "The Everything Journal of a Slightly Strange Girl.";

function replaceInValue(value) {
  let changed = 0;

  function walk(node) {
    if (typeof node === "string") {
      if (!node.includes(OLD)) return node;
      const next = node.split(OLD).join(NEW);
      if (next !== node) changed += 1;
      return next;
    }
    if (Array.isArray(node)) {
      return node.map(walk);
    }
    if (node && typeof node === "object" && !(node instanceof Date) && !Buffer.isBuffer(node)) {
      // Skip ObjectId / BSON types that aren't plain data
      if (node._bsontype || node instanceof mongoose.Types.ObjectId) return node;
      const out = Array.isArray(node) ? [] : {};
      for (const [key, val] of Object.entries(node)) {
        out[key] = walk(val);
      }
      return out;
    }
    return node;
  }

  const result = walk(value);
  return { result, changed };
}

async function updateCollection(Model, label) {
  const docs = await Model.find({}).lean();
  let matched = 0;
  let fieldsChanged = 0;

  for (const doc of docs) {
    const plain = { ...doc };
    delete plain._id;
    delete plain.__v;

    const { result, changed } = replaceInValue(plain);
    if (changed === 0) continue;

    matched += 1;
    fieldsChanged += changed;
    await Model.updateOne({ _id: doc._id }, { $set: result });
    console.log(`${label} updated:`, String(doc._id), `(${changed} field value(s))`);
  }

  return { matched, fieldsChanged };
}

async function run() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI required");
  await mongoose.connect(process.env.MONGODB_URI);

  const settings = await updateCollection(Settings, "settings");
  const pages = await updateCollection(Page, "page");
  const content = await updateCollection(Content, "content");

  const fieldsChanged =
    settings.fieldsChanged + pages.fieldsChanged + content.fieldsChanged;

  console.log({
    settingsMatched: settings.matched,
    pagesMatched: pages.matched,
    contentMatched: content.matched,
    fieldsChanged,
  });

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error(err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
