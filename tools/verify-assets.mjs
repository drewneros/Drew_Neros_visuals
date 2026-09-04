#!/usr/bin/env node
// Gate oracles for the hero-regression / sidebar-reveal / alt-note pass.
// Assert first, print the success marker last.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const R = (p) => readFileSync(join(ROOT, p), "utf8");
const mode = process.argv[2];
function assert(c, m) { if (!c) { console.error(`FAIL: ${m}`); process.exit(1); } }

const modes = {
  refs() {
    const have = new Set(readdirSync(join(ROOT, "images")));
    const files = ["src/intro.jsx", "src/hero.jsx", "src/about.jsx", "src/gallery.jsx", "src/app.jsx", "index.html"];
    const broken = [];
    for (const f of files) {
      if (!existsSync(join(ROOT, f))) continue;
      const s = R(f);
      for (const m of s.matchAll(/images\/([A-Za-z0-9_.\-]+\.(?:jpe?g|png|webp))/g)) {
        if (!have.has(m[1])) broken.push(`${f} -> ${m[1]}`);
      }
    }
    assert(broken.length === 0, `dead image refs: ${broken.join(" | ")}`);
    console.log("no dead raster references");
    console.log("REFS_OK");
  },

  async herolive() {
    const base = process.env.VERIFY_URL || "https://drewneros.github.io/Drew_Neros_visuals/";
    const intro = R("src/intro.jsx");
    const m = intro.match(/url\('images\/([^']+)'\)/);
    assert(m, "could not find the hero background url in intro.jsx");
    const res = await fetch(new URL(`images/${m[1]}`, base));
    assert(res.ok, `hero image images/${m[1]} returned ${res.status} on the live site`);
    const type = res.headers.get("content-type") || "";
    assert(/image\//.test(type), `hero image served as ${type}, not an image`);
    console.log(`live hero images/${m[1]} -> ${res.status} ${type}`);
    console.log("HEROLIVE_OK");
  },

  reveal() {
    const s = R("src/sidebar.jsx");
    // The content wrapper must delay its fade-in and not delay its fade-out.
    assert(/opacity \.12s ease, visibility 0s linear \.12s/.test(s),
      "collapsing path is not an immediate hide");
    assert(/opacity \.26s ease \.42s, visibility 0s linear \.42s/.test(s),
      "expanding path does not wait for the width transition before revealing");
    assert(/visibility:\s*collapsed \? "hidden" : "visible"/.test(s),
      "content is only transparent, not visibility-hidden, during the reflow");
    // The delay must be >= the width transition duration so the reflow is done.
    const widthDur = s.match(/width \.(\d)s cubic-bezier/);
    assert(widthDur, "could not read the width transition duration");
    assert(Number(`0.${widthDur[1]}`) <= 0.42, `reveal delay .42s is shorter than the width transition .${widthDur[1]}s`);
    console.log(`width .${widthDur[1]}s, reveal delayed .42s, collapse immediate`);
    console.log("REVEAL_OK");
  },

  altnote() {
    // A negative gate needs a positive control: the phrase must be findable.
    const notes = [
      join(process.env.HOME, ".claude/projects/-Users-drewneros/memory/project_drew_neros_visuals.md"),
      join(ROOT, "OWNER_NOTES.md"),
    ];
    let found = false;
    for (const n of notes) {
      if (existsSync(n) && /alt.?text/i.test(readFileSync(n, "utf8")) &&
          /generateAlt|random|not correct|per-shot/i.test(readFileSync(n, "utf8"))) found = true;
    }
    assert(found, "the alt-text defect is not recorded in memory or OWNER_NOTES with enough detail to act on");
    console.log("alt-text defect recorded for a later pass");
    console.log("ALTNOTE_OK");
  },
};

const fn = modes[mode];
if (!fn) { console.error(`unknown mode "${mode}"`); process.exit(2); }
await fn();
