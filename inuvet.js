/* ═══════════════════════════════════════════════════════
   inuvet.js — Globale UI-Hilfsfunktionen & Shop-Core
   Auf allen Seiten einbinden (analog zu inuvet.css).

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
   Funktioniert für beide Header-Modi: Standard-Sticky (Wert konstant) und
   Scroll-Away (body.--ann-scroll, Wert hängt von der Scroll-Position ab).
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
  [
    ['.tile-grid', '.tile'],
    ['.ingredient-list', '.ingredient'],
    ['.testimonial-grid', '.testimonial'],
  ].forEach(([groupSel, itemSel]) => {
    document.querySelectorAll(groupSel).forEach(group => {
      group.querySelectorAll(`${itemSel}:not([data-animate])`).forEach((el, i) => {
        el.setAttribute('data-animate', '');
        el.style.setProperty('--anim-delay', Math.min(i, 5) * 70 + 'ms');
        observer.observe(el);
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', initScrollAnimations);

/* ═══════════════════════════════════════════════════════
   PDP STICKY ATC (Mobile)
   [PORTABEL → Theme]
   Aktiv nur mit .pdp--sticky-cta (Shopify: Section-Setting
   sticky_atc Checkbox). Bar .pdp__sticky-cta erscheint, wenn
   der Kaufblock-CTA (.pdp__actions .btn.--primary) den
   Viewport verlässt — Desktop immer aus.
   ═══════════════════════════════════════════════════════ */
let _pdpStickyIo = null;
let _pdpStickyMq = null;
let _pdpStickyMqHandler = null;

