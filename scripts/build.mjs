/**
 * scripts/build.mjs — Portfolio static site builder
 * Node 18+, only node: built-in modules.
 *
 * Usage: node scripts/build.mjs
 * Env:   PROFILE_PATH  (default: data/profile.json)
 *        OUT_DIR       (default: docs)
 */

import {
  readFileSync, writeFileSync, mkdirSync, existsSync,
  readdirSync, copyFileSync, statSync
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const PROFILE_PATH = process.env.PROFILE_PATH
  ? (process.env.PROFILE_PATH.startsWith('/') || /^[A-Za-z]:/.test(process.env.PROFILE_PATH)
      ? process.env.PROFILE_PATH
      : join(ROOT, process.env.PROFILE_PATH))
  : join(ROOT, 'data', 'profile.json');

const OUT_DIR = process.env.OUT_DIR
  ? (process.env.OUT_DIR.startsWith('/') || /^[A-Za-z]:/.test(process.env.OUT_DIR)
      ? process.env.OUT_DIR
      : join(ROOT, process.env.OUT_DIR))
  : join(ROOT, 'docs');

const TEMPLATES = join(ROOT, 'templates');

/* ── Helpers ── */

function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function writeOut(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, 'utf8');
}

function assertDocsSafe(docsDir) {
  if (!existsSync(docsDir)) return;
  const entries = readdirSync(docsDir);
  if (entries.length === 0) return;
  if (entries.includes('.portfolio-build.json')) return;
  if (entries.includes('index.html') || entries.includes('robots.txt')) {
    console.log('NOTE: Output dir exists without .portfolio-build.json but looks like a portfolio build. Overwriting.');
    return;
  }
  console.error(
    'ERROR: Output directory "' + docsDir + '" exists and does not look like a portfolio build.\n' +
    'Refusing to overwrite. Delete it manually or set OUT_DIR to a different path.'
  );
  process.exit(1);
}

/* ── SVG icons ── */
const SVG_EMAIL = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/><polyline points="3 7 12 13 21 7"/></svg>`;
const SVG_GITHUB = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>`;
const SVG_LINKEDIN = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`;
const SVG_LOCATION = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
const SVG_PHONE = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.9 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.81 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z"/></svg>`;
const SVG_ARROW_UPRIGHT = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>`;
const SVG_BACK = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M5 12l7 7M5 12l7-7"/></svg>`;
const SVG_CHECK = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;
const SVG_PREV = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>`;
const SVG_NEXT = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>`;

/* ── Utilities ── */

function getInitials(name) {
  if (!name) return '';
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  if (words.length === 2) return (words[0][0] + words[1][0]).toUpperCase();
  // 3+ words: take last 2 (Vietnamese name: family + given name at end)
  return (words[words.length - 2][0] + words[words.length - 1][0]).toUpperCase();
}

function isLinkedInUrlClean(url) {
  if (!url) return false;
  return !/[^\x00-\x7F]/.test(url);
}

/* ── JSON-LD ── */
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
    if (person.links.linkedin && isLinkedInUrlClean(person.links.linkedin))
      obj.sameAs.push(person.links.linkedin);
    if (person.links.website)  obj.sameAs.push(person.links.website);
  }
  if (!obj.sameAs.length) delete obj.sameAs;
  return JSON.stringify(obj);
}

/* ── robots.txt / sitemap.xml ── */
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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
  </url>
${projectUrls}
</urlset>\n`;
}

/* ── Section builders ── */

function buildHeaderHtml(profile, publicProjects, hasExperience, hasEducation) {
  const { person, site } = profile;
  const locale = site.locale || 'en';
  const initials = getInitials(person.name);
  const hasTestimonials = Array.isArray(profile.testimonials) && profile.testimonials.length > 0;
  const hasPricing = Array.isArray(profile.pricing) && profile.pricing.length > 0;
  const hasProjects = publicProjects.length > 0;

  const navItems = [
    { href: '#about',        label: 'About',        always: true },
    { href: '#skills',       label: 'Skills',       always: true },
    { href: '#portfolio',    label: 'Portfolio',     cond: hasProjects },
    { href: '#experience',   label: 'Experience',   cond: hasExperience },
    { href: '#education',    label: 'Education',    cond: hasEducation },
    { href: '#testimonials', label: 'Testimonials', cond: hasTestimonials },
    { href: '#pricing',      label: 'Pricing',      cond: hasPricing },
    { href: '#contact',      label: 'Contact',      always: true },
  ].filter(it => it.always || it.cond);

  const navLinkItems = navItems.map(it =>
    `          <li><a href="${esc(it.href)}">${esc(it.label)}</a></li>`
  ).join('\n');

  const drawerItems = navItems.map(it =>
    `        <li><a href="${esc(it.href)}">${esc(it.label)}</a></li>`
  ).join('\n');

  const resumeLink = person.resume
    ? `\n        <a href="assets/cv.pdf" class="nav-resume" target="_blank" rel="noopener noreferrer">Resume</a>`
    : '';

  return `  <header class="site-header" role="banner">
    <nav class="nav container" aria-label="Main navigation">
      <a href="#hero" class="nav-logo" aria-label="${esc(person.name)} — home">${esc(initials)}</a>
      <ul class="nav-links" role="list">
