# V2.1.22 — Group Shuffle & Collapsible Layers
Base: V2.1.21. Changes limited to Layers disclosure control and group identity shuffle, including identification of group-shuffled illustrative/anonymized questions in the renderer. Existing single Shuffle, assets, logo, layout and position logic retained.

## Actual checks
- Node JavaScript syntax check passed.
- Chromium test_group_shuffle.py passed at 390×844, 768×1024, 1440×900.
- Layers defaults closed; open/close, layer count and list tested.
- Group shuffle disabled for single question; four-card case tested, including real-comment source, name lock, avatar lock, object lock, unique names/photos, and unchanged text/position/width/rotation/source/brand assets.
- Undo and redo restore the entire group in one operation.
- Group-shuffled header labels verified in rendering data; transparent PNG 1080×1920 exported at all three sizes; ZIP containing four PNGs exported on mobile viewport.
- No JavaScript page errors in test suites.
- Existing Layout collapse and Transform controls tested via test_panel_visibility.py at all three sizes.

## Limits
Tests load scripts inline in Chromium with simulated browser storage. Not tested on physical iPhone/Safari or deployed Vercel. Height can change with username length; group shuffle does not reflow the layout. Name/avatar uniqueness is best effort after library exhaustion or if preexisting locked entries repeat. Group-shuffled cards show an illustrative/anonymized header, including export. Standalone HTML is for local use; use full package for PWA.
