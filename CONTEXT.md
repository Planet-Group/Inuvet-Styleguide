# Inuvet Styleguide — Projekt-Kontext

Diese Datei fasst die gesamte Projektgeschichte, alle Designentscheidungen und den aktuellen Stand zusammen. Sie ist der Einstiegspunkt für jede neue Session.

---

## Projekt-Übersicht

**Was ist das?**
Ein umfassender HTML/CSS Design System Styleguide für die Marke **inuvet** (Tiergesundheitsprodukte, Shopify-Shop). Er dient Entwicklern und dem Marketing als verbindliche Referenz und enthält interaktive Demos aller Komponenten.

**Ziel:** „Perfekter, sauberer Code, der von Entwicklern gerne angenommen wird."

**GitHub:** `https://github.com/micha-lang/Inuvet-Styleguide`
**GitHub Pages (live):** `https://micha-lang.github.io/Inuvet-Styleguide/`
**Lokaler Preview-Server:** Port **3456** (`python3 -m http.server 3456` aus `~/Inuvet-Styleguide/`)

---

## Dateistruktur

```
~/Inuvet-Styleguide/
├── styleguide.html              # Haupt-Styleguide (alle Sektionen 00–38+)
├── starter.html                 # Blank-Template für neue Projekte
├── inuvet.css                   # Design System CSS (Tokens, Atome, Moleküle, Organismen)
├── sg.css                       # Styleguide-Only UI-Klassen (sg-Präfix)
├── mockup-ui.css                # Nur Mockup-Bar/FAB-Styles (kein Page-Content!)
├── assets/
│   ├── images/                  # Produktbilder (Calmin_Packshot_01/02/03, Hepax_Packshot_01/02)
│   ├── graphics/                # Logo: Inuvet_Logo_RGB.svg
│   ├── lotties/                 # Lottie-Animationen (.json)
│   └── videos/
└── pages/
    ├── Bundle.html              # Bundle-Builder Mockup
    ├── bundle.css
    ├── Tierarzt-Empfehlung-Mockup.html   # Hauptmockup: Rezeptanfrage-Flow
    ├── Tierarzt-Empfehlung-Mockup.css
    ├── Formular-Reklamation.html
    ├── formulare.css
    ├── Inuvet-Freigabe-Mockup.html
    └── Prozess-Diagramm.html
```

---

## Architektur-Regeln (unveränderlich)

### CSS-Schichten

| Datei | Zweck | Darf nicht enthalten |
|---|---|---|
| `inuvet.css` | Design System — Tokens, Atome, Moleküle | Styleguide-UI, Mockup-Bar, Newsletter-Spezifisches |
| `sg.css` | Styleguide-UI (`.sg-*` Präfix) | Echte Produkt-Komponenten |
| `mockup-ui.css` | Ausschließlich Mockup-Bar & FAB | Page-Level-Komponenten, Inhalt |
| `[Name]-Mockup.css` | Page-spezifische Overrides | Globale Design-System-Änderungen |

### Seiten-Architektur

- **Landingpages / section-type-Seiten:** `<main>` ohne `.page`; Inhalt in `<div class="page">` für Satzspiegel
- **Content-Seiten:** `<main class="page">`
- **section-type Varianten:**
  - `--v1`: 50/50 Split, selbst-zentriert mit `padding: var(--margin)`
  - `--v2`: Bild links, grüne Content-Box rechts
  - `--v3`: Full-Bleed Hintergrund, braucht `section-type__inner` > `section-type__content`
  - `--reverse`: Spiegelt die Reihenfolge

---

## Designprinzipien (nie brechen)

1. **Immer bestehende Klassen nutzen** — Kein neues CSS wenn eine bestehende Klasse reicht. Erst `inuvet.css` prüfen.
2. **Atomic Design / Lego-Prinzip** — Atome kombinieren statt neue Komponenten erfinden. Zero new CSS per Feature wenn möglich.
3. **`border-radius: 0` überall** — Ausnahmen: `.badge.--pill` (`2em`) und Avatar (`50%`). Keine Ausnahmen ohne Diskussion.
4. **Kein `text-align: center`** für Inhalt — Nur funktional (Button-Text, Qty-Input)
5. **Kein `!important`** — Niemals.
6. **Alle Werte als Token** — Keine Magic Numbers. Alles via `var(--...)`.
7. **BEM-Modifier:** `--modifier` (z.B. `.btn.--primary`, `.tile.--featured`)
8. **State-Klassen:** `.--open`, `.--active`, `.--hidden` (kein `.open` ohne Doppel-Bindestrich)
9. **Kein `display: none` für Animationen** — CSS Grid `grid-template-rows: 0fr → 1fr` für Accordion

---

## Token-System (`inuvet.css` `:root`)

