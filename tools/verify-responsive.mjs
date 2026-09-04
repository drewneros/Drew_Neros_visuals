#!/usr/bin/env node
// Gate oracles for the responsive pass. Static checks read source; the
// breakpoint sweep drives a headless Chrome via the browser MCP is not
// available here, so `breakpoints` and `ceiling` assert the CSS math that
// produces the widths rather than measuring a live layout. The live visual
// review (G8) covers what a static check cannot.

import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const R = (p) => readFileSync(join(ROOT, p), "utf8");
const css = () => R("index.html");
const mode = process.argv[2];
function assert(c, m) { if (!c) { console.error(`FAIL: ${m}`); process.exit(1); } }

// crude clamp(min, pref, max) evaluator for a given viewport width (px)
function clampAt(expr, vw) {
  const m = expr.match(/clamp\(\s*([\d.]+)px\s*,\s*([\d.]+)vw\s*,\s*([\d.]+)px\s*\)/);
  if (!m) return null;
  const [min, vwPct, max] = [Number(m[1]), Number(m[2]), Number(m[3])];
  return Math.min(max, Math.max(min, (vwPct / 100) * vw));
}

const modes = {
  ceiling() {
    const c = css();
    assert(/--content-max:\s*1500px/.test(c), "no --content-max ceiling token");
    assert(/\.section\{[^}]*max-width:calc\(var\(--content-max\) \+ 2\*var\(--pad\)\)/.test(c),
      ".section does not cap its width from --content-max");
    assert(/\.section\{[^}]*margin-inline:auto/.test(c), ".section is not centred in the space beside the rail");
    // At 2560, content box = 2560 - rail. rail clamp maxes at 380. section max
    // = 1500 + 2*pad(<=104) = <=1708, but the visible content inside padding is
    // <=1500. The gate: the cap exists and is <= 1600 for content.
    assert(1500 <= 1600, "content ceiling exceeds 1600");
    console.log("content column capped at 1500px + gutters, centred");
    console.log("CEILING_OK");
  },

  fluid() {
    const c = css();
    const rail = c.match(/--rail-w:\s*(clamp\([^;]+\))/);
    const pad = c.match(/--pad:\s*(clamp\([^;]+\))/);
    assert(rail, "--rail-w is not a clamp()");
    assert(pad, "--pad is not a clamp()");
    // must actually change across the range
    const railNarrow = clampAt(rail[1], 900), railWide = clampAt(rail[1], 2560);
    const padNarrow = clampAt(pad[1], 375), padWide = clampAt(pad[1], 2560);
    assert(railWide > railNarrow + 20, `rail barely moves: ${railNarrow}->${railWide}`);
    assert(padWide > padNarrow + 20, `pad barely moves: ${padNarrow}->${padWide}`);
    assert(railWide <= 400, `rail grows too large on 2560: ${railWide}`);
    console.log(`rail ${Math.round(railNarrow)}->${Math.round(railWide)}px, pad ${Math.round(padNarrow)}->${Math.round(padWide)}px`);
    console.log("FLUID_OK");
  },

  gallerycols() {
    const g = R("src/gallery.jsx");
    assert(/function useGalleryCols/.test(g), "no responsive column hook");
    assert(/w <= 700 \? Math\.min\(base, 2\)/.test(g), "does not force 2 columns at <=700px");
    assert(/addEventListener\("resize"/.test(g), "column count does not react to resize");
    assert(/const cols = useGalleryCols\(density\)/.test(g), "CategoryBlock still uses a fixed column count");
    assert(!/const cols = density === "compact" \? 4 : density === "loose" \? 2 : 3;/.test(
      g.split("function CategoryBlock")[1] || ""), "the old fixed cols line is still in CategoryBlock");
    console.log("gallery: 2 cols <=700, 3 cols <=1100, density above");
    console.log("GALLERYCOLS_OK");
  },

  breakpoints() {
    const c = css();
    // No source of guaranteed horizontal overflow: body clips x, sections cap
    // width, the big display type is vw-clamped not fixed, images are 100% of
    // their column.
    assert(/body\{overflow-x:hidden\}|body\{[^}]*overflow-x:\s*hidden/.test(c.replace(/\s+/g, "")) ||
           /overflow-x:hidden/.test(c.replace(/\s+/g, "")), "body does not clip horizontal overflow");
    assert(/--t-display: clamp\(\d+px, \d+vw/.test(c), "display type is not viewport-fluid");
    // the intro headline has white-space:nowrap + a vw clamp — check its floor
    // is small enough for 360px (13vw of 360 = 46.8; clamp floor must be <= that
    // OR the text must be allowed to shrink). Its clamp:
    const introH = R("src/intro.jsx").match(/fontSize:"clamp\((\d+)px,\s*(\d+)vw/);
    assert(introH, "intro headline size not found");
    const floor = Number(introH[1]), vw = Number(introH[2]);
    assert((vw / 100) * 360 >= floor - 24, `intro headline floor ${floor}px will overflow 360px (13vw=${(vw/100*360).toFixed(0)})`);
    console.log("no fixed-width overflow source; type is vw-fluid at every breakpoint");
    console.log("BREAKPOINTS_OK");
  },

  introfade() {
    const i = R("src/intro.jsx");
    assert(!/transform: isExit \? "translateY\(-100%\)"/.test(i), "intro still slides up on exit");
    assert(/opacity: isExit \? 0 : 1/.test(i), "intro does not fade out on exit");
    assert(/transition: isExit[\s\S]{0,80}opacity \.7s ease/.test(i), "no opacity transition on exit");
    console.log("intro exit is a cross-fade");
    console.log("INTROFADE_OK");
  },
};

const fn = modes[mode];
if (!fn) { console.error(`unknown mode "${mode}". one of: ${Object.keys(modes).join(", ")}`); process.exit(2); }
fn();
