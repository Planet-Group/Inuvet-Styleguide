/* ═══════════════════════════════════════════════════════
   planet-brands.js — Globale UI-Hilfsfunktionen & Shop-Core
   Auf allen Seiten einbinden (analog zu planet-brands.css).

   Theme-Portabilität (Shopify): Jeder Block ist markiert.
   [PORTABEL → Theme]        unverändert ins Theme-Bundle übernehmen
   [MOCKUP — nicht portieren] Demo-Daten & localStorage-Warenkorb —
   im Theme neu gegen die Cart AJAX API (siehe CLAUDE.md → JS-Schichtung).
   ═══════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════
   BASIS-UI — Nav, Marquee, Accordion, Scroll-Animationen
   [PORTABEL → Theme]
   ═══════════════════════════════════════════════════════ */

/* Mobile-Menü: top dynamisch an die aktuelle Nav-Unterkante setzen.
   Funktioniert für beide Header-Modi: Scroll-Away (Default, Nav top: 0) und
   Sticky-Bar (body.--ann-sticky, Nav unter der Bar).
   Beim Öffnen ist der Scroll via body{overflow:hidden} gesperrt → stabil. */
function positionMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const nav  = document.querySelector('.site-nav');
  if (menu && nav) {
    menu.style.top = nav.getBoundingClientRect().bottom + 'px';
  }
}

