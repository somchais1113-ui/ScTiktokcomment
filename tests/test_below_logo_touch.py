from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
from playwright.sync_api import sync_playwright
from PIL import Image
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
for f in ['standard-logo.js','factory-template.js','identity-library.js','app.js']:
 html=html.replace(f'<script src="{f}"></script>','<script>'+ (root/f).read_text()+'</script>')
html=html.replace('<head>','<head><script>Object.defineProperty(window,"localStorage",{value:{getItem:()=>null,setItem:()=>{}}});Object.defineProperty(window,"indexedDB",{value:null});</script>',1)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w,h,touch in [(390,844,True),(768,1024,True),(1440,900,False)]:
  ctx=b.new_context(viewport={'width':w,'height':h},has_touch=touch,is_mobile=touch,accept_downloads=True)
  q=ctx.new_page();errs=[];q.on('pageerror',lambda e:errs.append(str(e)))
  q.set_content(html,wait_until="load");q.wait_for_function("state.templateName==='SCWork Q&A' && logos().length===1")
  activate=lambda el: el.tap() if touch else el.click()
  activate(q.locator('#addComment'));btn=q.locator('.logo-below');assert btn.is_enabled()
  activate(q.locator('#transformPositions [data-anchor="4"]'))
  orig=q.evaluate('({w:current().w,h:current().h,rotation:current().rotation,comment:current().comment,x:current().x,y:current().y})')
  activate(btn);assert btn.get_attribute('aria-pressed')=='true'
  after=q.evaluate('({w:current().w,h:current().h,rotation:current().rotation,comment:current().comment,x:current().x,y:current().y})')
  assert after['y']<orig['y'];assert all(orig[k]==after[k] for k in ['w','h','rotation','comment'])
  assert q.evaluate('Math.abs(current().y-(logos()[0].y+logos()[0].h+Math.max(12,Math.min(state.w,state.h)*.016)))<.01')
  activate(q.locator('#undo'));assert q.evaluate('current().y')==orig['y'];activate(q.locator('#redo'));assert q.evaluate('current().y')==after['y']
  # disabled on no visible logo, on locked comment, and when logo selected
  q.evaluate('logos()[0].visible=false;sync()');assert btn.is_disabled();q.evaluate('logos()[0].visible=true;current().locked=true;sync()');assert btn.is_disabled();q.evaluate('current().locked=false;sync()');assert btn.is_enabled()
  q.evaluate('window.cId=current().id;choose(logos()[0].id)');assert btn.is_disabled();q.evaluate('choose(window.cId)');assert btn.is_enabled()
  q.evaluate('logos()[0].y=state.h-logos()[0].h;sync()');before=q.evaluate('current().y');activate(btn);assert q.evaluate('current().y')==before;assert 'พื้นที่ใต้โลโก้ไม่พอ' in q.locator('#status').inner_text();q.evaluate('logos()[0].y=82.08;sync()');activate(btn)
  for anchor in ['1','4','7']:
   el=q.locator(f'#transformPositions [data-anchor="{anchor}"]');activate(el);assert el.get_attribute('aria-pressed')=='true'
  activate(btn);activate(q.locator('#exportOpen'));q.locator('#exportType').select_option('transparent');q.locator('#exportScale').select_option('1')
  with q.expect_download() as d:activate(q.locator('#exportGo'))
  im=Image.open(d.value.path());assert im.size==(1080,1920) and im.mode=='RGBA';assert not errs,errs
  print('PASS',w,h,'touch' if touch else 'mouse','below logo, bounds, disable states, undo/redo, all 3 anchors, export',flush=True);ctx.close()
 b.close()

