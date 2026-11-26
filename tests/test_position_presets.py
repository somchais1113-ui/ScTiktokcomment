from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
from playwright.sync_api import sync_playwright
from PIL import Image
from io import BytesIO
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
for filename in ['standard-logo.js','factory-template.js','identity-library.js','app.js']:
 html=html.replace(f'<script src="{filename}"></script>', '<script>'+ (root/filename).read_text()+'</script>')
html=html.replace('<head>','<head><script>Object.defineProperty(window,"localStorage",{value:{getItem:()=>null,setItem:()=>{}}});Object.defineProperty(window,"indexedDB",{value:null});</script>',1)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w,h,m in [(390,844,True),(768,1024,True),(1440,900,False)]:
  ctx=b.new_context(viewport={'width':w,'height':h},has_touch=m,is_mobile=m,accept_downloads=True);q=ctx.new_page();errors=[];q.on('pageerror',lambda e:errors.append(str(e)));q.on('dialog',lambda d:d.accept());q.set_content(html,wait_until="load");q.wait_for_function("state.templateName==='SCWork Q&A' && logos().length===1");q.locator('#addComment').click();q.locator('#comment').fill('ตัวอย่างคำถามสำหรับทดสอบตำแหน่ง');q.locator('#comment').blur();assert q.evaluate("document.getElementById('transformPanel').nextElementSibling === document.getElementById('layouts').parentElement && document.getElementById('layouts').parentElement.nextElementSibling === document.getElementById('layers').parentElement");assert not q.locator('#transformPanel').get_attribute('open');q.locator('#transformPanel summary').click();buttons=q.locator('#transformPositions button');assert buttons.count()==3
  assert q.locator('#x,#y,#width,#height').count()==0
  assert q.evaluate("()=>{const rows={}; for(const b of document.querySelectorAll('#transformPositions button')){const y=b.getBoundingClientRect().top; rows[y]=(rows[y]||0)+1;} return Object.values(rows).join(',')==='3';}")
  orig=q.evaluate('({w:current().w,h:current().h,rotation:current().rotation,comment:current().comment})')
  assert q.evaluate("""()=>{const o=current(),W=state.w,H=state.h;let a=o.rotation*Math.PI/180,bh=Math.abs(o.w*Math.sin(a))+Math.abs(o.h*Math.cos(a));return [6,7,8].every(i=>Math.abs(transformPosition(o,i).y+o.h/2+bh/2-(H-Math.min(H*.18,(H-bh)*.4)))<.01)&&[0,1,2,3,4,5].every(i=>{let r=Math.floor(i/3),y=(r===0?Math.min(H*.02,(H-bh)*.2)+bh/2:H/2)-o.h/2;return Math.abs(transformPosition(o,i).y-y)<.01})}""")
  assert q.evaluate("""()=>{const o=current();const x=[0,1,2].map(i=>transformPosition(o,i).x),y=[0,3,6].map(i=>transformPosition(o,i).y);return x[0]<x[1]&&x[1]<x[2]&&y[0]<y[1]&&y[1]<y[2]&&Math.abs(x[0]-Math.min(state.w*.01,(state.w-o.w)*.2))<.01}""")
  assert q.evaluate("""()=>{const o={...current(),w:state.w*.97,h:state.h*.97,rotation:0};const x=[0,1,2].map(i=>transformPosition(o,i).x),y=[0,3,6].map(i=>transformPosition(o,i).y);return x[0]<x[1]&&x[1]<x[2]&&y[0]<y[1]&&y[1]<y[2]}""")
  for idx,i in enumerate([1,4,7]):
   buttons.nth(idx).click();assert buttons.nth(idx).get_attribute('aria-pressed')=='true';assert q.evaluate('(i)=>{let o=current(),p=transformPosition(o,i);return Math.abs(o.x-p.x)<.01&&Math.abs(o.y-p.y)<.01}',i);assert q.evaluate('({w:current().w,h:current().h,rotation:current().rotation,comment:current().comment})')==orig
  q.locator('#undo').click();assert buttons.nth(1).get_attribute('aria-pressed')=='true';q.locator('#redo').click();assert buttons.nth(2).get_attribute('aria-pressed')=='true'
  q.locator('#rotation').fill('12');q.locator('#rotation').blur();buttons.nth(0).click();assert q.evaluate('current().rotation')==12;assert q.evaluate('current().w')==orig['w']
  q.locator('#locked').check();assert buttons.nth(0).is_disabled();q.locator('#locked').uncheck();assert buttons.nth(0).is_enabled();q.locator('#resetTransform').click();buttons.nth(1).click()
  # screenshot actual transform section
  if w==390:q.locator('#transformPanel').screenshot(path='/mnt/data/sc_comment_v2119_position.png')
  q.locator('#exportOpen').click();q.locator('#exportType').select_option('transparent');
  with q.expect_download() as dl:q.locator('#exportGo').click()
  im=Image.open(dl.value.path());assert im.size==(1080,1920) and im.mode=='RGBA';assert not errors,errors
  print('PASS',w,h,'3 anchors, size preserved, undo/redo, rotation, lock, PNG export',flush=True);ctx.close()
 b.close()

