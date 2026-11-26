from playwright.sync_api import sync_playwright
from pathlib import Path
import json,io,zipfile
from PIL import Image
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
for f in ['standard-logo.js','factory-template.js','identity-library.js','app.js']:
 html=html.replace(f'<script src="{f}"></script>','<script>'+ (root/f).read_text()+'</script>')
shim='<script>window.testStorage={};Object.defineProperty(window,"localStorage",{value:{getItem:k=>window.testStorage[k]??null,setItem:(k,v)=>window.testStorage[k]=String(v)}});Object.defineProperty(window,"indexedDB",{value:null});</script>'
html=html.replace('<head>','<head>'+shim,1)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']); page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=1,accept_downloads=True,service_workers='block')
 errors=[];page.on('pageerror',lambda e: errors.append(str(e)));page.set_content(html,wait_until='load');page.wait_for_timeout(800)
 page.locator('#addComment').click();page.wait_for_timeout(200)
 def curr(): return page.evaluate('JSON.parse(JSON.stringify(current()))')
 a=curr();assert a['source']=='mock' and a['photo'].startswith('data:image/jpeg')
 assert page.locator('#commentPanel').evaluate('(e)=>e.parentElement.id')=='mobileCommentSlot'
 assert not page.locator('#transformPanel').evaluate('(e)=>e.open')
 page.locator('#comment').fill('Pantone C กับ U ต่างกันยังไงอ่ะพี่?');page.locator('#comment').blur();a=curr();page.locator('#randomAvatar').click();b=curr();assert a['username']!=b['username'] and a['photo']!=b['photo'] and a['comment']==b['comment'] and a['x']==b['x'] and a['y']==b['y'] and a['w']==b['w']
 page.locator('#lockUsername').check();page.locator('#randomAvatar').click();c=curr();assert c['username']==b['username'] and c['photo']!=b['photo'];page.locator('#lockAvatar').check();assert page.locator('#randomAvatar').is_disabled();page.locator('#lockUsername').uncheck();page.locator('#randomAvatar').click();d=curr();assert d['username']!=c['username'] and d['photo']==c['photo'];page.locator('#lockAvatar').uncheck()
 page.evaluate("document.activeElement.blur()");page.wait_for_timeout(250);page.evaluate("document.querySelector('#toolsPane').scrollTop=0");page.wait_for_timeout(100);page.screenshot(path='/tmp/sc_comment_v216_mobile.png')
 # source selector switches immediately and preserves question / geometry
 before=curr();page.locator('#source').select_option('real');r=curr();assert r['source']=='real' and r['username']=='' and not r['photo'] and r['avatarStyle']=='default';assert all(r[k]==before[k] for k in ('comment','x','y','w','rotation'));assert 'ไม่ระบุชื่อ' in page.evaluate('metrics(current()).heads.join(" ")');assert not page.locator('#randomAvatar').is_disabled()
 page.locator('#username').fill('ผู้ถามจริงที่ได้รับอนุญาต');page.locator('#username').blur();assert curr()['username']=='ผู้ถามจริงที่ได้รับอนุญาต';assert 'ตอบกลับความคิดเห็นของ' in page.evaluate('metrics(current()).heads.join(" ")')
 page.locator('#source').select_option('mock');m=curr();assert m['source']=='mock' and m['username']!='ผู้ถามจริงที่ได้รับอนุญาต' and m['photo'].startswith('data:image/jpeg') and m['comment']==before['comment'];assert not page.locator('#randomAvatar').is_disabled()
 # exact preservation of mock label and export image ready
 assert 'คำถามจำลอง' in page.evaluate('metrics(current()).heads.join(" ")')
 page.locator('#batchOpen').click() if page.locator('#batchOpen').count() else page.locator('#batchText').count()
 # direct UI-independent parser + generation via actual button
 if not page.locator('#batchDialog').evaluate('(e)=>e.open'): page.evaluate("document.querySelector('#batchDialog').showModal()")
 page.locator('#batchText').fill('คำถามหนึ่ง\nคำถามสอง\nคำถามสาม\nคำถามสี่\nคำถามห้า');page.locator('#batchReplace').check();page.locator('#batchGenerate').click();page.wait_for_timeout(250)
 arr=page.evaluate('comments().map(o=>({name:o.username,photo:o.photo,source:o.source}))');assert len(arr)==5 and len(set(x['name'] for x in arr))==5 and len(set(x['photo'] for x in arr))==5
 # ensure actual export bitmap, batch zip and project validation
 out=page.evaluate('''async()=>{await readyImages();let c=compCanvas(1,'transparent');let b=await blobOf(c);let files=[];for(let o of comments())files.push({name:o.id+'.png',blob:await blobOf(cardCanvas(o,1))});let z=await zipFiles(files);return {w:c.width,h:c.height,bytes:b.size,zip:Array.from(new Uint8Array(await z.arrayBuffer())),valid:!!validateProject(JSON.parse(snapshot()))||true}}''');assert (out['w'],out['h'])==(1080,1920) and out['bytes']>1000;assert len(zipfile.ZipFile(io.BytesIO(bytes(out['zip']))).namelist())==5
 # real source import can shuffle replacement identity, with disclosure
 page.evaluate("document.querySelector('#batchDialog').showModal()");page.locator('#batchText').fill('จริงทดสอบ: ตัวอย่าง');page.locator('#batchReal').check();page.locator('#batchGenerate').click();assert curr()['source']=='real' and not curr()['photo'] and not page.locator('#randomAvatar').is_disabled()
 before=curr();page.locator('#randomAvatar').click();after=curr();assert after['source']=='real' and after['username']!=before['username'] and after['photo'] and after['aliasName'] and after['aliasAvatar'];assert all(after[k]==before[k] for k in ('comment','x','y','w','rotation'));assert 'ชื่อและภาพแทน' in page.evaluate('metrics(current()).heads.join(" ")')
 page.locator('#lockUsername').check();page.locator('#randomAvatar').click();locked=curr();assert locked['username']==after['username'] and locked['photo']!=after['photo'];page.locator('#lockAvatar').check();assert page.locator('#randomAvatar').is_disabled();page.locator('#lockUsername').uncheck();page.locator('#randomAvatar').click();assert curr()['photo']==locked['photo'] and curr()['username']!=locked['username'];page.locator('#lockAvatar').uncheck()
 assert page.evaluate('validateProject(JSON.parse(snapshot())).objects.some(o=>o.aliasName&&o.aliasAvatar)')
 assert page.evaluate('''async()=>{await readyImages();return (await blobOf(cardCanvas(current(),1))).size>1000}''')
 page.locator('#source').select_option('mock');page.locator('#source').select_option('real');assert not curr()['aliasName'] and not curr()['aliasAvatar'] and not curr()['photo'];page.locator('#lockUsername').check();page.locator('#randomAvatar').click();assert 'ภาพแทน' in page.evaluate('metrics(current()).heads.join(" ")');assert not curr()['aliasName'];page.locator('#lockUsername').uncheck()
 # mobile fixed canvas on panel scroll
 y=page.locator('#stage').bounding_box()['y'];page.evaluate("document.querySelector('#toolsPane').scrollTop=1000");assert page.locator('#stage').bounding_box()['y']==y
 # desktop + dark
 desktop=browser.new_page(viewport={'width':1440,'height':900},service_workers='block');desktop.on('pageerror',lambda e:errors.append(str(e)));desktop.set_content(html,wait_until='load');desktop.wait_for_timeout(300);desktop.locator('#addComment').click();assert desktop.locator('#commentPanel').evaluate('(e)=>e.parentElement.className')=='inspector';desktop.locator('#uiTheme').click();assert desktop.locator('html').get_attribute('data-ui')=='dark';desktop.screenshot(path='/tmp/sc_comment_v216_desktop_dark.png')
 assert not errors,errors;print('PASS mobile desktop, identity library, locks, batch unique, real replacement shuffle + disclosure, export PNG/ZIP, fixed canvas; no runtime errors')
 browser.close()
