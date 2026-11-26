from pathlib import Path
from playwright.sync_api import sync_playwright
import zipfile,io
from PIL import Image
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
for filename in ['standard-logo.js','factory-template.js','identity-library.js','app.js']:
 html=html.replace(f'<script src="{filename}"></script>', '<script>'+ (root/filename).read_text()+'</script>')
html=html.replace('<head>','<head><script>Object.defineProperty(window,"localStorage",{value:{getItem:()=>null,setItem:()=>{}}});Object.defineProperty(window,"indexedDB",{value:null});</script>',1)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w,h,m in [(390,844,True),(768,1024,True),(1440,900,False)]:
  ctx=b.new_context(viewport={'width':w,'height':h},has_touch=m,is_mobile=m,accept_downloads=True);q=ctx.new_page();errs=[];q.on('pageerror',lambda e:errs.append(str(e)));q.set_content(html,wait_until='load');q.wait_for_function("state.templateName==='SCWork Q&A' && logos().length===1")
  q.locator('#addComment').click();assert q.locator('#groupShuffle').is_disabled();assert not q.locator('#layers').is_visible();q.locator('#layersPanel summary').click();assert q.locator('#layers').is_visible();q.locator('#layersPanel summary').click();assert not q.locator('#layers').is_visible()
  for i in range(3):q.locator('#addComment').click()
  q.evaluate("comments()[0].lockUsername=true;comments()[1].lockAvatar=true;comments()[2].locked=true;comments()[3].source='real';sync()")
  before=q.evaluate('clone(state)');old=q.evaluate('clone(comments())');q.locator('#groupShuffle').click();new=q.evaluate('clone(comments())')
  assert old[0]['username']==new[0]['username'] and old[0]['photo']!=new[0]['photo'];assert old[1]['photo']==new[1]['photo'] and old[1]['username']!=new[1]['username'];assert old[2]==new[2];assert old[3]['username']!=new[3]['username'] and old[3]['photo']!=new[3]['photo'];assert len(set(c['username'] for c in new))==4;assert len(set(c['photo'] for c in new))==4
  assert all(a[k]==z[k] for a,z in zip(old,new) for k in ['id','comment','x','y','w','rotation','source']);assert q.evaluate("headingRows(comments()[3])[0].text.includes('ปกปิดตัวตน') && headingRows(comments()[0])[0].text==='คำถามตัวอย่าง'")
  assert q.evaluate('clone(logos())')==[o for o in before['objects'] if o['kind']=='logo'];after=q.evaluate('clone(state)');q.locator('#undo').click();assert q.evaluate('clone(state)')==before;q.locator('#redo').click();assert q.evaluate('clone(state)')==after
  q.locator('#layersPanel summary').click();assert q.locator('#layers button').count()==5;q.locator('#layersPanel summary').click()
  q.locator('#groupShuffle').scroll_into_view_if_needed();q.screenshot(path=f'/mnt/data/sc_comment_v2122_{w}.png')
  q.locator('#exportOpen').click();q.locator('#exportType').select_option('transparent');q.locator('#exportScale').select_option('1');q.wait_for_function("!document.getElementById('sharePreviewWrap').hidden")
  with q.expect_download() as d:q.locator('#exportGo').click()
  im=Image.open(d.value.path());assert im.size==(1080,1920) and im.mode=='RGBA'
  if w==390:
   if not q.locator('#exportDialog').is_visible():q.locator('#exportOpen').click()
   q.locator('#exportType').select_option('zip')
   with q.expect_download() as d:q.locator('#exportGo').click()
   with zipfile.ZipFile(d.value.path()) as z:assert len(z.namelist())==4
  assert not errs,errs;print('PASS',w,h,flush=True);ctx.close()
 b.close()
