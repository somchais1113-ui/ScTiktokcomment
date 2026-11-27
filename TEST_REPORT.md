# SC Comment Studio V2.1.24 — Library Update
Base: V2.1.23 full package. Added 100 labels and 50 cropped photo illustration assets; retained 50 original labels and 50 original avatars. Names stored in four groups (50/35/35/30); no demographic matching. Photo pool used only for visibly labeled sample questions. Real-source Shuffle uses illustrated replacement avatars and visible disclosure.

## Tests executed
- Node syntax check: app.js and identity-library.js — PASS.
- test_library_update.py — PASS: 150 unique names, 100 avatar entries, source-specific pools, visible disclosures, no page errors.
- test_group_shuffle.py — PASS on Chromium 390×844, 768×1024 and 1440×900: group shuffle, lock, undo/redo, layer collapse, PNG and ZIP export.

## Not tested
Physical iPhone/Safari, live Vercel deployment, and offline PWA update after deployment. Existing workspace/position controls were not changed or independently re-tested in this update.
