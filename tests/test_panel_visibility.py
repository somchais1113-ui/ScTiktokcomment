from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
for filename in ['standard-logo.js','factory-template.js','identity-library.js','app.js']:
 html=html.replace(f'<script src="{filename}"></script>', '<script>'+ (root/filename).read_text()+'</script>')
html=html.replace('<head>','<head><script>Object.defineProperty(window,"localStorage",{value:{getItem:()=>null,setItem:()=>{}}});Object.defineProperty(window,"indexedDB",{value:null});</script>',1)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w,h,m in [(390,844,True),(768,1024,True),(1440,900,False)]:
  ctx=b.new_context(viewport={'width':w,'height':h},has_touch=m,is_mobile=m,accept_downloads=True);q=ctx.new_page();errors=[];q.on('pageerror',lambda e:errors.append(str(e)));q.set_content(html,wait_until='load');q.wait_for_function("state.templateName==='SCWork Q&A' && logos().length===1");q.locator('#addComment').click();assert q.locator('#transformPanel').is_visible();assert q.locator('#transformPanel summary').count()==0;assert q.locator('#transformPositions button').count()==4;assert q.locator('#transformPositions button').first.is_visible();assert not q.locator('#layouts').is_visible();assert q.evaluate("document.querySelector('#transformPanel').nextElementSibling.id==='layoutPanel'");q.locator('#layoutPanel summary').click();assert q.locator('#layouts').is_visible();q.locator('#layouts button[data-layout=stack]').click();q.locator('#layoutPanel summary').click();assert not q.locator('#layouts').is_visible();assert q.locator('#transformPositions button').first.is_visible();q.locator('#transformPositions button[data-anchor=\"4\"]').click();assert q.locator('#transformPositions button[data-anchor=\"4\"]').get_attribute('aria-pressed')=='true';assert not errors,errors
  print('PASS',w,h,flush=True);ctx.close()
 b.close()
