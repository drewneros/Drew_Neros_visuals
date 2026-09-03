# Gates: gallery performance + blur-up + motion pass

OWNS: images/**, images-full/**, src/**, index.html, tools/**, .gitignore

Scope: cut the 195MB gallery payload to a web-appropriate size, replace the black
loading box with a blurred low-res version of each actual photo, fade images in
and out as they scroll, and take the site through a motion/redesign pass that
feels alive rather than templated.

- [ ] G1: shipped gallery images total under 15MB (was 195MB)
  CHECK: node tools/verify-build.mjs payload
  EXPECT: PAYLOAD_OK
  EVIDENCE: pending

- [ ] G2: no shipped image exceeds 1600px on its long edge
  CHECK: node tools/verify-build.mjs dimensions
  EXPECT: DIMENSIONS_OK
  EVIDENCE: pending

- [ ] G3: every original is preserved off the shipped path, none lost
  CHECK: node tools/verify-build.mjs originals
  EXPECT: ORIGINALS_OK
  EVIDENCE: pending

- [ ] G4: every gallery shot carries an inline lqip data-URI placeholder
  CHECK: node tools/verify-build.mjs lqip
  EXPECT: LQIP_OK
  EVIDENCE: pending

- [ ] G5: ShotImage paints the lqip blurred, then cross-fades to the real photo
  CHECK: node tools/verify-build.mjs blurup
  EXPECT: BLURUP_OK
  EVIDENCE: pending

- [ ] G6: images fade in AND back out on scroll, both directions, soft floor
  CHECK: node tools/verify-build.mjs scrollfade
  EXPECT: SCROLLFADE_OK
  EVIDENCE: pending

- [ ] G7: the black loading box is gone from the codebase
  CHECK: node tools/verify-build.mjs noblack
  EXPECT: NOBLACK_OK
  EVIDENCE: pending

- [ ] G8: motion system is real and applied, not a single generic fade
  CHECK: node tools/verify-build.mjs motion
  EXPECT: MOTION_OK
  EVIDENCE: pending

- [ ] G9: page boots clean on the live deploy, zero console errors, all shots render
  CHECK: node tools/verify-build.mjs live
  EXPECT: LIVE_OK
  EVIDENCE: pending

- [ ] G10: reduced-motion users get a still site, not a broken one
  CHECK: node tools/verify-build.mjs a11y
  EXPECT: A11Y_OK
  EVIDENCE: pending

- [ ] G11: visual review — the result reads as designed, not AI-generic
  EVIDENCE: pending

<!--
G11 is manual: screenshots reviewed at desktop and mobile before reporting done.
-->
