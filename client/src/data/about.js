import { IMAGES } from "./images.js";

/**
 * About page copy — later: GET /api/about
 */
export const ABOUT = {
  name: "Manogna",
  role: "Writer · Builder · Observer",
  portrait: IMAGES.portrait,
  intro:
    "I write the way I make chai — slowly, with attention, and always with the hope that someone feels a little warmer afterward.",
  story: [
    "DIL & DATA began as two notebooks: one for the heart, one for the curious mind. Over time they became the same page.",
    "Here you will find travel notes, bookish rabbit holes, soft photography, and the occasional love letter to code that finally compiled.",
    "If you are the kind of person who underlines sentences and pauses for golden hour — welcome. You are among friends.",
  ],
  loves: [
    { id: "reading", label: "Reading", detail: "Margins full of soft pencil" },
    { id: "writing", label: "Writing", detail: "Letters, essays, quiet fiction" },
    { id: "travel", label: "Travel", detail: "Trains, trails, temple towns" },
    { id: "photography", label: "Photography", detail: "Light before it leaves" },
    { id: "coding", label: "Coding", detail: "Curiosity with a keyboard" },
  ],
  funFacts: [
    "I name Wi-Fi networks after book titles.",
    "Monsoon season is my favorite season for thinking.",
    "I have a playlist called “writing weather.”",
    "The first thing I pack is always a notebook.",
  ],
};
