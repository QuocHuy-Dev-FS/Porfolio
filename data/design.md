# Design Specification

## 1. Style Direction

A monospace-first, single-page portfolio using only system fonts — clean, minimal, and fast to scan. Dark slate (`#0f172a`) grounds the light theme; a large section-heading + accent-underline pattern (derived from devportfolio MIT reference) lets recruiters parse sections in under three seconds. Accent color switches to sky-blue (`#60a5fa`) in dark mode so interactive elements remain readable without hardcoding hex values in templates — always use `var(--color-accent)`.

---

## 2. Section Order and Wireframe

All sections live on one page (single-page application). Scroll position determines active nav link. Each section has `id` matching the nav anchor.

### 2.1 Header (sticky, `id="header"`)

```
┌─────────────────────────────────────────────────────────────┐
│  [skip to main]  ·  About · Projects · Skills ·             │
│                      Experience · Education · Contact        │
└─────────────────────────────────────────────────────────────┘
```

- Fixed top, `z-index` above content.
- Hidden at scroll-top (transparent); gains `bg: var(--color-bg) / 90%` + `backdrop-filter: blur(8px)` after scrolling 80 px (JS toggle class `.is-scrolled`).
- Skip-link is the first focusable element, visually hidden until focused: `position: absolute; top: -9999px` → `top: 0` on `:focus`.
- Nav links: `color: var(--color-text-muted)`, hover `var(--color-text)`. Active section link uses `color: var(--color-accent)`.
- On `max-width < 768 px`: hamburger button toggles a full-width drawer. Nav links stack vertically.
- One `<nav aria-label="Primary">` element.

