/* ═══════════════════════════════════════════════════════
   inuvet.js — Globale UI-Hilfsfunktionen & Shop-Core
   Auf allen Seiten einbinden (analog zu inuvet.css).
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

/* ═══════════════════════════════════════════════════════
   SHOP CORE — Katalog, Naturalrabatt, Warenkorb, Cart-UI
   Bundle.html & Produkt.html (global, wie inuvet.css)
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
// past6Months / past18Months: Käufe für die Bundle-Vorauswahl.
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
  { id: 13, isFamily: true, title: 'Hepax forte', cat: 'leber', catLabel: 'Leber',
    rating: '4,6', past6Months: 0, past18Months: 0, pricingModel: 'A',
    image: '../assets/images/Hepax_Packshot_01.jpeg',
    shortDesc: 'Unterstützt die Leberfunktion.',
    desc: 'Spezialformel zur Unterstützung der Leberfunktion bei Hunden und Katzen. Mit natürlichen Pflanzenextrakten, tierärztlich entwickelt.',
    ingredients: 'Mariendistel-Extrakt (Silymarin), Artischockenextrakt, Taurin, Zink. Frei von Getreide und Soja.',
    variants: [
      { type: 'Tabletten', animals: 'Hund',                                          sizes: [{ label: '30 Stück', price: 34.90 }, { label: '60 Stück', price: 64.90 }] },
      { type: 'Pulver',    animals: 'Katze, Hund', note: 'für Allergiker geeignet', sizes: [{ label: '75 g', price: 39.90 }, { label: '175 g', price: 84.90 }] },
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
// Jede Darreichungsform wird eigenständig nach der Kondition (A/B) der Familie berechnet.
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

// Warenkorb-Zeile im selben Layout wie das persönliche Angebot:
// Thumb · Name/Variante · Mengen-Selector · Gratis-Badge · Tier-Hint.
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
    return `
      <div class="cart-item bundle-item">
        <div class="product-thumb-wrap">
          <div class="product-thumb placeholder-bg">${thumb}</div>
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
            <div class="cart-item__counter">
              <div class="qty-selector --sm">
                <button type="button" class="qty-selector__btn" onclick="cartChangeQty('${v.key}', -1)"><span class="material-icons">remove</span></button>
                <input class="qty-selector__input" type="number" value="${v.qty}" min="1" onchange="cartSetQty('${v.key}', parseInt(this.value)||1)">
                <button type="button" class="qty-selector__btn" onclick="cartChangeQty('${v.key}', 1)"><span class="material-icons">add</span></button>
              </div>
              ${v.free > 0 ? `<span class="badge --free">+ ${v.free}</span>` : ''}
            </div>
            <span class="cart-item__qty-text">${fmt(v.price * v.qty)}</span>
          </div>
        </div>
        ${hint ? `<span class="bundle-item__tier-hint" aria-hidden="true">${hint}</span>` : ''}
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
      <div class="cart-drawer__free-row">
        <span>Gratisprodukte (${totalFree}×)</span>
        <span class="cart-drawer__free-value">Kostenlos</span>
      </div>
      <div class="cart-drawer__savings-row">
        <span>Dein Vorteil</span>
        <span class="cart-drawer__savings-value">+ ${fmt(totalSavings)}</span>
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

// Badge beim Laden initialisieren.
document.addEventListener('DOMContentLoaded', updateCartBadge);
