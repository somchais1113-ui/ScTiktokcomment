# SC Comment Studio V2.1.3 — Test Report

## Scope tested
- Favicon links in `index.html`
- Apple touch icon link
- Web app manifest generation and file paths
- Service worker registration script presence
- Asset packaging completeness
- Basic icon rendering output files

## Verified
- `favicon.ico` present
- PNG favicon variants present
- `apple-touch-icon.png` present
- `manifest.webmanifest` present and valid JSON
- `sw.js` present
- `index.html` includes PWA and iOS meta tags
- standalone HTML copy exported
- ZIP package created

## Manual verification still recommended
- iPhone Safari: Share → Add to Home Screen
- iPhone standalone launch behavior
- Chrome install prompt behavior after deploy
- icon appearance on the real iOS Home Screen

## Known limitations
- iOS Safari cannot be forced to auto-add the site to Photos or Home Screen; user action is still required.
- The install prompt on desktop/mobile Chrome can vary by browser heuristics.
- Service worker is intentionally lightweight and caches core files only.
