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

function closeAnnouncement() {
  document.getElementById('announcementBar')?.classList.add('--closed');
  document.documentElement.style.setProperty('--announcement-height', '0px');
  sessionStorage.setItem('announcementClosed', '1');
}

function initMarquees() {
  document.querySelectorAll('.announcement-bar.--marquee .announcement-bar__track').forEach(track => {
    const bar = track.closest('.announcement-bar');
    const minWidth = bar.offsetWidth * 2;
    const originalChildren = [...track.children];
    while (track.scrollWidth < minWidth) {
      originalChildren.forEach(child => track.appendChild(child.cloneNode(true)));
    }
  });
}

document.addEventListener('DOMContentLoaded', initMarquees);

function toggleAccordion(trigger) {
  const item = trigger.parentElement;
  const isOpen = item.classList.toggle('--open');
  trigger.setAttribute('aria-expanded', isOpen);
}

function initScrollAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('--in-view'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -4% 0px' });

  document.querySelectorAll('.tile-grid .tile:not([data-animate])').forEach((tile, i) => {
    tile.setAttribute('data-animate', '');
    tile.style.setProperty('--anim-delay', Math.min(i, 5) * 70 + 'ms');
    observer.observe(tile);
  });
}

document.addEventListener('DOMContentLoaded', initScrollAnimations);
