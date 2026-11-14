"""Current real-profile smoke checks. Requires optional Playwright."""
from pathlib import Path
from threading import Thread
from functools import partial
from http.server import ThreadingHTTPServer
from playwright.sync_api import sync_playwright
from serve import PreviewHandler
root=Path(__file__).resolve().parents[1]
server=ThreadingHTTPServer(('127.0.0.1',0),partial(PreviewHandler,directory=str(root)))
Thread(target=server.serve_forever,daemon=True).start()
errors=[];checks=0
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch();p=b.new_page();p.on('pageerror',lambda e:errors.append(str(e)))
  for page in ['index.html','cv.html']:
   for lang in ['ko','en']:
    p.goto(f'http://127.0.0.1:{server.server_port}/{page}?lang={lang}')
    assert p.locator('.paper').count()==3;checks+=1
    assert p.locator('a[href="mailto:jungchan0202@cau.ac.kr"]').count()>0;checks+=1
    assert p.locator('#demo-notice').is_hidden();checks+=1
    assert ('류정찬' if lang=='ko' else 'Jungchan Ryu') in p.locator('main').inner_text();checks+=1
    assert '김서윤' not in p.locator('body').inner_text();checks+=1
    for width in [320,390,768,1024,1440]:
     p.set_viewport_size({'width':width,'height':950})
     assert p.evaluate('document.documentElement.scrollWidth<=innerWidth');checks+=1
    p.screenshot(path=str(root/'.preview'/f'current-{page}-{lang}.png'),full_page=True)
  p.goto(f'http://127.0.0.1:{server.server_port}/')
  p.locator('#pub-search').fill('ALS');assert p.locator('.paper').count()==2;checks+=1
  p.locator('[data-lang="en"]').click();assert p.locator('.paper').count()==2;checks+=1
  p.locator('#pub-search').fill('');p.locator('#pub-type').select_option('conference');assert p.locator('.paper').count()==1;checks+=1
  p.locator('#pub-year').select_option('2026');assert p.locator('.paper').count()==1;checks+=1
  assert not errors;checks+=1
  b.close()
 print(f'PASS: {checks} current-profile checks; JS errors: {len(errors)}')
finally:
 server.shutdown();server.server_close()
