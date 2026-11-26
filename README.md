# SC Comment Studio V2.1.1 — Mobile Workspace Optimization
**by SCWork · Dark Theme · Static web application**

## V2.1.1 — Mobile / Tablet Fixed Workspace
- Main Menu, Canvas Toolbar, Canvas และ Status Bar คงอยู่ด้านบนของพื้นที่ทำงาน; เลื่อนเฉพาะแผง Create / Layout / Layers / Properties ด้านล่าง
- ลากตัวจับสีเทาตรงเส้นแบ่งขึ้นหรือลงเพื่อปรับขนาด Canvas (ตั้งต้น 55% ของพื้นที่หลัง Header, ปรับ 30–75% ตามพื้นที่จริง); ดับเบิลคลิกเพื่อคืน 55%; ใช้ Arrow Up/Down, Home/End ได้เมื่อ focus ตัวจับ
- ระบบบันทึกสัดส่วนล่าสุดผ่าน localStorage ของเบราว์เซอร์ ถ้า storage ใช้งานไม่ได้ยังปรับได้ใน session ปัจจุบัน
- Fit คำนวณจากพื้นที่ Canvas ที่มีอยู่จริงหลังหัก padding; Zoom / Drag / Resize / Rotate ยังคงทำงานแบบเดิม
- ปรับตาม visualViewport เมื่อมีการเปิดคีย์บอร์ดหรือเปลี่ยนแนวหน้าจอ; แผงเครื่องมือพยายามเลื่อนไปหาช่องที่กำลังแก้ไข
- Responsive layout ใช้เมื่อ viewport กว้างไม่เกิน 1050 CSS px หรืออุปกรณ์ pointer:coarse กว้างไม่เกิน 1366 CSS px (รวม tablet แนวนอน); จอ Desktop ขนาดใหญ่ยังใช้ 3 columns เดิม
- อัปเดตเว็บไซต์: แทน index.html และ app.js ด้วยไฟล์ V2.1.1 โดยเก็บ factory-template.js ที่ตั้งค่าโลโก้จริงของคุณไว้หากเคยปรับไว้แล้ว แล้ว Deploy ใหม่; ไม่ต้องเปลี่ยน project/template JSON หรือ storage keys เดิม
- เปิดใช้ V2.1.1 โดยไม่ต้องติดตั้ง dependencies; หากใช้ standalone HTML จะรวม factory-template.js ตัวอย่างและ app.js ไว้ในไฟล์เดียว
- การทดสอบใช้ Chromium จำลองขนาด viewport และ storage; ยังไม่ได้ทดสอบ Safari/iPad จริงหรือ deploy บนเว็บ production

## V2.1 — ตั้งค่า Template ประจำเว็บ (เริ่มต้นที่นี่)
1. เปิดเว็บ แล้วกำหนด Canvas, Background, เพิ่ม Logo และรูปประกอบตามต้องการ จัดตำแหน่งโลโก้ 9 จุดตามเดิม
2. กด **Template** ที่แถบ Create ตั้งชื่อรายการ เลือก Layout, Comment type, Card theme, Avatar style, Font size/weight และ Export format/resolution หรือกด Use selected comment style เพื่อคัดลอกสไตล์จากการ์ดที่เลือก
3. เปิด Lock brand elements เพื่อป้องกันการเลื่อน/ย่อ/หมุนโลโก้และรูปประกอบโดยไม่ได้ตั้งใจ (ปลดล็อกใน Transform ได้) และเปิด Auto load default on startup จากนั้นกด **Save as default**
4. ครั้งต่อไปที่เปิดเว็บใน browser/profile/origin เดิม ระบบจะโหลด Personal Default โดยไม่มีคำถามเก่าติดมา
5. ใช้ Batch Paste → Generate all: ข้อความใหม่จะใช้ค่าเริ่มต้นและ Layout ที่บันทึกไว้ พร้อม Avatar ของแต่ละ identity และป้ายคำถามจำลองตามค่าเดิม
6. กด **New content** บน header เพื่อล้างเฉพาะคำถามและข้อมูลใน Batch Paste โดยรักษา Canvas, background, ภาพประกอบ, โลโก้, style, layout, export settings; Undo ย้อนกลับได้สำหรับงานบน Canvas (ข้อความใน Batch Paste ไม่รวมใน Undo)

