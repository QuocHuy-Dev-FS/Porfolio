/**
 * scripts/check.mjs — Portfolio output validator
 * Node 18+, only node: built-in modules.
 * Exit code 0 = all pass, 1 = error(s) found.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DOCS = join(ROOT, 'docs');
const DATA = join(ROOT, 'data');

let errors = 0;
let warnings = 0;

function fail(msg)  { console.error('  FAIL:', msg); errors++; }
function warn(msg)  { console.warn ('  WARN:', msg); warnings++; }
function pass(msg)  { console.log  ('  PASS:', msg); }

function collectFiles(dir) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) results.push(...collectFiles(full));
    else results.push(full);
  }
  return results;
}

function collectHtml(dir) {
  return collectFiles(dir).filter(f => f.endsWith('.html'));
}

function relPath(f) {
  return f.replace(ROOT + '\\', '').replace(ROOT + '/', '');
}

function resolveInternalHref(href, htmlFilePath) {
  const bare = href.split('?')[0].split('#')[0];
  if (!bare) return null;
  if (bare.startsWith('/')) return join(DOCS, bare);
  return resolve(dirname(htmlFilePath), bare);
}

function internalHrefExists(href, htmlFilePath) {
  const resolved = resolveInternalHref(href, htmlFilePath);
  if (!resolved) return true;
  if (existsSync(resolved)) {
    const st = statSync(resolved);
    if (st.isFile()) return true;
    return existsSync(join(resolved, 'index.html'));
  }
  if (existsSync(resolved + '.html')) return true;
  if (!resolved.startsWith(DOCS)) return true;
  return false;
}

/* ── 1. docs/ exists ── */
console.log('\n[1] docs/ exists and is non-empty');
if (!existsSync(DOCS)) {
  fail('docs/ directory does not exist. Run build.mjs first.');
} else {
  const entries = readdirSync(DOCS);
  if (entries.length === 0) fail('docs/ directory is empty.');
  else pass(`docs/ contains ${entries.length} entries`);
}

/* ── 2. profile.json validity ── */
console.log('\n[2] profile.json valid JSON + required fields');
const profilePath = join(DATA, 'profile.json');
let profile = null;
if (!existsSync(profilePath)) {
  fail('data/profile.json not found');
} else {
  try {
    profile = JSON.parse(readFileSync(profilePath, 'utf8'));
    pass('JSON parses correctly');
    for (const field of ['person.name', 'person.title', 'person.summary', 'site.url']) {
      const parts = field.split('.');
      let val = profile;
      for (const part of parts) val = val && val[part];
      if (!val) fail(`Missing required field: ${field}`);
      else pass(`${field} present`);
    }
  } catch (err) {
    fail('data/profile.json invalid JSON: ' + err.message);
  }
}

/* ── 3. Metrics have source ── */
console.log('\n[3] All project metrics have a source');
if (profile) {
  let metricCount = 0;
  for (const project of (profile.projects || [])) {
    for (const metric of (project.metrics || [])) {
      metricCount++;
      if (!metric.source || !metric.source.trim()) {
        fail(`Project "${project.slug}" metric "${metric.label}" is missing source`);
      }
    }
    for (const highlight of (project.highlights || [])) {
      if (!highlight.source || !highlight.source.trim()) {
        warn(`Project "${project.slug}" highlight missing source: "${String(highlight.text || '').slice(0, 60)}"`);
      }
    }
  }
  if (metricCount === 0) pass('No metrics found (nothing to check)');
  else pass(`Checked ${metricCount} metric(s) for source`);
}

/* ── 4. No private projects in docs/ ── */
console.log('\n[4] No private projects in docs/');
if (profile && existsSync(DOCS)) {
  const privateProjects = (profile.projects || []).filter(p => p.visibility === 'private');
  const htmlFiles = collectHtml(DOCS);
  for (const pp of privateProjects) {
    const projectDir = join(DOCS, 'projects', pp.slug);
    if (existsSync(projectDir)) {
      fail(`Private project "${pp.slug}" has a page in docs/projects/${pp.slug}/`);
    }
    for (const htmlFile of htmlFiles) {
      const content = readFileSync(htmlFile, 'utf8');
      if (content.includes(pp.name)) {
        fail(`Private project name "${pp.name}" found in ${relPath(htmlFile)}`);
      }
    }
  }
  if (privateProjects.length === 0) pass('No private projects defined');
  else pass(`Checked ${privateProjects.length} private project(s) absent from docs/`);
}

