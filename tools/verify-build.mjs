#!/usr/bin/env node
// Gate oracles for GATES.md. Each mode asserts, then prints a success-only
// marker as its very last action, so a thrown error or an early return can
// never be mistaken for a pass.

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const R = (p) => readFileSync(join(ROOT, p), "utf8");
const mode = process.argv[2];

function assert(cond, msg) { if (!cond) { console.error(`FAIL: ${msg}`); process.exit(1); } }

const shipped = () =>
  existsSync(join(ROOT, "images"))
    ? readdirSync(join(ROOT, "images")).filter((f) => /\.(webp|jpe?g|png)$/i.test(f))
    : [];

const modes = {
  payload() {
    const files = shipped();
    assert(files.length > 100, `expected the full gallery, found ${files.length} files`);
    const bytes = files.reduce((n, f) => n + statSync(join(ROOT, "images", f)).size, 0);
    const mb = bytes / 1048576;
    assert(mb < 15, `shipped images are ${mb.toFixed(1)}MB, budget is 15MB`);
    console.log(`${files.length} files, ${mb.toFixed(1)}MB`);
    console.log("PAYLOAD_OK");
  },

  dimensions() {
    const files = shipped();
    assert(files.length > 100, `expected the full gallery, found ${files.length} files`);
    let worst = 0, worstFile = "";
    for (const f of files) {
      const out = execFileSync("magick", ["identify", "-format", "%w %h", join(ROOT, "images", f)]).toString();
      const [w, h] = out.trim().split(/\s+/).map(Number);
      assert(w > 0 && h > 0, `could not measure ${f}`);
      const edge = Math.max(w, h);
      if (edge > worst) { worst = edge; worstFile = f; }
    }
    assert(worst <= 1600, `${worstFile} has a ${worst}px long edge, cap is 1600`);
    console.log(`largest long edge ${worst}px (${worstFile})`);
    console.log("DIMENSIONS_OK");
  },

  originals() {
    const full = join(ROOT, "images-full");
    assert(existsSync(full), "images-full/ is missing — originals were not preserved");
    const originals = readdirSync(full).filter((f) => /\.(jpe?g|png)$/i.test(f));
    assert(originals.length >= 127, `only ${originals.length} originals preserved, expected >= 127`);
    // Every shipped file must trace back to an original of the same stem.
    const stems = new Set(originals.map((f) => f.replace(/\.[^.]+$/, "")));
    const orphans = shipped().filter((f) => !stems.has(f.replace(/\.[^.]+$/, "")));
    assert(orphans.length === 0, `shipped files with no original: ${orphans.slice(0, 3).join(", ")}`);
    assert(R(".gitignore").includes("images-full/"), "images-full/ is not gitignored; 195MB would be committed");
    console.log(`${originals.length} originals preserved, 0 orphans`);
    console.log("ORIGINALS_OK");
  },

  lqip() {
    const data = R("src/data.jsx");
    const rows = data.match(/previewUrl:"images\/[^"]+"/g) || [];
    const withLqip = data.match(/previewUrl:"images\/[^"]+",lqip:"data:image\/jpeg;base64,[A-Za-z0-9+/=]+"/g) || [];
    assert(rows.length >= 126, `expected >= 126 shots, found ${rows.length}`);
    assert(withLqip.length === rows.length,
      `${rows.length - withLqip.length} shots have no lqip placeholder`);
    // A placeholder that decodes to nothing is not a placeholder.
    const shortest = Math.min(...withLqip.map((m) => m.length));
    assert(shortest > 200, `an lqip data-URI is only ${shortest} chars — too small to carry colour`);
    console.log(`${withLqip.length}/${rows.length} shots carry an lqip`);
    console.log("LQIP_OK");
  },

  blurup() {
    const js = R("src/placeholder.jsx");
    const css = R("index.html");
    assert(js.includes("shot-lqip"), "ShotImage never renders the lqip layer");
    assert(/_lqip\s*&&\s*<div className="shot-lqip"/.test(js), "lqip layer is not conditional on the shot having one");
    assert(js.includes('loading={eager ? "eager" : "lazy"}'), "images are not lazy-loaded");
    assert(/\.shot-img\.is-loaded \.shot-lqip\{\s*opacity:0/.test(css), "the lqip never fades out on load");
    assert(/\.shot-img img\{[^}]*filter:blur\(/.test(css), "the real image does not start blurred");
    assert(/\.shot-img\.is-loaded img\{[^}]*filter:blur\(0\)/.test(css), "the real image never resolves to sharp");
    console.log("BLURUP_OK");
  },

  scrollfade() {
    const js = R("src/placeholder.jsx");
    const css = R("index.html");
    // Both directions: classList.toggle with the boolean, not a one-way add.
    assert(/classList\.toggle\("is-present",\s*e\.isIntersecting\)/.test(js),
      "presence is not toggled in both directions");
    assert(!/io\.unobserve\(e\.target\)/.test(js.split("presenceObserver")[1] || ""),
      "the presence observer unobserves, so frames can never fade back out");
    const m = css.match(/\.shot-img:not\(\.is-present\)\{([^}]*)\}/);
    assert(m, "no out-of-view state for frames");
    const floor = m[1].match(/opacity:\s*\.?(\d+)/);
    assert(floor, "the out-of-view state sets no opacity");
    const val = Number(`0.${floor[1]}`);
    assert(val > 0 && val < 0.4, `out-of-view opacity is ${val}; wanted a soft floor above 0, below 0.4`);
    console.log(`out-of-view opacity ${val}`);
    console.log("SCROLLFADE_OK");
  },

  noblack() {
    const css = R("index.html");
    const js = R("src/placeholder.jsx");
    assert(!js.includes('background:"#0c0a08"'), "the old black loading box is still in ShotImage");
    assert(!css.includes("shotPulse"), "the old black pulse keyframe is still present");
    assert(/\.shot-img\{[^}]*background:var\(--frame-base\)/.test(css),
      "frames do not sit on the themed base colour");
    console.log("NOBLACK_OK");
  },

  motion() {
    const css = R("index.html");
    assert(css.includes("--ease-out: cubic-bezier(.16,1,.3,1)"), "no shared easing token");
    // The thesis is blur-based, not a transform/opacity-only generic fade.
    const blurs = (css.match(/filter:\s*blur\(/g) || []).length;
    assert(blurs >= 3, `only ${blurs} blur states — the develop is not carried through`);
    assert(/\.shot-img\.is-loaded:hover img/.test(css), "hover does not participate in the motion system");
    const eases = (css.match(/var\(--ease-out\)/g) || []).length;
    assert(eases >= 5, `only ${eases} uses of the easing token — motion is not systematised`);
    console.log(`${blurs} blur states, ${eases} tokenised easings`);
    console.log("MOTION_OK");
  },

  a11y() {
    const css = R("index.html");
    const m = css.match(/@media \(prefers-reduced-motion: reduce\)\{([\s\S]*?)\n  \}/);
    assert(m, "no prefers-reduced-motion block");
    const body = m[1];
    assert(/transition-duration:\.01ms !important/.test(body), "transitions are not neutralised");
    assert(/\.shot-img[^}]*opacity:1 !important/.test(body),
      "frames could stay faded out for reduced-motion users");
    assert(/\.shot-img[^}]*filter:none !important/.test(body), "frames could stay blurred");
    console.log("A11Y_OK");
  },

  async live() {
    const url = process.env.VERIFY_URL || "https://drewneros.github.io/Drew_Neros_visuals/";
    const html = await fetch(url).then((r) => {
      if (!r.ok) { console.error(`FAIL: ${url} returned ${r.status}`); process.exit(1); }
      return r.text();
    });
    const v = html.match(/data\.jsx\?v=(\d+)/);
    assert(v, "could not read the cache-buster from the live page");
    const local = R("index.html").match(/data\.jsx\?v=(\d+)/)[1];
    assert(v[1] === local, `live is serving v${v[1]}, local is v${local} — deploy has not landed`);
    const data = await fetch(new URL(`src/data.jsx?v=${v[1]}`, url)).then((r) => r.text());
    const lq = (data.match(/lqip:"data:image\/jpeg;base64,/g) || []).length;
    assert(lq >= 126, `live data.jsx carries only ${lq} placeholders`);
    // Spot-check that a real shipped image actually resolves.
    const first = data.match(/previewUrl:"(images\/[^"]+)"/)[1];
    const img = await fetch(new URL(first, url));
    assert(img.ok, `${first} is 404 on the live site`);
    const type = img.headers.get("content-type") || "";
    assert(type.includes("webp"), `${first} served as ${type}, expected webp`);
    console.log(`live v${v[1]}, ${lq} placeholders, ${first} ok`);
    console.log("LIVE_OK");
  },
};

const fn = modes[mode];
if (!fn) {
  console.error(`unknown mode "${mode}". one of: ${Object.keys(modes).join(", ")}`);
  process.exit(2);
}
await fn();
