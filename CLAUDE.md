# Inuvet Styleguide — Claude Code

---

## Erstkontakt-Checkliste

1. Sprache: **Deutsch** (Doku, Commits, Kommentare, Antworten)
2. Globale System-Dateien: `planet-brands.css` / `planet-brands.js` — in alle Pages einbinden. Seitenspezifische Logik → `pages/xyz.js`. Kein Inline-Script. → Details unter „JS-Schichtung".
2b. **Drei Schichten:** System (`planet-brands.*`) · Haut (`brand-{handle}.css`) · Kühlschrank (Store-Inhalte). Inuvet bleibt `:root` in `planet-brands.css`. Neue Marke = eine Token-Datei `brand-{handle}.css` + eigener Store — niemals Tokens in `planet-brands.css`. `brand-inuvet.css` nur, wenn Inuvet wie andere umgeschaltet werden muss. Shopify `assets/` ist flach, gleicher Basename wie hier.
2c. **Marken-Haut (Muster):** `brand-planimol.css` existiert bereits. Planimol = `html[data-brand="planimol"]` + diese Datei. Schalter nur in `styleguide.html` (Sidebar). Teilen via `?brand=planimol`. Theme später: gleiche Datei als `assets/brand-planimol.css` — Theme lädt die Haut noch nicht. Nicht das Repo `Planimol-Styleguide` weiterbauen. **Inhalte** (Benefits, Praxis, Lottie-JSONs) sind nicht die Haut — sie liegen pro Shopify-Store in markenneutralen Metaobjects `shop_benefit` / `shop_praxis`. Spec → Theme `CLAUDE.md` „Marke: ein Theme, zwei Kühlschränke“.
3. **Nach Rate-Limit-Abbruch:** Vorherigen Chat wiederherstellen mit `mcp__ccd_session_mgmt__list_sessions` → neuesten Session-Titel „New session" oder ähnlich suchen → `mcp__ccd_session_mgmt__search_session_transcripts` mit Stichworten aus dem letzten Task. Alternativ: `git log --oneline -5` zeigt was zuletzt committet wurde.

---

## Dateinamen & Seitentitel

| Was | Regel | Beispiel |
|---|---|---|
| HTML in `pages/` | **Pascal-Case** mit Bindestrich | `Tierarzt-Empfehlung.html`, `Provision-Portal.html` |
| Page-CSS / Page-JS | **kebab-case** (bewusst entkoppelt vom HTML) | `tierarzt-empfehlung.css`, `tierarzt-empfehlung.js` |
| Root-Tools | kebab ok | `styleguide.html`, `planet-brands.css` |
| Seitentitel Default | `{Name} – inuvet` (en dash, Brand klein am Ende) | `Shopify – inuvet` |
| Mockup + Doku-Paar | `{Bereich} · Mockup/Dokumentation/Start – inuvet` | `Shop · Mockup – inuvet` |
| TE-Cluster | `Inuvet – Tierarzt-Empfehlung – {Seite}` | bleibt |
| Produktname Portal | **Provision-Portal** (ohne zusätzliches „s“) | Datei + Titel |

Unterordner `reports/` und `vetalita/`: kebab-case Dateien ok · Vetalita-Brand `vetalità` in Titeln.

---

## Goldene Regeln (nie brechen)

