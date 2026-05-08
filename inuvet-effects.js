/* ═══════════════════════════════════════════
   inuvet-effects.js — Shared UI Effects
   ═══════════════════════════════════════════ */

/* ─── Parallax: section-type --v3 / --v4 ───
   Strategie:
   1. Auf animationend warten (exakter als setTimeout) — vermeidet
      Timing-Jitter zwischen CSS-Animation und JS-Transform.
   2. Beim Übergang kurz eine CSS-Transition setzen, damit der erste
      Positions-Wechsel als sanftes Gleiten erscheint, nicht als Sprung.
   3. Transition nach dem ersten Frame entfernen, damit Scroll-Updates
      direkt und ohne Lag-Artefakte reagieren.
   4. Deaktiviert bei prefers-reduced-motion. */
(function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const FACTOR   = 0.22;
  const selector = '.section-type.--v3, .section-type.--v4';
  const sections = Array.from(document.querySelectorAll(selector));
  if (!sections.length) return;

  let scheduled = false;

  const tick = () => {
    scheduled = false;
    const vh = window.innerHeight;
    sections.forEach(section => {
      const img = section.querySelector('.section-type__image');
      if (!img || !img._parallaxReady) return;
      const rect     = section.getBoundingClientRect();
      const progress = (vh - rect.top) / (vh + rect.height);
      const offset   = (progress - 0.5) * rect.height * FACTOR;
      img.style.transform = `translateY(${offset.toFixed(2)}px)`;
    });
  };

  const startParallax = (img) => {
    // Sanfter Übergang für den ersten Positions-Wechsel
    img.style.transition = 'transform 0.35s ease';

    requestAnimationFrame(() => {
      tick();
      // Transition nach dem ersten Frame entfernen — Scroll bleibt direkt
      setTimeout(() => { img.style.transition = ''; }, 400);
    });

    img._parallaxReady = true;
  };

  sections.forEach(section => {
    const img = section.querySelector('.section-type__image');
    if (!img) return;

    // animationend: exakter Zeitpunkt, kein Blind-Timeout
    img.addEventListener('animationend', () => {
      img.style.animation = 'none'; // fill-mode-Konflikt auflösen
      startParallax(img);
    }, { once: true });

    // Fallback: falls kein heroPanIn läuft (z.B. placeholder-bg im Styleguide)
    const computed = getComputedStyle(img).animationName;
    if (!computed || computed === 'none') {
      startParallax(img);
    }
  });

  window.addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(tick);
    }
  }, { passive: true });
})();
