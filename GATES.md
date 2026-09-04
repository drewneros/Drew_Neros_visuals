# Gates: hero regression + sidebar reveal + alt-text note

OWNS: src/**, index.html, tools/**

Scope: restore the intro hero image (broken by the webp rename), make the left
rail reveal its contents only once the panel has finished widening instead of
reflowing in view, and record the alt-text problem for a later pass.

- [ ] G1: no source file references a raster image path that no longer exists
  CHECK: node tools/verify-assets.mjs refs
  EXPECT: REFS_OK
  EVIDENCE: pending

- [ ] G2: the intro hero background resolves (200, image content-type) on the live site
  CHECK: node tools/verify-assets.mjs herolive
  EXPECT: HEROLIVE_OK
  EVIDENCE: pending

- [ ] G3: rail content hidden until width settles then fades in; collapse hides at once
  CHECK: node tools/verify-assets.mjs reveal
  EXPECT: REVEAL_OK
  EVIDENCE: pending

- [ ] G4: nothing regressed — payload, blur-up, a11y, type scale still hold
  CHECK: node tools/verify-build.mjs payload && node tools/verify-build.mjs blurup && node tools/verify-build.mjs a11y && node tools/verify-type.mjs scale
  EXPECT: SCALE_OK
  EVIDENCE: pending

- [ ] G5: the alt-text defect is written down where the next session will see it
  CHECK: node tools/verify-assets.mjs altnote
  EXPECT: ALTNOTE_OK
  EVIDENCE: pending

- [ ] G6: live deploy serves the fix, hero renders, gallery renders
  CHECK: node tools/verify-build.mjs live
  EXPECT: LIVE_OK
  EVIDENCE: pending

- [ ] G7: visual review — hero image back, rail reveal is smooth at desktop
  EVIDENCE: pending
