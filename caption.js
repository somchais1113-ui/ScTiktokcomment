'use strict';
(function controller(doc,storage,clipboard,getCurrent,getComments,engine){
 const $=id=>doc.getElementById(id), dialog=$('captionDialog'), topic=$('captionTopic'), body=$('captionBody'), tags=$('captionTags'), preview=$('captionPreview'), scope=$('captionScope'), mode=$('captionMode'), length=$('captionLength'), tone=$('captionTone'), cta=$('captionCTA'), fixed=$('captionFixedTags'), template=$('captionTemplate'), category=$('captionCategory'), message=$('captionStatus');
 const key='sccomment.caption.smart.v2', oldKey='sccomment.caption.default.v1';
 const defaults={cta:'มีคำถามเกี่ยวกับงานออกแบบและงานพิมพ์ คอมเมนต์ถามกันได้ครับ',tags:'#SCWork #ถามมาตอบไป #งานออกแบบ #งานพิมพ์ #PrintingSolutions',template:'{{question}}\n\nSCWork Q&A ถามมาตอบไป — เรื่องงานออกแบบและงานพิมพ์ เข้าใจง่าย นำไปใช้ได้จริง',length:'medium',tone:'friendly',mode:'smart'};
 let dirty=false,variant=0,initialized=false,sourceKey='',drafts=new Map();
 function notify(t){message.textContent=t}
 function readSource(){const all=getComments(),c=getCurrent();return (scope.value==='all'?all:[c?.kind==='comment'?c:all[0]]).filter(Boolean).map(o=>String(o.comment||'').trim()).filter(t=>t&&t!=='พิมพ์คำถามของคุณ').join('\n')}
 function load(){let p={...defaults};try{const v=JSON.parse(storage.getItem(key)||'null'),old=JSON.parse(storage.getItem(oldKey)||'null');if(v&&typeof v==='object'){for(const k of Object.keys(defaults))if(typeof v[k]==='string')p[k]=v[k]}else if(old){if(typeof old.body==='string')p.template=old.body;if(typeof old.tags==='string')p.tags=old.tags}}catch{}return p}
 function populate(p){cta.value=p.cta;fixed.value=p.tags;template.value=p.template;length.value=['short','medium','long'].includes(p.length)?p.length:'medium';tone.value=['friendly','professional','hook'].includes(p.tone)?p.tone:'friendly';mode.value=['smart','preset'].includes(p.mode)?p.mode:'smart'}
 function refresh(){const a=body.value.trim(),b=engine.normalizeTags(tags.value);preview.value=[a,b].filter(Boolean).join('\n\n');$('captionCopyText').disabled=!a;$('captionCopyTags').disabled=!b;$('captionCopyAll').disabled=!preview.value;$('captionRegenerate').disabled=!topic.value.trim()}
 function gen(next=false){if(next)variant=(variant+1)%3;const qs=topic.value.split('\n').map(x=>x.trim()).filter(Boolean);const g=engine.generate(qs,{length:length.value,tone:tone.value,variant,cta:cta.value,tags:fixed.value});if(mode.value==='preset'){body.value=template.value.replace(/\{\{question\}\}/g,()=>topic.value.trim()).trim();tags.value=engine.normalizeTags(fixed.value);category.textContent='Preset เดิม'}else{body.value=g.body;tags.value=g.tags;category.textContent=g.category}dirty=false;refresh();notify(qs.length?'สร้าง Caption แล้ว · ตรวจข้อความก่อนโพสต์':'เลือกหรือพิมพ์คำถามก่อน')}
 function stash(){if(!initialized||!dirty)return;if(drafts.size>=30&&!drafts.has(sourceKey))drafts.delete(drafts.keys().next().value);drafts.set(sourceKey,{topic:topic.value,body:body.value,tags:tags.value,category:category.textContent})}
 function useSource(){stash();const q=readSource();sourceKey=scope.value+'\u0000'+q;variant=0;const d=drafts.get(sourceKey);if(d){topic.value=d.topic;body.value=d.body;tags.value=d.tags;category.textContent=d.category;dirty=true;refresh();notify('คืน Caption ที่แก้ไขไว้')}else{topic.value=q;gen()}}
 $('captionOpen').addEventListener('click',()=>{if(!initialized){populate(load());initialized=true;useSource()}else{const k=scope.value+'\u0000'+readSource();if(k!==sourceKey)useSource();else if(!dirty)gen()}dialog.showModal()});
 $('captionClose').addEventListener('click',()=>{stash();dialog.close()});dialog.addEventListener('close',stash);
 $('captionUseQuestion').addEventListener('click',()=>{stash();topic.value=readSource();sourceKey=scope.value+'\u0000'+topic.value;if(dirty){refresh();notify('ดึงคำถามแล้ว · กด Regenerate เพื่อสร้างใหม่')}else gen()});
 scope.addEventListener('change',useSource);
 function settingsChanged(){if(dirty){refresh();notify('เก็บ Caption ที่แก้เองไว้ · กด Regenerate เมื่อต้องการสร้างใหม่')}else gen()}
 [mode,length,tone].forEach(x=>x.addEventListener('change',settingsChanged));[topic,cta,fixed,template].forEach(x=>x.addEventListener('input',settingsChanged));
 [body,tags].forEach(x=>x.addEventListener('input',()=>{dirty=true;refresh();notify('แก้ไขด้วยตนเองแล้ว')}));
 $('captionRegenerate').addEventListener('click',()=>{drafts.delete(sourceKey);gen(true)});
 $('captionSave').addEventListener('click',()=>{try{storage.setItem(key,JSON.stringify({cta:cta.value,tags:fixed.value,template:template.value,length:length.value,tone:tone.value,mode:mode.value}));notify('บันทึก Preset แล้ว · ใช้ในเบราว์เซอร์นี้')}catch{notify('บันทึกไม่ได้: พื้นที่จัดเก็บไม่พร้อม')}});
 $('captionReset').addEventListener('click',()=>{populate(defaults);settingsChanged();notify('คืนค่า Preset แล้ว · กด Save preset เพื่อบันทึก')});
 async function copy(value){if(!value)return;try{if(!clipboard?.writeText)throw Error('clipboard');await clipboard.writeText(value);notify('คัดลอกแล้ว')}catch{const t=doc.createElement('textarea');t.value=value;t.style.cssText='position:fixed;left:0;top:0;opacity:0;font-size:16px';dialog.append(t);t.select();t.setSelectionRange(0,t.value.length);let ok=false;try{ok=doc.execCommand('copy')}catch{}t.remove();if(ok)notify('คัดลอกแล้ว');else{preview.focus();preview.select();notify('คัดลอกอัตโนมัติไม่ได้ · คัดลอกจาก Preview')}}}
 $('captionCopyAll').addEventListener('click',()=>copy(preview.value));$('captionCopyText').addEventListener('click',()=>copy(body.value.trim()));$('captionCopyTags').addEventListener('click',()=>copy(engine.normalizeTags(tags.value)));
})(document, {getItem:k=>localStorage.getItem(k),setItem:(k,v)=>localStorage.setItem(k,v)}, navigator.clipboard, ()=>current(), ()=>comments(), (function smartEngine(){
 const rules=[
 ["Pantone C / U",/pantone.*(?:\bc\b.*\bu\b|\bu\b.*\bc\b)|(?:\bc\b.*\bu\b|\bu\b.*\bc\b).*pantone/iu,"รหัสสีเดียวกันบนกระดาษเคลือบผิวและไม่เคลือบผิวอาจให้สีที่มองเห็นต่างกัน","ควรเทียบกับตัวอย่างสีและกระดาษจริงก่อนผลิต","#Pantone #SpotColor #ระบบสี"],
 ["Color System",/\brgb\b|\bcmyk\b|\bhex\b|ระบบสี|โหมดสี|ผสมสี/iu,"ระบบสีแต่ละแบบมีหน้าที่และขอบเขตการแสดงสีต่างกัน","เลือกโหมดสีและโปรไฟล์ให้เหมาะกับสื่อปลายทาง","#RGB #CMYK #ระบบสี"],
 ["Color Matching",/สีบนจอ|สีไม่ตรง|สีเพี้ยน|สีต่าง|สีคลาด|color match|สี.*งานพิมพ์/iu,"สีบนจอกับสีงานพิมพ์ขึ้นอยู่กับโปรไฟล์สี อุปกรณ์ หมึกและวัสดุ","ตรวจปรู๊ฟภายใต้สภาพแสงที่เหมาะสมก่อนอนุมัติผลิต","#ColorManagement #สีงานพิมพ์ #ปรู๊ฟสี"],
 ["Spot Color",/pantone|\bpms\b|spot colou?r|สีพิเศษ/iu,"สีพิเศษช่วยกำหนดเป้าหมายสีสำหรับงานผลิต แต่ผลจริงยังขึ้นกับวัสดุและหมึก","ตรวจตัวอย่างสีและเงื่อนไขการผลิตจริงก่อนเลือกใช้","#Pantone #SpotColor #สีพิเศษ"],
 ["Resolution",/\bdpi\b|\bppi\b|pixel|พิกเซล|ภาพแตก|รูปแตก|ความละเอียด|ภาพเบลอ/iu,"ความคมชัดไม่ได้ขึ้นอยู่กับตัวเลข DPI เพียงอย่างเดียว แต่ต้องดูจำนวนพิกเซลและขนาดใช้งานจริง","ตรวจความละเอียดที่ขนาดผลิตก่อนส่งไฟล์","#DPI #Resolution #เตรียมไฟล์"],
 ["Printing Technology",/offset|ออฟเซ็ต|digital print|ดิจิทัล|inkjet|อิงค์เจ็ท|ระบบพิมพ์|สกรีน|gravure|เฟล็กโซ/iu,"การเลือกระบบพิมพ์ควรดูจำนวนผลิต วัสดุ คุณภาพ เวลา และต้นทุนร่วมกัน","เปรียบเทียบจากสเปกงานจริง ไม่ใช่ราคาอย่างเดียว","#PrintingTechnology #งานพิมพ์ #โรงพิมพ์"],
 ["AI & Production",/\bai\b.*(?:สร้าง|ภาพ|ผลิต|ออกแบบ)|(?:สร้าง|ภาพ|ผลิต|ออกแบบ).*\bai\b|ปัญญาประดิษฐ์/iu,"ภาพจาก AI ยังต้องตรวจรายละเอียดและความพร้อมของไฟล์ก่อนนำไปผลิต","เช็กความละเอียด ระบบสี และข้อจำกัดของวัสดุจริง","#AIDesign #GraphicDesign #Production"],
 ["Prepress",/bleed|ตัดตก|die.?cut|ไดคัท|ไดคัต|เส้นตัด|safe area|ระยะเผื่อ|overprint|ลงทะเบียนสี/iu,"ระยะเผื่อและโครงสร้างไฟล์มีผลโดยตรงต่อความเรียบร้อยของงานหลังตัด","ยืนยันสเปกและเส้นตัดกับผู้ผลิตก่อนส่งงาน","#Prepress #DieCut #เตรียมไฟล์งานพิมพ์"],
 ["File Format",/\bpdf\b|\bsvg\b|\bjpg\b|\bjpeg\b|\bpng\b|\beps\b|vector|เวกเตอร์|ไฟล์.*\bai\b|outline|ฟอนต์/iu,"ไฟล์แต่ละชนิดเหมาะกับงานต่างกัน ทั้งการแก้ไขและการส่งผลิต","ตรวจฟอนต์ ภาพฝัง และข้อกำหนดไฟล์ของผู้ผลิต","#Artwork #FileFormat #GraphicDesign"],
 ["Material & Label",/\bpp\b|\bpvc\b|\bpet\b|สติ๊กเกอร์|สติกเกอร์|ฉลาก|กาว|ไวนิล|วัสดุ|กระดาษ/iu,"การเลือกวัสดุต้องสอดคล้องกับพื้นผิว สภาพแวดล้อม และการใช้งานจริง","ทดลองติดหรือทดสอบวัสดุก่อนสั่งผลิตจำนวนมาก","#Material #Sticker #Label"],
 ["Finishing",/ฟอยล์|foil|spot uv|เคลือบ|ปั๊มนูน|ลามิเนต|laminat|emboss/iu,"เทคนิคตกแต่งช่วยเพิ่มมิติให้ชิ้นงาน แต่ต้องเลือกให้เหมาะกับวัสดุและงานออกแบบ","เช็กพื้นที่ตกแต่งและตัวอย่างจริงกับผู้ผลิต","#PrintFinishing #Production #งานพิมพ์"],
 ["Packaging",/packag|แพ็คเกจ|แพ็กเกจ|บรรจุภัณฑ์|กล่อง/iu,"แพ็กเกจที่ดีต้องตอบโจทย์ทั้งภาพลักษณ์ การใช้งาน การปกป้องสินค้า และการผลิต","ทดสอบโครงสร้าง ขนาด และวัสดุจริงก่อนผลิต","#PackagingDesign #Packaging #ProductDesign"],
 ["Brand Identity",/logo|โลโก้|branding|แบรนด์|\bci\b|identity|อัตลักษณ์/iu,"อัตลักษณ์แบรนด์ควรสื่อสารชัดเจนและใช้งานได้สม่ำเสมอในหลายสื่อ","ทดสอบการใช้งานทั้งขนาดเล็ก สีเดียว และสื่อผลิตจริง","#Branding #LogoDesign #VisualIdentity"],
 ["Cost & Production",/ต้นทุน|ราคา|จำนวนผลิต|ขั้นต่ำ|คุ้ม|ลดต้นทุน|งบประมาณ/iu,"ต้นทุนงานผลิตไม่ได้มีแค่ราคาต่อชิ้น แต่รวมค่าเตรียมงาน วัสดุและเงื่อนไขการผลิตด้วย","เปรียบเทียบใบเสนอราคาบนสเปกและจำนวนเดียวกัน","#Production #ต้นทุน #งานพิมพ์"],
 ["Design",/design|ออกแบบ|กราฟิก|กราฟฟิก|layout|เลย์เอาต์|typography/iu,"งานออกแบบควรตอบโจทย์การสื่อสารและข้อจำกัดของการใช้งานจริงควบคู่กัน","ทดสอบงานในบริบทปลายทางก่อนสรุปแบบ","#GraphicDesign #Design #Creative"]
 ];
 const normalizeTags=(v)=>{const seen=new Set();return String(v||'').trim().split(/[\s,]+/u).filter(Boolean).map(t=>'#'+t.replace(/^#+/u,'')).filter(t=>{const k=t.toLowerCase();if(t.length<2||seen.has(k))return false;seen.add(k);return true}).join(' ')};
 const detect=q=>rules.find(r=>r[1].test(q));
 function generate(qs,{length='medium',tone='friendly',variant=0,cta='',tags=''}={}){
   qs=[...new Set(qs.map(q=>String(q).trim()).filter(Boolean))];if(!qs.length)return {body:'',tags:normalizeTags(tags),category:'ยังไม่มีหัวข้อ'};
   const matched=qs.map(detect),unique=[...new Set(matched.filter(Boolean))],q=qs[0],multi=qs.length>1;
   const hooks=tone==='professional'?[q,`ประเด็นน่ารู้: ${q}`,`ทำความเข้าใจประเด็นนี้: ${q}`]:tone==='hook'?[`เคยสงสัยไหม? ${q}`,q,`ก่อนทำงานจริง มาดูเรื่องนี้กัน: ${q}`]:[q,`มาคุยกันเรื่องนี้ครับ: ${q}`,`สงสัยเหมือนกันไหม? ${q}`];
   const hook=multi?`รวม ${qs.length} คำถามในคลิปนี้`:hooks[variant%hooks.length];
   const parts=[hook];
   if(multi)parts.push(qs.map(x=>'• '+x).join('\n'));
   if(length!=='short'){
     if(unique.length)parts.push(unique.map(r=>r[2]+(length==='long'?' '+r[3]:'')).join('\n'));
     if(matched.some(r=>!r))parts.push('มาทำความเข้าใจประเด็นที่ถาม พร้อมพิจารณาตัวอย่างและการใช้งานจริงกันครับ');
   }
   if(cta.trim())parts.push(cta.trim());
   return {body:parts.join('\n\n'),tags:normalizeTags(unique.map(r=>r[4]).join(' ')+' '+tags),category:unique.map(r=>r[0]).join(' · ')+(matched.some(r=>!r)?(unique.length?' · ':'')+'ทั่วไป':'' )};
 }
 return {generate,normalizeTags};
})());
