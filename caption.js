'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const key = 'sccomment.caption.default.v1';
  const defaults = {body:'{{question}}\n\nSCWork Q&A ถามมาตอบไป — เรื่องงานออกแบบและงานพิมพ์ เข้าใจง่าย นำไปใช้ได้จริง',tags:'#SCWork #ถามมาตอบไป #งานออกแบบ #งานพิมพ์ #PrintingSolutions'};
  const dialog = $('captionDialog');
  const body = $('captionBody'), tags = $('captionTags'), topic = $('captionTopic'), preview = $('captionPreview'), message = $('captionStatus');
  let preset = {...defaults};
  function load() { try { const p = JSON.parse(localStorage.getItem(key)||'null'); if(p && typeof p.body==='string' && typeof p.tags==='string') preset={body:p.body,tags:p.tags}; } catch {} }
  function selectedQuestion() { const c = current()?.kind==='comment' ? current() : comments()[0]; return c && c.comment!=='พิมพ์คำถามของคุณ' ? String(c.comment||'') : ''; }
  function hashtagText() { return [...new Set(tags.value.trim().split(/[\s,]+/u).filter(Boolean).map(t=>'#'+t.replace(/^#+/u,'' )).filter(t=>t.length>1))].join(' '); }
  function captionText() { return body.value.replace(/\{\{question\}\}/g,()=>topic.value.trim()).trim(); }
  function refresh() { preview.value=[captionText(),hashtagText()].filter(Boolean).join('\n\n'); $('captionCopyAll').disabled=!preview.value; $('captionCopyText').disabled=!captionText(); $('captionCopyTags').disabled=!hashtagText(); }
  function notify(t) { message.textContent=t; }
  function populate() { body.value=preset.body; tags.value=preset.tags; refresh(); }
  $('captionOpen').addEventListener('click',()=>{ load(); topic.value=selectedQuestion(); populate(); notify(''); dialog.showModal(); });
  $('captionClose').addEventListener('click',()=>dialog.close());
  $('captionUseQuestion').addEventListener('click',()=>{ topic.value=selectedQuestion(); refresh(); });
  [body,tags,topic].forEach(el=>el.addEventListener('input',refresh));
  $('captionSave').addEventListener('click',()=>{ try { const p={body:body.value,tags:tags.value}; localStorage.setItem(key,JSON.stringify(p)); preset=p; notify('บันทึก Preset แล้ว · ใช้ได้ในเบราว์เซอร์นี้'); } catch { notify('บันทึกไม่ได้: เบราว์เซอร์จำกัดพื้นที่จัดเก็บ'); } });
  $('captionReset').addEventListener('click',()=>{ preset={...defaults}; populate(); notify('คืนค่าตัวอย่างแล้ว · กด Save preset เพื่อบันทึก'); });
  async function copy(value) { if(!value)return; try { if(!navigator.clipboard?.writeText)throw Error('clipboard'); await navigator.clipboard.writeText(value); notify('คัดลอกแล้ว'); } catch { const t=document.createElement('textarea'); t.value=value; t.style.cssText='position:fixed;left:0;top:0;opacity:0;font-size:16px'; dialog.append(t); t.select(); t.setSelectionRange(0,t.value.length); let ok=false; try{ok=document.execCommand('copy')}catch{} t.remove(); if(ok)notify('คัดลอกแล้ว'); else { preview.focus(); preview.select(); notify('คัดลอกอัตโนมัติไม่ได้ · กรุณาคัดลอกจาก Preview'); } } }
  $('captionCopyAll').addEventListener('click',()=>copy(preview.value));
  $('captionCopyText').addEventListener('click',()=>copy(captionText()));
  $('captionCopyTags').addEventListener('click',()=>copy(hashtagText()));
})();