${navLinkItems}
      </ul>
      <div class="nav-actions">${resumeLink}
        <a href="#contact" class="btn-primary">Hire Me</a>
        <button
          class="hamburger"
          aria-controls="nav-drawer"
          aria-expanded="false"
          aria-label="Open navigation menu"
        ><span></span><span></span><span></span></button>
      </div>
    </nav>
  </header>
  <div id="nav-drawer" class="nav-drawer" role="navigation" aria-label="Mobile navigation">
    <ul>
${drawerItems}
    </ul>
  </div>`;
}

function buildHeroSection(profile, siteUrl) {
  const { person } = profile;
  const initials = getInitials(person.name);
  const techBadges = ((profile.skills || [])[0] || {}).items || [];
  const topBadges = techBadges.slice(0, 4);

  const availableBadge = person.available === true
    ? `\n          <span class="badge-available">Available for work</span>`
    : '';

  const heroBadges = topBadges.map(b =>
    `          <span class="badge">${esc(b)}</span>`
  ).join('\n');

  const resumeBtn = person.resume
    ? `\n          <a href="assets/cv.pdf" class="btn-ghost" target="_blank" rel="noopener noreferrer">Download Resume ${SVG_ARROW_UPRIGHT}</a>`
    : '';

  const socialLinks = [];
  if (person.links && person.links.github) {
    socialLinks.push(
      `          <a href="${esc(person.links.github)}" target="_blank" rel="noopener noreferrer" aria-label="GitHub">${SVG_GITHUB}</a>`
    );
  }
  if (person.links && person.links.linkedin && isLinkedInUrlClean(person.links.linkedin)) {
    socialLinks.push(
      `          <a href="${esc(person.links.linkedin)}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">${SVG_LINKEDIN}</a>`
    );
  }
  if (person.email) {
    socialLinks.push(
      `          <a href="mailto:${esc(person.email)}" aria-label="Email">${SVG_EMAIL}</a>`
    );
  }

  const floatingBadges = topBadges.map(b =>
    `        <span class="hero-floating-badge">${esc(b)}</span>`
  ).join('\n');

  return `    <!-- Hero -->
    <section id="hero" class="hero section" aria-labelledby="hero-heading">
      <div class="container hero-inner">
        <div class="hero-col-left reveal">
          <p class="hero-greeting">Hello World,</p>
          <h1 id="hero-heading" class="hero-name">
            I&#8217;m <span class="hero-name-text">${esc(person.name)}</span>
          </h1>
          <p class="hero-title">${esc(person.title || '')}</p>
          <p class="hero-summary">${esc(person.summary || '')}</p>
          <div class="hero-badges">
${heroBadges}
          </div>${availableBadge}
          <div class="hero-cta">
            <a href="#portfolio" class="btn-primary">View Projects</a>${resumeBtn}
          </div>
          <div class="hero-socials">
${socialLinks.join('\n')}
          </div>
        </div>
        <div class="hero-col-right">
          <div class="hero-deco hero-deco--1" aria-hidden="true"></div>
          <div class="hero-deco hero-deco--2" aria-hidden="true"></div>
          <div class="hero-avatar-wrap">
            <div class="hero-avatar" aria-hidden="true">
              <span class="hero-avatar__initials">${esc(initials)}</span>
            </div>
${floatingBadges}
          </div>
        </div>
      </div>
    </section>
`;
}

function buildAboutSection(profile) {
  const { person } = profile;
  const traits = Array.isArray(profile.traits) ? profile.traits.slice(0, 6) : [];
  const stats  = Array.isArray(profile.stats) ? profile.stats.filter(s => s.source) : [];

  // Text column
  let textContent = '';
  if (Array.isArray(person.about) && person.about.length > 0) {
    textContent = person.about.map(p => `          <p>${esc(p)}</p>`).join('\n');
  } else {
    textContent = `          <p>${esc(person.summary || '')}</p>`;
  }

  const taglineBlock = person.tagline
    ? `\n          <p class="about-tagline">${esc(person.tagline)}</p>`
    : '';

  // Traits
  let traitsBlock = '';
  if (traits.length > 0) {
    const traitCards = traits.map(t =>
      `          <div class="trait-card reveal">${esc(t)}</div>`
    ).join('\n');
    traitsBlock = `\n        <div class="trait-grid">\n${traitCards}\n        </div>`;
  }

  // Stats
  let statsBlock = '';
  if (stats.length > 0) {
    const statItems = stats.map(s =>
      `          <div class="stat-item">\n            <span class="stat-item__value">${esc(s.value)}</span>\n            <span class="stat-item__label">${esc(s.label)}</span>\n          </div>`
    ).join('\n');
    statsBlock = `\n        <div class="stats-row">\n${statItems}\n        </div>`;
  }

  return `    <!-- About -->
    <section id="about" class="section" aria-labelledby="about-heading">
      <div class="container">
        <div class="section-heading">
          <p class="section-heading__label">About</p>
          <h2 id="about-heading" class="section-heading__title">About Me</h2>
        </div>
        <div class="about-layout">
          <div class="about-paras reveal">
${textContent}${taglineBlock}${statsBlock}
          </div>
          <div class="about-right">
${traitsBlock ? traitsBlock : `          <p class="about-paras" style="color:var(--text-secondary);">${esc(person.title || '')}</p>`}
          </div>
        </div>
      </div>
    </section>
