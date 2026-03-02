function lerp(a, b, t) { return a + (b - a) * t; }

(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  const doc = document;
  const win = window;

  // ----- Entrada inicial del hero -----
  var heroLines = doc.querySelectorAll('.hero-title .line:not(.hero-title-main)');
  gsap.fromTo(heroLines, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.2 });
  var heroMainLine = doc.querySelector('.hero-title .line.hero-title-main');
  if (heroMainLine) gsap.fromTo(heroMainLine, { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.3 });
  gsap.fromTo('.hero-stats', { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.8 });
  gsap.fromTo('.hero .btn', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, delay: 1 });

  // ----- 1. Mouse-follow (estilo NICE / Mojo Studio) -----
  const mouseFollowEls = doc.querySelectorAll('[data-mouse-follow]');
  const heroTitleMain = doc.querySelector('.hero-title-main');
  const hero3dWrap = heroTitleMain && heroTitleMain.querySelector('.hero-3d-wrap');
  const hero3dWhite = hero3dWrap && hero3dWrap.querySelector('.hero-3d-white');
  const hero3dGreen = hero3dWrap && hero3dWrap.querySelector('.hero-3d-green');
  const hero3dRed = hero3dWrap && hero3dWrap.querySelector('.hero-3d-red');
  const methodTitleMain = doc.querySelector('#method .focus-title-main');
  const method3dWrap = methodTitleMain && methodTitleMain.querySelector('.focus-3d-wrap');
  const method3dWhite = method3dWrap && method3dWrap.querySelector('.focus-3d-white');
  const method3dGreen = method3dWrap && method3dWrap.querySelector('.focus-3d-green');
  const method3dRed = method3dWrap && method3dWrap.querySelector('.focus-3d-red');
  const bookTitleMain = doc.querySelector('#book .cta-title-main');
  const book3dWrap = bookTitleMain && bookTitleMain.querySelector('.book-3d-wrap');
  const book3dWhite = book3dWrap && book3dWrap.querySelector('.book-3d-white');
  const book3dGreen = book3dWrap && book3dWrap.querySelector('.book-3d-green');
  const book3dRed = book3dWrap && book3dWrap.querySelector('.book-3d-red');
  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;
  let currentNormX = 0, currentNormY = 0;
  let currentNormXMethod = 0, currentNormYMethod = 0;
  let currentNormXBook = 0, currentNormYBook = 0;
  let rafId = 0;
  const ease = 0.08;
  const STEP_RATIO = 0.032;  /* mismo paso blanco→verde y verde→rojo (proporcional al font-size) */
  const PARALLAX_PX = 8;     /* px de parallax por unidad de norm para la capa verde */

  if (win.innerWidth <= 768) {
    doc.documentElement.style.setProperty('--mouse-x', '0');
    doc.documentElement.style.setProperty('--mouse-y', '0');
    if (heroTitleMain) {
      heroTitleMain.style.transform = 'rotate(-3deg)';
    }
    if (methodTitleMain) {
      methodTitleMain.style.setProperty('--mouse-x', '0');
      methodTitleMain.style.setProperty('--mouse-y', '0');
      methodTitleMain.style.transform = 'rotate(-3deg) translate(0px, 0px)';
      if (method3dWhite && method3dGreen && method3dRed) {
        var mFs = parseFloat(win.getComputedStyle(method3dWhite).fontSize);
        var mStep = mFs * STEP_RATIO;
        method3dGreen.style.transform = 'translate(' + (-mStep) + 'px, ' + mStep + 'px)';
        method3dRed.style.transform = 'translate(' + (-2 * mStep) + 'px, ' + (2 * mStep) + 'px)';
      }
    }
    if (bookTitleMain) {
      bookTitleMain.style.setProperty('--mouse-x', '0');
      bookTitleMain.style.setProperty('--mouse-y', '0');
      bookTitleMain.style.transform = 'rotate(-3deg) translate(0px, 0px)';
      if (book3dWhite && book3dGreen && book3dRed) {
        var bFs = parseFloat(win.getComputedStyle(book3dWhite).fontSize);
        var bStep = bFs * STEP_RATIO;
        book3dGreen.style.transform = 'translate(' + (-bStep) + 'px, ' + bStep + 'px)';
        book3dRed.style.transform = 'translate(' + (-2 * bStep) + 'px, ' + (2 * bStep) + 'px)';
      }
    }

    window.addEventListener('load', function() {
      var tags = Array.from(doc.querySelectorAll('.hero-tags .tag'));
      var heroTime = 0;
      var tagTime = 0;
      var tagSpeeds = [1.0, 0.7, 1.3, 0.9];
      var tagAmounts = [6, 4, 7, 5];

      function animateMobile() {
        heroTime += 0.007;
        tagTime += 0.01;

        // L'ITALIANO flotante
        if (heroTitleMain) {
          var fx = Math.sin(heroTime * 0.8) * 6;
          var fy = Math.sin(heroTime) * 5;
          heroTitleMain.style.transform = 'rotate(-3deg) translate(' + fx + 'px, ' + fy + 'px)';
          if (hero3dWhite && hero3dGreen && hero3dRed) {
            var fs = parseFloat(win.getComputedStyle(hero3dWhite).fontSize);
            var sp = fs * STEP_RATIO;
            hero3dGreen.style.transform = 'translate(' + (-sp + fx*0.4) + 'px, ' + (sp + fy*0.4) + 'px)';
            hero3dRed.style.transform = 'translate(' + (-2*sp + fx*0.8) + 'px, ' + (2*sp + fy*0.8) + 'px)';
          }
        }

        // Tags flotantes
        tags.forEach(function(tag, i) {
          var y = Math.sin(tagTime * tagSpeeds[i % tagSpeeds.length]) * tagAmounts[i % tagAmounts.length];
          tag.style.transform = 'translateY(' + y + 'px)';
        });

        requestAnimationFrame(animateMobile);
      }
      animateMobile();
    });

    // --- Touch parallax para SPEAKING AND UNDERSTANDING y READY TO START? ---
    var bodySectionEl = doc.querySelector('body');
    if (bodySectionEl) {
      bodySectionEl.addEventListener('touchmove', function(e) {
        var touch = e.touches[0];
        var normX = (touch.clientX - win.innerWidth / 2) / (win.innerWidth / 2);
        var normY = (touch.clientY - win.innerHeight / 2) / (win.innerHeight / 2);
        normX = Math.max(-1, Math.min(1, normX));
        normY = Math.max(-1, Math.min(1, normY));

        if (methodTitleMain) {
          methodTitleMain.style.transform = 'rotate(-3deg) translate(' + (normX * 5) + 'px, ' + (normY * 4) + 'px)';
          if (method3dGreen && method3dRed && method3dWhite) {
            var mFs2 = parseFloat(win.getComputedStyle(method3dWhite).fontSize);
            var mStep2 = mFs2 * STEP_RATIO;
            method3dGreen.style.transform = 'translate(' + (-mStep2 + normX * PARALLAX_PX) + 'px, ' + (mStep2 + normY * PARALLAX_PX) + 'px)';
            method3dRed.style.transform = 'translate(' + (-2 * mStep2 + normX * PARALLAX_PX * 2) + 'px, ' + (2 * mStep2 + normY * PARALLAX_PX * 2) + 'px)';
          }
        }
        if (bookTitleMain) {
          bookTitleMain.style.transform = 'rotate(-3deg) translate(' + (normX * 5) + 'px, ' + (normY * 4) + 'px)';
          if (book3dGreen && book3dRed && book3dWhite) {
            var bFs2 = parseFloat(win.getComputedStyle(book3dWhite).fontSize);
            var bStep2 = bFs2 * STEP_RATIO;
            book3dGreen.style.transform = 'translate(' + (-bStep2 + normX * PARALLAX_PX) + 'px, ' + (bStep2 + normY * PARALLAX_PX) + 'px)';
            book3dRed.style.transform = 'translate(' + (-2 * bStep2 + normX * PARALLAX_PX * 2) + 'px, ' + (2 * bStep2 + normY * PARALLAX_PX * 2) + 'px)';
          }
        }
      }, { passive: true });
    }
  }

  function updateMouseFollow() {
    var dx = (mouseX - win.innerWidth / 2) / win.innerWidth;
    var dy = (mouseY - win.innerHeight / 2) / win.innerHeight;
    var moveX = dx * 24;
    var moveY = dy * 24;
    currentX = lerp(currentX, moveX, ease);
    currentY = lerp(currentY, moveY, ease);

    if (window.innerWidth > 768) {
      if (heroTitleMain) {
        var rect = heroTitleMain.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;
        var normX = (mouseX - centerX) / Math.max(rect.width / 2, 1);
        var normY = (mouseY - centerY) / Math.max(rect.height / 2, 1);
        normX = Math.max(-1, Math.min(1, normX));
        normY = Math.max(-1, Math.min(1, normY));
        currentNormX = lerp(currentNormX, normX, ease);
        currentNormY = lerp(currentNormY, normY, ease);
        heroTitleMain.style.setProperty('--mouse-x', currentNormX);
        heroTitleMain.style.setProperty('--mouse-y', currentNormY);
        var tx = currentNormX * 6;
        var ty = currentNormY * 6;
        heroTitleMain.style.transform = 'rotate(-3deg) translate(' + tx + 'px, ' + ty + 'px)';

        /* Efecto 3D L'ITALIANO: desplazamiento calculado en JS para que sea exactamente proporcional */
        if (hero3dWhite && hero3dGreen && hero3dRed) {
          var fontSize = parseFloat(win.getComputedStyle(hero3dWhite).fontSize);
          var stepPx = fontSize * STEP_RATIO;
          var px1 = PARALLAX_PX;
          var px2 = PARALLAX_PX * 2;
          hero3dGreen.style.transform =
            'translate(' + (-stepPx + currentNormX * px1) + 'px, ' + (stepPx + currentNormY * px1) + 'px)';
          hero3dRed.style.transform =
            'translate(' + (-2 * stepPx + currentNormX * px2) + 'px, ' + (2 * stepPx + currentNormY * px2) + 'px)';
        }
      }
    }

    if (methodTitleMain) {
      var mRect = methodTitleMain.getBoundingClientRect();
      var mCenterX = mRect.left + mRect.width / 2;
      var mCenterY = mRect.top + mRect.height / 2;
      var mNormX = (mouseX - mCenterX) / Math.max(mRect.width / 2, 1);
      var mNormY = (mouseY - mCenterY) / Math.max(mRect.height / 2, 1);
      mNormX = Math.max(-1, Math.min(1, mNormX));
      mNormY = Math.max(-1, Math.min(1, mNormY));
      currentNormXMethod = lerp(currentNormXMethod, mNormX, ease);
      currentNormYMethod = lerp(currentNormYMethod, mNormY, ease);
      methodTitleMain.style.setProperty('--mouse-x', currentNormXMethod);
      methodTitleMain.style.setProperty('--mouse-y', currentNormYMethod);
      var mTx = currentNormXMethod * 6;
      var mTy = currentNormYMethod * 6;
      methodTitleMain.style.transform = 'rotate(-3deg) translate(' + mTx + 'px, ' + mTy + 'px)';
      if (method3dWhite && method3dGreen && method3dRed) {
        var mFontSize = parseFloat(win.getComputedStyle(method3dWhite).fontSize);
        var mStepPx = mFontSize * STEP_RATIO;
        var mPx1 = PARALLAX_PX;
        var mPx2 = PARALLAX_PX * 2;
        method3dGreen.style.transform =
          'translate(' + (-mStepPx + currentNormXMethod * mPx1) + 'px, ' + (mStepPx + currentNormYMethod * mPx1) + 'px)';
        method3dRed.style.transform =
          'translate(' + (-2 * mStepPx + currentNormXMethod * mPx2) + 'px, ' + (2 * mStepPx + currentNormYMethod * mPx2) + 'px)';
      }
    }

    if (bookTitleMain) {
      var bRect = bookTitleMain.getBoundingClientRect();
      var bCenterX = bRect.left + bRect.width / 2;
      var bCenterY = bRect.top + bRect.height / 2;
      var bNormX = (mouseX - bCenterX) / Math.max(bRect.width / 2, 1);
      var bNormY = (mouseY - bCenterY) / Math.max(bRect.height / 2, 1);
      bNormX = Math.max(-1, Math.min(1, bNormX));
      bNormY = Math.max(-1, Math.min(1, bNormY));
      currentNormXBook = lerp(currentNormXBook, bNormX, ease);
      currentNormYBook = lerp(currentNormYBook, bNormY, ease);
      bookTitleMain.style.setProperty('--mouse-x', currentNormXBook);
      bookTitleMain.style.setProperty('--mouse-y', currentNormYBook);
      var bTx = currentNormXBook * 6;
      var bTy = currentNormYBook * 6;
      bookTitleMain.style.transform = 'rotate(-3deg) translate(' + bTx + 'px, ' + bTy + 'px)';
      if (book3dWhite && book3dGreen && book3dRed) {
        var bFontSize = parseFloat(win.getComputedStyle(book3dWhite).fontSize);
        var bStepPx = bFontSize * STEP_RATIO;
        var bPx1 = PARALLAX_PX;
        var bPx2 = PARALLAX_PX * 2;
        book3dGreen.style.transform =
          'translate(' + (-bStepPx + currentNormXBook * bPx1) + 'px, ' + (bStepPx + currentNormYBook * bPx1) + 'px)';
        book3dRed.style.transform =
          'translate(' + (-2 * bStepPx + currentNormXBook * bPx2) + 'px, ' + (2 * bStepPx + currentNormYBook * bPx2) + 'px)';
      }
    }

    mouseFollowEls.forEach(function (el) {
      if (el.classList.contains('hero-title-main') || el.classList.contains('focus-title-main')) return;
      gsap.set(el, { x: currentX, y: currentY });
    });
    rafId = requestAnimationFrame(updateMouseFollow);
  }

  if (win.innerWidth > 768) {
    win.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    if (mouseFollowEls.length || heroTitleMain || methodTitleMain) rafId = requestAnimationFrame(updateMouseFollow);
  }

  // ----- 2. Etiquetas flotantes: float en JS + parallax cursor (transform en el tag completo) -----
  var floatingTags = doc.querySelectorAll('.hero-tags .tag');
  if (win.innerWidth > 768 && floatingTags.length) {
    var depths = [0.008, 0.012, 0.006, 0.010];
    // Restore tag content if it was wrapped (remove inner span so whole tag moves)
    floatingTags.forEach(function (tag) {
      var wrap = tag.querySelector('.tag-cursor-wrap');
      if (wrap) {
        tag.textContent = wrap.textContent;
      }
    });
    var floatTime = 0;
    var floatSpeeds = [1.0, 0.7, 1.3, 0.9];
    var floatAmounts = [6, 8, 5, 7];
    var cursorDX = 0;
    var cursorDY = 0;
    win.addEventListener('mousemove', function (e) {
      var cx = win.innerWidth / 2;
      var cy = win.innerHeight / 2;
      cursorDX = e.clientX - cx;
      cursorDY = e.clientY - cy;
    });
    function animateFloatTags() {
      floatTime += 0.01;
      floatingTags.forEach(function (tag, i) {
        var floatY = Math.sin(floatTime * floatSpeeds[i]) * floatAmounts[i];
        var depth = depths[i % depths.length];
        var moveX = cursorDX * depth;
        var moveY = cursorDY * depth + floatY;
        tag.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
      });
      requestAnimationFrame(animateFloatTags);
    }
    animateFloatTags();
  }

  // ----- 2b. Animated counters (slot machine) + stars (fade+scale) on scroll into view (hero only) -----
  function animateCounter(element, target, duration, decimals, suffix) {
    var steps = 20;
    var interval = duration / steps;
    var step = 0;
    var tick = setInterval(function () {
      step++;
      var progress = step / steps;
      var eased = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;
      var current = eased * target;
      if (step < steps) {
        var flicker = decimals > 0
          ? Math.floor(current * 10) + Math.floor(Math.random() * 3)
          : Math.floor(current) + Math.floor(Math.random() * 3);
        var display = decimals > 0
          ? Math.min(flicker / 10, target).toFixed(decimals) + suffix
          : Math.min(flicker, target) + suffix;
        element.textContent = display;
      } else {
        element.textContent = (decimals > 0 ? Number(target).toFixed(decimals) : target) + suffix;
        clearInterval(tick);
      }
    }, interval);
  }
  function animateStarsInElement(starsEl) {
    if (!starsEl) return;
    starsEl.innerHTML = '★★★★★'.split('').map(function (s) {
      return '<span style="display:inline-block; opacity:0; transform:scale(0.3) translateY(8px); transition:opacity 0.35s ease, transform 0.35s ease;">' + s + '</span>';
    }).join('');
    setTimeout(function () {
      starsEl.querySelectorAll('span').forEach(function (span, i) {
        setTimeout(function () {
          span.style.opacity = '1';
          span.style.transform = 'scale(1.2) translateY(0px)';
          setTimeout(function () {
            span.style.transform = 'scale(1) translateY(0px)';
          }, 200);
        }, i * 180);
      });
    }, 50);
  }
  function runHeroStarsAnimation() {
    var starsEl = doc.querySelector('.hero-stats > span:nth-child(2) .stat-num');
    animateStarsInElement(starsEl);
  }
  var statsAnimationRun = false;
  function runStatsAnimation() {
    if (statsAnimationRun) return;
    statsAnimationRun = true;
    var lessonsEl = doc.querySelector('.hero-stats > span:first-child .stat-num');
    var ratingEl = doc.querySelector('.hero-stats > span:nth-child(2) .stat-label');
    var yearsEl = doc.querySelector('.hero-stats .stat-num-accent');
    if (lessonsEl) animateCounter(lessonsEl, 4500, 2000, 0, '+');
    if (ratingEl) animateCounter(ratingEl, 5.0, 1500, 1, ' RATING');
    if (yearsEl) animateCounter(yearsEl, 10, 1500, 0, '+ YEARS');
  }
  var statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        runStatsAnimation();
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.1 });
  var statsRow = doc.querySelector('.hero-stats');
  if (statsRow) statsObserver.observe(statsRow);
  win.setTimeout(runStatsAnimation, 500);

  var proofSection = doc.getElementById('proof');
  var proofStatsRun = false;
  var proofStatsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !proofStatsRun) {
        proofStatsRun = true;
        var proofLessons = doc.getElementById('proof-lessons-num');
        var proofRating = doc.getElementById('proof-rating-num');
        var proofStars = doc.getElementById('proof-stars');
        if (proofLessons) animateCounter(proofLessons, 4500, 2000, 0, '+');
        if (proofRating) animateCounter(proofRating, 5.0, 1500, 1, '');
        if (proofStars) animateStarsInElement(proofStars);
        proofStatsObserver.disconnect();
      }
    });
  }, { threshold: 0.1 });
  if (proofSection) proofStatsObserver.observe(proofSection);

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', function () {
      win.setTimeout(runHeroStarsAnimation, 800);
    });
  } else {
    win.setTimeout(runHeroStarsAnimation, 800);
  }

  // ----- 3. Video About: overlay que crece con width/height (sin scale) — desactivar en mobile (<=768px) -----
  const videoSection = doc.querySelector('.video-section');
  const videoWrapper = doc.querySelector('.video-wrapper');

  if (videoSection && videoWrapper && win.innerWidth > 768) {
    var overlay = doc.createElement('div');
    overlay.className = 'video-expand-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    var overlayInner = doc.createElement('div');
    overlayInner.className = 'video-expand-overlay-inner';
    var clone = videoWrapper.cloneNode(true);
    clone.classList.add('video-expand-clone');
    overlayInner.appendChild(clone);
    overlay.appendChild(overlayInner);
    doc.body.appendChild(overlay);

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function hideOverlay() {
      overlay.classList.remove('active');
      videoWrapper.style.visibility = '';
    }

    ScrollTrigger.create({
      trigger: videoSection,
      start: 'top top',
      end: '+=100vh',
      pin: true,
      pinSpacing: true,
      anticipatePin: 1
    });

    ScrollTrigger.create({
      trigger: videoSection,
      start: 'top top',
      end: '+=100vh',
      scrub: 1,
      anticipatePin: 1,
      onUpdate: function (self) {
        var p = self.progress;
        var vw = win.innerWidth;
        var vh = win.innerHeight;

        if (p <= 0) {
          hideOverlay();
          return;
        }
        if (p >= 1) {
          hideOverlay();
          return;
        }

        overlay.classList.add('active');
        videoWrapper.style.visibility = 'hidden';

        var r = videoWrapper.getBoundingClientRect();
        var left = lerp(r.left, 0, p);
        var top = lerp(r.top, 0, p);
        var width = lerp(r.width, vw, p);
        var height = lerp(r.height, vh, p);
        var radius = Math.round(8 * (1 - p));

        overlayInner.style.left = left + 'px';
        overlayInner.style.top = top + 'px';
        overlayInner.style.width = width + 'px';
        overlayInner.style.height = height + 'px';
        overlayInner.style.borderRadius = radius + 'px';
      },
      onLeave: hideOverlay,
      onLeaveBack: hideOverlay
    });

    win.addEventListener('resize', function () {
      ScrollTrigger.refresh();
    });
  }

  // ----- 4. PROOF: mazo de tarjetas — click para pasar al frente -----
  var proofStack = doc.getElementById('proof-stack');
  var proofCards = doc.querySelectorAll('.proof-card');
  var proofActive = 0;
  if (proofStack && proofCards.length === 3) {
    proofStack.setAttribute('data-active', '0');
    proofStack.addEventListener('click', function () {
      proofActive = (proofActive + 1) % 3;
      proofStack.setAttribute('data-active', String(proofActive));
    });
    proofCards.forEach(function (card) {
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          proofActive = (proofActive + 1) % 3;
          proofStack.setAttribute('data-active', String(proofActive));
        }
      });
    });
    gsap.fromTo(proofStack,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        scrollTrigger: {
          trigger: proofStack,
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // ----- 5. CTA: animación sencilla -----
  const ctaTitle = doc.querySelector('.cta-title');
  const ctaSub = doc.querySelector('.cta-sub');
  const ctaBtn = doc.querySelector('.cta-section .btn');

  if (ctaTitle) {
    gsap.fromTo(ctaTitle,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        scrollTrigger: {
          trigger: ctaTitle,
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }
  if (ctaSub) {
    gsap.fromTo(ctaSub,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.15,
        scrollTrigger: {
          trigger: ctaSub,
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }
  if (ctaBtn) {
    gsap.fromTo(ctaBtn,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.25,
        scrollTrigger: {
          trigger: ctaBtn,
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // ----- Navegación lateral: aparece al hacer scroll y marca la sección actual -----
  const sideNav = doc.querySelector('.side-nav');
  const sideNavLinks = doc.querySelectorAll('.side-nav-link');
  const sectionIds = ['about-scroll-driver', 'method', 'proof', 'book'];

  function updateSideNav() {
    var aboutEl = doc.getElementById('about-scroll-driver');
    if (!sideNav || !aboutEl) return;

    var scrollY = win.scrollY;
    var viewportMid = scrollY + win.innerHeight / 2;

    if (aboutEl.getBoundingClientRect().top < win.innerHeight * 0.85) {
      sideNav.classList.add('visible');
    } else {
      sideNav.classList.remove('visible');
    }

    var current = null;
    sectionIds.forEach(function (id) {
      var el = doc.getElementById(id);
      if (!el) return;
      var rect = el.getBoundingClientRect();
      var top = rect.top + scrollY;
      var bottom = top + rect.height;
      if (viewportMid >= top && viewportMid <= bottom) current = id;
    });

    sideNavLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-section') === current);
    });
  }

  if (sideNav && sideNavLinks.length) {
    win.addEventListener('scroll', updateSideNav);
    win.addEventListener('resize', updateSideNav);
    updateSideNav();
  }

  // Respetar prefers-reduced-motion: desactivar solo animaciones decorativas
  if (win.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (rafId) cancelAnimationFrame(rafId);
    mouseFollowEls.forEach(function (el) {
      gsap.set(el, { clearProps: 'transform' });
    });
    if (heroTitleMain) {
      heroTitleMain.style.removeProperty('--mouse-x');
      heroTitleMain.style.removeProperty('--mouse-y');
    }
    floatingTags.forEach(function (tag) {
      gsap.killTweensOf(tag);
    });
  }
})();

// ----- About section: scroll-driven video expand (solo desktop > 768px) -----
(function () {
  if (window.innerWidth > 768) {
    const aboutDriver = document.getElementById('about-scroll-driver');
    const aboutVideo = document.getElementById('video-wrap');
    const aboutHeroText = document.getElementById('about-hero-text');

    const INIT_W = 200;
    const INIT_H = 150;

    function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }
    function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

    function onScrollAboutVideo() {
      if (!aboutDriver || !aboutVideo || !aboutHeroText) return;
      const rect = aboutDriver.getBoundingClientRect();
      const driverH = aboutDriver.offsetHeight;
      const scrolled = clamp(-rect.top, 0, driverH);
      const progress = scrolled / driverH;

      const growEased = easeInOut(clamp(progress / 0.5, 0, 1));

      const currentW = lerp(INIT_W, window.innerWidth, growEased);
      const currentH = lerp(INIT_H, window.innerHeight, growEased);
      const radius = lerp(4, 0, growEased);

      const startTop = window.innerHeight * 0.34 - INIT_H * 0.5;
      const startLeft = window.innerWidth * 0.5 - INIT_W * 0.5;

      aboutVideo.style.width = currentW + 'px';
      aboutVideo.style.height = currentH + 'px';
      aboutVideo.style.top = lerp(startTop, 0, growEased) + 'px';
      aboutVideo.style.left = lerp(startLeft, 0, growEased) + 'px';
      aboutVideo.style.transform = 'none';
      aboutVideo.style.borderRadius = radius + 'px';

      aboutHeroText.style.opacity = 1 - clamp((progress - 0.5) / 0.2, 0, 1);
    }

    window.addEventListener('scroll', onScrollAboutVideo, { passive: true });
    window.addEventListener('resize', onScrollAboutVideo);
    onScrollAboutVideo();
  }
})();

function toggleMute() {
  const video = document.querySelector('#video-wrap video');
  const iconOn = document.getElementById('icon-sound');
  const iconOff = document.getElementById('icon-mute');
  if (!video) return;
  video.muted = !video.muted;
  iconOn.style.display = video.muted ? 'none' : 'block';
  iconOff.style.display = video.muted ? 'block' : 'none';
}

const aboutVideo = document.querySelector('#video-wrap video');
if (aboutVideo) {
  aboutVideo.play().catch(function () {
    aboutVideo.muted = true;
    var iconOn = document.getElementById('icon-sound');
    var iconOff = document.getElementById('icon-mute');
    if (iconOn) iconOn.style.display = 'none';
    if (iconOff) iconOff.style.display = 'block';
  });
}

function togglePlay() {
  const video = document.querySelector('#video-wrap video');
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');
  if (!video) return;
  if (video.paused) {
    video.play();
    iconPlay.style.display = 'none';
    iconPause.style.display = 'block';
  } else {
    video.pause();
    iconPlay.style.display = 'block';
    iconPause.style.display = 'none';
  }
}

function seekVideo(e) {
  const video = document.querySelector('#video-wrap video');
  const bar = document.getElementById('progress-bar-bg');
  if (!video || !bar) return;
  const rect = bar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const percent = clickX / rect.width;
  video.currentTime = percent * video.duration;
}

var aboutVideoEl = document.querySelector('#video-wrap video');
if (aboutVideoEl) {
  aboutVideoEl.addEventListener('timeupdate', function () {
    var fill = document.getElementById('progress-bar-fill');
    if (!fill || !aboutVideoEl.duration) return;
    fill.style.width = (aboutVideoEl.currentTime / aboutVideoEl.duration * 100) + '%';
  });
}

// ----- Cursor personalizado global con emojis -----
(function () {
  function createEmojiCursor(emoji, size) {
    if (size === void 0) size = 13;
    var canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 52;
    var ctx = canvas.getContext('2d');
    if (!ctx) return '';
    ctx.font = size + 'px serif';
    ctx.textBaseline = 'bottom';
    ctx.fillText(emoji, 2, size);
    return canvas.toDataURL();
  }

  var normalCursor = createEmojiCursor('🤌');
  var pointerCursor = createEmojiCursor('👆');

  if (normalCursor && pointerCursor) {
    var style = document.createElement('style');
    style.textContent =
      '* { cursor: url(' + normalCursor + ') 2 2, auto !important; }' +
      '\n' +
      'a, button, [onclick], [role=\"button\"], [cursor=\"pointer\"], .btn, .proof-card, .side-nav-link { cursor: url(' + pointerCursor + ') 2 0, pointer !important; }';
    document.head.appendChild(style);
  }
})();

// ----- Hamburger / menú mobile -----
(function () {
  var hamburger = document.querySelector('.hamburger');
  var overlay = document.querySelector('.mobile-nav-overlay');
  var closeBtn = document.querySelector('.mobile-nav-close');
  var links = document.querySelectorAll('.mobile-nav-links a');
  if (hamburger && overlay) hamburger.addEventListener('click', function () { overlay.classList.add('open'); });
  if (closeBtn && overlay) closeBtn.addEventListener('click', function () { overlay.classList.remove('open'); });
  links.forEach(function (a) {
    a.addEventListener('click', function () {
      if (overlay) overlay.classList.remove('open');
    });
  });
})();
