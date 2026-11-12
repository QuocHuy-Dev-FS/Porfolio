<!doctype html>
<html lang="{{LANG}}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{PAGE_TITLE}}</title>
  <meta name="description" content="{{META_DESCRIPTION}}">
  <link rel="canonical" href="{{CANONICAL}}">
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="{{OG_TITLE}}">
  <meta property="og:description" content="{{OG_DESCRIPTION}}">
  <meta property="og:url" content="{{OG_URL}}">
  <meta property="og:image" content="{{OG_IMAGE}}">
  <meta property="og:image:alt" content="{{OG_IMAGE_ALT}}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="{{OG_IMAGE}}">
  <meta name="theme-color" content="{{THEME_COLOR}}">
  <!-- JSON-LD -->
  <script type="application/ld+json">{{JSONLD}}</script>
  <link rel="stylesheet" href="{{ASSETS_PATH}}assets/style.css">
</head>
<body>
  <a class="skip-link" href="#main">Skip to main content</a>

  <!-- Header -->
  <header id="header" role="banner">
    <div class="header-inner">
      <button
        id="nav-toggle"
        class="nav-toggle"
        aria-controls="primary-nav"
        aria-expanded="false"
        aria-label="Open navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav id="primary-nav" aria-label="Primary">
        <ul>
          <li><a href="{{ROOT_PATH}}#about">About</a></li>
          <li><a href="{{ROOT_PATH}}#skills">Skills</a></li>
          <li><a href="{{ROOT_PATH}}#projects">Projects</a></li>
          <li><a href="{{ROOT_PATH}}#contact">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <!-- Main content -->
  <main id="main">
    <div class="project-detail-wrap">
      <a href="{{ROOT_PATH}}#projects" class="back-link">&#8592; Back to projects</a>

      <h1 class="detail-h1">{{PROJECT_NAME}}</h1>
      <p class="detail-meta">{{PROJECT_META}}</p>
      <p class="detail-summary">{{PROJECT_SUMMARY}}</p>

      <!-- Stack -->
      <h2 class="detail-section-title">Stack</h2>
      <div class="skill-chips" style="margin-bottom:var(--space-7);">
{{STACK_CHIPS}}      </div>

{{HIGHLIGHTS_BLOCK}}
{{METRICS_BLOCK}}
{{LINKS_BLOCK}}
    </div>
  </main>

  <!-- Footer -->
  <footer id="footer" role="contentinfo">
    <div class="footer-inner">
      <div class="footer-left">
        <span class="footer-name">{{PERSON_NAME}}</span>
        <span class="footer-title">{{PERSON_TITLE}}</span>
        <div class="footer-socials">
{{FOOTER_SOCIAL_LINKS}}        </div>
      </div>
      <div class="footer-right">
        <nav class="footer-nav" aria-label="Footer">
          <a href="{{ROOT_PATH}}#about">About</a>
          <a href="{{ROOT_PATH}}#projects">Projects</a>
          <a href="{{ROOT_PATH}}#contact">Contact</a>
        </nav>
        <p class="footer-copy">&#169; {{YEAR}} {{PERSON_NAME}}. All rights reserved.</p>
      </div>
    </div>
    <p class="footer-copy-mobile" style="text-align:center;padding-bottom:var(--space-4);">
      &#169; {{YEAR}} {{PERSON_NAME}}. All rights reserved.
    </p>
  </footer>

  <script src="{{ASSETS_PATH}}assets/site.js"></script>
</body>
</html>