`;
}

function buildSkillsSection(profile) {
  const skills     = profile.skills || [];
  const skillLevels = Array.isArray(profile.skillLevels)
    ? profile.skillLevels.filter(s => s.source)
    : [];
  const services   = Array.isArray(profile.services) ? profile.services : [];

  if (skills.length === 0) return '';

  const skillGroups = skills.map(group => {
    const groupId = 'sg-' + group.group.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const chips = (group.items || []).map(item =>
      `              <span class="skill-item">${esc(item)}</span>`
    ).join('\n');
    return `          <div class="skill-group reveal">
            <h3 class="skill-group-name" id="${esc(groupId)}">${esc(group.group)}</h3>
            <div class="skill-grid" role="list" aria-labelledby="${esc(groupId)}">
${chips}
            </div>
          </div>`;
  }).join('\n');

  let skillBarsBlock = '';
  if (skillLevels.length > 0) {
    const bars = skillLevels.map(sl => {
      const pct = Math.min(100, Math.max(0, Number(sl.value) || 0));
      return `          <div class="skill-bar reveal" data-pct="${esc(String(pct))}">
            <div class="skill-bar__header">
              <span class="skill-bar__label">${esc(sl.label)}</span>
              <span class="skill-bar__pct">${esc(String(pct))}%</span>
            </div>
            <div class="skill-bar__track">
              <div class="skill-bar__fill"></div>
            </div>
          </div>`;
    }).join('\n');
    skillBarsBlock = `\n        <div class="skill-bars">\n${bars}\n        </div>`;
  }

  let servicesBlock = '';
  if (services.length > 0) {
    const cards = services.map(sv =>
      `          <div class="service-card reveal">
            <div class="service-card__icon" aria-hidden="true">${sv.icon || ''}</div>
            <h3 class="service-card__title">${esc(sv.title)}</h3>
            <p class="service-card__desc">${esc(sv.description)}</p>
          </div>`
    ).join('\n');
    servicesBlock = `\n        <div class="services-grid">\n${cards}\n        </div>`;
  }

  return `    <!-- Skills -->
    <section id="skills" class="section" aria-labelledby="skills-heading">
      <div class="container">
        <div class="section-heading">
          <p class="section-heading__label">Tech Stack</p>
          <h2 id="skills-heading" class="section-heading__title">Skills &amp; Technologies</h2>
        </div>
        <div class="skills-layout">
          <div class="skill-groups">
${skillGroups}
          </div>${skillBarsBlock}${servicesBlock}
        </div>
      </div>
    </section>
`;
}

function buildPortfolioSection(publicProjects, siteUrl) {
  if (publicProjects.length === 0) return '';

  // Build filter tabs only when >= 2 distinct categories
  const categories = [...new Set(publicProjects.map(p => p.category).filter(Boolean))];
  let filterHtml = '';
  if (categories.length >= 2) {
    const allBtn = `          <button class="filter-btn filter-btn--active" role="tab" aria-selected="true" data-filter="all" aria-controls="project-grid">All</button>`;
    const catBtns = categories.map(cat =>
      `          <button class="filter-btn" role="tab" aria-selected="false" data-filter="${esc(cat)}" aria-controls="project-grid">${esc(cat.charAt(0).toUpperCase() + cat.slice(1))}</button>`
    ).join('\n');
    filterHtml = `        <div class="portfolio-filter" role="tablist" aria-label="Filter projects">\n${allBtn}\n${catBtns}\n        </div>\n`;
  }

  const cards = publicProjects.map(project => {
    const detailUrl = `projects/${project.slug}/`;
    const catAttr = project.category ? ` data-category="${esc(project.category)}"` : '';

    const stackTags = (project.stack || []).slice(0, 5).map(s =>
      `            <span class="project-card__stack-tag">${esc(s)}</span>`
    ).join('\n');

    const firstHighlight = (project.highlights || [])[0];
    const highlightBlock = firstHighlight
      ? `\n          <p class="project-card__highlight">${esc(firstHighlight.text)}</p>`
      : '';

    const linkItems = [];
    if (project.links && project.links.demo) {
      linkItems.push(
        `            <a href="${esc(project.links.demo)}" class="project-card__link" target="_blank" rel="noopener noreferrer">Demo ${SVG_ARROW_UPRIGHT}</a>`
      );
    }
    if (project.links && project.links.repo) {
      linkItems.push(
        `            <a href="${esc(project.links.repo)}" class="project-card__link" target="_blank" rel="noopener noreferrer">Repo ${SVG_ARROW_UPRIGHT}</a>`
      );
    }
    // Always link to detail page
    linkItems.push(
      `            <a href="${esc(detailUrl)}" class="project-card__link">Details ${SVG_ARROW_UPRIGHT}</a>`
    );

    return `          <article class="project-card reveal"${catAttr} aria-label="${esc(project.name)}">
            <div class="project-card__stack">
${stackTags}
            </div>
            <h3 class="project-card__name">${esc(project.name)}</h3>
            <p class="project-card__summary">${esc(project.summary)}</p>${highlightBlock}
            <div class="project-card__links">
${linkItems.join('\n')}
            </div>
          </article>`;
  }).join('\n');

  const githubLink = '';  // footer link to GitHub is optional — omit if no github

  return `    <!-- Portfolio -->
    <section id="portfolio" class="section" aria-labelledby="portfolio-heading">
      <div class="container">
        <div class="section-heading">
          <p class="section-heading__label">Work</p>
          <h2 id="portfolio-heading" class="section-heading__title">My Portfolio</h2>
        </div>
