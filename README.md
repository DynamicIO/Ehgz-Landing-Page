# Ehgz — Landing Site

A premium, mobile-first landing site for **Ehgz**, the curated venue discovery and booking iOS app for Egypt.

> Discover and instantly book restaurants, rooftops, lounges and cafes across Cairo and beyond. Zero fees, zero friction.

---

## Highlights

- **Mobile-first, fully responsive** — built around fluid `clamp()` sizing, CSS Grid, and `dvh` units.
- **Multi-page scrolling experience** — Hero → Stats → Features → How it works → Cities → Testimonials → FAQ → Download CTA, plus dedicated `features`, `support`, `privacy`, and `terms` pages.
- **Scroll-triggered animations** — IntersectionObserver-driven fade/slide reveals, staggered child animations, parallax (`data-parallax`), CSS scroll-driven progress bar with graceful fallback.
- **Polished micro-interactions** — phone-stack 3D tilt on cursor, cursor glow on feature cards, sticky-nav blur, smooth scroll, count-up stats, animated marquee.
- **Brand-true visual language** — palette extracted directly from the iOS app screenshots:
  - Background `#0E0B08`, card `#1A1410`
  - Brushed-gold primary `#C9A876` (with `#E2C896` → `#A88858` gradient)
  - Display type: **Playfair Display** · Body: **Inter**
- **SEO-ready** — semantic HTML5, comprehensive `<meta>`, Open Graph + Twitter cards, JSON-LD structured data (`Organization`, `MobileApplication`, `WebSite`), `robots.txt`, `sitemap.xml`, descriptive `alt` text everywhere.
- **Performance-minded** — single deferred JS file, preconnect to fonts, preload of LCP image, lazy-loaded secondary screens, scoped CSS (no framework, no dependencies).
- **Accessibility** — skip link, `aria-*` labels, `:focus-visible` styles, `prefers-reduced-motion` honoured, semantic landmarks.

---

## Project structure

```
.
├── index.html                — Main landing page (all primary sections)
├── features.html             — "Why Ehgz" deep-dive
├── support.html              — Support / contact / partners
├── privacy.html              — Privacy policy
├── terms.html                — Terms of service
├── robots.txt
├── sitemap.xml
├── README.md
└── assets/
    ├── css/
    │   ├── tokens.css        — Design tokens (color, type, spacing, motion)
    │   ├── base.css          — Reset, typography, layout primitives
    │   ├── components.css    — Nav, buttons, hero, phone mockup, sections
    │   └── animations.css    — Scroll-triggered animations + reduced-motion
    ├── js/
    │   └── main.js           — Reveal IO, sticky nav, parallax, counters, tilt
    ├── images/
    │   ├── screen-discover.png
    │   ├── screen-search.png
    │   ├── screen-map.png
    │   └── screen-profile.png
    └── icons/
        └── favicon.svg
```

---

## Run it locally

The site is fully static — no build step. Just serve the folder:

```bash
# Python (recommended for testing fetchpriority/preload)
python -m http.server 4000

# or, with Node
npx serve -l 4000
```

Then open http://localhost:4000.

> Opening `index.html` directly via `file://` works too, but a local server is preferred so cross-origin features (preload, JSON-LD validation) behave like production.

---

## Customising the brand

All design tokens live in `assets/css/tokens.css`. Tweaking the gold or surface variables will cascade through the whole site:

```css
--bg-base:    #0E0B08;
--gold-400:   #C9A876;
--gradient-gold: linear-gradient(135deg, #E2C896 0%, #C9A876 45%, #A88858 100%);
```

Add or replace the App Store URL in `index.html` (search for `class="app-badge"`).

---

## Deployment

Drop the folder on any static host:

- **Vercel** / **Netlify** — point at the repo, no config needed.
- **GitHub Pages** — push to a `gh-pages` branch.
- **Cloudflare Pages** / **AWS S3 + CloudFront** — works the same.

Set `https://ehgz.app/` as the canonical origin (already wired into `<link rel="canonical">`, OG tags, JSON-LD, sitemap and robots) and update if the production domain differs.

---

## License

© Ehgz. All rights reserved.
