/**
 * Portfolio site.js — progressive enhancement only.
 * All content is readable with JS disabled.
 * Features: scroll progress, hamburger nav, reveal on scroll,
 * portfolio filter, testimonials carousel, skill bars, contact form.
 */
(function () {
  'use strict';

  /* js-on already added inline in <head> for FOUC prevention */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Scroll progress bar ── */
  var progressFill = document.querySelector('.scroll-progress__fill');
  if (progressFill) {
    var updateProgress = function () {
      var scrolled = window.scrollY;
      var total = document.documentElement.scrollHeight - window.innerHeight;
      var pct = total > 0 ? (scrolled / total) * 100 : 0;
      progressFill.style.height = pct + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ── Hamburger / mobile nav ── */
  var hamburger = document.querySelector('.hamburger');
  var navDrawer = document.querySelector('.nav-drawer');
  if (hamburger && navDrawer) {
    hamburger.addEventListener('click', function () {
      var expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      hamburger.setAttribute('aria-label', !expanded ? 'Close navigation menu' : 'Open navigation menu');
      navDrawer.classList.toggle('is-open', !expanded);
      document.body.style.overflow = !expanded ? 'hidden' : '';
    });

    navDrawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.setAttribute('aria-expanded', 'false');
        navDrawer.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navDrawer.classList.contains('is-open')) {
        hamburger.setAttribute('aria-expanded', 'false');
        navDrawer.classList.remove('is-open');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });
  }

  /* ── Active nav link tracking ── */
  if ('IntersectionObserver' in window) {
    var sections = document.querySelectorAll('section[id], header[id]');
    var navLinks = document.querySelectorAll('.nav-links a[href^="#"], .nav-drawer a[href^="#"]');

    if (sections.length && navLinks.length) {
      var setActive = function (id) {
        navLinks.forEach(function (link) {
          var href = link.getAttribute('href');
          if (href === '#' + id) {
            link.classList.add('is-active');
            link.setAttribute('aria-current', 'page');
          } else {
            link.classList.remove('is-active');
            link.removeAttribute('aria-current');
          }
        });
      };

      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

      sections.forEach(function (s) { sectionObserver.observe(s); });
    }
  }

  /* ── Scroll reveal ── */
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      reveals.forEach(function (el, i) {
        /* Stagger siblings within the same parent */
        var siblings = Array.from(el.parentElement.querySelectorAll('.reveal'));
        var idx = siblings.indexOf(el);
        if (idx > 0) {
          el.style.setProperty('--reveal-delay', (idx * 80) + 'ms');
        }
        revealObserver.observe(el);
      });
    }
  } else if (prefersReducedMotion) {
    /* Immediately show all reveals when reduced motion preferred */
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ── Portfolio filter tabs ── */
  var filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  var projectCards = document.querySelectorAll('.project-card[data-category]');
  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');

        filterBtns.forEach(function (b) {
          b.classList.remove('filter-btn--active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('filter-btn--active');
        btn.setAttribute('aria-selected', 'true');

        projectCards.forEach(function (card) {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.removeAttribute('data-hidden');
            card.style.display = '';
          } else {
            card.setAttribute('data-hidden', '');
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ── Skill level bars ── */
  if ('IntersectionObserver' in window) {
    var skillBars = document.querySelectorAll('.skill-bar[data-pct]');
    if (skillBars.length) {
      var barObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var bar = entry.target;
            var pct = bar.getAttribute('data-pct') || '0';
            bar.style.setProperty('--skill-pct', pct + '%');
            if (prefersReducedMotion) {
              var fill = bar.querySelector('.skill-bar__fill');
              if (fill) fill.style.width = pct + '%';
            } else {
              bar.classList.add('is-visible');
            }
            barObserver.unobserve(bar);
          }
        });
      }, { threshold: 0.3 });
      skillBars.forEach(function (bar) { barObserver.observe(bar); });
    }
  }

  /* ── Testimonials carousel ── */
  var track = document.querySelector('.testimonials-track');
  var dots  = document.querySelectorAll('.testimonials-dot');
  var prevBtn = document.querySelector('.testimonials-btn[data-dir="prev"]');
  var nextBtn = document.querySelector('.testimonials-btn[data-dir="next"]');
  if (track && dots.length) {
    var total = dots.length;
    var current = 0;
    var autoTimer = null;

    var goTo = function (index) {
      current = (index + total) % total;
      if (!prefersReducedMotion) {
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
      } else {
        var cards = track.querySelectorAll('.testimonial-card');
        cards.forEach(function (card, i) {
          card.style.display = i === current ? '' : 'none';
        });
      }
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
        dot.setAttribute('aria-selected', String(i === current));
      });
      var liveRegion = document.querySelector('[aria-live="polite"][data-testimonials-live]');
      if (liveRegion) {
        var cards = track.querySelectorAll('.testimonial-card');
        var authorEl = cards[current] ? cards[current].querySelector('.testimonial-author') : null;
        liveRegion.textContent = authorEl ? 'Showing: ' + authorEl.textContent : '';
      }
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', function () { goTo(current - 1); resetAuto(); });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () { goTo(current + 1); resetAuto(); });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); resetAuto(); });
    });

    var startAuto = function () {
      if (prefersReducedMotion || total <= 1) return;
      autoTimer = setInterval(function () { goTo(current + 1); }, 5000);
    };

    var resetAuto = function () {
      clearInterval(autoTimer);
      startAuto();
    };

    var wrapper = document.querySelector('.testimonials-wrapper');
    if (wrapper) {
      wrapper.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
      wrapper.addEventListener('mouseleave', startAuto);
    }

    goTo(0);
    startAuto();
  }

  /* ── Contact form → mailto ── */
  var form = document.getElementById('contact-form');
  if (form) {
    var noScriptFallback = document.querySelector('.form-noscript');
    if (noScriptFallback) noScriptFallback.style.display = 'none';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var recipientEmail = form.getAttribute('data-email') || '';
      var nameVal    = (form.querySelector('[name="name"]')    || {}).value || '';
      var emailVal   = (form.querySelector('[name="email"]')   || {}).value || '';
      var subjectVal = (form.querySelector('[name="subject"]') || {}).value || 'Portfolio contact';
      var messageVal = (form.querySelector('[name="message"]') || {}).value || '';

      var body = 'From: ' + nameVal + '\nEmail: ' + emailVal + '\n\n' + messageVal;
      var mailtoUrl = 'mailto:' + recipientEmail
        + '?subject=' + encodeURIComponent(subjectVal)
        + '&body='    + encodeURIComponent(body);

      window.location.href = mailtoUrl;
    });
  }

})();