function toggleMobile() {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.getElementById('hamburger');
  const open = menu.classList.toggle('--open');
  btn.classList.toggle('--open', open);
  btn.setAttribute('aria-expanded', String(open));
  if (open) positionMobileMenu();
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

// Announcement Bar — statische Variante (.--static)
// Passt alles in eine Zeile → nebeneinander. Sonst .--rotate: ein Item nach dem
// anderen (Fade), wie mobil. Entscheidung über echte Breite, nicht über Breakpoint.
function initAnnouncementBar() {
  document.querySelectorAll('.announcement-bar.--static').forEach(bar => {
    if (typeof bar._annCleanup === 'function') bar._annCleanup();

    const track = bar.querySelector('.announcement-bar__track');
    if (!track) return;
    const items = [...track.querySelectorAll('.announcement-bar__item')];
    if (!items.length) return;
    bar.classList.add('--js');

    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer = null;
    let idx = 0;
    let ro = null;

    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    function stepMs() {
      const raw = getComputedStyle(document.documentElement).getPropertyValue('--anim-announcement').trim();
      const n = parseFloat(raw) || 4;
      return raw.indexOf('ms') > -1 ? n : n * 1000;
    }

    function startRotation() {
      items.forEach((it, i) => it.classList.toggle('--visible', i === 0));
      idx = 0;
      stop();
      if (items.length > 1 && !mqReduce.matches) {
        timer = setInterval(() => {
          items[idx].classList.remove('--visible');
          idx = (idx + 1) % items.length;
          items[idx].classList.add('--visible');
        }, stepMs());
      }
    }

    // Inhalt inkl. Trenner-Margins (getBoundingClientRect zählt Margin nicht;
    // --module-Margins der Dots waren der Grund, warum „passt“ trotz Anschnitt).
    function rowOverflows() {
      let total = 0;
      [...track.children].forEach(n => {
        const s = getComputedStyle(n);
        if (s.display === 'none') return;
        total += n.getBoundingClientRect().width
          + parseFloat(s.marginLeft)
          + parseFloat(s.marginRight);
      });
      return total > bar.clientWidth + 1 || track.scrollWidth > bar.clientWidth + 1;
    }

    function syncScrollAway() {
      const section = bar.closest('.shopify-section--sticky-header');
      if (!section || !bar.classList.contains('--scroll-away')) return;
      section.style.setProperty('--ann-scroll-away', `${bar.offsetHeight}px`);
    }

    function apply() {
      stop();
      items.forEach(it => it.classList.remove('--visible'));
      bar.classList.remove('--rotate');
      void bar.offsetWidth;
      if (rowOverflows()) {
        bar.classList.add('--rotate');
        startRotation();
      }
      requestAnimationFrame(syncScrollAway);
    }

    (document.fonts ? document.fonts.ready : Promise.resolve()).then(apply);
    apply();

    let lastW = -1;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(entries => {
        const w = Math.round(entries[0].contentRect.width);
        if (w !== lastW) {
          lastW = w;
          requestAnimationFrame(apply);
        } else {
          syncScrollAway();
        }
      });
      ro.observe(bar);
    } else {
      let rt;
      window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(apply, 150); });
    }

    bar._annCleanup = () => { stop(); if (ro) ro.disconnect(); };
  });
}
document.addEventListener('DOMContentLoaded', initAnnouncementBar);

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

  /* Pro Gruppe staffeln — sonst bekommen spätere Sections alle denselben Max-Delay */
  /* Auch Elemente mit bereits gesetztem data-animate beobachten (sonst bleiben sie auf opacity:0). */
  [
    ['.tile-grid', '.tile'],
    ['.ingredient-list', '.ingredient'],
    ['.testimonial-grid', '.testimonial'],
  ].forEach(([groupSel, itemSel]) => {
    document.querySelectorAll(groupSel).forEach(group => {
      group.querySelectorAll(itemSel).forEach((el, i) => {
        if (!el.hasAttribute('data-animate')) el.setAttribute('data-animate', '');
        el.style.setProperty('--anim-delay', Math.min(i, 5) * 70 + 'ms');
        if (!el.classList.contains('--in-view')) observer.observe(el);
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', initScrollAnimations);

/** Lottie: Aspect-Ratio aus JSON (w/h), damit Hero/Section nicht auf Default 300×300 bleibt. */
function initLottieAspect(root) {
  const scope = root && root.querySelectorAll ? root : document;
  scope.querySelectorAll('lottie-player').forEach((player) => {
    if (player.dataset.aspectBound === '1') return;
    player.dataset.aspectBound = '1';
    const apply = () => {
      try {
        const anim = typeof player.getLottie === 'function' ? player.getLottie() : null;
        const data = anim && (anim.animationData || anim);
        const w = data && data.w;
        const h = data && data.h;
        if (w && h) {
          player.style.aspectRatio = w + ' / ' + h;
          /* V3/V4 Vollbild: Desktop füllt per CSS height 100% (cover). V3 mobil: height auto + Ratio. */
          if (!player.closest('.section-type.--v3') && !player.closest('.section-type.--v4')) {
            player.style.height = 'auto';
          }
        }
      } catch (_) { /* player noch nicht bereit */ }
    };
    player.addEventListener('ready', apply);
    apply();
  });
}

document.addEventListener('DOMContentLoaded', initLottieAspect);

/* ═══════════════════════════════════════════════════════
   PDP STICKY ATC (Mobile + Desktop)
   [PORTABEL → Theme]
   Aktiv nur mit .pdp--sticky-cta (Shopify: Section-Setting
   sticky_atc Checkbox). Bar .pdp__sticky-cta erscheint, wenn
   der Kaufblock-CTA (.pdp__actions .btn.--primary) den
   Viewport verlässt — und verschwindet wieder am Footer
   (sonst body-padding → weißer Streifen unter dem Footer).
   ═══════════════════════════════════════════════════════ */
let _pdpStickyIo = null;

function initPdpStickyCta() {
  const page = document.querySelector('.pdp--sticky-cta');
  const bar  = document.querySelector('.pdp__sticky-cta');
  const anchor = document.querySelector('.pdp__actions > .btn.--primary, .pdp__actions > .btn.--honey')
    || document.querySelector('.pdp__actions > .btn');
  const footer = document.querySelector('.site-footer');
  if (_pdpStickyIo) { _pdpStickyIo.disconnect(); _pdpStickyIo = null; }
  if (!page || !bar || !anchor) {
    bar?.classList.remove('--visible');
    bar?.setAttribute('aria-hidden', 'true');
    return;
  }

  let anchorInView = true;
  let footerInView = false;

  const sync = () => {
    const show = !anchorInView && !footerInView;
    bar.classList.toggle('--visible', show);
    bar.setAttribute('aria-hidden', show ? 'false' : 'true');
  };

  const inViewport = (el) => {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  };

  _pdpStickyIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.target === anchor) anchorInView = e.isIntersecting;
      else if (e.target === footer) footerInView = e.isIntersecting;
    });
    sync();
  }, { threshold: 0, rootMargin: '0px' });
  _pdpStickyIo.observe(anchor);
  if (footer) _pdpStickyIo.observe(footer);

  anchorInView = inViewport(anchor);
  footerInView = footer ? inViewport(footer) : false;
  sync();
}

/* ═══════════════════════════════════════════════════════
   ARTIKEL-INHALTSVERZEICHNIS (.article-toc) — Scrollspy
   [PORTABEL → Theme]
   Markiert den Link zum zuletzt passierten Abschnitt mit
   aria-current="location". Anker = h2-IDs im Artikel.
   ═══════════════════════════════════════════════════════ */

function initArticleToc() {
  const toc = document.querySelector('.article-toc');
  if (!toc) return;
  const links = [...toc.querySelectorAll('a[href^="#"]')];
  const targets = links
    .map(a => document.getElementById(decodeURIComponent(a.hash.slice(1))))
    .filter(Boolean);
  if (!targets.length) return;

  const update = () => {
    // Referenzlinie im oberen Viewport-Viertel — der zuletzt passierte Abschnitt ist aktiv
    const line = window.scrollY + window.innerHeight * 0.25;
    let current = targets[0];
    targets.forEach(t => { if (t.offsetTop <= line) current = t; });
    links.forEach(a => {
      if (a.hash === '#' + current.id) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  };

  document.addEventListener('scroll', update, { passive: true });
  update();
}

document.addEventListener('DOMContentLoaded', initArticleToc);

/* ═══════════════════════════════════════════════════════
   TESTIMONIAL GRID (Mobile: erste 3 sichtbar, Rest per Button)
   [PORTABEL → Theme]
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
  var section = btn.closest('.testimonial-section') || btn.closest('.container');
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
   [PORTABEL → Theme]
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

/* ═══════════════════════════════════════════════════════
   SHOP CORE — Katalog, Naturalrabatt, Warenkorb, Cart-UI
   Bundle.html und Live-PDP (global, wie planet-brands.css)
   [MOCKUP — nicht portieren] Katalog/Preise/localStorage-Cart sind
   Demo-Daten. Im Theme: cart.items + /cart/add.js + /cart/change.js;
   Naturalrabatt via Cart Transform / Shopify Function (→ E.4/E.9).
   Ausnahme: Block „GETEILTE UI" weiter unten ist PORTABEL.
   ═══════════════════════════════════════════════════════ */

// ── Naturalrabatt-Tabellen (global, fix) ────────────────────────────────
const TABLE_A = [
  { threshold:   400, credit:   40 },
  { threshold:   500, credit:   60 },
  { threshold:   750, credit:  120 },
  { threshold:  1000, credit:  170 },
  { threshold:  1500, credit:  170 },  // Plateau
  { threshold:  2000, credit:  350 },
  { threshold:  2500, credit:  350 },  // Plateau
  { threshold:  3000, credit:  540 },
  { threshold:  5000, credit: 1000 },
  { threshold:  7500, credit: 1500 },
  { threshold: 10000, credit: 2000 },
  { threshold: 15000, credit: 3000 },
  { threshold: 20000, credit: 4100 },
];

// Kondition B: Stückzahl → Anzahl Gratis-Stück (Spalten: standard / group).
const TABLE_B = [
  { minQty:   6, standard:   1, group:   0 },
  { minQty:  12, standard:   2, group:   0 },
  { minQty:  18, standard:   3, group:   1 },
  { minQty:  25, standard:   5, group:   2 },
  { minQty:  30, standard:   6, group:   3 },
  { minQty:  60, standard:  13, group:   6 },
  { minQty:  90, standard:  20, group:  10 },
  { minQty: 120, standard:  28, group:  14 },
  { minQty: 240, standard:  56, group:  28 },
  { minQty: 360, standard:  84, group:  42 },
  { minQty: 480, standard: 112, group:  56 },
];

// Globaler Kundentyp — Mockup: localStorage; echter Shop: Customer-Tag.
let customerType = localStorage.getItem('inuvet:customerType') || 'standard';
const setCustomerTypeGlobal = (type) => {
  customerType = type;
  localStorage.setItem('inuvet:customerType', type);
};

// ── Produktkatalog ──────────────────────────────────────────────────────
// pricingModel: 'A' (Default) oder 'B' — pro Produkt im Backend wählbar.
// isFamily: true → variants[selectedVariantIdx].sizes[selectedSizeIdx].price.
// past18Months: Käufe in den letzten 549 Tagen (18 Monate) für die Bundle-Vorauswahl.
const allProducts = [
  { id: 1, isFamily: true, title: 'Hypolene', past6Months: 14, past18Months: 38, pricingModel: 'A',
    image: '../assets/images/Calmin_Packshot_01.jpeg',
    desc: 'Unterstützt die Hautbarriere und das Immunsystem – bei Allergien und empfindlicher Haut.',
    variants: [
      { type: 'Pulver',    animals: 'Katze, Hund', sizes: [{ label: '60 g',      price: 39.90 }, { label: '250 g',     price: 129.90 }] },
      { type: 'Tabletten', animals: 'Katze, Hund', sizes: [{ label: '60 Stück',  price: 35.90 }, { label: '150 Stück', price:  79.90 }] },
    ],
    selectedVariantIdx: 0, selectedSizeIdx: 0 },

  { id: 2, isFamily: true, title: 'EnteroGast akut', cat: 'magendarm', catLabel: 'Magen & Darm',
    past6Months: 6, past18Months: 16, pricingModel: 'A',
    image: '../assets/images/EnteroGast_Packshot_01.jpg',
    feedCategory: 'Diät-Ergänzungsfuttermittel / Ergänzungsfuttermittel',
    shortDesc: '3-Phasen-Wirkung: adstringierend, absorbierend, aufbauend.',
    desc: 'EnteroGast akut fördert die Verfestigung des Kots und unterstützt die Darmfunktion in drei Phasen.',
    usps: [
      '3-Phasen-Wirkung: adstringierend, absorbierend, aufbauend.',
      'Langanhaltende Wirkung durch hohe Dosierung.',
      'Fördert die Verfestigung des Kots und unterstützt die Darmflora.',
    ],
    variants: [
      { type: 'Tabletten', animals: 'Katze, Hund', sizes: [{ label: '6 Stück', price: 7.60 }, { label: '21 Stück', price: 16.75 }] },
      { type: 'Pulver', animals: 'Katze, Hund', sizes: [{ label: '60 g', price: 23.30 }] },
      { type: 'Pulver+1', animals: 'Katze, Hund', sizes: [{ label: '25 g', price: 13.10 }] },
      { type: 'Sachets', animals: 'Katze, Hund', sizes: [{ label: '80 Sachets', price: 92.50 }] },
    ],
    selectedVariantIdx: 0, selectedSizeIdx: 1 },

  { id: 3, isFamily: true, title: 'Respirax', past6Months: 10, past18Months: 27, pricingModel: 'A',
    image: '../assets/images/Calmin_Packshot_01.jpeg',
    desc: 'Unterstützt die Atemwege und erleichtert das Durchatmen bei saisonalen Belastungen.',
    variants: [
      { type: 'Pulver',    animals: 'Katze, Hund', sizes: [{ label: '45 g',      price:  27.50 }, { label: '180 g',     price:  89.90 }] },
      { type: 'Tabletten', animals: 'Katze, Hund', sizes: [{ label: '30 Stück',  price:  29.90 }, { label: '90 Stück',  price:  74.90 }] },
    ],
    selectedVariantIdx: 0, selectedSizeIdx: 0 },

  { id: 4, isFamily: true, title: 'Vesica', past6Months: 4, past18Months: 11, pricingModel: 'A',
    image: '../assets/images/Hepax_Packshot_01.jpeg',
    desc: 'Unterstützt Blase und Harnwege – zur Vorbeugung und Begleitung von Harnwegsproblemen.',
    variants: [
      { type: 'Tabletten', animals: 'Hund', sizes: [{ label: '30 Stück', price:  32.00 }, { label: '90 Stück',  price:  85.90 }] },
      { type: 'Pulver',    animals: 'Hund', sizes: [{ label: '120 g',    price:  35.90 }, { label: '450 g',     price: 109.90 }] },
    ],
    selectedVariantIdx: 0, selectedSizeIdx: 0 },

  { id:  5, isFamily: false, title: 'Laxin Pulver',           price: 22.50, past6Months: 3, past18Months:  8, pricingModel: 'A',
    animals: 'Katze, Hund',
    desc: 'Sanfte Unterstützung der Verdauung bei trägem Darm.' },
  { id:  6, isFamily: false, title: 'Ibedex Pulver',          price: 29.90, past6Months: 0, past18Months: 14, pricingModel: 'A',
    animals: 'Katze, Hund',
    desc: 'Unterstützt Gelenke und Beweglichkeit bei aktiven und älteren Tieren.' },
  // Inzym Pulver — Einzelprodukt mit zwei Größen (Daten aus Tierarzt-Empfehlung).
  { id:  7, isFamily: false, title: 'Inzym Pulver', cat: 'bauchspeichel', catLabel: 'Bauchspeicheldrüse',
    animals: 'Katze, Hund',
    rating: '4,4', past6Months: 0, past18Months: 14, pricingModel: 'A', selectedSizeIdx: 0,
    sizes: [{ label: '50 g', price: 24.90 }, { label: '100 g', price: 44.90 }],
    shortDesc: 'Unterstützt die Bauchspeicheldrüse.',
    desc: 'Hochwertige Enzymformel zur Unterstützung der Verdauung bei Erkrankungen der Bauchspeicheldrüse. Für Hunde und Katzen.',
    ingredients: 'Pankreasenzym-Konzentrat (Lipase, Amylase, Protease), Bromelain. Ohne künstliche Konservierungsstoffe.' },
  { id:  9, isFamily: false, title: 'Otysan Fluid',           price: 24.90, past6Months: 0, past18Months:  6, pricingModel: 'A',
    animals: 'Katze, Hund',
    desc: 'Zur Pflege und Reinigung empfindlicher Ohren.' },
  // FloraComplex — Produktfamilie (Kondition A/B gilt für die Familie).
  { id: 10, isFamily: true, title: 'FloraComplex', past6Months: 0, past18Months: 16, pricingModel: 'A',
    desc: 'Probiotischer Aufbau einer gesunden Darmflora.',
    variants: [
      { type: 'Tabletten', animals: 'Katze, Hund', sizes: [{ label: '60 Stück', price: 32.90 }] },
      { type: 'Pulver',    animals: 'Katze, Hund', sizes: [{ label: '100 g',   price: 27.50 }] },
    ],
    selectedVariantIdx: 0, selectedSizeIdx: 0 },
  // Calmin balance Tabletten — Einzelprodukt (Form steht im Titel; nur Größenwahl) → E.2.
  { id: 12, isFamily: false, title: 'Calmin balance Tabletten', cat: 'beruhigung', catLabel: 'Beruhigung',
    form: 'Tabletten',
    animals: 'Katze, Hund',
    rating: '4,8', ratingCount: 214, past6Months: 0, past18Months: 0, pricingModel: 'A', selectedSizeIdx: 0,
    image: '../assets/images/Calmin_Packshot_01.jpeg',
    media: [
      { type: 'image', src: '../assets/images/Calmin_Packshot_01.jpeg', alt: 'Packshot' },
      { type: 'video', src: '../assets/images/Calmin_Packshot_02.mp4', caption: 'Teilbare Tabletten mit hoher Akzeptanz' },
      { type: 'video', src: '../assets/images/Calmin_Packshot_03.mp4', caption: 'Wohlschmeckend und dadurch einfach in der Gabe' },
      { type: 'image', src: '../assets/images/Calmin_Packshot_04.png', alt: 'Packshot' },
    ],
    shortDesc: 'Für Entspannung und innere Balance.',
    desc: 'Unterstützt die natürliche Ausgeglichenheit von Hunden und Katzen. Schonend gewonnen, tierärztlich entwickelt und geprüft.',
    ingredients: 'Passionsblumenextrakt, Baldrian, L-Tryptophan, Vitamin B1. Ohne künstliche Zusatzstoffe.',
    sizes: [
      { label: '60 Stück', price: 39.90 },
      { label: '90 Stück', price: 54.90 },
    ] },

  // Hepax forte — Produktfamilie (Daten aus Tierarzt-Empfehlung).
  // Kondition (A/B) gilt für die Familie; jede Darreichungsform sammelt eigenständig Naturalrabatt.
  // PDP-Felder (media, usps, content*) → Styleguide E.2 Produktfamilie.
  { id: 13, isFamily: true, title: 'Hepax forte', cat: 'leber', catLabel: 'Leber',
    rating: '4,6', ratingCount: 312, past6Months: 57, past18Months: 120, pricingModel: 'A',
    image: '../assets/images/Hepax_Packshot_01.jpeg',
    media: [
      { type: 'image', src: '../assets/images/Hepax_Packshot_01.jpeg', alt: 'Packshot' },
      { type: 'video', src: '../assets/images/Hepax_Packshot_02.mp4', caption: 'Das Pulver lässt sich einfach dosieren und unter das Futter mischen' },
      { type: 'video', src: '../assets/images/Hepax_Packshot_03.mp4', caption: 'Teilbare Tabletten mit hoher Akzeptanz' },
      { type: 'image', src: '../assets/images/Hepax_Packshot_04.png', alt: 'Packshot', caption: '„Hepax forte hilft meinen Patienten nach der OP. Schnelle Lieferung, unkompliziert.“', author: 'Klaus W. · Tierärztin, Frankfurt' },
    ],
    /* Rechtliche Futtermittel-Kategorie — feste Choice-Liste (Shopify Metafield) */
    feedCategory: 'Diät-Ergänzungsfuttermittel / Ergänzungsfuttermittel',
    shortDesc: 'Unterstützt die Leberfunktion bei Hund und Katze. Mit hochwertigen pflanzlichen Wirkstoffen zur täglichen Anwendung.',
    desc: 'Hepax forte enthält eine Kombination aus hepatoprotektiven Pflanzenstoffen zur Unterstützung und Regeneration der Leberfunktion.',
    // PDP-Akkordeon: 4 thematische Gruppen (E.2) — Felder = Deklarations-/Produktinfos.
    application: 'Täglich über das Futter geben. Dosierung nach Körpergewicht gemäß Fütterungsempfehlung. Bei Umstellung oder Unsicherheit die behandelnde Tierarztpraxis ansprechen.',
    ingredientsExcerpt: 'Mariendistel-Extrakt (Silymarin), Artischockenextrakt, Taurin, Zink. Frei von Getreide und Soja.',
    composition: 'Pflanzliche Nebenerzeugnisse, Hefe, Öle und Fette, Mineralstoffe.',
    analyticalConstituents: [
      { label: 'Rohprotein', value: '18,0 %' },
      { label: 'Rohfett', value: '6,5 %' },
      { label: 'Rohfaser', value: '4,0 %' },
      { label: 'Rohasche', value: '8,0 %' },
    ],
    sensoryAdditives: [
      { label: 'Mariendistel-Extrakt (Silymarin)', value: '50.000 mg' },
      { label: 'Artischockenextrakt', value: '20.000 mg' },
    ],
    nutritionalAdditives: [
      { label: 'Taurin', value: '10.000 mg' },
      { label: 'Zink (als Zinkchelat)', value: '1.200 mg' },
    ],
    feedingRecommendation: 'Hund: 1 Tablette je 10 kg Körpergewicht täglich. Katze: ½–1 Tablette täglich bzw. Pulver gemäß Packungsangabe unter das Futter mischen.',
    notes: 'Nur zur Ergänzung der täglichen Ration. Außerhalb der Reichweite von Kindern aufbewahren. Vor direkter Sonneneinstrahlung schützen.',
    shelfLife: 'Mindesthaltbarkeit siehe Aufdruck auf der Packung. Nach Anbruch trocken und gut verschlossen lagern.',
    usps: [
      'Unterstützt die normale Leberfunktion.',
      'Lange Reichweite dank hoher Dosierung.',
      'Pulver allergikergeeignet.',
    ],
    /* PDP-FAQ → produktiv: Metafield list / Metaobject; JSON-LD FAQPage mitrendern */
    faq: [
      {
        q: 'Für welche Tiere ist Hepax forte geeignet?',
        a: 'Hepax forte ist für Hund und Katze vorgesehen. Die passende Darreichungsform und Dosierung richten sich nach Tierart und Körpergewicht — Angaben finden Sie in der Fütterungsempfehlung bzw. auf der Packung.',
      },
      {
        q: 'Worin unterscheiden sich Hepax forte Tabletten und Pulver?',
        a: 'Beide Formen gehören zur Produktfamilie Hepax forte. Tabletten eignen sich für Hunde; das Pulver (auch für Allergiker geeignet) für Katze und Hund und lässt sich einfach unter das Futter mischen. Inhaltsstoffe können je nach Produkttyp abweichen — bitte die jeweilige Packungsbeilage beachten.',
      },
      {
        q: 'Wie wird Hepax forte dosiert?',
        a: 'Orientierung: Hund 1 Tablette je 10&nbsp;kg Körpergewicht täglich; Katze ½–1 Tablette täglich bzw. Pulver gemäß Packungsangabe unter das Futter mischen. Bei Unsicherheit die behandelnde Tierarztpraxis ansprechen.',
      },
      {
        q: 'Wie bestelle ich Hepax forte als Tierarztpraxis?',
        a: 'Inuvet-Produkte sind ausschließlich über die Tierarztpraxis erhältlich. Als Praxis bestellen Sie im Partner-Shop — Lieferung in der Regel innerhalb von 2–3 Werktagen, Versandkostenfrei ab 49&nbsp;€.',
      },
      {
        q: 'Enthält Hepax forte Getreide oder Soja?',
        a: 'Nein. Hepax forte ist frei von Getreide und Soja. Die genaue Deklaration entnehmen Sie bitte den Angaben zu Zusammensetzung und Zusatzstoffen auf der Produktseite bzw. Packung.',
      },
      {
        q: 'Wie lagere ich Hepax forte nach dem Öffnen?',
        a: 'Mindesthaltbarkeit siehe Aufdruck auf der Packung. Nach Anbruch trocken, verschlossen und vor direkter Sonneneinstrahlung geschützt lagern. Außerhalb der Reichweite von Kindern aufbewahren.',
      },
    ],
    contentHalter: 'Die Leber Ihres Tieres leistet täglich Schwerstarbeit — Medikamente, Futterumstellungen oder das Alter können sie zusätzlich belasten. Hepax forte unterstützt Leber und Stoffwechsel mit pflanzlichen Wirkstoffen. Tabletten oder Pulver geben Sie einfach täglich über das Futter.',
    contentPraxis: 'Hepax forte kombiniert hepatoprotektive Phytostoffe (u.&nbsp;a. Silymarin aus der Mariendistel und Artischockenextrakt) zur Unterstützung der Hepatozyten-Regeneration und des Gallenflusses. Indiziert zur adjuvanten Anwendung bei eingeschränkter Leberfunktion; Dosierung nach Körpergewicht, Angaben zu Wirkstoffgehalt und Studienlage auf Anfrage.',
    ingredients: 'Mariendistel-Extrakt (Silymarin), Artischockenextrakt, Taurin, Zink. Frei von Getreide und Soja.',
    // Schlüssel-Inhaltsstoffe → produktiv: Metaobject-Referenzen (custom.key_ingredients)
    // latin ist Pflicht (kursiv hinter dem Namen).
    keyIngredients: [
      {
        name: 'Mariendistel', latin: 'Silymarin',
        image: '../assets/images/Inhaltsstoff_Mariendistel.jpg',
        summary: [
          'Silymarin schützt die Leberzellen und unterstützt ihre Regeneration — besonders hilfreich, wenn die Leber durch Medikamente, Alter oder Stoffwechselbelastung beansprucht wird.',
          'In Hepax forte sorgt der standardisierte Extrakt dafür, dass Hund und Katze den Wirkstoff zuverlässig und dosiert aufnehmen.',
        ],
      },
      {
        name: 'Artischocke', latin: 'Cynara scolymus',
        image: '../assets/images/Inhaltsstoff_Artischoke.jpg',
        summary: [
          'Artischockenextrakt regt den Gallenfluss an und unterstützt so die natürliche Entgiftungsarbeit der Leber.',
          'Zusammen mit Mariendistel bildet er das phytotherapeutische Gerüst für die tägliche Leberpflege.',
        ],
      },
      {
        name: 'Taurin', latin: 'Taurinum',
        image: '../assets/images/Hero_Mood_04.jpg',
        summary: [
          'Taurin ist eine Aminosulfonsäure, die den Gallenfluss und die Fettverdauung unterstützt — besonders relevant für Katzen, die Taurin nicht selbst ausreichend synthetisieren.',
          'In der Kombination mit Mariendistel und Artischocke ergänzt es die hepatoprotektive Wirkung sinnvoll.',
        ],
      },
    ],
    variants: [
      /* mediaIdx → Index in product.media (1 = Pulver-Video, 2 = Tabletten-Video) */
      { type: 'Pulver', animals: 'Katze, Hund', note: 'für Allergiker geeignet', mediaIdx: 1,
        sizes: [
          { label: '75 g', price: 39.90, unitPrice: '(0,53 € / g)' },
          { label: '175 g', price: 84.90, unitPrice: '(0,49 € / g)' },
        ] },
      { type: 'Tabletten', animals: 'Hund', mediaIdx: 2,
        sizes: [
          { label: '30 Stück', price: 34.90, unitPrice: '(1,16 € / Stück)' },
          { label: '60 Stück', price: 64.90, unitPrice: '(1,08 € / Stück)' },
        ] },
    ],
    selectedVariantIdx: 0, selectedSizeIdx: 0 },

  // Cortisan / Dermin / Diabex — Packshots + Preise aus inuvet.com (Dev-Seed August 2026).
  { id: 14, isFamily: false, title: 'Cortisan Öl-Komplex', cat: 'gelenke', catLabel: 'Gelenke',
    form: 'Flüssig',
    animals: 'Hund, Pferd',
    rating: '4,7', past6Months: 0, past18Months: 0, pricingModel: 'A', selectedSizeIdx: 0,
    image: '../assets/images/Cortisan_Packshot_01.jpg',
    feedCategory: 'Ergänzungsfuttermittel für Hunde und Pferde',
    shortDesc: 'Wenn Cortison, dann Cortisan — hohe Bioverfügbarkeit durch Solubilisierung.',
    desc: 'Weihrauch und Kurkuma in solubilisierter Form zur Unterstützung des Entzündungsstoffwechsels. Mit Algenöl als Omega-3-Quelle.',
    usps: [
      'Wenn Cortison, dann Cortisan.',
      'Hohe Bioverfügbarkeit durch Solubilisierung.',
      'Für die Langzeitgabe geeignet.',
    ],
    sizes: [
      { label: '30 ml Öl-Komplex', price: 17.80 },
      { label: '100 ml Öl-Komplex', price: 41.35 },
      { label: '300 ml Öl-Komplex', price: 63.45 },
    ] },

  { id: 15, isFamily: false, title: 'Dermin Pflege-Emulsion', cat: 'haut', catLabel: 'Haut & Fell',
    form: 'Flüssig',
    animals: 'Katze, Hund',
    rating: '4,5', past6Months: 0, past18Months: 0, pricingModel: 'A', selectedSizeIdx: 0,
    image: '../assets/images/Dermin_Packshot_01.jpg',
    feedCategory: 'Pflege-Emulsion für Tiere',
    shortDesc: 'Beruhigt juckende und gereizte Haut — mit CBD, Aloe Vera, Ceramiden und PEA.',
    desc: 'Mikroemulsion zur Pflege trockener und beanspruchter Haut. Unterstützt Hautbarriere und Lipidschicht, zieht schnell ein.',
    usps: [
      'Beruhigt juckende und gereizte Haut.',
      'Mit 2,5% CBD, Aloe Vera, Ceramiden und PEA.',
      'Zieht schnell ein.',
    ],
    sizes: [
      { label: '10 ml', price: 14.15 },
    ] },

  { id: 16, isFamily: true, title: 'Diabex', cat: 'bauchspeichel', catLabel: 'Bauchspeicheldrüse',
    past6Months: 0, past18Months: 0, pricingModel: 'A',
    image: '../assets/images/Diabex_Packshot_01.jpg',
    feedCategory: 'Ergänzungsfuttermittel für Katzen und Hunde',
    shortDesc: 'Unterstützung bei der Regulierung des Blutzuckerspiegels.',
    desc: 'Ergänzungsfuttermittel zur Unterstützung der Blutzuckerregulation und der normalen Funktion der Bauchspeicheldrüse.',
    usps: [
      'Unterstützung bei der Regulierung des Blutzuckerspiegels.',
      'Kann für einen langsameren Anstieg des Blutzuckerspiegels nach der Nahrungsaufnahme sorgen.',
      'Unterstützung der normalen Funktion der Bauchspeicheldrüse.',
    ],
    variants: [
      { type: 'Tabletten', animals: 'Katze, Hund', sizes: [{ label: '60 Stück', price: 23.05 }, { label: '220 Stück', price: 50.55 }] },
      { type: 'Pulver', animals: 'Katze, Hund', sizes: [{ label: '60 g', price: 20.95 }, { label: '210 g', price: 42.30 }] },
    ],
    selectedVariantIdx: 0, selectedSizeIdx: 0 },

  { id: 8, isFamily: true, title: 'Struvex', past6Months: 0, past18Months: 0, pricingModel: 'A',
    image: '../assets/images/Calmin_Packshot_01.jpeg',
    desc: 'Unterstützt die Harngesundheit der Katze und hilft, Struvitsteinen vorzubeugen.',
    variants: [
      { type: 'Pulver',    animals: 'Katze', sizes: [{ label: '60 g',      price:  28.50 }, { label: '250 g',     price:  94.90 }] },
      { type: 'Tabletten', animals: 'Katze', sizes: [{ label: '40 Stück',  price:  26.90 }, { label: '120 Stück', price:  69.90 }] },
    ],
    selectedVariantIdx: 0, selectedSizeIdx: 0 },
];

const productById = (id) => allProducts.find(p => p.id === id);

// Einträge fürs Parameter-Modal: je Produktfamilie oder Einzelprodukt genau eine Zeile.
// Multi-Form-Familien (isFamily) → Familienname; reine Einzelprodukte → Produktname inkl. Form.
const pricingConfigEntries = () => allProducts;

// ── Preis-Helfer ────────────────────────────────────────────────────────
// getActivePrice: liest die aktuell gewählte Variante/Größe vom Produktobjekt
// (vom Bundle-Konfigurator genutzt). priceFor: expliziter Zugriff über Indizes
// (vom Warenkorb genutzt, ohne das Produktobjekt zu mutieren).
const getActivePrice = (p) => {
  if (p.isFamily) return p.variants[p.selectedVariantIdx].sizes[p.selectedSizeIdx].price;
  if (p.sizes)    return p.sizes[p.selectedSizeIdx || 0].price;
  return p.price;
};

const priceFor = (p, formIdx, sizeIdx) => {
  if (p.isFamily) return p.variants[formIdx].sizes[sizeIdx].price;
  if (p.sizes)    return p.sizes[sizeIdx].price;
  return p.price;
};

// Einstiegspreis für Kacheln / Collection: günstigste Größe (Familien: über alle Formen).
const productStartPrice = (p) => {
  if (p.isFamily && p.variants?.length) {
    return Math.min(...p.variants.flatMap(v => (v.sizes || []).map(s => s.price)));
  }
  if (p.sizes?.length) return Math.min(...p.sizes.map(s => s.price));
  return p.price || 0;
};

// PAngV-Grundpreis der Einstiegsgröße — nur wenn am Size hinterlegt.
const productStartUnit = (p) => {
  let sizes = [];
  if (p.isFamily && p.variants?.length) sizes = p.variants.flatMap(v => v.sizes || []);
  else if (p.sizes?.length) sizes = p.sizes;
  if (!sizes.length) return '';
  const start = productStartPrice(p);
  return sizes.find(s => s.price === start)?.unitPrice || '';
};

const fmt = (v) => v.toFixed(2).replace('.', ',') + ' €';

// ── Naturalrabatt-Kern (preis / menge / modell) ─────────────────────────
const lookupCreditA = (orderValue) => {
  let credit = 0;
  for (const tier of TABLE_A) {
    if (orderValue >= tier.threshold) credit = tier.credit;
    else break;
  }
  return credit;
};

const lookupFreeB = (quantity) => {
  const tier = [...TABLE_B].reverse().find(t => quantity >= t.minQty);
  if (!tier) return 0;
  return customerType === 'group' ? tier.group : tier.standard;
};

// Anzahl Gratis-Stück für beliebige Kombination aus Preis, Menge und Modell.
const freeCountFor = (price, qty, model = 'A') => {
  if (model === 'B') return lookupFreeB(qty);
  return Math.floor(lookupCreditA(qty * price) / price);
};

// Nächste Stufe, die TATSÄCHLICH mehr Gratis-Stück bringt (Plateaus übersprungen).
// Kondition A: liefert zusätzlich targetValue/currentValue (Bestellwert in €).
const nextHintFor = (price, qty, model = 'A') => {
  const currentFree = freeCountFor(price, qty, model);
  if (model === 'A') {
    const currentValue = qty * price;
    for (const tier of TABLE_A) {
      if (tier.threshold <= currentValue) continue;
      const neededQty = Math.ceil(tier.threshold / price);
      const newFree   = Math.floor(tier.credit / price);
      if (newFree > currentFree) {
        return {
          moreQty: neededQty - qty,
          moreFree: newFree - currentFree,
          targetValue: tier.threshold,
          currentValue,
        };
      }
    }
    return null;
  }
  for (const tier of TABLE_B) {
    if (tier.minQty <= qty) continue;
    const newFree = customerType === 'group' ? tier.group : tier.standard;
    if (newFree > currentFree) {
      return { moreQty: tier.minQty - qty, moreFree: newFree - currentFree, targetQty: tier.minQty };
    }
  }
  return null;
};

// Produkt-Wrapper (vom Bundle-Konfigurator genutzt — Signatur unverändert).
// Berechnung pro Einzelprodukt-Position (Darreichungsform + Größe), nicht über Familien summiert.
const calcFree = (p) => freeCountFor(getActivePrice(p), p.quantity, p.pricingModel || 'A');
const getHint  = (p) => nextHintFor(getActivePrice(p), p.quantity, p.pricingModel || 'A');

const formatHint = (hint, model = 'A') => {
  if (!hint) return null;
  const part = hint.moreFree === 1
    ? '1 weiteres Gratisprodukt'
    : `${hint.moreFree} weitere Gratisprodukte`;
  return `${hint.moreQty} Stück hinzufügen für ${part}`;
};

// ── Globaler Warenkorb (localStorage) ───────────────────────────────────
// Zeile: { id, formIdx, sizeIdx, qty }. Bei Einzelprodukten sind die Indizes 0.
const CART_KEY = 'inuvet:cart';

const getCart  = () => { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; } };
const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));
const lineKey  = (id, formIdx, sizeIdx) => `${id}-${formIdx}-${sizeIdx}`;
const cartCount     = () => getCart().reduce((s, l) => s + l.qty, 0);
const cartLineCount = () => getCart().filter(l => productById(l.id)).length;

