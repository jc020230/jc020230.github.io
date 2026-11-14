#!/usr/bin/env python3
"""Optional real-browser regression checks. pip install playwright; playwright install chromium.

Run: python tools/browser_check.py [--axe /path/to/axe.min.js]
Starts a loopback server, tests actual HTTP URLs, saves evidence in .preview/, then stops.
No browser or test dependency is used by the published site.
"""
import argparse
from functools import partial
from http.server import ThreadingHTTPServer
import json
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright
from serve import PreviewHandler

ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = ROOT / ".preview"


class Handler(PreviewHandler):
    def translate_path(self, path):
        # Exercise the same assets under a GitHub project-site style prefix.
        if path.startswith("/researcher-site/"):
            path = path[len("/researcher-site"):]
        return super().translate_path(path)

    def log_message(self, *args):
        pass


def run(base, axe=None):
    passed, errors, failed_http, console_errors = [], [], [], []

    def check(condition, label):
        if not condition:
            raise AssertionError(label)
        passed.append(label)

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 1000})
        page = context.new_page()
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        page.on("response", lambda r: failed_http.append(f"{r.status} {r.url}") if r.status >= 400 else None)
        page.goto(base)
        data = page.evaluate("window.SITE_DATA")
        papers = data["publications"]
        count = lambda: page.locator("#publication-list .paper").count()
        check(page.locator("html").get_attribute("lang") == data["site"]["defaultLanguage"], "Default language")
        check(count() == len(papers), "All publications render")
        check(page.locator('a[href="#"]').count() == 0, "No dummy links")
        check(page.locator("#demo-notice").is_hidden(), "Real profile has no demo notice")
        check(page.locator('meta[name="robots"]').get_attribute("content") == "index, follow", "Real profile indexing metadata")
        check(page.evaluate("[...document.querySelectorAll('a[href^=\"#\"]')].every(a => document.getElementById(a.hash.slice(1)))"), "All section links resolve")
        check(page.locator('#news-items time[datetime="2026-10"]').count() > 0, "Month precision preserved in HTML")
        check(page.locator('#news-items time[datetime="2026-11-06"]').count() == 1, "Confirmed seminar date preserved")
        check(page.locator("#news-items").inner_text().find("Invalid Date") == -1, "Month date renders")
        page.keyboard.press("Tab")
        check(page.locator(".skip-link").evaluate("e => e === document.activeElement"), "Keyboard skip link")
        page.keyboard.press("Enter")
        check(page.locator("#main-content").evaluate("e => e === document.activeElement"), "Skip link moves focus")
        page.locator('[data-lang="en"]').click()
        check(page.locator("html").get_attribute("lang") == "en", "English switching")
        check("lang=en" in page.url, "Language URL")
        check("?lang=en" in page.locator(".cv-link").get_attribute("href"), "CV preserves language")
        check("Academic Portfolio" in page.title(), "Localized title")
        check(page.locator('meta[property="og:title"]').get_attribute("content") == page.title(), "Localized Open Graph")
        page.reload()
        check(page.locator("html").get_attribute("lang") == "en", "Reload retains language")
        page.goto(base)
        check(page.locator("html").get_attribute("lang") == "en", "Stored preference")
        page.goto(base + "?lang=ko")
        check(page.locator("html").get_attribute("lang") == "ko", "URL overrides saved preference")
        page.locator('[data-lang="en"]').click()
        if papers:
            year = str(max(p["year"] for p in papers))
            page.locator("#pub-year").select_option(year)
            check(count() == sum(str(p["year"]) == year for p in papers), "Year filter")
            page.locator("#pub-type").select_option("journal")
            check(count() == sum(str(p["year"]) == year and p["type"] == "journal" for p in papers), "Combined year/type filter")
            page.locator("#pub-search").fill("no-match-zzzz-923")
            check(count() == 0, "Empty search")
            page.locator('[data-action="reset-filters"]').click()
            check(count() == len(papers), "Reset all filters")
            check(page.locator("#pub-search").evaluate("e => e === document.activeElement"), "Reset restores focus")
            page.locator("#pub-selected").check()
            check(count() == sum(p["selected"] for p in papers), "Selected publication filter")
            page.locator("#pub-selected").uncheck()
            page.locator("#pub-type").select_option("journal")
            check(count() == sum(p["type"] == "journal" for p in papers), "Journal filter")
            page.locator("#pub-type").select_option("all")
            for query in ["ALS", "Audio", "Jungchan", "2026 speech", "Question Answering"]:
                page.locator("#pub-search").fill(query)
                check(count() > 0, f"Bilingual title/author/keyword search: {query}")
            page.locator("#pub-search").fill("true")
            check(count() == 0, "Search excludes data flags")
            page.locator("#pub-search").fill("")
            page.locator('[data-panel$="-bibtex"]').first.click()
            page.locator('[data-action="copy-bibtex"]').first.click()
            page.locator("#toast").wait_for(state="visible")
            check(page.locator("#toast").is_visible(), "BibTeX copy feedback")
        check(page.locator("#news-items > li").count() == min(data["site"]["newsLimit"], len(data["news"])), "News starts collapsed")
        page.locator('[data-action="toggle-news"]').click()
        check(page.locator("#news-items > li").count() == len(data["news"]), "News expands")
        joint_news = page.locator("#news-items > li").filter(has_text="DLmath Lab")
        check(joint_news.locator('p a[href="https://ikwak2.github.io/"]').inner_text() == "CAU ET Lab", "News links CAU ET Lab by name")
        check(joint_news.locator('p a[href="https://dlmath-lab.github.io/"]').inner_text() == "DLmath Lab", "News links DLmath Lab separately")
        check(joint_news.locator('p').inner_text() != joint_news.locator('p a').first.inner_text(), "News body is not a paragraph-wide link")
        check(page.locator(".challenge-row").count() == len(data["awards"]), "All challenge results visible")
        check("58.33%" in page.locator("#challenges").inner_text() and "57.30%" in page.locator("#challenges").inner_text(), "DCASE track scores visible")
        check("4th" in page.locator("#challenges").inner_text(), "SAND placing visible")
        page.locator('[data-action="toggle-news"]').click()
        page.locator('[data-action="copy-email"]').click()
        page.locator("#toast").wait_for(state="visible")
        check(page.locator("#toast").is_visible(), "Email copy feedback")
        page.evaluate("document.fonts.ready")
        check(page.evaluate("[...document.fonts].some(f => f.family === 'Pretendard' && f.status === 'loaded')"), "Self-hosted Pretendard loads")
        photos = [photo for event in data["gallery"] for photo in event["images"]]
        check(page.locator(".gallery-item").count() == len(data["gallery"]), "All photo events visible")
        gallery_button = page.locator(".gallery-image").first
        gallery_button.click()
        check(page.locator("#photo-dialog").is_visible(), "Photo viewer opens")
        check(page.locator('[data-action="close-photo"]').evaluate("e => e === document.activeElement"), "Photo viewer receives keyboard focus")
        for i, photo in enumerate(photos):
            page.wait_for_function("document.querySelector('#photo-dialog-image').complete && document.querySelector('#photo-dialog-image').naturalWidth > 0")
            check(page.locator("#photo-dialog-image").get_attribute("src") == photo["src"], f"Photo {i + 1} loads in order")
            check(page.locator("#photo-dialog-image").get_attribute("alt") == photo["alt"]["en"], f"Photo {i + 1} localized caption")
            page.keyboard.press("ArrowRight")
        check(page.locator("#photo-dialog-count").inner_text() == f"1 / {len(photos)}", "Photo navigation wraps")
        page.locator('[data-action="previous-photo"]').click()
        check(page.locator("#photo-dialog-count").inner_text() == f"{len(photos)} / {len(photos)}", "Previous photo button")
        page.locator('[data-action="next-photo"]').click()
        check(page.locator("#photo-dialog-count").inner_text() == f"1 / {len(photos)}", "Next photo button")
        page.keyboard.press("Escape")
        check(page.locator("#photo-dialog").is_hidden() and gallery_button.evaluate("e => e === document.activeElement"), "Escape closes viewer and restores focus")
        page.set_viewport_size({"width": 390, "height": 844})
        menu = page.locator("#menu-toggle")
        menu.click()
        check(menu.get_attribute("aria-expanded") == "true", "Mobile menu opens")
        page.keyboard.press("Escape")
        check(menu.get_attribute("aria-expanded") == "false" and menu.evaluate("e => e === document.activeElement"), "Escape closes menu and restores focus")
        menu.click()
        page.locator('[data-nav="contact"]').click()
        check(menu.get_attribute("aria-expanded") == "false", "Navigation closes mobile menu")
        menu.click()
        page.set_viewport_size({"width": 1440, "height": 1000})
        page.set_viewport_size({"width": 390, "height": 844})
        page.wait_for_function("document.querySelector('#menu-toggle').getAttribute('aria-expanded') === 'false'")
        check(True, "Resize resets mobile menu")
        for prefix in ["", "researcher-site/"]:
            for filename in ["", "cv.html"]:
                for lang in ["ko", "en"]:
                    page.goto(f"{base}{prefix}{filename}?lang={lang}")
                    for width in [320, 360, 390, 768, 1024, 1051, 1280, 1440]:
                        page.set_viewport_size({"width": width, "height": 1000})
                        check(page.evaluate("document.documentElement.scrollWidth <= innerWidth"), f"No overflow: {prefix}{filename or 'home'} {lang} {width}px")
                    if not prefix:
                        page.evaluate("document.fonts.ready")
                        page.screenshot(path=str(ARTIFACTS / f"{filename or 'home'}-{lang}-desktop.png"), full_page=True)
                        page.set_viewport_size({"width": 390, "height": 844})
                        page.screenshot(path=str(ARTIFACTS / f"{filename or 'home'}-{lang}-mobile.png"), full_page=True)
                        if axe:
                            page.add_script_tag(path=str(axe))
                            results = page.evaluate("async () => (await axe.run(document, {runOnly: {type:'tag', values:['wcag2a','wcag2aa','wcag21aa']}})).violations")
                            check(not results, f"axe {filename or 'home'} {lang}: {json.dumps(results, ensure_ascii=False)}")
                        if not filename:
                            page.locator(".gallery-image").first.click()
                            check(page.locator("#photo-dialog-image").get_attribute("alt") == photos[0]["alt"][lang], f"Mobile photo caption {lang}")
                            check(page.evaluate("document.documentElement.scrollWidth <= innerWidth"), f"Mobile photo viewer no overflow {lang}")
                            if axe:
                                results = page.evaluate("async () => (await axe.run(document, {runOnly: {type:'tag', values:['wcag2a','wcag2aa','wcag21aa']}})).violations")
                                check(not results, f"axe photo viewer {lang}: {json.dumps(results, ensure_ascii=False)}")
                            page.locator('[data-action="close-photo"]').click()
        page.goto(base + "cv.html?lang=en")
        check(page.locator(".paper").count() == len(papers), "CV contains all publications")
        check(page.locator('.award-list a[href="https://dcase.community/challenge2026/task-audio-dependent-question-answering-results"]').inner_text().startswith("Official results"), "CV award link uses correct resource label")
        page.evaluate("window.print = () => window.didPrint = true")
        page.locator("#print-cv").click()
        check(page.evaluate("window.didPrint === true"), "Print button")
        page.emulate_media(media="print")
        check(page.locator(".site-header").is_hidden(), "Print hides toolbar")
        check(page.locator("#demo-notice").is_hidden(), "Real CV prints without demo notice")
        page.pdf(path=str(ARTIFACTS / "cv-en.pdf"), format="A4")
        check((ARTIFACTS / "cv-en.pdf").stat().st_size > 1000, "PDF generated")
        page.emulate_media(media="screen", reduced_motion="reduce")
        check(page.evaluate("getComputedStyle(document.documentElement).scrollBehavior") == "auto", "Reduced motion")
        # Check all shipped assets through root and nested HTTP routes.
        for prefix in ["", "researcher-site/"]:
            for name in ["index.html", "cv.html", "assets/css/style.css", "assets/js/data.js", "assets/js/i18n.js", "assets/js/app.js", "assets/images/favicon.svg", ".nojekyll", "robots.txt", "sitemap.xml", "assets/images/profile.png", "assets/files/korean-statistical-society-2026-als-abstract.pdf", "assets/files/dcase-2026-task5-judges-award.webp", "assets/fonts/PretendardVariable.woff2", "assets/fonts/OFL.txt", *[photo["src"].removeprefix("./") for photo in photos]]:
                response = context.request.get(base + prefix + name)
                check(response.status == 200, f"HTTP asset: {prefix}{name}")
                check("no-store" in response.headers.get("cache-control", ""), f"Preview cache header: {prefix}{name}")
        check(not errors, f"No uncaught JavaScript errors: {errors}")
        check(not failed_http, f"No failed page resources: {failed_http}")
        check(not console_errors, f"No browser console errors: {console_errors}")
        # Fault fixtures affect this isolated browser response, never source files.
        original = (ROOT / "assets/js/data.js").read_text()
        def fixture(extra):
            ctx = browser.new_context()
            p = ctx.new_page()
            p.on("pageerror", lambda error: errors.append(str(error)))
            p.route("**/assets/js/data.js", lambda route: route.fulfill(content_type="text/javascript", body=original + "\n" + extra))
            return ctx, p
        ctx, p = fixture("['news','publications','projects','education','experience','awards'].forEach(k => SITE_DATA[k] = []);")
        for url in [base, base + "cv.html"]:
            p.goto(url)
            check("등록된" in p.locator("main").inner_text(), "Empty collections render gracefully: " + url)
        ctx.close()
        ctx, p = fixture("SITE_DATA.profile.photo=''; SITE_DATA.profile.name = '<img src=x onerror=alert(1)>'; SITE_DATA.profile.links=[{label:'unsafe',url:'javascript:alert(1)'}]; SITE_DATA.publications[0].links={pdf:'./assets/files/README.md',code:'https://github.com/jc020230',project:'#projects'};")
        p.goto(base)
        check(p.locator("#profile img").count() == 0 and "<img" in p.locator(".profile-name").inner_text(), "HTML escaped")
        check(p.locator('a[href^="javascript:"]').count() == 0, "Unsafe URL rejected")
        check(p.locator('.paper-actions a[href="./assets/files/README.md"]').count() == 1, "PDF link supported")
        check(p.locator('.paper-actions a[href="#projects"]').count() == 1, "Project link supported")
        check(p.locator('.paper-actions a[href="https://github.com/jc020230"]').get_attribute("rel") == "noopener noreferrer", "External Code link protected")
        ctx.close()
        ctx, p = fixture("SITE_DATA.site.showDemoNotice=false; SITE_DATA.profile.example=true;")
        p.goto(base)
        check(p.locator("#demo-notice").is_visible(), "Record flags prevent accidentally hiding examples")
        ctx.close()
        ctx = browser.new_context()
        p = ctx.new_page()
        p.add_init_script("Storage.prototype.getItem = () => {throw Error('disabled')}; Storage.prototype.setItem = () => {throw Error('disabled')};")
        p.goto(base + "?lang=invalid")
        p.locator('[data-lang="en"]').click()
        check(p.locator("html").get_attribute("lang") == "en", "Language switching with blocked storage")
        ctx.close()
        check(not errors, f"No JavaScript errors including fault fixtures: {errors}")
        browser.close()
    (ARTIFACTS / "browser-results.json").write_text(json.dumps({"passed": len(passed), "checks": passed, "errors": errors, "console_errors": console_errors, "failed_http": failed_http}, ensure_ascii=False, indent=2))
    print(f"PASS: {len(passed)} browser checks; evidence: {ARTIFACTS}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--axe", type=Path)
    args = parser.parse_args()
    ARTIFACTS.mkdir(exist_ok=True)
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(Handler, directory=str(ROOT)))
    Thread(target=server.serve_forever, daemon=True).start()
    try:
        run(f"http://127.0.0.1:{server.server_port}/", args.axe)
    finally:
        server.shutdown()
        server.server_close()
