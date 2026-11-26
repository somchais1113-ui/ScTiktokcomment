# V2.1.6 test report

Verified using Chromium/Playwright with embedded app code and synthetic browser storage, mobile viewport 390×844 and desktop 1440×900:
- 50 names and 50 JPEG assets built from the supplied files; avatar contact sheet inspected visually.
- Mobile comment editor is first in the lower panel; canvas remains stationary while the lower panel scrolls. Desktop editor remains in inspector; dark mode toggles.
- Transform collapsed by default; shuffle changes both identity fields without changing text, x/y or width. Both locks individually tested; both enabled disables shuffle.
- Batch generation of five Thai questions yields five distinct names and photos. Real-comment batch preserves input name and does not receive a library photo; shuffle is disabled.
- Mock label remains in rendered card metrics; PNG composition rendered at 1080×1920; ZIP with five PNG entries generated and inspected. Project validation accepts new objects.
- No JS runtime exceptions during the above test. Node syntax checks passed for app.js and sw.js.

Not tested: physical iPhone/iPad, Safari native share sheet, actual hosted service worker lifecycle/offline and IndexedDB persistence (network navigation blocked in test environment). Standalone HTML tested with synthetic storage; production deploy not performed. Old regression scripts included for further testing but not rerun in full.
