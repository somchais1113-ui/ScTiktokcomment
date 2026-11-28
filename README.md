# V2.3.0 — Multi-Platform Content Studio

- TikTok controller and Narrative runtime remain byte-for-byte unchanged. New isolated Facebook, Instagram and X panels share reviewed Knowledge Library, not TikTok presets or feedback.
- Brand-colored selector and social action buttons; default TikTok on open. Separate in-session drafts, local presets and local feedback per platform. Exact-question approved style may affect tone/length only, not facts.
- Facebook educational narrative; Instagram visual-first; X one topic with complete passages that fit conservative weighted 280-character estimate. Copy blocked for over-limit X. All posts carry #scwork #กราฟฟิค; FB/IG cap 5, X cap 3 as studio policy.
- 15 TikTok baseline lengths, 45 social engine tests and 14 additional checks passed. Physical Safari/browser integration remains pending; X count is deliberately conservative, not official twitter-text.
- PWA cache v2300.

# V2.2.6 — Phone Default Workspace

- Phone workspace defaults to a 30% preview / approximately 70% tools split (excluding splitter thickness), matching the supplied iPhone reference. The existing draggable separator and Fit behaviour remain intact.
- A new phone-only preference key applies the new default once for existing phone users; later adjustments are remembered. Double-click restores the device default. Tablet and desktop layout and tablet preferences are unchanged.
- Factory template, export dimensions, Narrative engine and hashtag rules are unchanged. PWA cache v2260.
- Syntax and isolated workspace preference tests passed; real Safari/browser visual verification pending.

# V2.2.5 — Narrative Regression Protection

- Restore Narrative Long as initial default and migrate legacy local preset once, preserving CTA, tags, tone and template. Explicit saved v5 selections remain available.
- Expand colloquial DPI aliases and matching scope in source and bundled runtime. Retain 15 reviewed packs and conservative scope guard (HEX and generic Pantone remain unreviewed).
- Show active Narrative version/depth and version caption assets/PWA cache. V2.2.4 hashtag and iPhone editor changes retained.
- Runtime validation: 18 grounded questions (15 packs + 3 conversational cases), 4 scope guards, 2 preset migration cases; JS syntax checked. Physical Safari and production browser not tested.

# V2.2.4 — TikTok Hashtag Guard & iPhone Stability

- All publish-ready caption output is limited to five unique hashtags, always beginning with #scwork #กราฟฟิค. Topic-specific tags retain priority; existing presets and manual edits are normalized at preview/copy. Inline tags are consolidated in the publish preview. Copy caption and Copy all include mandatory tags.
- Mobile preview uses at most 1600 px on the longest edge (export resolution unchanged), avoids unnecessary canvas reallocation, bounds inactive decoded image cache, and releases temporary export canvases. Image loading and encoding have timeout errors rather than indefinite waits. Mobile viewport updates are coalesced and no longer force scroll resets; iPhone caption controls fit narrow safe-area layouts.
- PWA cache v2240. Physical iPhone/Safari regression testing remains required before release.

# V2.1.24 — Below Logo Touch Fix

- Native button click and non-interactive SVG for Position buttons.
- Below Logo requires an unlocked comment in Compose and a visible canvas logo; maintains scale, rotation and gap. If there is insufficient room, it reports the issue instead of overlapping.
- Service worker cache updated to v2124.

# V2.1.21 — Transform / Layout controls

- Transform is always expanded when an object is selected. Layout is a collapsible section, closed by default. All four position buttons and existing rendering logic are unchanged.
- Service worker cache updated to v2121.

# V2.1.20 — Three Position Controls

Transform now displays only Top Center, Center, Bottom Center in one row. Existing position logic (top 2%, bottom 18%, subject to object size), logo placement, and all other functionality are unchanged.

# V2.1.18 — Distinct Position Presets

Horizontal inset 1%, top inset 2%, bottom inset 18% of canvas height when space permits. Adaptive caps preserve separation for large fitting objects; oversized objects are centered on that axis. Object dimensions and rotation are preserved. Existing saved projects are not repositioned automatically. All other features inherited.

# V2.1.17 — Compact position controls

Transform Position: nine original anchors in two rows (5 + 4), same order and position logic. All other features inherited from V2.1.16.

# V2.1.16 — Transform before Layout

Transform is now immediately after Create, before Layout and Layers. All other functions and assets remain unchanged from V2.1.15.

# V2.1.15 — Transform before Layers

Transform is now directly after Layout, before Layers, on all device sizes. All controls and rendering logic are unchanged.

# V2.1.14 — Transform panel order

Transform is now directly after Layers in the left/tools panel on desktop, tablet and mobile. It remains collapsed by default and appears for a selected object. All placement logic and other settings are unchanged.