### Spacing
```css
--base: 1rem
--module: 3rem
--half-module: 1.5rem
--module-2xl: 6rem
--gutter: 1.5rem
--margin: clamp(1rem, 5vw, 4rem)
--container-max: 1536px
```

### Typography
```css
--text-xs: 0.667rem
--text-sm: 0.8rem
--text-base: clamp(0.875rem, 1vw, 1rem)
--text-m: 1.25rem
--text-l: 1.5rem
--lh-h3: 1.3
--font: [inuvet Systemschrift]
```

### Farben (Primitives)
```css
--green: [Primärgrün]
--green-light: [Hellgrün Hintergrund]
--fg: #2E2E2E (Primärtext)
--fg-hover: #333
--border: #cccccc
--border-light: #e0e0e0
--accent-bg: #f2f2f2
```

### Semantische Aliase
```css
--color-action: var(--green)
--color-success: var(--green)
--color-link: var(--green)
--color-rating: #E8A020
--color-error: #c00
--color-error-bg: #c0392b
--color-overlay-dark: [dunkel]
--color-overlay-light: [hell]
```

### Animation
```css
--anim-fast: 0.2s ease
--anim-mid: 0.3s ease
--anim-base: 0.4s ease
--anim-slow: 0.6s ease
```

### Z-Index
```css
--z-default: 1
--z-nav: 100
--z-dropdown: 110
--z-overlay: 200
--z-drawer: 210
--z-modal: 220
```

### Focus
```css
--focus-ring-width: 2px
--focus-ring-offset: 2px
--focus-ring-color: var(--green)
```

### Kategorie-Farben (`data-cat` Attribut)
Nur `background-color`, Text immer schwarz (kein `color`):
- `--cat-beruhigung` / `--cat-beruhigung-light`
- `--cat-leber` / `--cat-leber-light`
- `--cat-gelenke` / `--cat-gelenke-light`
- `--cat-immun` / `--cat-immun-light`
- `--cat-herz` / `--cat-herz-light`
- … (14 Kategorien gesamt)

---

## Wichtige Komponenten & Patterns

### Floating Label Pattern
```html
<div class="form-field">
  <input placeholder=" " id="x">
  <label for="x">Label</label>
</div>
```
- `placeholder=" "` (ein Leerzeichen) triggert `:not(:placeholder-shown)`
- `.--on-green` Modifier: Felder auf grünem Hintergrund (Hintergrund wird automatisch `--green-light`)
- `.--error` Modifier: Label floated auch bei leerem Feld

### Tile / Produktkachel
```html
<div class="tile">
  <div class="tile__image">
    <div class="floating-meta"><!-- Badges oben links --></div>
    <img src="...">
    <img src="..." class="hover-img"><!-- Rollover-Bild -->
  </div>
  <div class="tile__body">
    <div class="tile__headline-row">
      <h3 class="tile__headline">Name</h3>
      <div class="rating"><!-- Sterne --></div>
    </div>
    <div class="price-stack">...</div>
  </div>
</div>
```
- `.tile.--featured` = Sonderkachel (grüner Hintergrund)
- `.tile-grid.--cols-2/3` für Grid-Layouts

### Kachel-Badges
```html
<div class="tile__badges"><!-- in tile__image, position absolute -->
  <span class="badge" data-cat="beruhigung">Beruhigung</span>
  <span class="badge">Neu</span>
</div>
```

### Cart Item Pattern
```css
display: grid;
grid-template-columns: calc(var(--base)*5) 1fr;
padding: var(--half-module) 0;
border-bottom: 1px solid var(--border-light);
```

### Nav-Dropdown (CSS + JS)
- `.nav-item` + `.nav-item__trigger` + `.nav-item__dropdown`
- CSS `:hover` + `:focus-within` für Desktop
- JS für Click-Interaktion (schließt beim Hover über andere Trigger)
- `--z-dropdown: 110` (über `--z-nav: 100`)
- Desktop-Spacing: `1rem` zwischen Nav-Links

### Accordion
- CSS Grid Trick: `grid-template-rows: 0fr → 1fr` (kein `max-height` Hack)
- Braucht `__inner` Wrapper-Element
- `aria-expanded` wird per JS gesetzt

### Tab System
- `switchTab()` JS-Funktion
- Box-shadow Trick statt `border-bottom` + `margin-bottom: -1px` Hack

---

## Seiten-Sektionen (styleguide.html)

