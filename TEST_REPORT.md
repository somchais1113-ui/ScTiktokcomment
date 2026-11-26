# V2.1.21 — Transform / Layout controls

Base: V2.1.20 Fully Package. App.js and existing image assets unchanged.

Actual Chromium automated tests passed at 390×844, 768×1024, and 1440×900:
- Transform visible when object selected, no disclosure triangle; four position controls remain.
- Layout collapsed by default, expands and collapses on click; Stack layout works.
- Transform remains directly before Layout.
- Existing three standard position presets preserve dimensions and rotation; undo/redo, lock and transparent PNG export (1080×1920) passed.
- No page errors in the two test suites. Below-logo control presence verified, its positioning algorithm unchanged, not separately retested.

Service worker cache name updated to v2121. Real iPhone Safari and production deployment not tested. Standalone HTML embeds application scripts; use full package for PWA assets.
