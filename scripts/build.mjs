/**
 * scripts/build.mjs — Portfolio static site builder
 * Node 18+, only node: built-in modules used.
 *
 * Usage: node scripts/build.mjs
 *
 * Reads: data/profile.json, templates/
 * Writes: docs/  (index.html, projects/<slug>/index.html, assets/, 404.html,
 *                  robots.txt, sitemap.xml, .nojekyll, .portfolio-build.json)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DOCS = join(ROOT, 'docs');
const DATA = join(ROOT, 'data');
const TEMPLATES = join(ROOT, 'templates');

/* ── Helpers ── */

/** Escape HTML special characters. Always call this before inserting user data. */
function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Write a file, creating parent directories as needed. */
function writeOut(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, 'utf8');
}

/**
 * Check whether docs/ is safe to overwrite.
 * Refuses if docs/ exists, is non-empty, and shows no signs of being a portfolio build.
 */
function assertDocsSafe() {
  if (!existsSync(DOCS)) return; // does not exist → safe to create
  const entries = readdirSync(DOCS);
  if (entries.length === 0) return; // empty → safe
  // Has build marker from previous run → safe
  if (entries.includes('.portfolio-build.json')) return;
  // Looks like a portfolio build (has index.html or robots.txt) → safe to overwrite
  if (entries.includes('index.html') || entries.includes('robots.txt')) {
    console.log('NOTE: docs/ exists without .portfolio-build.json but looks like a portfolio build. Overwriting files.');
    return;
  }
  console.error(
    'ERROR: docs/ exists and does not look like a portfolio build directory.\n' +
    'Refusing to overwrite to avoid destroying unrelated files.\n' +
    'If you are sure, delete docs/ manually and run again.'
  );
  process.exit(1);
}

/* ── SVG icons (inline, no CDN) ── */
const SVG_EMAIL = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"/><path d="M3 7l9 6l9 -6"/></svg>`;
const SVG_GITHUB = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"/></svg>`;
const SVG_LINKEDIN = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 11v5"/><path d="M8 8v.01"/><path d="M12 16v-5"/><path d="M16 16v-3a2 2 0 1 0 -4 0"/><path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z"/></svg>`;
const SVG_ARROW_UPRIGHT = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>`;
const SVG_ARROW_BACK = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M5 12l7 7M5 12l7-7"/></svg>`;

/* ── Section builders ── */

function buildSkillsContent(skills) {
  if (!skills || skills.length === 0) return '';
  return skills.map(group => {
    const groupId = 'group-' + group.group.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const chips = (group.items || []).map(item =>
      `              <li><span class="chip">${esc(item)}</span></li>`
    ).join('\n');
    return `              <div class="skill-group" role="group" aria-labelledby="${groupId}">
                <h3 class="skill-group-name" id="${groupId}">${esc(group.group)}</h3>
                <ul class="skill-chips">
${chips}
                </ul>
              </div>`;
  }).join('\n');
}

function buildProjectsSection(projects, siteUrl) {
  const publicProjects = (projects || []).filter(p => p.visibility === 'public');
  if (publicProjects.length === 0) return '';

  const cards = publicProjects.map((project, idx) => {
    const num = String(idx + 1).padStart(2, '0');
    const hasLink = !!(project.links && (project.links.demo || project.links.repo));
    const detailUrl = `projects/${project.slug}/`;
    const cardTag = hasLink ? 'a' : 'div';
    const cardAttrs = hasLink
      ? ` href="${esc(detailUrl)}" class="project-card project-card--link"`
      : ` class="project-card"`;

    const linkIcon = hasLink
      ? `          <span class="project-link-icon">${SVG_ARROW_UPRIGHT}</span>\n`
      : '';

    const highlights = (project.highlights || []).map(h =>
      `              <li>${esc(h.text)}</li>`
    ).join('\n');
    const highlightsBlock = highlights
      ? `          <ul class="project-highlights">\n${highlights}\n          </ul>\n`
      : '';

    const chips = (project.stack || []).map(s =>
      `            <span class="chip">${esc(s)}</span>`
    ).join('\n');

    return `          <${cardTag}${cardAttrs}>
${linkIcon}            <p class="project-number">${esc(num)}</p>
            <h3 class="project-name">${esc(project.name)}</h3>
            <p class="project-summary">${esc(project.summary)}</p>
            <div class="skill-chips" style="margin-bottom:var(--space-4);">
${chips}
            </div>
${highlightsBlock}          </${cardTag}>`;
  }).join('\n');

  return `    <!-- Projects -->
    <section id="projects" aria-labelledby="projects-heading">
      <div class="section-inner">
        <div class="section-grid">
          <div class="section-label">
            <h2 id="projects-heading">Projects</h2>
            <div class="accent-bar" aria-hidden="true"></div>
          </div>
          <div class="section-content">
            <div class="projects-list">
${cards}
            </div>
          </div>
        </div>
      </div>
    </section>
`;
}