function addToCart(id, formIdx = 0, sizeIdx = 0, qty = 1) {
  const cart = getCart();
  const key  = lineKey(id, formIdx, sizeIdx);
  const ex   = cart.find(l => lineKey(l.id, l.formIdx, l.sizeIdx) === key);
  if (ex) ex.qty += qty;
  else cart.push({ id, formIdx, sizeIdx, qty });
  saveCart(cart);
  updateCartBadge();
  return cart;
}

function setCartLineQty(key, qty) {
  const cart = getCart();
  const line = cart.find(l => lineKey(l.id, l.formIdx, l.sizeIdx) === key);
  if (line) { line.qty = Math.max(1, qty); saveCart(cart); }
  updateCartBadge();
}

function removeCartLine(key) {
  const cart = getCart().filter(l => lineKey(l.id, l.formIdx, l.sizeIdx) !== key);
  saveCart(cart);
  updateCartBadge();
}

// Zeile → abgeleitete Anzeige- & Rechenwerte (Name, Preis, Gratis, Hint).
function cartLineView(line) {
  const p       = productById(line.id);
  const price   = priceFor(p, line.formIdx, line.sizeIdx);
  const model   = p.pricingModel || 'A';
  const variant = p.isFamily ? p.variants[line.formIdx] : null;
  return {
    p, price, model,
    key:       lineKey(line.id, line.formIdx, line.sizeIdx),
    name:      p.isFamily ? `${p.title} ${variant.type}` : p.title,
    sizeLabel: variant ? variant.sizes[line.sizeIdx].label : (p.sizes ? p.sizes[line.sizeIdx].label : ''),
    image:     p.image || null,
    qty:       line.qty,
    free:      freeCountFor(price, line.qty, model),
    hint:      nextHintFor(price, line.qty, model),
  };
}

