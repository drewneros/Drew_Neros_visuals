# Gates: responsive pass — iMac to phone

OWNS: src/**, index.html, tools/**

Scope: the layout only worked around 1440. Give it a content ceiling so a 5K
iMac does not stretch text and images edge to edge, scale the rail and gutters
with the viewport, drop the gallery to 2 columns on phones instead of 104px
thumbnails, and replace the intro's slide-up (which flashes a white gap) with a
cross-fade.

- [ ] G1: content column is capped and centred; on a 2560px viewport the work
       section content is <= 1600px wide, not ~2250px
  CHECK: node tools/verify-responsive.mjs ceiling
  EXPECT: CEILING_OK
  EVIDENCE: pending

- [ ] G2: rail width and section gutters scale with the viewport (clamp/fluid),
       not a single fixed px value
  CHECK: node tools/verify-responsive.mjs fluid
  EXPECT: FLUID_OK
  EVIDENCE: pending

- [ ] G3: gallery shows 2 columns at <= 700px wide, 3+ above
  CHECK: node tools/verify-responsive.mjs gallerycols
  EXPECT: GALLERYCOLS_OK
  EVIDENCE: pending

- [ ] G4: no horizontal scroll and no clipped heading at 360, 390, 768, 1024,
       1440, 1920, 2560
  CHECK: node tools/verify-responsive.mjs breakpoints
  EXPECT: BREAKPOINTS_OK
  EVIDENCE: pending

- [ ] G5: the intro reveals by cross-fade, no slide, no white gap on exit
  CHECK: node tools/verify-responsive.mjs introfade
  EXPECT: INTROFADE_OK
  EVIDENCE: pending

- [ ] G6: nothing regressed — payload, blur-up, motion, a11y, type scale, eyebrow
  CHECK: node tools/verify-build.mjs payload && node tools/verify-build.mjs blurup && node tools/verify-build.mjs a11y && node tools/verify-type.mjs scale && node tools/verify-type.mjs eyebrow
  EXPECT: EYEBROW_OK
  EVIDENCE: pending

- [ ] G7: live deploy serves it and renders clean at 2560 and at 375
  CHECK: node tools/verify-build.mjs live
  EXPECT: LIVE_OK
  EVIDENCE: pending

- [ ] G8: visual review at 2560 / 1440 / 1024 / 768 / 390 — reads as designed at each
  EVIDENCE: pending
