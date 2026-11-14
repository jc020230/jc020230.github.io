/* Vanilla JavaScript. No build step, package install, or external requests. */
(() => {
  "use strict";

  const data = window.SITE_DATA;
  const translations = window.SITE_I18N;
  if (!data?.site || !data?.profile || !data?.about || !translations) {
    const error = document.createElement("p");
    error.className = "noscript-message";
    error.textContent = "데이터 파일을 확인해주세요. Check assets/js/data.js and i18n.js for syntax errors or missing files.";
    document.body.prepend(error);
    return;
  }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const isCV = document.body.dataset.page === "cv";
  const supportedLanguages = ["ko", "en"];
  const storageKey = "academic-portfolio-language";
  const list = (value) => Array.isArray(value) ? value : [];
  const hasExamples = data.site.showDemoNotice || data.profile.example ||
    ["news", "publications", "projects", "education", "experience", "awards"].some(
      (key) => list(data[key]).some((item) => item.example)
    );
  const state = {
    language: initialLanguage(), query: "", year: "all", type: "all",
    selected: false, expandedNews: false, openPanels: new Set()
  };
  let observer;
  let toastTimer;

  function initialLanguage() {
    const explicit = new URLSearchParams(location.search).get("lang");
    if (supportedLanguages.includes(explicit)) return explicit;
    try {
      const saved = localStorage.getItem(storageKey);
      if (supportedLanguages.includes(saved)) return saved;
    } catch (_) { /* Private browsing and file:// may disallow storage. */ }
    return supportedLanguages.includes(data.site.defaultLanguage) ? data.site.defaultLanguage : "ko";
  }

  // All data values are escaped. Content in data.js is plain text, not HTML.
  function escapeHTML(value = "") {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]));
  }
  const e = escapeHTML;
  function text(value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") return String(value[state.language] ?? value.en ?? value.ko ?? "");
    return String(value);
  }
  const t = (key) => translations[state.language][key] ?? key;
  const htmlText = (value) => e(text(value));

  // Permit local relative paths and public web/mail links, not javascript: or data: URLs.
  function safeURL(value) {
    if (typeof value !== "string") return "";
    const url = value.trim();
    if (!url || /[\u0000-\u0020\u007f\\]/.test(url)) return "";
    if (/^https?:\/\//i.test(url)) {
      try { const parsed = new URL(url); return parsed.hostname && !parsed.username && !parsed.password ? url : ""; }
      catch (_) { return ""; }
    }
    if (/^mailto:[^@]+@[^@]+$/i.test(url)) return url;
    if (/^[a-z][a-z\d+.-]*:/i.test(url) || url.startsWith("//")) return "";
    if (url === "#") return "";
    return url;
  }
  function link(url, label, className = "text-link", extra = "") {
    const safe = safeURL(url);
    if (!safe) return "";
    const external = /^https?:/i.test(safe);
    return `<a class="${e(className)}" href="${e(safe)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}${extra ? ` ${extra}` : ""}>${label}</a>`;
  }
  const arrow = '<span aria-hidden="true">↗</span>';
  function cvURL() { return safeURL(data.profile.cvUrl) || `./cv.html?lang=${state.language}`; }
  function formatDate(value, full = false) {
    const raw = String(value ?? "");
    const monthOnly = /^\d{4}-\d{2}$/.test(raw);
    const date = new Date(`${monthOnly ? raw + "-01" : raw.slice(0, 10)}T12:00:00Z`);
    if (Number.isNaN(date.getTime())) return String(value ?? "");
    return new Intl.DateTimeFormat(state.language === "ko" ? "ko-KR" : "en-US", {
      year: "numeric", month: state.language === "ko" ? "2-digit" : "short",
      ...(full && !monthOnly ? { day: "2-digit" } : {}), timeZone: "UTC"
    }).format(date);
  }
  function sectionHeading(id, number, title, subtitle = "") {
    return `<div class="section-heading"><div><p class="eyebrow"><span>${number}</span> / ${e(t(title))}</p><h2 id="${id}-heading">${e(t(title))}</h2>${subtitle ? `<p class="section-description">${e(t(subtitle))}</p>` : ""}</div></div>`;
  }
  function resourceLinks(links) {
    return Object.entries(links || {}).map(([kind, url]) =>
      link(url, `${e(t(kind))} ${arrow}`, "resource-link")
    ).filter(Boolean).join("");
  }
  function authorHTML(authors) {
    return list(authors).map((author) => {
      if (typeof author === "string") return e(author);
      const name = e(text(author.name));
      return author.me ? `<strong class="author-me">${name}</strong>` : name;
    }).join(", ");
  }

  function renderChrome() {
    clearTimeout(toastTimer);
    if ($("#toast")) $("#toast").hidden = true;
    document.documentElement.lang = state.language;
    document.title = `${text(data.profile.name)} | ${isCV ? t("cvTitle") : text(data.site.title)}`;
    $('meta[name="description"]')?.setAttribute("content", text(data.site.description));
    $('meta[property="og:title"]')?.setAttribute("content", document.title);
    $('meta[property="og:description"]')?.setAttribute("content", text(data.site.description));
    $('meta[property="og:locale"]')?.setAttribute("content", state.language === "ko" ? "ko_KR" : "en_US");
    $('meta[name="robots"]')?.setAttribute("content", hasExamples ? "noindex, nofollow" : "index, follow");
    const demo = $("#demo-notice");
    demo.hidden = !hasExamples;
    demo.innerHTML = `<div class="demo-inner"><strong>${e(t("demo"))}</strong><span>${e(t("demoText"))}</span></div>`;
    $("#brand").innerHTML = `<span class="brand-mark">${e(data.profile.initials || "R")}</span><span class="brand-name">${htmlText(data.profile.name)}<small>${e(t("portfolio"))}</small></span>`;
    $("#brand").href = isCV ? `./index.html?lang=${state.language}` : "#top";
    $("#brand").setAttribute("aria-label", `${text(data.profile.name)} · ${t("home")}`);
    if (!isCV) {
      $("#primary-nav").innerHTML = ["about", "news", "publications", "projects", "experience", "contact", "cv"].map((id) =>
        `<a href="#${id}" data-nav="${id}">${e(t(id))}</a>`
      ).join("");
      $("#primary-nav").setAttribute("aria-label", t("navLabel"));
      $("#profile").setAttribute("aria-label", text(data.profile.name));
    } else {
      $("#home-link").href = `./index.html?lang=${state.language}`;
    }
    $$("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
    $$(".language-switch").forEach((node) => node.setAttribute("aria-label", t("language")));
    $$("[data-lang]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.lang === state.language));
    });
    const year = new Date().getFullYear();
    $("#site-footer").innerHTML = `<div><span>© ${year} ${htmlText(data.profile.name)}</span><span class="footer-motto">${e(t("footer"))}</span></div><div><span>${e(t("updated"))} ${e(formatDate(data.site.updated, true))}</span><a href="#top">${e(t("top"))} <span aria-hidden="true">↑</span></a></div>`;
  }

  function renderProfile() {
    const p = data.profile;
    const photo = safeURL(p.photo);
    $("#profile").innerHTML = `
      <div class="portrait-frame">${photo ? `<img class="profile-photo" src="${e(photo)}" alt="${htmlText(p.photoAlt)}" width="480" height="520">` : `<div class="portrait-monogram" aria-hidden="true">${e(p.initials || "R")}</div>`}<span class="portrait-corner" aria-hidden="true">01 / ${e(t("profileLabel"))}</span></div>
      <div class="profile-info"><p class="profile-name">${htmlText(p.name)}</p>${p.example ? `<span class="example-label">${e(t("exampleProfile"))}</span>` : ""}<p class="profile-name-secondary">${htmlText(p.nameSecondary)}</p><p class="profile-role">${htmlText(p.role)}</p><p class="profile-affiliation">${htmlText(p.department)}<br>${htmlText(p.institution)}<br>${htmlText(p.lab)}</p><p class="profile-location"><span aria-hidden="true">◦</span> ${htmlText(p.location)}</p></div>
      <div class="profile-links">${link(p.email ? `mailto:${p.email}` : "", e(p.email), "profile-email")}${list(p.links).map((item) => link(item.url, `${htmlText(item.label)} ${arrow}`, "social-link")).join("")}</div>
      ${link(cvURL(), `${e(t("cv"))}<span aria-hidden="true">↗</span>`, "button cv-link")}`;
    // Broken/removed photographs fall back to initials rather than a broken-image icon.
    const image = $(".profile-photo");
    image?.addEventListener("error", () => {
      const replacement = document.createElement("div");
      replacement.className = "portrait-monogram";
      replacement.textContent = p.initials || "R";
      replacement.setAttribute("aria-label", text(p.photoAlt));
      image.replaceWith(replacement);
    }, { once: true });
  }

  function renderAbout() {
    $("#about").innerHTML = `<p class="eyebrow"><span>01</span> / ${e(t("about"))}</p>
      <h1 id="about-heading">${htmlText(data.about.headline).replace(/\n/g, "<br>")}</h1>
      <div class="about-copy">${list(data.about.paragraphs).map((p) => `<p>${htmlText(p)}</p>`).join("")}</div>
      <section class="interest-block" id="interests" aria-labelledby="interests-heading"><h2 class="small-label" id="interests-heading">${e(t("interests"))}</h2><ul class="interest-list">${list(data.about.interests).map((item) => `<li>${htmlText(item)}</li>`).join("")}</ul></section>`;
  }

  function renderNews() {
    const news = [...list(data.news)].sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const visible = state.expandedNews ? news : news.slice(0, 3);
    $("#news").innerHTML = `${sectionHeading("news", "02", "news")}
      <ol class="news-list" id="news-items">${visible.map((item) => `<li><time datetime="${e(item.date)}">${e(formatDate(item.date))}</time><div><span class="news-category">${htmlText(item.category)}</span><p>${safeURL(item.url) ? link(item.url, `${htmlText(item.text)} ${arrow}`, "news-link") : htmlText(item.text)}</p></div></li>`).join("") || `<li class="empty-state">${e(t("noNews"))}</li>`}</ol>
      ${news.length > 3 ? `<button type="button" class="text-button news-toggle" data-action="toggle-news" aria-controls="news-items" aria-expanded="${state.expandedNews}">${e(t(state.expandedNews ? "newsLess" : "newsMore"))} <span aria-hidden="true">${state.expandedNews ? "↑" : "↓"}</span></button>` : ""}`;
  }

  function renderPublicationControls() {
    $("#publications-intro").innerHTML = sectionHeading("publications", "03", "publications", "pubDescription");
    const years = [...new Set(list(data.publications).map((p) => String(p.year)))].sort((a, b) => Number(b) - Number(a));
    $("#pub-year").innerHTML = `<option value="all">${e(t("allYears"))}</option>${years.map((year) => `<option value="${e(year)}">${e(year)}</option>`).join("")}`;
    $("#pub-type").innerHTML = `<option value="all">${e(t("allTypes"))}</option>${["conference", "journal", "preprint"].map((type) => `<option value="${type}">${e(t(type))}</option>`).join("")}`;
    $("#pub-year").value = state.year;
    $("#pub-type").value = state.type;
    $("#pub-search").value = state.query;
    $("#pub-search").placeholder = t("searchPlaceholder");
    $("#pub-selected").checked = state.selected;
  }

  function filteredPublications() {
    const normalize = (value) => String(value).normalize("NFKC").toLocaleLowerCase();
    const terms = normalize(state.query).trim().split(/\s+/).filter(Boolean);
    const searchable = (value) => {
      if (typeof value === "string" || typeof value === "number") return String(value);
      if (Array.isArray(value)) return value.map(searchable).join(" ");
      if (value && typeof value === "object") return Object.values(value).map(searchable).join(" ");
      return "";
    };
    return list(data.publications).filter((p) => {
      // Search both languages, even when the displayed language is different.
      const searchText = normalize(searchable([p.title, list(p.authors).map((a) => typeof a === "string" ? a : a.name), p.tags, p.venue, p.year, p.abstract]));
      return terms.every((term) => searchText.includes(term)) && (state.year === "all" || String(p.year) === state.year)
        && (state.type === "all" || p.type === state.type) && (!state.selected || p.selected);
    }).sort((a, b) => Number(b.year) - Number(a.year));
  }

  function paperHTML(p, compact = false) {
    const abstractId = `${p.id}-abstract`;
    const bibId = `${p.id}-bibtex`;
    const paperURL = safeURL(p.links?.pdf) || safeURL(p.links?.paper);
    const title = paperURL ? link(paperURL, htmlText(p.title), "paper-title-link") : htmlText(p.title);
    const buttons = [];
    if (text(p.abstract)) buttons.push(`<button type="button" class="resource-link" data-action="toggle-panel" data-panel="${e(abstractId)}" aria-controls="${e(abstractId)}" aria-expanded="${state.openPanels.has(abstractId)}">${e(t("abstract"))}</button>`);
    if (p.bibtex) buttons.push(`<button type="button" class="resource-link" data-action="toggle-panel" data-panel="${e(bibId)}" aria-controls="${e(bibId)}" aria-expanded="${state.openPanels.has(bibId)}">BibTeX</button>`);
    return `<article class="paper${compact ? " paper-compact" : ""}" data-paper-id="${e(p.id)}">
      <div class="paper-meta"><span class="type-label">${e(t(p.type))}</span>${p.example ? `<span class="example-label">${e(t("example"))}</span>` : ""}${p.selected ? `<span class="selected-label"><span aria-hidden="true">✦</span> ${e(t("featured"))}</span>` : ""}${compact ? `<span>${e(p.year)}</span>` : ""}</div>
      <h3 class="paper-title">${title}</h3><p class="paper-authors">${authorHTML(p.authors)}</p>
      <p class="paper-venue">${htmlText(p.venue)}${text(p.note) ? `<span class="paper-note">${htmlText(p.note)}</span>` : ""}</p>
      ${!compact && list(p.tags).length ? `<div class="paper-tags">${p.tags.map((tag) => `<span>${htmlText(tag)}</span>`).join("")}</div>` : ""}
      <div class="paper-actions">${resourceLinks(p.links)}${compact ? "" : buttons.join("")}</div>
      ${!compact && text(p.abstract) ? `<div class="publication-panel abstract-panel" id="${e(abstractId)}"${state.openPanels.has(abstractId) ? "" : " hidden"}><p>${htmlText(p.abstract)}</p></div>` : ""}
      ${!compact && p.bibtex ? `<div class="publication-panel bib-panel" id="${e(bibId)}"${state.openPanels.has(bibId) ? "" : " hidden"}><div class="bib-panel-heading"><span>BibTeX</span><button type="button" class="text-button" data-action="copy-bibtex" data-id="${e(p.id)}">${e(t("copy"))}</button></div><pre tabindex="0"><code>${e(p.bibtex)}</code></pre></div>` : ""}
    </article>`;
  }

  function renderPublications() {
    const papers = filteredPublications();
    $("#pub-count").textContent = `${papers.length} ${t("of")} ${list(data.publications).length} ${t("result")}`;
    if (!papers.length) {
      $("#publication-list").innerHTML = `<div class="empty-state"><p>${e(t("noResults"))}</p><button class="text-button" type="button" data-action="reset-filters">${e(t("reset"))} ↗</button></div>`;
      return;
    }
    const years = [...new Set(papers.map((p) => p.year))];
    $("#publication-list").innerHTML = years.map((year) => `<div class="publication-year-group"><h3 class="year-heading">${e(year)}<span aria-hidden="true"></span></h3><ol class="paper-list">${papers.filter((p) => p.year === year).map((p) => `<li>${paperHTML(p)}</li>`).join("")}</ol></div>`).join("");
  }

  function renderProjects() {
    $("#projects").innerHTML = `${sectionHeading("projects", "04", "projects", "projectsDescription")}
      <div class="project-grid">${list(data.projects).map((p) => `<article class="project-card"><div class="project-top"><span class="project-number">${e(p.number)}</span><span class="project-category">${htmlText(p.category)}</span></div><h3>${htmlText(p.title)}</h3><p>${htmlText(p.description)}</p><div class="project-tags">${list(p.tags).map((tag) => `<span>${htmlText(tag)}</span>`).join("")}</div><div class="project-bottom"><span class="project-status">${htmlText(p.status)}</span><div>${resourceLinks(p.links)}</div></div></article>`).join("") || `<p class="empty-state">${e(t("noProjects"))}</p>`}</div>`;
  }
  function timeline(items, level = 4) {
    return `<ol class="timeline">${list(items).map((item) => `<li><p class="timeline-period">${htmlText(item.period)}</p><div><h${level}>${htmlText(item.title)}</h${level}><p class="timeline-institution">${htmlText(item.institution)}</p><p class="timeline-description">${htmlText(item.description)}</p></div></li>`).join("") || `<li>${e(t("noEntries"))}</li>`}</ol>`;
  }
  function awardList(level = 4) {
    return `<ol class="award-list">${list(data.awards).map((item) => `<li><span>${e(item.year)}</span><div><h${level}>${htmlText(item.title)}</h${level}><p>${htmlText(item.organization)}</p>${safeURL(item.url) ? `<p>${link(item.url, `${e(state.language === "ko" ? "상장 보기" : "View certificate")} ${arrow}`, "text-link")}</p>` : ""}</div></li>`).join("") || `<li>${e(t("noEntries"))}</li>`}</ol>`;
  }
  function renderExperience() {
    $("#experience").innerHTML = `${sectionHeading("experience", "05", "experience")}
      <div class="experience-block"><h3 class="subsection-heading">${e(t("education"))}</h3>${timeline(data.education)}</div>
      <div class="experience-block"><h3 class="subsection-heading">${e(t("researchExperience"))}</h3>${timeline(data.experience)}</div>
      <section class="experience-block" id="awards" aria-labelledby="awards-heading"><h3 class="subsection-heading" id="awards-heading">${e(t("awards"))}</h3>${awardList()}</section>`;
  }
  function renderCVLink() {
    $("#cv").innerHTML = `${sectionHeading("cv", "07", "cvTitle")}<p class="section-description">${e(t("cvDescription"))}</p><div class="contact-actions">${link(`./cv.html?lang=${state.language}`, `${e(t("cv"))} ${arrow}`, "button")}${safeURL(data.profile.cvUrl) ? link(data.profile.cvUrl, `${e(t("downloadCV"))} ${arrow}`, "text-link") : ""}</div>`;
  }
  function renderContact() {
    $("#contact").innerHTML = `<p class="eyebrow"><span>06</span> / ${e(t("contact"))}</p><h2 id="contact-heading">${htmlText(data.contact?.headline)}</h2><p>${htmlText(data.contact?.text)}</p><div class="contact-actions">${link(data.profile.email ? `mailto:${data.profile.email}` : "", `${e(t("sendEmail"))} ${arrow}`, "button button-primary")}${data.profile.email ? `<button type="button" class="text-button" data-action="copy-email">${e(t("copyEmail"))}</button>` : ""}</div><div class="contact-links">${list(data.profile.links).map((item) => link(item.url, `${htmlText(item.label)} ${arrow}`)).join("")}</div>`;
  }

  function renderCV() {
    const p = data.profile;
    $("#cv-content").innerHTML = `<div class="cv-title-block"><div><p class="eyebrow">${e(t("cvTitle"))}</p><h1>${htmlText(p.name)}</h1><p class="cv-secondary-name">${htmlText(p.nameSecondary)}</p></div><div class="cv-contact"><p>${htmlText(p.role)}</p><p>${htmlText(p.department)} · ${htmlText(p.institution)}</p><p>${htmlText(p.lab)}</p>${link(p.email ? `mailto:${p.email}` : "", e(p.email))}<p>${htmlText(p.location)}</p></div></div>
      <div class="cv-social">${list(p.links).map((item) => link(item.url, htmlText(item.label))).join("")}</div>
      <section class="cv-section"><h2>${e(t("interests"))}</h2><p>${list(data.about.interests).map(htmlText).join(" · ")}</p></section>
      <section class="cv-section"><h2>${e(t("education"))}</h2>${timeline(data.education, 3)}</section>
      <section class="cv-section"><h2>${e(t("researchExperience"))}</h2>${timeline(data.experience, 3)}</section>
      <section class="cv-section"><h2>${e(t("publications"))}</h2><ol class="cv-publications">${[...list(data.publications)].sort((a, b) => Number(b.year) - Number(a.year)).map((paper) => `<li>${paperHTML(paper, true)}</li>`).join("") || `<li>${e(t("noEntries"))}</li>`}</ol></section>
      <section class="cv-section"><h2>${e(t("projects"))}</h2>${list(data.projects).map((item) => `<article class="cv-project"><h3>${htmlText(item.title)}</h3><p>${htmlText(item.description)}</p><div class="paper-actions">${resourceLinks(item.links)}</div></article>`).join("") || `<p>${e(t("noProjects"))}</p>`}</section>
      <section class="cv-section"><h2>${e(t("awards"))}</h2>${awardList(3)}</section>
      <p class="cv-update">${e(t("updated"))} ${e(formatDate(data.site.updated, true))}</p>`;
  }

  function observeSections() {
    if (observer) observer.disconnect();
    if (!("IntersectionObserver" in window)) return;
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        $$("[data-nav]").forEach((node) => {
          if (node.dataset.nav === entry.target.id) node.setAttribute("aria-current", "location");
          else node.removeAttribute("aria-current");
        });
      }
    }, { rootMargin: "-10% 0px -65% 0px", threshold: 0 });
    $$(".main-column > section").forEach((section) => observer.observe(section));
  }
  function setMenu(open) {
    const button = $("#menu-toggle");
    if (!button) return;
    button.setAttribute("aria-expanded", String(open));
    $(".sr-only", button).textContent = t(open ? "closeMenu" : "menu");
    $("#primary-nav").classList.toggle("is-open", open);
  }
  function render() {
    renderChrome();
    if (isCV) renderCV();
    else {
      renderProfile(); renderAbout(); renderNews(); renderPublicationControls();
      renderPublications(); renderProjects(); renderExperience(); renderContact(); renderCVLink();
      setMenu(false); observeSections();
    }
  }

  function changeLanguage(language) {
    if (!supportedLanguages.includes(language)) return;
    state.language = language;
    try { localStorage.setItem(storageKey, language); } catch (_) { /* Preference saving is optional. */ }
    try {
      const url = new URL(location.href);
      url.searchParams.set("lang", language);
      history.replaceState(null, "", url.href);
    } catch (_) { /* file:// restrictions do not prevent switching language. */ }
    render();
  }
  function showToast(message) {
    const toast = $("#toast");
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 4000);
  }
  async function copyText(value) {
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        copied = true;
      }
    } catch (_) { /* Fall through to a local-file compatible fallback. */ }
    if (!copied) {
      const previousFocus = document.activeElement;
      const area = document.createElement("textarea");
      area.value = value;
      area.className = "clipboard-helper";
      area.setAttribute("readonly", "");
      document.body.append(area);
      area.select();
      try { copied = document.execCommand("copy"); } catch (_) { copied = false; }
      area.remove();
      if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
    }
    showToast(t(copied ? "copied" : "copyFailed"));
  }

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const langButton = event.target.closest("[data-lang]");
    if (langButton) { changeLanguage(langButton.dataset.lang); return; }
    if (event.target.closest("#menu-toggle")) {
      setMenu($("#menu-toggle").getAttribute("aria-expanded") !== "true"); return;
    }
    if (event.target.closest("[data-nav]")) setMenu(false);
    else if (!event.target.closest(".site-header")) setMenu(false);
    if (event.target.closest("#print-cv")) { window.print(); return; }
    const control = event.target.closest("[data-action]");
    if (!control) return;
    switch (control.dataset.action) {
      case "toggle-news":
        state.expandedNews = !state.expandedNews;
        renderNews();
        $('[data-action="toggle-news"]')?.focus({ preventScroll: true });
        break;
      case "toggle-panel": {
        const id = control.dataset.panel;
        const panel = document.getElementById(id);
        if (!panel) break;
        const open = !state.openPanels.has(id);
        if (open) state.openPanels.add(id); else state.openPanels.delete(id);
        panel.hidden = !open;
        control.setAttribute("aria-expanded", String(open));
        break;
      }
      case "copy-bibtex": {
        const paper = list(data.publications).find((p) => p.id === control.dataset.id);
        if (paper?.bibtex) void copyText(paper.bibtex);
        break;
      }
      case "copy-email": void copyText(data.profile.email || ""); break;
      case "reset-filters":
        state.query = ""; state.year = "all"; state.type = "all"; state.selected = false;
        renderPublicationControls(); renderPublications(); $("#pub-search").focus();
        break;
      default: break;
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && $("#menu-toggle")?.getAttribute("aria-expanded") === "true") {
      setMenu(false); $("#menu-toggle").focus();
    }
  });
  if (!isCV) {
    window.matchMedia("(max-width: 1050px)").addEventListener("change", () => setMenu(false));
    $("#publication-filters").addEventListener("submit", (event) => event.preventDefault());
    $("#pub-search").addEventListener("input", (event) => { state.query = event.target.value; renderPublications(); });
    $("#pub-year").addEventListener("change", (event) => { state.year = event.target.value; renderPublications(); });
    $("#pub-type").addEventListener("change", (event) => { state.type = event.target.value; renderPublications(); });
    $("#pub-selected").addEventListener("change", (event) => { state.selected = event.target.checked; renderPublications(); });
  }
  render();
})();
