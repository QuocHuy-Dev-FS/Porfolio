# Design Specification — Portfolio Fullstack Dev
> Owner: ui-designer | Generated: 2026-11-13
> Do not edit manually. See CLAUDE.md for ownership rules.

---

## 1. Style Direction

A dark-first, single-page portfolio using a deep navy-to-teal gradient canvas with glassmorphism cards, cyan/emerald accent gradients, and subtle motion — fast to scan for recruiters, credible in detail for clients.  
Typography is entirely system fonts; no CDN, no external assets.

---

## 2. Color & Contrast Table (WCAG AA — calculated with Node)

All ratios measured against effective backgrounds. Required: ≥ 4.5:1 for body text, ≥ 3.0:1 for large text (≥ 18 px bold or ≥ 24 px regular).

| Foreground          | Background               | Effective bg hex | Ratio  | AA (4.5) | AA-large (3.0) |
|---------------------|--------------------------|------------------|--------|----------|----------------|
| `--text-primary` #f8fafc   | dark bg `--bg-start` #0b1220    | #0b1220 | 17.89:1 | PASS | PASS |
| `--text-primary` #f8fafc   | glass card `--glass-bg`         | #171e2b | 15.97:1 | PASS | PASS |
| `--text-secondary` #94a3b8 | dark bg `--bg-start` #0b1220    | #0b1220 |  7.30:1 | PASS | PASS |
| `--text-secondary` #94a3b8 | glass card `--glass-bg`         | #171e2b |  6.52:1 | PASS | PASS |
| `--accent-cyan` #06b6d4    | dark bg `--bg-start` #0b1220    | #0b1220 |  7.71:1 | PASS | PASS |
| `--accent-emerald` #10b981 | dark bg `--bg-start` #0b1220    | #0b1220 |  7.38:1 | PASS | PASS |
| `--btn-text` #ffffff       | btn start `--btn-bg-start` #0e7490 | #0e7490 | 5.36:1 | PASS | PASS |
| `--btn-text` #ffffff       | btn end `--btn-bg-end` #047857     | #047857 | 5.48:1 | PASS | PASS |