// ── Geteilte UI: Cart-Badge ─────────────────────────────────────────────
function updateCartBadge() {
  const el = document.getElementById('cartCount');
  if (!el) return;
  const n = cartCount();
  el.textContent = n;
  el.style.display = n > 0 ? '' : 'none';
}

// ── Geteilte UI: Warenkorb-Drawer ───────────────────────────────────────
window.openCart = () => {
  renderCartDrawer();
  document.getElementById('cartOverlay')?.classList.add('--open');
  document.getElementById('cartDrawer')?.classList.add('--open');
};
window.closeCart = () => {
  document.getElementById('cartOverlay')?.classList.remove('--open');
  document.getElementById('cartDrawer')?.classList.remove('--open');
};

// ── Geteilte UI: Options-Drawer (Familie = Form+Größe, Einzel = nur Größe) ──
const optionsState = { productId: null, formIdx: 0, sizeIdx: 0 };

window.openOptions = (id) => {
  const p = productById(id);
  if (!p) return;
  // Einzelprodukt ohne Größenwahl → direkt in den Warenkorb
  if (!p.isFamily && !(p.sizes && p.sizes.length)) {
    addToCart(id, 0, 0, 1);
    showToast(`${p.title} in den Warenkorb gelegt`);
    openCart();
    return;
  }
  optionsState.productId = id;
  optionsState.formIdx = 0;
  optionsState.sizeIdx = 0;
  renderOptionsDrawer();
  document.getElementById('optionsOverlay')?.classList.add('--open');
  document.getElementById('optionsDrawer')?.classList.add('--open');
};

