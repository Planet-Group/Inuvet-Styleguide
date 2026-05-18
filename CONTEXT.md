# Inuvet Styleguide — Projekt-Kontext

Diese Datei fasst die Projektgeschichte, alle Designentscheidungen und den aktuellen Stand zusammen. Sie ist der Einstiegspunkt für jede neue Session und wird bei größeren Änderungen aktiv gepflegt.

> **Letzte Aktualisierung:** 2026-05-17

---

## Projekt-Übersicht

**Was ist das?**
Ein umfassender HTML/CSS Design System Styleguide für die Marke **inuvet** (Tiergesundheitsprodukte, Shopify-Shop). Er dient Entwicklern und dem Marketing als verbindliche Referenz und enthält interaktive Demos aller Komponenten.

**Ziel:** „Perfekter, sauberer Code, der von Entwicklern gerne angenommen wird."

**Live-Preview:**
- GitHub: `https://github.com/planet-group/Inuvet-Styleguide`
- GitHub Pages: `https://planet-group.github.io/Inuvet-Styleguide/styleguide.html`
- Lokal: Port **3456** (`python3 -m http.server 3456` aus `~/Inuvet-Styleguide/`)

---

## Dateistruktur

```
~/Inuvet-Styleguide/
├── CLAUDE.md                       # Auto-Loaded Pointer für Claude Code Sessions
├── CONTEXT.md                      # Diese Datei (Projekt-Doku)
├── styleguide.html                 # Haupt-Styleguide (Sektionen 00–38)
├── inuvet.css                      # Design System CSS (Tokens, Atome, Moleküle, Organismen)
├── sg.css                          # Styleguide-Only UI-Klassen (sg-Präfix)
├── mockup-ui.css                   # Dev-UI Chrome (Mockup-Bar, FAB, Mockup-Modal)
├── assets/
│   ├── images/                     # Calmin_Packshot_01/02/03, Hepax_Packshot_01/02
│   ├── graphics/                   # Inuvet_Logo_RGB.svg
│   ├── lotties/                    # Lottie-Animationen (.json)
│   └── videos/
└── pages/
    ├── Bundle.html                 # Bundle-Builder Mockup (Naturalrabatt-System)
    ├── bundle.css
    ├── Bundle-Info.html            # Konzept-/Spezifikations-Artikel zum Bundle
    ├── Produkt-Modell.html         # Blog-Beitrag: Indikation → Familie → Einzelprodukt → Variante
    ├── Tierarzt-Empfehlung-Mockup.html   # Hauptmockup: Rezeptanfrage-Flow
    ├── Tierarzt-Empfehlung-Mockup.css
    ├── Inuvet-Freigabe-Mockup.html # Vet-Portal: Empfehlungsanfragen freigeben
    ├── freigabe.css
    ├── Formular-Reklamation.html   # Stand-Alone-Formular-Beispiel
    ├── formulare.css
    ├── Provision-Portal.html       # Tierarzt-Provisions-Portal (Auszahlung / Prämie)
    ├── Provision-Portal-Info.html  # Technische Dokumentation zum Provisions-Portal
    ├── provision-portal.css
    └── _template.html              # Boilerplate für neue Mockup-Pages
```

---

## Produkt-Modell (Domain-Wissen)

### Aufbau

| Begriff | Definition | Beispiel |
|---|---|---|
| **Indikation** | Das Krankheitsbild, gegen das ein Produkt hilft. Gibt dem Produkt seinen Namen. | Durchfall → „EnteroGast" |
| **Produkt** | Eine konkrete Darreichungsform einer Indikation. Vollständiger Name = Indikation + Darreichungsform. | „EnteroGast Tabletten", „EnteroGast Pulver" |
| **Variante** | Unterschiedliche Füllmengen desselben Produkts. | EnteroGast Tabletten in 21 Stk. / 90 Stk. |
| **Produktfamilie** | Alle Produkte (= Darreichungsformen) mit derselben Indikation werden unter dem Indikationsnamen zusammengefasst. | Familie „EnteroGast" = Tabletten + Pulver |

