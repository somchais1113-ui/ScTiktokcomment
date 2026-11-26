# V2.1.23 — Below Logo Touch Fix

Baseline V2.1.22: the orange button worked under Chromium touch emulation (390 × 844); the reported Safari failure was not reproduced. The exact Safari cause remains unverified.

Changes: native per-button click listener instead of SVG event delegation; non-interactive SVG children and touch-action manipulation; comment-only below-logo action, visible canvas-logo requirement and clear status feedback when placement cannot fit. Existing other presets unchanged. Service worker cache version v2123.

Verified with Chromium via Playwright set_content (inline scripts, simulated storage):
- 390 × 844 touch and 768 × 1024 touch: actual tap events; 1440 × 900 mouse: click events.
- Below Logo aligns to logo center and gap; preserves text, width, height and rotation.
- Undo/Redo, hidden logo, locked comment, selected logo, insufficient space, all three standard anchors, transparent PNG export 1080 × 1920: PASS at all three sizes.
- No page JavaScript errors in the above runs; node --check app.js PASS.

Limitations: local HTTP navigation was blocked by the environment; hosted service worker lifecycle, persistent browser storage, real iOS Safari and Vercel deployment have not been verified. No live deployment performed.