window.closeOptions = () => {
  document.getElementById('optionsOverlay')?.classList.remove('--open');
  document.getElementById('optionsDrawer')?.classList.remove('--open');
};

window.selectOptionsForm = (index) => {
  optionsState.formIdx = index;
  optionsState.sizeIdx = 0;
  renderOptionsDrawer();
};

window.selectOptionsSize = (index) => {
  optionsState.sizeIdx = index;
  const p = productById(optionsState.productId);
  const priceEl = document.getElementById('optionsPrice');
  if (p && priceEl) priceEl.textContent = fmt(priceFor(p, optionsState.formIdx, index));
  document.querySelectorAll('#optionsSizeVariants .choice-box').forEach((btn, i) => {
    btn.classList.toggle('--active', i === index);
  });
};

window.optionsQtyChange = (delta) => {
  const input = document.getElementById('optionsQty');
  if (!input) return;
  const next = Math.max(1, Math.min(99, (parseInt(input.value, 10) || 1) + delta));
  input.value = next;
};

window.confirmOptions = () => {
  const p = productById(optionsState.productId);
  if (!p) return;
  const qty = Math.max(1, parseInt(document.getElementById('optionsQty')?.value || '1', 10));
  addToCart(p.id, optionsState.formIdx, optionsState.sizeIdx, qty);
  closeOptions();
  showToast(`${p.title} in den Warenkorb gelegt`);
  openCart();
};

function renderOptionsDrawer() {
  const drawer = document.getElementById('optionsDrawer');
  const p = productById(optionsState.productId);
  if (!drawer || !p) return;

  const sizes = p.isFamily
    ? p.variants[optionsState.formIdx].sizes
    : p.sizes;
  const price = priceFor(p, optionsState.formIdx, optionsState.sizeIdx);
  const thumb = p.image
    ? `<div class="product-thumb"><img src="${p.image}" alt="${p.title}"></div>`
    : `<div class="product-thumb placeholder-bg"></div>`;

  let formSection = '';
  if (p.isFamily) {
    const formBtns = p.variants.map((v, i) =>
      `<button class="choice-box${i === optionsState.formIdx ? ' --active' : ''}" type="button"
        onclick="selectOptionsForm(${i})">${v.type}</button>`
    ).join('');
    formSection = `
      <div class="options-drawer__section">
        <div class="label-caps options-drawer__section-label">Darreichungsform</div>
        <div class="options-variants">${formBtns}</div>
      </div>`;
  }

  const sizeBtns = sizes.map((s, i) =>
    `<button class="choice-box --sm${i === optionsState.sizeIdx ? ' --active' : ''}" type="button"
      onclick="selectOptionsSize(${i})">${s.label}</button>`
  ).join('');

  drawer.innerHTML = `
    <div class="options-drawer__header">
      <span class="options-drawer__title">Optionen wählen</span>
      <button type="button" class="btn --icon" onclick="closeOptions()" aria-label="Schließen">
        <span class="material-icons">close</span>
      </button>
    </div>
    <div class="options-drawer__items">
      <div class="cart-item options-drawer__product">
        ${thumb}
        <div class="cart-item__info">
          <div class="cart-item__top">
            <div>
              <p class="cart-item__name">${p.title}</p>
              ${p.isFamily ? '<p class="cart-item__variant">Produktfamilie</p>' : ''}
            </div>
          </div>
        </div>
      </div>
      ${formSection}
      <div class="options-drawer__section">
        <div class="label-caps options-drawer__section-label">Größe</div>
        <div class="options-variants" id="optionsSizeVariants">${sizeBtns}</div>
      </div>
      <div class="options-drawer__section">
        <div class="label-caps options-drawer__section-label">Menge</div>
        <div class="qty-selector --sm">
          <button class="qty-selector__btn" type="button" aria-label="Weniger" onclick="optionsQtyChange(-1)">
            <span class="material-icons">remove</span>
          </button>
          <input class="qty-selector__input" type="number" value="1" min="1" max="99" id="optionsQty">
          <button class="qty-selector__btn" type="button" aria-label="Mehr" onclick="optionsQtyChange(1)">
            <span class="material-icons">add</span>
          </button>
        </div>
      </div>
    </div>
    <div class="options-drawer__footer">
      <div class="options-drawer__price"><span>Preis</span><span id="optionsPrice">${fmt(price)}</span></div>
      <button class="btn --primary" type="button" style="width:100%;text-align:center" onclick="confirmOptions()">In den Warenkorb</button>
      <div class="cart-drawer__continue-wrap">
        <button class="btn --ghost cart-drawer__continue" type="button" onclick="closeOptions()">Zurück</button>
      </div>
    </div>`;
}

