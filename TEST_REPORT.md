# V2.1.1 — Mobile Workspace Optimization | Test report

## Verified in this revision (Chromium / Playwright)
- Node syntax validation: app.js.
- Mobile/tablet viewports: 390×844, 430×932, 768×1024, 1024×768, 1366×1024, 844×390, with mobile/touch emulation.
- In each viewport: add a comment, scroll the lower tools pane to the bottom; header, center workspace, and canvas bounding boxes unchanged; document scrollY remains zero; lower pane scrollTop changes. Canvas stage and tools remain visible.
- 390×844: edit Thai comment in lower panel and verify current object and fixed center; drag split handle, keyboard ArrowUp changes 55% to 50%; simulated storage reload restores preference. At reduced viewport 390×480, both panels remain visible and document does not scroll; background toolbar opens its editor in lower pane.
- Desktop 1440×950: splitter hidden; left/center/right positions preserved.
- Export composition PNG 1080×1920 verified after mobile changes.
- Repeated V2.1 regression suite: V2.0 project import, template saving/export, New Content and Undo, simulated storage round trip, five Thai batch questions with unique avatar seeds, 2× transparent PNG 2160×3840 (alpha 0–255), template import/reset and custom factory template. No page errors in these suites.

## Not verified / limitations
- Browser policy blocked navigating to the test origin, so HTML/JS were loaded inline and storage was simulated; actual localStorage/IndexedDB persistence on Vercel is not verified.
- Real iPhone/iPad Safari, on-device virtual keyboard and real finger gestures were not tested. Reduced viewport test is only a keyboard-height simulation. Small screens necessarily reduce the preview area; the splitter allows adjustment.
- Existing V2.1 project/template format, storage keys and rendering/export engine preserved; no full exhaustive regression for every V2.0 feature.
- Not deployed to the user's website. Preserve any customized factory-template.js when updating.

## Previous V2.1 report (historical)
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
