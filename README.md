# Francesco Volpi — Italian Teacher

Landing page for Francesco Volpi, Italian language teacher based in Italy.

**Live site:** [italianoconfrancesco.it](https://italianoconfrancesco.it)
**Built by:** [Florentin.studio](https://florentin.studio)

---

## Stack

Vanilla HTML, CSS and JavaScript — no frameworks, no build tools.

- GSAP + ScrollTrigger for scroll-driven animations
- Calendly for booking integration

---

## Features

### Animations
- 3D layered typographic effect (L'ITALIANO, SPEAKING AND UNDERSTANDING, READY TO START?) with mouse parallax on desktop and touch parallax on mobile
- Floating hero tags with sine-wave animation
- Scroll-driven video expand (desktop): video grows from thumbnail to fullscreen as user scrolls
- Slot machine counters and star animations on scroll
- Proof card deck with click-to-cycle interaction

### Mobile
- Fully custom mobile layout — not just a scaled-down desktop
- Touch parallax on all 3D typographic elements
- Floating tag animations via requestAnimationFrame
- Custom hamburger menu overlay
- Optimized video display with 3:4 aspect ratio

### Performance
- No framework overhead — pure vanilla JS
- requestAnimationFrame loops for all animations (no setInterval)
- Video: H.264 mp4, optimized to 7mb
- Lazy scroll observers via IntersectionObserver API

### Other
- GDPR-compliant cookie banner with accept/decline
- Privacy policy page
- Custom emoji cursor (desktop)
- Responsive side navigation with active section tracking

---

## Structure
```
├── index.html
├── styles.css
├── script.js
├── privacy.html
└── Francesco Volpi Italian Teacher.mp4
```

---

## Notes

The `!important` declarations in the mobile media query are intentional. GSAP and the scroll-driven JS animations set inline styles at runtime for desktop. On mobile those animations are disabled, but inline styles persist — `!important` is required to override them from CSS.
```

Y el `.gitignore`:
```
.DS_Store
.vscode/
*.log