${filterHtml}        <div id="project-grid" class="project-grid">
${cards}
        </div>
      </div>
    </section>
`;
}

function buildExperienceSection(experience) {
  if (!experience || experience.length === 0) return '';

  const items = experience.map(exp => {
    const bullets = (exp.bullets || []).map(b =>
      `                <li>${esc(b)}</li>`
    ).join('\n');
    const bulletsBlock = bullets
      ? `\n              <ul class="exp-bullets">\n${bullets}\n              </ul>`
      : '';
    return `          <div class="timeline-item reveal">
            <div class="timeline-dot" aria-hidden="true"></div>
            <div class="exp-card">
              <div class="exp-header">
                <div>
                  <h3 class="exp-role">${esc(exp.role)}</h3>
                  <p class="exp-org">${esc(exp.org)}</p>
                </div>
                <span class="exp-period">${esc(exp.period || '')}</span>
              </div>${bulletsBlock}
            </div>
          </div>`;
  }).join('\n');

  return `    <!-- Experience -->
    <section id="experience" class="section" aria-labelledby="experience-heading">
      <div class="container">
        <div class="section-heading">
          <p class="section-heading__label">Journey</p>
          <h2 id="experience-heading" class="section-heading__title">Experience</h2>
        </div>
        <div class="timeline">
${items}
        </div>
      </div>
    </section>
`;
}

function buildEducationSection(education) {
  if (!education || education.length === 0) return '';

  const items = education.map(edu =>
    `          <div class="edu-card reveal">
            <div>
              <h3 class="edu-degree">${esc(edu.degree)}</h3>
              <p class="edu-school">${esc(edu.school)}</p>
            </div>
            <span class="edu-period">${esc(edu.period || '')}</span>
          </div>`
  ).join('\n');

  return `    <!-- Education -->
    <section id="education" class="section" aria-labelledby="education-heading">
      <div class="container">
        <div class="section-heading">
          <p class="section-heading__label">Academic</p>
          <h2 id="education-heading" class="section-heading__title">Education</h2>
        </div>
        <div class="edu-list">
${items}
        </div>
      </div>
    </section>
`;
}

function buildTestimonialsSection(profile) {
  const testimonials = Array.isArray(profile.testimonials) ? profile.testimonials : [];
  if (testimonials.length === 0) return '';

  const cards = testimonials.map(t =>
    `        <div class="testimonial-card" role="listitem">
          <span class="testimonial-quote-mark" aria-hidden="true">&#8220;</span>
          <p class="testimonial-quote">${esc(t.quote)}</p>
          <div class="testimonial-author-info">
            <span class="testimonial-author">${esc(t.author)}</span>
            <span class="testimonial-role">${esc(t.role || '')}</span>
          </div>
        </div>`
  ).join('\n');

  const dots = testimonials.map((_, i) =>
    `          <button class="testimonials-dot${i === 0 ? ' is-active' : ''}" aria-label="Go to testimonial ${i + 1}" aria-selected="${i === 0 ? 'true' : 'false'}"></button>`
  ).join('\n');

  const prevNext = testimonials.length > 1 ? `
          <button class="testimonials-btn" data-dir="prev" aria-label="Previous testimonial">${SVG_PREV}</button>
          <div class="testimonials-dots" role="tablist" aria-label="Testimonials navigation">
${dots}
          </div>
          <button class="testimonials-btn" data-dir="next" aria-label="Next testimonial">${SVG_NEXT}</button>` : `
          <div class="testimonials-dots">
${dots}
          </div>`;

  return `    <!-- Testimonials -->
    <section id="testimonials" class="section" aria-labelledby="testimonials-heading">
      <div class="container">
        <div class="section-heading">
          <p class="section-heading__label">Feedback</p>
          <h2 id="testimonials-heading" class="section-heading__title">What Clients Say</h2>
        </div>
        <div class="testimonials-wrapper" aria-roledescription="carousel" aria-label="Client testimonials">
          <div class="testimonials-track" role="list" aria-live="polite" data-testimonials-live>
${cards}
          </div>
        </div>
        <div class="testimonials-nav">${prevNext}
        </div>
      </div>
    </section>
`;
}

function buildPricingSection(profile) {
  const pricing     = Array.isArray(profile.pricing) ? profile.pricing : [];
  const pricingPerks = Array.isArray(profile.pricingPerks) ? profile.pricingPerks : [];
  if (pricing.length === 0) return '';

  const cards = pricing.map(plan => {
    const popularBadge = plan.popular ? `\n          <span class="badge-popular">Most Popular</span>` : '';
    const features = (plan.features || []).map(f =>
      `            <li>${SVG_CHECK} ${esc(f)}</li>`
    ).join('\n');
    const ctaClass = plan.popular ? 'btn-primary' : 'btn-secondary';
    return `        <div class="pricing-card${plan.popular ? ' pricing-card--popular' : ''} reveal">${popularBadge}
          <h3 class="pricing-card__name">${esc(plan.name)}</h3>
          <p class="pricing-card__desc">${esc(plan.description || '')}</p>
          <div class="pricing-card__price">
            <span class="pricing-card__price-amount">${esc(plan.price)}</span>
            <span class="pricing-card__price-unit">${esc(plan.unit || '')}</span>
          </div>
          <ul class="pricing-features">
