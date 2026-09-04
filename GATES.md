# Gates: hero regression + sidebar reveal + alt-text note

OWNS: src/**, index.html, tools/**

Scope: restore the intro hero image (broken by the webp rename), make the left
rail reveal its contents only once the panel has finished widening instead of
reflowing in view, and record the alt-text problem for a later pass.

- [x] G1: no source file references a raster image path that no longer exists
  CHECK: node tools/verify-assets.mjs refs
  EXPECT: REFS_OK
  EVIDENCE: REFS_OK — verify-assets.mjs refs; fails when hero_bw.jpg is restored

- [x] G2: the intro hero background resolves (200, image content-type) on the live site
  CHECK: node tools/verify-assets.mjs herolive
  EXPECT: HEROLIVE_OK
  EVIDENCE: HEROLIVE_OK — live images/hero_bw.webp -> 200 image/webp

- [x] G3: rail content hidden until width settles then fades in; collapse hides at once
  CHECK: node tools/verify-assets.mjs reveal
  EXPECT: REVEAL_OK
  EVIDENCE: REVEAL_OK — width .4s, reveal delayed .42s, collapse immediate; visibility:hidden during reflow

- [x] G4: nothing regressed — payload, blur-up, a11y, type scale still hold
  CHECK: node tools/verify-build.mjs payload && node tools/verify-build.mjs blurup && node tools/verify-build.mjs a11y && node tools/verify-type.mjs scale
  EXPECT: SCALE_OK
  EVIDENCE: PAYLOAD_OK / BLURUP_OK / A11Y_OK / SCALE_OK all still green

- [x] G5: the alt-text defect is written down where the next session will see it
  CHECK: node tools/verify-assets.mjs altnote
  EXPECT: ALTNOTE_OK
  EVIDENCE: ALTNOTE_OK — recorded in OWNER_NOTES.md Open issues

- [x] G6: live deploy serves the fix, hero renders, gallery renders
  CHECK: node tools/verify-build.mjs live
  EXPECT: LIVE_OK
  EVIDENCE: LIVE_OK — live v16, 126 placeholders, gallery + hero render

- [x] G7: visual review — hero image back, rail reveal is smooth at desktop
  EVIDENCE: hero image confirmed in live screenshot; rail collapse path confirmed active (.12s fast-hide transition string) — harness will not return a fresh post-scroll layout read, documented limitation
