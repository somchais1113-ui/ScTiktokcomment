// Phase 03 experimental context recognition; no runtime integration.
export function createRecognizer(records, supplements={}){
 const normalize=v=>String(v??"").normalize("NFKC").replace(/\u0e4d\u0e32/g,"\u0e33").toLowerCase().replace(/[\u200b-\u200f\u202a-\u202e\u2060\ufeff]/g,"").replace(/[\u2010-\u2015_]/g,"-").replace(/สติ๊กเกอร์|สติกเก้อ/g,"สติกเกอร์").replace(/แพ็คเกจ|แพคเกจ|แพ็กเก็จ/g,"แพ็กเกจ").replace(/กราฟฟิก/g,"กราฟิก").replace(/[\s\u00a0]+/g," ").trim();
 const generic=new Set(["กาว","ฟิล์ม","กระดาษ","โลโก้","องค์ประกอบ","บรรทัด","หมึกพิมพ์","เพลท","จัดวาง","ต้นทุน","หลายสูตร","workflow","automation","layout","รีไซเคิล","พรีเมียม","ci","pe","pp","pet","pop","pod","lab","rip","sensor","vector"]);
 const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
 function has(q,a){if(!a)return false;const l=/^[a-z0-9]/.test(a)?"(?:^|[^a-z0-9])":"",r=/[a-z0-9]$/.test(a)?"(?=$|[^a-z0-9])":"";return new RegExp(l+esc(a).replace(/ /g,"[\\s-]*")+r,"u").test(q)}
 const indexed=records.map(r=>({r,aliases:[...new Set([...r.aliases,...(supplements[r.id]||[])].map(normalize))].filter(Boolean)}));
 const df=new Map();for(const i of indexed)for(const a of i.aliases)df.set(a,(df.get(a)||0)+1);
 function intent(q){
  const cues=[];
  function add(id,pattern,score){const m=q.match(pattern);if(m)cues.push({id,score,evidence:m[0]})}
  add("comparison",/ต่างกัน|แตกต่าง|เปรียบเทียบ|เทียบกับ|แต่ละสูตร.{0,16}ไม่เหมือนกัน|vs\.?|versus|เหมือนกันไหม|ไม่เหมือนกัน|อะไรต่าง/iu,8);
  add("recommendation",/เลือก.{0,22}(?:ดี|อะไร|ไหนดี)|แบบไหน(?:ดี|เหมาะ|คุ้ม)|แนะนำ|ควรใช้|ใช้อะไรดี|ใช้แบบไหนดี/iu,8);
  add("cost_analysis",/คุ้ม|แพง|ราคา|ลดต้นทุน|ประหยัด|งบ|ต้นทุน|ค่าใช้จ่าย/iu,6);
  add("quality_control",/ตรวจ(?:สอบ|รับ|คุณภาพ|วัด)|เช็ค(?:ไฟล์|สี|คุณภาพ)|เช็ก(?:ไฟล์|สี|คุณภาพ)|เกณฑ์|สุ่มตรวจ|aql/iu,7);
  add("risk_analysis",/ข้อเสีย|ความเสี่ยง|อันตราย|ปลอดภัย|ผิดกฎหมาย|ลิขสิทธิ์|มีผลเสีย/iu,8);
  add("feasibility",/ทำได้(?:ไหม|มั้ย|หรือไม่)|ผลิต(?:จริง)?ได้(?:ไหม|มั้ย|หรือไม่)|พิมพ์ได้(?:ไหม|มั้ย|หรือไม่)|ใช้ได้เลย(?:ไหม|มั้ย)|ได้จริง(?:ไหม|มั้ย)/iu,8);
  add("myth_busting",/จริง(?:ไหม|มั้ย|หรือไม่)|ใช่(?:ไหม|มั้ย|หรือเปล่า)|เสมอไป|ถือว่า.{0,20}(?:เลยไหม|ไหม)|เท่ากัน.{0,20}ไหม/iu,7);
  add("material_selection",/วัสดุ.{0,20}(?:ไหนดี|อะไรดี)|กระดาษ.{0,20}(?:ไหนดี|อะไรดี)|เลือก(?:วัสดุ|กาว|กระดาษ|ฟิล์ม)|ใช้กาวอะไร/iu,10);
  add("best_practice",/มาตรฐานที่ดี|วิธีที่ดีที่สุด|แนวทางที่ดี|best practice|ควรทำอย่างไร/iu,8);
  add("definition",/คืออะไร|หมายถึงอะไร|แปลว่าอะไร|คือยังไง|คืออะไรครับ|what is/iu,10);
  add("how_to",/ทำยังไง|ทำอย่างไร|ทำไง|จัด.{0,20}ยังไง|แก้ยังไง|วิธี(?:ทำ|แก้|ผสม|ตั้ง|ใช้)|ตั้งค่า|ผสม.{0,15}(?:ยังไง|อย่างไร)|how to/iu,9);
  const why=/ทำไม|เพราะอะไร|เกิดจากอะไร|สาเหตุ|why/iu;
  const symptom=/สระลอย|พิมพ์เป็นเส้น|ไม่ตรง|เพี้ยน|ไม่สนิท|หลุด|ลอก|แตก|เบลอ|ไม่ชัด|ไม่ติด|หาย|ย่น|ตัน|เป็นรอย|เด้ง|ไม่ได้|ไม่เหมือน|ไม่เกาะ|เป็นฟอง|ยุบ|อ่านไม่ออก|สแกนไม่|ช้า/iu;
  if(why.test(q))add("why",why,5);
  if(symptom.test(q)&&!/(?:คืออะไร|ต่างกัน|เปรียบเทียบ|แต่ละสูตร.{0,16}ไม่เหมือนกัน|vs\.?)/iu.test(q))add("troubleshooting",symptom,why.test(q)?11:9);
  if(/เลือก|แบบไหน|ไหนดี/u.test(q)&&/คุ้ม|ราคา|ต้นทุน|งบ/u.test(q)) {const v=cues.find(c=>c.id==="cost_analysis");if(v)v.score=11}
  cues.sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
  return {primary:cues[0]?.id||"unknown",evidence:cues[0]?.evidence||null,alternatives:cues.slice(1,3).map(c=>c.id)};
 }
 const contextRules=[
 ["material",["กระดาษ","ฟิล์ม","พลาสติก","ขวด","แก้ว","กล่อง","ฉลาก","สติกเกอร์","pp","pet","pvc","pe","คราฟท์","คราฟต์","ลูกฟูก"]],
 ["process",["offset","ออฟเซ็ต","ออฟเซต","digital","ดิจิทัล","ดิจิตอล","inkjet","อิงค์เจ็ท","gravure","flexo","ไดคัท","สกรีน","เคลือบด้าน","เคลือบเงา","ฟอยล์","spot uv","พิมพ์"]],
 ["environment",["แช่แข็ง","ห้องเย็น","กลางแจ้ง","ความร้อน","ความชื้น","โดนน้ำ","แสงห้าง","แดด","อาหาร"]],
 ["business",["ต้นทุน","งบ","ราคา","จำนวนผลิต","ขั้นต่ำ","moq","sku","ส่งงาน","ส่งของ","ล็อต","โรงพิมพ์"]],
 ["symptom",["สีเพี้ยน","สีไม่ตรง","ไม่ตรง","หลุด","ลอก","แตก","เบลอ","ไม่ชัด","ไม่ติด","ย่น","ตัน","เด้ง","หาย","ไม่เกาะ","ยุบ","เป็นรอย"]]
 ];
 function analyze(input){
  const q=normalize(input), intents=intent(q);
  if(!q)return {normalized:q,status:"empty",intent:intents,topics:[],context:[],observed_modules:[],related_modules:[],generation_ready:false};
  const ranked=[];
  for(const {r,aliases} of indexed){
    let matches=aliases.filter(a=>has(q,a)).sort((a,b)=>b.length-a.length||a.localeCompare(b));
    // Prevent nested aliases from double counting (e.g. "กาว" inside "กาวหลุด").
    matches=matches.filter((a,i)=>!matches.slice(0,i).some(b=>b.includes(a)));
    if(!matches.length)continue;
    const scores=matches.map(a=>{const len=[...a].length;return (generic.has(a)?1.1:len>=12?5:len>=6?4:3)/Math.sqrt(df.get(a)||1)});
    const strength=scores.reduce((a,b)=>a+b,0);
    const score= strength+(r.intents.includes(intents.primary)?0.6:0);
    ranked.push({id:r.id,module:r.module,topic:r.topic,score:Number(score.toFixed(3)),strength:Number(strength.toFixed(3)),matched_aliases:matches,related_modules:r.related_modules,source:r.source,review_status:r.review_status,eligible_for_generation:r.eligible_for_generation===true&&r.review_status==="approved"});
  }
  ranked.sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
  const best=ranked[0],status=!best?"unknown":best.strength<2.2?"uncertain":"matched";
  const topics=status==="matched"?ranked.filter(r=>r.strength>=2.2&&r.score>=Math.max(2.2,best.score*.42)).slice(0,5):[];
  const context=contextRules.map(([type,terms])=>({type,mentions:[...new Set(terms.map(normalize).filter(t=>has(q,t)))]})).filter(x=>x.mentions.length);
  const qty=[...q.matchAll(/(\d[\d,]*(?:\.\d+)?)\s*(ชิ้น|ดวง|ใบ|กล่อง|สูตร|sku|เล่ม|บาท|วัน|dpi|ppi|แกรม|gsm|mm|มม\.?)/giu)].map(m=>({value:m[1],unit:m[2]}));
  if(qty.length)context.push({type:"quantities",mentions:qty});
  const observed_modules=[...new Set(topics.map(t=>t.module))];
  const related_modules=[...new Set(topics.flatMap(t=>t.related_modules))].filter(m=>!observed_modules.includes(m));
  return {normalized:q,status,intent:intents,topics,context,observed_modules,related_modules,generation_ready:false,review_candidates:status==="uncertain"?ranked.slice(0,3).map(x=>({id:x.id,score:x.score,matched_aliases:x.matched_aliases})):[]};
 }
 function analyzeMany(questions){return questions.map(analyze)}
 return {analyze,analyzeMany,normalize}
}
