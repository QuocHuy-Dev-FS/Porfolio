<!doctype html>
<html lang="{{LANG}}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{PAGE_TITLE}}</title>
  <meta name="description" content="{{META_DESCRIPTION}}">
  <link rel="canonical" href="{{CANONICAL}}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="{{OG_TITLE}}">
  <meta property="og:description" content="{{OG_DESCRIPTION}}">
  <meta property="og:url" content="{{OG_URL}}">
  <meta property="og:image" content="{{OG_IMAGE}}">
  <meta property="og:image:alt" content="{{OG_IMAGE_ALT}}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="{{OG_IMAGE}}">
  <meta name="theme-color" content="{{THEME_COLOR}}">
  <script type="application/ld+json">{{JSONLD}}</script>
  <link rel="stylesheet" href="{{ASSETS_PATH}}assets/style.css">
  <script>document.documentElement.classList.add('js-on')</script>
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <div class="scroll-progress" aria-hidden="true"><div class="scroll-progress__fill"></div></div>

  {{HEADER_HTML}}

  <main id="main-content">
    <article class="project-detail container" aria-labelledby="project-h1">
      <a href="{{ROOT_PATH}}#portfolio" class="back-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M5 12l7 7M5 12l7-7"/></svg>
        Back to Portfolio
      </a>

      <header class="project-detail__header">
        <h1 id="project-h1" class="project-detail__h1">{{PROJECT_NAME}}</h1>
        <p class="project-detail__meta">{{PROJECT_META}}</p>
        <div class="project-detail__stack">
{{STACK_CHIPS}}        </div>
      </header>

      <div class="project-detail__section">
        <h2>Overview</h2>
        <p class="project-detail__summary">{{PROJECT_SUMMARY}}</p>
      </div>

{{HIGHLIGHTS_BLOCK}}{{METRICS_BLOCK}}{{LINKS_BLOCK}}    </article>
  </main>

  {{FOOTER_HTML}}

  <script src="{{ASSETS_PATH}}assets/site.js"></script>
</body>
</html>