### Template Library และการย้ายเครื่อง
- Save to library: บันทึกเทมเพลตจาก Canvas ปัจจุบัน ไม่เปลี่ยน Default ที่เลือกอยู่; Apply ใช้เทมเพลตที่เลือกกับ Canvas ปัจจุบัน (รักษาข้อความเดิม แต่แทนที่ภาพ/โลโก้และจัด Layout ใหม่); Set default ตั้งค่าเปิดเว็บครั้งถัดไป
- Export template ส่งออก JSON จาก Canvas และค่าบนฟอร์มปัจจุบัน โดยฝังภาพ/โลโก้/พื้นหลัง ไม่เก็บข้อความ ชื่อผู้ถาม หรือ Avatar ของคำถาม; Import template นำเข้า Library แล้วเลือก Apply หรือ Set default. มี `example_template.json` สำหรับทดลอง ใช้โลโก้ตัวอย่าง ไม่ใช่โลโก้รายการจริง
- Reset factory คืนค่าเทมเพลตที่ฝังในเว็บและยกเลิก Personal Default แต่ไม่ลบ Library; คงคำถามปัจจุบันไว้และแทนที่องค์ประกอบแบรนด์
- V2.1 ใช้ IndexedDB เป็นหลักและ localStorage เมื่อ IndexedDB ไม่พร้อม; storage ขึ้นกับ browser/profile/origin และอาจถูกล้าง ควร Export template สำรอง ไม่ Sync อัตโนมัติข้ามเครื่อง. Brand Preset รุ่น V2.0 ยังอยู่ในเมนูเดิม

### ฝังค่าเริ่มต้นประจำเว็บไซต์จริง (Factory Default)
สำหรับให้ทุกเครื่องเปิดเว็บแล้วเจอโลโก้และ Layout เดียวกันโดยไม่ต้องตั้งค่าใหม่: ตั้ง Canvas และ Template ให้ครบ จากนั้นกด **Export factory JS** ในหน้าต่าง Template แล้วนำ `factory-template.js` ที่ดาวน์โหลดไปแทนไฟล์ชื่อเดียวกันใน Fully Package จากนั้น Deploy ใหม่บน Vercel หรือ static hosting อื่น หากต้องการให้เครื่องเดิมเห็น Factory Default ใหม่ให้กด Reset factory (Personal Default ที่บันทึกไว้จะมีลำดับเหนือ Factory)
- Source package มีไฟล์ `factory-template.js` แยกต่างหาก ค่าเริ่มต้นยังไม่มีโลโก้จริงเพราะยังไม่มีไฟล์โลโก้ที่ผู้ใช้อนุมัติสำหรับเวอร์ชันนี้
- Standalone HTML ฝัง factory เริ่มต้นไว้แล้ว; การเปลี่ยน Factory สำหรับเว็บไซต์ให้ใช้ Fully Package
- ข้อมูล Project ใช้ schema version 2 เดิมเพื่อรองรับการเปิดงาน V2.0; มี field เพิ่มใน V2.1. Save project ยังเป็นการเก็บ artwork ทั้งหมดแยกจาก Template

## Quick start
1. แตกไฟล์ ZIP แล้วเปิด `index.html` ใน Chrome หรือ Edge บนคอมพิวเตอร์ (ให้ `app.js` และ `factory-template.js` อยู่โฟลเดอร์เดียวกัน) หรือใช้ไฟล์ Standalone HTML ที่แนบแยกได้โดยตรง
2. หากเปิดผ่านระบบไฟล์ไม่ได้ ให้เปิดด้วย local web server: `python -m http.server 8000` แล้วเข้า `http://localhost:8000`
3. Deploy ไป Vercel: อัปโหลดโฟลเดอร์นี้ไป GitHub แล้ว Import Project เลือก Framework Preset: Other, ไม่ต้อง Build Command, ไม่ต้อง Install Command, Output Directory: `.` (static site). ใช้ HTTPS เพื่อให้ Clipboard API ทำงานเมื่อเบราว์เซอร์อนุญาต
4. ไม่ต้องใช้ API key, npm, database หรือ login. ไม่มีการส่งข้อความไป TikTok และไม่มีการเรียกบริการสร้างรูปภายนอก

## Workflow
### 1 — Create
- Single: เลือกคอมเมนต์แล้วกด Single เพื่อเห็นการ์ดเดี่ยวแบบเต็มขนาด 640 px logical width. Export ที่ 4× ได้กว้าง 2560 px
- Compose: สร้างปกหลายคอมเมนต์บน Canvas
- + Comment: สร้างการ์ดใหม่; ใน Compose ระบบจัด Stack ใหม่ให้โดยอัตโนมัติ (Undo ย้อนกลับได้)
- Batch Paste: วาง 1 ข้อความต่อบรรทัด, ตรวจ Import Preview, กด Generate all. หากต้องการแทนคำถามเดิมให้เลือก Replace existing comments
- รูปแบบที่รองรับ: Plain lines, `ชื่อ: ข้อความ`, `@username ข้อความ`, CSV, TSV (copy จาก Excel), JSON array. รองรับ CSV ที่มี quoted commas, escaped quotes และข้อความหลายบรรทัด. XLSX ไม่ได้อ่านโดยตรง ให้ copy หรือ export CSV/TSV
- ข้อมูล JSON: `[{"username":"Q01","comment":"คำถามตัวอย่าง"}]` หรือ array ของ string. สูงสุด 60 รายการต่อการนำเข้าหนึ่งครั้ง; ข้อความต่อรายการ 1000 ตัวอักษร และชื่อ 80 ตัวอักษร
- ข้อความที่ไม่ได้ระบุชื่อจะใช้ Q01, Q02 ฯลฯ. โดยค่าเริ่มต้นจะมีข้อความ “คำถามจำลอง” อยู่บนการ์ดที่ export จริง ไม่ใช่แค่ใน UI. กรณีใช้คอมเมนต์จริงให้เลือก Source ที่ตรงกับข้อเท็จจริงและระบุชื่อที่ได้รับอนุญาตเท่านั้น

