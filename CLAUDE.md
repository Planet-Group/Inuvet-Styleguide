# Inuvet Styleguide — Claude Code

---

## Erstkontakt-Checkliste

1. Sprache: **Deutsch** (Doku, Commits, Kommentare, Antworten)
2. Globale JS-Datei: `inuvet.js` — wird in alle Pages eingebunden (analog zu `inuvet.css`). Seitenspezifische Logik → `pages/xyz.js`. Kein Inline-Script. → Details unter „JS-Schichtung".
3. **Nach Rate-Limit-Abbruch:** Vorherigen Chat wiederherstellen mit `mcp__ccd_session_mgmt__list_sessions` → neuesten Session-Titel „New session" oder ähnlich suchen → `mcp__ccd_session_mgmt__search_session_transcripts` mit Stichworten aus dem letzten Task. Alternativ: `git log --oneline -5` zeigt was zuletzt committet wurde.

---

## Goldene Regeln (nie brechen)

1. **Bestehende Klassen zuerst** — vor jeder neuen Klasse: `grep` in `inuvet.css`. Existiert die Funktion schon? → Wiederverwenden.
2. **Neue Styles immer zuerst in temp.css** — Erst wenn ein Element abgeschlossen ist, entscheiden wir gemeinsam: → `inuvet.css` (global) oder → Page-CSS (seitenspezifisch). Nie direkt in `inuvet.css` oder eine Page-CSS schreiben ohne vorherigen Test in `temp.css`.
3. **Keine Magic Numbers** — alles via `var(--…)`.
4. **`border-radius: 0`** — Ausnahmen nur: `.badge.--pill` und Avatar (`50%`).
5. **Kein `!important`**. Niemals.
6. **Kein `text-align: center`** für Inhalte — nur funktional (Button-Text, Qty-Input, Empty/Success-State).
7. **BEM-Modifier mit Doppel-Bindestrich**: `.btn.--primary`, `.--active`, `.--open`.
8. **Linien sparsam** — Whitespace trennt. `border-top` für Trennzwecke ist Code-Smell.
9. **Neue Komponente = Styleguide + Index** — Jede neue globale Komponente: (1) Demo-Abschnitt in `styleguide.html`, (2) Zeile in der Klassen-Schnellreferenz unten. Beides zusammen, nie nur eines.
10. **Neues CSS? Erst fragen** — Bevor neues CSS angelegt wird: kurz mitteilen, was fehlt und warum keine bestehende Klasse passt — und Bestätigung abwarten.
11. **Einzelprodukt oder Produktfamilie? Erst fragen** — Wenn nicht eindeutig klar: immer nachfragen, bevor Namen, Darstellung oder Struktur festgelegt werden.
12. **Mockup-UI strikt isoliert** — Alle Styles für Mockup-Steuerelemente kommen ausschließlich aus `mockup-ui.css`. Keine `inuvet.css`-Klassen innerhalb von `.mockup-fab-panel`, `.mockup-bar` oder `.mockup-modal`.
13. **JS analog zu CSS schichten** — Globale Funktionen in `inuvet.js`, seitenspezifische Logik in `pages/xyz.js`. Kein Inline-Script.

---

## Produkt-Modell

| Begriff | Definition | Beispiel |
|---|---|---|
| **Indikation** | Krankheitsbild, gibt dem Produkt seinen Namen | Durchfall → „EnteroGast" |
| **Produkt** | Konkrete Darreichungsform einer Indikation | „EnteroGast Tabletten", „EnteroGast Pulver" |
| **Variante** | Unterschiedliche Füllmengen desselben Produkts | EnteroGast Tabletten in 21 / 90 Stk. |
| **Produktfamilie** | Alle Produkte mit derselben Indikation | Familie „EnteroGast" = Tabletten + Pulver |

**Anzeige-Regel (kontextabhängig):**

| Kontext | Anzeige |
|---|---|
| Tiles, Collection, Suche | `Calmin balance`, `Hepax forte` |
| Cart, Checkout, Bestellübersicht, Freigabe | `Calmin balance Tabletten`, `Hepax forte Tabletten` |
| Einzelprodukte (immer mit Darreichungsform) | `Inzym Pulver` |

In Cart/Checkout: Varianten-Zeile — **immer `.cart-item__variant`** (xs, muted), Format: `60 Stück · 39,90 €`. Button statt `qty-selector` → `.btn.--sm` in `.cart-item__bottom` (Demo 5 in C.2).

