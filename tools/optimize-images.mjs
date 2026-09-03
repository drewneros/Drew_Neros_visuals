#!/usr/bin/env node
// One-shot gallery pipeline.
//
// The repo shipped 195MB of untouched camera files (3600-6700px) into a grid
// that renders them ~400px wide. This moves the originals aside, writes web
// sizes back into images/, and bakes a ~20px blurred version of each photo
// into data.jsx as an inline data-URI so a slot shows that photo's real colours
// while the full file is still in flight.
//
// Requires ImageMagick (`magick`). Idempotent: re-running skips the move once
// images-full/ exists and simply regenerates derivatives from the originals.

import { execFileSync } from "node:child_process";
import {
  existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync,
  statSync, writeFileSync,
} from "node:fs";
import { join, extname, basename } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SHIP = join(ROOT, "images");
const FULL = join(ROOT, "images-full");
const TMP = join(ROOT, ".lqip-tmp");
const DATA = join(ROOT, "src", "data.jsx");

const MAX_EDGE = 1600;   // long edge of the shipped file
const QUALITY = 74;      // WebP: visually equal to JPEG ~88 at ~40% the bytes
const LQIP_EDGE = 20;    // long edge of the inline blurred placeholder

const isImage = (f) => /\.(jpe?g|png)$/i.test(f) && !f.startsWith(".");

function sh(cmd, args) {
  return execFileSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"] }).toString();
}

// ---- 1. park the originals -------------------------------------------------

if (!existsSync(FULL)) {
  mkdirSync(FULL, { recursive: true });
  const originals = readdirSync(SHIP).filter(isImage);
  for (const f of originals) renameSync(join(SHIP, f), join(FULL, f));
  console.log(`parked ${originals.length} originals -> images-full/`);
} else {
  console.log("images-full/ already present, regenerating derivatives from it");
}

const sources = readdirSync(FULL).filter(isImage);
if (!sources.length) {
  console.error("no source images found in images-full/");
  process.exit(1);
}

// ---- 2. web-size every photo ----------------------------------------------

mkdirSync(SHIP, { recursive: true });
mkdirSync(TMP, { recursive: true });

const lqip = {};
const webpFor = {};
let done = 0;

for (const f of sources) {
  const src = join(FULL, f);
  const webpName = `${basename(f, extname(f))}.webp`;
  const out = join(SHIP, webpName);
  webpFor[f] = webpName;

  // Shipped size: fit inside MAX_EDGE, strip EXIF, mild sharpen to recover
  // downscale softness. WebP because these are photographs at scale and it is
  // ~40% smaller than JPEG for the same perceived quality.
  sh("magick", [
    src,
    "-auto-orient",
    "-resize", `${MAX_EDGE}x${MAX_EDGE}>`,
    "-strip",
    "-unsharp", "0x0.6+0.6+0.02",
    "-quality", String(QUALITY),
    "-define", "webp:method=6",
    out,
  ]);

  // Placeholder: tiny, blurred, heavily compressed. Decoded by the browser
  // instantly and scaled up under a CSS blur, so it reads as the photo's
  // colour field rather than a grey box.
  const tiny = join(TMP, `${basename(f, extname(f))}.jpg`);
  sh("magick", [
    src,
    "-auto-orient",
    "-resize", `${LQIP_EDGE}x${LQIP_EDGE}>`,
    "-strip",
    "-quality", "40",
    tiny,
  ]);
  lqip[f] = `data:image/jpeg;base64,${readFileSync(tiny).toString("base64")}`;

  if (++done % 20 === 0) console.log(`  ${done}/${sources.length}`);
}

rmSync(TMP, { recursive: true, force: true });

const shipped = readdirSync(SHIP).filter((f) => /\.webp$/i.test(f));
const shippedBytes = shipped.reduce((n, f) => n + statSync(join(SHIP, f)).size, 0);
const originalBytes = sources.reduce((n, f) => n + statSync(join(FULL, f)).size, 0);
console.log(
  `resized ${done} images: ${(originalBytes / 1048576).toFixed(1)}MB -> ` +
  `${(shippedBytes / 1048576).toFixed(1)}MB`
);

// Drop any stale JPEG/PNG left in the shipped folder from an earlier run.
for (const f of readdirSync(SHIP).filter(isImage)) rmSync(join(SHIP, f));

// ---- 3. rewrite paths + bake the placeholders into data.jsx ----------------

let data = readFileSync(DATA, "utf8");
let patched = 0, missing = [];

// Each STATIC_SHOTS row carries previewUrl:"images/<file>". Point it at the
// WebP and append the lqip on the same row, replacing whatever a previous run
// wrote. Matching either extension keeps the script re-runnable.
data = data.replace(
  /previewUrl:"images\/([^"]+)"(,lqip:"[^"]*")?/g,
  (whole, file) => {
    const original = webpFor[file]
      ? file
      : Object.keys(webpFor).find((o) => webpFor[o] === file);
    if (!original) { missing.push(file); return whole; }
    patched++;
    return `previewUrl:"images/${webpFor[original]}",lqip:"${lqip[original]}"`;
  }
);

writeFileSync(DATA, data);
console.log(`baked ${patched} lqip placeholders into src/data.jsx`);
if (missing.length) {
  console.error(`WARNING: no placeholder for ${missing.length}: ${missing.slice(0, 5).join(", ")}`);
  process.exit(1);
}