${features}
          </ul>
          <a href="#contact" class="${ctaClass}">Get started</a>
        </div>`;
  }).join('\n');

  let perksBlock = '';
  if (pricingPerks.length > 0) {
    const perkItems = pricingPerks.map(p =>
      `          <span class="pricing-perks__item">${esc(p)}</span>`
    ).join('\n');
    perksBlock = `\n        <div class="pricing-perks">
          <p class="pricing-perks__title">All plans include</p>
          <div class="pricing-perks__list">
${perkItems}
          </div>
        </div>`;
  }

  return `    <!-- Pricing -->
    <section id="pricing" class="section" aria-labelledby="pricing-heading">
      <div class="container">
        <div class="section-heading">
          <p class="section-heading__label">Services</p>
          <h2 id="pricing-heading" class="section-heading__title">Services &amp; Pricing</h2>
        </div>
        <div class="pricing-grid">
${cards}
        </div>${perksBlock}
      </div>
    </section>
`;
}

function buildContactSection(profile) {
  const { person } = profile;

  const infoLinks = [];
  if (person.email) {
    infoLinks.push(
      `          <a href="mailto:${esc(person.email)}" class="contact-link">${SVG_EMAIL} ${esc(person.email)}</a>`
    );
  }
  if (person.links && person.links.github) {
    infoLinks.push(
      `          <a href="${esc(person.links.github)}" class="contact-link" target="_blank" rel="noopener noreferrer">${SVG_GITHUB} GitHub ${SVG_ARROW_UPRIGHT}</a>`
    );
  }
  if (person.links && person.links.linkedin && isLinkedInUrlClean(person.links.linkedin)) {
    infoLinks.push(
      `          <a href="${esc(person.links.linkedin)}" class="contact-link" target="_blank" rel="noopener noreferrer">${SVG_LINKEDIN} LinkedIn ${SVG_ARROW_UPRIGHT}</a>`
    );
  }
  if (person.location) {
    infoLinks.push(
      `          <span class="contact-link">${SVG_LOCATION} ${esc(person.location)}</span>`
    );
  }
  if (person.phone) {
    infoLinks.push(
      `          <a href="tel:${esc(person.phone)}" class="contact-link">${SVG_PHONE} ${esc(person.phone)}</a>`
    );
  }

  const mailtoFallback = person.email
    ? `<a href="mailto:${esc(person.email)}" class="btn-secondary">Email directly ${SVG_ARROW_UPRIGHT}</a>`
    : '';

  return `    <!-- Contact -->
    <section id="contact" class="section" aria-labelledby="contact-heading">
      <div class="container">
        <div class="section-heading">
          <p class="section-heading__label">Contact</p>
          <h2 id="contact-heading" class="section-heading__title">Get in Touch</h2>
        </div>
        <div class="contact-grid">
          <div class="contact-info reveal">
            <h3 class="contact-info__title">Let&#8217;s work together</h3>
            <p class="contact-info__desc">Have a project in mind? Feel free to reach out.</p>
            <div class="contact-info__links">
${infoLinks.join('\n')}
            </div>
          </div>
          <div class="contact-form-wrap reveal">
            <form class="contact-form" id="contact-form" novalidate data-email="${esc(person.email || '')}">
              <div class="form-group">
                <label for="f-name">Name</label>
                <input type="text" id="f-name" name="name" required autocomplete="name" aria-required="true" placeholder="Your name">
              </div>
              <div class="form-group">
                <label for="f-email">Email</label>
                <input type="email" id="f-email" name="email" required autocomplete="email" aria-required="true" placeholder="your@email.com">
              </div>
              <div class="form-group">
                <label for="f-subject">Subject</label>
                <input type="text" id="f-subject" name="subject" placeholder="Project inquiry">
              </div>
              <div class="form-group">
                <label for="f-message">Message</label>
                <textarea id="f-message" name="message" required rows="5" aria-required="true" placeholder="Tell me about your project..."></textarea>
              </div>
              <button type="submit" class="btn-primary">Send Message</button>
            </form>
            <div class="form-noscript">
              ${mailtoFallback}
            </div>
          </div>
        </div>
      </div>
    </section>
