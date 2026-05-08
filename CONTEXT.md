# Inuvet Styleguide — Projekt-Kontext

Diese Datei fasst die Projektgeschichte, alle Designentscheidungen und den aktuellen Stand zusammen. Sie ist der Einstiegspunkt für jede neue Session und wird bei größeren Änderungen aktiv gepflegt.

> **Letzte Aktualisierung:** 2026-05-08

---

## Projekt-Übersicht

**Was ist das?**
Ein umfassender HTML/CSS Design System Styleguide für die Marke **inuvet** (Tiergesundheitsprodukte, Shopify-Shop). Er dient Entwicklern und dem Marketing als verbindliche Referenz und enthält interaktive Demos aller Komponenten.

**Ziel:** „Perfekter, sauberer Code, der von Entwicklern gerne angenommen wird."

**Live-Preview:**
- GitHub: `https://github.com/micha-lang/Inuvet-Styleguide`
- GitHub Pages: `https://micha-lang.github.io/Inuvet-Styleguide/`
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
    ├── Tierarzt-Empfehlung-Mockup.html   # Hauptmockup: Rezeptanfrage-Flow
    ├── Tierarzt-Empfehlung-Mockup.css
    ├── Inuvet-Freigabe-Mockup.html # Vet-Portal: Empfehlungsanfragen freigeben
    ├── freigabe.css
    ├── Formular-Reklamation.html   # Stand-Alone-Formular-Beispiel
    ├── formulare.css
    └── Prozess-Diagramm.html       # Swimlanes für Empfehlungs- + Naturalrabatt-Flow
