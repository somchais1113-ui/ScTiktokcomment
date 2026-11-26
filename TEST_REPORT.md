# V2.1.13 — Bottom Safe Position
- Node syntax checks: app.js and sw.js passed.
- Chromium inline test harness: 390×844, 768×1024, 1440×900 passed. Verified bottom-row 18% clearance (subject to available space), six other vertical anchors unchanged, nine buttons, dimensions/rotation/text preserved, Undo/Redo, Lock and transparent PNG export at 1080×1920.
- Browser tests use simulated storage. Live Vercel deployment, PWA installation and physical iOS/Safari not tested.
- Existing saved positions are not migrated; press a bottom-row button to apply the new placement. Safe Zone is an estimate, not a guarantee against platform overlays.