`;
}

function buildFooterHtml(profile, publicProjects, hasExperience, hasEducation, year) {
  const { person } = profile;
  const initials = getInitials(person.name);
  const hasTestimonials = Array.isArray(profile.testimonials) && profile.testimonials.length > 0;
  const hasPricing = Array.isArray(profile.pricing) && profile.pricing.length > 0;
  const hasProjects = publicProjects.length > 0;

  const navItems = [
    { href: '#about',   label: 'About',   always: true },
    { href: '#skills',  label: 'Skills',  always: true },
    { href: '#portfolio', label: 'Portfolio', cond: hasProjects },
    { href: '#experience', label: 'Experience', cond: hasExperience },
    { href: '#education', label: 'Education', cond: hasEducation },
    { href: '#testimonials', label: 'Testimonials', cond: hasTestimonials },
    { href: '#pricing', label: 'Pricing', cond: hasPricing },
    { href: '#contact', label: 'Contact', always: true },
  ].filter(it => it.always || it.cond);

  const navLinks = navItems.map(it =>
    `          <a href="${esc(it.href)}">${esc(it.label)}</a>`
  ).join('\n');

  const socialLinks = [];
  if (person.links && person.links.github) {
    socialLinks.push(
      `          <a href="${esc(person.links.github)}" target="_blank" rel="noopener noreferrer" aria-label="GitHub">${SVG_GITHUB}</a>`
    );
  }
  if (person.links && person.links.linkedin && isLinkedInUrlClean(person.links.linkedin)) {
    socialLinks.push(
      `          <a href="${esc(person.links.linkedin)}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">${SVG_LINKEDIN}</a>`
    );
  }
  if (person.email) {
    socialLinks.push(
      `          <a href="mailto:${esc(person.email)}" aria-label="Email">${SVG_EMAIL}</a>`
    );
  }

  const tagline = person.tagline || person.title || '';

  return `  <footer class="site-footer" role="contentinfo">
    <div class="container footer-inner">
      <div class="footer-brand">
        <span class="footer-logo">${esc(initials)}</span>
        <span class="footer-tagline">${esc(tagline)}</span>
      </div>
      <nav class="footer-nav" aria-label="Footer navigation">
${navLinks}
      </nav>
      <div class="footer-social">
${socialLinks.join('\n')}
      </div>
    </div>
    <div class="footer-copy container">
      <p>&#169; ${esc(String(year))} ${esc(person.name)}. All rights reserved.</p>
    </div>
  </footer>`;
}

/* ── 404 page ── */
function build404Page(profile, ogImageUrl, assetsPath) {
  const { site, person } = profile;
  const locale = site.locale || 'en';
  const themeColor = site.themeColor || '#0f172a';
  const siteUrl = site.url.endsWith('/') ? site.url : site.url + '/';
  return `<!doctype html>
<html lang="${esc(locale)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>404 Not Found &#8212; ${esc(person.name)}</title>
  <meta name="description" content="Page not found">
  <link rel="canonical" href="${esc(siteUrl)}">
  <meta property="og:image" content="${esc(ogImageUrl)}">
  <meta property="og:image:alt" content="${esc(person.name + ' — ' + (person.title || 'Portfolio'))}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${esc(ogImageUrl)}">
  <meta name="theme-color" content="${esc(themeColor)}">
  <link rel="stylesheet" href="${esc(assetsPath)}assets/style.css">
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <main id="main-content">
    <div class="error-page">
      <h1 class="error-code">404</h1>
      <p class="error-message">Page not found.</p>
      <a href="${esc(siteUrl)}" class="btn-primary">Back to home</a>
    </div>
  </main>
</body>
</html>`;
}

/* ── Index page ── */
function buildIndexPage(profile, indexTpl, ogImageUrl, outDir) {
  const { site, person, skills, projects, experience, education } = profile;
  const locale = site.locale || 'en';
  const siteUrl = site.url.endsWith('/') ? site.url : site.url + '/';
  const themeColor = site.themeColor || '#0f172a';
  const year = new Date().getFullYear();

  const publicProjects = (projects || []).filter(p => p.visibility === 'public');
  const hasExperience  = (experience || []).length > 0;
  const hasEducation   = (education  || []).length > 0;

  const pageTitle = `${esc(person.name)} — ${esc(person.title || 'Portfolio')}`;
  const metaDesc  = esc(person.summary || person.title || person.name);
  const canonical = siteUrl;
  const jsonLd    = buildJsonLd(profile);

  const headerHtml = buildHeaderHtml(profile, publicProjects, hasExperience, hasEducation);
  const footerHtml = buildFooterHtml(profile, publicProjects, hasExperience, hasEducation, year);

  const mainSections = [
    buildHeroSection(profile, siteUrl),
    buildAboutSection(profile),
    buildSkillsSection(profile),
    buildPortfolioSection(publicProjects, siteUrl),
    buildExperienceSection(experience),
    buildEducationSection(education),
    buildTestimonialsSection(profile),
    buildPricingSection(profile),
    buildContactSection(profile),
  ].join('');

  return indexTpl
    .replace(/\{\{LANG\}\}/g, esc(locale))
    .replace(/\{\{PAGE_TITLE\}\}/g, pageTitle)
    .replace(/\{\{META_DESCRIPTION\}\}/g, metaDesc)
    .replace(/\{\{CANONICAL\}\}/g, esc(canonical))
    .replace(/\{\{OG_TITLE\}\}/g, pageTitle)
    .replace(/\{\{OG_DESCRIPTION\}\}/g, metaDesc)
    .replace(/\{\{OG_URL\}\}/g, esc(canonical))
    .replace(/\{\{OG_IMAGE\}\}/g, esc(ogImageUrl))
    .replace(/\{\{OG_IMAGE_ALT\}\}/g, esc(`${person.name} — ${person.title || 'Portfolio'}`))
    .replace(/\{\{THEME_COLOR\}\}/g, esc(themeColor))
    .replace(/\{\{JSONLD\}\}/g, jsonLd)
    .replace(/\{\{ASSETS_PATH\}\}/g, '')
    .replace(/\{\{HEADER_HTML\}\}/g, headerHtml)
    .replace(/\{\{MAIN_SECTIONS\}\}/g, mainSections)
    .replace(/\{\{FOOTER_HTML\}\}/g, footerHtml);
}

/* ── Project detail page ── */
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
  const rootPath   = '../../';

  const metaParts = [project.role, project.period].filter(Boolean).map(esc);
  const projectMeta = metaParts.join(' &middot; ');

  const stackChips = (project.stack || []).map(s =>
    `          <span class="chip">${esc(s)}</span>`
  ).join('\n') + '\n';

  let highlightsBlock = '';
  if ((project.highlights || []).length > 0) {
    const items = project.highlights.map(h =>
      `          <li>${esc(h.text)}</li>`
    ).join('\n');
    highlightsBlock = `      <div class="project-detail__section">
        <h2>Highlights</h2>
        <ul class="project-detail__highlights">
