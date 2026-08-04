/* ══════════════════════════════════════════════════════════════
   temp.js — Experimentelle JS-Funktionen (Staging-Bereich)
   Hier landen neue Funktionen im Test.
   Wenn festgehalten → nach inuvet.js oder pages/xyz.js verschieben
   und hier löschen.
   NIEMALS in Produktion einbinden.
   ══════════════════════════════════════════════════════════════ */

/**
 * Tierart-String → Icon-Markup (PDP, Collection-Tiles, …).
 * Mapping → `assets/graphics/inuvet-icons/Icon_Tier_*.svg`
 * Hund ohne Größe → Hund_L · „Kleintiere“ → Kaninchen/Meerschweinchen/Hamster.
 *
 * @param {string} animals  z. B. "Katze, Hund" | "Kleintiere"
 * @param {{ wrapClass?: string, iconClass?: string }} [opts]
 */
function animalsIconsHTML(animals, opts) {
  if (!animals) return '';
  opts = opts || {};
  var wrapClass = opts.wrapClass || 'pdp__type-animals';
  var iconClass = opts.iconClass || 'pdp__type-animal-icon';

  var base = (typeof document !== 'undefined' && document.body && document.body.dataset.assetBase)
    ? document.body.dataset.assetBase
    : (/\/pages(\/|$)/.test(location.pathname) ? '../assets/' : 'assets/');
  var iconDir = base + 'graphics/inuvet-icons/';

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
    var url = iconDir + icon.file;
    return '<span class="' + iconClass + '" role="img" aria-label="' + icon.label + '"'
      + ' style="-webkit-mask-image:url(\'' + url + '\');mask-image:url(\'' + url + '\')"></span>';
  }).join('');

  return '<span class="' + wrapClass + '">'
    + '<span class="visually-hidden">für </span>'
    + imgs
    + '</span>';
}

/** PDP-Wrapper — gleiche Markup-Klassen wie bisher. */
function pdpAnimalsHTML(animals) {
  return animalsIconsHTML(animals);
}

/**
 * Tierart-Label für Produktkacheln — Union über Varianten (Familie) oder Einzelwert.
 * Unterstützt inuvet-Katalog (`isFamily` + `variants[].animals`) und TE-Mock (`darreichungsformen[].animals`).
 *
 * @param {object} p
 * @param {{ defaultLabel?: string }} [opts]
 */
function animalsLabelForProduct(p, opts) {
  if (!p) return '';
  opts = opts || {};
  var fallback = opts.defaultLabel !== undefined ? opts.defaultLabel : 'Katze, Hund';

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

  return p.animals || fallback;
}

/**
 * Tier-Icons für `.tile.--product` — rechts in `.tile__price`.
 * @param {object|string} pOrLabel  Produktobjekt oder fertiger Tierart-String
 */
function productTileAnimalsHTML(pOrLabel, opts) {
  var label = typeof pOrLabel === 'string'
    ? pOrLabel
    : animalsLabelForProduct(pOrLabel, opts);
  if (!label) return '';
  return animalsIconsHTML(label, { wrapClass: 'tile__animals', iconClass: 'pdp__type-animal-icon' });
}

/** Produkt-ID aus statischer Kachel (Link, onclick, data-product-id). */
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

/**
 * Statische `.tile.--product` anreichern — fehlende `.tile__animals` in `.tile__price`.
 * Lookup: `data-animals` → Katalog via Produkt-ID → Default Hund/Katze.
 */
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
    if (!label) label = 'Katze, Hund';

    var html = productTileAnimalsHTML(label);
    if (html) priceRow.insertAdjacentHTML('beforeend', html);
  });
}

/**
 * Darreichungsform → Form-Icon-Dateiname (Tageskosten-Mask).
 * Pulver → Icon_Form_Pulver · Tabletten → Icon_Form_Tablette_ganz
 */
