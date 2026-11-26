# V2.1.4 — Header icon test
- Chromium, inline standalone document via set_content (direct local HTTP/file navigation blocked by environment).
- Header icon loaded (192 px source), visible in light and dark themes at 1440×900, 390×844 and 768×1024. Rendered size unchanged (34 px desktop, 27 px mobile/tablet).
- No page errors during the header/theme smoke test.
- app.js unchanged byte-for-byte from V2.1.3; node syntax check passed for app.js and sw.js.
- Service worker cache name incremented; deployment and real iOS Home Screen update not tested.
- Full functionality regression not repeated for this header-only change.