# V2.1.13 — Bottom Safe Position

Bottom-left, bottom-center and bottom-right now reserve 18% of canvas height (previously 5%), matching the existing bottom Safe Zone guide. For 1080 × 1920, a fitting object moves up 249.6 px. Large objects use the available-space cap. All other anchors and horizontal placement remain unchanged. No existing saved positions are migrated.

# V2.1.12 — Position Presets

- Transform: replace X/Y/Width/Height fields with nine one-tap position icons in Compose. Outer positions use a 5% inset (or less for large objects). Moves only the selected unlocked object, preserving its size and angle. Resize and free movement remain available via the bounding box. Attached logos continue to use their own placement controls. In Single mode, the card-only export has no composition position.
- PWA cache version updated.

# V2.1.11 — Thai Reply Heading

Reply comments use ตอบกลับความคิดเห็นของ followed by the username on a separate bold line. Simulated questions retain ตอบกลับความเห็นของ; replacement names/images retain a visible disclosure. Shared canvas rendering applies to composition and individual exports. All other settings and assets are inherited from V2.1.8.

# V2.1.8 — Unified Source Shuffle

- Shuffle is enabled for both mock questions and authorized real comments.
- For real comments, Shuffle replaces the display name and/or avatar with fictional library assets, without changing the source or comment text. The rendered heading explicitly states ชื่อแทน, ภาพแทน, or , including exported images. Do not use substitute identities as authentic attribution.
- Lock name and Lock avatar work independently for both sources. Both locks disable Shuffle. Card height is calculated from the heading and text; position and width remain unchanged.
- Source switching still clears the prior identity. Enter authorized attribution or leave the name blank for anonymity; use Shuffle for illustrative replacements. Undo can restore the previous identity.
- Deploy the full package. The service worker cache is v218. Standalone HTML is for local use; hosted ZIP is for PWA.

The notes below describe older versions; current behaviour above supersedes their identity restrictions.

# V2.1.7 — Source Switch Fix

- เลือก Source ได้ทั้งสองแบบโดยไม่ต้องล้างชื่อ/รูปด้วยตนเองก่อน
- เปลี่ยนเป็นคอมเมนต์จริง: ล้างชื่อและรูปจำลอง, ใช้ภาพแทนตัวแบบกลาง, กรอกชื่อจริงหรือเว้นว่างเพื่อไม่ระบุชื่อ
- เปลี่ยนเป็นตอบกลับความเห็นของ: เลือกชื่อและรูปจากคลังใหม่ พร้อมป้ายตอบกลับความเห็นของ
- รักษาข้อความ ตำแหน่ง ความกว้าง และสไตล์การ์ด (ความสูงอาจเปลี่ยนตามข้อความหัวการ์ด) และ Undo ได้
- อัปเดต Service Worker เป็น v217

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


- ปรับตำแหน่งเริ่มต้นของคอมเมนต์ให้เยื้องซ้ายเล็กน้อย เพื่อลดการบังพื้นที่ด้านขวา


- เพิ่มปุ่ม Position แบบพิเศษ “วางใต้โลโก้” เป็นปุ่มแรก สีส้ม และจะใช้งานได้เมื่อมี Canvas logo อยู่บนหน้าเท่านั้น


## V2.1.22 — Group Shuffle & Collapsible Layers
- Layers ใช้เมนูพับ–เปิด และพับเป็นค่าเริ่มต้น
- Shuffle G. สุ่มชื่อ/ภาพทุกคำถามที่ไม่ล็อกในโปรเจกต์ โดยไม่เปลี่ยนข้อความ พิกัด ความกว้าง หรือองศา ความสูงปรับตามข้อความหัวการ์ด
- Lock name / Lock avatar / Lock object มีผลต่อการสุ่ม; Undo ย้อนทั้งกลุ่มในครั้งเดียว
- คำถามที่สุ่มเป็นกลุ่มแสดงหัวคำถามตัวอย่าง หรือปกปิดตัวตนสำหรับความคิดเห็นจริง เพื่อให้แยกแหล่งที่มาได้ในภาพส่งออก
- ปุ่ม Shuffle เดิมยังอยู่; Layout และ Transform ไม่เปลี่ยน

## V2.1.24 — Library update
- 150 labels (50 existing + 100 new; groups 35/35/30).
- 100 avatars (50 existing illustrations + 50 supplied photo illustrations). Photo pool is available for disclosed sample questions only; real-source Shuffle uses original illustrated avatars.
- Sample questions and substituted identities are visibly identified in the rendered card and exports. No age-based matching is used.
- Other editor controls unchanged.
