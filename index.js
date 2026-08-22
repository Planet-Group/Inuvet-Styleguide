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
      cardDesignBody: 'Tokens, Atome, Moleküle und Organismen — die verbindliche Referenz für Typografie, Farben, Spacing und alle UI-Bausteine. Hier prüft ihr, welche Klasse schon existiert, bevor etwas Neues gebaut wird; der Guide spiegelt 1:1 die Styles aus planet-brands.css.',
      ctaStyleguide: 'Zum Styleguide',
      secTe: 'Tierarzt-Empfehlung',
      cardTeTitle: 'Tierarzt-Empfehlung',
      cardTeBody: 'Endkunden-Flow im Shop: Tierhalter melden sich an, fragen eine Empfehlung an und kaufen freigegebene Produkte. Enthält Collection, PDP mit Freigabe-Logik, Warenkorb und die Zustände vor/nach Freigabe — Menu B (Home · Alle Produkte · Dokumentation).',
      cardFreigabeTitle: 'Freigabe ausstellen',
      cardFreigabeBody: 'Vet-Portal zum Ausstellen einer Freigabe ohne vorherige Anfrage: Empfänger und Consent, Produkt- und Mengenwahl, E-Mail-Vorschau. Einstieg ins Freigabe-Menü (Offene Anfragen, Freigegeben, Programm) — Menu A wie im Standard-Shop.',
      ctaMockup: 'Zum Mockup',
      ctaLive: 'Zum Live-Theme',
      secShopify: 'Standard Shopify',
      cardShopTitle: 'Startseite',
      cardShopBody: 'Shopify-Startseite mit Hero, Produktteasern und Shop-Chrome (Announcement, Navigation Menu A, Suche, Warenkorb) — ohne Tierarzt-Empfehlungs-Sonderlogik. Referenz ist das Live-Theme (Passwort nix).',
      cardPdpTitle: 'Produktdetailseite',
      cardPdpBody: 'Produktdetailseite mit Sticky-Galerie, Kaufblock, Naturalrabatt-Widget, Social Proof und Sticky ATC. Zeigt das Produktmodell (Familie vs. Einzelprodukt, Varianten) im Live-Theme — Beispiel Hepax forte (Passwort nix).',
      cardCollectionTitle: 'Collection',
      cardCollectionBody: 'Produktübersicht mit Filter-Sidebar, Sortierung und Empty-State gemäß Collection-Spec (E.3). Referenz ist das Live-Theme, Collection „Alle Produkte“ (Passwort nix).',
      secSections: 'Sections',
      cardBundleTitle: 'Personalisiertes Angebot',
      cardBundleBody: 'Bundle-Builder („Persönliches Angebot“) mit Naturalrabatt-Staffeln, Mengenwahl und Übernahme in den Warenkorb. Fokus auf der Konditionslogik pro Einzelprodukt-Position — ohne ablenkende Collection- oder Testimonial-Blöcke.',
      secStandalone: 'Stand Alone Pages',
      cardFormTitle: 'Formular für Nebenwirkungen',
      cardFormBody: 'Stand-alone-Meldeformular für unerwünschte Wirkungen aus der Tierarztpraxis: Floating Labels, Validierung und Danke-Zustand auf Weiß/Grün — Vorlage für vergleichbare Form-Pages außerhalb des Shop-Chrome.',
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
      cardDesignBody: 'Tokens, atoms, molecules and organisms — the binding reference for typography, colour, spacing and all UI building blocks. Use it to check which class already exists before building anything new; the guide mirrors planet-brands.css 1:1.',
      ctaStyleguide: 'Open styleguide',
      secTe: 'Vet recommendation',
      cardTeTitle: 'Vet recommendation',
      cardTeBody: 'Customer shop flow: pet owners sign in, request a recommendation and buy approved products. Includes collection, PDP with approval logic, cart and pre-/post-approval states — Menu B (Home · All products · Documentation).',
      cardFreigabeTitle: 'Issue approval',
      cardFreigabeBody: 'Vet portal for issuing an approval without a prior request: recipient and consent, product and quantity selection, email preview. Entry to the approval menu (open requests, approved, how it works) — Menu A like the standard shop.',
      ctaMockup: 'Open mockup',
      ctaLive: 'Open live theme',
      secShopify: 'Standard Shopify',
      cardShopTitle: 'Homepage',
      cardShopBody: 'Shopify homepage with hero, product teasers and shop chrome (announcement, Menu A, search, cart) — without vet-recommendation special logic. Reference is the live theme (password nix).',
      cardPdpTitle: 'Product detail page',
      cardPdpBody: 'Product detail page with sticky gallery, buy block, natural-discount widget, social proof and sticky ATC. Shows the product model (family vs. single product, variants) on the live theme — example Hepax forte (password nix).',
      cardCollectionTitle: 'Collection',
      cardCollectionBody: 'Product listing with filter sidebar, sorting and empty state per collection spec (E.3). Reference is the live theme, “All products” collection (password nix).',
      secSections: 'Sections',
      cardBundleTitle: 'Personalised offer',
      cardBundleBody: 'Bundle builder (“personalised offer”) with natural-discount tiers, quantity selection and hand-off to the cart. Focus on condition logic per single-product line item — without distracting collection or testimonial blocks.',
      secStandalone: 'Stand-alone pages',
      cardFormTitle: 'Adverse reaction form',
      cardFormBody: 'Stand-alone form for reporting adverse effects from the veterinary practice: floating labels, validation and thank-you state on white/green — template for similar form pages outside shop chrome.',
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