Aktuelle Mockup-Produkte: **Calmin balance** (Familie: Tabletten + Pulver), **Hepax forte** (Familie: Tabletten + Pulver), **Inzym Pulver** (Einzelprodukt).

---

## Architektur

### CSS-Schichten

| Datei | Zweck | Darf nicht enthalten |
|---|---|---|
| `inuvet.css` | Design System — Tokens, Atome, Moleküle, Organismen | Styleguide-UI, Mockup-Chrome, Page-Spezifika |
| `sg.css` | Styleguide-eigene UI (`.sg-*` Präfix) | Echte Produkt-Komponenten |
| `mockup-ui.css` | Dev-UI Chrome (Mockup-Bar, FAB, Mockup-Modal) | Page-Content, `inuvet.css`-Klassen wie `.btn` oder `.form-field` |
| `pages/[name].css` | Page-spezifische Overrides | Globale Design-System-Änderungen |
| `temp.css` | Neue Styles im Test (Staging) | Produktions-Code — nie deployen |
| `temp.js` | Neue JS-Funktionen im Test (Staging) | Produktions-Code — nie deployen |

`temp.css`-Inhalt: leer (Stand 2026-06-07).
`temp.js`-Inhalt: leer (Stand 2026-06-07).

### CSS-Workflow: Neue Styles

1. **Bestehende Klasse wiederverwenden** — `grep -n "…" inuvet.css` vor jedem neuen Style
2. **Komposition** — Lassen sich zwei bestehende Atome kombinieren? → Kein neuer Style nötig
3. **temp.css** — Erst wenn wirklich etwas Neues gebraucht wird: in `temp.css` testen
4. **Entscheidung nach Abschluss** — gemeinsam: `inuvet.css` (global) oder `pages/[name].css` (seitenspezifisch)

### JS-Schichtung (analog zu CSS)

Globale Funktionen → `inuvet.js` · Seitenspezifische Logik → `pages/xyz.js` · Kein Inline-Script.

**Ladereihenfolge (zwingend):**
```html
<script src="../inuvet.js?v=2"></script>   <!-- zuerst: global -->
<script src="../temp.js"></script>          <!-- nur während Staging -->
<script src="xyz.js"></script>              <!-- dann: seitenspezifisch -->
```

**JS-Workflow: Neue Funktionen**

1. **Neue Funktion** → erst in `temp.js` als benannte Funktion implementieren
2. **Aufruf** → aus `inuvet.js` oder `pages/xyz.js` per Funktionsname referenzieren
3. **Entscheidung nach Abschluss** → gemeinsam: `inuvet.js` (global) oder `pages/xyz.js` (seitenspezifisch), danach aus `temp.js` löschen

**`inuvet.js` — globale Funktionen:**

| Funktion | Zweck |
|---|---|
| `toggleMobile()` / `closeMobile()` | Burger-Menü (toggleMobile positioniert das Menü via `positionMobileMenu`) |
| `positionMobileMenu()` | Mobile-Menü-`top` an die aktuelle Nav-Unterkante setzen (Sticky- & Scroll-Away-Modus) |
| `initMarquees()` | Marquee-Animationen |
| `toggleAccordion(trigger)` | Akkordeon-Item umschalten |
| `initScrollAnimations()` | IntersectionObserver für `.--in-view` |
| `initSliders()` | Testimonial-Slider (Desktop: prev/next, Mobile: Mehr anzeigen) |
| `showMoreSlider(btn)` | Mobile: je 3 weitere Slides einblenden |

**Seitenspezifische JS-Dateien:**

| Datei | Page |
|---|---|
| `pages/tierarzt-empfehlung.js` | Tierarzt-Empfehlung Mockup |
| `pages/tierarzt-empfehlung-freigabe.js` | Freigabe-Portal |
| `pages/provision-portal.js` | Provisions-Portal |
| `pages/provision-portal-start.js` | Provisions-Portal Startseite |
| `pages/provision-portal-vetalita.js` | Provisions-Portal Vetalita |
| `pages/formular-reklamation.js` | Formular Reklamation |
| `pages/formular-nebenwirkungen-ta.js` | Formular Nebenwirkungen (Tierarzt) |
| `pages/formular-nebenwirkungen-tb.js` | Formular Nebenwirkungen (Tierbesitzer) |
| `sg.js` | Styleguide |

---

## Token-System (`inuvet.css` `:root`)

