from playwright.sync_api import sync_playwright
from PIL import Image
from pathlib import Path
import zipfile
html=(Path(__file__).resolve().parents[1] / 'index.html').read_text()
for filename in ['standard-logo.js','factory-template.js','identity-library.js','app.js']:
 html=html.replace(f'<script src="{filename}"></script>', '<script>'+ (Path(__file__).resolve().parents[1]/filename).read_text()+'</script>')
shim='''<script>window.testStorage={};Object.defineProperty(window,'localStorage',{value:{getItem:k=>window.testStorage[k]??null,setItem:(k,v)=>window.testStorage[k]=String(v)}});Object.defineProperty(window,'indexedDB',{value:null});Object.defineProperty(navigator,'share',{value:undefined});Object.defineProperty(navigator,'canShare',{value:undefined});</script>'''
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);q=b.new_page(viewport={'width':430,'height':932},is_mobile=True,has_touch=True,accept_downloads=True);errs=[];q.on('pageerror',lambda e:errs.append(str(e)));q.on('dialog',lambda d:d.accept());q.set_content(html.replace('<head>','<head>'+shim,1));q.wait_for_function("state.templateName==='SCWork Q&A'");q.locator('#batchOpen').click();q.locator('#batchText').fill('คำถามที่หนึ่ง\nคำถามที่สอง\nคำถามที่สาม\nคำถามที่สี่\nคำถามที่ห้า');q.locator('#batchGenerate').click();assert q.evaluate('comments().length===5&&logos().length===1&&new Set(comments().map(c=>c.avatarSeed)).size===5');q.locator('#layouts button').last.scroll_into_view_if_needed();q.screenshot(path='/tmp/sc_comment_v212_layout_icons.png');q.locator('#backgroundTab').click();q.locator('#bgType').select_option('color');q.locator('#bgColor').fill('#345678');q.locator('#bgColor').dispatch_event('change');q.locator('#bgClose').click();q.locator('#exportOpen').click();q.wait_for_function("!document.getElementById('sharePreviewWrap').hidden");assert q.locator('#shareImage').is_hidden();
 with q.expect_download() as d:q.locator('#exportGo').click()
 d.value.save_as('/tmp/sc212_color.png');assert Image.open('/tmp/sc212_color.png').getpixel((0,0))==(52,86,120,255)
 q.locator('#exportOpen').click();q.locator('#exportType').select_option('zip');assert q.locator('#shareImage').is_hidden();
 with q.expect_download() as d:q.locator('#exportGo').click()
 d.value.save_as('/tmp/sc212_batch.zip');assert len(zipfile.ZipFile('/tmp/sc212_batch.zip').namelist())==5
 q.locator('#newContent').click();q.locator('#templateOpen').click();q.locator('#templateSave').click();q.wait_for_function("document.getElementById('templateStatus').textContent.includes('บันทึก Default')");assert q.evaluate('getDefaultTemplate().objects.length===1');assert not errs,errs;print('PASS batch, six layout icons, color PNG, no-share fallback, ZIP, template save simulated');b.close()
