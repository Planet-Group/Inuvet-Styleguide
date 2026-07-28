/* index.js — Sprachwahl DE/EN für die Mockup-Übersicht */
(function () {
  var STORAGE_KEY = 'inuvet-index-lang';

  var UI = {
    de: {
      docTitle: 'Mockups – inuvet',
      docDesc: 'Übersicht der zentralen HTML-Mockups des inuvet Design Systems.',
      skip: 'Zum Inhalt springen',
      logoAria: 'Zur Übersicht',
      navAria: 'Seiten-Navigation',
      langMenuAria: 'Sprache wählen',
      title: 'Mockups',
      secStyleguide: 'Styleguide',
      cardDesignTitle: 'Design System',
      cardDesignBody: 'Tokens, Atome, Moleküle und Organismen — verbindliche Referenz.',
      ctaStyleguide: 'Zum Styleguide',
      secTe: 'Tierarzt-Empfehlung',
      cardTeTitle: 'Tierarzt-Empfehlung',
      cardTeBody: 'Endkunden-Flow: Empfehlung anfragen und freigegebene Produkte kaufen.',
      cardFreigabeTitle: 'Freigabe ausstellen',
      cardFreigabeBody: 'Vet-Portal: Empfänger wählen, Produkte freigeben, E-Mail-Vorschau.',
      ctaMockup: 'Zum Mockup',
      secShopify: 'Standard Shopify',
      cardShopTitle: 'Startseite',
      cardShopBody: 'Shop-Startseite mit Praxis-Opt-in und weiteren Pop-ups.',
      cardPdpTitle: 'Produktdetailseite',
      cardPdpBody: 'PDP mit Sticky-Galerie, Naturalrabatt und Sticky ATC.',
      cardCollectionTitle: 'Collection',
      cardCollectionBody: 'Produktübersicht mit optionaler Filter-Sidebar und Sonderkacheln.',
      secSections: 'Sections',
      cardBundleTitle: 'Personalisiertes Angebot',
      cardBundleBody: 'Bundle-Builder mit Naturalrabatt-Staffeln und Warenkorb-Logik.',
      secStandalone: 'Stand Alone Pages',
      cardFormTitle: 'Formular für Nebenwirkungen',
      cardFormBody: 'Meldeformular für unerwünschte Wirkungen — Tierarztpraxis.',
      ctaForm: 'Zum Formular'
    },
    en: {
      docTitle: 'Mockups – inuvet',
      docDesc: 'Overview of the main HTML mockups of the inuvet design system.',
      skip: 'Skip to content',
      logoAria: 'Back to overview',
      navAria: 'Site navigation',
      langMenuAria: 'Choose language',
      title: 'Mockups',
      secStyleguide: 'Styleguide',
      cardDesignTitle: 'Design system',
      cardDesignBody: 'Tokens, atoms, molecules and organisms — the binding reference.',
      ctaStyleguide: 'Open styleguide',
      secTe: 'Vet recommendation',
      cardTeTitle: 'Vet recommendation',
      cardTeBody: 'Customer flow: request a recommendation and buy approved products.',
      cardFreigabeTitle: 'Issue approval',
      cardFreigabeBody: 'Vet portal: choose recipient, approve products, email preview.',
      ctaMockup: 'Open mockup',
      secShopify: 'Standard Shopify',
      cardShopTitle: 'Homepage',
      cardShopBody: 'Shop homepage with practice opt-in and other pop-ups.',
      cardPdpTitle: 'Product detail page',
      cardPdpBody: 'PDP with sticky gallery, natural discount and sticky ATC.',
      cardCollectionTitle: 'Collection',
      cardCollectionBody: 'Product listing with optional filter sidebar and featured tiles.',
      secSections: 'Sections',
      cardBundleTitle: 'Personalised offer',
      cardBundleBody: 'Bundle builder with natural-discount tiers and cart logic.',
      secStandalone: 'Stand-alone pages',
      cardFormTitle: 'Adverse reaction form',
      cardFormBody: 'Report form for adverse effects — veterinary practice.',
      ctaForm: 'Open form'
    }
  };

  function applyLang(lang) {
    var ui = UI[lang] || UI.de;
    document.documentElement.lang = lang;
    document.title = ui.docTitle;

    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', ui.docDesc);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (ui[key] != null) el.textContent = ui[key];
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      if (ui[key] != null) el.setAttribute('aria-label', ui[key]);
    });

    var nav = document.querySelector('.site-nav');
    if (nav && ui.navAria) nav.setAttribute('aria-label', ui.navAria);

    var label = document.querySelector('[data-lang-label]');
    if (label) label.textContent = lang === 'en' ? 'EN' : 'DE';

    document.querySelectorAll('[data-lang]').forEach(function (el) {
      var active = el.getAttribute('data-lang') === lang;
      if (active) {
        el.setAttribute('aria-current', 'true');
        el.setAttribute('aria-pressed', 'true');
      } else {
        el.removeAttribute('aria-current');
        el.setAttribute('aria-pressed', 'false');
      }
    });

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) { /* ignore */ }
  }

  function init() {
    var options = document.querySelectorAll('[data-lang]');
    if (!options.length) return;

    var trigger = document.getElementById('langTrigger');
    if (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
      });
    }

    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) { /* ignore */ }

    var initial = (saved === 'en' || saved === 'de') ? saved : 'de';
    applyLang(initial);

    options.forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        applyLang(el.getAttribute('data-lang') === 'en' ? 'en' : 'de');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
