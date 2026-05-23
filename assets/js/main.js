/* ==========================================================================
   Ehgz — Landing site interaction layer
   - Scroll reveal via IntersectionObserver
   - Sticky nav state + mobile menu
   - Parallax for decorated elements
   - Count-up for stats
   - Cursor glow on feature cards
   - Subtle 3D tilt for hero phone stack
   ========================================================================== */
(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------------------
     1. Sticky nav + mobile menu
     -------------------------------------------------------------------- */
  const nav        = document.querySelector('.site-nav');
  const navToggle  = document.querySelector('.site-nav__toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (navToggle && mobileMenu) {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-controls', 'mobile-menu');

    const closeMenu = () => {
      nav.classList.remove('is-open');
      mobileMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };
    const openMenu = () => {
      nav.classList.add('is-open');
      mobileMenu.classList.add('is-open');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    navToggle.addEventListener('click', () => {
      mobileMenu.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) closeMenu();
    });
  }

  /* ----------------------------------------------------------------------
     2. Reveal-on-scroll
     -------------------------------------------------------------------- */
  const revealTargets = document.querySelectorAll('[data-reveal], [data-stagger]');

  if (revealTargets.length && 'IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -8% 0px'
    });

    revealTargets.forEach(el => io.observe(el));
  } else {
    // Fallback: just show everything.
    revealTargets.forEach(el => el.classList.add('is-revealed'));
  }

  /* ----------------------------------------------------------------------
     3. Stats count-up
     -------------------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-counter]');

  if (counters.length && !prefersReducedMotion) {
    const animateCounter = (el) => {
      const target   = Number(el.dataset.counter);
      const suffix   = el.dataset.counterSuffix || '';
      const duration = 1600;
      const start    = performance.now();
      const easeOut  = (t) => 1 - Math.pow(1 - t, 3);

      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const v = Math.round(target * easeOut(t));
        el.textContent = v.toLocaleString() + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const cIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => cIO.observe(c));
  } else {
    counters.forEach(c => {
      const suffix = c.dataset.counterSuffix || '';
      c.textContent = Number(c.dataset.counter).toLocaleString() + suffix;
    });
  }

  /* ----------------------------------------------------------------------
     4. Parallax — translateY on elements with [data-parallax]
        value is multiplier (0.05 = subtle, 0.25 = strong)
     -------------------------------------------------------------------- */
  const parallaxEls = document.querySelectorAll('[data-parallax]');

  if (parallaxEls.length && !prefersReducedMotion) {
    let ticking = false;

    const updateParallax = () => {
      const vh = window.innerHeight;
      parallaxEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const offset = (center - vh / 2) * Number(el.dataset.parallax || 0.1);
        el.style.transform = `translate3d(0, ${(-offset).toFixed(2)}px, 0)`;
      });
      ticking = false;
    };

    const onScrollParallax = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScrollParallax, { passive: true });
    window.addEventListener('resize', onScrollParallax, { passive: true });
    updateParallax();
  }

  /* ----------------------------------------------------------------------
     5. Cursor glow on feature cards
     -------------------------------------------------------------------- */
  document.querySelectorAll('.feature').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });

  /* ----------------------------------------------------------------------
     6. 3D tilt for hero phone stack on pointer move (desktop only)
     -------------------------------------------------------------------- */
  const tiltContainer = document.querySelector('.hero__visual');
  const tiltTarget    = document.querySelector('.phone-stack');

  if (tiltContainer && tiltTarget && window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion) {
    let raf = null;
    const onMove = (e) => {
      const r = tiltContainer.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width  - 0.5;
      const py = (e.clientY - r.top)  / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        tiltTarget.style.transform =
          `rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      tiltTarget.style.transform = '';
    };
    tiltContainer.addEventListener('pointermove', onMove);
    tiltContainer.addEventListener('pointerleave', onLeave);
  }

  /* ----------------------------------------------------------------------
     7. Section nav state — highlight current link based on scroll position
     -------------------------------------------------------------------- */
  const navLinks = document.querySelectorAll('.site-nav__links a[href^="#"]');
  const sections = Array.from(navLinks)
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (navLinks.length && sections.length) {
    const sIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(a => {
            a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => sIO.observe(s));
  }

  /* ----------------------------------------------------------------------
     8. Year stamp in footer
     -------------------------------------------------------------------- */
  const year = document.querySelector('[data-current-year]');
  if (year) year.textContent = new Date().getFullYear();

})();