function buildExperienceSection(experience) {
  if (!experience || experience.length === 0) return '';

  const items = experience.map((exp, idx) => {
    const bullets = (exp.bullets || []).map(b =>
      `                <li>${esc(b)}</li>`
    ).join('\n');
    const bulletsBlock = bullets
      ? `              <ul class="exp-bullets">\n${bullets}\n              </ul>`
      : '';

    return `            <div class="timeline-item">
              <div class="timeline-dot" aria-hidden="true"></div>
              <div class="exp-card">
                <div class="exp-header">
                  <div>
                    <h3 class="exp-role">${esc(exp.role)}</h3>
                    <p class="exp-org">${esc(exp.org)}</p>
                  </div>
                  <span class="exp-period">${esc(exp.period || '')}</span>
                </div>
${bulletsBlock}
              </div>
            </div>`;
  }).join('\n');

  return `    <!-- Experience -->
    <section id="experience" aria-labelledby="experience-heading">
      <div class="section-inner">
        <div class="section-grid">
          <div class="section-label">
            <h2 id="experience-heading">Experience</h2>
            <div class="accent-bar" aria-hidden="true"></div>
          </div>
          <div class="section-content">
            <div class="timeline">
${items}
            </div>
          </div>
        </div>
      </div>
    </section>
`;
}

function buildEducationSection(education) {
  if (!education || education.length === 0) return '';

  const items = education.map(edu => {
    return `            <div class="edu-card">
              <div class="edu-header">
                <div>
                  <h3 class="edu-degree">${esc(edu.degree)}</h3>
                  <p class="edu-school">${esc(edu.school)}</p>
                </div>
                <span class="edu-period">${esc(edu.period || '')}</span>
              </div>
            </div>`;
  }).join('\n');

  return `    <!-- Education -->
    <section id="education" aria-labelledby="education-heading">
      <div class="section-inner">
        <div class="section-grid">
          <div class="section-label">
            <h2 id="education-heading">Education</h2>
            <div class="accent-bar" aria-hidden="true"></div>
          </div>
          <div class="section-content">
            <div class="edu-list">
${items}
            </div>
          </div>
        </div>
      </div>
    </section>
`;
}

function buildSocialLinks(person, prefix) {
  const links = [];
  if (person.email) {
    links.push(
      `${prefix}<a href="mailto:${esc(person.email)}" aria-label="Email">${SVG_EMAIL}</a>`
    );
  }
  if (person.links && person.links.github) {
    links.push(
      `${prefix}<a href="${esc(person.links.github)}" target="_blank" rel="noopener noreferrer" aria-label="GitHub">${SVG_GITHUB}</a>`
    );
  }
  if (person.links && person.links.linkedin) {
    links.push(
      `${prefix}<a href="${esc(person.links.linkedin)}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">${SVG_LINKEDIN}</a>`
    );
  }
  return links.join('\n') + (links.length ? '\n' : '');
}

function buildContactLinks(person) {
  const links = [];
  if (person.email) {
    links.push(
      `          <a href="mailto:${esc(person.email)}" class="contact-link">${SVG_EMAIL} ${esc(person.email)}</a>`
    );
  }
  if (person.links && person.links.github) {
    links.push(
      `          <a href="${esc(person.links.github)}" class="contact-link" target="_blank" rel="noopener noreferrer">${SVG_GITHUB} GitHub ${SVG_ARROW_UPRIGHT}</a>`
    );
  }
  if (person.links && person.links.linkedin) {
    links.push(
      `          <a href="${esc(person.links.linkedin)}" class="contact-link" target="_blank" rel="noopener noreferrer">${SVG_LINKEDIN} LinkedIn ${SVG_ARROW_UPRIGHT}</a>`
    );
  }
  return links.join('\n') + (links.length ? '\n' : '');
}