// Warenkorb-Zeile: Gratis-Badge auf dem Thumb · Mengen-Selector · Tier-Hint.
function renderCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  const cart = getCart().filter(l => productById(l.id));  // veraltete Einträge ignorieren

  if (cart.length === 0) {
    drawer.innerHTML = `
      <div class="cart-drawer__header">
        <span class="cart-drawer__title">Warenkorb <span class="cart-drawer__count">(${cartLineCount()})</span></span>
        <button type="button" class="btn --icon" onclick="closeCart()" aria-label="Schließen"><span class="material-icons">close</span></button>
      </div>
      <div class="cart-drawer__empty">
        <p class="text-muted">Dein Warenkorb ist noch leer.</p>
      </div>`;
    return;
  }

  const views        = cart.map(cartLineView);
  const subtotal     = views.reduce((s, v) => s + v.price * v.qty, 0);
  const totalFree    = views.reduce((s, v) => s + v.free, 0);
  const totalSavings = views.reduce((s, v) => s + v.free * v.price, 0);

  const itemsHTML = views.map(v => {
    const thumb = v.image ? `<img src="${v.image}" alt="${v.name}">` : '';
    const hint  = formatHint(v.hint, v.model);
    const freeBadge = v.free > 0
      ? `<div class="floating-meta"><span class="badge --free">+ ${v.free}</span></div>`
      : '';
    return `
      <div class="cart-item bundle-item">
        <div class="product-thumb-wrap">
          <div class="product-thumb placeholder-bg">${thumb}</div>
          ${freeBadge}
        </div>
        <div class="cart-item__info">
          <div class="cart-item__top">
            <div>
              <p class="cart-item__name">${v.name}</p>
              <div class="cart-item__variant">${v.sizeLabel ? v.sizeLabel + ' · ' : ''}${fmt(v.price)} / Stk.</div>
            </div>
            <button type="button" class="btn --icon cart-item__remove" onclick="cartRemove('${v.key}')" aria-label="Entfernen">
              <span class="material-icons">close</span>
            </button>
          </div>
          <div class="cart-item__bottom">
            <div class="qty-selector --sm">
              <button type="button" class="qty-selector__btn" onclick="cartChangeQty('${v.key}', -1)"><span class="material-icons">remove</span></button>
              <input class="qty-selector__input" type="number" value="${v.qty}" min="1" onchange="cartSetQty('${v.key}', parseInt(this.value)||1)">
              <button type="button" class="qty-selector__btn" onclick="cartChangeQty('${v.key}', 1)"><span class="material-icons">add</span></button>
            </div>
            <span class="cart-item__qty-text">${fmt(v.price * v.qty)}</span>
          </div>
        </div>
        ${hint ? `<span class="cart-item__tier-hint" aria-hidden="true">${hint}</span>` : ''}
      </div>`;
  }).join('');

  drawer.innerHTML = `
    <div class="cart-drawer__header">
      <span class="cart-drawer__title">Warenkorb <span class="cart-drawer__count">(${cartLineCount()})</span></span>
      <button type="button" class="btn --icon" onclick="closeCart()" aria-label="Schließen"><span class="material-icons">close</span></button>
    </div>
    <div class="cart-drawer__items">${itemsHTML}</div>
    <div class="cart-drawer__footer">
      ${totalFree > 0 ? `
      <div class="cart-drawer__amounts">
        <div class="cart-drawer__free-row">
          <span>Gratisprodukte (${totalFree}×)</span>
          <span class="cart-drawer__free-value">Kostenlos</span>
        </div>
        <div class="cart-drawer__savings-row">
          <span>Du sparst</span>
          <span class="cart-drawer__savings-value">+ ${fmt(totalSavings)}</span>
        </div>
      </div>` : ''}
      <div class="summary-total">
        <span>Zwischensumme</span>
        <span>${fmt(subtotal)}</span>
      </div>
      <div class="cart-drawer__tax">inkl. MwSt., zzgl. Versandkosten</div>
      <button class="btn --primary cart-drawer__checkout" onclick="alert('Weiter zur Kasse …')">Zur Kasse</button>
      <div class="cart-drawer__continue-wrap">
        <button class="btn --ghost cart-drawer__continue" onclick="closeCart()">Weiter einkaufen</button>
      </div>
    </div>`;
}

// Cart-Zeilen-Interaktionen (Drawer neu rendern + Badge aktualisieren).
window.cartChangeQty = (key, delta) => {
  const line = getCart().find(l => lineKey(l.id, l.formIdx, l.sizeIdx) === key);
  if (!line) return;
  setCartLineQty(key, line.qty + delta);
  renderCartDrawer();
};
window.cartSetQty = (key, val) => { setCartLineQty(key, val); renderCartDrawer(); };
window.cartRemove = (key) => { removeCartLine(key); renderCartDrawer(); };

// ── Geteilte UI: Suche ──────────────────────────────────────────────────
window.openSearch  = () => document.getElementById('searchOverlay')?.classList.add('--open');
window.closeSearch = () => document.getElementById('searchOverlay')?.classList.remove('--open');
window.handleSearchOverlayClick = (e) => {
  if (e.target === document.getElementById('searchOverlay')) closeSearch();
};

// ── Geteilte UI: Collection-Filter-Drawer (E.3) ─────────────────────────
window.openFilter = () => {
  document.getElementById('filterSidebar')?.classList.add('--open');
  document.getElementById('filterOverlay')?.classList.add('--open');
  document.body.style.overflow = 'hidden';
};
window.closeFilter = () => {
  document.getElementById('filterSidebar')?.classList.remove('--open');
  document.getElementById('filterOverlay')?.classList.remove('--open');
  document.body.style.overflow = '';
};

/* ═══════════════════════════════════════════════════════
   GETEILTE UI — Toast & Produkt-Video-Rollover
   [PORTABEL → Theme]
   ═══════════════════════════════════════════════════════ */

// ── Geteilte UI: Toast ──────────────────────────────────────────────────
function showToast(message, variant = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast --${variant}`;
  toast.innerHTML = `<span class="material-icons">check_circle</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('--out');
    setTimeout(() => toast.remove(), 250);
  }, 2600);
}

// PDP-Galerie: Thumb → Hauptbild/Video + Caption (Styleguide E.2 / Theme).
function pdpSwitch(el, src, captionText, authorText) {
  var pdp = el.closest('.pdp');
  if (!pdp) return;
  var main = pdp.querySelector('.pdp__main-image');
  if (!main) return;
  var img = main.querySelector('img');
  var video = main.querySelector('video');
  var isVideo = /\.mp4(\?|$)/i.test(src);

  pdp.querySelectorAll('.pdp__thumbs .pdp__thumb').forEach(function(t) {
    t.classList.remove('--active');
  });
  el.classList.add('--active');

  if (isVideo && video) {
    if (img) img.classList.add('--hidden');
    video.classList.remove('--hidden');
    if (video.getAttribute('src') !== src) video.setAttribute('src', src);
    video.play().catch(function() {});
  } else if (img) {
    if (video) {
      video.pause();
      video.classList.add('--hidden');
    }
    img.classList.remove('--hidden');
    img.src = src;
  }

  var cap = main.querySelector('.pdp__caption');
  if (!cap) return;
  if (captionText || authorText) {
    cap.innerHTML = (captionText || '')
      + (authorText ? '<span class="pdp__caption-author">' + authorText + '</span>' : '');
    cap.classList.remove('--hidden');
  } else {
    cap.classList.add('--hidden');
  }
}

// Produkt-Rollover: Video bei Hover abspielen (2. Medium in .tile__image / .product-thumb).
function initProductMediaRollover() {
  document.querySelectorAll('.tile__image, .product-thumb').forEach(function(wrap) {
    var video = wrap.querySelector(':scope > video');
    if (!video) return;
    wrap.addEventListener('mouseenter', function() {
      video.play().catch(function() {});
    });
    wrap.addEventListener('mouseleave', function() {
      video.pause();
      video.currentTime = 0;
    });
  });
}

