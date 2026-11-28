// Phase 06: local feedback and opt-in style retrieval.
export function createFeedbackStore({storage,recognizer,key="scwork.caption.feedback.v1",now=()=>new Date().toISOString()}){
 const MAX=1000, MAX_BYTES=2_000_000;
 const tones=["friendly","professional","hook"],lengths=["short","medium","long"],statuses=["approved","corrected","rejected","pending"];
 const clone=x=>JSON.parse(JSON.stringify(x));
 const str=(v,max,required=false)=>{if(typeof v!=="string"||v.length>max||required&&!v.trim())throw Error("Invalid feedback text");return v.trim()};
 const opts=o=>{const v=o||{};if(!tones.includes(v.tone)||!lengths.includes(v.length)||![0,1,2].includes(v.variant))throw Error("Invalid style settings");return {tone:v.tone,length:v.length,variant:v.variant}};
 const normalize=q=>recognizer.normalize(q);
 const signature=r=>JSON.stringify([normalize(r.question),r.body,r.tags]);
 function sanitize(v){
  if(!v||typeof v!=="object"||Array.isArray(v)||!statuses.includes(v.status))throw Error("Invalid feedback record");
  const id=str(v.id,80,true);if(!/^F[1-9]\d{0,11}$/.test(id))throw Error("Invalid feedback ID");
  return {id,question:str(v.question,2000,true),body:str(v.body,12000,true),tags:str(v.tags,3000),status:v.status,settings:opts(v.settings),note:str(v.note??"",2000),original_body:str(v.original_body??"",12000),original_tags:str(v.original_tags??"",3000),created_at:str(v.created_at,50,true),updated_at:str(v.updated_at,50,true)};
 }
 function decode(raw){
  if(typeof raw!=="string"||raw.length>MAX_BYTES)throw Error("Feedback file exceeds limit");
  const data=JSON.parse(raw);if(data?.schema_version!==1||!Array.isArray(data.records)||data.records.length>MAX||!Number.isSafeInteger(data.next_id)||data.next_id<1||data.next_id>999999999999)throw Error("Invalid feedback schema");
  const records=data.records.map(sanitize);
  if(new Set(records.map(r=>r.id)).size!==records.length||new Set(records.map(signature)).size!==records.length||records.some(r=>Number(r.id.slice(1))>=data.next_id))throw Error("Duplicate or invalid feedback ID");
  return {schema_version:1,next_id:data.next_id,records};
 }
 function load(){const raw=storage.getItem(key);return raw==null?{schema_version:1,next_id:1,records:[]}:decode(raw)}
 function save(data){const raw=JSON.stringify(data);decode(raw);storage.setItem(key,raw)}
 function record(input,decision){
  if(!["approved","corrected","rejected"].includes(decision))throw Error("Invalid decision");
  const data=load(),stamp=now();
  const candidate=sanitize({id:"F"+data.next_id,question:input.question,body:input.body,tags:input.tags??"",settings:input.settings,status:decision,note:input.note??"",original_body:input.original_body??"",original_tags:input.original_tags??"",created_at:stamp,updated_at:stamp});
  if(decision==="corrected"&&(!candidate.original_body||(candidate.body===candidate.original_body&&candidate.tags===candidate.original_tags)))throw Error("Correction requires changed output and original");
  const prior=data.records.find(r=>signature(r)===signature(candidate));
  if(prior){candidate.id=prior.id;candidate.created_at=prior.created_at;data.records=data.records.map(r=>r.id===prior.id?candidate:r)}
  else {if(data.records.length>=MAX)throw Error("Feedback storage full");data.next_id++;data.records.push(candidate)}
  // A corrected original is explicitly rejected, not just stored alongside its correction.
  if(decision==="corrected"){
   const rejected={...candidate,id:"F"+data.next_id,body:candidate.original_body,tags:candidate.original_tags,status:"rejected",original_body:"",original_tags:"",note:"Superseded by "+candidate.id,created_at:stamp};
   const existing=data.records.find(r=>signature(r)===signature(rejected));
   if(existing){rejected.id=existing.id;rejected.created_at=existing.created_at;data.records=data.records.map(r=>r.id===existing.id?rejected:r)}
   else {if(data.records.length>=MAX)throw Error("Feedback storage full");data.next_id++;data.records.push(rejected)}
  }
  save(data);return clone(candidate);
 }
 function review(id,decision){
  if(!["approved","rejected"].includes(decision))throw Error("Invalid review decision");
  const data=load(),r=data.records.find(x=>x.id===id);if(!r)throw Error("Unknown feedback ID");
  r.status=decision;r.updated_at=now();save(data);return clone(r);
 }
 function remove(id){const d=load();const before=d.records.length;d.records=d.records.filter(r=>r.id!==id);if(before===d.records.length)return false;save(d);return true}
 function list(){return clone(load().records)}
 function exportData(){return JSON.stringify(load(),null,2)}
 function importData(raw){
  const incoming=decode(raw),data=load();let added=0,skipped=0;
  const existing=new Set(data.records.map(signature));
  for(const r of incoming.records){
   const sig=signature(r);if(existing.has(sig)){skipped++;continue}
   if(data.records.length>=MAX)throw Error("Feedback storage full");
   data.records.push({...r,id:"F"+data.next_id++,status:r.status==="rejected"?"rejected":"pending",updated_at:now()});existing.add(sig);added++;
  }
  save(data);return {added,skipped,requires_review:true}
 }
 function features(q){
  const a=recognizer.analyze(q);
  const ids=(a.topics||[]).map(t=>t.id);
  const context=(a.context||[]).flatMap(c=>c.mentions.map(m=>c.type+":"+ (typeof m==="string"?m:JSON.stringify(m)))).sort();
  const chars=Array.from(normalize(q).replace(/[\p{P}\p{Z}\s]/gu,""));
  const grams=new Set(chars.slice(1).map((c,i)=>chars[i]+c));
  return {status:a.status,intent:a.intent.primary,ids,context,grams,normalized:normalize(q)};
 }
 function jaccard(a,b){const A=new Set(a),B=new Set(b),u=new Set([...A,...B]);return u.size?[...A].filter(x=>B.has(x)).length/u.size:1}
 function search(question,limit=3){
  const q=features(str(question,2000,true));if(q.status!=="matched"||q.intent==="unknown"||!q.ids.length)return [];
  const rejected=new Set(load().records.filter(r=>r.status==="rejected").map(signature));
  return load().records.filter(r=>["approved","corrected"].includes(r.status)&&!rejected.has(signature(r))).map(r=>{
   const p=features(r.question);
   if(p.status!=="matched"||q.intent!==p.intent||q.ids[0]!==p.ids[0]||jaccard(q.context,p.context)!==1)return null;
   const sim=jaccard(q.grams,p.grams),topics=jaccard(q.ids,p.ids),exact=q.normalized===p.normalized;
   if(!exact&&(sim<0.25||topics<0.5))return null;
   const score=exact?1:0.65+0.25*sim+0.1*topics;
   return {id:r.id,question:r.question,body:r.body,tags:r.tags,settings:r.settings,score:Number(score.toFixed(3)),exact,review_only:true};
  }).filter(Boolean).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id)).slice(0,Math.max(0,Math.min(10,Math.trunc(Number(limit)||0))));
 }
 return {record,review,remove,list,exportData,importData,search};
}
export function createLearningCaption(engine,feedback){
 function generate(questions,options={}){
  const qs=[...new Set((Array.isArray(questions)?questions:[questions]).map(q=>String(q??"").trim()).filter(q=>q&&q!=="พิมพ์คำถามของคุณ"))];
  let examples=[],feedback_error=null;
  try{examples=qs.map(question=>({question,matches:feedback.search(question)}))}catch{feedback_error="feedback_unavailable"}
  const best=qs.length===1?examples[0]?.matches[0]:null;
  const applied={};
  // Only structured style choices may influence generation. Never insert example prose, tags, or claims.
  if(options.learnStyle===true&&best&&best.score>=0.8){
   for(const k of ["tone","length","variant"])if(options[k]===undefined)applied[k]=best.settings[k];
  }
  const result=engine.generate(questions,{...applied,...options});
  return {...result,feedback:{examples,applied_style:applied,style_example_id:Object.keys(applied).length?best.id:null,error:feedback_error,content_reuse:false}};
 }
 return {generate,normalizeTags:engine.normalizeTags};
}