function buildJsonLd(profile) {
  const { person, site } = profile;
  const obj = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    url: site.url,
    jobTitle: person.title || undefined,
    email: person.email || undefined,
    sameAs: []
  };
  if (person.links) {
    if (person.links.github)   obj.sameAs.push(person.links.github);
    if (person.links.linkedin) obj.sameAs.push(person.links.linkedin);
    if (person.links.website)  obj.sameAs.push(person.links.website);
  }
  if (!obj.sameAs.length) delete obj.sameAs;
  return JSON.stringify(obj);
}

/* ── Page builders ── */

function buildIndexPage(profile, indexTpl, ogImageUrl) {
  const { site, person, skills, projects, experience, education } = profile;
  const locale = site.locale || 'en';
  const siteUrl = site.url.endsWith('/') ? site.url : site.url + '/';
  const themeColor = site.themeColor || '#0f172a';
  const year = new Date().getFullYear();

  const publicProjects = (projects || []).filter(p => p.visibility === 'public');
  const hasProjects    = publicProjects.length > 0;
  const hasExperience  = (experience || []).length > 0;
  const hasEducation   = (education  || []).length > 0;

  const pageTitle = `${esc(person.name)} — ${esc(person.title || 'Portfolio')}`;
  const metaDesc  = esc(person.summary || person.title || person.name);
  const canonical = siteUrl;
  const jsonLd    = buildJsonLd(profile);
  const ogImageAlt = esc(`${person.name} — ${person.title || 'Portfolio'}`);

  /* Nav optional items */
  const navProjectsItem  = hasProjects   ? `          <li><a href="#projects">Projects</a></li>\n` : '';
  const navExperienceItem = hasExperience ? `          <li><a href="#experience">Experience</a></li>\n` : '';
  const navEducationItem  = hasEducation  ? `          <li><a href="#education">Education</a></li>\n` : '';

  /* Hero GitHub button */
  const heroGithubBtn = (person.links && person.links.github)
    ? `          <a href="${esc(person.links.github)}" class="btn-secondary" target="_blank" rel="noopener noreferrer">GitHub &#8599;</a>\n`
    : '';

  /* Social links */
  const heroSocialLinks   = buildSocialLinks(person, '          ');
  const footerSocialLinks = buildSocialLinks(person, '          ');
  const contactLinks      = buildContactLinks(person);
  const footerNavProjects = hasProjects ? `          <a href="#projects">Projects</a>\n` : '';

  /* Sections */
  const skillsContent      = buildSkillsContent(skills);
  const projectsSection    = buildProjectsSection(publicProjects, siteUrl);
  const experienceSection  = buildExperienceSection(experience);
  const educationSection   = buildEducationSection(education);

  let html = indexTpl
    .replace(/\{\{LANG\}\}/g, esc(locale))
    .replace(/\{\{PAGE_TITLE\}\}/g, pageTitle)
    .replace(/\{\{META_DESCRIPTION\}\}/g, metaDesc)
    .replace(/\{\{CANONICAL\}\}/g, esc(canonical))
    .replace(/\{\{OG_TITLE\}\}/g, pageTitle)
    .replace(/\{\{OG_DESCRIPTION\}\}/g, metaDesc)
    .replace(/\{\{OG_URL\}\}/g, esc(canonical))
    .replace(/\{\{OG_IMAGE\}\}/g, esc(ogImageUrl))
    .replace(/\{\{OG_IMAGE_ALT\}\}/g, ogImageAlt)
    .replace(/\{\{THEME_COLOR\}\}/g, esc(themeColor))
    .replace(/\{\{JSONLD\}\}/g, jsonLd)
    .replace(/\{\{ASSETS_PATH\}\}/g, '')
    .replace(/\{\{PERSON_NAME\}\}/g, esc(person.name))
    .replace(/\{\{PERSON_TITLE\}\}/g, esc(person.title || ''))
    .replace(/\{\{PERSON_SUMMARY\}\}/g, esc(person.summary || ''))
    .replace(/\{\{PERSON_SUMMARY_FULL\}\}/g, esc(person.summary || ''))
    .replace(/\{\{NAV_PROJECTS_ITEM\}\}/g, navProjectsItem)
    .replace(/\{\{NAV_EXPERIENCE_ITEM\}\}/g, navExperienceItem)
    .replace(/\{\{NAV_EDUCATION_ITEM\}\}/g, navEducationItem)
    .replace(/\{\{HERO_GITHUB_BTN\}\}/g, heroGithubBtn)
    .replace(/\{\{HERO_SOCIAL_LINKS\}\}/g, heroSocialLinks)
    .replace(/\{\{SKILLS_CONTENT\}\}/g, skillsContent)
    .replace(/\{\{PROJECTS_SECTION\}\}/g, projectsSection)
    .replace(/\{\{EXPERIENCE_SECTION\}\}/g, experienceSection)
    .replace(/\{\{EDUCATION_SECTION\}\}/g, educationSection)
    .replace(/\{\{CONTACT_LINKS\}\}/g, contactLinks)
    .replace(/\{\{FOOTER_SOCIAL_LINKS\}\}/g, footerSocialLinks)
    .replace(/\{\{FOOTER_NAV_PROJECTS\}\}/g, footerNavProjects)
    .replace(/\{\{YEAR\}\}/g, String(year));

  return html;
}

