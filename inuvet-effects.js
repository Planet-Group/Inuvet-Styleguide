/* ═══════════════════════════════════════════
   inuvet-effects.js — Shared UI Effects
   ═══════════════════════════════════════════ */

/* ─── Parallax: section-type --v3 / --v4 ───
   heroPanIn läuft mit animation-fill-mode: both → hält transform: scale(1)
   und überschreibt JS-style.transform. Lösung: Animation nach Ablauf
   deaktivieren, dann Parallax per rAF-Scroll-Listener starten.
   Deaktiviert bei prefers-reduced-motion. */
(function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const FACTOR        = 0.22;   // Parallax-Intensität (0 = kein, 1 = voll)
  const ANIM_WAIT_MS  = 1350;   // heroPanIn-Dauer (1.2s) + kleiner Puffer
  const selector      = '.section-type.--v3, .section-type.--v4';
  const sections      = Array.from(document.querySelectorAll(selector));
  if (!sections.length) return;

  let scheduled = false;

  const tick = () => {
    scheduled = false;
    const vh = window.innerHeight;
    sections.forEach(section => {
      const img = section.querySelector('.section-type__image');
      if (!img) return;
      const rect     = section.getBoundingClientRect();
      // progress: 0 beim Betreten, 1 beim Verlassen des Viewports
      const progress = (vh - rect.top) / (vh + rect.height);
      const offset   = (progress - 0.5) * rect.height * FACTOR;
      img.style.transform = `translateY(${offset.toFixed(2)}px)`;
    });
  };

  // CSS-Animation abwarten, dann deaktivieren und Parallax starten
  setTimeout(() => {
    sections.forEach(section => {
      const img = section.querySelector('.section-type__image');
      if (img) img.style.animation = 'none'; // fill-mode-Konflikt auflösen
    });

    window.addEventListener('scroll', () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(tick);
      }
    }, { passive: true });

    tick(); // Initialwert für bereits sichtbare Sections
  }, ANIM_WAIT_MS);
})();