1. **Bestehende Klassen zuerst** — vor jeder neuen Klasse: `grep` in `planet-brands.css`. Existiert die Funktion schon? → Wiederverwenden.
2. **Neue Styles immer zuerst in temp.css** — Erst wenn ein Element abgeschlossen ist, entscheiden wir gemeinsam: → `planet-brands.css` (global) oder → Page-CSS (seitenspezifisch). Nie direkt in `planet-brands.css` oder eine Page-CSS schreiben ohne vorherigen Test in `temp.css`. **Ausnahme:** Reine Styleguide-UI (`.sg-*`) wird direkt in `sg.css` geschrieben — kein Umweg über `temp.css`, da nicht produktionsrelevant. **Gilt auch im Guide:** Der Styleguide repräsentiert die `planet-brands.css`-Styles — also zuerst bestehende `planet-brands.css`-Klassen wiederverwenden; neues `sg.css` nur im Notfall für echtes Doku-Chrome, das es im Produkt-CSS nicht gibt.
3. **Keine Magic Numbers** — alles via `var(--…)`.
4. **`border-radius: 0`** — Ausnahmen nur: `.badge.--pill` und Avatar (`50%`).
5. **Kein `!important`**. Niemals.
6. **Kein `text-align: center`** für Inhalte — nur funktional (Button-Text, Qty-Input, Empty/Success-State).
7. **BEM-Modifier mit Doppel-Bindestrich**: `.btn.--primary`, `.--active`, `.--open`.
8. **Linien sparsam** — Whitespace trennt. `border-top` für Trennzwecke ist Code-Smell.
9. **Neue Komponente = Styleguide + Index** — Jede neue globale Komponente: (1) Demo-Abschnitt in `styleguide.html`, (2) Zeile in der Klassen-Schnellreferenz unten. Beides zusammen, nie nur eines.
10. **Neues CSS? Erst fragen** — Bevor neues CSS angelegt wird: kurz mitteilen, was fehlt und warum keine bestehende Klasse passt — und Bestätigung abwarten.
11. **Einzelprodukt vs. Produktfamilie — Namensregeln nie brechen** — Einzelprodukt-Titel **immer** inkl. Darreichungsform (`Calmin balance Tabletten`, `Inzym Pulver`). Familien-Titel **ohne** Form (`Hepax forte`). Unklar? → erst fragen (Regel gilt für Shopify-Theme 1:1).
12. **Mockup-UI strikt isoliert** — Alle Styles für Mockup-Steuerelemente kommen ausschließlich aus `mockup-ui.css`. Keine `planet-brands.css`-Klassen innerhalb von `.mockup-fab-panel`, `.mockup-bar` oder `.mockup-modal`. JS: `mockup-ui.js` (Alt+M / ⌥M blendet Mockup-Chrome global ein/aus).
13. **JS analog zu CSS schichten** — Globale Funktionen in `planet-brands.js`, seitenspezifische Logik in `pages/xyz.js`. Kein Inline-Script.
14. **Live = `main`** — GitHub Pages deployed ausschließlich von `main` → https://planet-group.github.io/Inuvet-Styleguide/. Bei Push/Deploy/Live-Schalten: **immer `main` pushen**, nie nur `feat/*` oder `session/*`. Workflow: committen (auf beliebigem Branch) → `git checkout main` → merge/fast-forward → `git push origin main`.
15. **Text-Rhythmus gehört immer `.flow`** — Abstände zwischen Überschriften und Absätzen (Text↔Text) kommen **ausschließlich** aus dem `.flow`-System (`planet-brands.css`, Doku A.7) — kontextunabhängig, egal ob Info-Page, Modal, Card oder Hero. Jeder Fließtext-Block bekommt `.flow`. Das `gap`/Margin einer Komponente trennt **nur strukturelle Blöcke** (Medien / Textblock / Actions), nie Headline→Paragraph. Kein Heading→Paragraph-Abstand über Flex-/Grid-`gap` oder Ad-hoc-Margins. Sonderfall: `--flow-space` am Element überschreiben, nicht neue Margins. Siehe `.cursor/rules/flow-spacing.mdc`.
16. **Print ist ein eigener Dialekt — nicht mit Web mischen** — Druckfähige PDFs laufen ausschließlich über `print.css` + `tools/print/`. Doku: `print-styleguide.html`. Drei Regeln daraus nie brechen: (1) **Haarlinien als SVG-Vektor**, nie als CSS-Rahmen — CSS-Rahmen unter ~0,25 mm verwirft Chromium beim PDF-Export teilweise, ohne Warnung. (2) **CMYK steht nie im CSS** — im HTML bleibt RGB, die Umwandlung macht die Zuordnungstabelle `tools/print/inks.py`. (3) **Jedes PDF wird nachgemessen** (`measure.py`) *und* als PNG angesehen — beides, keines ersetzt das andere. Neue Farbe im Print? → erst Eintrag in `inks.py`, sonst bricht die Pipeline ab.
17. **`index.html` immer aktuell halten** — Die Mockup-Übersicht (`index.html` + `index.js`, Live: https://planet-group.github.io/Inuvet-Styleguide/) ist der Bookmark für IT und Team. Michael und Agent: bei **neuen zentralen Mockup-Seiten**, **Umbenennungen** oder **Link-Änderungen** die Index-Seite mitziehen (DE|EN-Texte in `index.js` inklusive). Nie nur die Page anlegen/verschieben und den Index vergessen.

---

## Produkt-Modell

Vier Ebenen — Details und UI-Auswirkungen: `pages/Produkt-Modell.html`.

| Ebene | Definition | Beispiel |
|---|---|---|
| **Indikation** | Gesundheitsbereich / Navigation (Badge) | Beruhigung, Leber |
| **Produktfamilie** | Bundelt mehrere Darreichungsformen unter einem Namen (`isFamily: true`) | `Hepax forte` → Pulver + Tabletten |
| **Einzelprodukt** | Genau **eine** Darreichungsform — geht in den Warenkorb (`isFamily: false`) | `Calmin balance Tabletten`, `Inzym Pulver`, `Hepax forte Pulver` |
| **Variante** | Füllmenge mit eigenem Preis | 60 Stück / 90 Stück |

### Pflichtregeln (Shopify-Team & Mockups)

1. **Einzelprodukt-Name = Basisname + Darreichungsform** — immer, überall (Tile, Collection, Suche, PDP-Titel, Cart, Checkout, Freigabe). Beispiele: `Calmin balance Tabletten`, `Inzym Pulver`, `Otysan Fluid`. **Nie** nur `Calmin balance`, wenn es ein Einzelprodukt ist.
2. **Darreichungsformen** u. a. Tabletten, Pulver, Fluid, Salbe, Sachets — der Form-Begriff steht im Produkttitel (Einzelprodukt) bzw. wird erst nach Auswahl an den Familiennamen gehängt (Cart).
3. **Produktfamilie-Name ohne Form** — Tile / Collection / Suche / PDP-Titel: `Hepax forte`. Badge „Produktfamilie" Pflicht. Cart/Checkout: `Hepax forte Pulver` (Name + gewählte Form).
4. **In den Warenkorb kommen nur Einzelprodukte** (Form + Größe gewählt) — nie die Familie als Position.
5. **Kachel-Preis** immer `ab X,XX €` (günstigste Größe); bei Familien über alle Formen.
6. **Options-Drawer:** Familie → Darreichungsform + Größe; Einzelprodukt mit Größen → nur Größe; ohne Größenwahl → Direkt-Add.
7. Unklar ob Familie oder Einzelprodukt? → **nachfragen**, bevor Katalog/Mockup/Theme-Felder gesetzt werden.

**Anzeige nach Kontext:**

| Kontext | Produktfamilie | Einzelprodukt |
|---|---|---|
| Tile, Collection, Suche, PDP-Titel | `Hepax forte` + Badge „Produktfamilie" | `Calmin balance Tabletten` (Form im Titel) |
| Cart, Checkout, Freigabe | `Hepax forte Pulver` + Variantenzeile Größe | `Calmin balance Tabletten` + Variantenzeile Größe |

**Naturalrabatt:** Berechnung immer pro **Einzelprodukt-Position** (Darreichungsform + Größe = Order Line Item). Kondition A: Bestellwert = `Menge × Einzelpreis` dieser Position — nicht über eine Produktfamilie summiert. Details in `pages/Bundle-Info.html`.

In Cart/Checkout: Varianten-Zeile — **immer `.cart-item__variant`** (xs, muted), Format: `60 Stück · 39,90 €`. Button statt `qty-selector` → `.btn.--sm` in `.cart-item__bottom`. **Naturalrabatt Gratis-Badge:** Warenkorb auf dem Thumb (`product-thumb-wrap` + `floating-meta`), Bundle Builder im Counter (`cart-item__counter`) — nie beides. **`.cart-item__tier-hint`** pro berechtigter Zeile (Text via `formatHint()`), nur auf weißem Hintergrund (`--bg`).

Aktuelle Mockup-Produkte (Katalog `planet-brands.js`): **Calmin balance Tabletten** (Einzelprodukt), **Hepax forte** (Familie: Pulver + Tabletten), **Inzym Pulver** (Einzelprodukt).

**Collection-Sonderkacheln:** Beliebig viele `.tile.--featured`. Layouts: **ohne Media** · **stack + Bild** · **stack + Lottie** · **cover** (`.--cover`, `--tile-fg`). Auch auf List-Collections mischbar. Shopify: `layout` + `media_type` / `text_color`. Spec → E.3 + E.9 + D.4 · Live → Collection `https://inuvet-dev.myshopify.com/collections/all`, List-Collections `https://inuvet-dev.myshopify.com/collections`.

---

## Architektur

### Marken-Konvention (drei Schichten)

| Schicht | Datei | Rolle |
|---|---|---|
| **System** | `planet-brands.css` / `planet-brands.js` | Tokens (`:root` = Inuvet) + Komponenten + globale JS. Gleicher Basename im Theme. |
| **Haut** | `brand-{handle}.css` | Nur Tokens. Muster: `brand-planimol.css` (liegt bereits im Repo). |
| **Kühlschrank** | Store-Content | Logos, Lotties, Benefits — nicht umbenennen, nicht ins System mischen. |

### CSS-Schichten

| Datei | Zweck | Darf nicht enthalten |
|---|---|---|
| `planet-brands.css` | Design System — Tokens, Atome, Moleküle, Organismen | Styleguide-UI, Mockup-Chrome, Page-Spezifika |
| `brand-planimol.css` | Marken-Haut: `html[data-brand="planimol"]` überschreibt Schrift, Grün, FG, Borders, Produktfarben. Kein Rhythmus, keine Komponenten. | Alles außer Tokens |
| `sg.css` | Styleguide-eigene UI (`.sg-*` Präfix) | Echte Produkt-Komponenten |
| `mockup-ui.css` | Dev-UI Chrome (Mockup-Bar, FAB, Mockup-Modal) | Page-Content, `planet-brands.css`-Klassen wie `.btn` oder `.form-field` |
| `mockup-ui.js` | Mockup-Chrome-JS (Alt+M / ⌥M Toggle) | Produktions-/Theme-Code |
| `pages/[name].css` | Page-spezifische Overrides | Globale Design-System-Änderungen |
| `print.css` | Print-Dialekt: Token-Layer für druckfähige PDFs (mm-Geometrie, pt-Typo, Formate, Seitenmodell) | Web-Styles, CMYK-Werte (Farbe bleibt RGB), Guide-Chrome |
| `print-sg.css` | Doku-Chrome für `print-styleguide.html` (`.pg-*`) | Produktionscode |
| `temp.css` | Neue Styles im Test (Staging) | Produktions-Code — nie deployen |
| `temp.js` | Neue JS-Funktionen im Test (Staging) | Produktions-Code — nie deployen |

`print.css` wird **nie zusammen mit `planet-brands.css`** geladen — es restyled `body` für die Seitenvorschau. Print-Dokumente binden `print.css` allein ein.

`temp.css`-Inhalt: leer (Stand 2026-08-04).
`temp.js`-Inhalt: leer (Stand 2026-08-04).

### CSS-Workflow: Neue Styles

1. **Bestehende Klasse wiederverwenden** — `grep -n "…" planet-brands.css` vor jedem neuen Style
2. **Komposition** — Lassen sich zwei bestehende Atome kombinieren? → Kein neuer Style nötig
3. **temp.css** — Erst wenn wirklich etwas Neues gebraucht wird: in `temp.css` testen
4. **Entscheidung nach Abschluss** — gemeinsam: `planet-brands.css` (global) oder `pages/[name].css` (seitenspezifisch)

**Sonderfall Styleguide-UI:** Auch im Guide gilt: **zuerst bestehende `planet-brands.css`-Klassen wiederverwenden** — der Styleguide soll die echten Produkt-Styles zeigen, keine parallelen Doku-Varianten. Nur wenn es im Produkt-CSS wirklich keine passende Klasse gibt (echtes Doku-Chrome wie `.sg-*`, `.sg-demo`-Modifier, `.sg-logo-demo`), wird neuer Style angelegt — dann direkt in `sg.css`, ohne `temp.css`-Zwischenschritt. Faustregel: neues `sg.css` nur im Notfall.

### JS-Schichtung (analog zu CSS)

Globale Funktionen → `planet-brands.js` · Seitenspezifische Logik → `pages/xyz.js` · Kein Inline-Script.

**Theme-Portabilität:** Die Block-Banner in `planet-brands.js` sind mit `[PORTABEL → Theme]` bzw. `[MOCKUP — nicht portieren]` markiert. Portabel = reine UI-Helfer (Nav, Marquee, Accordion, Slider, Toast, Rollover). Mockup = Produktkatalog, Naturalrabatt-Tabellen und localStorage-Warenkorb — im Shopify-Theme werden Cart-Funktionen gegen die Cart AJAX API (`/cart/add.js`, `/cart/change.js`) neu implementiert, Naturalrabatt via Cart Transform / Shopify Function (→ Styleguide E.4/E.9 Shopify-Mapping).

**Ladereihenfolge (zwingend):**
```html
<script src="../planet-brands.js?v=2"></script>   <!-- zuerst: global -->
<script src="../temp.js"></script>          <!-- nur während Staging -->
<script src="xyz.js"></script>              <!-- dann: seitenspezifisch -->
```

**JS-Workflow: Neue Funktionen**

1. **Neue Funktion** → erst in `temp.js` als benannte Funktion implementieren
2. **Aufruf** → aus `planet-brands.js` oder `pages/xyz.js` per Funktionsname referenzieren
3. **Entscheidung nach Abschluss** → gemeinsam: `planet-brands.js` (global) oder `pages/xyz.js` (seitenspezifisch), danach aus `temp.js` löschen

**`planet-brands.js` — globale Funktionen:**

| Funktion | Zweck |
|---|---|
| `toggleMobile()` / `closeMobile()` | Burger-Menü (toggleMobile positioniert das Menü via `positionMobileMenu`) |
| `positionMobileMenu()` | Mobile-Menü-`top` an die aktuelle Nav-Unterkante setzen (Sticky- & Scroll-Away-Modus) |
| `initMarquees()` | Marquee-Animationen |
| `toggleAccordion(trigger)` | Akkordeon-Item umschalten |
| `initScrollAnimations()` | IntersectionObserver für `.--in-view` |
| `initArticleToc()` | Artikel-Inhaltsverzeichnis: Scrollspy markiert aktiven Abschnitt (`aria-current`) |
| `reinitSection()` | Theme-Editor: alle Init-Helfer erneut ausführen — hängt an `shopify:section:load` (nur `Shopify.designMode`) |
| `initSliders()` | Testimonial-Slider (Desktop: prev/next, Mobile: Mehr anzeigen) |
| `showMoreSlider(btn)` | Mobile: je 3 weitere Slides einblenden |
| `openCart()` / `closeCart()` | Warenkorb-Drawer |
| `renderCartDrawer()` | Warenkorb-Inhalt rendern |
| `addToCart()` / `updateCartBadge()` | Globaler Warenkorb (localStorage) |
| `showToast()` | Toast-Benachrichtigung |
| `calcFree()` / `formatHint()` | Naturalrabatt-Logik (Bundle & PDP) |
| `animalsIconsHTML()` / `pdpAnimalsHTML()` | Tierart-String → Icon-Markup (PDP, Kacheln) |
| `animalsLabelForProduct()` / `productTileAnimalsHTML()` | Tierart-Label aus Katalog · Kachel-HTML |
| `initProductTileAnimals()` | Statische `.tile.--product` anreichern (auch in `reinitSection`) |
| `pdpDailyCostIconHTML()` / `pdpFormIconFile()` | Tageskosten-Icon je Darreichungsform (Mask) |
| `initNavScrolled()` | `body.--nav-scrolled` bei scrollY > 0 |
| `initNavLogoToggle()` | Nav-Logo Theme-Setting `logo_variant` · Mockup-Bar-Demo |
| `initNavCountry()` | Länder-Umschalter in `.nav-right` |
| `getEffectivePdpGalleryMode()` / `applyPdpGalleryMode()` | PDP-Galerie effektiver Modus (Thumbs/Mosaic) |
| `initPdpGalleryToggle()` | [MOCKUP] Mockup-Bar Galerie-Toggle auf der Live-PDP |

**Seitenspezifische JS-Dateien:**

| Datei | Page |
|---|---|
| `pages/tierarzt-empfehlung.js` | Tierarzt-Empfehlung Mockup |
| `pages/tierarzt-empfehlung-anfrage-freigabe.js` | Freigabe-Portal |
| `pages/tierarzt-empfehlung-anfrage-mock.js` | Gemeinsame Demo-Daten Offene Anfragen ↔ Freigabe |
| `pages/tierarzt-empfehlung-offene-anfragen.js` | Posteingang offener Produktanfragen |
| `pages/provision-portal.js` | Provision-Portal |
| `pages/provision-portal-start.js` | Provision-Portal Startseite |
| `pages/provision-portal-vetalita.js` | Provision-Portal Vetalita |
| `pages/formular-reklamation.js` | Formular Reklamation |
| `pages/formular-nebenwirkungen-ta.js` | Formular Nebenwirkungen (Tierarzt) |
| `pages/formular-nebenwirkungen-tb.js` | Formular Nebenwirkungen (Tierbesitzer) |
| `pages/bundle.js` | Bundle-Builder (Persönliches Angebot) |
| `sg.js` | Styleguide |

---

## Token-System (`planet-brands.css` `:root`)

### Spacing
```css
--base: 1rem
--half-module: clamp(0.75rem, 0.5rem + 1.35vw, 1.5rem)
--module: clamp(1.5rem, 1rem + 2.7vw, 3rem)
--module-2xl: calc(var(--module) * 2)
--gutter: var(--module)
```

### Typografie
```css
--text-xs: clamp(0.75rem, 0.7rem + 0.15vw, 0.8125rem)
--text-sm: 0.875rem
--text-base: clamp(1rem, 0.95rem + 0.2vw, 1.0625rem)
--text-m: clamp(1.375rem, 1.15rem + 0.65vw, 1.625rem)
--text-l: clamp(1.625rem, 1.15rem + 1.6vw, 2.375rem)
--text-xl: clamp(2.125rem, 1.15rem + 3vw, 3.5rem)
--lh-base: 1.5  --lh-h3: 1.2  --lh-h2: 1.17  --lh-h1: 1.11
--font: "schnebel-sans-me", sans-serif
```

### Layout
```css
--announcement-height: calc(var(--module) * 0.67)
--nav-height: calc(var(--module) * 2.5)
--header-height: calc(var(--announcement-height) + var(--nav-height))
--container-pt: var(--module)   /* Legacy-Alias; Stack nutzt --section-gap */
--section-gap: var(--module)    /* Vertikalabstand Section-Stack (A.7) */
--container-max: 1536px
--form-page-max: 640px
```

### Section-Stack (Seiten-Abschnitte) — verbindlich

Vertikaler Abstand zwischen Shop-Sections (nicht Text-`.flow`):

1. **Default V1/V2:** `padding-top: var(--section-gap)` · `padding-bottom: 0` · kein vertikales `margin` am Stack-Root. Shopify-Schema: `pad_top` Default **immer `true`** (auch neue Instanzen per Editor/Prompt). Flush unter Header nur im Template-JSON.
2. **Ein/Aus V1/V2:** `--pt-0` (oben aus) · `--pb` (unten an, Wert = `--section-gap`). Keine freien Pixel.
3. **Gilt für** `.container` und `.section-type` (V1/V2).
4. **V3/V4 Vollbild:** kein Stack-Padding (Bild edge-to-edge). Optional `--mt` / `--mb` = `margin-*: var(--section-gap)` — Spalt zeigt Seitenfläche. Schema-Default **oben an**, unten aus. Bündig unter Header nur im Template-JSON.
5. **Shopify:** Neue Section (Editor + Prompt) startet immer mit Abstand oben. V1/V2 „Padding oben“ (`pad_top` Default `true`) · V3/V4 „Margin oben“ (`margin_top` Default `true`). Unten aus. Stories unter Nav: oben aus nur im Template, nicht als Schema-Default.
6. **Alias:** `.container.--flush-top` = `--pt-0`.

Doku → Styleguide A.7 „Section-Stack" (`styleguide.html#section-stack`).

### Z-Index
```css
--z-nav: 100  --z-overlay: 200  --z-drawer: 210  --z-modal: 220
```

### Animation
```css
--anim-fast: 0.2s ease  --anim-mid: 0.3s ease
--anim-base: 0.4s ease  --anim-slow: 0.6s ease
```

### Farben
```css
--green: #78b41b  --green-hover: #58990F  --green-light: #f0fae6
--fg: #2E2E2E  --fg-hover: #333  --fg-muted: #666  --bg: #fff
--border: #adadad  --border-light: #e0e0e0  --accent-bg: #f2f2f2
```

Semantische Aliasse (für neuen Code bevorzugen): `--color-action` / `--color-action-hover` / `--color-success` / `--color-link` (= Grün-Tokens) · Akzente: `--color-amber: #E8A020`, `--color-honey: #FFD700`, `--color-notice-bg: #FEFFDA` · Border-Semantik: `--border-focus`, `--border-active`.

15 Kategorie-Farben als `--cat-X` + `--cat-X-light`: beruhigung, leber, gelenke, immun, herz, magendarm, haut, atemwege, niere, blase, bauchspeichel, fettsaeuren, hormone, ohren, cbd.

---

## Container-Modifier

| Klasse | Breite | Verwendung |
|---|---|---|
| `.container` | 1536px | Standard, Listen, Übersichten |
| `.container.--narrow` | ≈ 720px | Lese-Content, Detail-Seiten |
| `.container.--sm` | ≈ 480px | Eingabe-Formulare |
| `.container.--pt-0` / `.--flush-top` | — | Kein Padding oben (Stack) |
| `.container.--pb` | — | Padding unten = `--section-gap` |

## Responsive Breakpoints (vereinheitlicht)

Gilt für `.col-grid`, `.tile-grid`, `.testimonial-grid`, `.testimonial-slider`:

| Viewport | `data-cols="4"` / `--cols-4` | `data-cols="3"` / `--cols-3` | `data-cols="2"` / `--cols-2` |
|---|---|---|---|
| ≥ 1100px | 4 Sp. | 3 Sp. | 2 Sp. |
| 900–1099px | 3 Sp. | 2 Sp. | 1 Sp. (`data-cols="2"`) / 2 Sp. (`--cols-2`) |
| 768–899px | 2 Sp. | 2 Sp. | 1 Sp. / 2 Sp. |
| < 768px | 2 Sp. (`--cols-4` Benefit/Icon) · 1 Sp. (`.collection-main` Produkte, `--cols-2/3`, `.col-grid`) | 1 Sp. | 1 Sp. |

Modifier: `.col-grid.--early-2` → 50/50 ab 768px (Intro-Paare). `.col-grid.--wide-narrow` → 2fr/1fr ab 768px (Bundle-Sidebar). `.hero-split` bleibt seiten-spezifisch.

Footer: Newsletter-Zeile über `.footer-cols`, optionale `.footer-row` darunter. Zonen mit gestrichelter Linie (Desktop + Mobil). Spalten-Raster bei 1535px → 2-spaltig, unter 768px 1-spaltig.

---

## Komponenten & Patterns

### Floating Label (Form Field)
```html
<div class="form-field">
  <input placeholder=" " id="x">
  <label for="x">Label</label>
</div>
```
`placeholder=" "` (Leerzeichen) triggert `:not(:placeholder-shown)`. Modifier: `.--on-green`, `.--error`, `.--success`.

**Formular-Hintergrund (Pflicht):** Formulare dürfen **nur** auf **Weiß** (`--bg`) oder **Grün** (`--green-light`) platziert werden. Auf grünen Flächen Container-Klasse `.--on-green` setzen — sie überschreibt `--field-bg` / `--field-bg-active` automatisch. **Keine weiteren Flächenfarben** (Honey, Grau, Cards …): Floating-Label-Hintergrund muss exakt zum Container passen; andere Farben brechen die Feldlinie optisch und technisch. Styleguide-Demos: `.sg-demo.--white` (Standard) bzw. `.sg-demo.--green` (`.--on-green`-Demo).

### Tile / Produktkachel
- `.tile-grid.--cols-2/3/4` für Grid-Layouts — **pro Seite wählen**: `--cols-3` (3→2→1) · `--cols-4` (4→3→2→2 Benefit/Icon · in `.collection-main` →1 mobil, Produkte nie 2-spaltig)
- **Shop-Collection (Shopify):** Section-Settings: `show_filters` (Default an) steuert Filter **und** Spalten: an → Sidebar + Mobil-`.collection-filter-toggle` + `--cols-3` · aus → `.--no-sidebar` + `--cols-4`. `show_toolbar` (Default an) → `.collection-toolbar` (Anzahl + Sortierung) — **unabhängig** vom Filter-Toggle. `show_title` / `show_description` (Default aus). Kein Breadcrumb. 0 Treffer → `.empty-state` (C.8). Spec → E.3.
- **Preis immer mit „ab"** in der Übersicht: `<span>ab 39,90 €</span>`
- `.cart-item__variant`: `60 Stück · 39,90 €` — immer diese Klasse, nie eigene

### Card-Patterns (4 verschiedene, bewusst getrennt)
| Klasse | Verwendung |
|---|---|
| `.tile.--product` | Produkt-Übersicht im Grid |
| `.cart-item` | Produktzeile (Warenkorb, Suche, Checkout, Bundle) |
| `.summary-card` | Highlighted Action Card auf grünem BG (Bundle) |
| `.approval-product-card` | Freigabe-Card mit Varianten-Zeilen (Tierarzt-Empfehlung) · page-spezifisch |

Page-spezifische Card-Patterns (`summary-card`, `approval-product-card`) bleiben in ihrer Seiten-Doku — kein generisches `.card`-Atom.

### Section-Label Modifier
- `.section-label` — Top-Level (h2), `--border`
- `.section-label-row` — optional: Label **oder Headline** (`.--headline` + `h2`) links + Ghost-CTA rechts (`.btn.--ghost.--sm`); Border/Spacing am Wrapper · **Headline ist in den meisten Fällen die bevorzugte Option** (`heading_style: headline`); Section-Label wenn die Zeile in ein Label-getriebenes Section-Raster passt · Spec → Styleguide A.12 · PDP-Empfehlungen → E.2 · Shopify: `heading_style`, `heading_body`, `show_view_all`, `view_all_label`, `view_all_link`
- `.section-header` — Wrapper für Label/Headline-Zeile + optionalen Absatz (`.section-header__body`, `.flow`) · Shopify-Snippet `section-heading`
- `.section-label.--sub` — Sub-Sektion (h3), `--border-light` — **nur Produktion** (Formular-/Checkout-Sub-Sektionen, unter einem `form-page__title`/h1)
- **Styleguide-Doku:** Gruppen-Überschriften im Guide nutzen `.sg-h3` (gemischte Schreibweise, fett, ohne Linie) — **nicht** `.section-label --sub`. Grund: neben der Sektions-`.section-label` (klein, Uppercase, mit Linie) würde `--sub` zu ähnlich aussehen; `.sg-h3` hebt sich klar als untergeordnete Inhalts-Überschrift ab.

### Spacing: H→p→Button-Stacks
Überall wo Headline + Fließtext + CTA gestapelt: **via `.flow`** (nicht Ad-hoc-Margins). Headline → Body: `--half-module` · Body → CTA: `calc(var(--half-module) * 1.5)` über `* + .btn` / `* + .btn-row` / `* + .section-type--v4__cta`. Shop/Theme: CTAs in `.btn-row` (auch bei einem Button); Hero V4 nutzt `.section-type--v4__cta`. Nie `.btn-row` in die Formular-Flow-Gruppe ziehen (überschreibt sonst den CTA-Abstand).

### Header-Verhalten: Announcement Bar Scroll-Away
Standard: Announcement Bar **scrollt weg** (nicht sticky), nur die Nav bleibt sticky (`top: 0`). `scroll-padding-top` = `--nav-height`. Opt-in für Sticky-Bar: Klasse `--ann-sticky` auf `<body>` — Bar und Nav bleiben oben, Nav sitzt unter der Bar (`top: var(--announcement-height)`), `scroll-padding-top` = `--header-height`. Styleguide D.1: Toggle „Sticky Header aktivieren“. Shopify: `.announcement-bar.--scroll-away` am Section-Wrapper (entspricht Default). Das Mobile-Menü-`top` wird in beiden Modi von `positionMobileMenu()` (in `toggleMobile()`) dynamisch an die Nav-Unterkante gesetzt — beim Öffnen ist der Scroll via `body{overflow:hidden}` gesperrt, daher stabil.

---

## Formular-Patterns & Spacing-Regeln

| Situation | Regel |
|---|---|
| Felder im normalen Fluss | Nichts tun — `.form-field` hat `margin-bottom: var(--half-module)` eingebaut |
| Felder in Flex-Container | `gap: 0` auf dem Container — sonst Doppelabstand |
| Felder im `form-grid` | Nichts tun — Grid trägt den Abstand via `gap` |
| Button nach letztem Feld | Direkt setzen — Abstand kommt vom vorherigen `.form-field` |

**Mehrspalten:**
```html
<div class="form-grid">
  <div class="form-field">…</div>
  <div class="form-field --full">…</div>   <!-- volle Breite -->
</div>
```

**Section-Trenner — einzig korrekte Lösung:**
```html
<h3 class="section-label --sub">Abschnittsname</h3>
```
Kein `<hr>`, `.option-divider` für Trennungen zwischen gleichwertigen Optionen (z. B. „oder").

**Zustände:** `.form-field.--error` → roter Border + `.form-field__error` · Feld und Label-Hintergrund auf `--field-bg-active` (weiß), damit Floating Label zur Feldlinie passt. `.form-field.--success` → grüner Border + `.form-field__success`.

**Hintergrundfarbe — nur Weiß oder Grün:**
| Kontext | Hintergrund | Setup |
|---|---|---|
| Standard | `var(--bg)` (weiß) | nichts tun — Defaults passen |
| Grüne Fläche | `var(--green-light)` | `.--on-green` am Formular-Container |

Zwei Tokens steuern den Floating-Label-Hintergrund (nur relevant auf Grün; auf Weiß = Defaults):
| Token | Default | Beschreibung |
|---|---|---|
| `--field-bg` | `var(--green-light)` | Hintergrund im leeren/unfokussierten Zustand |
| `--field-bg-active` | `var(--bg)` | Hintergrund im fokussierten / ausgefüllten Zustand |

**Nicht zulässig:** Formularbereiche auf Honey, Grau, Card-Hintergründen o. Ä. — stattdessen weiße oder grüne Sektion wählen.

---

## Sektions-Schema

A Foundations · B Atome · C Moleküle · D Organismen · E Seiten-Vorlagen — dezimal nummeriert (A.1, B.3 …). Neue Komponente = nächste Nummer ohne Suffixe.

### Klassen-Schnellreferenz

#### B — Atome
| Sek. | Komponente | Klasse(n) | Modifier |
|---|---|---|---|
| B.1 | Button | `.btn` | `--primary --secondary --ghost --back --sm --full --with-icon --icon --success --danger --honey --loading` · Icon-only: `--icon` schlicht · Fläche: `--icon.--success/--danger/--primary/--secondary` (Touch `--icon-box-sm`) · klein: `--icon.--sm` (Quadrat `calc(--base * 2)`) · Kombi `--full.--with-icon` zentriert Icon+Text via `justify-content` |
| B.2 | Badge / Label | `.badge` | `--dark --sale --pill --free --info --honey --muted --error --count`; `[data-cat]` · Status-Pills: `.--pill` („freigegeben", mit `check`-Icon) / `.--pill.--honey` („Freigabe benötigt") · Icon im Badge global (Größe + Gap eingebaut) |
| B.3 | Icon-Box | `.icon-box` | — |
| B.4 | Formularfeld | `.form-field` | `--sm --full`; `.form-grid`, `.form-check`, `.actionable-input` |
| B.4 | Auswahlbox (Demo in B.4) | `.choice-box` | `--sm --block --detail` · `[disabled]`/`--disabled` = ausverkauft (durchgestrichen, muted) · Auswahl: `--border-active` + `--green-light` (kein grüner Border)
| B.5 | Stand-Alone-Formular | `.form-page` | — |
| B.6 | Check-List | `.check-list` | — |

#### C — Moleküle
| Sek. | Komponente | Klasse(n) | Modifier |
|---|---|---|---|
| C.1 | Produktkarte | `.tile.--product` | `--featured`; `.tile__animals` · `.tile__cart` (Desktop Glass) · `.tile__cart-icon` (Mobile Glass) · in `.tile-grid.--cols-2/3/4` |
| C.2 | Cart Item | `.cart-item` | `.product-thumb` / `.product-thumb-wrap` · `.cart-item__variant` · `.cart-item__counter` · `.cart-item__tier-hint`
| C.5 | Tabs & Akkordeon | `.tabs .tab-panel .accordion` | — |
| C.6 | Pagination & Breadcrumb | `.pagination` · `.breadcrumb` | `.--current` |
| C.7 | Notice / Infobox | `.notice` | — |
| C.8 | Empty / Success | `.empty-state` `.success-state` | — |
| C.9 | Toast | `.toast` | `--success --error --info --out` |
| C.10 | Modal | `.modal .modal-overlay` | `--open` · Elemente: `.modal__header / __title / __body / __footer` |

#### D — Organismen
| Sek. | Komponente | Klasse(n) | Modifier |
|---|---|---|---|
| D.1 | Navigation | `.site-nav .announcement-bar .nav-logo` | Frosted Glass · `body.--nav-scrolled` · Logo-Setting `body[data-nav-logo="campus"]` · Aktiv-Zustand via `aria-current="page"` · Zähler-Badge `[data-nav-open-count]` · Utility: `.nav-item.--end` Land + Account-Icon in `.nav-right` |
| D.2 | Footer | `.site-footer` | `.footer-bar__top` („Nach oben“) · `.footer-payment` |
| D.3 | Hero-Sections | `.section-type` | `--v1 --v2 --v3 --v4 --reverse --viewport` · **V1:** Bild/Lottie · **V2:** Bild oder Lottie + Content-Box · **V3:** Vollbild + Box (Bild oder Lottie, Cover) · **V4:** Text auf Medium (Bild oder Lottie, Cover) · `--content-top|--content-center|--content-bottom` · V3/V4 `--mt`/`--mb` (`margin_top` Default an) · Badges nur V1/V2 · Shopify: `Hero V1`–`V4`, Snippet `section-type-media` |
| D.4 | Kachel-Raster | `.tile-grid` | `--cols-2/3/4` · Kacheln: `--featured` (grün, optional Lottie), `--product` |
| D.5 | Testimonials | `.testimonial-grid .testimonial-slider` | — |
| D.6 | Marquee | `.marquee` | — |
| D.7 | Newsletter | `.newsletter` | — |
| D.9 | Story Iconslider | `.story-iconslider` | `__track` · `__item` · `__media` · `__label` · `--flush` · `--new` |

#### E — Seiten-Vorlagen
| Sek. | Komponente | Klasse(n) |
|---|---|---|
| E.2 | PDP | `.pdp`, `.pdp__accordion`, `.nr-widget`, `.social-proof`, `.pdp__benefits`, `.ingredient-list`, `.pdp__faq`, `.pdp__testimonials` (Brand-only), `.pdp__recommendations`, `.pdp__praxis` · Reihenfolge: Kaufblock → Benefits → Inhaltsstoffe → FAQ → Testimonials → Empfehlungen → Praxis |
| E.3 | Collection | `.collection-layout` · `.collection-sidebar` · `.collection-filter-toggle` · `.collection-toolbar` · Modifier `.--no-sidebar` (Filter optional) |
| E.4 | Cart-Drawer | `.cart-drawer .cart-overlay` |
| E.5 | Checkout | `.checkout .summary-line .summary-total` |
| E.6 | Account-Seiten | `.order-item` · Formulare `.form-field` / `.tab-nav` |
| E.7 | Suche | `.search-overlay .search-panel` |
| E.8 | Blog & Artikel | `.blog-card` · `.article-layout` · `.article-toc` (Sidebar-Inhaltsverzeichnis, Desktop) · `.rte` |
| E.9 | Utility-Seiten (Shopify) | Spec · List-Collections Live → `https://inuvet-dev.myshopify.com/collections` |

#### Globale Helfer
| Klasse | Modifier | Zweck |
|---|---|---|
| `.container` | `--narrow --sm --flush-top` | Container mit max-width + padding |
| `.section-label` | `--sub` | Abschnittsüberschrift · Spec A.12 |
| `.section-label-row` | `--headline` | Headline (empfohlener Default) oder Label + optional View-all (`.btn.--ghost.--sm`) · Shopify `heading_style`, `heading_body`, `show_view_all` |
| `.section-header` | `.flow` | Optionaler Absatz unter Überschrift (`.section-header__body`) · Snippet `section-heading` |
| `.page-header` | — | Seitenkopf für Portal-/Listen-Seiten: H1 + optionaler Zähler (`.circle-badge.--num`), Abstand `--module` zum Inhalt |
| `.label-caps` | — | Inline Caps-Beschriftung |
| `.qty-selector` | `--sm` | Mengenauswahl |
| `.price-stack` | — | Preis + `--old` (Streichpreis) + `__unit` für Grundpreis (PAngV, „(0,30 € / g)") und Steuerhinweis („Exkl. USt.") — beide auf der Preis-Grundlinie |
| `.breadcrumb` | — | Pfad-Navigation (`__item`), Doku in C.6 |
| `.skip-link` / `.visually-hidden` | — | A11y: erster Fokus-Stopp zu `#MainContent` / Screenreader-only-Text |
| `.placeholder-bg` | — | Platzhalter für Produktbilder ohne Foto |
| `.col-grid` | `[data-cols="1/2/3/4"]` `--spaced` `--early-2` `--wide-narrow` | Spaltenraster (in `planet-brands.css`). Standard-Gap: `var(--base) var(--gutter)`. Breakpoints: 1100 / 900 / 768 px — analog `.tile-grid`. |
| `.rte.--data-table` | `--mobile-grid` · `table.--normal / --spacious` | Daten-Listen für Portal-/Übersichtstabellen (A.4). Zellen brauchen `data-label` für Mobile · Portal-Stack: Name+Datum zweispaltig · Notiz: `.data-table-note` · Aktions-Spalte: `.data-table-actions` mit `.btn.--icon.--sm` oder `.order-item__link` |
| `.flow` | — | Kontextsensitives Typografie-Spacing. Wird auf `.section-type__content` gesetzt. Regeln: `* + *` → `--base`, `h1/h2 + *` → `--half-module`, `* + .btn / * + .btn-row / * + .section-type--v4__cta` → `calc(--half-module * 1.5)`. Headline→Body in section-type via separatem Override (`--half-module`, Spez. 0,4,0). |

---

## Pages aktiv

| Page | CSS | JS | Zweck |
|---|---|---|---|
| `index.html` | `index.css` | `planet-brands.js`, `index.js` | Mockup-Übersicht (GitHub-Pages-Einstieg, DE\|EN) — **Pflicht aktualisieren** bei neuen/umbenannten zentralen Mockups (Goldene Regel 17) |
| `print-styleguide.html` | `sg.css`, `print-sg.css` | — | **Print- & PDF-Guide**: Formate, Seitenraster, Logo-Position, pt-Typo, CMYK, Pipeline. Sektionen P (Grundlagen) · Q (Dokumentarten) · R (Produktion) |
| `pages/Tierarzt-Empfehlung.html` | `tierarzt-empfehlung.css` | `tierarzt-empfehlung.js` | Hauptmockup, Freigabe-Flow |
| `pages/Tierarzt-Empfehlung-Info.html` | — | — | Technische Doku Rezeptanfrage-System |
| `pages/Tierarzt-Empfehlung-Anfrage-Freigabe.html` | `tierarzt-empfehlung-anfrage-freigabe.css` | `tierarzt-empfehlung-anfrage-mock.js`, `tierarzt-empfehlung-anfrage-freigabe.js` | Vet-Portal, Empfehlungsfreigabe |
| `pages/Tierarzt-Empfehlung-Offene-Anfragen.html` | — | `tierarzt-empfehlung-anfrage-mock.js`, `tierarzt-empfehlung-offene-anfragen.js` | Vet-Portal, Posteingang offener Produktanfragen |
| `pages/Tierarzt-Empfehlung-Eingeloeste-Empfehlungen.html` | — | `tierarzt-empfehlung-anfrage-mock.js`, `tierarzt-empfehlung-eingeloeste-empfehlungen.js` | Vet-Portal, Historie freigegebener Empfehlungen |
| `pages/Tierarzt-Empfehlung-Programm.html` | — | `tierarzt-empfehlung-anfrage-mock.js` | Vet-Portal, Artikel „So funktioniert's" |
| `pages/Bundle.html` | `bundle.css` | `bundle.js` | Bundle-Builder mit Naturalrabatt |
| `pages/Bundle-Info.html` | — | — | Konzept-Artikel Bundle |
| `pages/Signature-Generator.html` | `signature-generator.css` | `signature-generator.js` | E-Mail-Signatur-Generator |
| `pages/Email-Template-Generator.html` | `email-template-generator.css` | `email-template-generator.js` | System-E-Mail-Vorlagen (SAP, Shopify, Gmail …) |
| `pages/Formular-Reklamation.html` | — | `formular-reklamation.js` | Stand-Alone-Formular |
| `pages/Formular-Nebenwirkungen-TB.html` | — | `formular-nebenwirkungen-tb.js` | Meldeformular Tierbesitzer |
| `pages/Formular-Nebenwirkungen-TA.html` | — | `formular-nebenwirkungen-ta.js` | Meldeformular Tierarztpraxis |
| `pages/Produkt-Modell.html` | — | — | Artikel: Indikation → Variante |
| `pages/Provision-Portal-Start.html` | `provision-portal.css` | `provision-portal-start.js` | Provision-Portal Startseite |
| `pages/Provision-Portal.html` | `provision-portal.css` | `provision-portal.js` | Tierarzt löst Provisionen ein |
| `pages/Provision-Portal-Info.html` | — | — | Technische Doku Provision-Portal |
| `pages/_template.html` | — | — | Produktions-Skelett für neue Pages (kein `mockup-ui.css`) · spiegelt E.1 Page-Skeleton |

---

## Tabu-Bereiche

| Pfad | Grund |
|---|---|
| `pages/vetalita/` | Nicht anfassen — kein Lesen, kein Schreiben, kein Refactoring |

---

## Audit-Verhalten

Wenn der User **„analysiere das Projekt auf Inkonsistenzen"** sagt:
- `find . -name "*.html"` — ALLE HTML-Dateien, nicht nur `pages/`
- CSS-Schichten alle prüfen: `planet-brands.css`, `sg.css`, `mockup-ui.css`, `pages/*.css`

---

## Technische Konventionen

**Preview-Server:** `python3 -m http.server 3456` aus `~/code/Inuvet-Styleguide/`

**Safari — lokale Dateien:** Safari blockiert standardmäßig `../`-Pfade bei `file://`-URLs. Fix: Safari → Einstellungen → Erweitert → „Funktionen für Webentwickler aktivieren" → Menü „Entwickler" → „Lokale Dateieinschränkungen deaktivieren". Einmalig, bleibt gesetzt.

**Git / Deploy:** GitHub Pages-Quelle = Branch `main`, Pfad `/`. Feature-Branches (`feat/*`, `session/*`) sind **nicht** live. Push-Ziel für alles Sichtbare: `origin main`.

**Print-PDF-Pipeline:** `tools/print/` — Einrichtung `pip3 install -r tools/print/requirements.txt` + `python3 -m playwright install chromium`. Reihenfolge: `fonts.py` (Schrift subsetten + Base64 + Zeilenhöhe messen) → `build.py` (HTML→PDF) → `cmyk.py` (RGB→CMYK) → `measure.py` (nachmessen, `--png` für Sichtprüfung). **Ausstehend:** verbindliche CMYK-Werte für 6 Farben und die `schnebel-sans-me`-Schriftdateien — bis dahin brechen `cmyk.py` und `build.py` bewusst ab. Details: `print-styleguide.html` §R.4.

**Commit-Format:** `feat:` / `fix:` / `refactor:` / `docs:`

**Bildpfade:** Packshots u. a. `Calmin_`, `Hepax_`, `Cortisan_`, `Dermin_`, `Diabex_`, `EnteroGast_` unter `assets/images/` — fehlende Produkte: `placeholder-bg` bzw. Fallback-Packshot.

**CSS Cache-Busting:** `planet-brands.css?v=N` — N hochzählen nach Änderungen.

---

## Pflege

Diese Datei bei Änderungen an: Goldenen Regeln · Token-Familien · Pages · Architektur-Entscheidungen. `CONTEXT.md` existiert nicht mehr.