function buildProjectPage(project, profile, projectTpl, ogImageUrl) {
  const { site, person } = profile;
  const locale    = site.locale || 'en';
  const siteUrl   = site.url.endsWith('/') ? site.url : site.url + '/';
  const themeColor = site.themeColor || '#0f172a';
  const year      = new Date().getFullYear();

  const canonical  = `${siteUrl}projects/${project.slug}/`;
  const pageTitle  = `${esc(project.name)} — ${esc(person.name)}`;
  const metaDesc   = esc(project.summary);
  const jsonLd     = buildJsonLd(profile);
  const ogImageAlt = esc(`${project.name} — ${person.name}`);

  /* meta line */
  const metaParts = [project.role, project.period].filter(Boolean).map(esc);
  const projectMeta = metaParts.join(' &middot; ');

  /* stack chips */
  const stackChips = (project.stack || []).map(s =>
    `        <span class="chip">${esc(s)}</span>`
  ).join('\n') + '\n';

  /* highlights block */
  let highlightsBlock = '';
  if ((project.highlights || []).length > 0) {
    const items = project.highlights.map(h =>
      `          <li>${esc(h.text)}</li>`
    ).join('\n');
    highlightsBlock = `      <!-- Highlights -->
      <h2 class="detail-section-title">Highlights</h2>
      <ul class="detail-highlights">
${items}
      </ul>
`;
  }

  /* metrics block */
  let metricsBlock = '';
  if ((project.metrics || []).length > 0) {
    const cards = project.metrics.map(m => `        <div class="metric-card">
          <p class="metric-value">${esc(m.value)}</p>
          <p class="metric-label">${esc(m.label)}</p>
        </div>`).join('\n');
    metricsBlock = `      <!-- Metrics -->
      <h2 class="detail-section-title">Metrics</h2>
      <div class="metrics-grid">
${cards}
      </div>
`;
  }

  /* links block */
  let linksBlock = '';
  const linkItems = [];
  if (project.links && project.links.repo) {
    linkItems.push(
      `        <a href="${esc(project.links.repo)}" class="btn-secondary" target="_blank" rel="noopener noreferrer">Repo ${SVG_ARROW_UPRIGHT}</a>`
    );
  }
  if (project.links && project.links.demo) {
    linkItems.push(
      `        <a href="${esc(project.links.demo)}" class="btn-primary" target="_blank" rel="noopener noreferrer">Live demo ${SVG_ARROW_UPRIGHT}</a>`
    );
  }
  if (linkItems.length > 0) {
    linksBlock = `      <!-- Links -->
      <h2 class="detail-section-title">Links</h2>
      <div class="detail-links">
${linkItems.join('\n')}
      </div>
`;
  }

  const footerSocialLinks = buildSocialLinks(person, '          ');
  const rootPath = '../../';

  let html = projectTpl
    .replace(/\{\{LANG\}\}/g, esc(locale))
    .replace(/\{\{PAGE_TITLE\}\}/g, pageTitle)
    .replace(/\{\{META_DESCRIPTION\}\}/g, metaDesc)
    .replace(/\{\{CANONICAL\}\}/g, esc(canonical))
    .replace(/\{\{OG_TITLE\}\}/g, pageTitle)
    .replace(/\{\{OG_DESCRIPTION\}\}/g, metaDesc)
    .replace(/\{\{OG_URL\}\}/g, esc(canonical))
    .replace(/\{\{OG_IMAGE\}\}/g, esc(ogImageUrl))
    .replace(/\{\{OG_IMAGE_ALT\}\}/g, ogImageAlt)
    .replace(/\{\{THEME_COLOR\}\}/g, esc(themeColor))
    .replace(/\{\{JSONLD\}\}/g, jsonLd)
    .replace(/\{\{ASSETS_PATH\}\}/g, rootPath)
    .replace(/\{\{ROOT_PATH\}\}/g, rootPath)
    .replace(/\{\{PROJECT_NAME\}\}/g, esc(project.name))
    .replace(/\{\{PROJECT_META\}\}/g, projectMeta)
    .replace(/\{\{PROJECT_SUMMARY\}\}/g, esc(project.summary))
    .replace(/\{\{STACK_CHIPS\}\}/g, stackChips)
    .replace(/\{\{HIGHLIGHTS_BLOCK\}\}/g, highlightsBlock)
    .replace(/\{\{METRICS_BLOCK\}\}/g, metricsBlock)
    .replace(/\{\{LINKS_BLOCK\}\}/g, linksBlock)
    .replace(/\{\{PERSON_NAME\}\}/g, esc(person.name))
    .replace(/\{\{PERSON_TITLE\}\}/g, esc(person.title || ''))
    .replace(/\{\{FOOTER_SOCIAL_LINKS\}\}/g, footerSocialLinks)
    .replace(/\{\{YEAR\}\}/g, String(year));

  return html;
}

