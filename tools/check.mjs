/** Optional data and file checks. Run: node tools/check.mjs (no npm install). */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warnings = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const arr = (value) => Array.isArray(value) ? value : [];
const release = process.argv.includes("--release");
const context = { window: {} };

try {
  for (const name of ["data.js", "i18n.js"]) {
    vm.runInNewContext(fs.readFileSync(path.join(root, "assets/js", name), "utf8"), context, { timeout: 1000 });
  }
  new vm.Script(fs.readFileSync(path.join(root, "assets/js/app.js"), "utf8"));
} catch (error) {
  console.error(`FAIL: JavaScript syntax or file error.\n${error.message}`);
  process.exit(1);
}
const data = context.window.SITE_DATA;
const translations = context.window.SITE_I18N;
if (!data?.site || !data?.profile || !data?.about || !translations?.ko || !translations?.en) {
  console.error("FAIL: Required site/profile/about/translation data is missing.");
  process.exit(1);
}

function localized(value, location) {
  assert(typeof value === "string" || (typeof value === "object" && value !== null), `${location}: provide a string or {ko, en}.`);
  if (value && typeof value === "object") {
    for (const lang of ["ko", "en"]) assert(typeof value[lang] === "string", `${location}.${lang}: missing translation string.`);
  }
}
function checkURL(value, location) {
  if (!value) return;
  if (typeof value !== "string") { errors.push(`${location}: URL must be a string.`); return; }
  if (/[\u0000-\u0020\u007f\\]/.test(value)) { errors.push(`${location}: avoid spaces, control characters, and backslashes in URLs.`); return; }
  if (/^https?:\/\//i.test(value)) {
    try { const url = new URL(value); assert(Boolean(url.hostname) && !url.username && !url.password, `${location}: invalid public URL.`); }
    catch { errors.push(`${location}: invalid URL.`); }
    return;
  }
  if (/^mailto:[^@]+@[^@]+$/i.test(value)) return;
  if (/^[a-z][a-z\d+.-]*:/i.test(value) || value.startsWith("//")) { errors.push(`${location}: unsupported URL scheme.`); return; }
  if (value.startsWith("#")) { assert(value !== "#", `${location}: replace empty # link with an empty string.`); return; }
  if (value.startsWith("/")) warnings.push(`${location}: root-relative path may fail on a project site; use ./assets/... instead.`);
  let filename;
  try { filename = decodeURIComponent(value.split(/[?#]/)[0]); }
  catch { errors.push(`${location}: invalid URL encoding.`); return; }
  const fullPath = path.resolve(root, filename.replace(/^\//, ""));
  assert(fullPath.startsWith(root + path.sep), `${location}: file must be inside the website folder.`);
  assert(fs.existsSync(fullPath), `${location}: local file not found: ${filename}`);
}

assert(["ko", "en"].includes(data.site.defaultLanguage), "site.defaultLanguage must be ko or en.");
assert(typeof data.site.showDemoNotice === "boolean", "site.showDemoNotice must be true or false.");
assert(/^\d{4}-\d{2}-\d{2}$/.test(data.site.updated), "site.updated must use YYYY-MM-DD.");
function validDate(value) {
  const date = new Date(`${value}T12:00:00Z`);
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
assert(validDate(data.site.updated), "site.updated must be a real calendar date.");
checkURL(data.site.url, "site.url");
assert(/^https:\/\/.+\/$/.test(data.site.url || ""), "site.url must be an HTTPS URL ending in /.");
assert(!data.profile.email || /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.profile.email), "profile.email must be blank or a valid email address.");
const sampleCount = Number(Boolean(data.profile.example)) + ["news", "publications", "projects", "education", "experience", "awards"].reduce((n, key) => n + arr(data[key]).filter((item) => item.example).length, 0);
if (sampleCount) warnings.push(`${sampleCount} entries are explicitly marked example: true.`);
if (release) {
  assert(!data.site.showDemoNotice && sampleCount === 0, "Release: replace or remove example content, then clear example flags and site.showDemoNotice.");
  assert(!/example\.com|예시대학교|김서윤|Seoyun Kim|Fictional|가상 논문|가상 수상|예시 학력|예시 경력/i.test(JSON.stringify(data)), "Release: sample text remains in data.js; flags alone do not replace fictional records.");
}
if (data.site.showDemoNotice) warnings.push("Demo notice is ON. Replace fictional content before publishing your real profile.");
for (const key of ["title", "description"]) localized(data.site[key], `site.${key}`);
for (const key of ["name", "nameSecondary", "role", "department", "institution", "lab", "location", "photoAlt"]) localized(data.profile[key], `profile.${key}`);
checkURL(data.profile.photo, "profile.photo");
checkURL(data.profile.cvUrl, "profile.cvUrl");
arr(data.profile.links).forEach((item, i) => { localized(item.label, `profile.links[${i}].label`); checkURL(item.url, `profile.links[${i}].url`); });
localized(data.about.headline, "about.headline");
for (const key of ["paragraphs", "interests"]) arr(data.about[key]).forEach((item, i) => localized(item, `about.${key}[${i}]`));
for (const name of ["news", "publications", "projects", "education", "experience", "awards"]) assert(Array.isArray(data[name]), `${name} must be an array (use [] for no entries).`);
const ids = new Set();
arr(data.publications).forEach((paper, i) => {
  const at = `publications[${i}]`;
  assert(typeof paper.id === "string" && /^[a-z0-9][a-z0-9-]*$/.test(paper.id), `${at}.id: use lowercase letters, numbers, and hyphens.`);
  assert(!ids.has(paper.id), `${at}.id: duplicate ID "${paper.id}".`);
  ids.add(paper.id);
  assert(Number.isInteger(paper.year) && paper.year >= 1900 && paper.year <= 2200, `${at}.year must be a numeric year.`);
  assert(["conference", "journal", "preprint"].includes(paper.type), `${at}.type is not supported.`);
  assert(typeof paper.selected === "boolean", `${at}.selected must be true or false.`);
  assert(Array.isArray(paper.authors) && paper.authors.length > 0, `${at}.authors: provide at least one author.`);
  arr(paper.authors).forEach((author, j) => localized(typeof author === "string" ? author : author?.name, `${at}.authors[${j}]`));
  assert(!paper.bibtex || typeof paper.bibtex === "string", `${at}.bibtex must be a string.`);
  for (const key of ["title", "venue", "abstract"]) localized(paper[key], `${at}.${key}`);
  Object.entries(paper.links || {}).forEach(([key, url]) => checkURL(url, `${at}.links.${key}`));
});
arr(data.projects).forEach((project, i) => {
  checkURL(project.image, `projects[${i}].image`);
  if (project.image) localized(project.imageAlt, `projects[${i}].imageAlt`);
  for (const key of ["title", "description", "category", "status"]) localized(project[key], `projects[${i}].${key}`);
  Object.entries(project.links || {}).forEach(([key, url]) => checkURL(url, `projects[${i}].links.${key}`));
});
arr(data.news).forEach((item, i) => {
  localized(item.text, `news[${i}].text`);
  localized(item.category, `news[${i}].category`);
  const monthOnly = /^\d{4}-\d{2}$/.test(item.date);
  assert(validDate(monthOnly ? `${item.date}-01` : item.date), `news[${i}].date must be a real YYYY-MM or YYYY-MM-DD date.`);
  checkURL(item.url, `news[${i}].url`);
  arr(item.resources).forEach((resource, j) => {
    localized(resource.label, `news[${i}].resources[${j}].label`);
    checkURL(resource.url, `news[${i}].resources[${j}].url`);
  });
  if (item.galleryId) assert(arr(data.gallery).some((event) => event.id === item.galleryId), `news[${i}].galleryId: gallery event not found.`);
});
assert(Number.isInteger(data.site.newsLimit) && data.site.newsLimit > 0, "site.newsLimit must be a positive integer.");
arr(data.entities).forEach((entity, i) => {
  assert(arr(entity.labels).length > 0 && entity.labels.every((label) => typeof label === "string" && label.trim()), `entities[${i}].labels must contain nonempty names.`);
  checkURL(entity.url, `entities[${i}].url`);
});
const galleryIds = new Set();
arr(data.gallery).forEach((event, i) => {
  assert(/^[a-z0-9-]+$/.test(event.id) && !galleryIds.has(event.id), `gallery[${i}].id must be unique and use lowercase letters, digits, or hyphens.`);
  galleryIds.add(event.id);
  const monthOnly = /^\d{4}-\d{2}$/.test(event.date);
  assert(validDate(monthOnly ? `${event.date}-01` : event.date), `gallery[${i}].date must be a real YYYY-MM or YYYY-MM-DD date.`);
  for (const key of ["title", "description", "sourceLabel"]) localized(event[key], `gallery[${i}].${key}`);
  checkURL(event.sourceUrl, `gallery[${i}].sourceUrl`);
  assert(arr(event.images).length > 0, `gallery[${i}] needs at least one photo.`);
  arr(event.images).forEach((photo, j) => {
    checkURL(photo.src, `gallery[${i}].images[${j}].src`);
    assert(Boolean(photo.src), `gallery[${i}].images[${j}].src is required.`);
    localized(photo.alt, `gallery[${i}].images[${j}].alt`);
    assert(Number.isInteger(photo.width) && photo.width > 0 && Number.isInteger(photo.height) && photo.height > 0, `gallery[${i}].images[${j}]: positive width and height required.`);
  });
});
for (const name of ["education", "experience"]) arr(data[name]).forEach((item, i) => {
  for (const key of ["period", "title", "institution", "description"]) localized(item[key], `${name}[${i}].${key}`);
});
arr(data.awards).forEach((item, i) => {
  localized(item.title, `awards[${i}].title`);
  localized(item.organization, `awards[${i}].organization`);
  checkURL(item.url, `awards[${i}].url`);
  checkURL(item.image, `awards[${i}].image`);
  for (const key of ["subtitle", "linkLabel"]) if (item[key]) localized(item[key], `awards[${i}].${key}`);
});
for (const key of ["headline", "text"]) localized(data.contact?.[key], `contact.${key}`);
const koKeys = Object.keys(translations.ko).sort();
const enKeys = Object.keys(translations.en).sort();
assert(JSON.stringify(koKeys) === JSON.stringify(enKeys), "i18n.js: Korean and English translation keys must match.");
for (const page of ["index.html", "cv.html"]) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  for (const match of html.matchAll(/(?:src|href)="(\.\/[^\"]+)"/g)) checkURL(match[1], `${page}: resource`);
}
assert(fs.existsSync(path.join(root, ".nojekyll")), ".nojekyll is missing from the website root.");
for (const file of ["assets/fonts/PretendardVariable.woff2", "assets/fonts/OFL.txt"]) checkURL(`./${file}`, "Self-hosted font");
const metadata = spawnSync(process.execPath, [path.join(root, "tools/sync-meta.mjs"), "--check"], { encoding: "utf8" });
assert(metadata.status === 0, `Static metadata is out of sync or invalid. Run node tools/sync-meta.mjs.\n${metadata.stderr || ""}`);

for (const warning of warnings) console.warn(`NOTE: ${warning}`);
if (errors.length) {
  console.error(`\nFAIL (${errors.length} issue${errors.length === 1 ? "" : "s"}):\n${errors.map((msg) => `- ${msg}`).join("\n")}`);
  process.exit(1);
}
console.log(`PASS: syntax, required data, ${data.publications.length} publications, bilingual labels, and local asset paths.`);
console.log("External URLs were not contacted. This check does not verify real publication records or GitHub deployment.");
