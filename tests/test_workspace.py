from playwright.sync_api import sync_playwright
from PIL import Image
from pathlib import Path
import json
html=(Path(__file__).resolve().parents[1] / 'index.html').read_text()
for filename in ['standard-logo.js','factory-template.js','app.js']:
 html=html.replace(f'<script src="{filename}"></script>', '<script>'+ (Path(__file__).resolve().parents[1]/filename).read_text()+'</script>')
# Tests use Chromium + synthetic storage and native share bridge, not actual iOS.
shim='''<script>window.testStorage={};Object.defineProperty(window,'localStorage',{value:{getItem:k=>window.testStorage[k]??null,setItem:(k,v)=>window.testStorage[k]=String(v)}});Object.defineProperty(window,'indexedDB',{value:null});Object.defineProperty(navigator,'canShare',{value:({files})=>files?.[0]?.type==='image/png'||files?.[0]?.type==='image/jpeg'});Object.defineProperty(navigator,'share',{value:async ({files})=>{window.shared={name:files[0].name,type:files[0].type,size:files[0].size}}});</script>'''
html=html.replace('<head>','<head>'+shim,1)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);errors=[]
 for w,h,m in [(390,844,True),(768,1024,True),(1440,900,False)]:
  ctx=b.new_context(viewport={'width':w,'height':h},has_touch=m,is_mobile=m,accept_downloads=True);q=ctx.new_page();q.on('pageerror',lambda e:errors.append(str(e)));q.on('dialog',lambda d:d.accept());q.set_content(html,wait_until='load');q.wait_for_function("state.templateName==='SCWork Q&A' && logos().length===1 && image(logos()[0].src)");assert q.evaluate("document.documentElement.dataset.ui")=='light';assert q.evaluate('state.bg.type')=='transparent';assert q.evaluate('logos()[0].anchor')==1
  q.locator('#addComment').click();q.locator('#comment').fill('Pantone C และ Pantone U ต่างกันยังไงครับ?');q.locator('#comment').blur();q.wait_for_timeout(150)
  assert q.evaluate('comments().length')==1
  def bounds(sel):return q.locator(sel).bounding_box()
  if m:
   before=bounds('.center');q.locator('#toolsPane').evaluate('(e)=>e.scrollTop=e.scrollHeight');q.wait_for_timeout(100);assert bounds('.center')==before;q.locator('#toolsPane').evaluate('(e)=>e.scrollTop=0')
  q.screenshot(path=f'/tmp/sc_comment_v212_{w}_light.png');q.locator('#uiTheme').click();assert q.evaluate('document.documentElement.dataset.ui')=='dark';assert q.evaluate('comments()[0].theme')=='light';assert q.evaluate("localStorage.getItem('sccomment.ui.theme.v1')")=='dark';q.screenshot(path=f'/tmp/sc_comment_v212_{w}_dark.png');q.locator('#uiTheme').click()
  q.locator('#backgroundTab').click();assert q.locator('#backgroundDialog').is_visible();q.locator('#bgType').select_option('color');assert q.evaluate('state.bg.type')=='color';q.locator('#bgType').select_option('transparent');q.screenshot(path=f'/tmp/sc_comment_v212_{w}_background.png');q.locator('#bgClose').click();assert not q.locator('#backgroundDialog').is_visible();q.locator('#standardLogo').click();assert q.evaluate('logos().length')==1;assert q.evaluate("current().kind")=='logo';q.locator('#positions button').nth(2).click();assert q.evaluate('logos()[0].anchor')==2;q.locator('#positions button').nth(1).click()
  q.locator('#layouts button').nth(2).click();assert q.evaluate('state.layout')=='grid';q.locator('#layouts button').first.click()
  q.locator('#exportOpen').click();q.wait_for_function("!document.getElementById('shareImage').disabled");q.locator('#shareImage').click();q.wait_for_function('window.shared?.size>0');assert q.evaluate('window.shared.type')=='image/png';q.screenshot(path=f'/tmp/sc_comment_v212_{w}_export.png');
  with q.expect_download() as dl:q.locator('#exportGo').click()
  out=f'/tmp/sc212_{w}.png';dl.value.save_as(out);im=Image.open(out);assert im.size==(1080,1920) and im.mode=='RGBA' and im.getpixel((0,0))[3]==0;assert im.crop((300,80,780,330)).getbbox();q.locator('#newContent').click();assert q.evaluate('comments().length===0&&logos().length===1');print('PASS',w,h,'theme, logo, bg popup, layouts, share mock, PNG alpha, new content');ctx.close()
 print('errors',errors);assert not errors;b.close()
