#!/usr/bin/env node
// The aw/ah in STATIC_SHOTS were hand-guessed (every portrait 4:5, every
// landscape 3:2). The reserved box has to match the real file or the blur-up
// placeholder resizes the moment the photo lands. Read the shipped WebP and
// write its true ratio back.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const DATA = join(ROOT, "src", "data.jsx");

function gcd(a, b) { return b ? gcd(b, a % b) : a; }

let data = readFileSync(DATA, "utf8");
let patched = 0, skipped = 0;

// Rewrite the aw/ah pair on any row whose previewUrl names a file we can measure.
data = data.replace(
  /\{id:"([^"]+)",cat:"([^"]+)",label:"([^"]*)",code:"([^"]+)",aw:(\d+),ah:(\d+),(.*?)previewUrl:"images\/([^"]+)"/g,
  (whole, id, cat, label, code, aw, ah, mid, file) => {
    const path = join(ROOT, "images", file);
    if (!existsSync(path)) { skipped++; return whole; }
    const out = execFileSync("magick", ["identify", "-format", "%w %h", path]).toString();
    const [w, h] = out.trim().split(/\s+/).map(Number);
    if (!w || !h) { skipped++; return whole; }
    const d = gcd(w, h);
    patched++;
    return `{id:"${id}",cat:"${cat}",label:"${label}",code:"${code}",aw:${w / d},ah:${h / d},${mid}previewUrl:"images/${file}"`;
  }
);

writeFileSync(DATA, data);
console.log(`synced ${patched} aspect ratios${skipped ? `, skipped ${skipped}` : ""}`);
if (!patched) process.exit(1);