### Regeln
- Verschiedene Darreichungsformen = verschiedene Produkte (nicht Varianten desselben Produkts)
- Darreichungsformen richten sich oft an unterschiedliche Tierarten (z.B. Tabletten für Hunde, Pulver für Katzen + Hunde)
- Füllmengen = Varianten eines Produkts (kein eigener Name)
- **Anzeige-Regel** (kontextabhängig): In den Warenkorb kommen immer **Einzelprodukte**, nie Familien. Daraus folgt: Sobald ein konkreter Preis oder eine Darreichungsform im Kontext steht, handelt es sich um ein Einzelprodukt — der Name muss die Darreichungsform enthalten. In reinen Übersichten (noch keine Produktwahl) reicht der Familienname ohne Darreichungsform.
  - **Übersichten** (Tiles, Collection, Suche): `Calmin Balance`, `Hepax forte`
  - **Cart, Checkout, Bestellübersicht, Freigabe**: `Calmin Balance Tabletten`, `Hepax forte Tabletten`; Variante zeigt nur noch Füllmenge (`60 Stück`)
  - **Einzelprodukte** behalten die Darreichungsform immer: `Inzym Pulver`

### Auswirkung auf den Styleguide
- **E.2 PDP Einzelprodukt** — ein Produkt ohne Geschwister-Darreichungsform (z.B. „Laxin Pulver")
- **E.2 PDP Produktfamilie** — mehrere Darreichungsformen unter einem Familien-Namen; mit `.pdp__type-selector` zur Auswahl der Darreichungsform
- Aktuelle Mockup-Produkte: **Calmin Balance** (Familie: Tabletten + Pulver), **Hepax forte** (Familie: Tabletten + Pulver), **Inzym Pulver** (Einzelprodukt, kein Bild → `placeholder-bg`)

---

## Architektur-Regeln (unveränderlich)

### CSS-Schichten

| Datei | Zweck | Darf nicht enthalten |
|---|---|---|
| `inuvet.css` | Design System — Tokens, Atome, Moleküle, Organismen | Styleguide-UI, Mockup-Chrome, Page-Spezifika |
| `sg.css` | Styleguide-eigene UI (`.sg-*` Präfix) | Echte Produkt-Komponenten |
| `mockup-ui.css` | Dev-UI Chrome (Mockup-Bar, FAB, Mockup-Modal, Email-Overlays) | Page-Content, Theme-Komponenten, `inuvet.css`-Klassen wie `.btn` oder `.form-field` |
| `pages/[name].css` | Page-spezifische Overrides + page-eigene Klassen | Globale Design-System-Änderungen |
| `temp.css` | Alle neuen Styles im Test (Staging) — global wie seitenspezifisch | Produktions-Code — nie deployen |

**`temp.css`-Inhalt:** leer (alle Klassen nach `inuvet.css` promoted, Stand 2026-05-14)

### Seiten-Architektur

- **Hero-led Pages** (Bundle, Tierarzt-Mockup): `<main>` direkt, ohne `.page` — section-types sind selbst-containerisiert
- **Content-Pages** (Bundle-Info, Inuvet-Freigabe): `<main class="page">` oder `<main><div class="page">`
- **Form-Pages** (Formular-Reklamation): nutzen `.form-page` Shell statt `.page`

---

### CSS-Workflow: Neue Styles

**Reihenfolge — immer in dieser Priorität:**

1. **Bestehende Klasse wiederverwenden** — `grep -n "…" inuvet.css` vor jedem neuen Style. Existiert die Funktion? → Verwenden, fertig.
2. **Komposition** — Lassen sich zwei bestehende Atome kombinieren (z.B. `.label-caps` + `.fg-muted`)? → Kein neuer Style nötig.
3. **temp.css** — Erst wenn wirklich etwas Neues gebraucht wird: in `temp.css` schreiben und im Browser testen. `temp.css` ist in allen Mockup-Seiten eingebunden. **Gilt für alle neuen Styles** — egal ob das Element später global oder seitenspezifisch eingesetzt wird. Zum Zeitpunkt der Entwicklung ist das noch offen.
4. **Entscheidung nach Abschluss** — Erst wenn ein Element fertig entwickelt und bestätigt ist, entscheiden wir gemeinsam: → **`inuvet.css`** (global, inkl. Styleguide-Dokumentation) oder → **`pages/[name].css`** (seitenspezifisch). Danach den Eintrag in `temp.css` löschen.

`temp.css` ist ein flüchtiger Staging-Bereich — kein Langzeitlager. Einträge dort sind immer temporär.

---

## Designprinzipien

→ Verbindliche Regeln stehen in **`CLAUDE.md` (Goldene Regeln)** — dort gepflegt, nicht hier.

---

## Token-System (`inuvet.css` `:root`)

> Werte unten sind die echten Definitionen, **inkl. `clamp()` und Berechnungen** — nicht die approximierten Endwerte.

### Spacing
```css
--base: 1rem
--half-module: clamp(0.75rem, 0.5rem + 1.35vw, 1.5rem)
--module: clamp(1.5rem, 1rem + 2.7vw, 3rem)
--module-2xl: calc(var(--module) * 2)         /* ≈ 6rem */
--module-3xl: calc(var(--module) * 3)         /* ≈ 9rem */
--gutter: var(--module)
--margin: var(--module)
--section-gap: var(--module)
```

### Typography
```css
--text-xs: 0.667rem
--text-sm: 0.8rem
--text-base: clamp(0.875rem, 0.8rem + 0.3vw, 1rem)
--text-m: clamp(1.25rem, 1rem + 0.7vw, 1.5rem)
--text-l: clamp(1.5rem, 1rem + 1.7vw, 2.25rem)
--text-xl: clamp(2rem, 1rem + 3.2vw, 3.375rem)
--lh-base: 1.5
--lh-h3: 1.2
--lh-h2: 1.17
--lh-h1: 1.11
--font: "schnebel-sans-me", sans-serif
```

### Layout
```css
--announcement-height: var(--module)
--nav-height:        calc(var(--module) * 2.5)
--header-height:     calc(var(--module) * 3.5)
--page-pt:           var(--module)            /* Atemraum unter sticky Header */
--container-max:     1536px
--section-max-height: 51rem
--section-min-height: 24rem
```

### Stacking (z-index)
```css
--z-default: 1
--z-nav: 100
--z-dropdown: 110
--z-overlay: 200
--z-drawer: 210
--z-modal: 220
```

### Animation
```css
--anim-fast: 0.2s ease
--anim-mid:  0.3s ease
--anim-base: 0.4s ease
--anim-slow: 0.6s ease
--anim-announcement: 4s              /* Anzeigedauer pro Announcement-Item */
--anim-delay: 0ms                    /* per-Element Stagger-Delay (via JS) */
```

### Farben (Primitives)
```css
--green:        #78b41b
--green-hover:  #58990F
--green-light:  #f0fae6
--fg:           #000
--fg-muted:     #666
--fg-hover:     #333
--bg:           #fff
--border:       #cccccc
--border-light: #e0e0e0
--accent-bg:    #f2f2f2
--border-focus: var(--fg)
```

### Kategorie-Farben (`data-cat` Attribut)
14 Produkt-Kategorien als Pärchen `--cat-X` (Solid) + `--cat-X-light` (Background-Tint):
beruhigung, leber, gelenke, immun, herz, magendarm, haut-fell, atemwege, niere, krebs, augen, alter, bewegung, cbd. Text immer in `--fg` (kein eigener Color-Token).

---

## Container-Modifier (auf `.page`)

Drei standardisierte Lese-Breiten statt ad-hoc `max-width`-Werten:

| Klasse | Breite | Verwendung |
|---|---|---|
| `.page` | `var(--container-max)` (1536px) | Standard, Listen, Übersichten, Marketing-Content |
| `.page.--narrow` | `calc(var(--module) * 15)` (≈720px) | Lese-Content, Detail-Seiten |
| `.page.--form` | `calc(var(--module) * 10)` (≈480px) | Eingabe-Formulare, Onboarding |
| `.page.--no-pt` | — | Hebt `--page-pt` auf (für Pages, die direkt nach Hero starten) |

---

## Wichtige Komponenten & Patterns

### Floating Label (Form Field)
```html
<div class="form-field">
  <input placeholder=" " id="x">
  <label for="x">Label</label>
</div>
```
- `placeholder=" "` (ein Leerzeichen) triggert `:not(:placeholder-shown)`
- Modifier: `.--on-green`, `.--error`, `.--success`

### Tile / Produktkachel
```html
<div class="tile --product">
  <div class="tile__image-wrap">
    <div class="floating-meta">…</div>
    <img src="…" class="tile__image">
    <button class="tile__cart-icon">…</button>
  </div>
  <div class="tile__headline-row">
    <h3 class="tile__headline">…</h3>
    <div class="rating">…</div>
  </div>
  <p class="tile__description">…</p>
  <div class="tile__price">…</div>
</div>
```
- `.tile.--featured` = Sonderkachel (grüner Hintergrund)
- `.tile-grid.--cols-2/3/4` für Grid-Layouts
- **Preis in `.tile__price` immer mit „ab"** — in der Übersicht ist noch keine Darreichungsform/Füllmenge gewählt. `<span>ab 39,90 €</span>`. Bei Sale: `<span>ab 24,90 €</span><span class="--old">49,90 €</span>`.
- **Cart Item `.cart-item__variant`**: Füllmenge + Preis: `60 Stück · 39,90 €` — immer `cart-item__variant` (xs, muted), nie eigene Klassen
- **Cart Item Variante „Mit Button"** (C.2 Demo 5): statt `qty-selector` im `cart-item__bottom` ein `.btn.--sm` — z.B. im Produktfinder-Ergebnis oder Empfehlungs-Vorschau

### Card-Patterns (4 verschiedene, bewusst getrennt)
| Klasse | Verwendung |
|---|---|
| `.tile.--product` | Produkt-Übersicht im Grid |
| `.cart-item` | Reihe im Cart-Drawer (Grid, kein Border, nur Separator) |
| `.summary-card` | Highlighted Action Card (grüner BG, weiße Schrift) |
| `.rec-card` | Compact Product Tile (horizontaler Scroll) |
| `.approval-product-card` | Form Card mit Aktionen + Note-Section |

→ Detailtabelle in Sektion C.3 des Styleguides. Keine generische `.card`-Basis.

### Empty-State / Success-State (Schwester-Komponenten)
```html
<!-- Empty: nichts da, neutral -->
<div class="empty-state">
  <span class="material-icons">shopping_cart</span>
  <p class="empty-state__title">…</p>
  <p class="empty-state__sub">…</p>
</div>

<!-- Success: positiv konnotiert -->
<div class="success-state">
  <span class="material-icons success-state__icon">check_circle</span>
  <h3 class="success-state__title">…</h3>
  <p class="success-state__body">…</p>
  <div class="success-state__actions">…</div>
</div>
```
Beide sind global in `inuvet.css`. Einsetzbar inline, im Modal, im Drawer.

### Notice / Infobox (Sektion C.7)
```html
<div class="notice">
  <h4 class="notice__title">…</h4>
  <p>…</p>
  <div class="notice__actions"><button class="btn --primary">…</button></div>
</div>
```
Gelber Hintergrund (`#FEFFDA`), kein Border. Drei Varianten: einzeilig, mehrzeilig, mit CTA.

### Spacing-Systemregel — H→p→Button-Stacks

Überall wo Headline + Fließtext + CTA gestapelt werden (Hero, Teaser, Banner):
- Headline → Body: `margin-bottom: var(--half-module)`
- Body → Button: `margin-bottom: var(--half-module)`

Dieses Muster ist in D.3 als explizite Systemregel dokumentiert (Stand 2026-05-14). Gilt in `section-type__headline/body` genauso wie in page-spezifischen Teasern.

### section-type — Animation-Variante

`.section-type --v1 --reverse` mit `.section-type__animation` statt Bild:
- Content nimmt die **volle Spaltenbreite** (kein `max-width`, kein horizontales Einrücken)
- Vertikal zentriert via `margin-block: auto`
- Für Teaser/Banner-Sections, die eine Lottie-Animation zeigen wollen, diese Variante direkt aus D.3 kopieren — kein custom CSS nötig

### PDP — Einzelprodukt vs. Produktfamilie
- **Einzelprodukt**: Darreichungsform direkt im Namen (z.B. „Laxin Pulver"), keine Größenwahl
- **Produktfamilie**: `.pdp__type-selector` mit Radio-Buttons für Varianten + `.pdp__variants` mit Größen-Buttons. Beide Muster in Sektion E.2 dokumentiert.

### Naturalrabatt-System (Bundle)
Mengen-basiertes Rabattsystem (kein Gutschein). Stufen-Konfiguration pro Produkt im Backend, aufgelöst zur Laufzeit. Prozess dokumentiert in `pages/Prozess-Diagramm.html` (Swimlane-Diagramm Marketing → Backend → Frontend).

---

## Section-Label Modifier (h2 vs. h3)
- `.section-label` — Top-Level (h2), border-bottom mit `--border`, größerer Abstand
- `.section-label.--sub` — Sub-Sektion (h3), border-bottom mit `--border-light`, kompakter

Beispiel: Checkout-Form-Subgruppen („Lieferadresse", „Versandart", „Zahlung") nutzen `.--sub`.

---

## Sektions-Struktur (`styleguide.html`)

Atomic-Design-Hierarchie mit 5 Gruppen (A–E). Erweiterbar ohne Suffix-Patches.

### A — Foundations
| | Inhalt |
|---|---|
| A.1 | Logo |
| A.2 | System-Logik (1rem × 1.5 Skala) |
| A.3 | Design Tokens (komplette Token-Referenz) |
| A.4 | Typografie + Rich Text Editor |
| A.5 | Farben (incl. 14 Kategoriefarben) |
| A.6 | Linien & Borders |
| A.7 | Spacing |
| A.8 | Spaltenraster |
| A.9 | Responsive |
| A.10 | Styleguide UI-Klassen (Meta-Doku) |

### B — Atome
| | Inhalt |
|---|---|
| B.1 | Buttons |
| B.2 | Badges & Labels (Rating, Wishlist) |
| B.3 | Icons & icon-box |
| B.4 | Form-Felder |
| B.5 | Product Thumb |
| B.6 | Breadcrumb (**aktuell nicht aktiv genutzt** — bleibt dokumentiert) |

### C — Moleküle
| | Inhalt |
|---|---|
| C.1 | Produktkarte |
| C.2 | Cart Item |
| C.3 | Card-Pattern-Übersicht (Lehrstück: welche Karte für welchen Kontext) |
| C.4 | Stand-Alone-Formular |
| C.5 | Tabs & Akkordeon |
| C.6 | Pagination |
| C.7 | Notice / Infobox (`.notice`) |
| C.8 | Empty / Success State |
| C.9 | Toast / Notification |
| C.10 | Modal / Pop-up |

### D — Organismen
| | Inhalt |
|---|---|
| D.1 | Navigation & Announcement |
| D.2 | Footer |
| D.3 | Hero-Sections (section-types v1–v4) |
| D.4 | Kachel-Raster |
| D.5 | Testimonials |
| D.6 | Marquee |
| D.7 | Newsletter Signup |
| D.8 | Cookie-Banner |

### E — Seiten-Vorlagen
| | Inhalt |
|---|---|
| E.1 | Page-Skeleton (Boilerplate-Snippet) |
| E.2 | Produktdetailseite (PDP) — Einzelprodukt + Produktfamilie |
| E.3 | Produktübersicht / Collection |
| E.4 | Warenkorb-Drawer |
| E.5 | Checkout |
| E.6 | Account-Seiten |
| E.7 | Suche |
| E.8 | Blog |
| E.9 | Out-of-Stock |
| E.10 | Landing-Page-Elemente |

> **Erweiterung**: Neue Komponente kommt einfach als nächste Nummer in der passenden Gruppe (z.B. `B.7`, `C.11`, `E.11`) — keine Suffixe wie `12a`, `34a`, `17a` mehr nötig.

---

### Klassen-Schnellreferenz (Komponentenindex)

> Schnellüberblick für die Arbeit mit `inuvet.css`. A (Foundations) enthält keine Klassen-Komponenten — nur Tokens, Farben, Typografie. Bei Bedarf Details zur einzelnen Komponente gezielt aus `styleguide.html` lesen (Anker: `#A1`, `#B1` … `#E10`).

#### B — Atome

| Sektion | Komponente | Klasse(n) | Modifier | Wichtige Kinder / Hinweise |
|---|---|---|---|---|
| B.1 | Button | `.btn` | `--primary --secondary --ghost --back --sm --full --danger --loading` | — |
| B.2 | Badge / Label | `.badge` | `--dark --sale --pill --dot`; `[data-cat]` für Kategorie | `.label-caps` für Caps-Beschriftung (eigenständig) |
| B.3 | Icon & Icon-Box | `.icon-box` | — | `.material-icons` |
| B.4 | Formularfeld | `.form-field` | `--sm` | `label + input/select/textarea`; `.form-grid` (`--full`) für Mehrspalter; `.form-check` für Checkboxen; `.form-upload`; `.actionable-input` |
| B.4a | Auswahlbox | `.choice-box` | `--sm --block --detail` | Standard: Varianten/Größen. `--block`: Icon + Text (Versandart). `--detail`: Spalten-Layout mit `.choice-box__label` + `.choice-box__desc` (Finder, Onboarding). |
| B.5 | Product Thumb | `.product-thumb` | — | 2× `<img>` (Produkt + Rollover) |
| B.6 | Breadcrumb | `.breadcrumb` | — | `__item __sep --current` |

#### C — Moleküle

| Sektion | Komponente | Klasse(n) | Modifier | Wichtige Kinder / Hinweise |
|---|---|---|---|---|
| C.1 | Produktkarte | `.tile.--product` | `--featured`; in `.tile-grid.--cols-2/3/4` | `__image-wrap __image __headline-row __headline __description __price __cart __cart-icon`; `.floating-meta .rating .price-stack (--old)` |
| C.2 | Cart Item | `.cart-item` | — | `__info __top __name __variant __bottom __remove __price`; benötigt `.product-thumb`; in `__bottom`: `.qty-selector` oder `.btn.--sm` |
| C.3 | Card-Pattern | — | — | Lehrstück: welche Karte für welchen Kontext — kein eigenes BEM |
| C.4 | Formular-Shell | `.form-page` | — | Wrapper für Stand-Alone-Formulare |
| C.5 | Tabs & Akkordeon | `.tabs .tab-panel` | — | `.accordion .accordion-item .accordion-trigger .accordion-content .accordion-icon` |
| C.6 | Pagination | `.pagination` | — | `__page (--current) __btn __dots` |
| C.7 | Notice / Infobox | `.notice` | — | `__title __actions` |
| C.8 | Empty / Success | `.empty-state` `.success-state` | — | `__icon __title __body __actions` |
| C.9 | Toast | `.toast` | `--success --error --info --out` | `.toast-container` (fixed Wrapper) |
| C.10 | Modal | `.modal` `.modal-overlay` | `--open` auf overlay | Modal-Inhalt direkt als Kind; `.modal__title` |
| C.10a | Bestätigungs-Dialog | `.shop-modal-overlay` `.shop-modal` | `--open` auf overlay | `__icon __title __body __actions`; Icon-Farbe via `var(--green)` |

#### D — Organismen

| Sektion | Komponente | Klasse(n) | Modifier | Wichtige Kinder / Hinweise |
|---|---|---|---|---|
| D.1 | Navigation | `.site-nav` `.announcement-bar` | — | `.nav-left .nav-center .nav-right .nav-item .nav-hamburger .mobile-menu` |
| D.2 | Footer | `.site-footer` | — | `.footer-main .footer-bar` |
| D.3 | Hero-Sections | `.section-type` | `--v1 --v2 --v3 --v4 --reverse --viewport` | `__content __headline __body __bottom __image __animation` |
| D.4 | Kachel-Raster | `.tile-grid` | `--cols-2/3/4 --boxed` | `.tile` (generisch); `.tile.--product` → C.1 |
| D.5 | Testimonials | `.testimonial-grid .testimonial` | — | `.testimonial-slider .slider-nav .slider-btn .slider-counter` |
| D.6 | Marquee | `.marquee` | — | — |
| D.7 | Newsletter | `.newsletter` | — | — |
| D.8 | Cookie-Banner | `.cookie-banner` | — | `__text __actions` |

#### E — Seiten-Vorlagen

| Sektion | Komponente | Klasse(n) | Modifier | Wichtige Kinder / Hinweise |
|---|---|---|---|---|
| E.2 | PDP | `.pdp` | — | `.pdp__type-selector .pdp__type-row .pdp__type-label .pdp__type-animals` |
| E.3 | Collection | `.collection-layout` | — | `.collection-sidebar .collection-toolbar` |
| E.4 | Warenkorb-Drawer | `.cart-drawer` `.cart-overlay` | `--open` | `__header __title __items __footer` |
| E.4a | Options-Drawer | `.options-drawer` `.options-overlay` | `--open` | `__header __title __items __product __section __section-label __footer`; `.options-variants` für Choice-Box-Gruppe |
| E.5 | Checkout | `.checkout` | — | `.summary-line .summary-total` |
| E.6 | Account-Seiten / Login-Modal | `.login-overlay` `.login-modal` | `--open` auf overlay | `.login-brand` (Dark-Panel, ab 640px) + `.login-form-panel`; Tabs: `.login-tabs` / `.login-tab.--active`; Panels: `.login-panel` / `.--hidden`; `.order-item` für Bestellhistorie |
| E.7 | Suche | `.search-overlay .search-panel` | — | `.search-results .search-result` |
| E.8 | Blog | `.article-layout .article-sidebar` | — | `.rte` für Fließtext; `.blog-card` |

#### Globale Helfer (kein eigener Styleguide-Abschnitt)

| Klasse | Modifier | Zweck |
|---|---|---|
| `.page` | `--narrow --form --no-pt` | Container mit max-width + padding |
| `.section-label` | `--sub` | Caps-Label als Abschnittsüberschrift |
| `.label-caps` | — | Inline Caps-Beschriftung (xs, muted, bold, uppercase) |
| `.qty-selector` | `--sm` | Mengenauswahl (`__btn __input`) |
| `.choice-box` | — | Auswahl-Button (Tier, Option, Darreichungsform) |
| `.check-list` | — | Liste mit Haken-Icons |
| `.price-stack` | — | Preis + `--old` für Streichpreise |
| `.placeholder-bg` | — | Grauer Platzhalter für Produktbilder ohne Foto |
| `.header` | — | Seitenkopf-Hero (Titel + Meta) |

---

## Mockups (`pages/`)

### `Tierarzt-Empfehlung-Mockup.html` — Hauptmockup
**Scenario:** Shopify-Shop für Tiergesundheitsprodukte mit Rezeptpflicht-System.

**3 User-States (umschaltbar per Mockup-Bar):**
- ① Gast (nicht eingeloggt) — kein Login-Gate vor dem Warenkorb; Login erst beim Absenden der Anfrage
- ② Eingeloggt, keine Freigabe
- ③ Eingeloggt, mit Freigabe (mind. 1 Praxis hat Empfehlung ausgestellt)

**Rezeptanfrage-Flow:**
1. „Produkt anfragen" → Cart-Item (auch als Gast möglich)
2. „Anfragen" im Cart → Login-Modal (nur für Gäste); nach Login: Warenkorb-Redistribution — freigegebene Produkte wandern direkt in `cartApproved`, Schritt 2 wird übersprungen wenn `cartRequested` danach leer ist
3. Praxis-Dropdown (Vet-Hinweis darunter dynamisch: grüner Punkt + „schnellere Bearbeitung" bei `hasRecommended: true`, leerer Punkt + Info-Text sonst)
4. Bestätigungs-Screen mit E-Mail-Overlay (Kunden-E-Mail + ggf. Vet-E-Mail oder interne Nachricht bei unbekannter Praxis)

**Zugehörige Dokumentation:** `Tierarzt-Empfehlung-Info.html`

### `Bundle.html` — Bundle-Builder
- Naturalrabatt-System mit Tier-Konfiguration (Kondition A / B)
- `.summary-card` (sticky/floating) als Bestell-Übersicht
- Empfehlungs-Schiene (horizontal scrollbar, `recommendationsCount` konfigurierbar)
- Mockup-FAB für Backend-Konfiguration der Stufen + Zeitraum-Simulation
- **Sichtbarkeits-Logik**: `initBundle()` wird **einmalig beim Load** aufgerufen:
  1. 180-Tage-Pool (`past6Months`) prüfen — Gratis-Produkt? → Section zeigen
  2. Nein → 549-Tage-Fallback (`past18Months`) prüfen
  3. Immer noch nein → Section dauerhaft ausgeblendet
  Nach dem Load ändert sich die Sichtbarkeit nicht mehr (auch wenn User alle Rabatt-Produkte entfernt).
- Mockup-Settings-Modal: „Zeitraum simulieren" Toggle (Normal / Nur 18 Monate) für Fallback-Demo
- Prozess-Swimlane wurde entfernt — Flow ist in `Bundle-Info.html` dokumentiert

### `Bundle-Info.html` — Konzept-Artikel
Strategie, UX-Konzept und technische Spezifikation des Bundle-Builders. Article-Layout mit Sidebar.
Dokumentiert: beide Konditions-Modelle (A/B), zweistufige Anzeige-Bedingung (180→549 Tage), One-Shot-Sichtbarkeits-Regel, `resolveBundle()`-Pseudocode.

### `Produkt-Modell.html` — Erklärungs-Artikel
Blog-Beitrag im `article-layout`-Design. Erklärt die vier Ebenen (Indikation → Produktfamilie → Einzelprodukt → Variante) mit Kontext-Tabelle (was wird wo angezeigt). Verlinkt aus Styleguide-Sektionen C.1 und E.2.

### `Inuvet-Freigabe-Mockup.html` — Vet-Portal
Tierarzt-Ansicht: einzelne Empfehlungsanfrage von Tierbesitzer freigeben/ablehnen + optionale Notiz.
- Standard `.site-nav` Header (mit Announcement Bar)
- `<main class="page --narrow approval-page">`
- `.choice-box` als Mengen-Auswahl (Ablehnen, max. 1×, max. 2×, max. 5×, Unbegrenzt)
- Nach Absenden: `.success-state` + E-Mail-Overlay (analog Tierarzt-Empfehlung-Mockup) mit zwei Nachrichten: Kunden-E-Mail + interne Nachricht an `team@inuvet.com`

### `Provision-Portal.html` + `Provision-Portal-Info.html` — Tierarzt-Provisions-Portal
Tierarzt-Ansicht: verdiente Provisionen einsehen und einlösen — als Barauszahlung (IBAN-Modal) oder als Prämie (Gutschein / Sachprämie).
- SPA-Rendering via `render()` + State-Flags (`currentPage`, `activePremiumId`, `cart`)
- 4 Views: Portal (Prämien-Übersicht), PDP (Prämien-Detail), Checkout, Erfolgsseite
- Fortschrittsring (SVG) im Hero + auf jeder Prämien-Kachel (IntersectionObserver, `initRings()`)
- Animierter Count-Up für Provisionsbetrag (`countUp()`)
- Prämien sortiert von teuer → günstig; Hero-Hint zeigt nächstgünstige erreichbare Prämie als Link zur PDP
- Gutscheinkarten nutzen `.voucher-frame` + `.voucher-card` (bewusste Ausnahme: `border-radius: 1.25rem`)
- **Zugehörige Dokumentation:** `Provision-Portal-Info.html`

### `Formular-Reklamation.html` — Stand-Alone-Formular
Beispiel für Sektion C.4. Nutzt `.form-page` Shell.

### `Tierarzt-Empfehlung-Info.html` — Technische Dokumentation
Article-Layout mit Sidebar. Dokumentiert vollständig das Rezeptanfrage-System: drei Nutzerzustände, 5-Schritt-Anfrage-Flow, Warenkorb-Redistribution nach Login, E-Mail als zentrales Pflichtfeld, Tierarzt-Portal (inkl. Ablehnung und interner Benachrichtigung), technische Implementierungs-Schritte.

---

## Technische Konventionen

### Preview-Server
```bash
cd ~/Inuvet-Styleguide && python3 -m http.server 3456
```

### Commit-Message-Format
```
feat: …      (neue Komponente / Funktion)
fix: …       (Bugfix)
refactor: …  (Code-Umbau ohne Funktions-Änderung)
docs: …      (Doku-Updates)
```

### Bildpfade
- Produkte: `assets/images/Calmin_Packshot_01.jpeg` etc.
- Logo: `assets/graphics/Inuvet_Logo_RGB.svg` (als `<img>`, nicht inline)
- **Globale Regel**: Nur Calmin- und Hepax-Packshots existieren; alle anderen Produkte zeigen `placeholder-bg`

### Globale JS-Datei (`inuvet.js`)
Analog zu `inuvet.css` — enthält shared UI-Funktionen die in allen Pages gebraucht werden.

| Funktion | Zweck |
|---|---|
| `toggleMobile()` / `closeMobile()` | Burger-Menü öffnen / schließen |
| `closeAnnouncement()` | Announcement-Bar ausblenden |
| `initMarquees()` | Marquee-Animationen initialisieren |
| `toggleAccordion(trigger)` | Akkordeon-Item umschalten (global, PDP + C.5) |
| `initScrollAnimations()` | IntersectionObserver für `[data-animate]` / `.--in-view` |

Einbindung: `<script src="../inuvet.js"></script>` am Ende von `<body>` (in `pages/`) bzw. `<script src="inuvet.js"></script>` in `styleguide.html`.
Neue globale JS-Funktionen gehören hierher, nicht inline in einzelne Pages.

### CSS Cache-Busting (Development)
`inuvet.css?v=N` — N hochzählen nach CSS-Änderungen (vor Push entfernen).

