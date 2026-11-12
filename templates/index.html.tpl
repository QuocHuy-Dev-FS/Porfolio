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
          <li><a href="#about">About</a></li>
          <li><a href="#skills">Skills</a></li>
{{NAV_PROJECTS_ITEM}}          <li><a href="#contact">Contact</a></li>
{{NAV_EXPERIENCE_ITEM}}{{NAV_EDUCATION_ITEM}}        </ul>
      </nav>
    </div>
  </header>

  <!-- Main content -->
  <main id="main">

    <!-- Hero -->
    <section id="hero" aria-label="Introduction">
      <div class="hero-bg-gradient" aria-hidden="true"></div>
      <svg class="hero-symbols" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="code-symbols" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
            <text x="50"  y="50"  fill="currentColor" font-family="monospace" font-size="24" transform="rotate(-15)" opacity="0.12">&lt;/&gt;</text>
            <text x="150" y="100" fill="currentColor" font-family="monospace" font-size="20" transform="rotate(10)"  opacity="0.10">{}</text>
            <text x="250" y="80"  fill="currentColor" font-family="monospace" font-size="18" transform="rotate(-5)"  opacity="0.10">=&gt;</text>
            <text x="100" y="200" fill="currentColor" font-family="monospace" font-size="22" transform="rotate(15)"  opacity="0.12">[]</text>
            <text x="300" y="180" fill="currentColor" font-family="monospace" font-size="20" transform="rotate(-10)" opacity="0.10">&lt;&gt;</text>
            <text x="200" y="250" fill="currentColor" font-family="monospace" font-size="24" transform="rotate(5)"   opacity="0.10">()</text>
            <text x="50"  y="320" fill="currentColor" font-family="monospace" font-size="18" transform="rotate(-8)"  opacity="0.10">::</text>
            <text x="350" y="300" fill="currentColor" font-family="monospace" font-size="22" transform="rotate(12)"  opacity="0.10">==</text>
            <text x="150" y="350" fill="currentColor" font-family="monospace" font-size="20" transform="rotate(-15)" opacity="0.12">++</text>
            <text x="250" y="370" fill="currentColor" font-family="monospace" font-size="24" transform="rotate(8)"   opacity="0.10">;</text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#code-symbols)" color="var(--color-accent)"></rect>
      </svg>
      <div class="hero-inner">
        <p class="hero-greeting">Hello!</p>
        <h1 class="hero-name">
          <span class="name-prefix">I&#8217;m </span><span class="name-accent">{{PERSON_NAME}}</span>
        </h1>
        <p class="hero-title">{{PERSON_TITLE}}</p>
        <p class="hero-summary">{{PERSON_SUMMARY}}</p>
        <div class="hero-cta">
          <a href="#contact" class="btn-primary">Contact me &#8595;</a>
{{HERO_GITHUB_BTN}}        </div>
        <div class="hero-socials">
{{HERO_SOCIAL_LINKS}}        </div>
      </div>
    </section>

    <!-- About -->
    <section id="about" aria-labelledby="about-heading">
      <div class="section-inner">
        <div class="section-grid">
          <div class="section-label">
            <h2 id="about-heading">About Me</h2>
            <div class="accent-bar" aria-hidden="true"></div>
          </div>
          <div class="section-content">
            <p class="about-text">{{PERSON_SUMMARY_FULL}}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills -->
    <section id="skills" aria-labelledby="skills-heading">
      <div class="section-inner">
        <div class="section-grid">
          <div class="section-label">
            <h2 id="skills-heading">Skills</h2>
            <div class="accent-bar" aria-hidden="true"></div>
          </div>
          <div class="section-content">
            <div class="skills-groups">
{{SKILLS_CONTENT}}            </div>
          </div>
        </div>
      </div>
    </section>

{{PROJECTS_SECTION}}
{{EXPERIENCE_SECTION}}
{{EDUCATION_SECTION}}
    <!-- Contact -->
    <section id="contact" aria-labelledby="contact-heading">
      <div class="contact-inner">
        <h2 id="contact-heading">Get in touch</h2>
        <div class="accent-bar" aria-hidden="true" style="margin: var(--space-2) auto 0;"></div>
        <div class="contact-links">
{{CONTACT_LINKS}}        </div>
      </div>
    </section>

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
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
{{FOOTER_NAV_PROJECTS}}          <a href="#contact">Contact</a>
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
