// Data + helpers shared by components.

const CATEGORIES = [
  {
    id: "fashion-editorial",
    name: "Fashion Editorial",
    short: "Editorial",
    blurb: "Story-driven shoots for magazines, lookbooks and stylists.",
    accent: "var(--film-red)",
    count: 14,
  },
  {
    id: "portraits",
    name: "Portraits",
    short: "Portraits",
    blurb: "Close, quiet studies. People as themselves.",
    accent: "var(--film-ochre)",
    count: 22,
  },
  {
    id: "models",
    name: "Models / Digitals",
    short: "Models",
    blurb: "Polaroid-style digitals and agency tests.",
    accent: "var(--film-olive)",
    count: 18,
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    short: "E-comm",
    blurb: "Clean, consistent, conversion-driven product on figure.",
    accent: "var(--film-teal)",
    count: 12,
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    short: "Lifestyle",
    blurb: "On-set documentary and brand storytelling.",
    accent: "var(--film-ochre)",
    count: 16,
  },
  {
    id: "product",
    name: "Product",
    short: "Product",
    blurb: "Still life and tabletop. Texture, light, restraint.",
    accent: "var(--film-teal)",
    count: 9,
  },
];

// Procedural "photographs": each is a placeholder with a code, a label, an
// aspect ratio and a tonal direction. They render as monospace cards.
function makeShots(catId, n, seedBase) {
  const aspects = [
    [4, 5], [3, 4], [2, 3], [5, 7], [1, 1], [4, 5], [3, 4], [5, 4], [3, 2],
  ];
  const tones = ["warm", "cool", "neutral", "high-contrast", "shadow", "muted"];
  const subjects = {
    "fashion-editorial": ["Look 01", "Look 02", "Backstage", "Cover try", "Beauty", "Movement", "Tailoring", "Mood", "Set piece"],
    portraits: ["Portrait — Mira", "Portrait — Tomas", "Portrait — Ana", "Portrait — Léa", "Studio sit", "Window light", "Profile", "Headshot", "Quiet"],
    models: ["Digital — front", "Digital — side", "Digital — full", "Polaroid 1", "Polaroid 2", "Polaroid 3", "Test 01", "Test 02", "Comp card"],
    ecommerce: ["SKU 014", "SKU 022", "SKU 031", "Flat lay", "On figure", "Detail crop", "Hero shot", "Back view", "Pack shot"],
    lifestyle: ["On set", "Cafe", "Street", "Golden hour", "Interior", "Hands", "Crowd", "Quiet moment", "Driving"],
    product: ["Bottle", "Texture study", "Glass", "Stack", "Macro", "Pour", "Reflection", "Edge light", "Tabletop"],
  };
  const items = [];
  for (let i = 0; i < n; i++) {
    const [aw, ah] = aspects[(seedBase + i) % aspects.length];
    items.push({
      id: `${catId}-${i + 1}`,
      cat: catId,
      label: subjects[catId][i % subjects[catId].length],
      code: `N_${String(seedBase + i + 1).padStart(3, "0")}`,
      aw, ah,
      tone: tones[(seedBase + i * 3) % tones.length],
      year: 2024 + ((i + seedBase) % 3) - 1,
      confidence: 0.7 + ((i * 13 + seedBase * 7) % 30) / 100,
    });
  }
  return items;
}

const _LS_KEY = "dn:published_shots";

// Load any previously published shots from localStorage on init
const _saved = (() => { try { return JSON.parse(localStorage.getItem(_LS_KEY) || "[]"); } catch { return []; } })();
const ALL_SHOTS = Array.isArray(_saved) ? _saved : [];

