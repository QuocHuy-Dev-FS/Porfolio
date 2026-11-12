# Portfolio — Fullstack Developer

A static portfolio site for a fullstack developer, built with plain HTML, CSS, and JavaScript (no dependencies, no CDN). Deployed on GitHub Pages. Source of truth is `data/profile.json`; the `docs/` directory is generated and must not be edited by hand.

## View locally

Option A — local server (recommended, avoids CORS issues with assets):

```
python3 -m http.server 8000 --directory docs
```

Then open `http://localhost:8000` in your browser.

Option B — open the file directly:

```
docs/index.html
```

## Build

Requires Node 18+. No packages to install.

```
node scripts/build.mjs
```

Reads `data/profile.json` and `templates/`, outputs to `docs/`.

Run the content checks after building:

```
node scripts/check.mjs
```

## Update content

1. Edit `data/profile.json` (the only authoritative source for site content).
2. Run `node scripts/build.mjs` to regenerate `docs/`.
3. Run `node scripts/check.mjs` to verify there are no broken rules.
4. Do **not** edit files inside `docs/` directly — a git hook will block it, and the next build will overwrite your changes.

To change layout or styles, edit files under `templates/` or `templates/tokens.css`, then rebuild.

## Directory structure

```
Portfolio/
├── data/
│   ├── profile.json        # Source of truth — edit this to update site content
│   ├── brief.md            # Project brief (agent instructions)
│   ├── design.md           # Design system documentation
│   ├── qa-report.md        # QA audit results
│   ├── inputs.md           # Raw input data (gitignored — keep private)
│   └── evidence.md         # Verified facts extracted from source docs (gitignored)
├── docs/                   # Generated output — served by GitHub Pages
│   ├── index.html
│   ├── projects/
│   │   └── hospital-indoor-navigation/index.html
│   ├── assets/
│   │   ├── style.css
│   │   ├── site.js
│   │   └── og-image.svg
│   ├── sitemap.xml
│   ├── robots.txt
│   ├── 404.html
│   └── .nojekyll
├── templates/              # HTML templates and CSS tokens (edit these to change layout/style)
│   ├── index.html.tpl
│   ├── project.html.tpl
│   ├── tokens.css
│   ├── style.css
│   ├── site.js
│   └── og-image.svg
├── scripts/
│   ├── build.mjs           # Build script: profile.json + templates → docs/
│   └── check.mjs           # Content validation script
├── .claude/                # Agent definitions (Claude Code)
├── CLAUDE.md               # Project rules and constraints
└── .gitignore
```

## Credits

Layout and design inspired by [devportfolio](https://github.com/RyanFitzgerald/devportfolio) by Ryan Fitzgerald, licensed under the [MIT License](https://github.com/RyanFitzgerald/devportfolio/blob/master/LICENSE.md). MIT license comments are preserved in `templates/style.css`.