### 2.2 Hero (`id="hero"`, `<main>` starts here, contains `<h1>`)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Hello!                                                     │
│                                                             │
│  I'm  [Name]                          ← h1, accent on name  │
│                                                             │
│  [Title]                              ← p, text-muted       │
│  [1-sentence summary]                 ← p                   │
│                                                             │
│  [Contact me ↓]   [GitHub ↗]                               │
│                                                             │
│  · · · decorative code-symbols pattern (aria-hidden) · · ·  │
└─────────────────────────────────────────────────────────────┘
```

- Full viewport height on `>= 768 px`; `min-height: 100svh` fallback.
- Radial gradient overlay: `var(--color-accent) / 25%` at top-left fading to transparent — applied only in light mode (omit in dark, or use `opacity: 0.08`).
- `<h1>` contains name; "I'm" is in a `<span>` with normal weight; name `<span>` uses `color: var(--color-accent)`.
- "Hello!" is a `<p>` or `<span>` above `<h1>` — not a heading.
- Two CTA buttons: primary "Contact me" (`href="#contact"`) and secondary "GitHub" (external link, `target="_blank" rel="noopener noreferrer"`). Primary: `bg: var(--color-accent); color: var(--color-bg)`. Secondary: `border: 1px solid var(--color-border)`.
- Social icon links at bottom of hero (email, GitHub, LinkedIn) with `aria-label`. Icons are inline SVG (no CDN). Hover: `color: var(--color-accent)`.
- Fade-in animation for hero content; wrap in `@media (prefers-reduced-motion: no-preference)`. Without that media query, elements are immediately visible.

### 2.3 About (`id="about"`)

```
┌──────────────────┬──────────────────────────────────────────┐
│  About Me        │  [summary paragraph]                     │
│  ────── (accent) │                                          │
│  h2              │  [2-3 sentences max, from profile.json   │
│                  │   person.summary]                        │
└──────────────────┴──────────────────────────────────────────┘
```

- 12-column grid: label col = 4 cols, content col = 8 cols (stacks to 1 col on `< 1024 px`).
- `<h2>` heading + 5 px accent underline div (`width: 75px; height: 5px; background: var(--color-accent); border-radius: var(--radius-full)`).
- Summary text: `font-size: var(--text-lg)`; `line-height: var(--leading-relaxed)`; `color: var(--color-text-muted)`.

### 2.4 Skills (`id="skills"`)

```
┌──────────────────┬──────────────────────────────────────────┐
│  Skills          │  Frontend                                │
│  ──────          │  [React] [Next.js] [TypeScript] …        │
│  h2              │                                          │
│                  │  Backend                                 │
│                  │  [Node.js] [Express] …                   │
│                  │                                          │
│                  │  Database / DevOps …                     │
└──────────────────┴──────────────────────────────────────────┘
```

- Same 4/8-col split as About.
- Group name: `<h3>`, `font-size: var(--text-sm)`, uppercase, `letter-spacing: 0.08em`, `color: var(--color-text-muted)`.
- Skill chip: `bg: var(--color-skill-bg); color: var(--color-skill-text); padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); font-size: var(--text-sm)`.
- Groups wrap in `<ul>` with `<li>` per chip; group container is `<div role="group" aria-labelledby="group-[name]">`.

### 2.5 Projects (`id="projects"`)

```
┌──────────────────┬──────────────────────────────────────────┐
│  Projects        │  01                                      │
│  ──────          │  [Project Name]           [↗ or detail]  │
│  h2              │  [summary]                               │
│                  │  [React] [Node.js] …                     │
│                  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─     │
│                  │  02 …                                    │
└──────────────────┴──────────────────────────────────────────┘
```

- Same 4/8-col split.
- Each project is a card (`<article>`). If `links.demo` or `links.repo` exists → card is wrapped in `<a>`; otherwise plain `<div>`.
- Card: `bg: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-xl); padding: var(--space-6)`.
- Hover (when interactive): `box-shadow: var(--shadow-lg); transform: translateY(-2px); border-color: var(--color-border)`. Wrap transition in `@media (prefers-reduced-motion: no-preference)`.
- Project number: `font-size: var(--text-sm); color: var(--color-accent)`.
- Project name: `<h3>`, `font-size: var(--text-xl); font-weight: var(--font-weight-bold)`.
- Summary: `color: var(--color-text-muted); font-size: var(--text-base)`.
- Stack chips: same style as skill chips.
- External-link icon (top-right of card): 40 px circle, `bg: var(--color-skill-bg); color: var(--color-skill-text)`, SVG arrow-up-right (`aria-hidden="true"`). Visible only when card is a link.
- Detail page (see §3).

### 2.6 Experience (`id="experience"`)

```
┌──────────────────┬──────────────────────────────────────────┐
│  Experience      │  ● [Role]               [period]        │
│  ──────          │    [Organization]                       │
│  h2              │    │                                    │
│                  │    • bullet                             │
│                  │    • bullet                             │
│                  │    │ (connector line to next card)      │
│                  │  ● [Role] …                             │
└──────────────────┴──────────────────────────────────────────┘
```

- Timeline dot + connector line pattern (from reference).
- Card: `bg: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-5)`.
- Role: `<h3>`, `font-size: var(--text-lg); font-weight: var(--font-weight-semibold)`.
- Org name: `color: var(--color-accent)`.
- Period: `font-size: var(--text-xs); color: var(--color-text-muted)`.
- Bullets: `<ul>` with `<li>`, bullet dot `4px` circle in `var(--color-text-muted)`.
- Section omitted entirely from DOM if `experience` array is empty.

### 2.7 Education (`id="education"`)

Same 4/8-col grid and card pattern as Experience, without timeline connector.

- Degree: `<h3>`, semibold.
- School: `color: var(--color-accent)`.
- Period: muted, right-aligned on `>= 480 px`.
- Achievements as `<ul>` bullets (same style as Experience bullets).
- Section omitted entirely if `education` array is empty.

### 2.8 Contact (`id="contact"`)

```
┌─────────────────────────────────────────────────────────────┐
│  Get in touch                                               │
│  ─────────────                                              │
│                                                             │
│  [doanquochuy.dev@gmail.com]   [GitHub ↗]   [LinkedIn ↗]   │
└─────────────────────────────────────────────────────────────┘
```

- Full-width centered section; `bg: var(--color-bg-card)`.
- `<h2>` heading.
- Email as `<a href="mailto:…">`, GitHub and LinkedIn as icon+text links. All `color: var(--color-text)`, hover `var(--color-accent)`.
- Section has role="contentinfo" wrapper? No — that is for `<footer>`. Contact is a `<section>`.

### 2.9 Footer

```
┌─────────────────────────────────────────────────────────────┐
│  [Name]  ·  [Title]              About · Projects · Contact │
│  [social icons]                                             │
│  © 2025 [Name]. All rights reserved.                        │
└─────────────────────────────────────────────────────────────┘
```

- `<footer>` element, `bg: var(--color-bg-card); border-top: 1px solid var(--color-border)`.
- Left: name, title, social icon row.
- Right (hidden on `< 768 px`): nav links + copyright.
- Copyright below on mobile.

---

## 3. Project Card and Detail Page

### 3.1 Project List Card (on index page)

Rendered order inside each card:

1. Sequential number (`01`, `02` …) — `color: var(--color-accent)`, `font-size: var(--text-sm)`
2. Project name (`<h3>`)
3. Summary text (1–2 sentences)
4. Stack chip list
5. Highlights list (if any) — prefixed `✓` bullet, `font-size: var(--text-sm)`, `color: var(--color-text-muted)`
6. External-link icon (absolutely positioned top-right, present only when card is a link)

### 3.2 Project Detail Page (`/projects/[slug]/index.html`)

Page has its own `<h1>` (project name). Page structure:

```
[← Back to projects]