Nummerierung: 00–38+ (nach Umbenennung vom Apr '26)

| Nr | Inhalt |
|---|---|
| 00 | Intro / Übersicht |
| 01–03 | Foundations (Grid, Breakpoints) |
| 04 | Typografie (mit Token-Namen direkt neben Specimen) |
| 05 | Farben (Color-Cards mit Dual-Swatch) |
| 07 | Spacing (mit Token-Namen) |
| 08 | Spaltenraster |
| 10–16 | Atome (Buttons, Icons, Badges, Inputs…) |
| 17 | Navigation (incl. Dropdown, Mobile, Doku) |
| 18–22 | Moleküle (Cards, Tiles, Produktkacheln) |
| 22a | Produktlisten-Karte |
| 23–26 | Organismen (Collection, PDP, Cart, Checkout) |
| 27 | Collection Seite |
| 28 | PDP |
| 29 | Predictive Search |
| 30–34 | Weitere Organismen (Pagination, Modal, Account, Cookie) |
| 35 | Blog |
| 36–38 | Templates (Landing Pages) |

---

## Mockups (pages/)

### Tierarzt-Empfehlung-Mockup.html ⟵ Hauptmockup

**Scenario:** Shopify-Shop für Tiergesundheitsprodukte mit Rezeptpflichtsystem.

**3 User-States (umschaltbar per Mockup-Bar):**
- ① Nicht eingeloggt
- ② Eingeloggt, keine Freigabe (Tierarzt hat noch keine Empfehlung ausgestellt)
- ③ Eingeloggt, mit Freigabe (mind. 1 Praxis hat Empfehlung ausgestellt)

**Produkte:** Calmin Balance, Hepax (und 4 generische Produkte A–F)

**Rezeptanfrage-Flow (mehrstufiger Cart Drawer):**
1. Klick auf "Produkt anfragen" → Kachel im Warenkorb
2. Warenkorb öffnet → Schritt 1: Übersicht
3. Schritt 2: Praxis-Dropdown (alphabetisch sortiert, grüner Punkt = Praxis hat schon Empfehlung erstellt)
4. Schritt 3: Bestätigungs-Screen mit E-Mail-Overlays (alle E-Mails auf einmal im Panel, × zum Schließen, dann "Weiter einkaufen")

**Bekannte letzte Änderung (07.05.):**
- Bug gefixt: Email-Overlays wurden nicht angezeigt (TypeError weil entfernte DOM-Elemente angesprochen wurden)
- **Status: Gefixt und gepusht.** Commit: `fix: TypeError in openEmailsOverlay`

### Bundle.html
- Bundle-Builder mit dynamischer Produktauswahl
- Zusammenfassungs-Karte: vollflächig grün, weißer Text
- Mockup-Bar (FAB-Button) für interne Einstellungen

---

## Technische Konventionen

### Preview-Server
```bash
cd ~/Inuvet-Styleguide && python3 -m http.server 3456
```
Kein Sync nötig (Dateien liegen direkt im Ordner).

### Commit-Message-Format
```
feat: Kurzbeschreibung
fix: Kurzbeschreibung
refactor: Kurzbeschreibung
```
Nach größeren Änderungen immer Commit-Message vorschlagen.

### Bildpfade
- Produkte: `assets/images/Calmin_Packshot_01.jpeg` etc.
- Logo: `assets/graphics/Inuvet_Logo_RGB.svg` (als `<img>`, kein Inline-SVG)

### CSS Cache-Busting (Development)
`inuvet.css?v=N` — N hochzählen nach CSS-Änderungen (wird vor dem Pushen entfernt).

---

## Verworfene Entscheidungen (nicht nochmal vorschlagen)

- ❌ **Dark-Variante** für Komponenten — nicht gewünscht
- ❌ **Zentrierte Layouts** für Content — kein `text-align: center`
- ❌ **Checkout-Sektion** — wurde implementiert und wieder entfernt; kein eigenständiger Checkout im Styleguide
- ❌ **Newsletter-Seite** — `newsletter_web.html` und `newsletter.html` wurden gelöscht
- ❌ **`!important`** — Niemals
- ❌ **`border-radius` auf normalen Elementen** — außer explizite Ausnahmen
- ❌ **3-Layer Token-Architektur** (vollständiges Refactoring) — zu aufwändig; stattdessen gezielte semantische Aliase
- ❌ **Markdown-Dokumentationsdateien** im Repo — wurden auf Wunsch gelöscht (außer dieser Datei!)

---

## Offene Punkte / Was als nächstes anstand

Stand 07.05.2026:

1. **Tierarzt-Empfehlung-Mockup** ist fertig + gefixt. Kann weiterentwickelt werden.
2. **Bundle.html** ist weitgehend fertig.
3. **Styleguide** ist aktuell und vollständig.
4. Potenzielle nächste Themen (nie formal beschlossen):
   - Footer-Komponente (global, noch nicht designed)
   - Weitere Landing-Page-Templates
   - Do's & Don'ts Sektion
   - Scroll-Animationen (Doku)
