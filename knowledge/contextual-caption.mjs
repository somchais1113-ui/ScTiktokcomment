// Phase 05 experimental caption composer. No browser runtime integration.
export function createCaptionEngine(retrieval,narrative=null){
 const clean=v=>String(v??"").trim();
 const normalizeTags=v=>{const seen=new Set();return clean(v).split(/[\s,]+/u).map(t=>t.replace(/^#+/u,"")).filter(t=>/^[\p{L}\p{M}\p{N}_]+$/u.test(t)).filter(t=>{const k=t.normalize("NFC").toLowerCase();if(seen.has(k))return false;seen.add(k);return true}).map(t=>"#"+t).join(" ")};
 const domainTags={"01":"#GraphicDesign #งานออกแบบ","02":"#ColorManagement #ระบบสี","03":"#PrintingTechnology #งานพิมพ์","04":"#MaterialScience #วัสดุ","05":"#Prepress #เตรียมไฟล์งานพิมพ์","06":"#PackagingDesign #บรรจุภัณฑ์","07":"#PrintFinishing #เทคนิคงานพิมพ์","08":"#Branding #สร้างแบรนด์","09":"#ProductionManagement #การผลิต","10":"#DesignTechnology #Automation"};
 const topicTags={"KL-01-002":"#Typography #Kerning #Tracking","KL-04-001":"#GSM #กระดาษ","KL-05-002":"#Trapping #Registration","KL-05-004":"#PDFX #Prepress",
 "KL-02-001":"#RGB #CMYK","KL-02-002":"#RichBlack #CMYK","KL-02-003":"#Pantone #SpotColor","KL-02-004":"#ICCProfile","KL-02-005":"#DeltaE","KL-02-006":"#Metamerism","KL-03-001":"#OffsetPrinting #DigitalPrinting","KL-03-005":"#RollLabel","KL-04-004":"#Adhesive #SurfaceEnergy","KL-04-005":"#FreezerLabel","KL-05-001":"#Bleed","KL-05-003":"#Overprint","KL-05-006":"#DPI #PPI","KL-06-003":"#Dieline","KL-06-005":"#Barcode","KL-07-001":"#Lamination","KL-07-002":"#SpotUV","KL-07-003":"#FoilStamping","KL-07-004":"#Embossing","KL-08-005":"#CorporateIdentity","KL-09-001":"#QualityControl #AQL","KL-09-005":"#MOQ","KL-10-001":"#AIDesign","KL-10-002":"#AIUpscaling","KL-10-003":"#Vector","KL-10-005":"#DataMerge"};
 const focus={"KL-01-001":"การจัดตัวอักษรไทย","KL-02-001":"ระบบสีและขอบเขตสี","KL-02-002":"การผสมสีดำและปริมาณหมึก","KL-02-003":"Pantone และสีพิเศษ","KL-03-001":"Offset และ Digital","KL-04-004":"กาวและพื้นผิว","KL-05-006":"ความละเอียดที่ขนาดใช้งาน","KL-06-003":"โครงสร้างแบบคลี่","KL-07-001":"ฟิล์มเคลือบ","KL-09-005":"จำนวนผลิตขั้นต่ำ","KL-10-002":"การขยายภาพด้วย AI"};
 const framing={
 definition:["มาทำความรู้จัก{focus}กันครับ","ชวนทำความเข้าใจ{focus}ตั้งแต่พื้นฐาน"],
 comparison:["ชวนดูความแตกต่างในเรื่อง{focus}ก่อนตัดสินใจ","มาดูว่าเรื่อง{focus}มีประเด็นอะไรที่ควรเปรียบเทียบ"],
 troubleshooting:["ชวนไล่ดูสาเหตุที่เป็นไปได้ในเรื่อง{focus} โดยยังไม่ด่วนสรุปจากอาการเดียว","มาดูกันว่าควรตรวจอะไรบ้างเมื่อเจอปัญหาเกี่ยวกับ{focus}"],
 why:["มาดูเหตุผลเบื้องหลังเรื่อง{focus}กันครับ","ชวนทำความเข้าใจว่าทำไม{focus}จึงเป็นประเด็นที่ควรพิจารณา"],
 how_to:["ชวนดูขั้นตอนและสิ่งที่ควรตรวจในเรื่อง{focus}","มาทำความเข้าใจวิธีเตรียมงานที่เกี่ยวกับ{focus}"],
 recommendation:["มาดูปัจจัยที่ควรพิจารณาก่อนเลือกเกี่ยวกับ{focus}","ชวนเปรียบเทียบทางเลือกในเรื่อง{focus}ให้เหมาะกับโจทย์"],
 myth_busting:["ชวนแยกความเข้าใจเดิมออกจากข้อเท็จจริงในเรื่อง{focus}","มาดูกันว่าข้อสงสัยเรื่อง{focus}ต้องพิจารณาเงื่อนไขอะไรบ้าง"],
 cost_analysis:["ชวนพิจารณาต้นทุนและเงื่อนไขงานที่เกี่ยวกับ{focus}","มาดูว่าควรเปรียบเทียบอะไรบ้างก่อนตัดสินใจเรื่อง{focus}"],
 risk_analysis:["ชวนตรวจความเสี่ยงและข้อจำกัดในเรื่อง{focus}","มาดูข้อมูลที่ควรตรวจให้ครบก่อนตัดสินใจเรื่อง{focus}"],
 quality_control:["ชวนดูจุดตรวจสอบคุณภาพที่เกี่ยวกับ{focus}","มาดูกันว่าควรตรวจอะไรบ้างในเรื่อง{focus}"],
 feasibility:["ชวนตรวจเงื่อนไขก่อนนำเรื่อง{focus}ไปใช้งานจริง","มาดูข้อจำกัดที่ควรพิจารณาก่อนลงมือเรื่อง{focus}"],
 material_selection:["ชวนพิจารณาวัสดุและสภาพใช้งานในเรื่อง{focus}","มาดูปัจจัยที่ควรตรวจให้ครบก่อนเลือกเรื่อง{focus}"],
 best_practice:["ชวนดูแนวทางที่เหมาะกับโจทย์ในเรื่อง{focus}","มาพิจารณาวิธีทำงานเรื่อง{focus}ตามเงื่อนไขจริง"],
 unknown:["ชวนทำความเข้าใจประเด็น{focus}กันครับ","มาคุยกันเรื่อง{focus}"]
 };
 function generate(questions,options={}){
  const qs=[...new Set((Array.isArray(questions)?questions:[questions]).map(clean).filter(q=>q&&q!=="พิมพ์คำถามของคุณ"))];
  const length=["short","medium","long"].includes(options.length)?options.length:"medium";
  const tone=["friendly","professional","hook"].includes(options.tone)?options.tone:"friendly";
  const variant=Math.abs(Math.trunc(Number(options.variant)||0))%3;
  if(!qs.length)return {body:"",tags:"",combined:"",status:"empty",sources:[],analyses:[],requires_review:true};
  const results=qs.map(q=>({question:q,...retrieval.retrieve(q)}));
  const sections=[],tagParts=[],sources=[],effectiveStatuses=[];
  for(const item of results){
   const {question,analysis,candidates,eligible,status}=item;
   const hook=tone==="professional"?(variant===1?"ประเด็นที่ต้องพิจารณา: "+question:variant===2?"ประเด็นคำถาม: "+question:question):tone==="hook"?(variant===1?"เรื่องนี้ต้องดูให้ชัด: "+question:variant===2?question:"เคยสงสัยไหม? "+question):(variant===1?"มาคุยกันเรื่องนี้ครับ: "+question:variant===2?"คำถามนี้น่าสนใจครับ: "+question:question);
   const parts=[hook];
   let effectiveStatus=status;
   if(status==="approved_available"){
    // Keep the caveat even in short mode. Never add an unapproved secondary record.
    const composed=narrative?.(eligible[0],{question,normalized:analysis.normalized,intent:analysis.intent.primary,length,tone,variant});
    if(composed){parts.splice(0,parts.length,...composed);sources.push({question,id:eligible[0].id,source:eligible[0].source})}else if(narrative&&eligible[0]?.source?.narrative_revision==="v1"){effectiveStatus="scope_review";if(length!=="short")parts.push("ประเด็นนี้มีรายละเอียดเฉพาะที่ยังต้องตรวจสอบเพิ่มเติมก่อนสรุปคำตอบ")}else{
    const selected=eligible.slice(0,length==="long"?2:1);
    for(const r of selected){parts.push(r.knowledge+"\nข้อควรพิจารณา: "+r.constraints);sources.push({question,id:r.id,source:r.source})}}
   }else if(length!=="short"&&status==="pending_review"){
    const labels=[...new Set(candidates.slice(0,3).map(c=>focus[c.id]||c.topic))].join(" และ ");
    const phrases=framing[analysis.intent.primary]||framing.unknown;
    let line=phrases[variant%phrases.length].replace("{focus}",labels);
    if(tone==="professional")line=line.replace(/กันครับ$/u,"");
    parts.push(line);
    if(length==="long")parts.push("ประเด็นสำหรับคลิปนี้: ควรตรวจข้อมูลเฉพาะงานก่อนสรุปคำตอบ");
   }else if(length!=="short")parts.push("ชวนคุยจากคำถามนี้ โดยยังไม่สรุปคำตอบจนกว่าจะมีข้อมูลเพียงพอ");
   if(status==="pending_review"||status==="approved_available"){
    for(const c of candidates.slice(0,3)){tagParts.push(topicTags[c.id]||"",domainTags[c.module]||"")}
   }
   effectiveStatuses.push(effectiveStatus);sections.push(parts.join("\n\n"));
  }
  const body=[sections.join("\n\n"),clean(options.cta)].filter(Boolean).join("\n\n");
  const tags=normalizeTags([...tagParts,clean(options.tags)].join(" "));
  const status=effectiveStatuses.every(r=>r==="approved_available")?"grounded_draft":effectiveStatuses.some(r=>r==="approved_available")?"mixed_review":"teaser_only";
  return {body,tags,combined:[body,tags].filter(Boolean).join("\n\n"),status,sources,analyses:results.map((r,i)=>({question:r.question,status:effectiveStatuses[i],intent:r.analysis.intent,topics:r.candidates,context:r.analysis.context,related_modules:r.related_modules})),requires_review:true};
 }
 return {generate,normalizeTags}
}