function build404Page(profile, ogImageUrl) {
  const { site, person } = profile;
  const locale    = site.locale || 'en';
  const themeColor = site.themeColor || '#0f172a';
  const siteUrl   = site.url.endsWith('/') ? site.url : site.url + '/';
  const ogImgAlt  = esc(`${person.name} — ${person.title || 'Portfolio'}`);
  return `<!doctype html>
<html lang="${esc(locale)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>404 Not Found — ${esc(person.name)}</title>
  <meta name="description" content="Page not found">
  <link rel="canonical" href="${esc(siteUrl)}">
  <meta property="og:image" content="${esc(ogImageUrl)}">
  <meta property="og:image:alt" content="${ogImgAlt}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${esc(ogImageUrl)}">
  <meta name="theme-color" content="${esc(themeColor)}">
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
  <a class="skip-link" href="#main">Skip to main content</a>
  <main id="main">
    <div class="error-page">
      <h1 class="error-code">404</h1>
      <p class="error-message">Page not found.</p>
      <a href="${esc(siteUrl)}" class="btn-primary">Back to home</a>
    </div>
  </main>
</body>
</html>`;
}

function buildRobotsTxt(siteUrl) {
  const url = siteUrl.endsWith('/') ? siteUrl : siteUrl + '/';
  return `User-agent: *\nAllow: /\nSitemap: ${url}sitemap.xml\n`;
}

