from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
for filename in ['standard-logo.js','factory-template.js','identity-library.js','app.js']:
    html=html.replace(f'<script src="{filename}"></script>','<script>'+(root/filename).read_text()+'</script>')
html=html.replace('<head>','<head><script>Object.defineProperty(window,"localStorage",{value:{getItem:()=>null,setItem:()=>{}}});Object.defineProperty(window,"indexedDB",{value:null});</script>',1)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    q=b.new_page(viewport={'width':390,'height':844},has_touch=True)
    errors=[]; q.on('pageerror',lambda e:errors.append(str(e)))
    q.set_content(html,wait_until='load');q.wait_for_function("state.templateName==='SCWork Q&A'")
    assert q.evaluate("identityLibrary.names.length===150 && new Set(identityLibrary.names).size===150 && identityLibrary.avatars.length===50 && identityLibrary.photoAvatars.length===50")
    assert q.evaluate("Object.values(identityLibrary.nameGroups).map(x=>x.length)")==[50,35,35,30]
    q.locator('#addComment').click()
    assert q.evaluate("headingRows(current())[0].text==='คำถามตัวอย่าง'")
    assert q.evaluate("(()=>{let o=current();const prev=Math.random;Math.random=()=>.999999;try{return identityLibrary.photoAvatars.includes(libraryPhoto(o))}finally{Math.random=prev}})()")
    q.locator('#source').select_option('real');q.locator('#randomAvatar').click()
    assert q.evaluate("identityLibrary.avatars.includes(current().photo)&&!identityLibrary.photoAvatars.includes(current().photo)&&headingRows(current()).some(r=>r.text.includes('ปกปิดตัวตน'))")
    assert not errors,errors
    b.close()
print('PASS library counts, source-specific pools, disclosure, no runtime errors')
