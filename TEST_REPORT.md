# V2.1 Test Report

## Verified in this revision
- Node syntax check: app.js and factory-template.js.
- Chromium via Playwright with HTML and JS loaded inline: open V2.0 example project with five comments and logo/background; save template with custom style and layout; export JSON without comments; export factory JS; New content preserves brand layers and Undo restores five comments.
- Simulated storage round trip (localStorage stub): save default, recreate page using saved store, verify logo/background, empty comments, dark card, font 37, stagger layout and export preferences; import template into independent mobile-sized browser context, set default, recreate page and reset factory.
- Batch generate five Thai mock questions; five distinct seeds, correct card style, automatic layout.
- Export PNG transparent 2×: verified 2160 × 3840 RGBA, alpha range 0–255.
- Load generated factory JS in independent browser context: custom template loads without personal store.
- Captured desktop and 390 px mobile screenshots. No runtime page errors in test suite.

## Not verified in this revision
- Browser policy blocked direct file and localhost navigation in test environment. IndexedDB and actual browser localStorage persistence across real reloads/origins were not verified; simulated storage covered the fallback logic, not browser quota or storage permissions.
- Actual Vercel deployment, iOS Safari, Android touch/pinch, clipboard, storage quota for large images, and full V2.0 regression suite were not repeated. V2.0 functionality was preserved in source except template-related integration.
- No approved production title logo supplied. Sample logo is illustrative only.