document.addEventListener('DOMContentLoaded', initProductMediaRollover);

// Badge beim Laden initialisieren.
document.addEventListener('DOMContentLoaded', updateCartBadge);

/* ═══════════════════════════════════════════════════════
   TIERART-ICONS — PDP, Produktkacheln, TE-Mock
   [PORTABEL → Theme]
   ═══════════════════════════════════════════════════════ */

/** Icon-URL: Theme = flache Assets via body[data-asset-base]; Styleguide = graphics/inuvet-icons/. */
function themeIconUrl(file) {
  var base = (typeof document !== 'undefined' && document.body && document.body.dataset.assetBase)
    ? document.body.dataset.assetBase
    : '';
  if (base) return base + file;
  var root = (/\/pages(\/|$)/.test(location.pathname) ? '../assets/' : 'assets/');
  return root + 'graphics/inuvet-icons/' + file;
}

function animalsIconsHTML(animals, opts) {
  if (!animals) return '';
  opts = opts || {};
  var wrapClass = opts.wrapClass || 'pdp__type-animals';
  var iconClass = opts.iconClass || 'pdp__type-animal-icon';

  var MAP = {
    katze: { file: 'Icon_Tier_Katze.svg', label: 'Katze' },
    hund: { file: 'Icon_Tier_Hund_L.svg', label: 'Hund' },
    'hund s': { file: 'Icon_Tier_Hund_S.svg', label: 'Hund S' },
    'hund m': { file: 'Icon_Tier_Hund_M.svg', label: 'Hund M' },
    'hund l': { file: 'Icon_Tier_Hund_L.svg', label: 'Hund L' },
    pferd: { file: 'Icon_Tier_Pferd.svg', label: 'Pferd' },
    kaninchen: { file: 'Icon_Tier_Kaninchen.svg', label: 'Kaninchen' },
    meerschweinchen: { file: 'Icon_Tier_Meerschweinchen.svg', label: 'Meerschweinchen' },
    hamster: { file: 'Icon_Tier_Hamster.svg', label: 'Hamster' },
    chinchilla: { file: 'Icon_Tier_Chinchilla.svg', label: 'Chinchilla' },
    degu: { file: 'Icon_Tier_Degu.svg', label: 'Degu' },
    maus: { file: 'Icon_Tier_Maus.svg', label: 'Maus' },
    ratte: { file: 'Icon_Tier_Ratte.svg', label: 'Ratte' },
    vogel: { file: 'Icon_Tier_Vogel.svg', label: 'Vogel' },
    huhn: { file: 'Icon_Tier_Huhn.svg', label: 'Huhn' },
    rind: { file: 'Icon_Tier_Rind.svg', label: 'Rind' },
    kalb: { file: 'Icon_Tier_Kalb.svg', label: 'Kalb' },
    schaf: { file: 'Icon_Tier_Schaf.svg', label: 'Schaf' },
    ziege: { file: 'Icon_Tier_Ziege.svg', label: 'Ziege' },
    schwein: { file: 'Icon_Tier_Schwein.svg', label: 'Schwein' },
    kamel: { file: 'Icon_Tier_Kamel.svg', label: 'Kamel' }
  };

  var KLEINTIERE = [
    { file: 'Icon_Tier_Kaninchen.svg', label: 'Kaninchen' },
    { file: 'Icon_Tier_Meerschweinchen.svg', label: 'Meerschweinchen' },
    { file: 'Icon_Tier_Hamster.svg', label: 'Hamster' }
  ];

  var tokens = String(animals)
    .split(/[,;&/]+|\s+und\s+/i)
    .map(function (s) { return s.trim(); })
    .filter(Boolean);

  var icons = [];
  var seen = {};

  tokens.forEach(function (token) {
    var key = token.toLowerCase().replace(/\s+/g, ' ');
    var list;

    if (key === 'kleintiere' || key === 'kleine heimtiere') {
      list = KLEINTIERE;
    } else if (key === 'hund-katze' || key === 'hund & katze' || key === 'hund und katze') {
      list = [MAP.katze, MAP.hund];
    } else {
      var hundSize = key.match(/^hund[\s_-]?([sml])$/i);
      if (hundSize) {
        var size = hundSize[1].toUpperCase();
        list = [{ file: 'Icon_Tier_Hund_' + size + '.svg', label: 'Hund ' + size }];
      } else if (MAP[key]) {
        list = [MAP[key]];
      } else {
        list = null;
      }
    }

    if (!list) return;
    list.forEach(function (icon) {
      if (seen[icon.file]) return;
      seen[icon.file] = true;
      icons.push(icon);
    });
  });

  if (!icons.length) {
    return '<span class="' + wrapClass + '">für ' + animals + '</span>';
  }

  var imgs = icons.map(function (icon) {
    var url = themeIconUrl(icon.file);
    return '<span class="' + iconClass + '" role="img" aria-label="' + icon.label + '"'
      + ' style="-webkit-mask-image:url(\'' + url + '\');mask-image:url(\'' + url + '\')"></span>';
  }).join('');

  return '<span class="' + wrapClass + '">'
    + '<span class="visually-hidden">für </span>'
    + imgs
    + '</span>';
}

function pdpAnimalsHTML(animals) {
  return animalsIconsHTML(animals);
}

function animalsLabelForProduct(p, opts) {
  if (!p) return '';
  opts = opts || {};
  var fallback = opts.defaultLabel !== undefined ? opts.defaultLabel : '';

  function unionFromVariantAnimals(variants, animalsKey) {
    animalsKey = animalsKey || 'animals';
    var seen = {};
    var parts = [];
    variants.forEach(function (v) {
      String(v[animalsKey] || '')
        .split(/[,;&/]+|\s+und\s+/i)
        .map(function (s) { return s.trim(); })
        .filter(Boolean)
        .forEach(function (token) {
          var key = token.toLowerCase().replace(/\s+/g, ' ');
          if (seen[key]) return;
          seen[key] = true;
          parts.push(token);
        });
    });
    return parts.join(', ');
  }

  if (p.darreichungsformen && p.darreichungsformen.length) {
    var teLabel = unionFromVariantAnimals(p.darreichungsformen);
    return teLabel || fallback;
  }

  if (p.isFamily && p.variants && p.variants.length) {
    var famLabel = unionFromVariantAnimals(p.variants);
    return famLabel || fallback;
  }

  // Nur String-Labels (z. B. „Katze, Hund“) — Arrays sind Filter-Gruppen, kein Icon-Input
  if (typeof p.animals === 'string' && p.animals.trim()) return p.animals;
  return fallback;
}

function productTileAnimalsHTML(pOrLabel, opts) {
  var label = typeof pOrLabel === 'string'
    ? pOrLabel
    : (pOrLabel && pOrLabel.animalsLabel) || animalsLabelForProduct(pOrLabel, opts);
  if (!label) return '';
  return animalsIconsHTML(label, { wrapClass: 'tile__animals', iconClass: 'pdp__type-animal-icon' });
}

