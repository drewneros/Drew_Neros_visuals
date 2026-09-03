#!/usr/bin/env node
// Gate oracles for the layout + typography pass. Every mode asserts first and
// prints its success marker last, so an early throw can never read as a pass.

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const R = (p) => readFileSync(join(ROOT, p), "utf8");
const CSS = () => R("index.html");
// Only the components that render the page. admin/console are local-only.
const COMPONENTS = ["gallery.jsx", "about.jsx", "contact.jsx", "sidebar.jsx", "hero.jsx"];
const SRC = () => COMPONENTS.map((f) => [f, R(join("src", f))]);

const mode = process.argv[2];
function assert(c, m) { if (!c) { console.error(`FAIL: ${m}`); process.exit(1); } }

const modes = {
  scale() {
    const css = CSS();
    const steps = ["--t-display", "--t-title", "--t-sub", "--t-lead", "--t-body", "--t-fine"];
    for (const s of steps) assert(css.includes(`${s}:`), `missing type token ${s}`);
    const space = ["--s-1", "--s-2", "--s-3", "--s-4", "--s-5", "--s-6", "--s-7"];
    for (const s of space) assert(css.includes(`${s}:`), `missing space token ${s}`);
    // Tokens that exist but are never applied are decoration.
    const used = steps.filter((s) => (css.match(new RegExp(`var\\(${s}\\)`, "g")) || []).length > 0);
    assert(used.length === steps.length,
      `type tokens defined but unused: ${steps.filter((s) => !used.includes(s)).join(", ")}`);
    const spaceUses = (css.match(/var\(--s-\d\)/g) || []).length;
    assert(spaceUses >= 20, `space scale only used ${spaceUses} times — not a rhythm`);
    console.log(`6 type steps, 7 space steps, ${spaceUses} space applications`);
    console.log("SCALE_OK");
  },

  nohardcoded() {
    const offenders = [];
    for (const [f, s] of SRC()) {
      // fontSize:NN in JSX = a size outside the scale.
      for (const m of s.matchAll(/fontSize:\s*(\d+)/g)) offenders.push(`${f}:${m[1]}px`);
      // clamp() in a component means a display size defined outside the tokens.
      for (const m of s.matchAll(/fontSize:\s*"clamp\([^"]*\)"/g)) offenders.push(`${f}:${m[0].slice(0, 34)}`);
    }
    // The sidebar's brand lockup and the intro are deliberate one-offs.
    const allowed = /sidebar\.jsx|hero\.jsx/;
    const real = offenders.filter((o) => !allowed.test(o));
    assert(real.length === 0, `${real.length} hardcoded sizes remain: ${real.slice(0, 6).join(", ")}`);
    console.log(`0 hardcoded sizes in page components (${offenders.length - real.length} allowed one-offs)`);
    console.log("NOHARDCODED_OK");
  },

  hierarchy() {
    const css = CSS();
    const grab = (n) => {
      const m = css.match(new RegExp(`--t-${n}:\\s*clamp\\((\\d+)px,[^,]+,\\s*(\\d+)px\\)`));
      return m ? [Number(m[1]), Number(m[2])] : null;
    };
    const d = grab("display"), t = grab("title"), s = grab("sub");
    assert(d && t && s, "display/title/sub are not all fluid clamp steps");
    // Each step must be clearly larger than the next, at both ends.
    assert(d[1] / t[1] >= 1.6, `display/title max ratio ${(d[1] / t[1]).toFixed(2)} — steps too close to read as a hierarchy`);
    assert(t[1] / s[1] >= 1.6, `title/sub max ratio ${(t[1] / s[1]).toFixed(2)} — steps too close`);
    assert(d[0] > t[0] && t[0] > s[0], "steps invert at small viewports");
    // And nothing may compete with them from inside a component.
    const rogue = SRC().flatMap(([f, src]) =>
      [...src.matchAll(/fontSize:\s*"clamp\((\d+)px/g)].map((m) => `${f}:${m[1]}`))
      .filter((r) => !/sidebar|hero/.test(r));
    assert(rogue.length === 0, `component-level display sizes still competing: ${rogue.join(", ")}`);
    console.log(`display ${d[1]} / title ${t[1]} / sub ${s[1]} — ratios ${(d[1] / t[1]).toFixed(2)}, ${(t[1] / s[1]).toFixed(2)}`);
    console.log("HIERARCHY_OK");
  },

  eyebrow() {
    // "01 — Selected work" etc: a mono label stacked above a heading that
    // already says the same thing. Five of them was the page's structural tic.
    const found = [];
    for (const [f, s] of SRC()) {
      for (const m of s.matchAll(/>\s*(\d{2})\s*(—|-|&mdash;)\s*[A-Z][^<{]*</g)) found.push(`${f}: ${m[0].trim().slice(1, 30)}`);
    }
    assert(found.length === 0, `${found.length} section eyebrows remain: ${found.join(" | ")}`);
    console.log("0 section eyebrows");
    console.log("EYEBROW_OK");
  },

  rhythm() {
    const css = CSS();
    assert(/\.section\{padding-block:var\(--s-\d\) var\(--s-\d\)\}/.test(css),
      "no shared .section block rhythm");
    // No page section may still carry its own hardcoded padding.
    const bad = [];
    for (const [f, s] of SRC()) {
      for (const m of s.matchAll(/<section[^>]*style=\{\{[^}]*padding:\s*"(\d+)px/g)) bad.push(`${f}:${m[1]}`);
    }
    assert(bad.length === 0, `sections still setting their own padding: ${bad.join(", ")}`);
    // And each page section must actually opt into the class.
    const sections = SRC().flatMap(([f, s]) => [...s.matchAll(/<section[^>]*id="(\w+)"[^>]*>/g)].map((m) => [f, m[1], m[0]]));
    const missing = sections.filter(([, , tag]) => !/className="[^"]*\bsection\b/.test(tag));
    assert(missing.length === 0, `sections not on the rhythm: ${missing.map((m) => m[1]).join(", ")}`);
    console.log(`${sections.length} sections on the shared rhythm, 0 with local padding`);
    console.log("RHYTHM_OK");
  },

  masonry() {
    const g = R("src/gallery.jsx");
    assert(!/columns\[i % cols\]\.push/.test(g), "masonry still deals images round-robin, scrambling order");
    assert(/heights\[k\] < heights\[c\]/.test(g), "masonry does not pick the shortest column");
    assert(/ratios\[i\]/.test(g), "masonry balances without using real aspect ratios");
    assert(/ratios=\{ratios\}/.test(g), "ratios are computed but never passed to Masonry");
    assert(/const ratios = shots\.map/.test(g), "ratios are not derived from the shots");
    console.log("MASONRY_OK");
  },

  measure() {
    const css = CSS();
    const m = css.match(/--measure:\s*(\d+)ch/);
    assert(m, "no measure token");
    const ch = Number(m[1]);
    assert(ch >= 45 && ch <= 78, `measure is ${ch}ch, outside the readable 45-78ch band`);
    assert(/\.measure\{max-width:var\(--measure\)\}/.test(css), "the measure token is never applied");
    const uses = (SRC().map(([, s]) => s).join("").match(/className="[^"]*\bmeasure\b/g) || []).length;
    assert(uses >= 3, `only ${uses} blocks use the measure — body copy is still unconstrained`);
    // Display type must not exceed the craft ceiling of ~6rem... at desktop the
    // hero is deliberately larger, but body steps must stay in text range.
    const body = Number(css.match(/--t-body:\s*(\d+)px/)[1]);
    assert(body >= 14 && body <= 18, `body text is ${body}px, outside 14-18px`);
    console.log(`measure ${ch}ch applied to ${uses} blocks, body ${body}px`);
    console.log("MEASURE_OK");
  },
};

const fn = modes[mode];
if (!fn) { console.error(`unknown mode "${mode}". one of: ${Object.keys(modes).join(", ")}`); process.exit(2); }
await fn();
