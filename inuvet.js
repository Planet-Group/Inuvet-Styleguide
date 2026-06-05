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

/* ═══════════════════════════════════════════════════════
   TESTIMONIAL GRID (Mobile: erste 3 sichtbar, Rest per Button)
   ═══════════════════════════════════════════════════════ */

function initTestimonials() {
  document.querySelectorAll('.testimonial-section').forEach(function(section) {
    var grid = section.classList.contains('testimonial-grid')
      ? section
      : section.querySelector('.testimonial-grid');
    if (!grid) return;
    var items = grid.querySelectorAll('.testimonial');
    items.forEach(function(item, i) {
      if (i < 3) item.classList.add('--visible');
    });
  });
}

function showMore(btn) {
  var section = btn.closest('.testimonial-section') || btn.closest('.page');
  var grid = section.querySelector('.testimonial-grid');
  var hidden = grid.querySelectorAll('.testimonial:not(.--visible)');
  var count = 0;
  hidden.forEach(function(item) {
    if (count < 3) { item.classList.add('--visible'); count++; }
  });
  if (grid.querySelectorAll('.testimonial:not(.--visible)').length === 0) {
    btn.parentElement.classList.add('--hidden');
  }
}

document.addEventListener('DOMContentLoaded', initTestimonials);

/* ═══════════════════════════════════════════════════════
   TESTIMONIAL SLIDER
   Aufruf: initSliders() nach dem Rendern der Slides.
   showMoreSlider(btn) — onclick auf .testimonial-more > button
   ═══════════════════════════════════════════════════════ */

function initSliders() {
  document.querySelectorAll('.testimonial-slider').forEach(function(slider) {
    var track   = slider.querySelector('.testimonial-slider__track');
    var slides  = slider.querySelectorAll('.testimonial-slider__slide');
    var prevBtn = slider.querySelector('[data-dir="prev"]');
    var nextBtn = slider.querySelector('[data-dir="next"]');
    var nav     = slider.querySelector('.slider-nav');
    var counter = slider.querySelector('.slider-counter');
    var current = 0;

    function getVisible() {
      var w = window.innerWidth;
      if (w <= 767) return slides.length;
      if (slider.classList.contains('--cols-4')) {
        if (w <= 899)  return 2;
        if (w <= 1100) return 3;
        return 4;
      }
      return w <= 1100 ? 2 : 3;
    }
    function getMaxPage() { return Math.max(0, slides.length - getVisible()); }
    function update() {
      var vis     = getVisible();
      var maxPage = getMaxPage();
      if (current > maxPage) current = maxPage;
      if (nav) nav.style.display = maxPage > 0 ? '' : 'none';
      if (slides.length > 0 && vis < slides.length) {
        var slideWidth = slides[0].offsetWidth;
        var gap = slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft - slideWidth : 0;
        track.style.transform = 'translateX(-' + (current * (slideWidth + gap)) + 'px)';
      } else {
        track.style.transform = 'translateX(0)';
      }
      if (counter) counter.textContent = (current + 1) + ' – ' + Math.min(current + vis, slides.length) + ' / ' + slides.length;
      if (prevBtn) prevBtn.disabled = current === 0;
      if (nextBtn) nextBtn.disabled = current >= maxPage;
    }
    if (prevBtn) prevBtn.addEventListener('click', function() { if (current > 0) { current--; update(); } });
    if (nextBtn) nextBtn.addEventListener('click', function() { if (current < getMaxPage()) { current++; update(); } });
    var startX = 0;
    track.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function(e) {
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { if (diff > 0 && current < getMaxPage()) current++; else if (diff < 0 && current > 0) current--; update(); }
    }, { passive: true });
    slides.forEach(function(s, i) { if (i < 3) s.classList.add('--visible'); });
    var moreDiv = slider.nextElementSibling;
    if (moreDiv && moreDiv.classList.contains('testimonial-more')) {
      if (slider.querySelectorAll('.testimonial-slider__slide:not(.--visible)').length === 0) {
        moreDiv.classList.add('--hidden');
      }
    }
    window.addEventListener('resize', function() { update(); });
    update();
  });
}

function showMoreSlider(btn) {
  var moreDiv = btn.parentElement;
  var slider = moreDiv.previousElementSibling;
  while (slider && !slider.classList.contains('testimonial-slider')) {
    slider = slider.previousElementSibling;
  }
  if (!slider) return;
  var hidden = slider.querySelectorAll('.testimonial-slider__slide:not(.--visible)');
  var count = 0;
  hidden.forEach(function(s) { if (count < 3) { s.classList.add('--visible'); count++; } });
  if (slider.querySelectorAll('.testimonial-slider__slide:not(.--visible)').length === 0) {
    moreDiv.classList.add('--hidden');
  }
}
