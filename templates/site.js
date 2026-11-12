/*
 * Portfolio site.js — progressive enhancement only.
 * Layout and interaction pattern inspired by devportfolio by Ryan Fitzgerald
 * (MIT License, Copyright (c) 2025 Ryan Fitzgerald)
 * https://github.com/ryanfitzgerald/devportfolio
 *
 * All content is visible and readable with JS disabled.
 * This script only improves the experience: sticky header, mobile nav, active-link tracking.
 */

(function () {
  'use strict';

  /* ── Sticky header ── */
  var header = document.getElementById('header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 80) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile nav toggle ── */
  var navToggle = document.getElementById('nav-toggle');
  var primaryNav = document.getElementById('primary-nav');
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      primaryNav.classList.toggle('is-open', !expanded);
      document.body.style.overflow = expanded ? '' : 'hidden';
    });

    /* Close drawer when a nav link is tapped */
    primaryNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('is-open');
        document.body.style.overflow = '';
        navToggle.focus();
      }
    });
  }

  /* ── Active section tracking via IntersectionObserver ── */
  if ('IntersectionObserver' in window) {
    var sections = document.querySelectorAll('section[id], div[id="hero"]');
    var navLinks = document.querySelectorAll('#primary-nav a[href^="#"]');

    var setActive = function (id) {
      navLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href === '#' + id) {
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'true');
        } else {
          link.classList.remove('is-active');
          link.removeAttribute('aria-current');
        }
      });
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { observer.observe(s); });
  }
})();
