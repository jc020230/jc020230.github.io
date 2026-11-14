#!/usr/bin/env python3
"""Check the actual page scripts and responsive layout with Playwright.

Normal use: python tools/browser_check.py
Optional:   python tools/browser_check.py --executable /usr/bin/chromium
Restricted preview environment: add --inline (no browser URL navigation).

Normal mode starts an HTTP server and uses the shipped relative paths.
Inline mode injects the same HTML/CSS/JS into an empty browser document and maps
local images to data URLs for display. This mode cannot verify browser navigation,
URL persistence, or HTTP resource loading. It is NOT a live-deployment test.
Dependencies: pip install playwright; python -m playwright install chromium
"""
from __future__ import annotations
import argparse
import base64
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import mimetypes
from pathlib import Path
import re
import shutil
from threading import Thread
from urllib.request import urlopen
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '.preview'
WIDTHS = [320, 360, 390, 540, 600, 760, 768, 1024, 1440, 1920]


def inline_load(page, language: str, cv: bool = False) -> None:
    html = (ROOT / ('cv.html' if cv else 'index.html')).read_text(encoding='utf-8')
    html = re.sub(r'<script\b[^>]*src=[^>]*>\s*</script>', '', html, flags=re.I)
    html = re.sub(r'<link\b[^>]*>', '', html, flags=re.I)
    css = (ROOT / 'assets/css/style.css').read_text(encoding='utf-8')
    html = html.replace('</head>', '<style>' + css + '</style></head>')
    page.set_content(html, wait_until='domcontentloaded')
    images = {}
    for path in (ROOT / 'assets').rglob('*'):
        if path.suffix.lower() in {'.png', '.jpg', '.jpeg', '.webp', '.svg'}:
            mime = mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
            images['./' + path.relative_to(ROOT).as_posix()] = 'data:' + mime + ';base64,' + base64.b64encode(path.read_bytes()).decode()
    page.add_script_tag(content='window.__previewAssets=' + json.dumps(images) + ';' + '''
    new MutationObserver(() => {
      for (const img of document.images) {
        const src=img.getAttribute('src');
        if(window.__previewAssets[src]) {
          img.dataset.previewSrc=src; img.loading='eager'; img.src=window.__previewAssets[src];
        }
      }
    }).observe(document, {subtree:true, childList:true, attributes:true, attributeFilter:['src']});
    ''')
    page.add_script_tag(content=(ROOT / 'assets/js/data.js').read_text(encoding='utf-8'))
    page.evaluate('(language)=>{window.SITE_DATA.site.defaultLanguage=language}', language)
    for name in ('i18n', 'app'):
        page.add_script_tag(content=(ROOT / f'assets/js/{name}.js').read_text(encoding='utf-8'))
    page.evaluate('document.fonts.ready')
    page.evaluate('() => Promise.all([...document.images].filter(i=>i.src).map(i=>i.decode().catch(()=>{})))')