function initPdpStickyCta() {
  const page = document.querySelector('.pdp--sticky-cta');
  const bar  = document.querySelector('.pdp__sticky-cta');
  const anchor = document.querySelector('.pdp__actions .btn.--primary');
  if (_pdpStickyIo) { _pdpStickyIo.disconnect(); _pdpStickyIo = null; }
  if (_pdpStickyMq && _pdpStickyMqHandler) {
    _pdpStickyMq.removeEventListener('change', _pdpStickyMqHandler);
    _pdpStickyMqHandler = null;
  }
  if (!page || !bar || !anchor) {
    bar?.classList.remove('--visible');
    bar?.setAttribute('aria-hidden', 'true');
    return;
  }

  const mq = window.matchMedia('(max-width: 899px)');
  _pdpStickyMq = mq;

  const sync = (inView) => {
    const show = mq.matches && !inView;
    bar.classList.toggle('--visible', show);
    bar.setAttribute('aria-hidden', show ? 'false' : 'true');
  };

  _pdpStickyIo = new IntersectionObserver(([e]) => {
    sync(e.isIntersecting);
  }, { threshold: 0, rootMargin: '0px' });
  _pdpStickyIo.observe(anchor);

  _pdpStickyMqHandler = () => {
    if (!mq.matches) sync(true);
    else {
      const rect = anchor.getBoundingClientRect();
      sync(rect.top < window.innerHeight && rect.bottom > 0);
    }
  };
  mq.addEventListener('change', _pdpStickyMqHandler);
  _pdpStickyMqHandler();
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
   Bundle.html & Produkt.html (global, wie inuvet.css)
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

  { id: 2, isFamily: true, title: 'EnteroGast', past6Months: 6, past18Months: 16, pricingModel: 'A',
    image: '../assets/images/Hepax_Packshot_01.jpeg',
    desc: 'Für eine stabile Verdauung und eine ausgeglichene Darmflora bei Magen-Darm-Beschwerden.',
    variants: [
      { type: 'Tabletten', animals: 'Katze, Hund', sizes: [{ label: '6 Stück',    price:  24.90 }, { label: '21 Stück',   price:  69.90 }] },
      { type: 'Pulver',    animals: 'Katze, Hund', sizes: [{ label: '50 g',        price:  22.90 }, { label: '150 g',      price:  59.90 }] },
      { type: 'Pulver',    animals: 'Kleintiere',  sizes: [{ label: '50 g',        price:  19.90 }] },
      { type: 'Sachets',   animals: 'Katze, Hund', sizes: [{ label: '20 Sachets',  price:  26.90 }] },
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
    desc: 'Sanfte Unterstützung der Verdauung bei trägem Darm.' },
  { id:  6, isFamily: false, title: 'Ibedex Pulver',          price: 29.90, past6Months: 0, past18Months: 14, pricingModel: 'A',
    desc: 'Unterstützt Gelenke und Beweglichkeit bei aktiven und älteren Tieren.' },
  // Inzym Pulver — Einzelprodukt mit zwei Größen (Daten aus Tierarzt-Empfehlung).
  { id:  7, isFamily: false, title: 'Inzym Pulver', cat: 'bauchspeichel', catLabel: 'Bauchspeicheldrüse',
    rating: '4,4', past6Months: 0, past18Months: 14, pricingModel: 'A', selectedSizeIdx: 0,
    sizes: [{ label: '50 g', price: 24.90 }, { label: '100 g', price: 44.90 }],
    shortDesc: 'Unterstützt die Bauchspeicheldrüse.',
    desc: 'Hochwertige Enzymformel zur Unterstützung der Verdauung bei Erkrankungen der Bauchspeicheldrüse. Für Hunde und Katzen.',
    ingredients: 'Pankreasenzym-Konzentrat (Lipase, Amylase, Protease), Bromelain. Ohne künstliche Konservierungsstoffe.' },
  { id:  9, isFamily: false, title: 'Otysan Fluid',           price: 24.90, past6Months: 0, past18Months:  6, pricingModel: 'A',
    desc: 'Zur Pflege und Reinigung empfindlicher Ohren.' },
  // FloraComplex — Produktfamilie (Kondition A/B gilt für die Familie).
  { id: 10, isFamily: true, title: 'FloraComplex', past6Months: 0, past18Months: 16, pricingModel: 'A',
    desc: 'Probiotischer Aufbau einer gesunden Darmflora.',
    variants: [
      { type: 'Tabletten', animals: 'Katze, Hund', sizes: [{ label: '60 Stück', price: 32.90 }] },
      { type: 'Pulver',    animals: 'Katze, Hund', sizes: [{ label: '100 g',   price: 27.50 }] },
    ],
    selectedVariantIdx: 0, selectedSizeIdx: 0 },
  // Calmin balance — Produktfamilie (Daten aus Tierarzt-Empfehlung).
  // Kondition (A/B) gilt für die Familie; jede Darreichungsform sammelt eigenständig Naturalrabatt.
  { id: 12, isFamily: true, title: 'Calmin balance', cat: 'beruhigung', catLabel: 'Beruhigung',
    rating: '4,8', past6Months: 0, past18Months: 0, pricingModel: 'A',
    image: '../assets/images/Calmin_Packshot_01.jpeg',
    shortDesc: 'Für Entspannung und innere Balance.',
    desc: 'Unterstützt die natürliche Ausgeglichenheit von Hunden und Katzen. Schonend gewonnen, tierärztlich entwickelt und geprüft.',
    ingredients: 'Passionsblumenextrakt, Baldrian, L-Tryptophan, Vitamin B1. Ohne künstliche Zusatzstoffe.',
    variants: [
      { type: 'Tabletten', animals: 'Hund, Katze',                                  sizes: [{ label: '60 Stück', price: 39.90 }, { label: '90 Stück', price: 54.90 }] },
      { type: 'Pulver',    animals: 'Hund, Katze', note: 'für Allergiker geeignet', sizes: [{ label: '30 g', price: 29.90 }, { label: '60 g', price: 49.90 }] },
    ],
    selectedVariantIdx: 0, selectedSizeIdx: 0 },

  // Hepax forte — Produktfamilie (Daten aus Tierarzt-Empfehlung).
  // Kondition (A/B) gilt für die Familie; jede Darreichungsform sammelt eigenständig Naturalrabatt.
  // PDP-Felder (media, usps, content*) → Styleguide E.2 Produktfamilie.
  { id: 13, isFamily: true, title: 'Hepax forte', cat: 'leber', catLabel: 'Leber',
    rating: '4,6', ratingCount: 312, past6Months: 0, past18Months: 0, pricingModel: 'A',
    image: '../assets/images/Hepax_Packshot_01.jpeg',
    media: [
      { type: 'image', src: '../assets/images/Hepax_Packshot_01.jpeg', alt: 'Packshot' },
      { type: 'video', src: '../assets/images/Inuvet_Einzelprodukt_Hepax_Pulver_1zu1.mp4', caption: 'Das Pulver lässt sich einfach dosieren und unter das Futter mischen' },
      { type: 'video', src: '../assets/images/Inuvet_Einzelprodukt_Hepax_Tabletten_1zu1.mp4', caption: 'Teilbare Tabletten mit hoher Akzeptanz' },
      { type: 'video', src: '../assets/images/Inuvet_Einzelprodukt_Hepax_Tier_01_Hund_1zu1.mp4', caption: 'Wohlschmeckend und einfach in der Gabe' },
      { type: 'image', src: '../assets/images/Hepax_Foto-Test.png', alt: 'Tierhalter mit Hund', caption: '„Hepax forte hilft meinen Patienten nach der OP. Schnelle Lieferung, unkompliziert.“', author: 'Klaus W. · Tierärztin, Frankfurt' },
    ],
    shortDesc: 'Unterstützt die Leberfunktion bei Hund und Katze. Mit hochwertigen pflanzlichen Wirkstoffen zur täglichen Anwendung.',
    desc: 'Hepax forte enthält eine Kombination aus hepatoprotektiven Pflanzenstoffen zur Unterstützung und Regeneration der Leberfunktion.',
    // PDP-Akkordeon: 4 thematische Gruppen (E.2) — Felder = Deklarations-/Produktinfos.
    application: 'Täglich über das Futter geben. Dosierung nach Körpergewicht gemäß Fütterungsempfehlung. Bei Umstellung oder Unsicherheit die behandelnde Tierarztpraxis ansprechen.',
    targetSpecies: 'Hund und Katze',
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
      'Rein pflanzlich, ohne künstliche Zusatzstoffe',
      'Hohe Akzeptanz — auch bei wählerischen Tieren',
      'Von über 20.000 Tierärzten empfohlen',
    ],
    /* PDP-FAQ → produktiv: Metafield list / Metaobject; JSON-LD FAQPage mitrendern */
    faq: [
      {
        q: 'Für welche Tiere ist Hepax forte geeignet?',
        a: 'Hepax forte ist für Hund und Katze vorgesehen. Die passende Darreichungsform und Dosierung richten sich nach Tierart und Körpergewicht — Angaben finden Sie in der Fütterungsempfehlung bzw. auf der Packung.',
      },
      {
        q: 'Worin unterscheiden sich Tabletten und Pulver?',
        a: 'Beide Formen gehören zur Produktfamilie Hepax forte. Tabletten eignen sich für Hunde; das Pulver (auch für Allergiker geeignet) für Katze und Hund und lässt sich einfach unter das Futter mischen. Inhaltsstoffe können je nach Produkttyp abweichen — bitte die jeweilige Packungsbeilage beachten.',
      },
      {
        q: 'Wie wird Hepax forte dosiert?',
        a: 'Orientierung: Hund 1 Tablette je 10&nbsp;kg Körpergewicht täglich; Katze ½–1 Tablette täglich bzw. Pulver gemäß Packungsangabe unter das Futter mischen. Bei Unsicherheit die behandelnde Tierarztpraxis ansprechen.',
      },
      {
        q: 'Wie bestelle ich als Tierarztpraxis?',
        a: 'Inuvet-Produkte sind ausschließlich über die Tierarztpraxis erhältlich. Als Praxis bestellen Sie im Partner-Shop — Lieferung in der Regel innerhalb von 2–3 Werktagen, Versandkostenfrei ab 49&nbsp;€.',
      },
      {
        q: 'Enthält Hepax forte Getreide oder Soja?',
        a: 'Nein. Hepax forte ist frei von Getreide und Soja. Die genaue Deklaration entnehmen Sie bitte den Angaben zu Zusammensetzung und Zusatzstoffen auf der Produktseite bzw. Packung.',
      },
      {
        q: 'Wie lagere ich das Produkt nach dem Öffnen?',
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
  initArticleToc();
  initTestimonials();
  initProductMediaRollover();
  updateCartBadge();
}

if (window.Shopify && Shopify.designMode) {
  document.addEventListener('shopify:section:load', reinitSection);
}
