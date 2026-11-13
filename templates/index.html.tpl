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
{{MAIN_SECTIONS}}  </main>

  {{FOOTER_HTML}}

  <script src="{{ASSETS_PATH}}assets/site.js"></script>
</body>
</html>
