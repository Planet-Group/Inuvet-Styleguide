/* ═══════════════════════════════════════════════════════
   inuvet.js — Globale UI-Hilfsfunktionen
   Auf allen Seiten einbinden die .site-nav / .mobile-menu nutzen.
   ═══════════════════════════════════════════════════════ */

function toggleMobile() {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.getElementById('hamburger');
  const open = menu.classList.toggle('--open');
  btn.classList.toggle('--open', open);
  btn.setAttribute('aria-expanded', String(open));
}

function closeMobile() {
  document.getElementById('mobileMenu')?.classList.remove('--open');
  const btn = document.getElementById('hamburger');
  if (btn) { btn.classList.remove('--open'); btn.setAttribute('aria-expanded', 'false'); }
}
