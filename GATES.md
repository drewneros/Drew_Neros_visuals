# Gates: layout + typography redesign

OWNS: src/**, index.html, tools/**

Scope: replace ad-hoc sizing with a real type and space scale, remove the
repeated eyebrow labels, give the page one clear heading hierarchy and a
consistent section rhythm, and fix the masonry that scrambles image order.

- [x] G1: a tokenised type scale exists and is actually used
  CHECK: node tools/verify-type.mjs scale
  EXPECT: SCALE_OK
  EVIDENCE: 6 type steps, 7 space steps, 40+ space applications

- [x] G2: no orphan font sizes left hardcoded in components
  CHECK: node tools/verify-type.mjs nohardcoded
  EXPECT: NOHARDCODED_OK
  EVIDENCE: 0 hardcoded sizes in page components (18 replaced)

- [x] G3: display sizes form a clear hierarchy, not five competing steps
  CHECK: node tools/verify-type.mjs hierarchy
  EXPECT: HIERARCHY_OK
  EVIDENCE: display 168 / title 76 / sub 34 — ratios 2.21, 2.24; fails at ratio 1.12

- [x] G4: the repeated section eyebrows are gone
  CHECK: node tools/verify-type.mjs eyebrow
  EXPECT: EYEBROW_OK
  EVIDENCE: 0 of the 5 section eyebrows remain; fails when one is re-added

- [x] G5: section rhythm comes from a space scale, not per-section padding
  CHECK: node tools/verify-type.mjs rhythm
  EXPECT: RHYTHM_OK
  EVIDENCE: 3 sections on the shared rhythm, 0 with local padding

- [x] G6: masonry preserves reading order and balances columns by height
  CHECK: node tools/verify-type.mjs masonry
  EXPECT: MASONRY_OK
  EVIDENCE: shortest-column packing with real ratios; fails on round-robin

- [x] G7: body copy sits in a readable measure, headings stay in range
  CHECK: node tools/verify-type.mjs measure
  EXPECT: MEASURE_OK
  EVIDENCE: measure 62ch applied to 4 blocks, body 15px

- [x] G8: nothing regressed — payload, blur-up, motion and a11y still hold
  CHECK: node tools/verify-build.mjs payload && node tools/verify-build.mjs blurup && node tools/verify-build.mjs motion && node tools/verify-build.mjs a11y
  EXPECT: A11Y_OK
  EVIDENCE: payload/blurup/motion/a11y/noblack/lqip/originals all still green

- [x] G9: live deploy serves the redesign and every shot still renders
  CHECK: node tools/verify-build.mjs live
  EXPECT: LIVE_OK
  EVIDENCE: live v14 verified, 126 placeholders, webp content-type ok

- [x] G10: visual review at desktop and mobile — reads as designed, not templated
  EVIDENCE: desktop 1440x900 and mobile 375x812 reviewed; first photograph reaches the first screen (59% down, was 76%)