${items}
        </ul>
      </div>
`;
  }

  let metricsBlock = '';
  if ((project.metrics || []).length > 0) {
    const cards = project.metrics.map(m =>
      `          <div class="metric-card">
            <p class="metric-value">${esc(m.value)}</p>
            <p class="metric-label">${esc(m.label)}</p>
          </div>`
    ).join('\n');
    metricsBlock = `      <div class="project-detail__section">
        <h2>Metrics</h2>
        <div class="metrics-grid">
${cards}
        </div>
      </div>
`;
  }

  let linksBlock = '';
  const linkItems = [];
  if (project.links && project.links.repo) {
    linkItems.push(
      `          <a href="${esc(project.links.repo)}" class="btn-secondary" target="_blank" rel="noopener noreferrer">View Repo ${SVG_ARROW_UPRIGHT}</a>`
    );
  }
  if (project.links && project.links.demo) {
    linkItems.push(
      `          <a href="${esc(project.links.demo)}" class="btn-primary" target="_blank" rel="noopener noreferrer">Live Demo ${SVG_ARROW_UPRIGHT}</a>`
    );
  }
  if (linkItems.length > 0) {
    linksBlock = `      <div class="project-detail__section">
        <h2>Links</h2>
        <div class="detail-links">
${linkItems.join('\n')}
        </div>
      </div>
`;
  }

  // Build a minimal header & footer for project page
  const publicProjects = (profile.projects || []).filter(p => p.visibility === 'public');
  const hasExperience = (profile.experience || []).length > 0;
  const hasEducation  = (profile.education  || []).length > 0;
  const headerHtml = buildHeaderHtml(profile, publicProjects, hasExperience, hasEducation)
    .replace(/href="assets\/cv\.pdf"/g, `href="${rootPath}assets/cv.pdf"`)
    .replace(/href="#/g, `href="${rootPath}#`);
  const footerHtml = buildFooterHtml(profile, publicProjects, hasExperience, hasEducation, year)
    .replace(/href="#/g, `href="${rootPath}#`);

  return projectTpl
    .replace(/\{\{LANG\}\}/g, esc(locale))
    .replace(/\{\{PAGE_TITLE\}\}/g, pageTitle)
    .replace(/\{\{META_DESCRIPTION\}\}/g, metaDesc)
    .replace(/\{\{CANONICAL\}\}/g, esc(canonical))
    .replace(/\{\{OG_TITLE\}\}/g, pageTitle)
    .replace(/\{\{OG_DESCRIPTION\}\}/g, metaDesc)
    .replace(/\{\{OG_URL\}\}/g, esc(canonical))
    .replace(/\{\{OG_IMAGE\}\}/g, esc(ogImageUrl))
    .replace(/\{\{OG_IMAGE_ALT\}\}/g, esc(`${project.name} — ${person.name}`))
    .replace(/\{\{THEME_COLOR\}\}/g, esc(themeColor))
    .replace(/\{\{JSONLD\}\}/g, jsonLd)
    .replace(/\{\{ASSETS_PATH\}\}/g, rootPath)
    .replace(/\{\{ROOT_PATH\}\}/g, rootPath)
    .replace(/\{\{HEADER_HTML\}\}/g, headerHtml)
    .replace(/\{\{FOOTER_HTML\}\}/g, footerHtml)
    .replace(/\{\{PROJECT_NAME\}\}/g, esc(project.name))
    .replace(/\{\{PROJECT_META\}\}/g, projectMeta)
    .replace(/\{\{PROJECT_SUMMARY\}\}/g, esc(project.summary))
    .replace(/\{\{STACK_CHIPS\}\}/g, stackChips)
    .replace(/\{\{HIGHLIGHTS_BLOCK\}\}/g, highlightsBlock)
    .replace(/\{\{METRICS_BLOCK\}\}/g, metricsBlock)
    .replace(/\{\{LINKS_BLOCK\}\}/g, linksBlock);
}