```

> **Hinweis:** `starter.html` als statische Datei wurde gelöscht — sie veraltete schneller, als sie genutzt wurde. Stattdessen lebt das **Page-Skeleton in Sektion E.1 des Styleguides** als Code-Snippet mit Verweisen zu allen Detail-Sektionen. Es bleibt damit immer synchron mit dem System. Wer einen anderen Pattern-Typ braucht (Hero-led, Stand-Alone-Form), kopiert die strukturell passende existierende Page.

---

## Architektur-Regeln (unveränderlich)

### CSS-Schichten

| Datei | Zweck | Darf nicht enthalten |
|---|---|---|
| `inuvet.css` | Design System — Tokens, Atome, Moleküle, Organismen | Styleguide-UI, Mockup-Chrome, Page-Spezifika |
| `sg.css` | Styleguide-eigene UI (`.sg-*` Präfix) | Echte Produkt-Komponenten |
| `mockup-ui.css` | Dev-UI Chrome (Mockup-Bar, FAB, Mockup-Modal, Email-Overlays) | Page-Content, Theme-Komponenten |
| `pages/[name].css` | Page-spezifische Overrides + page-eigene Klassen | Globale Design-System-Änderungen |

### Seiten-Architektur

- **Hero-led Pages** (Bundle, Tierarzt-Mockup): `<main>` direkt, ohne `.page` — section-types sind selbst-containerisiert
- **Content-Pages** (Bundle-Info, Inuvet-Freigabe): `<main class="page">` oder `<main><div class="page">`
- **Form-Pages** (Formular-Reklamation): nutzen `.form-page` Shell statt `.page`

---

## Designprinzipien (nie brechen)

1. **Immer bestehende Klassen nutzen** — Erst `inuvet.css` prüfen, dann erst neu erfinden.
2. **Atomic Design / Lego-Prinzip** — Atome kombinieren statt neue Komponenten erfinden.
3. **`border-radius: 0` überall** — Ausnahmen nur: `.badge.--pill` (`2em`) und Avatar (`50%`).
4. **Kein `text-align: center`** für Inhalte — Nur funktional (Button-Text, Qty-Input, Empty/Success-State).
5. **Kein `!important`** — Niemals.
6. **Alle Werte als Token** — Keine Magic Numbers. Alles via `var(--...)`.
7. **BEM-Modifier mit Doppel-Bindestrich**: `.btn.--primary`, `.tile.--featured`, `.--active`, `.--open`.
8. **Linien sparsam einsetzen** — Whitespace ist die Standard-Trennung. `border-top` für Trennzwecke ist ein Code-Smell.
9. **Page-Spacing über Tokens** — `--page-pt` für Atemraum unter dem sticky Header (siehe Layout-Tokens).

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

## Mockups (`pages/`)

### `Tierarzt-Empfehlung-Mockup.html` — Hauptmockup
**Scenario:** Shopify-Shop für Tiergesundheitsprodukte mit Rezeptpflicht-System.

**3 User-States (umschaltbar per Mockup-Bar):**
- ① Nicht eingeloggt
- ② Eingeloggt, keine Freigabe
- ③ Eingeloggt, mit Freigabe (mind. 1 Praxis hat Empfehlung ausgestellt)

**Rezeptanfrage-Flow:**
1. „Produkt anfragen" → Cart-Item
2. Cart öffnet → Praxis-Dropdown (alphabetisch, grüner Punkt = Empfehlung vorhanden)
3. Bestätigungs-Screen mit E-Mail-Overlays

### `Bundle.html` — Bundle-Builder
- Naturalrabatt-System mit Tier-Konfiguration
- `.summary-card` (sticky/floating) als Bestell-Übersicht
- Mockup-FAB für Backend-Konfiguration der Stufen

### `Bundle-Info.html` — Konzept-Artikel
Strategie, UX-Konzept und technische Spezifikation des Bundle-Builders. Article-Layout mit Sidebar.

### `Inuvet-Freigabe-Mockup.html` — Vet-Portal
Tierarzt-Ansicht: einzelne Empfehlungsanfrage von Tierbesitzer freigeben/ablehnen + optionale Notiz.
- Standard `.site-nav` Header (mit Announcement Bar)
- `<main class="page --narrow approval-page">`
- `.choice-box` als Mengen-Auswahl (Ablehnen, max. 1×, max. 2×, max. 5×, Unbegrenzt)
- Globaler `.success-state` für Erfolgs-Bestätigung

### `Formular-Reklamation.html` — Stand-Alone-Formular
Beispiel für Sektion 12a. Nutzt `.form-page` Shell.

### `Prozess-Diagramm.html` — Swimlane-Diagramme
Zwei Diagramme: Empfehlungsanfrage-Flow + Naturalrabatt-Konfiguration. Marketing → Backend → Frontend Spalten.

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

### CSS Cache-Busting (Development)
`inuvet.css?v=N` — N hochzählen nach CSS-Änderungen (vor Push entfernen).

---

## Verworfene Entscheidungen (nicht nochmal vorschlagen)

- ❌ **Generische `.card`-Basis-Klasse** — die 5 Card-Patterns sind bewusst getrennt (siehe Sektion 14)
- ❌ **Sektion 16 (Product Thumb) in Atome-Block verschieben** — Aufwand/Nutzen schlecht; Cross-Reference reicht
- ❌ **Eigene Sektion „13a — Globale Atome"** — Atome im Verwendungs-Kontext zu zeigen hat eigenen Pädagogik-Wert
- ❌ **Breadcrumbs aktiv nutzen** — flacher Katalog braucht sie nicht; Komponente bleibt dokumentiert
- ❌ **Dark-Variante** für Komponenten — nicht gewünscht
- ❌ **Zentrierte Layouts** für Content
- ❌ **`!important`** — Niemals
- ❌ **`border-radius` auf normalen Elementen** — außer explizite Ausnahmen (badge.--pill, avatar)
- ❌ **3-Layer Token-Architektur** (vollständiges Refactoring) — zu aufwändig; semantische Aliase nur gezielt
- ❌ **`starter.html` als Vorlage** — gelöscht; existing pages copy-pasten ist robuster

---

## Audit-Historie

### Stand 2026-05-08 (große Aufräum-Session)
- **Sektions-Struktur komplett neu gestaltet**: Ablösung des Patchwork-Schemas (00–38 mit 12a/17a/34a-Suffixen) durch Atomic-Design-Hierarchie A–E (Foundations, Atome, Moleküle, Organismen, Seiten-Vorlagen). Erweiterbar ohne Suffixe. Alle Anker-IDs und Cross-References migriert. Mobile-Nav und Footer-Nav komplett neu strukturiert.
- **Globale Konventionen etabliert**: `--page-pt`, `.page.--narrow/--form/--no-pt`, `.section-label.--sub`, `.success-state`-Komponente
- **Hardcoded-Werte eliminiert**: 4 Farben in `bundle.css`, `1.5rem` in `formulare.css`, alle Animation-Hardcodes (`0.12s` etc.)
- **Doku-Lücken geschlossen**: `--text-sm`, `--lh-h3`, `--border-focus`, alle `--anim-*`, `--z-*` Tokens in Sektion 02 dokumentiert
- **Strukturelle Fixes**: Footer-Link-Bugs (4 falsche Verlinkungen), `.checkout__success-icon` durch globalen `.success-state__icon` ersetzt, `.product-thumb` aus Sektion 03 entfernt (gehörte in 16)
- **Page-Refactor**: `Inuvet-Freigabe-Mockup.html` komplett aufgeräumt — Custom Header durch Standard-`.site-nav` ersetzt, lokale Klassen-Duplikate (`.approval-breadcrumb*`, `.approval-product-thumb`, `.approval-success*`) durch globale Komponenten ersetzt, ~160 Zeilen Inline-`<style>` nach `freigabe.css` ausgelagert
- **Dead Code entfernt**: `breadcrumb()` JS-Helper in Tierarzt-Mockup, alle Breadcrumb-Aufrufe, `starter.html` komplett

### Offene Punkte
- **Bundle.html**: Recommendations-Sektion ist temporär entfernt (`recommendedPool`, `addProduct` Funktionen sind dead code). Wenn die Sektion wieder gewünscht ist, brauchen wir ein anderes Card-Pattern für den Kontext.
- **Empty-State `max-width: 28rem`** könnte responsiver sein (minor)
- **Sektion 23 (Tabs)**: `.tab-panel` als globale Klasse noch nicht in Sektion 12 (Form) referenziert — minor
