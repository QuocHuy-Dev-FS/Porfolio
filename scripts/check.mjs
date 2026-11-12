/**
 * scripts/check.mjs — Portfolio output validator
 * Node 18+, only node: built-in modules used.
 *
 * Usage: node scripts/check.mjs
 * Exits with code 0 when all checks pass, code 1 on any failure.
 *
 * Checks:
 *  1. docs/ exists and is non-empty
 *  2. profile.json is valid JSON with required fields
 *  3. All metrics in profile.json have a non-empty source
 *  4. No private-visibility project appears in docs/
 *  5. No placeholder tokens ({{, TODO, lorem) remain in HTML files
 *  6. Each HTML page: exactly one <h1>, has <meta name="description">, has <link rel="canonical">
 *  7. All <img> elements have a non-empty alt attribute
 *  8. No http:// URLs in docs/ HTML files
 *  9. No internal links point to missing files
 * 10. No string "Bệnh viện Quân y 7A" in docs/
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

function fail(msg) {
  console.error('  FAIL:', msg);
  errors++;
}

function warn(msg) {
  console.warn('  WARN:', msg);
  warnings++;
}

function pass(msg) {
  console.log('  PASS:', msg);
}

/** Recursively collect all files under a directory. */
function collectFiles(dir) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      results.push(...collectFiles(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

/** Collect only .html files. */
function collectHtml(dir) {
  return collectFiles(dir).filter(f => f.endsWith('.html'));
}

/** Resolve an href relative to its containing HTML file's path within docs/. */
function resolveInternalHref(href, htmlFilePath) {
  /* Strip query and fragment */
  const bare = href.split('?')[0].split('#')[0];
  if (!bare) return null; /* fragment-only link */

  /* Absolute path relative to docs/ */
  if (bare.startsWith('/')) {
    return join(DOCS, bare);
  }

  /* Relative */
  return resolve(dirname(htmlFilePath), bare);
}

/** Check that an internal file/directory href actually exists in docs/. */
function internalHrefExists(href, htmlFilePath) {
  const resolved = resolveInternalHref(href, htmlFilePath);
  if (!resolved) return true; /* fragment links — always OK */

  /* Exact file match */
  if (existsSync(resolved)) {
    const st = statSync(resolved);
    if (st.isFile()) return true;
    /* Directory → check for index.html */
    return existsSync(join(resolved, 'index.html'));
  }
  /* Try with .html suffix */
  if (existsSync(resolved + '.html')) return true;
  /* Path is inside docs? If not, skip (external). */
  if (!resolved.startsWith(DOCS)) return true;
  return false;
}

/* ── 1. docs/ exists ── */
console.log('\n[1] docs/ exists and is non-empty');
if (!existsSync(DOCS)) {
  fail('docs/ directory does not exist. Run build.mjs first.');
} else {
  const entries = readdirSync(DOCS);
  if (entries.length === 0) {
    fail('docs/ directory is empty.');
  } else {
    pass(`docs/ contains ${entries.length} entries`);
  }
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

    const required = ['person.name', 'person.title', 'person.summary', 'site.url'];
    for (const field of required) {
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
console.log('\n[3] All metrics have a source');
if (profile) {
  let metricCount = 0;
  for (const project of (profile.projects || [])) {
    for (const metric of (project.metrics || [])) {
      metricCount++;
      if (!metric.source || !metric.source.trim()) {
        fail(`Project "${project.slug}" metric "${metric.label}" is missing source`);
      }
    }
  }
  if (metricCount === 0) {
    pass('No metrics found (nothing to check)');
  } else {
    pass(`Checked ${metricCount} metric(s) for source`);
  }
}

/* ── 4. No private projects in docs/ ── */
console.log('\n[4] No private projects in docs/');
if (profile && existsSync(DOCS)) {
  const privateProjects = (profile.projects || []).filter(p => p.visibility === 'private');
  const htmlFiles = collectHtml(DOCS);
  for (const pp of privateProjects) {
    /* Check no directory exists for private slugs */
    const projectDir = join(DOCS, 'projects', pp.slug);
    if (existsSync(projectDir)) {
      fail(`Private project "${pp.slug}" has a page in docs/projects/${pp.slug}/`);
    }
    /* Check private project name does not appear in any HTML */
    for (const htmlFile of htmlFiles) {
      const content = readFileSync(htmlFile, 'utf8');
      if (content.includes(pp.name)) {
        fail(`Private project name "${pp.name}" found in ${htmlFile.replace(ROOT, '')}`);
      }
    }
  }
  if (privateProjects.length === 0) {
    pass('No private projects defined');
  } else {
    pass(`Checked ${privateProjects.length} private project(s) are absent from docs/`);
  }
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
        fail(`Placeholder "${pat}" found in ${f.replace(ROOT, '')}`);
        found = true;
      }
    }
  }
  if (!found) pass('No placeholder tokens found');
}

/* ── 6. HTML structure checks (h1, meta description, canonical) ── */
console.log('\n[6] HTML structure: single h1, meta description, canonical');
if (existsSync(DOCS)) {
  const htmlFiles = collectHtml(DOCS);
  for (const f of htmlFiles) {
    const content = readFileSync(f, 'utf8');
    const rel = f.replace(ROOT + '\\', '').replace(ROOT + '/', '');

    /* Count h1 tags */
    const h1Matches = content.match(/<h1[\s>]/gi) || [];
    if (h1Matches.length === 0) {
      fail(`${rel}: no <h1> found`);
    } else if (h1Matches.length > 1) {
      fail(`${rel}: ${h1Matches.length} <h1> elements found (expected exactly 1)`);
    }

    /* meta description */
    if (!/<meta\s[^>]*name=["']description["'][^>]*>/i.test(content)) {
      fail(`${rel}: missing <meta name="description">`);
    }

    /* canonical */
    if (!/<link\s[^>]*rel=["']canonical["'][^>]*>/i.test(content)) {
      fail(`${rel}: missing <link rel="canonical">`);
    }
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
    const rel = f.replace(ROOT + '\\', '').replace(ROOT + '/', '');
    let m;
    while ((m = imgPattern.exec(content)) !== null) {
      const attrs = m[1];
      if (!/alt\s*=\s*["'][^"']+["']/i.test(attrs)) {
        fail(`${rel}: <img> missing non-empty alt attribute: ${m[0].slice(0, 80)}`);
        found = true;
      }
    }
  }
  if (!found) pass('All <img> elements have alt');
}

/* ── 8. No http:// URLs ── */
console.log('\n[8] No http:// URLs in HTML files');
if (existsSync(DOCS)) {
  const htmlFiles = collectHtml(DOCS);
  let found = false;
  for (const f of htmlFiles) {
    const content = readFileSync(f, 'utf8');
    const rel = f.replace(ROOT + '\\', '').replace(ROOT + '/', '');
    /* Allow http: in comments and schema.org/sitemaps XML namespace */
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      /* Strip XML namespace declarations (xmlns="http://...") before checking */
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

/* ── 9. Internal links resolve ── */
console.log('\n[9] Internal links resolve to existing files');
if (existsSync(DOCS)) {
  const htmlFiles = collectHtml(DOCS);
  const hrefPattern = /href=["']([^"'#][^"']*)["']/gi;
  let found = false;
  for (const f of htmlFiles) {
    const content = readFileSync(f, 'utf8');
    const rel = f.replace(ROOT + '\\', '').replace(ROOT + '/', '');
    let m;
    while ((m = hrefPattern.exec(content)) !== null) {
      const href = m[1];
      /* Skip external links and mailto */
      if (/^https?:\/\//i.test(href) || /^mailto:/i.test(href)) continue;
      if (!internalHrefExists(href, f)) {
        fail(`${rel}: broken internal link "${href}"`);
        found = true;
      }
    }
  }
  if (!found) pass('All internal links resolve');
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
    const rel = f.replace(ROOT + '\\', '').replace(ROOT + '/', '');
    for (const str of forbidden) {
      if (content.includes(str)) {
        fail(`${rel}: forbidden string "${str}" found`);
        found = true;
      }
    }
  }
  if (!found) pass('No forbidden strings found');
}

/* ── 11. og:image present and image file exists ── */
console.log('\n[11] og:image present and image file exists in docs/');
if (existsSync(DOCS)) {
  /* Determine site base path (e.g. "/Porfolio/" for a subdirectory GitHub Pages site) */
  let siteBasePath = '/';
  if (profile && profile.site && profile.site.url) {
    try {
      siteBasePath = new URL(profile.site.url).pathname;
      if (!siteBasePath.endsWith('/')) siteBasePath += '/';
    } catch (_) { /* ignore */ }
  }

  /**
   * Resolve an og:image URL to a local file path inside docs/.
   * Absolute URLs: strip origin + site base path → remainder maps into docs/.
   * Root-relative URLs starting with siteBasePath: same stripping.
   * Other relative URLs: resolve against the HTML file's location.
   */
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
    if (imgUrl.startsWith('/')) {
      return join(DOCS, imgUrl.replace(/^\//, ''));
    }
    return resolve(dirname(htmlFilePath), imgUrl);
  }

  const htmlFiles = collectHtml(DOCS);
  let found = false;
  for (const f of htmlFiles) {
    const content = readFileSync(f, 'utf8');
    const rel = f.replace(ROOT + '\\', '').replace(ROOT + '/', '');

    /* Check og:image meta tag is present and has a non-empty content */
    const ogImageMatch = content.match(/<meta\s[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i)
      || content.match(/<meta\s[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["'][^>]*>/i);
    if (!ogImageMatch || !ogImageMatch[1].trim()) {
      fail(`${rel}: missing or empty <meta property="og:image">`);
      found = true;
    } else {
      const imgUrl = ogImageMatch[1].trim();
      const imgFilePath = resolveImagePath(imgUrl, f);
      if (imgFilePath && !existsSync(imgFilePath)) {
        fail(`${rel}: og:image references non-existent file: ${imgUrl}`);
        found = true;
      }
    }

    /* If twitter:card is present, twitter:image must also be present and non-empty */
    if (/<meta\s[^>]*name=["']twitter:card["'][^>]*>/i.test(content)) {
      const twImageMatch = content.match(/<meta\s[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["'][^>]*>/i)
        || content.match(/<meta\s[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["'][^>]*>/i);
      if (!twImageMatch || !twImageMatch[1].trim()) {
        fail(`${rel}: twitter:card present but twitter:image is missing or empty`);
        found = true;
      }
    }
  }
  if (!found) pass('og:image present and image file exists on all pages');
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
