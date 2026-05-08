/* ═══════════════════════════════════════════
   inuvet-effects.js — Shared UI Effects
   ═══════════════════════════════════════════ */

/* ─── Parallax: section-type --v3 / --v4 ───
   Verschiebt .section-type__image vertikal beim Scrollen.
   Setzt transform: translateY — überschreibt die einmalige heroPanIn-Animation
   nicht sichtbar (scale(1) hat keinen Effekt).
   Deaktiviert bei prefers-reduced-motion. */
(function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const FACTOR   = 0.22;   // Stärke des Effekts (0 = kein, 1 = voll)
  const selector = '.section-type.--v3, .section-type.--v4';
  const sections = Array.from(document.querySelectorAll(selector));
  if (!sections.length) return;

  let scheduled = false;

  const tick = () => {
    scheduled = false;
    const vh = window.innerHeight;
    sections.forEach(section => {
      const img = section.querySelector('.section-type__image');
      if (!img) return;
      const rect   = section.getBoundingClientRect();
      // progress: 0 wenn Section gerade den Viewport betritt, 1 wenn sie ihn verlässt
      const progress = (vh - rect.top) / (vh + rect.height);
      const offset   = (progress - 0.5) * rect.height * FACTOR;
      img.style.transform = `translateY(${offset.toFixed(2)}px)`;
    });
  };

  window.addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(tick);
    }
  }, { passive: true });

  // Initialwert setzen (für Sections die beim Laden schon sichtbar sind)
  tick();
})();