function buildSitemapXml(siteUrl, publicProjects) {
  const url = siteUrl.endsWith('/') ? siteUrl : siteUrl + '/';
  const now  = new Date().toISOString().split('T')[0];
  const projectUrls = publicProjects.map(p =>
    `  <url>\n    <loc>${url}projects/${p.slug}/</loc>\n    <lastmod>${now}</lastmod>\n  </url>`
  ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
  </url>
${projectUrls}
</urlset>\n`;
}

/* ── Main ── */

function main() {
  /* 1. Read profile.json */
  const profilePath = join(DATA, 'profile.json');
  if (!existsSync(profilePath)) {
    console.error('ERROR: data/profile.json not found. Run content-writer first.');
    process.exit(1);
  }
  let profile;
  try {
    profile = JSON.parse(readFileSync(profilePath, 'utf8'));
  } catch (err) {
    console.error('ERROR: data/profile.json is invalid JSON:', err.message);
    process.exit(1);
  }

  /* 2. Validate required fields */
  const p = profile.person;
  if (!p || !p.name || !p.title || !p.summary) {
    console.error('ERROR: profile.json missing required fields: person.name, person.title, person.summary');
    process.exit(1);
  }
  if (!profile.site || !profile.site.url) {
    console.error('ERROR: profile.json missing site.url');
    process.exit(1);
  }

  /* 3. Read templates */
  const indexTpl   = readFileSync(join(TEMPLATES, 'index.html.tpl'),   'utf8');
  const projectTpl = readFileSync(join(TEMPLATES, 'project.html.tpl'), 'utf8');
  const styleCss   = readFileSync(join(TEMPLATES, 'style.css'),        'utf8');
  const tokensCss  = readFileSync(join(TEMPLATES, 'tokens.css'),       'utf8');
  const siteJs     = readFileSync(join(TEMPLATES, 'site.js'),          'utf8');
  const ogImageTpl = readFileSync(join(TEMPLATES, 'og-image.svg'),     'utf8');

  /* 4. Safety-check and clear docs/ */
  assertDocsSafe();
  mkdirSync(DOCS, { recursive: true });

  /* 5. Build */
  const siteUrl = profile.site.url;
  const normalizedSiteUrl = siteUrl.endsWith('/') ? siteUrl : siteUrl + '/';
  const publicProjects = (profile.projects || []).filter(p => p.visibility === 'public');

  /* og-image.svg */
  let siteHost = '';
  try { siteHost = new URL(normalizedSiteUrl).hostname; } catch (_) { siteHost = normalizedSiteUrl; }
  const ogImageAlt = `${profile.person.name} — ${profile.person.title || 'Portfolio'}`;
  const ogImageSvg = ogImageTpl
    .replace(/\{\{PERSON_NAME\}\}/g, esc(profile.person.name))
    .replace(/\{\{PERSON_TITLE\}\}/g, esc(profile.person.title || ''))
    .replace(/\{\{SITE_HOST\}\}/g,   esc(siteHost))
    .replace(/\{\{OG_IMAGE_ALT\}\}/g, esc(ogImageAlt));
  writeOut(join(DOCS, 'assets', 'og-image.svg'), ogImageSvg);
  console.log('  wrote docs/assets/og-image.svg');
  const ogImageUrl = `${normalizedSiteUrl}assets/og-image.svg`;

  /* index.html */
  const indexHtml = buildIndexPage(profile, indexTpl, ogImageUrl);
  writeOut(join(DOCS, 'index.html'), indexHtml);
  console.log('  wrote docs/index.html');

  /* project detail pages */
  for (const project of publicProjects) {
    const html = buildProjectPage(project, profile, projectTpl, ogImageUrl);
    writeOut(join(DOCS, 'projects', project.slug, 'index.html'), html);
    console.log(`  wrote docs/projects/${project.slug}/index.html`);
  }

  /* assets */
  const combinedCss = tokensCss + '\n\n' + styleCss;
  writeOut(join(DOCS, 'assets', 'style.css'), combinedCss);
  writeOut(join(DOCS, 'assets', 'site.js'),   siteJs);
  console.log('  wrote docs/assets/style.css');
  console.log('  wrote docs/assets/site.js');

  /* 404.html */
  writeOut(join(DOCS, '404.html'), build404Page(profile, ogImageUrl));
  console.log('  wrote docs/404.html');

  /* robots.txt */
  writeOut(join(DOCS, 'robots.txt'), buildRobotsTxt(siteUrl));

  /* sitemap.xml */
  writeOut(join(DOCS, 'sitemap.xml'), buildSitemapXml(siteUrl, publicProjects));
  console.log('  wrote docs/sitemap.xml');

  /* .nojekyll */
  writeOut(join(DOCS, '.nojekyll'), '');

  /* .portfolio-build.json */
  writeOut(join(DOCS, '.portfolio-build.json'), JSON.stringify({
    profile: 'data/profile.json',
    builtAt: new Date().toISOString()
  }, null, 2));

  console.log(`\nBuild complete. ${1 + publicProjects.length} HTML pages written to docs/.`);
}

main();