**Note on button gradient:** The original accent cyan (#06b6d4) and emerald (#10b981) produce only 2.43:1 / 2.54:1 against white — both FAIL AA. Button background uses darker stops `--btn-bg-start: #0e7490` and `--btn-bg-end: #047857` to achieve ≥ 5.3:1. The bright accents remain for decorative/text use only.

---

## 3. Token Reference (from `templates/tokens.css`)

```
--bg-gradient          160deg: #0b1220 → #0f172a 55% → #042f2e
--bg-surface           #111827
--accent-cyan          #06b6d4   (decorative, text highlights)
--accent-emerald       #10b981   (decorative, text highlights)
--accent-gradient      135deg: cyan → emerald
--btn-gradient         135deg: #0e7490 → #047857  (button bg only)
--btn-text             #ffffff
--glass-bg             rgba(255,255,255,.05)
--glass-border         rgba(255,255,255,.10)
--glass-blur           12px
--text-primary         #f8fafc
--text-secondary       #94a3b8
--text-muted           #64748b
--text-on-accent       #0b1220
--font-sans            system ui-sans-serif stack
--font-mono            ui-monospace / Cascadia Code / Consolas stack
--space-1 … --space-24 0.25 rem … 6 rem
--radius-sm…--radius-full
--shadow-sm/md/lg
--glow-cyan / --glow-emerald / --glow-hero
--header-h             4rem (64 px)
--content-max          1200px
--z-progress           50  (scroll progress bar)
--duration-fast/base/slow/slower
```

---

## 4. Layout — 9 Sections (top → bottom)

### 4.0 Scroll Progress Bar
- Fixed `position: fixed; top: 0; right: 0; height: 100vh; width: 3px; z-index: var(--z-progress)`.
- Inner fill div driven by JS `scrollY / (scrollHeight - innerHeight) * 100%`.
- Background: `var(--accent-gradient)` on the fill strip.
- Class: `.scroll-progress` (outer), `.scroll-progress__fill` (inner).

### 4.1 Header (fixed, glassmorphism)
```
<header class="site-header" role="banner">
  <nav class="nav container" aria-label="Main navigation">
    [logo/name wordmark left]   [nav links center/right]   [CTA button far right]
  </nav>
</header>
```
- `position: fixed; top: 0; width: 100%; z-index: var(--z-sticky)`.
- Background: `var(--glass-bg); backdrop-filter: blur(var(--glass-blur)); border-bottom: 1px solid var(--glass-border)`.
- Logo: site owner initials "QH" styled with `--accent-gradient` as background-clip text, `font-weight: 700`.
- Nav links: `color: var(--text-secondary)`, hover → `var(--text-primary)` + `color` transition `var(--duration-base)`.
- Active link: underline or left-border in `--accent-cyan`.
- CTA button: `.btn-primary` (see §6).
- Mobile (< 768 px): hamburger icon (SVG inline), nav collapses into a glass drawer sliding from top or side.
- Skip-link: `<a class="skip-link" href="#main-content">Skip to content</a>` as first element in `<body>`; visible on focus only.

### 4.2 Hero (full viewport, 2-column)
```
<section id="hero" class="hero section" aria-labelledby="hero-heading">
  [col-left]  heading + tagline + badges + CTA buttons
  [col-right] .hero-avatar (circle with initials + floating badges)
</section>
```
**Left column:**
- `<h1 id="hero-heading" class="hero-name">` — name text, `font-size: clamp(2.5rem, 6vw, 4.5rem)`, animated with `gradient-shift` (background-clip text, `--accent-gradient` 300% wide).
- `<p class="hero-title">` — job title, `font-size: var(--text-xl)`, `color: var(--text-secondary)`.
- `<p class="hero-summary">` — one-sentence intro, `color: var(--text-secondary)`.
- `<div class="hero-badges">` — up to 4 tech badges from `skills[0].items[0..3]`; each `.badge` pill: `background: var(--glass-bg); border: 1px solid var(--glass-border); color: var(--text-primary); padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); animation: float-enhanced 4s ease-in-out infinite;` staggered delays 0 / 0.5 / 1 / 1.5 s.
- Availability badge (render only if `person.available === true`): green dot + "Available for work".
- CTA row: `.btn-primary` (Contact), `.btn-secondary` (View Projects), optional `.btn-ghost` (Download CV — render only if `person.resume` exists).

**Right column:**
- `.hero-avatar-wrap` — `position: relative; width: clamp(220px, 30vw, 320px); aspect-ratio: 1`.
- `.hero-avatar` — circle, background `var(--accent-gradient)`; `animation: pulse-glow-enhanced 3s ease-in-out infinite`.
- `.hero-avatar__initials` — text "QH" (from `person.name`), `font-size: clamp(2.5rem, 8vw, 4rem); font-weight: 800; color: var(--bg-start)`.
- `.hero-floating-badge` ×4 — absolute positioned around circle, same pill style as hero-badges, `animation: float-enhanced`.
- Decorative background blur circles: 2 × `position: absolute` divs with `--glow-hero` radial gradient, `pointer-events: none; aria-hidden`.

**Layout:**
- 1024 px+: CSS grid `grid-template-columns: 1fr 1fr; gap: var(--space-16)`, left col first.
- 768–1023 px: same grid but `1fr 1fr` gap reduced.
- < 768 px: single column, avatar below text, centered.
- Minimum 100 dvh height; `padding-block: calc(var(--header-h) + var(--space-16)) var(--space-16)`.

### 4.3 About (render always)
```
<section id="about" class="about section" aria-labelledby="about-heading">
  <h2 id="about-heading">About</h2>
  [text column]  [trait grid column]
</section>
```
**Text column:**
- `<p>` per item in `person.about[]`. Render only if `person.about` array exists and is non-empty; otherwise render `person.summary` as a single paragraph.
- If `person.tagline` exists: `<p class="about-tagline">` styled with `--accent-gradient` background-clip text.

**Trait grid (render only if `traits[]` non-empty):**
- 2–3 col grid of `.trait-card` items (glass card style).
- Each: SVG icon (inline, 24×24) + short label text.
- Max 6 traits.

**Stats row (render only if `stats[]` non-empty, each item has `source`):**
- Horizontal flex row of `.stat-item`: large number in accent gradient + small label.

### 4.4 Skills & Tech Stack (render always)
```
<section id="skills" class="skills section" aria-labelledby="skills-heading">
  <h2 id="skills-heading">Skills & Tech Stack</h2>
  [skill group tabs or headings]
  [icon grid per group]
  [skill level bars — only if skillLevels[] non-empty]
</section>
```
**Icon grid:**
- Per `skills[]` group: `<h3>` heading + `.skill-grid` flex/grid of `.skill-item` pills.
- Each pill: glass card, monospace label, optional inline SVG icon.

**Skill level bars (render only if `skillLevels[]` non-empty, each has `source`):**
- `.skill-bar` row: label left, percentage right, animated fill bar on reveal.
- Bar fill uses `--accent-gradient`; `width: 0` initially → JS sets `--skill-pct` and adds `.is-visible` class → CSS animation `progress-fill`.

### 4.5 Portfolio (render always, at least 1 public project)
```
<section id="portfolio" class="portfolio section" aria-labelledby="portfolio-heading">
  <h2 id="portfolio-heading">Portfolio</h2>
  <div class="portfolio-filter" role="tablist" aria-label="Filter projects">
    [All] [Web] [Mobile] [API] [Open Source] — render only categories that exist
  </div>
  <div class="project-grid">
    [.project-card × n]
  </div>
</section>
```
**Filter tabs:**
- Render only tab buttons for categories present in public projects + "All".
- Active tab: `--accent-gradient` underline or background.
- JS toggles `data-hidden` attribute on cards; hidden cards get `display: none`.
- When only 1 category or no `category` on any project: hide filter row entirely.

**Project card `.project-card` spec:**
```
[stack badge row]
[project name — <h3>]
[summary — 1-2 sentences]
[key highlight (first item of highlights[], if present)]
[tech stack pills]
[link row: Demo ↗  |  Repo ↗]
```
- Glass card: `background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-xl); backdrop-filter: blur(var(--glass-blur)); padding: var(--space-6)`.
- Hover: `background: var(--glass-bg-hover); border-color: var(--border-accent); box-shadow: var(--glow-cyan); transform: translateY(-4px); transition: all var(--duration-slow) var(--ease-out)`.
- Card links open in new tab with `rel="noopener noreferrer"`.
- Render only projects with `visibility: "public"`.

**Project detail page** (`/projects/<slug>/`):
```
<article>
  <h1>[project name]</h1>
  <p class="meta">[role] · [stack comma-list]</p>
  <section>
    <h2>Overview</h2>
    <p>[summary]</p>
  </section>
  <section>  <!-- render only if highlights[] non-empty -->
    <h2>Highlights</h2>
    <ul>[highlights[].text with source as <cite> or link]</ul>
  </section>
  <section>  <!-- render only if metrics[] non-empty, each has source -->
    <h2>Metrics</h2>
    <dl>[label / value / source]</dl>
  </section>
  <footer class="project-links">
    [Demo link if exists]  [Repo link if exists]
  </footer>
</article>
```
- Has own `<h1>`, correct heading order (h1→h2→h3).
- Back link to `/#portfolio`.

### 4.6 Testimonials (render only if `testimonials[]` non-empty)
```
<section id="testimonials" class="testimonials section" aria-labelledby="testimonials-heading">
  <h2 id="testimonials-heading">What Clients Say</h2>
  <div class="testimonials-track" role="list">
    [.testimonial-card × n]
  </div>
  [prev/next buttons or dots navigation]
</section>
```
**`.testimonial-card`:**
- Glass card, slight 3D tilt on hover (`transform: perspective(600px) rotateY(4deg)` or rotateX).
- Quote text in `var(--text-primary)`, author bold, role in `var(--text-secondary)`.
- Opening `"` mark in `--accent-gradient` background-clip.
- Carousel: auto-advance every 5 s (paused on hover, paused if `prefers-reduced-motion`); JS controls.
- CSS: `overflow: hidden` on track, slides use `transform: translateX` for smooth transition.

### 4.7 Pricing (render only if `pricing[]` non-empty)
```
<section id="pricing" class="pricing section" aria-labelledby="pricing-heading">
  <h2 id="pricing-heading">Services & Pricing</h2>
  <div class="pricing-grid">
    [.pricing-card × n]  <!-- popular card has .pricing-card--popular -->
  </div>
  [pricingPerks list — render only if pricingPerks[] non-empty]
</section>
```
**`.pricing-card`:**
- Glass card; popular card: `border-color: var(--border-accent); box-shadow: var(--glow-cyan)`.
- Popular badge: `.badge-popular` pill with `--btn-gradient` background.
- Price: large number + unit, name + description above.
- Features: `<ul>` with checkmark SVG icon per item.
- CTA button: `.btn-primary` for popular, `.btn-secondary` for others.

### 4.8 Contact (render always)
```
<section id="contact" class="contact section" aria-labelledby="contact-heading">
  <h2 id="contact-heading">Get in Touch</h2>
  <div class="contact-grid">
    [info column]   [form column]
  </div>
</section>
```
**Info column:** email link, GitHub link, LinkedIn link (only if URL is clean/encoded), location.

**Form column:**
```html
<form class="contact-form" id="contact-form" novalidate>
  <input type="text"  name="name"    id="f-name"    required autocomplete="name">
  <input type="email" name="email"   id="f-email"   required autocomplete="email">
  <textarea           name="message" id="f-message" required rows="5"></textarea>
  <button type="submit" class="btn-primary">Send</button>
</form>
<noscript>
  <a href="mailto:[email]" class="btn-primary">Email directly</a>
</noscript>
```
- JS intercepts submit → builds `mailto:` URL → `window.location.href`.
- `<noscript>` fallback: direct mailto link (required for JS-disabled accessibility).
- Labels: `<label for="...">` on every input (not placeholder-only).

### 4.9 Footer
```
<footer class="site-footer" role="contentinfo">
  <div class="container footer-inner">
    [left: logo/name + tagline]
    [center: nav links]
    [right: social icon links]
  </div>
  <p class="footer-copy">[copyright year] [name]</p>
</footer>
```
- Background: `--bg-surface`; top border `1px solid var(--border-subtle)`.
- Social icons: SVG inline, `aria-label` on each `<a>`.

---

## 5. Responsive Breakpoints

| Name   | Min-width | Key changes |
|--------|-----------|-------------|
| xs     | 320 px    | Minimum supported; no horizontal scroll; single column; font-size clamped |
| sm     | 375 px    | Slight padding increase |
| md     | 768 px    | 2-column hero; nav visible; 2-col skill grid |
| lg     | 1024 px   | Full 2-col hero with avatar; 3-col project grid |
| xl     | 1440 px   | Max content width applied; wider padding |

**No-scroll-at-320 rules:**
- `max-width: 100%` on `.container`.
- `word-break: break-word` on headings.
- Hero avatar: `max-width: min(280px, 80vw)`.
- All grid templates fall back to `1fr` at 320 px.

---

## 6. Component Specs

### `.btn-primary`
```css
background: var(--btn-gradient);
color: var(--btn-text);           /* #fff, contrast ≥ 5.36:1 */
padding: var(--space-3) var(--space-6);
border-radius: var(--radius-full);
font-weight: 600;
font-size: var(--text-sm);
border: none; cursor: pointer;
position: relative; overflow: hidden;
transition: transform var(--duration-base), box-shadow var(--duration-base);
```
- Shimmer on hover: `::before` pseudo with `var(--shimmer-bg)`, `animation: shimmer 1.2s var(--ease-in-out)` triggered by `button:hover::before`.
- Hover: `transform: translateY(-2px); box-shadow: var(--glow-emerald)`.
- Focus-visible: `outline: 2px solid var(--accent-cyan); outline-offset: 3px` (never `outline: none` without replacement).

### `.btn-secondary`
```css
background: transparent;
border: 1px solid var(--border-strong);
color: var(--text-primary);
/* same padding / radius as btn-primary */
```
- Hover: `background: var(--glass-bg); border-color: var(--border-accent)`.

### `.btn-ghost`
```css
background: transparent; border: none;
color: var(--accent-cyan);
text-decoration: underline;
```

### Glass card base
```css
background: var(--glass-bg);
border: 1px solid var(--glass-border);
border-radius: var(--radius-xl);
backdrop-filter: blur(var(--glass-blur));
-webkit-backdrop-filter: blur(var(--glass-blur));
```

### `.container`
```css
width: 100%;
max-width: var(--content-max);
margin-inline: auto;
padding-inline: clamp(var(--space-4), 5vw, var(--space-16));
```

### `.section`
```css
padding-block: var(--section-py);
```

### `.skip-link`
```css
position: absolute; top: -100%; left: var(--space-4);
background: var(--btn-gradient); color: var(--btn-text);
padding: var(--space-2) var(--space-4);
border-radius: 0 0 var(--radius-md) var(--radius-md);
z-index: calc(var(--z-progress) + 10);
transition: top var(--duration-fast);
```
- `:focus { top: 0; }` — appears at top on keyboard focus.

---

## 7. Hover & Focus States (all interactive elements)

| Element | Hover | Focus-visible |
|---------|-------|---------------|
| Nav link | color → `--text-primary`, underline | `outline: 2px solid --accent-cyan; outline-offset: 2px` |
| `.btn-primary` | translateY(-2px) + glow-emerald | same outline |
| `.btn-secondary` | glass-bg + border-accent | same outline |
| `.project-card` | translateY(-4px) + glass-bg-hover + glow-cyan + border-accent | outline on focusable child link |
| `.testimonial-card` | 3D tilt perspective | — |
| Social icon link | color → --accent-cyan | outline |
| Form input/textarea | `border-color: --border-accent; box-shadow: 0 0 0 3px rgba(6,182,212,.2)` | same as hover |

**Rule:** Never remove outline without providing an equivalent visible focus indicator.

---

## 8. Animation / Motion Rules

### Keyframes defined in `tokens.css`
| Keyframe | Usage | Duration | Iteration |
|----------|-------|----------|-----------|
| `gradient-shift` | Hero name text background-position | 4 s | infinite |
| `float-enhanced` | Hero badges, hero avatar badges | 4–6 s staggered | infinite |
| `pulse-glow-enhanced` | Hero avatar circle | 3 s | infinite |
| `shimmer` | Button ::before on hover | 1.2 s | 1 |
| `reveal` | Scroll-triggered section children | 0.6 s | 1 |
| `slide-in-left` | About text, skill bars on reveal | 0.5 s | 1 |
| `scale-in` | Project cards on reveal | 0.5 s staggered | 1 |
| `progress-fill` | Skill level bars | 1 s | 1 |
| `spin-slow` | Optional decorative ring | 20 s | infinite |

### Scroll reveal (JS-driven)
- `IntersectionObserver` with `threshold: 0.15`.
- On enter: add class `.is-visible` to `.reveal` elements → CSS plays `reveal` keyframe.
- Stagger children with `--reveal-delay: calc(var(--i, 0) * 80ms)` custom property set via JS.

### prefers-reduced-motion
- `tokens.css` already sets `animation-duration: 0.01ms; transition-duration: 0.01ms` globally when motion is reduced.
- JS must also check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` before starting carousel auto-advance and scroll-to-section smooth scroll.
- Skill bar animation: set width directly (no transition) when motion reduced.

---

## 9. Accessibility Checklist for frontend-builder

- [ ] `<html lang="en">` (or `site.locale` value).
- [ ] One `<h1>` per page; heading order h1→h2→h3, never skip levels.
- [ ] Skip-link `<a class="skip-link" href="#main-content">Skip to content</a>` as first `<body>` child.
- [ ] `<main id="main-content">` wraps sections 4.2–4.8.
- [ ] All images/SVG icons: `aria-hidden="true"` if decorative; `alt` or `aria-label` if informational.
- [ ] Interactive elements (buttons, links): visible focus ring (see §7).
- [ ] Carousel controls: `aria-label="Previous"` / `aria-label="Next"`, `aria-live="polite"` on slide region.
- [ ] Tab filter: `role="tablist"`, buttons `role="tab"`, `aria-selected`, `aria-controls`.
- [ ] Form: `<label for>` on every input; error messages via `aria-describedby`; required fields `aria-required="true"`.
- [ ] Color contrast: all pairs ≥ 4.5:1 (see §2 table).
- [ ] No motion without `prefers-reduced-motion` guard.
- [ ] `<noscript>` mailto fallback in Contact form.

---

## 10. Conditional Render Summary

| Section / Element | Renders when |
|---|---|
| Availability badge (Hero) | `person.available === true` |
| Download CV button | `person.resume` key exists in profile.json |
| About extended paragraphs | `person.about[]` exists and non-empty |
| Tagline | `person.tagline` exists |
| Trait grid | `traits[]` exists and non-empty |
| Stats row | `stats[]` exists, non-empty, each item has `source` |
| Skill level bars | `skillLevels[]` exists, non-empty, each item has `source` |
| Portfolio filter tabs | ≥ 2 distinct `category` values among public projects |
| Testimonials section | `testimonials[]` exists and non-empty |
| Pricing section | `pricing[]` exists and non-empty |
| pricingPerks list | `pricingPerks[]` exists and non-empty |
| LinkedIn link | `person.links.linkedin` present AND URL contains no unencoded non-ASCII |
| Resume link in Footer | same as Download CV button |

---

## 11. CSS Class & Variable Checklist for frontend-builder

**Layout classes:** `.skip-link`, `.site-header`, `.nav`, `.container`, `.main-content`, `.section`, `.site-footer`, `.footer-inner`, `.footer-copy`

**Hero:** `.hero`, `.hero-name`, `.hero-title`, `.hero-summary`, `.hero-badges`, `.badge`, `.hero-avatar-wrap`, `.hero-avatar`, `.hero-avatar__initials`, `.hero-floating-badge`, `.hero-deco`

**Buttons:** `.btn-primary`, `.btn-secondary`, `.btn-ghost`

**About:** `.about`, `.about-tagline`, `.trait-grid`, `.trait-card`, `.stats-row`, `.stat-item`

**Skills:** `.skills`, `.skill-group`, `.skill-grid`, `.skill-item`, `.skill-bars`, `.skill-bar`, `.skill-bar__fill`, `.is-visible`

**Portfolio:** `.portfolio`, `.portfolio-filter`, `.filter-btn`, `.filter-btn--active`, `.project-grid`, `.project-card`, `.project-card__stack`, `.project-card__name`, `.project-card__summary`, `.project-card__highlight`, `.project-card__tech`, `.project-card__links`

**Testimonials:** `.testimonials`, `.testimonials-track`, `.testimonial-card`, `.testimonial-quote`, `.testimonial-author`, `.testimonials-nav`

**Pricing:** `.pricing`, `.pricing-grid`, `.pricing-card`, `.pricing-card--popular`, `.badge-popular`, `.pricing-features`

**Contact:** `.contact`, `.contact-grid`, `.contact-info`, `.contact-form`

**Progress bar:** `.scroll-progress`, `.scroll-progress__fill`

**Utilities:** `.reveal` (pre-reveal state), `.is-visible` (post-reveal), `.gradient-text` (`background: var(--accent-gradient); -webkit-background-clip: text; color: transparent`)

**Key CSS variables used in templates:**
`--accent-gradient`, `--btn-gradient`, `--btn-text`, `--glass-bg`, `--glass-bg-hover`, `--glass-border`, `--glass-blur`, `--border-accent`, `--glow-cyan`, `--glow-hero`, `--text-primary`, `--text-secondary`, `--font-sans`, `--font-mono`, `--radius-xl`, `--radius-full`, `--space-*`, `--duration-base`, `--duration-slow`, `--ease-out`, `--z-sticky`, `--z-progress`, `--header-h`, `--content-max`, `--section-py`, `--skill-pct`
