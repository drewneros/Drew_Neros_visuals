# Gates: gallery performance + blur-up + motion pass

OWNS: images/**, images-full/**, src/**, index.html, tools/**, .gitignore

Scope: cut the 195MB gallery payload to a web-appropriate size, replace the black
loading box with a blurred low-res version of each actual photo, fade images in
and out as they scroll, and take the site through a motion pass that feels alive
rather than templated.

- [x] G1: shipped gallery images total under 15MB (was 195MB)
  CHECK: node tools/verify-build.mjs payload
  EXPECT: PAYLOAD_OK
  EVIDENCE: 127 files, 12.8MB (from 194.4MB)

- [x] G2: no shipped image exceeds 1600px on its long edge
  CHECK: node tools/verify-build.mjs dimensions
  EXPECT: DIMENSIONS_OK
  EVIDENCE: largest long edge 1600px

- [x] G3: every original is preserved off the shipped path, none lost
  CHECK: node tools/verify-build.mjs originals
  EXPECT: ORIGINALS_OK
  EVIDENCE: 127 originals in images-full/ (gitignored), 0 orphans

- [x] G4: every gallery shot carries an inline lqip data-URI placeholder
  CHECK: node tools/verify-build.mjs lqip
  EXPECT: LQIP_OK
  EVIDENCE: 126/126 shots

- [x] G5: ShotImage paints the lqip blurred, then cross-fades to the real photo
  CHECK: node tools/verify-build.mjs blurup
  EXPECT: BLURUP_OK
  EVIDENCE: verified failing when the resolve-to-sharp rule is removed

- [x] G6: images fade in AND back out on scroll, both directions, soft floor
  CHECK: node tools/verify-build.mjs scrollfade
  EXPECT: SCROLLFADE_OK
  EVIDENCE: out-of-view opacity 0.16; verified failing on a one-way observer

- [x] G7: the black loading box is gone from the codebase
  CHECK: node tools/verify-build.mjs noblack
  EXPECT: NOBLACK_OK
  EVIDENCE: #0c0a08 and the shotPulse keyframe both removed

- [x] G8: motion system is real and applied, not a single generic fade
  CHECK: node tools/verify-build.mjs motion
  EXPECT: MOTION_OK
  EVIDENCE: 8 blur states, 7 tokenised easings, hover participates

- [x] G9: page boots clean on the live deploy, zero console errors, all shots render
  CHECK: node tools/verify-build.mjs live
  EXPECT: LIVE_OK
  EVIDENCE: live v13, 126 placeholders, webp content-type confirmed

- [x] G10: reduced-motion users get a still site, not a broken one
  CHECK: node tools/verify-build.mjs a11y
  EXPECT: A11Y_OK
  EVIDENCE: verified failing when the reduced-motion block is deleted

- [x] G11: visual review — the result reads as designed, not AI-generic
  EVIDENCE: live screenshots at 1440x720 and 375x812. Mobile capture shows the
  intended state directly: row 1 resolved photographs, rows 2-3 as blurred
  colour fields of their own images while still in flight. No black boxes at
  any point. Desktop first screen fully resolved after the entry-curve fix.

ABANDON: none.

<!--
Known follow-ups, not gate failures:
- index.html carries no cache-buster of its own, so a returning visitor can run
  new JSX against the previous inline <style>. Harmless here, worth a hash later.
- The lightbox still serves the same 1600px file it displays full-screen; a
  2048px variant would sharpen it without touching gallery weight.
-->