// Append uploaded files to ALL_SHOTS so the public galleries reflect what the
// owner has actually published. Files come from the admin flow and already
// carry shot metadata (label/code/year/aw/ah/tone) plus an optional previewUrl.
function publishFiles(files){
  const safe = (files || []).filter(f => f && f.cat);
  if (!safe.length) return;
  safe.forEach((f, i) => {
    const sh = f.shot || {};
    const fallbackLabel = (f.name || "").replace(/\.[a-z0-9]+$/i, "").replace(/[_-]+/g, " ") || sh.label || "Untitled";
    const aw = sh.aw || 4;
    const ah = sh.ah || 5;
    const id = `up-${Date.now()}-${i}`;
    ALL_SHOTS.push({
      id,
      cat: f.cat,
      label: fallbackLabel,
      code: `N_${String(ALL_SHOTS.length + 1).padStart(3, "0")}`,
      aw, ah,
      tone: sh.tone || "neutral",
      year: new Date().getFullYear(),
      confidence: f.confidence || 1,
      previewUrl: f.previewUrl || null,
      alt: f.alt || "",
    });
  });
  try { localStorage.setItem(_LS_KEY, JSON.stringify(ALL_SHOTS)); } catch {}
  window.dispatchEvent(new CustomEvent("dn:published"));
}

// "Press / Clients" line items for the About strip
const CLIENTS = [
  "Hindash Cosmetics", "Shein", "NAAR.HAUS", "MMG Models", "The Maine",
  "Black Island", "Moevir Magazine", "MOB Magazine", "L'Attirance Magazine", "Born Outside Italy",
  "Hindash Cosmetics", "Shein", "NAAR.HAUS", "MMG Models", "The Maine",
  "Black Island", "Moevir Magazine", "MOB Magazine", "L'Attirance Magazine", "Born Outside Italy",
];

const SERVICES = [
  { id: "editorial", name: "Editorial", line: "Concept → shoot → retouch" },
  { id: "campaign",  name: "Campaign",  line: "Multi-day production" },
  { id: "ecomm",     name: "E-commerce", line: "Studio days, clean delivery" },
  { id: "portrait",  name: "Portrait",  line: "Studio or location, half-day" },
  { id: "model-dev", name: "Model Development", line: "Studio or location shoots for emerging talent. Built for agency books and casting submissions." },
  { id: "digitals",  name: "Digitals / Polaroids", line: "Fast, clean agency digitals. Delivered same day." },
];

const FAQ = [
  { q: "Where are you based?", a: "Everywhere, honestly. I'm international — currently between Sydney, Europe and the Middle East. If the project is right, I travel for it. Reach out wherever you are." },
  { q: "Do you retouch in-house?", a: "Yes. Every frame I deliver is retouched by me. No outsourcing." },
  { q: "Turnaround?", a: "Selects within 24h. Final retouched gallery in 5–10 working days, dependent on scope." },
  { q: "Usage and licensing?", a: "Quoted per project. Commercial, editorial and exclusivity all handled in writing before shoot day." },
  { q: "Do you work with modeling agencies?", a: "Yes. I work directly with bookers on model development and digitals. Available for recurring agency work." },
  { q: "Are you available in Istanbul?", a: "Currently based in Istanbul for the next few months. Open to local agency bookings." },
];

// Random-ish helper to fake AI analysis times
const wait = (ms) => new Promise(r => setTimeout(r, ms));

function deleteShot(id) {
  const idx = ALL_SHOTS.findIndex(s => s.id === id);
  if (idx === -1) return;
  ALL_SHOTS.splice(idx, 1);
  try { localStorage.setItem(_LS_KEY, JSON.stringify(ALL_SHOTS)); } catch {}
  window.dispatchEvent(new CustomEvent("dn:published"));
}

function updateShot(id, changes) {
  const shot = ALL_SHOTS.find(s => s.id === id);
  if (!shot) return;
  Object.assign(shot, changes);
  try { localStorage.setItem(_LS_KEY, JSON.stringify(ALL_SHOTS)); } catch {}
  window.dispatchEvent(new CustomEvent("dn:published"));
}

Object.assign(window, { CATEGORIES, ALL_SHOTS, CLIENTS, SERVICES, FAQ, makeShots, wait, publishFiles, deleteShot, updateShot });
