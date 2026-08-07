/* ═══════════════════════════════════════════════════════
   mockup-ui.js — Dev-Chrome für HTML-Mockup-Seiten
   Begleiter zu mockup-ui.css. Nie in Produktion einbinden.

   Tastatur: Alt+M (Mac: ⌥M) — Mockup-Chrome ein-/ausblenden
   (Bar, FAB, FAB-Panel). Zustand in sessionStorage.
   ═══════════════════════════════════════════════════════ */
(function () {
  const STORAGE_KEY = 'inuvet-mockup-ui-hidden';

  function setHidden(hidden) {
    document.documentElement.classList.toggle('--mockup-ui-hidden', hidden);
    if (document.body) {
      document.body.classList.toggle('--mockup-ui-hidden', hidden);
    }
    try {
      sessionStorage.setItem(STORAGE_KEY, hidden ? '1' : '0');
    } catch (_) { /* private mode */ }
  }

  function isHidden() {
    return document.documentElement.classList.contains('--mockup-ui-hidden');
  }

  function restore() {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === '1') setHidden(true);
    } catch (_) { /* ignore */ }
  }

  // Capture-Phase + auch bei Fokus in Input/Select (Collection-Filter etc.)
  document.addEventListener('keydown', (e) => {
    // e.code = physische Taste (DE-Layout: ⌥M liefert e.key "µ", nicht "m")
    if (e.code !== 'KeyM' && e.key !== 'µ') return;
    if (!e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault();
    setHidden(!isHidden());
  }, true);

  restore();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', restore);
  }
})();