### 2 — Avatar & Comment
- แก้ Username, Comment, Type (Reply/Normal), Theme (Light/Dark), ขนาดและน้ำหนักข้อความได้
- Avatar แบบ Auto/Mixed, Abstract, Initial, Illustration, Default; ระบบใช้ seed แตกต่างสำหรับตัวตนใหม่ โดยตัวตนเดิมใน project เดียวกันจะใช้ seed และภาพเดิม. รูปแบบ Default ตั้งใจใช้ silhouette เหมือนกัน; การสร้างรูปเชิงขั้นตอนอาจมีรูปคล้ายกันได้ ไม่ใช่การรับประกันความไม่ซ้ำระดับ pixel
- Shuffle เปลี่ยน avatar ของ identity ที่เลือก; Shuffle all เปลี่ยนแต่ละ identity พร้อมกัน. Upload/Remove ใช้ภาพที่คุณมีสิทธิ์ใช้
- ไม่สร้างภาพบุคคลสมจริงเพื่อสวมรอยหรือหลบการตรวจจับของแพลตฟอร์ม; ไม่ต้องใช้ Generative AI

### 3 — Composition
- เลือก Canvas 9:16 (1080×1920), 4:5 (1080×1350), 1:1 (1080×1080), 16:9 (1920×1080) หรือ Custom 100–4096 px ต่อด้าน
- Layout: Stack, Horizontal, Grid, Stagger, Overlap, Free (จัดตำแหน่งเริ่มต้นแบบอิสระ). Spacing กำหนดระยะก่อนกด layout. ระบบเว้นตำแหน่งโลโก้ Canvas ที่ anchor ด้านบน/ล่างเมื่อกดจัด Layout ใหม่ (ถ้าพื้นที่พอ)
- คลิก layer หรือบน Canvas เพื่อเลือก; ลากย้าย, ลากมุมเพื่อ resize แบบรักษาสัดส่วน, ลากวงกลมด้านบนเพื่อหมุน. ใช้ X/Y/W/H/Rotation ใน Properties สำหรับควบคุมละเอียด. Alt+ลากมุมสำหรับยืดภาพ (image only), Shift ระหว่างหมุนเพื่อ snap ทีละ 15 องศา
- Front/Back ย้ายหนึ่งลำดับ, Duplicate, Delete, Lock, Visible. Attached logos ตาม comment โดยไม่ต้องลากแยก
- Snap ช่วยย้ายทีละ 20 px; Fit, Zoom ± และ pinch บนอุปกรณ์ touch (ยังไม่ได้ทดสอบ pinch บนมือถือจริง)
- Undo/Redo สูงสุด 24 ขั้น; Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z, Ctrl+Y. Arrow keys ย้าย 1 px (Shift+arrow = 10 px) และ Delete ลบ layer ที่เลือก
- Safe zone เป็นไกด์โดยประมาณ ไม่ใช่พิกัดรับรองของ TikTok; ปรับตาม UI/อุปกรณ์และตรวจ preview ในแอปจริง. ไกด์และ selection ไม่ติดไปในภาพ export

### 4 — Background / Insert Image
- Background: Transparent, Solid color, Image. ภาพเลือก Fill/Crop หรือ Fit, opacity และ blur (Canvas filter ขึ้นกับ browser)
- + Image: เพิ่มรูปประกอบแยกเป็น layer, resize, rotate, opacity, lock และ order ได้
- รูป PNG, JPEG, WebP, SVG, GIF ที่ browser อ่านได้; สูงสุด 15 MB ต่อไฟล์. GIF ใช้เป็นภาพนิ่ง ไม่ส่งออก animation
- ควรใช้ไฟล์ภาพไม่ใหญ่เกินจำเป็น โดยเฉพาะบนมือถือ; SVG ควร self-contained ไม่มี external dependencies