[h1: Project Name]
[Role]  ·  [Period if available]
[Summary paragraph]

## Stack
[chip list]

## Highlights
- highlight 1
- highlight 2

## Metrics  (omitted if no metrics)
┌────────────────┬────────────────┬────────────────┐
│  Label         │  Label         │  Label         │
│  Value         │  Value         │  Value         │
└────────────────┴────────────────┴────────────────┘

## Links
[Repo ↗]   [Demo ↗]
```

- Back link: `<a href="/#projects">← Back to projects</a>`, `color: var(--color-text-muted)`, hover `var(--color-text)`.
- Metric cards: 3-col grid on `>= 768 px`, 1-col on mobile. Each: `bg: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-4)`. Value: `font-size: var(--text-2xl); font-weight: var(--font-weight-bold); color: var(--color-accent)`. Label: `font-size: var(--text-xs); color: var(--color-text-muted)`.
- Detail page also includes `<title>` and `<meta name="description">` derived from `project.name` + `project.summary`.

---

## 4. Responsive Breakpoints

| Breakpoint | Width    | Key Changes |
|------------|----------|-------------|
| Default    | 320 px+  | Single column, full-width cards, no horizontal scroll |
| sm         | 360 px   | Slightly larger padding; nav drawer closes on link tap |
| md         | 768 px   | Header nav visible; Hero full-viewport-height; 2-col footer |
| lg         | 1200 px  | 4/8-col section grid active; max-width cap engaged |

No element causes horizontal scroll at 320 px: all grids use `grid-template-columns: 1fr`, images use `max-width: 100%`, code snippets use `overflow-x: auto`.

Section horizontal padding: `var(--space-5)` (mobile) → `var(--space-7)` (768 px+) → `var(--space-8)` (1200 px+).

---

## 5. Accessibility Standards

| Requirement | Implementation |
|-------------|----------------|
| Skip link | First child of `<body>`: `<a class="skip-link" href="#main">Skip to main content</a>`. Visually hidden until `:focus`. |
| Single `<h1>` per page | Index: hero name. Project detail: project name. |
| Heading order | h1 → h2 (section) → h3 (card title / group). No skipped levels. |
| Minimum contrast 4.5:1 | All text pairs verified (see §6). `--color-accent` as text is only used where it passes (see note below). |
| Focus ring | `outline: 2px solid var(--color-accent); outline-offset: 2px` on all interactive elements. Remove browser default only after setting custom ring (`outline: none` is never used alone). |
| `prefers-reduced-motion` | Fade-in and hover-translate animations wrapped in `@media (prefers-reduced-motion: no-preference)`. Without it, elements are immediately visible and stationary. |
| `prefers-color-scheme: dark` | Full token set in `tokens.css`. |
| Images | All decorative SVGs have `aria-hidden="true"`. Meaningful images have `alt`. |
| Icon-only links | All icon-only `<a>` elements have `aria-label`. |
| Form / mailto | Contact section uses `<a href="mailto:…">` — no `<form>` needed for static site. |

**Note on accent as text color:** In light mode `--color-accent` is `#2563eb` (passes 5.17:1 on `#ffffff`). In dark mode `--color-accent` is `#60a5fa` (passes 7.02:1 on `#0f172a`). Never use `--color-accent` as text on `--color-bg-card` in dark mode without verification — it still passes (5.75:1 ≥ 4.5:1).