class Handler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def translate_path(self, path):
        if path.startswith('/test-prefix/'):
            path = path[len('/test-prefix'):]
        return super().translate_path(path)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--inline', action='store_true')
    parser.add_argument('--executable', default=None)
    args = parser.parse_args()
    OUT.mkdir(exist_ok=True)
    passed, errors, resource_errors = [], [], []
    server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=str(ROOT)))
    Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}/'

    def check(condition, label):
        if not condition:
            raise AssertionError(label)
        passed.append(label)
        print(f"PASS {len(passed)}: {label}", flush=True)

    def http_paths():
        files = [ROOT/'index.html', ROOT/'cv.html', ROOT/'robots.txt', ROOT/'sitemap.xml']
        files += [p for p in (ROOT/'assets').rglob('*') if p.is_file() and p.suffix in {'.js','.css','.png','.webp','.svg','.pdf'}]
        for file in files:
            with urlopen(base + file.relative_to(ROOT).as_posix(), timeout=10) as response:
                check(response.status == 200 and len(response.read()) == file.stat().st_size,
                      f'HTTP file bytes: {file.relative_to(ROOT)}')

    try:
        http_paths()
        with sync_playwright() as pw:
            executable = args.executable or shutil.which('chromium') or shutil.which('chromium-browser')
            options = {'headless': True}
            if executable:
                options['executable_path'] = executable
            browser = pw.chromium.launch(**options)
            context = browser.new_context(viewport={'width':1440,'height':1000})

            def load(page, lang='ko', cv=False, prefix=''):
                if args.inline:
                    inline_load(page, lang, cv)
                else:
                    page.goto(base + prefix + ('cv.html' if cv else 'index.html') + '?lang=' + lang)
                    page.evaluate('document.fonts.ready')

            page = context.new_page()
            page.on('pageerror', lambda err: errors.append(str(err)))
            if not args.inline:
                page.on('response', lambda response: resource_errors.append(f'{response.status} {response.url}') if response.status >= 400 else None)
            load(page)
            data = page.evaluate('window.SITE_DATA')
            papers = data['publications']
            count = lambda: page.locator('#publication-list .paper').count()
            check(count() == len(papers), 'All publication records render')
            check(page.locator('h1').count() == 1, 'One main heading')
            check(page.locator('#about-heading').inner_text() == data['profile']['name']['ko'], 'Name is the opening heading')
            check(page.locator('#about').evaluate('(e)=>e.getBoundingClientRect().height>0'), 'About anchor has a scroll target')
            check(page.locator('#demo-notice').is_hidden(), 'No demo banner')
            check(page.locator('a[href="#"]').count() == 0, 'No dummy links')
            check(page.evaluate('[...document.querySelectorAll("a")].filter(a=>(a.getAttribute("href")||"").startsWith("#")).every(a=>document.getElementById(a.getAttribute("href").slice(1)))'), 'All local section anchors resolve')
            check(page.locator('#publication-tools').get_attribute('open') is None, 'Filters start collapsed')
            check(page.locator('.selected-label,.brand-mark').count() == 0, 'No selected/monogram badges')
            check(page.locator('.challenge-rank').all_text_contents() == [a['rank'] for a in data['awards']], 'Prominent award ranks retained')
            check(page.locator('.challenge-rank').first.evaluate('(e)=>parseFloat(getComputedStyle(e).fontSize)>=34'), 'Rank text is prominent')
            check(page.locator('[data-nav=projects]').get_attribute('href') == '#projects', 'Projects navigation link')
            check(page.locator('.challenge-row').count() == len(data['awards']), 'All award records remain')
            check(page.locator('.gallery-item').count() == len(data['gallery']), 'All photo albums remain')
            check(page.locator('.profile-photo').evaluate('(i)=>i.naturalWidth>0'), 'Profile photo loads')
            check(page.locator('#news-items > li').count() == min(data['site']['newsLimit'],len(data['news'])), 'Recent-news limit')
            check(page.locator('a').filter(has_text='Google Scholar').count() == 0, 'No invented Scholar link')
            check(not re.search(r'출생|고등학교|군 복무', page.locator('body').inner_text()), 'Excluded personal details absent')

            # Keyboard navigation is exercised against the actual DOM.
            page.keyboard.press('Tab')
            check(page.locator('.skip-link').evaluate('(e)=>e===document.activeElement'), 'Skip link receives first keyboard focus')
            if not args.inline:
                page.keyboard.press('Enter')
                check(page.locator('#main-content').evaluate('(e)=>e===document.activeElement'), 'Skip link targets main content')
            else:
                check(page.locator('.skip-link').get_attribute('href') == '#main-content', 'Skip link target attribute')
            page.locator('[data-lang="en"]').click()
            check(page.locator('html').get_attribute('lang') == 'en', 'English switching')
            check('Research homepage' in page.title(), 'English page title')
            check(page.locator('.cv-link').get_attribute('href').endswith('?lang=en'), 'CV link preserves language')
            if not args.inline:
                check('lang=en' in page.url, 'Language parameter changes')
                page.reload()
                check(page.locator('html').get_attribute('lang')=='en', 'Language persists on reload')
                page.goto(base)
                check(page.locator('html').get_attribute('lang')=='en', 'Language persists in local storage')
                page.goto(base+'?lang=ko')
                check(page.locator('html').get_attribute('lang')=='ko', 'Explicit language overrides saved preference')
                page.locator('[data-lang="en"]').click()

            page.locator('#publication-tools > summary').click()
            check(page.locator('#pub-search').is_visible(), 'Search panel opens')
            page.locator('#pub-search').fill('ALS')
            check(count() == 2, 'ALS search returns two source records')
            page.locator('#pub-search').fill('2026 speech')
            check(count() == 2, 'Multi-term search')
            page.locator('[data-lang="ko"]').click()
            check(page.locator('#pub-search').input_value() == '2026 speech' and count()==2, 'Search survives language switch')
            check(page.locator('#pub-search').is_visible(), 'Filter panel stays open when switching language')
            page.locator('#pub-search').fill('')
            page.locator('#pub-type').select_option('conference')
            check(count()==1, 'Conference filter')
            page.locator('#pub-type').select_option('journal')
            check(count()==2, 'Journal filter')
            page.locator('#pub-year').select_option('2026')
            check(count()==2, 'Combined year/type filter')
            page.locator('#pub-type').select_option('all')
            page.locator('#pub-selected').check()
            check(count()==sum(bool(p['selected']) for p in papers), 'Selected filter retained')
            page.locator('#pub-selected').uncheck()
            page.locator('#pub-search').fill('no-such-paper-049358')
            check(count()==0, 'No-result state')
            page.locator('[data-action="reset-filters"]').click()
            check(count()==len(papers), 'Reset restores all publications')
            check(page.locator('#pub-search').evaluate('(e)=>e===document.activeElement'), 'Reset restores search focus')
            bib = page.locator('[data-panel$="-bibtex"]').first
            bib.click()
            check(page.locator('.bib-panel').first.is_visible(), 'BibTeX expands')
            page.locator('[data-action="copy-bibtex"]').first.click()
            page.locator('#toast').wait_for(state='visible')
            check(page.locator('#toast').is_visible(), 'Copy feedback is visible (success/fallback)')
            bib.click()
            check(page.locator('.bib-panel').first.is_hidden(), 'BibTeX collapses')
            page.locator('#publication-tools > summary').click()
            page.locator('[data-action="toggle-news"]').click()
            check(page.locator('#news-items > li').count()==len(data['news']), 'All news records expand')
            pdf = page.locator('#news a[href$="korean-statistical-society-2026-als-abstract.pdf"]')
            check(pdf.count()==1, 'Proceedings abstract PDF link retained')
            check(page.locator('#news-items time[datetime="2026-11-06"]').count()==1, 'Source news date precision preserved')
            check(page.locator('#news-items').inner_text().find('Invalid Date')<0, 'Dates format successfully')
            photo = page.locator('#news [data-action="open-photo"]').first
            photo.click()
            check(page.locator('#photo-dialog').evaluate('(e)=>e.open'), 'News photo dialog opens')
            expected_photos = sum(len(event['images']) for event in data['gallery'])
            check(page.locator('#photo-dialog-count').inner_text().endswith(f'/ {expected_photos}'), 'All original photos remain in dialog')
            previous = page.locator('#photo-dialog-count').inner_text()
            page.keyboard.press('ArrowRight')
            check(page.locator('#photo-dialog-count').inner_text()!=previous, 'Next-photo keyboard control')
            page.keyboard.press('ArrowLeft')
            check(page.locator('#photo-dialog-count').inner_text()==previous, 'Previous-photo keyboard control')
            page.keyboard.press('Escape')
            check(not page.locator('#photo-dialog').evaluate('(e)=>e.open'), 'Escape closes photo dialog')
            check(photo.evaluate('(e)=>e===document.activeElement'), 'Dialog returns focus')
            page.locator('[data-action="toggle-news"]').click()
            page.locator('.gallery-image').first.click()
            check(page.locator('#photo-dialog').evaluate('(e)=>e.open'), 'Gallery photo dialog opens')
            for _ in range(expected_photos):
                page.locator('[data-action="next-photo"]').click()
                page.evaluate('() => document.getElementById("photo-dialog-image").decode()')
                check(page.locator('#photo-dialog-image').evaluate('(e)=>e.naturalWidth>0'), 'Photo navigation loads the original image')
            page.locator('[data-action="close-photo"]').click()
            page.locator('[data-action="copy-email"]').click()
            page.locator('#toast').wait_for(state='visible')
            check(page.locator('#toast').is_visible(), 'Email copy feedback')
            page.set_viewport_size({'width':390,'height':844})
            page.locator('#menu-toggle').click()
            check(page.locator('#menu-toggle').get_attribute('aria-expanded')=='true', 'Mobile menu opens')
            page.keyboard.press('Escape')
            check(page.locator('#menu-toggle').get_attribute('aria-expanded')=='false', 'Mobile menu closes with Escape')
            if not args.inline:
                page.locator('#menu-toggle').click()
                page.locator('#primary-nav a[href="#about"]').click()
                check(page.locator('#menu-toggle').get_attribute('aria-expanded')=='false', 'Choosing an anchor closes mobile menu')
            check(page.locator('#about').evaluate('(e)=>e.getBoundingClientRect().height>0'), 'Mobile About retains a real section box')
            page.close()

            # Responsive matrix: each of two languages, two pages, and ten widths.
            for lang in ['ko','en']:
                for cv in [False,True]:
                    page=context.new_page()
                    page.on('pageerror',lambda error: errors.append(str(error)))
                    load(page,lang,cv)
                    for width in WIDTHS:
                        page.set_viewport_size({'width':width,'height':1000})
                        page.wait_for_timeout(20)
                        check(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'No overflow: {lang}/{"cv" if cv else "home"}/{width}')
                        check(page.locator('h1').count()==1,f'Main heading retained: {lang}/{"cv" if cv else "home"}/{width}')
                        if not cv and width<=760:
                            page.locator('#menu-toggle').click()
                            check(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'Open menu fits: {lang}/{width}')
                            page.locator('#menu-toggle').click()
                        if width in [390,1440]:
                            stem=f'{"cv" if cv else "home"}-{lang}-{width}'
                            page.screenshot(path=str(OUT/f'{stem}.png'),full_page=True)
                    if cv:
                        check(page.locator('.cv-publications > li').count()==len(papers),f'{lang}: CV publication count')
                        check(page.locator('.award-list > li').count()==len(data['awards']),f'{lang}: CV awards retained')
                        check(page.locator('#home-link').get_attribute('href').endswith('?lang='+lang),f'{lang}: CV home link preserves language')
                        page.emulate_media(media='print')
                        check(page.locator('.site-header').is_hidden(),f'{lang}: CV print toolbar hidden')
                        check(page.locator('.cv-title-block').is_visible(),f'{lang}: CV print content visible')
                    page.close()
            if not args.inline:
                page=context.new_page()
                load(page,'en',prefix='test-prefix/')
                check(page.locator('.paper').count()==len(papers),'Project-subdirectory URL renders papers')
                check(page.locator('.profile-photo').evaluate('(e)=>e.naturalWidth>0'),'Project-subdirectory portrait path')
                page.close()
            check(not errors, 'No JavaScript runtime errors')
            if not args.inline:
                check(not resource_errors,'No failed HTTP responses in browser')
            browser.close()
    finally:
        server.shutdown()
        server.server_close()
    report={'mode':'inline-rendering' if args.inline else 'http-browser', 'checks_passed':len(passed),'responsive_cases':2*2*len(WIDTHS),'javascript_errors':errors,'failed_browser_responses':resource_errors if not args.inline else 'Not tested in inline mode','checks':passed}
    (OUT/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({k:v for k,v in report.items() if k!='checks'},ensure_ascii=False,indent=2))


if __name__ == '__main__':
    main()