/* ── Copy templates/assets/* → out/assets/ ── */
function copyTemplateAssets(outDir, profile) {
  const srcAssets = join(TEMPLATES, 'assets');
  if (!existsSync(srcAssets)) return;

  const files = readdirSync(srcAssets);
  if (files.length === 0) return;

  for (const file of files) {
    const src  = join(srcAssets, file);
    const stat = statSync(src);
    if (!stat.isFile()) continue;
    const dest = join(outDir, 'assets', file);
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(src, dest);
    console.log(`  copied templates/assets/${file} → assets/${file}`);
  }

  // Check resume
  if (profile.person && profile.person.resume) {
    const resumeFile = profile.person.resume.replace(/^\//, '');
    const destResume = join(outDir, resumeFile);
    if (!existsSync(destResume)) {
      console.error(
        `ERROR: person.resume is set to "${profile.person.resume}" but the file was not found.\n` +
        `Expected: ${destResume}\n` +
        `Place the file at templates/assets/cv.pdf and run build again.`
      );
      process.exit(1);
    }
  }
}

/* ── Main ── */
function main() {
  if (!existsSync(PROFILE_PATH)) {
    console.error('ERROR: Profile not found at ' + PROFILE_PATH);
    process.exit(1);
  }

  let profile;
  try {
    profile = JSON.parse(readFileSync(PROFILE_PATH, 'utf8'));
  } catch (err) {
    console.error('ERROR: Invalid JSON in ' + PROFILE_PATH + ': ' + err.message);
    process.exit(1);
  }

  const p = profile.person;
  if (!p || !p.name || !p.title || !p.summary) {
    console.error('ERROR: profile.json missing required fields: person.name, person.title, person.summary');
    process.exit(1);
  }
  if (!profile.site || !profile.site.url) {
    console.error('ERROR: profile.json missing site.url');
    process.exit(1);
  }

  // Check resume file before copying
  if (p.resume) {
    const resumeSrc = join(TEMPLATES, 'assets', p.resume.replace(/^assets\//, ''));
    if (!existsSync(resumeSrc)) {
      console.error(
        `ERROR: person.resume is "${p.resume}" but templates/assets/${p.resume.replace(/^assets\//, '')} does not exist.\n` +
        `Add the file and rebuild.`
      );
      process.exit(1);
    }
  }

  const indexTpl   = readFileSync(join(TEMPLATES, 'index.html.tpl'),   'utf8');
  const projectTpl = readFileSync(join(TEMPLATES, 'project.html.tpl'), 'utf8');
  const styleCss   = readFileSync(join(TEMPLATES, 'style.css'),        'utf8');
  const tokensCss  = readFileSync(join(TEMPLATES, 'tokens.css'),       'utf8');
  const siteJs     = readFileSync(join(TEMPLATES, 'site.js'),          'utf8');
  const ogImageTpl = readFileSync(join(TEMPLATES, 'og-image.svg'),     'utf8');

  assertDocsSafe(OUT_DIR);
  mkdirSync(OUT_DIR, { recursive: true });

  const siteUrl = profile.site.url;
  const normalizedSiteUrl = siteUrl.endsWith('/') ? siteUrl : siteUrl + '/';
  const publicProjects = (profile.projects || []).filter(p => p.visibility === 'public');

  // og-image
  let siteHost = '';
  try { siteHost = new URL(normalizedSiteUrl).hostname; } catch (_) { siteHost = normalizedSiteUrl; }
  const ogImageAlt = `${profile.person.name} — ${profile.person.title || 'Portfolio'}`;
  const ogImageSvg = ogImageTpl
    .replace(/\{\{PERSON_NAME\}\}/g, esc(profile.person.name))
    .replace(/\{\{PERSON_TITLE\}\}/g, esc(profile.person.title || ''))
    .replace(/\{\{SITE_HOST\}\}/g,   esc(siteHost))
    .replace(/\{\{OG_IMAGE_ALT\}\}/g, esc(ogImageAlt));
  writeOut(join(OUT_DIR, 'assets', 'og-image.svg'), ogImageSvg);
  console.log('  wrote assets/og-image.svg');

  const ogImageUrl = `${normalizedSiteUrl}assets/og-image.svg`;

  // Copy templates/assets/*
  copyTemplateAssets(OUT_DIR, profile);

  // index.html
  const indexHtml = buildIndexPage(profile, indexTpl, ogImageUrl, OUT_DIR);
  writeOut(join(OUT_DIR, 'index.html'), indexHtml);
  console.log('  wrote index.html');

  // project pages
  for (const project of publicProjects) {
    const html = buildProjectPage(project, profile, projectTpl, ogImageUrl);
    writeOut(join(OUT_DIR, 'projects', project.slug, 'index.html'), html);
    console.log(`  wrote projects/${project.slug}/index.html`);
  }

  // Combined CSS
  writeOut(join(OUT_DIR, 'assets', 'style.css'), tokensCss + '\n\n' + styleCss);
  writeOut(join(OUT_DIR, 'assets', 'site.js'),   siteJs);
  console.log('  wrote assets/style.css');
  console.log('  wrote assets/site.js');

  // 404.html
  writeOut(join(OUT_DIR, '404.html'), build404Page(profile, ogImageUrl, ''));
  console.log('  wrote 404.html');

  // robots.txt
  writeOut(join(OUT_DIR, 'robots.txt'), buildRobotsTxt(siteUrl));
  console.log('  wrote robots.txt');

  // sitemap.xml
  writeOut(join(OUT_DIR, 'sitemap.xml'), buildSitemapXml(siteUrl, publicProjects));
  console.log('  wrote sitemap.xml');

  // .nojekyll
  writeOut(join(OUT_DIR, '.nojekyll'), '');

  // .portfolio-build.json
  writeOut(join(OUT_DIR, '.portfolio-build.json'), JSON.stringify({
    profile: PROFILE_PATH,
    builtAt: new Date().toISOString()
  }, null, 2));

  console.log(`\nBuild complete. ${1 + publicProjects.length} HTML page(s) written to ${OUT_DIR}.`);
}

main();
