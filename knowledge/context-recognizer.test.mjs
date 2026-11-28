import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRecognizer} from './context-recognizer.mjs';
const read = p=>JSON.parse(readFileSync(new URL(p,import.meta.url),'utf8'));
const e=createRecognizer(read('./records.v0.1.json'),read('./context-aliases.v0.1.json'));
const fixtures=read('./context-fixtures.v0.1.json');
let topic=0,top3=0,intent=0;const failures=[];
for(const [q,id,i] of fixtures){const a=e.analyze(q);const t=a.topics[0]?.id===id, k=a.topics.slice(0,3).some(x=>x.id===id), j=a.intent.primary===i;topic+=Number(t);top3+=Number(k);intent+=Number(j);if(!t||!j)failures.push({q,id,expected_intent:i,actual:a.topics[0]?.id||null,intent:a.intent.primary});assert.equal(a.generation_ready,false);assert.ok(a.topics.every(x=>!x.eligible_for_generation));}
assert.equal(e.analyze('').status,'empty');assert.equal(e.analyze('วันนี้ไปกินข้าวที่ไหนดี').status,'unknown');assert.equal(e.analyze('apple people shopping').status,'unknown');assert.equal(e.analyze('กาว').status,'uncertain');assert.ok(['04','06','07'].every(m=>e.analyze('ทำไมกล่องเคลือบด้านแล้วลิ้นกาวหลุด').observed_modules.includes(m)));assert.notEqual(e.analyze('CMYK คืออะไร').intent.primary,e.analyze('ทำไม CMYK สีเพี้ยน').intent.primary);assert.ok(e.analyze('พิมพ์ 3,600 ดวง 12 สูตร').context.some(x=>x.type==='quantities'&&x.mentions.length===2));assert.equal(e.analyzeMany(['CMYK คืออะไร','DPI คืออะไร']).length,2);
assert.ok(topic>=60&&top3>=60&&intent>=60,'Regression versus initial authored fixture baseline');
assert.equal(e.normalize('ทำไม'),'ทำไม');assert.equal(e.normalize('ทําไม'),'ทำไม');
console.log(JSON.stringify({count:fixtures.length,topic,top3,intent,failures},null,2));
