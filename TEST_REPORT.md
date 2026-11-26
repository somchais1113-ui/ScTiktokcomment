# V2.1.2 — Test Report

Environment: Chromium via Playwright, Linux; simulated mobile/touch viewport, synthetic localStorage and disabled IndexedDB; Web Share API simulated by stub. No actual iOS device or production deployment.

| Test | Result |
|---|---|
| JS syntax check | Pass |
| Factory logo, actual PNG loaded, Top Center, transparent artwork | Pass |
| Light on startup, toggle Dark/Light, simulated persistence, card theme unchanged | Pass |
| Mobile 390×844 and tablet 768×1024 pinned Canvas during panel scroll | Pass |
| Desktop 1440×900 | Pass (appearance/layout interaction smoke test) |
| Background popup open/close, color and transparent change | Pass |
| Standard logo selection, reposition 9-anchor control (tested top right and top center), no duplicate | Pass |
| Layout icons: grid and stack clicked, 6 controls present | Pass |
| Share prepared PNG file through simulated navigator.share | Pass (not native iOS Photos) |
| Share unsupported fallback: preview and Download | Pass |
| Download PNG 1080×1920, alpha at canvas corner, logo pixels present | Pass |
| PNG color background retained | Pass |
| Batch paste 5 Thai questions, distinct avatar seeds, ZIP 5 files | Pass |
| New Content preserves standard logo; save template using simulated storage | Pass |
| Browser JS page errors in tested scenarios | None observed |

Limitations: Native iOS Share Sheet / Save Image, actual Photos storage, clipboard and persisted IndexedDB not verified. Native Web Share requires supported browser, HTTPS and user gesture. Recheck Safari after deployment. Layout icons use accessible labels; only stack/grid were exercised in this version's interaction test. Previous code retained for other modes.
