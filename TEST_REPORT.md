# V2.1.5 — Master icon verification
- Supplied SVG copied byte-for-byte. All raster icon variants rendered from it.
- Verified manifest icon references, PNG dimensions and ICO entries at 16, 32 and 48 px.
- Chromium standalone smoke test with simulated storage: 390×844 header icon loaded, factory template loaded, light/dark toggle passed, no page errors.
- JavaScript syntax checks passed for app.js and sw.js. Editor app.js and standard content logo unchanged byte-for-byte from V2.1.4.
- Direct local HTTP navigation was blocked by the test environment; live service worker, browser cache refresh and actual iPhone Home Screen behavior remain untested. No deployment performed.