/* ── 5. No placeholder tokens ── */
console.log('\n[5] No placeholder tokens ({{, TODO, lorem) in HTML');
if (existsSync(DOCS)) {
  const htmlFiles = collectHtml(DOCS);
  const patterns = [/\{\{/, /\bTODO\b/, /\blorem\b/i];
  let found = false;
  for (const f of htmlFiles) {
    const content = readFileSync(f, 'utf8');
    for (const pat of patterns) {
      if (pat.test(content)) {
        fail(`Placeholder "${pat}" found in ${relPath(f)}`);
        found = true;
      }
    }
  }
  if (!found) pass('No placeholder tokens found');
}

/* ── 6. HTML structure: single h1, meta description, canonical ── */
console.log('\n[6] HTML structure: single h1, meta description, canonical');
if (existsSync(DOCS)) {
  const htmlFiles = collectHtml(DOCS);
  for (const f of htmlFiles) {
    const content = readFileSync(f, 'utf8');
    const rel = relPath(f);

    const h1Matches = content.match(/<h1[\s>]/gi) || [];
    if (h1Matches.length === 0) fail(`${rel}: no <h1> found`);
    else if (h1Matches.length > 1) fail(`${rel}: ${h1Matches.length} <h1> elements (expected 1)`);

    if (!/<meta\s[^>]*name=["']description["'][^>]*>/i.test(content))
      fail(`${rel}: missing <meta name="description">`);

    if (!/<link\s[^>]*rel=["']canonical["'][^>]*>/i.test(content))
      fail(`${rel}: missing <link rel="canonical">`);
  }
  pass(`Structure checked for ${htmlFiles.length} HTML file(s)`);
}

/* ── 7. All <img> have non-empty alt ── */
console.log('\n[7] All <img> elements have alt attribute');
if (existsSync(DOCS)) {
  const htmlFiles = collectHtml(DOCS);
  const imgPattern = /<img\b([^>]*)>/gi;
  let found = false;
  for (const f of htmlFiles) {
    const content = readFileSync(f, 'utf8');
    const rel = relPath(f);
    let m;
    while ((m = imgPattern.exec(content)) !== null) {
      if (!/alt\s*=\s*["'][^"']+["']/i.test(m[1])) {
        fail(`${rel}: <img> missing non-empty alt: ${m[0].slice(0, 80)}`);
        found = true;
      }
    }
  }
  if (!found) pass('All <img> elements have alt');
}

/* ── 8. No http:// URLs ── */
console.log('\n[8] No http:// URLs in HTML files (XML files excluded)');
if (existsSync(DOCS)) {
  const htmlFiles = collectHtml(DOCS); // .html only — sitemap.xml namespace is exempt
  let found = false;
  for (const f of htmlFiles) {
    const content = readFileSync(f, 'utf8');
    const rel = relPath(f);
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNoXmlns = line.replace(/xmlns\s*=\s*["'][^"']*["']/g, '');
      if (/http:\/\//.test(lineNoXmlns) &&
          !/<!--.*http:\/\/.*-->/.test(lineNoXmlns) &&
          !/sitemaps\.org/.test(lineNoXmlns) &&
          !/schema\.org/.test(lineNoXmlns)) {
        fail(`${rel}:${i + 1}: http:// URL found: ${line.trim().slice(0, 100)}`);
        found = true;
      }
    }
  }
  if (!found) pass('No http:// URLs found');
}

/* ── 9. Internal file links resolve ── */
console.log('\n[9] Internal links resolve to existing files');
if (existsSync(DOCS)) {
  const htmlFiles = collectHtml(DOCS);
  const hrefPattern = /href=["']([^"'#][^"']*)["']/gi;
  let found = false;
  for (const f of htmlFiles) {
    const content = readFileSync(f, 'utf8');
    const rel = relPath(f);
    let m;
    while ((m = hrefPattern.exec(content)) !== null) {
      const href = m[1];
      if (/^https?:\/\//i.test(href) || /^mailto:/i.test(href) || /^tel:/i.test(href)) continue;
      if (!internalHrefExists(href, f)) {
        fail(`${rel}: broken internal link "${href}"`);
        found = true;
      }
    }
  }
  if (!found) pass('All internal file links resolve');
}

/* ── 10. No forbidden strings ── */
console.log('\n[10] No forbidden strings in docs/');
if (existsSync(DOCS)) {
  const allFiles = collectFiles(DOCS).filter(f =>
    f.endsWith('.html') || f.endsWith('.xml') || f.endsWith('.txt')
  );
  const forbidden = ['Bệnh viện Quân y 7A'];
  let found = false;
  for (const f of allFiles) {
    const content = readFileSync(f, 'utf8');
    const rel = relPath(f);
    for (const str of forbidden) {
      if (content.includes(str)) {
        fail(`${rel}: forbidden string "${str}" found`);
        found = true;
      }
    }
  }
  if (!found) pass('No forbidden strings found');
}

/* ── 11. og:image present and file exists ── */
console.log('\n[11] og:image present and file exists');
if (existsSync(DOCS)) {
  let siteBasePath = '/';
  if (profile && profile.site && profile.site.url) {
    try { siteBasePath = new URL(profile.site.url).pathname; if (!siteBasePath.endsWith('/')) siteBasePath += '/'; }
    catch (_) {}
  }

  function resolveImagePath(imgUrl, htmlFilePath) {
    if (/^https?:\/\//i.test(imgUrl)) {
      try {
        const u = new URL(imgUrl);
        let p = u.pathname;
        if (p.startsWith(siteBasePath)) p = p.slice(siteBasePath.length);
        else p = p.replace(/^\//, '');
        return join(DOCS, ...p.split('/').filter(Boolean));
      } catch (_) { return null; }
    }
    if (imgUrl.startsWith(siteBasePath)) {
      const p = imgUrl.slice(siteBasePath.length);
      return join(DOCS, ...p.split('/').filter(Boolean));
    }
    if (imgUrl.startsWith('/')) return join(DOCS, imgUrl.replace(/^\//, ''));
    return resolve(dirname(htmlFilePath), imgUrl);
  }

  const htmlFiles = collectHtml(DOCS);
  let found = false;
  for (const f of htmlFiles) {
    const content = readFileSync(f, 'utf8');
    const rel = relPath(f);
    const ogMatch = content.match(/<meta\s[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i)
      || content.match(/<meta\s[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["'][^>]*>/i);
    if (!ogMatch || !ogMatch[1].trim()) {
      fail(`${rel}: missing or empty <meta property="og:image">`);
      found = true;
    } else {
      const imgPath = resolveImagePath(ogMatch[1].trim(), f);
      if (imgPath && !existsSync(imgPath)) {
        fail(`${rel}: og:image references non-existent file: ${ogMatch[1]}`);
        found = true;
      }
    }
    if (/<meta\s[^>]*name=["']twitter:card["'][^>]*>/i.test(content)) {
      const twMatch = content.match(/<meta\s[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["'][^>]*>/i)
        || content.match(/<meta\s[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["'][^>]*>/i);
      if (!twMatch || !twMatch[1].trim()) {
        fail(`${rel}: twitter:card present but twitter:image missing`);
        found = true;
      }
    }
  }
  if (!found) pass('og:image present and file exists on all pages');
}

/* ── 12. stats/pricing/testimonials/skillLevels items have source ── */
console.log('\n[12] Optional data arrays: items have source');
if (profile) {
  let checked = 0;
  const checks = [
    { key: 'stats',        label: 'stats' },
    { key: 'skillLevels',  label: 'skillLevels' },
    { key: 'testimonials', label: 'testimonials' },
    { key: 'pricing',      label: 'pricing' },
  ];
  for (const { key, label } of checks) {
    if (!Array.isArray(profile[key])) continue;
    for (let i = 0; i < profile[key].length; i++) {
      const item = profile[key][i];
      checked++;
      if (!item.source || !String(item.source).trim()) {
        fail(`${label}[${i}] is missing source (label/name: "${item.label || item.name || item.author || ''}")`);
      }
    }
  }
  if (checked === 0) pass('No optional data arrays present (nothing to check)');
  else pass(`Checked ${checked} item(s) in optional arrays for source`);
}

/* ── 13. No external <script src> or <link rel=stylesheet> ── */
console.log('\n[13] No external script/stylesheet imports');
if (existsSync(DOCS)) {
  const htmlFiles = collectHtml(DOCS);
  const extScriptPattern = /<script\b[^>]*\bsrc=["'](https?:\/\/[^"']+)["'][^>]*>/gi;
  const extStylePattern  = /<link\b[^>]*\brel=["']stylesheet["'][^>]*\bhref=["'](https?:\/\/[^"']+)["'][^>]*>/gi;
  let found = false;
  for (const f of htmlFiles) {
    const content = readFileSync(f, 'utf8');
    const rel = relPath(f);
    let m;
    while ((m = extScriptPattern.exec(content)) !== null) {
      fail(`${rel}: external <script src="${m[1]}">`);
      found = true;
    }
    while ((m = extStylePattern.exec(content)) !== null) {
      fail(`${rel}: external <link rel="stylesheet" href="${m[1]}">`);
      found = true;
    }
  }
  if (!found) pass('No external script/stylesheet imports found');
}

/* ── 14. No #blog links ── */
console.log('\n[14] No #blog links');
if (existsSync(DOCS)) {
  const htmlFiles = collectHtml(DOCS);
  let found = false;
  for (const f of htmlFiles) {
    const content = readFileSync(f, 'utf8');
    if (/href=["']#blog["']/i.test(content)) {
      fail(`${relPath(f)}: link to #blog found`);
      found = true;
    }
  }
  if (!found) pass('No #blog links found');
}

/* ── 15. Resume file exists if person.resume set ── */
console.log('\n[15] Resume file exists (if person.resume set)');
if (profile && profile.person && profile.person.resume) {
  const resumePath = profile.person.resume.replace(/^\//, '');
  const resumeFile = join(DOCS, resumePath);
  if (!existsSync(resumeFile)) {
    fail(`person.resume="${profile.person.resume}" but ${resumePath} not found in docs/`);
  } else {
    pass(`Resume file exists: ${resumePath}`);
  }
} else {
  pass('person.resume not set (skipped)');
}

/* ── 16. Fragment hrefs have matching id in same page ── */
console.log('\n[16] Fragment hrefs (#id) have matching id in same page');
if (existsSync(DOCS)) {
  const htmlFiles = collectHtml(DOCS);
  const fragPattern = /href=["']#([^"']+)["']/gi;
  const idPattern   = /\bid=["']([^"']+)["']/gi;
  let found = false;
  for (const f of htmlFiles) {
    const content = readFileSync(f, 'utf8');
    const rel = relPath(f);

    // Collect all ids in this page
    const ids = new Set();
    let im;
    while ((im = idPattern.exec(content)) !== null) ids.add(im[1]);

    // Check each fragment href
    let fm;
    while ((fm = fragPattern.exec(content)) !== null) {
      const id = fm[1];
      if (!ids.has(id)) {
        fail(`${rel}: href="#${id}" but no element with id="${id}" found`);
        found = true;
      }
    }
  }
  if (!found) pass('All fragment hrefs have matching id in page');
}

/* ── 17. LinkedIn URL not unencoded ── */
console.log('\n[17] LinkedIn URL check');
if (profile && profile.person && profile.person.links && profile.person.links.linkedin) {
  const liUrl = profile.person.links.linkedin;
  if (/[^\x00-\x7F]/.test(liUrl)) {
    warn(`person.links.linkedin contains non-ASCII characters (not encoded): "${liUrl}"`);
  } else {
    pass('LinkedIn URL is ASCII-safe');
  }
} else {
  pass('No LinkedIn URL set (skipped)');
}

/* ── 18. site.url is not placeholder ── */
console.log('\n[18] site.url placeholder check');
if (profile && profile.site && profile.site.url) {
  if (profile.site.url.includes('USERNAME')) {
    warn('site.url still contains "USERNAME" placeholder');
  } else {
    pass('site.url appears set');
  }
}

/* ── Summary ── */
console.log('\n' + '─'.repeat(50));
if (errors === 0 && warnings === 0) {
  console.log('All checks passed.');
} else {
  if (warnings > 0) console.warn(`${warnings} warning(s).`);
  if (errors > 0) {
    console.error(`${errors} error(s). Fix before publishing.`);
    process.exit(1);
  }
}