### Spacing
```css
--base: 1rem
--half-module: clamp(0.75rem, 0.5rem + 1.35vw, 1.5rem)
--module: clamp(1.5rem, 1rem + 2.7vw, 3rem)
--module-2xl: calc(var(--module) * 2)
--module-3xl: calc(var(--module) * 3)
--gutter: var(--module)
```

### Typografie
```css
--text-xs: 0.667rem
--text-sm: 0.8rem
--text-base: clamp(0.875rem, 0.8rem + 0.3vw, 1rem)
--text-m: clamp(1.25rem, 1rem + 0.7vw, 1.5rem)
--text-l: clamp(1.5rem, 1rem + 1.7vw, 2.25rem)
--text-xl: clamp(2rem, 1rem + 3.2vw, 3.375rem)
--lh-base: 1.5  --lh-h3: 1.2  --lh-h2: 1.17  --lh-h1: 1.11
--font: "schnebel-sans-me", sans-serif
```

### Layout
```css
--header-height: calc(var(--module) * 3.5)
--page-pt: var(--module)
--container-max: 1536px
```

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
--fg: #000  --fg-muted: #666  --bg: #fff
--border: #cccccc  --border-light: #e0e0e0  --accent-bg: #f2f2f2
```

14 Kategorie-Farben als `--cat-X` + `--cat-X-light`: beruhigung, leber, gelenke, immun, herz, magendarm, haut-fell, atemwege, niere, krebs, augen, alter, bewegung, cbd.

---

## Container-Modifier

| Klasse | Breite | Verwendung |
|---|---|---|
| `.page` | 1536px | Standard, Listen, Übersichten |
| `.page.--narrow` | ≈ 720px | Lese-Content, Detail-Seiten |
| `.page.--form` | ≈ 480px | Eingabe-Formulare |
| `.page.--no-pt` | — | Hebt `--page-pt` auf |

## Responsive Breakpoints (vereinheitlicht)

Gilt für `.tile-grid`, `.testimonial-grid`, `.testimonial-slider`:

| Viewport | 4-spaltig | 3-spaltig | 2-spaltig |
|---|---|---|---|
| ≥ 1100px | 4 Sp. | 3 Sp. | 2 Sp. |
| 900–1099px | 3 Sp. | 2 Sp. | 2 Sp. |
| 768–899px | 2 Sp. | 2 Sp. | 2 Sp. |
| < 768px | 1 Sp. | 1 Sp. | 1 Sp. |

Footer (`.footer-main`) bleibt bei eigenem Breakpoint 1535px → 2-spaltig.

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

### Tile / Produktkachel
- `.tile-grid.--cols-2/3/4` für Grid-Layouts
- **Preis immer mit „ab"** in der Übersicht: `<span>ab 39,90 €</span>`
- `.cart-item__variant`: `60 Stück · 39,90 €` — immer diese Klasse, nie eigene

### Card-Patterns (4 verschiedene, bewusst getrennt)
| Klasse | Verwendung |
|---|---|
| `.tile.--product` | Produkt-Übersicht im Grid |
| `.cart-item` | Reihe im Cart-Drawer |
| `.summary-card` | Highlighted Action Card (grüner BG) |
| `.rec-card` | Compact Product Tile (horizontaler Scroll) |

### Section-Label Modifier
- `.section-label` — Top-Level (h2), `--border`
- `.section-label.--sub` — Sub-Sektion (h3), `--border-light`

### Spacing: H→p→Button-Stacks
Überall wo Headline + Fließtext + CTA gestapelt: je `margin-bottom: var(--half-module)`. In `section-type__headline/body` genauso wie in seitenspezifischen Teasern (D.3).

### Header-Verhalten: Announcement Bar Scroll-Away
Standard: Announcement Bar **und** Nav bleiben sticky. Optional via Klasse `--ann-scroll` auf `<body>`: Die Bar läuft im Fluss mit (scrollt weg), nur die Nav pinnt oben (`top: 0`). `scroll-padding-top` reduziert sich dann auf `--nav-height`. Das Mobile-Menü-`top` wird in beiden Modi von `positionMobileMenu()` (in `toggleMobile()`) dynamisch an die Nav-Unterkante gesetzt — beim Öffnen ist der Scroll via `body{overflow:hidden}` gesperrt, daher stabil.

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
Kein `<hr>`, kein `.login-divider` (nur für „oder"-Trennungen).

**Zustände:** `.form-field.--error` → roter Border + `.form-field__error`; `.form-field.--success` → grüner Border + `.form-field__success`.

**Hintergrundfarbe:** Inputs erben den Kontext-Hintergrund über zwei Tokens:
| Token | Default | Beschreibung |
|---|---|---|
| `--field-bg` | `var(--green-light)` | Hintergrund im leeren/unfokussierten Zustand |
| `--field-bg-active` | `var(--bg)` | Hintergrund im fokussierten / ausgefüllten Zustand |

Faustregel: **Inputs brauchen immer die Farbe des Hintergrunds, auf dem sie platziert sind.** Bei farbigem Kontext (z.B. Honey-Section) beide Tokens im Elternelement überschreiben:
```css
.mein-kontext {
  --field-bg: var(--color-honey);
  --field-bg-active: var(--color-honey);
}
```

---

## Sektions-Schema

A Foundations · B Atome · C Moleküle · D Organismen · E Seiten-Vorlagen — dezimal nummeriert (A.1, B.3 …). Neue Komponente = nächste Nummer ohne Suffixe.

### Klassen-Schnellreferenz

#### B — Atome
| Sek. | Komponente | Klasse(n) | Modifier |
|---|---|---|---|
| B.1 | Button | `.btn` | `--primary --secondary --ghost --back --sm --full --with-icon --icon --danger --loading` (Kombi `--full.--with-icon` zentriert Icon+Text via `justify-content`) |
| B.2 | Badge / Label | `.badge` | `--dark --sale --pill --dot`; `[data-cat]` |
| B.3 | Icon-Box | `.icon-box` | — |
| B.4 | Formularfeld | `.form-field` | `--sm --full`; `.form-grid`, `.form-check`, `.actionable-input` |
| B.4 | Auswahlbox (Demo in B.4) | `.choice-box` | `--sm --block --detail` |
| B.5 | Product Thumb | `.product-thumb` | — |
| B.6 | Breadcrumb | `.breadcrumb` | `.--current` (letzter Eintrag) |

#### C — Moleküle
| Sek. | Komponente | Klasse(n) | Modifier |
|---|---|---|---|
| C.1 | Produktkarte | `.tile.--product` | `--featured`; in `.tile-grid.--cols-2/3/4` |
| C.2 | Cart Item | `.cart-item` | — |
| C.3 | Card-Pattern-Übersicht | (Referenztabelle, keine eigene Klasse) | — |
| C.4 | Stand-Alone-Formular | `.form-page` | — |
| C.5 | Tabs & Akkordeon | `.tabs .tab-panel .accordion` | — |
| C.6 | Pagination | `.pagination` | `.--current` |
| C.7 | Notice / Infobox | `.notice` | — |
| C.8 | Empty / Success | `.empty-state` `.success-state` | — |
| C.9 | Toast | `.toast` | `--success --error --info --out` |
| C.10 | Modal | `.modal .modal-overlay` | `--open` |

#### D — Organismen
| Sek. | Komponente | Klasse(n) | Modifier |
|---|---|---|---|
| D.1 | Navigation | `.site-nav .announcement-bar` | — |
| D.2 | Footer | `.site-footer` | — |
| D.3 | Hero-Sections | `.section-type` | `--v1 --v2 --v3 --v4 --reverse --viewport` |
| D.4 | Kachel-Raster | `.tile-grid` | `--cols-2/3/4 --boxed` |
| D.5 | Testimonials | `.testimonial-grid .testimonial-slider` | — |
| D.6 | Marquee | `.marquee` | — |
| D.7 | Newsletter | `.newsletter` | — |

#### E — Seiten-Vorlagen
| Sek. | Komponente | Klasse(n) |
|---|---|---|
| E.2 | PDP | `.pdp`, `.pdp__type-selector` |
| E.3 | Collection | `.collection-layout .collection-sidebar .collection-toolbar` |
| E.4 | Cart-Drawer | `.cart-drawer .cart-overlay` |
| E.5 | Checkout | `.checkout .summary-line .summary-total` |
| E.6 | Login-Modal | `.login-overlay .login-modal` |
| E.7 | Suche | `.search-overlay .search-panel` |

#### Globale Helfer
| Klasse | Modifier | Zweck |
|---|---|---|
| `.page` | `--narrow --form --no-pt` | Container mit max-width + padding |
| `.section-label` | `--sub` | Abschnittsüberschrift |
| `.label-caps` | — | Inline Caps-Beschriftung |
| `.qty-selector` | `--sm` | Mengenauswahl |
| `.price-stack` | — | Preis + `--old` für Streichpreise |
| `.placeholder-bg` | — | Platzhalter für Produktbilder ohne Foto |
| `.col-grid` | `[data-cols="1/2/3/4"]` `--spaced` | Spaltenraster (in `sg.css`). Standard-Gap: `var(--base) var(--gutter)` — Zeilen eng (Text stapelt wie `.flow`), Spalten weit. Für Kacheln/Bilder mit vollem Zeilenabstand: `.--spaced` → `gap: var(--gutter)`. Mobile < 768px: immer 1-spaltig. |
| `.flow` | — | Kontextsensitives Typografie-Spacing. Wird auf `.section-type__content` gesetzt. Regeln: `* + *` → `--base`, `h1/h2 + *` → `--half-module`, `* + .btn / * + .btn-row` → `calc(--half-module * 1.5)`. Headline→Body in section-type via separatem Override (`--half-module`, Spez. 0,4,0). |

---

## Pages aktiv

| Page | CSS | JS | Zweck |
|---|---|---|---|
| `pages/Tierarzt-Empfehlung.html` | `Tierarzt-Empfehlung.css` | `tierarzt-empfehlung.js` | Hauptmockup, Freigabe-Flow |
| `pages/Tierarzt-Empfehlung-Info.html` | — | — | Technische Doku Rezeptanfrage-System |
| `pages/Tierarzt-Empfehlung-Freigabe.html` | `Tierarzt-Empfehlung-Freigabe.css` | `tierarzt-empfehlung-freigabe.js` | Vet-Portal, Empfehlungsfreigabe |
| `pages/Bundle.html` | `bundle.css` | — | Bundle-Builder mit Naturalrabatt |
| `pages/Bundle-Info.html` | — | — | Konzept-Artikel Bundle |
| `pages/Formular-Reklamation.html` | `formulare.css` | `formular-reklamation.js` | Stand-Alone-Formular |
| `pages/Formular-Nebenwirkungen-TB.html` | `formulare.css` | `formular-nebenwirkungen-tb.js` | Meldeformular Tierbesitzer |
| `pages/Formular-Nebenwirkungen-TA.html` | `formulare.css` | `formular-nebenwirkungen-ta.js` | Meldeformular Tierarztpraxis |
| `pages/Produkt-Modell.html` | — | — | Artikel: Indikation → Variante |
| `pages/Provision-Portal-Start.html` | `provision-portal.css` | `provision-portal-start.js` | Provisions-Portal Startseite |
| `pages/Provision-Portal.html` | `provision-portal.css` | `provision-portal.js` | Tierarzt löst Provisionen ein |
| `pages/Provision-Portal-Info.html` | — | — | Technische Doku Provisions-Portal |
| `pages/_template.html` | — | — | Boilerplate neue Mockup-Pages |

---

## Tabu-Bereiche

| Pfad | Grund |
|---|---|
| `pages/vetalita/` | Nicht anfassen — kein Lesen, kein Schreiben, kein Refactoring |

---

## Audit-Verhalten

Wenn der User **„analysiere das Projekt auf Inkonsistenzen"** sagt:
- `find . -name "*.html"` — ALLE HTML-Dateien, nicht nur `pages/`
- CSS-Schichten alle prüfen: `inuvet.css`, `sg.css`, `mockup-ui.css`, `pages/*.css`

---

## Technische Konventionen

**Preview-Server:** `python3 -m http.server 3456` aus `~/code/Inuvet-Styleguide/`

**Safari — lokale Dateien:** Safari blockiert standardmäßig `../`-Pfade bei `file://`-URLs. Fix: Safari → Einstellungen → Erweitert → „Funktionen für Webentwickler aktivieren" → Menü „Entwickler" → „Lokale Dateieinschränkungen deaktivieren". Einmalig, bleibt gesetzt.

**Commit-Format:** `feat:` / `fix:` / `refactor:` / `docs:`

**Bildpfade:** `assets/images/Calmin_Packshot_01.jpeg` etc. Nur Calmin- und Hepax-Packshots existieren — alle anderen Produkte: `placeholder-bg`.

**CSS Cache-Busting:** `inuvet.css?v=N` — N hochzählen nach Änderungen.

---

## Pflege

Diese Datei bei Änderungen an: Goldenen Regeln · Token-Familien · Pages · Architektur-Entscheidungen. `CONTEXT.md` existiert nicht mehr.
