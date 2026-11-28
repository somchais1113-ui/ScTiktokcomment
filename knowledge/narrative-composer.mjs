// Editorial narrative packs; used only with the approved revision of a matched record.
export function createNarrativeComposer(packs){
 return function compose(record,{question,normalized,intent,length,tone,variant}){
  const p=packs[record?.id];if(!p||!record.eligible||record.source?.narrative_revision!=="v1"||!new RegExp(p.scope,"iu").test(normalized))return null;
  // Explicit question focus: avoid answering C/U for generic Pantone questions or HEX alone.
  if(record.id==="KL-02-003"&&!/(?:\bc\b|\bu\b|coated|uncoated|เคลือบ|แพนโทนซี|แพนทอนซี)/iu.test(normalized))return null;
  if(record.id==="KL-02-001"&&/\bhex\b/iu.test(normalized))return null;
  const hook=tone==="hook"?p.hooks[variant%p.hooks.length]:variant%3===0?question:variant%3===1?(tone==="professional"?"ประเด็นจากงานจริง: ":"ลองนึกถึงเรื่องนี้ครับ: ")+question:(tone==="professional"?"ข้อสงสัยเรื่องงานผลิต: ":"มาคุยเรื่องนี้กันครับ: ")+question;
  const action=intent==="how_to"||intent==="quality_control";
  const parts=length==="short"?[hook,p.answer,p.takeaway]:length==="medium"?[hook,p.answer,action?p.practice:p.mechanism,p.takeaway]:[hook,p.answer,p.mechanism,p.example,p.practice,p.takeaway];
  return [...new Set(parts)];
 }
}