function productIdFromTile(tile) {
  var link = tile.querySelector('a[href*="id="]');
  if (link) {
    var m = (link.getAttribute('href') || '').match(/[?&]id=(\d+)/i);
    if (m) return parseInt(m[1], 10);
  }

  var onclickEl = tile.querySelector('[onclick*="openOptions"], [onclick*="quickAdd"], [onclick*="activeProduct"]') || tile;
  var oc = onclickEl.getAttribute('onclick') || '';
  var m2 = oc.match(/(?:openOptions|quickAdd)\s*\(\s*(\d+)/)
    || oc.match(/activeProduct=PRODUCTS\.find\(x=>x\.id===\s*(\d+)/);
  if (m2) return parseInt(m2[1], 10);

  if (tile.dataset.productId) return parseInt(tile.dataset.productId, 10);
  return null;
}

function lookupProductForTile(id) {
  if (typeof allProducts !== 'undefined') {
    var p = allProducts.find(function (x) { return x.id === id; });
    if (p) return p;
  }
  if (typeof PRODUCTS !== 'undefined') {
    var tp = PRODUCTS.find(function (x) { return x.id === id; });
    if (tp) return tp;
  }
  return null;
}

function initProductTileAnimals(root) {
  root = root || document;
  root.querySelectorAll('.tile.--product').forEach(function (tile) {
    var priceRow = tile.querySelector('.tile__price');
    if (!priceRow || priceRow.querySelector('.tile__animals')) return;

    var label = tile.dataset.animals;
    if (!label) {
      var id = productIdFromTile(tile);
      if (id != null) {
        var p = lookupProductForTile(id);
        if (p) label = animalsLabelForProduct(p);
      }
    }
    if (!label) return;

    var html = productTileAnimalsHTML(label);
    if (html) priceRow.insertAdjacentHTML('beforeend', html);
  });
}

function pdpFormIconFile(form) {
  var key = String(form || '').toLowerCase();
  if (/tablet/.test(key)) return 'Icon_Form_Tablette_ganz.svg';
  if (/pulver/.test(key)) return 'Icon_Form_Pulver.svg';
  return 'Icon_Form_Pulver.svg';
}

function pdpDailyCostIconHTML(form) {
  var url = themeIconUrl(pdpFormIconFile(form));
  return '<span class="pdp__daily-cost__icon" aria-hidden="true"'
    + ' style="-webkit-mask-image:url(\'' + url + '\');mask-image:url(\'' + url + '\')"></span>';
}

/* ═══════════════════════════════════════════════════════
   HEADER — Scroll-Border, Nav-Logo (Theme-Setting)
   [PORTABEL → Theme]
   ═══════════════════════════════════════════════════════ */

function initNavScrolled() {
  function update() {
    document.body.classList.toggle('--nav-scrolled', window.scrollY > 0);
  }
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/**
 * Nav-Logo — Theme-Setting logo_variant: inuvet | campus
 * Produktion: body[data-nav-logo] via Liquid · Mockup: Bar-Buttons + ?logo=campus
 */
function initNavLogoToggle() {
  var STORAGE_KEY = 'inuvet-nav-logo';
  var hasMockupControls = document.querySelector('[data-nav-logo-btn]');
  var hasNavLogo = document.querySelector('.nav-logo');
  if (!hasNavLogo && !hasMockupControls) return;

  function readPreferred() {
    if (hasMockupControls) {
      var params = new URLSearchParams(location.search);
      var fromUrl = (params.get('logo') || '').toLowerCase();
      if (fromUrl === 'campus' || fromUrl === 'inuvet') return fromUrl;
      try {
        var stored = (sessionStorage.getItem(STORAGE_KEY) || '').toLowerCase();
        if (stored === 'campus' || stored === 'inuvet') return stored;
      } catch (_) { /* private mode */ }
    } else if (document.body.dataset.navLogo) {
      return document.body.dataset.navLogo === 'campus' ? 'campus' : 'inuvet';
    }
    return 'inuvet';
  }

  function apply(logo) {
    var next = logo === 'campus' ? 'campus' : 'inuvet';
    document.body.dataset.navLogo = next;
    if (hasMockupControls) {
      try { sessionStorage.setItem(STORAGE_KEY, next); } catch (_) { /* ignore */ }
      var url = new URL(location.href);
      if (next === 'campus') url.searchParams.set('logo', 'campus');
      else url.searchParams.delete('logo');
      if (url.href !== location.href) history.replaceState(null, '', url);
    }

    document.querySelectorAll('[data-nav-logo-btn]').forEach(function (btn) {
      btn.classList.toggle('--active', btn.getAttribute('data-nav-logo-btn') === next);
    });

    document.querySelectorAll('.nav-logo').forEach(function (link) {
      var campus = next === 'campus';
      link.setAttribute('aria-label', campus ? 'Zur Startseite · Inuvet Campus' : 'Zur Startseite');
      var imgInuvet = link.querySelector('.nav-logo__img.--inuvet');
      var imgCampus = link.querySelector('.nav-logo__img.--campus');
      if (imgInuvet) imgInuvet.setAttribute('alt', campus ? '' : 'inuvet Logo');
      if (imgCampus) imgCampus.setAttribute('alt', campus ? 'Inuvet Campus Logo' : '');
    });
  }

  if (hasMockupControls) {
    document.querySelectorAll('[data-nav-logo-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        apply(btn.getAttribute('data-nav-logo-btn'));
      });
    });
  }

  apply(readPreferred());
}

/** Länder-/Locale-Umschalter in .nav-right (.nav-item.--end) + Mobile-Menu-Spiegel */
function initNavCountry() {
  var options = document.querySelectorAll('[data-country]');
  if (!options.length) return;

  var COUNTRIES = { de: 'DE', at: 'AT', ch: 'CH' };
  var STORAGE_KEY = 'inuvet-shop-country';

  function applyCountry(code) {
    code = COUNTRIES[code] ? code : 'de';
    var label = document.querySelector('[data-country-label]');
    if (label) label.textContent = COUNTRIES[code];

    document.querySelectorAll('[data-country]').forEach(function (el) {
      var active = el.getAttribute('data-country') === code;
      if (active) {
        el.setAttribute('aria-current', el.classList.contains('--indent') ? 'page' : 'true');
      } else {
        el.removeAttribute('aria-current');
      }
    });

    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch (e) { /* ignore */ }
  }

  var trigger = document.getElementById('countryTrigger');
  var navItem = trigger && trigger.closest('.nav-item');
  if (navItem && trigger) {
    function setExpanded(open) {
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    navItem.addEventListener('mouseenter', function () { setExpanded(true); });
    navItem.addEventListener('mouseleave', function () { setExpanded(false); });
    navItem.addEventListener('focusin', function () { setExpanded(true); });
    navItem.addEventListener('focusout', function () {
      if (!navItem.contains(document.activeElement)) setExpanded(false);
    });
    trigger.addEventListener('click', function (e) { e.preventDefault(); });
  }

  var saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (e) { /* ignore */ }

  applyCountry(saved || 'de');

  options.forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      applyCountry(el.getAttribute('data-country'));
    });
  });
}

/* ═══════════════════════════════════════════════════════
   PDP-GALERIE — Thumbs | Mosaic (effektiver Modus portabel)
   Mockup-Bar-Wiring: initPdpGalleryToggle() [MOCKUP — nicht portieren]
   Theme: Section-Setting gallery + body[data-pdp-gallery] via Liquid
   ═══════════════════════════════════════════════════════ */

var PDP_GALLERY_STORAGE_KEY = 'inuvet-pdp-gallery';
var PDP_GALLERY_MOSAIC_MIN = 1100;

function isPdpGalleryMosaicViewport() {
  return window.innerWidth >= PDP_GALLERY_MOSAIC_MIN;
}

function readPdpGalleryMode() {
  var params = new URLSearchParams(location.search);
  var fromUrl = (params.get('gallery') || '').toLowerCase();
  if (fromUrl === 'mosaic' || fromUrl === 'thumbs') return fromUrl;
  try {
    var stored = (sessionStorage.getItem(PDP_GALLERY_STORAGE_KEY) || '').toLowerCase();
    if (stored === 'mosaic' || stored === 'thumbs') return stored;
  } catch (_) { /* private mode */ }
  return 'thumbs';
}

function getEffectivePdpGalleryMode(pref) {
  var preference = pref === 'mosaic' || pref === 'thumbs' ? pref : readPdpGalleryMode();
  return preference === 'mosaic' && isPdpGalleryMosaicViewport() ? 'mosaic' : 'thumbs';
}

function applyPdpGalleryMode(mode) {
  var preference = mode === 'mosaic' ? 'mosaic' : 'thumbs';
  var effective = getEffectivePdpGalleryMode(preference);
  document.body.dataset.pdpGallery = effective;
  try { sessionStorage.setItem(PDP_GALLERY_STORAGE_KEY, preference); } catch (_) { /* ignore */ }

  var url = new URL(location.href);
  if (preference === 'mosaic') url.searchParams.set('gallery', 'mosaic');
  else url.searchParams.delete('gallery');
  if (url.href !== location.href) history.replaceState(null, '', url);

  document.querySelectorAll('[data-pdp-gallery-btn]').forEach(function (btn) {
    btn.classList.toggle('--active', btn.getAttribute('data-pdp-gallery-btn') === preference);
  });
}

function syncPdpGalleryViewport() {
  var effective = getEffectivePdpGalleryMode();
  var prev = document.body.dataset.pdpGallery || 'thumbs';
  if (effective === prev) return;
  document.body.dataset.pdpGallery = effective;
  if (typeof window.renderPdp === 'function') window.renderPdp({ gallery: true });
}

function setPdpGalleryMode(mode) {
  applyPdpGalleryMode(mode);
  if (typeof window.renderPdp === 'function') window.renderPdp({ gallery: true });
}

/** [MOCKUP — nicht portieren] Mockup-Bar Galerie-Toggle (ehemals Produkt.html, jetzt Live-PDP) */
function initPdpGalleryToggle() {
  if (!document.querySelector('[data-pdp-gallery-btn]')) return;
  applyPdpGalleryMode(readPdpGalleryMode());
  document.querySelectorAll('[data-pdp-gallery-btn]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setPdpGalleryMode(btn.getAttribute('data-pdp-gallery-btn'));
    });
  });
  window.addEventListener('resize', syncPdpGalleryViewport, { passive: true });
}

function initPromotedUI() {
  initNavScrolled();
  initNavLogoToggle();
  initNavCountry();
  initProductTileAnimals();
  initPdpGalleryToggle();
}

document.addEventListener('DOMContentLoaded', initPromotedUI);

/* ═══════════════════════════════════════════════════════
   THEME-EDITOR — Sections re-initialisieren
   [PORTABEL → Theme]
   Der Shopify-Customizer rendert Sections bei jeder Einstellung
   neu (shopify:section:load) — alle DOM-gebundenen Init-Helfer
   müssen danach erneut laufen, sonst sind Marquee, Slider & Co.
   im Editor tot. Im Mockup (kein window.Shopify) ist das ein No-op.
   ═══════════════════════════════════════════════════════ */

function reinitSection() {
  initMarquees();
  initScrollAnimations();
  initLottieAspect();
  initArticleToc();
  initTestimonials();
  initProductMediaRollover();
  initProductTileAnimals();
  updateCartBadge();
}

if (window.Shopify && Shopify.designMode) {
  document.addEventListener('shopify:section:load', reinitSection);
}