### 5 — Title Logo & Brand Preset
- + Logo เลือก PNG โปร่งใส หรือ SVG ที่ self-contained เพื่อผลลัพธ์ดีที่สุด (รองรับ JPEG/WebP/GIF ด้วย)
- Placement Mode: Canvas Logo, Every Comment, Selected Comment (เลือก target ใน dropdown). โลโก้ที่ attach กับ comment จะตามตำแหน่งและ scale ของการ์ด และติดไปกับ Individual PNG
- เลือก 9 ตำแหน่ง Top/Middle/Bottom × Left/Center/Right. Size และ Margin เป็น % ของความกว้าง target. Canvas Logo ลากได้เองเมื่อปลดล็อก. Rotation, Opacity, Visibility และ Lock อยู่ที่ Transform
- กด Stack/Grid ฯลฯ อีกครั้งหลังใส่โลโก้ด้านบนหรือล่าง หากต้องการให้คำถามเว้นพื้นที่หัว/ท้าย
- Save Preset ใน Project & Brand Presets: เก็บ Canvas size, background, logo, spacing ใน localStorage ของ browser. Load Preset จะนำค่าดังกล่าวมาใช้กับโปรเจกต์ปัจจุบัน; ตำแหน่งรูป/คอมเมนต์ปรับตามขนาด canvas ใหม่. Preset ไม่บันทึกคอมเมนต์
- หาก browser ปฏิเสธ localStorage หรือ quota เต็ม ให้ใช้ Save Project แทน. Preset ไม่ sync ข้ามเครื่อง

### 6 — Export & Project
- Composition PNG: รวมทุก layer ที่แสดงและ background ตามค่า project
- Transparent PNG: ไม่ใส่ background (image/logo layer ที่แยกยังอยู่)
- JPG: รวมพื้นหลังและ layer; ส่วนโปร่งใสจะเป็นสีขาว
- Selected Comment PNG: ขนาด 640 logical px × 1/2/4, ไม่รวม background และ Canvas Logo; รวม logo ที่ attach กับการ์ดนั้น
- All Comment ZIP: ส่งออกการ์ดแต่ละใบเป็น PNG (รวม attached logo) แยกไฟล์และรวม ZIP; ZIP แบบ STORE ไม่บีบอัดซ้ำ
- Canvas Export 1×/2×, individual export 1×/2×/4×; จำกัด 32 megapixels และด้านยาว canvas ไม่เกิน 8192 px เพื่อความเสถียร (เครื่องมือถืออาจมีข้อจำกัดต่ำกว่า)
- Copy PNG ต้องใช้ browser ที่รองรับ ClipboardItem และ context ที่อนุญาต. หากไม่รองรับใช้ Download แทน
- Save Project: ดาวน์โหลด JSON ที่เก็บ artwork, layer, text, avatar seed, logo และรูปภาพแบบฝังในไฟล์ (data URL). Open Project: เปิด JSON V2.0 ที่ถูกต้องกลับมาแก้ไข. ไม่มี autosave/cloud sync. เก็บไฟล์ JSON เป็น backup
- ขนาดไฟล์ Project ที่เปิดได้สูงสุด 100 MB; แนะนำให้ optimize ภาพก่อนใช้. โปรเจกต์ V1.0 เป็นระบบ single card เดิม ไม่มี format project ที่ต้อง migrate

## Developer structure
- `index.html`: responsive dark UI, controls, dialogs, Canvas element และ CSS
- `app.js`: state, Thai wrapping from V1.0, Canvas rendering, procedural avatars, parser, transforms, layout, assets, export, project persistence and ZIP writer
- `example_project.json`: ตัวอย่าง 5 คำถามจำลองพร้อมโลโก้สมมุติและพื้นหลัง ให้เปิดใน Open Project
- `factory-template.js`: Factory Default สำหรับการ Deploy
- `example_template.json`: ตัวอย่าง Brand Template ที่นำเข้าได้
- `README.md`: คู่มือและข้อจำกัด
- `TEST_REPORT.md`: ผลทดสอบจริงและส่วนที่ยังต้องทดสอบ

## Important limitations
- Thai rendering ใช้ font ของระบบและ Intl.Segmenter เมื่อรองรับ; ตัวอักษรและ emoji อาจต่างตาม OS/browser ไม่ได้ embed font
- OCR screenshot, direct XLSX import, AI API, cloud sync, SVG export, dynamic video export ยังไม่ได้รวมใน V2.1 นี้
- Safe zone เป็นประมาณการ; ไม่มีการรับประกันการตรวจจับหรือการอนุมัติจาก TikTok
- โปรแกรมนี้ไม่ได้เชื่อมต่อ TikTok หรือสร้าง Engagement จริง; คำถามจำลองควรมีป้ายกำกับชัดเจน
