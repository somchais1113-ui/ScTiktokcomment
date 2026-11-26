# SC Comment Studio V2.1.6 — Smart Workflow Edition

All favicon, header and PWA icon artwork is rendered from the exact supplied `icon-source.svg`. The iOS and maskable PWA PNGs use an opaque dark background for platform cropping; the ordinary favicon and PWA icon variants preserve the master artwork's transparent corners. The editor and content logo are unchanged. Deploy the entire folder; existing Home Screen shortcuts may need to be removed and added again. Cache version: v215. The separate standalone HTML is for local preview.

## Previous release notes
# SC Comment Studio V2.1.4 — Header Icon Update

- Header now uses the existing SC app icon (`icon-192.png`), in both themes and all screen sizes.
- Header spacing, editor functionality and standard content logo remain unchanged.
- Service-worker cache bumped to v214 to refresh the deployed UI.
- Fully Package: deploy the folder contents to Vercel. Standalone HTML: local preview only; installable PWA requires the hosted package.

## Previous release notes
# SC Comment Studio V2.1.3 — App Icon & PWA Edition

## What's new
- Added custom **SC** app icon set for Chrome favicon, iPhone Home Screen, Android, and PWA.
- Added `manifest.webmanifest` for standalone app-like launch.
- Added `apple-touch-icon.png` and iOS web-app meta tags.
- Added `sw.js` service worker for basic offline asset caching.
- Updated page title to `SC Comment Studio V2.1.3`.

## Icon files included
- `favicon.ico`
- `favicon-16x16.png`
- `favicon-32x32.png`
- `favicon-48x48.png`
- `apple-touch-icon.png` (180×180)
- `icon-192.png`
- `icon-512.png`
- `icon-maskable-192.png`
- `icon-maskable-512.png`
- `icon-source.svg`

## iPhone / iPad Home Screen
1. Deploy the site or open the hosted URL in Safari.
2. Tap **Share**.
3. Tap **Add to Home Screen**.
4. Confirm the name `SC Comment`.
5. Open from the Home Screen icon.

### Result
- The app opens in a more app-like, standalone view.
- Safari's standard top URL bar is reduced/hidden in standalone launch.
- The Home Screen icon uses the custom `SC` icon from `apple-touch-icon.png`.

## Chrome / Desktop
- Chrome tab uses `favicon.ico` / PNG favicon files automatically.
- Install support uses `manifest.webmanifest`.

## Files changed from V2.1.2
- `index.html`
- `README.md`
- `TEST_REPORT.md`
- Added all icon files
- Added `manifest.webmanifest`
- Added `sw.js`

## Important note
Safari on iOS does **not** allow a website to automatically pin itself to the Home Screen. The user must still manually choose **Share → Add to Home Screen**.

## Visual design note
The new icon is an original **SC** mark inspired by the energetic dual-color layering often seen in short-video apps. It is **not** an exact TikTok logo copy.

## V2.1.6 — Smart Workflow Edition
- On mobile/tablet, selected Comment Editor is placed at the top of the lower scrollable pane; desktop keeps it first in the inspector. Blue border highlights the editor. Transform and Appearance & avatar are collapsed by default.
- `identity-library.js` embeds all 50 supplied fictional labels and 50 cropped avatar images. `avatars/` contains individual JPEG files (192×192); artwork is taken from the two supplied grids, normalized to square and clipped to a circle by the renderer. No AI API or network request is required to generate identities.
- Shuffle is a single button for mock questions: changes name and avatar, with independent Lock name / Lock avatar options. Explicit names in batch input are retained; names/avatars are selected without reuse where available, but repeats are possible once the pool is exhausted or identities are explicitly repeated. Changing label length can change automatic card height. Actual comment identities are not randomized. Mock questions remain marked as such on the exported artwork.
- Existing upload/remove avatar, procedural styles and font controls are under Appearance & avatar. Source remains selectable for authorized real comments. To change a mock card to real, first enter the real username and remove the built-in avatar or replace with an authorized image.
- Deploy the entire extracted folder, including identity-library.js, index.html, app.js and sw.js. Service-worker cache namespace is updated to v216; network-first loading with offline fallback. If old PWA persists, reopen online or refresh; existing Home Screen icon does not need changing.
- Standalone HTML embeds code, standard logo, identity library and icon; use the ZIP for hosted PWA functionality. Existing personal template settings are not reset.