function pdpFormIconFile(form) {
  var key = String(form || '').toLowerCase();
  if (/tablet/.test(key)) return 'Icon_Form_Tablette_ganz.svg';
  if (/pulver/.test(key)) return 'Icon_Form_Pulver.svg';
  return 'Icon_Form_Pulver.svg';
}

/** Asset-Basis wie animalsIconsHTML (pages/ vs. Root). */
function pdpAssetBase() {
  if (typeof document !== 'undefined' && document.body && document.body.dataset.assetBase) {
    return document.body.dataset.assetBase;
  }
  return (/\/pages(\/|$)/.test(location.pathname) ? '../assets/' : 'assets/');
}

/**
 * Mask-Span für `.pdp__daily-cost__icon` anhand der aktuellen Form.
 * @param {string} form  z. B. "Pulver" | "Tabletten" | Produktitel mit Form
 */
function pdpDailyCostIconHTML(form) {
  var url = pdpAssetBase() + 'graphics/inuvet-icons/' + pdpFormIconFile(form);
  return '<span class="pdp__daily-cost__icon" aria-hidden="true"'
    + ' style="-webkit-mask-image:url(\'' + url + '\');mask-image:url(\'' + url + '\')"></span>';
}

/**
 * Nav Scroll-Border — `body.--nav-scrolled` wenn scrollY > 0.
 * CSS: temp.css → border-bottom an `.site-nav` nur im gescrollten Zustand.
 * Staging — bei Freigabe → inuvet.js.
 */
function initNavScrolled() {
  function update() {
    document.body.classList.toggle('--nav-scrolled', window.scrollY > 0);
  }
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/**
 * Nav-Logo Swap — inuvet | Campus (Mockup).
 * URL `?logo=campus` · sonst sessionStorage · Default inuvet.
 * Braucht Markup `.nav-logo` + optional `[data-nav-logo-btn="inuvet|campus"]`.
 */
function initNavLogoToggle() {
  var STORAGE_KEY = 'inuvet-nav-logo';
  var root = document.querySelector('.nav-logo');
  if (!root && !document.querySelector('[data-nav-logo-btn]')) return;

  function readPreferred() {
    var params = new URLSearchParams(location.search);
    var fromUrl = (params.get('logo') || '').toLowerCase();
    if (fromUrl === 'campus' || fromUrl === 'inuvet') return fromUrl;
    try {
      var stored = (sessionStorage.getItem(STORAGE_KEY) || '').toLowerCase();
      if (stored === 'campus' || stored === 'inuvet') return stored;
    } catch (_) { /* private mode */ }
    return 'inuvet';
  }

  function apply(logo) {
    var next = logo === 'campus' ? 'campus' : 'inuvet';
    document.body.dataset.navLogo = next;
    try { sessionStorage.setItem(STORAGE_KEY, next); } catch (_) { /* ignore */ }

    var url = new URL(location.href);
    if (next === 'campus') url.searchParams.set('logo', 'campus');
    else url.searchParams.delete('logo');
    if (url.href !== location.href) history.replaceState(null, '', url);

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

  document.querySelectorAll('[data-nav-logo-btn]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      apply(btn.getAttribute('data-nav-logo-btn'));
    });
  });

  apply(readPreferred());
}

/**
 * PDP-Galerie-Modus — Thumbs (Default) | Mosaic (LIVOM-Style, nur Desktop ≥1100px).
 * URL `?gallery=mosaic` · sonst sessionStorage · Mockup-Bar `[data-pdp-gallery-btn]`.
 * Mobile: immer Thumbs — Präferenz bleibt gespeichert für Desktop-Resize.
 * Braucht `window.renderPdp({ gallery: true })` auf der PDP-Seite.
 */
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

function initTempStaging() {
  initNavScrolled();
  initNavLogoToggle();
  initProductTileAnimals();
  initPdpGalleryToggle();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTempStaging);
} else {
  initTempStaging();
}
