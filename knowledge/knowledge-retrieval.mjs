// Phase 04 prerequisite: conservative retrieval, no related-domain fact expansion.
export function createRetrieval(records,recognizer){
 const byId=new Map(records.map(r=>[r.id,r]));
 const valid=r=>r?.review_status==="approved"&&r.eligible_for_generation===true&&typeof r.knowledge==="string"&&r.knowledge.trim()&&typeof r.constraints==="string"&&r.constraints.trim()&&typeof r.source?.file==="string"&&r.source.file.trim()&&Array.isArray(r.source.sections)&&r.source.sections.length>0;
 function retrieve(question){
  const analysis=recognizer.analyze(question);
  const candidates=analysis.status==="matched"?analysis.topics.map(t=>{
   const r=byId.get(t.id);
   return {id:t.id,topic:t.topic,module:t.module,score:t.score,matched_aliases:t.matched_aliases,source:t.source,eligible:!!valid(r)};
  }):[];
  // A related module is not evidence. Do not silently expand to unrelated facts.
  // If the primary candidate is not approved, abstain from factual composition entirely.
  const primary=candidates[0];
  const eligible=primary?.eligible?candidates.filter(c=>c.eligible).slice(0,2).map(c=>{const r=byId.get(c.id);return {...c,knowledge:r.knowledge.trim(),constraints:r.constraints.trim()}}):[];
  return {analysis,candidates,eligible,related_modules:analysis.related_modules||[],status:analysis.status!=="matched"?analysis.status:eligible.length?"approved_available":"pending_review"};
 }
 return {retrieve};
}