---

## 6. Contrast Ratio Table (WCAG AA — minimum 4.5:1 for normal text)

> All hex values below are taken directly from `templates/tokens.css` and re-verified with `node -e` on 2026-11-12. Every pair passes WCAG AA.

### Light Mode

| Foreground | Background | Pair Description | Ratio | Pass? |
|------------|------------|------------------|-------|-------|
| `#0f172a` (`--color-text`) | `#ffffff` (`--color-bg`) | Body text on page bg | 17.85:1 | AA |
| `#64748b` (`--color-text-muted`) | `#ffffff` (`--color-bg`) | Muted text on page bg | 4.76:1 | AA |
| `#64748b` (`--color-text-muted`) | `#f8fafc` (`--color-bg-card`) | Muted text on card bg | 4.55:1 | AA |
| `#0f172a` (`--color-text`) | `#f8fafc` (`--color-bg-card`) | Body text on card bg | 17.06:1 | AA |
| `#2563eb` (`--color-accent`) | `#ffffff` (`--color-bg`) | Accent text on page bg | 5.17:1 | AA |
| `#2563eb` (`--color-accent`) | `#f8fafc` (`--color-bg-card`) | Accent text on card bg | 4.94:1 | AA |
| `#f1f5f9` (`--color-skill-text`) | `#1e293b` (`--color-skill-bg`) | Skill chip text on chip bg | 13.35:1 | AA |

### Dark Mode

| Foreground | Background | Pair Description | Ratio | Pass? |
|------------|------------|------------------|-------|-------|
| `#f1f5f9` (`--color-text`) | `#0f172a` (`--color-bg`) | Body text on page bg | 16.30:1 | AA |
| `#94a3b8` (`--color-text-muted`) | `#0f172a` (`--color-bg`) | Muted text on page bg | 6.96:1 | AA |
| `#94a3b8` (`--color-text-muted`) | `#1e293b` (`--color-bg-card`) | Muted text on card bg | 5.71:1 | AA |
| `#f1f5f9` (`--color-text`) | `#1e293b` (`--color-bg-card`) | Body text on card bg | 13.35:1 | AA |
| `#60a5fa` (`--color-accent`) | `#0f172a` (`--color-bg`) | Accent text on page bg | 7.02:1 | AA |
| `#60a5fa` (`--color-accent`) | `#1e293b` (`--color-bg-card`) | Accent text on card bg | 5.75:1 | AA |
| `#f1f5f9` (`--color-skill-text`) | `#334155` (`--color-skill-bg`) | Skill chip text on chip bg | 9.45:1 | AA |

**No pairs failed.**

---

## 7. Font Stack

```css
font-family: var(--font-mono);
/* expands to:
   ui-monospace, "Cascadia Code", "Source Code Pro",
   Menlo, Consolas, "DejaVu Sans Mono", monospace
*/
```

No external font imports. No CDN. `<link rel="preconnect">` tags are absent. The monospace aesthetic matches the developer-portfolio context and renders without layout shift.

---

## 8. Summary for frontend-builder

- Import `tokens.css` as the first stylesheet in every template.
- Use only CSS custom properties from `tokens.css` for colors, spacing, type, and radius — no hardcoded hex or pixel values except `0`, `100%`, or viewport units.
- Sections are conditionally rendered: if the data array is empty, omit the section and its nav link.
- The `<main id="main">` landmark wraps everything from Hero through Contact (inclusive). Header and Footer are outside `<main>`.
- All interactive states (hover, focus, active) must have visible style changes. Focus ring: `outline: 2px solid var(--color-accent); outline-offset: 2px`.
- Build output goes to `docs/` via `scripts/build.mjs`; do not edit `docs/` by hand.
