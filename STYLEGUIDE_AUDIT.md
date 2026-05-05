# Inuvet Styleguide — Audit Report

**Datum:** 2026-05-05  
**Repo:** `/Users/michaelhoppe/Inuvet-Styleguide/`  
**Analysiert mit:** Vollständige Lektüre aller Quelldateien + grep-basierte Zählungen

---

## Analysierte Dateien

| Datei | Zeilen | Rolle |
|---|---|---|
| `inuvet.css` | 2120 | Haupt-Design-System: Tokens + Komponenten |
| `sg.css` | 192 | Styleguide-UI: Dokumentationsseiten-Klassen |
| `mockup-ui.css` | 185 | Mockup-Steuerleiste + Hilfskomponenten (kein Produktion) |
| `styleguide.html` | 4500 | Interaktive Komponentendokumentation |
| `pages/Tierarzt-Empfehlung-Mockup.html` | 1175 | Mockup: Tierarzt-Empfehlung-Flow |
| `pages/Tierarzt-Empfehlung-Mockup.css` | 88 | Seitenspezifische Styles für obiges Mockup |
| `pages/Bundle.html` | 459 | Mockup: Bundle-Builder |
| `pages/bundle.css` | 269 | Seitenspezifische Styles für Bundle-Builder |
| `pages/Formular-Reklamation.html` | 216 | Mockup: Reklamationsformular |
| `pages/formulare.css` | 62 | Seitenspezifische Styles für Formulare |

---

## Abschnitt 1 — Token-Inventar

Insgesamt 618 `var()`-Aufrufe in `inuvet.css`. Alle Custom Properties sind in `:root` definiert, eine Ausnahme: `--bg` wird in `.--on-green` kontextuell neu definiert (Zeile 1077).

### 1.1 Farben

| Name | Wert | Zeile | Verwendungen (inuvet.css) |
|---|---|---|---|
| `--fg` | `#2E2E2E` | 27 | 60 |
| `--fg-hover` | `#333` | 28 | 1 |
| `--fg-muted` | `#666` | 29 | 68 |
| `--bg` | `#fff` | 30 | 30 (+ lokal in `.--on-green`) |
| `--border` | `#cccccc` | 31 | 20 |
| `--border-light` | `#e0e0e0` | 32 | 46 |
| `--accent-bg` | `#f2f2f2` | 33 | 7 |
| `--cross-color` | `var(--border)` | 34 | 4 |
| `--border-focus` | `var(--fg)` | 37 | 3 |
| `--border-active` | `var(--fg-hover)` | 38 | 6 |
| `--green` | `#78b41b` | 41 | 18 |
| `--green-hover` | `#58990F` | 42 | 4 |
| `--green-light` | `#f0fae6` | 43 | 9 |
| `--color-error` | `#c00` | 107 | 6 |
| `--color-error-bg` | `#c0392b` | 108 | 1 |

**Kategorie-Farben (14 Paare — je `--cat-X` + `--cat-X-light`):**

| Name | Wert | Zeile |
|---|---|---|
| `--cat-cbd` | `#C5B4E3` | 46 |
| `--cat-cbd-light` | `#f2eff9` | 47 |
| `--cat-bauchspeichel` | `#FFB1BB` | 48 |
| `--cat-bauchspeichel-light` | `#ffeff2` | 49 |
| `--cat-blase` | `#F3DD6D` | 50 |
| `--cat-blase-light` | `#fdf8e3` | 51 |
| `--cat-niere` | `#C3623A` | 52 |
| `--cat-niere-light` | `#f8ece8` | 53 |
| `--cat-herz` | `#FF6D6A` | 54 |
| `--cat-herz-light` | `#ffeceb` | 55 |
| `--cat-leber` | `#DDBCB0` | 56 |
| `--cat-leber-light` | `#f8f2f0` | 57 |
| `--cat-beruhigung` | `#C3D7EE` | 58 |
| `--cat-beruhigung-light` | `#ecf2fa` | 59 |
| `--cat-gelenke` | `#D0D3D4` | 60 |
| `--cat-gelenke-light` | `#f1f2f2` | 61 |
| `--cat-magendarm` | `#D4EC8E` | 62 |
| `--cat-magendarm-light` | `#f0fae6` | 63 |
| `--cat-fettsaeuren` | `#05868E` | 64 |
| `--cat-fettsaeuren-light` | `#e5f0f1` | 65 |
| `--cat-haut` | `#F1A7DC` | 66 |
| `--cat-haut-light` | `#fcedf7` | 67 |
| `--cat-immun` | `#a7e6d7` | 68 |
| `--cat-immun-light` | `#e5f7f3` | 69 |
| `--cat-atemwege` | `#FFB990` | 70 |
| `--cat-atemwege-light` | `#fff1e9` | 71 |
| `--cat-hormone` | `#994878` | 72 |
| `--cat-hormone-light` | `#f4e9ef` | 73 |

Alle `--cat-X-light`-Varianten werden genau 1× in inuvet.css verwendet (Zeilen 1607–1620, `[data-cat="..."]`-Selektoren). Die dunklen `--cat-X`-Varianten werden in inuvet.css selbst **nie** mit `var()` referenziert — nur als Dokumentationsfarbe in styleguide.html (s. Abschnitt 4).

### 1.2 Spacing / Sizing

| Name | Wert | Zeile | Verwendungen (inuvet.css) |
|---|---|---|---|
| `--base` | `1rem` | 7 | 89 |
| `--ratio` | `1.5` | 8 | 0 (nie referenziert) |
| `--module` | `clamp(1.5rem, 1rem + 2.7vw, 3rem)` | 9 | 79 |
| `--half-module` | `clamp(0.75rem, 0.5rem + 1.35vw, 1.5rem)` | 10 | 108 |
| `--gutter` | `var(--module)` | 12 | 16 |
| `--margin` | `var(--module)` | 13 | 7 |
| `--section-gap` | `var(--module)` | 14 | 1 |
| `--module-2xl` | `calc(var(--module) * 2)` | 75 | 8 |
| `--module-3xl` | `calc(var(--module) * 3)` | 76 | **0** |
| `--icon-box-sm` | `calc(var(--base) * 2.5)` | 78 | 4 |
| `--icon-box-md` | `calc(var(--base) * 2.75)` | 79 | 2 |
| `--announcement-height` | `var(--module)` | 81 | 3 |
| `--nav-height` | `calc(var(--module) * 2.5)` | 82 | 2 |
| `--header-height` | `calc(var(--module) * 3.5)` | 83 | 3 |
| `--section-max-height` | `51rem` | 84 | 1 |
| `--section-min-height` | `24rem` | 85 | 1 |
| `--section-label-mb` | *(kein :root-Default, nur in CSS als var()-Fallback)* | — | 1 (Fallback) |
| `--section-label-mt` | *(kein :root-Default, nur als var()-Fallback)* | — | 1 (Fallback) |

**Hinweis zu `--section-label-mb` / `--section-label-mt`:** Diese Properties sind nirgends in `:root` definiert. Sie existieren als kontextuelle Überschreibungen in `.checkout__sidebar` (Zeile 1313) und `.cart-drawer__items` (Zeile 1661), und als var()-Fallback in `.section-label` (Zeile 1220). Das ist ein funktional korrektes Pattern (CSS-Scope), aber ohne :root-Default nicht als reguläres Token erkennbar.

### 1.3 Typografie

| Name | Wert | Zeile | Verwendungen |
|---|---|---|---|
| `--text-xs` | `0.667rem` | 16 | 40 |
| `--text-base` | `clamp(0.875rem, 0.8rem + 0.3vw, 1rem)` | 17 | 43 |
| `--text-m` | `clamp(1.25rem, 1rem + 0.7vw, 1.5rem)` | 18 | 10 |
| `--text-l` | `clamp(1.5rem, 1rem + 1.7vw, 2.25rem)` | 19 | 6 |
| `--text-xl` | `clamp(2rem, 1rem + 3.2vw, 3.375rem)` | 20 | 3 |
| `--lh-base` | `1.5` | 22 | 27 |
| `--lh-h3` | `1.2` | 23 | (via h3-Selektor) |
| `--lh-h2` | `1.17` | 24 | (via h2-Selektor) |
| `--lh-h1` | `1.11` | 25 | (via h1-Selektor) |
| `--font` | `"schnebel-sans-me", sans-serif` | 87 | 14 |

Kein `--fw-*`-Token-System vorhanden. Alle `font-weight`-Werte sind hartkodiert als `700` oder `400`.  
Kein `--text-sm`-Token definiert — wird jedoch in `pages/Tierarzt-Empfehlung-Mockup.css` Zeile 65 referenziert (undefined token, fällt auf Browser-Default zurück).

### 1.4 Border / Radius

Keine eigenständigen `--border-radius`-Tokens vorhanden. Das System verwendet durchgängig `border-radius: 0` (quadratisches Design) oder ad-hoc-Werte:
- `border-radius: 2em` (`.badge.--pill`, Zeile 265)
- `border-radius: 50%` (`.article__author-avatar`, Zeile 2026)
- `border-radius: calc(var(--base) * 0.5)` (`.badge.--count`, Zeile 277)

### 1.5 Shadow

Kein `--shadow-*`-Token. Box-shadows hartkodiert:
- `.btn.--primary:hover`: `0 0 0 2px var(--fg)` (Zeile 815)
- `.btn.--secondary:hover`: `0 0 0 2px var(--fg)` (Zeile 827)
- `.settings-fab` (bundle.css): `0 4px 1.5rem rgba(0,0,0,0.2)` (Zeile 236)

### 1.6 Motion / Transition

| Name | Wert | Zeile | Verwendungen |
|---|---|---|---|
| `--anim-fast` | `0.2s ease` | 90 | 42 |
| `--anim-mid` | `0.3s ease` | 91 | 4 |
| `--anim-base` | `0.4s ease` | 92 | 16 |
| `--anim-slow` | `0.6s ease` | 93 | 1 |
| `--anim-announcement` | `4s` | 94 | 4 |
| `--anim-delay` | `0ms` | 95 | 1 (als Fallback via `var(--anim-delay, 0ms)`) |

`--anim-delay` ist in `:root` als `0ms` definiert, aber als contextual override für gestaffelte Scroll-Animationen gedacht (`[data-animate]`, Zeile 2114). Das Pattern ist korrekt, aber der `:root`-Default `0ms` ist redundant, da der Fallback direkt in var() steht.

### 1.7 Z-Index

| Name | Wert | Zeile | Verwendungen |
|---|---|---|---|
| `--z-below` | `-1` | 98 | **0** |
| `--z-default` | `1` | 99 | 4 |
| `--z-nav` | `100` | 100 | 3 |
| `--z-dropdown` | `110` | 101 | 0 in inuvet.css; 1 in bundle.css |
| `--z-overlay` | `200` | 102 | 5 |
| `--z-drawer` | `210` | 103 | 2 |
| `--z-modal` | `220` | 104 | 2 |

`--z-below` (-1) wird nirgends mit `var()` referenziert.  
Hartkodierte z-index-Werte außerhalb des Token-Systems:
- `Tierarzt-Empfehlung-Mockup.css` Zeile 16: `z-index: 850`
- `Tierarzt-Empfehlung-Mockup.css` Zeile 28: `z-index: 900`
- `mockup-ui.css` Zeile 93: `z-index: 9999`

### 1.8 Breakpoints

Keine definierten `--bp-*`-Tokens. Breakpoints hartkodiert im CSS:

| Breakpoint | Typ | Verwendungen in inuvet.css | Bedeutung |
|---|---|---|---|
| `767px` | max-width | 9 | Mobile/Desktop-Grenze |
| `768px` | min-width | 3 | Desktop ab |
| `1023px` | max-width | 1 | Mittelgroßes Tablet |
| `1535px` | max-width | 2 | Unterhalb Fullscreen |
| `480px` | max-width | 1 | Klein-Mobile (`form-page__card`) |

Zusätzlich in `pages/bundle.css`: `1100px` (min-width, Zeile 39) als einmalige Seiten-spezifische Ausnahme.

### 1.9 Sonstige

| Name | Wert | Zeile | Hinweis |
|---|---|---|---|
| `--section-label-mb` | *(kein Root-Default)* | — | Kontextuell definiert; Fallback in var() |
| `--section-label-mt` | *(kein Root-Default)* | — | Kontextuell definiert; Fallback in var() |

---

## Abschnitt 2 — Duplikate & Redundanzen

### 2.1 Tokens mit identischem Wert

| Token A | Token B | Wert | Hinweis |
|---|---|---|---|
| `--gutter` | `--margin` | `var(--module)` | Semantisch unterschiedlich (Spaltenabstand vs. Seitenabstand), gleicher Wert ist beabsichtigt |
| `--gutter` | `--section-gap` | `var(--module)` | `--section-gap` hat 1 Verwendung; faktisch synonym mit `--gutter` |
| `--cat-magendarm-light` | `--green-light` | `#f0fae6` | Identischer Hex-Wert; vermutlich unbeabsichtigt |

**Detail zum letzten Punkt:**  
`--cat-magendarm-light: #f0fae6` (Zeile 63) und `--green-light: #f0fae6` (Zeile 43) haben exakt denselben Wert. Das ist semantisch merkwürdig — Magendarm-Kategorie teilt ihre Hellfarbe mit der Primärfarbe des Systems.

### 2.2 Hartkodierte Hex-Werte außerhalb von Token-Definitionen

In `inuvet.css`:

| Zeile | Selektor | Wert | Problemstufe |
|---|---|---|---|
| 855 | `.rating .material-icons` | `color: #E8A020` | Mittel — Stern-Farbe ohne Token |
| 108 | `:root --color-error-bg` | `#c0392b` | Niedrig — Token-Definition selbst |

In `pages/bundle.css`:

| Zeile | Selektor | Wert | Problemstufe |
|---|---|---|---|
| 211 | `.warning-banner` | `background: #feffdc` | Hoch — Warnfarbe ohne Token |
| 212 | `.warning-banner` | `border: 1px solid #ffce00` | Hoch — Warnfarbe ohne Token |

In `mockup-ui.css`: Alle `#1a1a1a`, `#333`, `#666`, `#aaa` etc. sind bewusst hardkodiert (Dev-Tool-UI, kein Produktionscode).

### 2.3 rgba/RGB-Werte ohne Token

| Datei | Zeile | Wert | Kontext |
|---|---|---|---|
| inuvet.css | 1088 | `rgba(255,255,255,0.4)` | `.--on-green .form-upload:hover` |
| inuvet.css | 1489 | `rgba(255,255,255,0.6)` | `.testimonial-section.--on-green .testimonial__avatar` |
| inuvet.css | 1554 | `rgba(255,255,255,0.6)` | `.testimonial-slider.--on-green .testimonial__avatar` |
| inuvet.css | 1591 | `rgba(255, 255, 255, 0.6)` | `.pdp__caption` |
| inuvet.css | 1646 | `rgba(0,0,0,0.4)` | `.cart-overlay` |
| inuvet.css | 1734 | `rgba(0,0,0,0.4)` | `.filter-overlay` |
| inuvet.css | 1866 | `rgba(0,0,0,0.6)` | `.modal-overlay` |
| inuvet.css | 1882 | `rgba(0,0,0,0.4)` | `.search-overlay` |

Drei identische `rgba(255,255,255,0.6)` (Zeilen 1489, 1554, 1591) und zwei identische `rgba(0,0,0,0.4)` (Zeilen 1646, 1734) könnten als Tokens extrahiert werden.

### 2.4 Doppelte CSS-Selektoren / Klassen-Definitionen

| Klasse | Dateien | Art |
|---|---|---|
| `.text-muted` | `inuvet.css:392` + `sg.css:147` | Identische Regel in beiden Dateien |
| `.col-grid` | `sg.css:76` + `inuvet.css:1740` (responsive) + `pages/bundle.css:36` | Basis in sg.css, responsive Override in inuvet.css, Redeklaration in bundle.css |

`.text-muted` ist in beiden Dateien identisch (`color: var(--fg-muted)`). Wenn `sg.css` nie in Produktion eingebunden wird, ist das kein Problem — aber die Dopplung ist wartungsunfreundlich.

`.col-grid` wird in drei Dateien definiert: Basis-Definition in `sg.css`, responsive Override in `inuvet.css`, und komplette Neudefinition mit anderem Verhalten in `pages/bundle.css` (Zeile 36–40). `bundle.css` verwendet `minmax(0, 1fr)` statt einfachem `1fr`, was einen Anwendungsfall-spezifischen Override darstellt — aber als Klassenname ohne Prefix kann es beim Zusammenspiel mit anderen Sheets zu Konflikten kommen.

### 2.5 Ähnliche Komponenten-Varianten

**`.testimonial-section.--on-green` vs. `.testimonial-slider.--on-green`:** Beide definieren `padding: var(--module)` und `background: rgba(255,255,255,0.6)` für `.testimonial__avatar`. Identisches CSS in zwei Blöcken (Zeilen 1485–1490 + Zeilen 1550–1555).

**`.cart-overlay` vs. `.filter-overlay` vs. `.search-overlay`:** Alle drei sind `position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: var(--z-overlay); opacity: 0; visibility: hidden; transition: opacity/visibility var(--anim-base)`. Fast identisch, könnten auf eine gemeinsame `.overlay`-Basisklasse reduziert werden.

**`.shop-modal-overlay` in `mockup-ui.css`** hat denselben Aufbau wie `.modal-overlay` in `inuvet.css`, mit leicht abweichender Transparenz (`rgba(0,0,0,0.5)` vs. `rgba(0,0,0,0.6)`).

---

## Abschnitt 3 — Inkonsistenzen

### 3.1 Naming-Inkonsistenzen

**State-Klassen: `.open` vs. `.--open`**

Das System verwendet zwei verschiedene Konventionen für State-Klassen:

| Klasse | Datei | Zeilen |
|---|---|---|
| `.mobile-menu.open` | inuvet.css | 325, 341 |
| `.nav-hamburger.open` | inuvet.css | 306–308 |
| `.cart-drawer.--open` | inuvet.css | 1649 |
| `.cart-overlay.--open` | inuvet.css | 1647 |
| `.accordion-item.--open` | inuvet.css | 750, 758, 766 |
| `.modal-overlay.--open` | inuvet.css | 1867–1869 |
| `.search-overlay.--open` | inuvet.css | 1888 |
| `.filter-overlay.--open` | inuvet.css | 1735 |
| `.collection-sidebar.--open` | inuvet.css | 1850 |

`.mobile-menu` und `.nav-hamburger` verwenden `.open` (ohne `--`). Alle anderen verwenden `.--open`. Inkonsistente Konvention im selben System.

**`is-entering` vs. `--open` (bundle.css Zeile 51):**  
`.bundle-item.is-entering` verwendet die `is-`-Konvention (HTML-State-Konvention nach WHATWG), während das restliche System `--modifier` verwendet.

### 3.2 Magic Numbers

Hartkodierte Abstands- und Größenwerte, die nicht aus dem Token-System kommen:

| Datei | Zeile | Wert | Kontext |
|---|---|---|---|
| inuvet.css | 798 | `padding: 1.125rem var(--half-module)` | `.btn` Vertikalabstand — kein Token |
| inuvet.css | 235 | `width: clamp(3.5rem, 2rem + 5vw, 6rem)` | Logo-SVG-Größe, kein Token |
| inuvet.css | 306 | `translateY(5px)` / `translateY(-5px)` | Hamburger-Animation, kein Token |
| inuvet.css | 484 | `transform: translateY(1.5rem)` | `heroFadeUp` Keyframe |
| inuvet.css | 503 | `scale(1.05)` → `scale(1)` | `heroPanIn` Keyframe |
| inuvet.css | 652 | `padding: 0.75rem` | `.tile--product .tile__cart` |
| inuvet.css | 863 | `max-width: 28rem` | `.empty-state` |
| inuvet.css | 868 | `28rem` | `.toast` max-width |
| inuvet.css | 1120 | `font-size: 2.25rem` | `.form-upload__icon .material-icons` |
| inuvet.css | 1296 | `font-size: var(--text-m)` | `.summary-total` — OK, Token |
| inuvet.css | 1400 | `animation: marquee 24s linear` | Hardkodierte Dauer ohne Token |
| inuvet.css | 1868 | `max-width: 32rem` | `.modal` |
| inuvet.css | 2014 | `max-width: 60rem` | `.article-layout` |
| inuvet.css | 366/511/1335/1359 | `max-width: 1536px` | 4× wiederholt, kein Token |

Der Button-Padding-Wert `1.125rem` (Zeile 798) ist besonders auffällig: Er entspricht `calc(var(--base) * 1.125)` und liegt außerhalb der definierten Spacing-Skala.

Der Max-Width-Wert `1536px` erscheint 4× im Code (`.page`, `.section-type.--v3 .section-type__inner`, `.footer-main`, `.footer-bar`) ohne Token.

### 3.3 Breakpoint-Inkonsistenz

Haupt-Breakpoints in inuvet.css: `767px` (max, Mobile), `768px` (min, Desktop), `1023px` (1× für tile-grid), `1535px` (Vollbild), `480px` (1× für form-page).

`pages/bundle.css` führt einen eigenen Breakpoint `1100px` ein (Zeile 39), der nicht im System existiert. Das ist seitenspezifisch dokumentiert, aber erweitert das Breakpoint-Set inkrementell.

Inkonsistente Richtung: inuvet.css verwendet primär **max-width** (Mobile-Last), wechselt aber ab Zeile 1286 für `.actionable-input` auf **min-width** (Mobile-First). Das gilt auch für `pages/bundle.css`.

### 3.4 `!important`-Verwendungen

| Datei | Zeile | Verwendung |
|---|---|---|
| inuvet.css | 1317 | `.checkout .form-field[style*="grid-column"] { grid-column: 1 !important; }` — überschreibt Inline-Style |
| inuvet.css | 1704 | `.collection-sidebar__close { display: none !important; }` |
| inuvet.css | 1816 | `.testimonial-slider__track { transform: none !important; }` — überschreibt JS-gesetzten Transform |
| sg.css | 184 | `.spacing-bar { width: var(--sz) !important; }` — Styleguide-Util |

Die ersten drei in `inuvet.css` sind technisch notwendig (Inline-Style-Override, JS-Override), aber der `!important` in Zeile 1317 deutet auf ein Designproblem hin: Inline-Styles (`style="grid-column: span 2"`) in HTML-Templates, die per `!important` im Responsive-Fall überschrieben werden müssen.

### 3.5 Inline-Styles in HTML

**`pages/Formular-Reklamation.html`** (7 Inline-Styles):
- Zeile 68: `style="grid-column: span 2"` — Layout-Logik im HTML
- Zeile 72: `style="grid-column: span 2"` — dito
- Zeile 171, 176: `style="color:inherit;"` — auf Links (Fußzeile)
- Zeilen 190–192: JS-generiertes HTML mit Inline-Styles

**`pages/Bundle.html`** (14 Inline-Styles, davon viele JS-generiert):
- Zeile 72: `style="padding-bottom: var(--module-2xl);"` — Seitenspezifischer Abstand
- Zeile 88: `style="margin-bottom: var(--half-module);"` — Spacing-Korrektur
- Zeile 119: `style="margin-top:0; padding-top:var(--half-module); border-color:var(--border-light);"` — Überschreibung von `.summary-total`
- Zeile 315: Inline-Style auf Button für kleinere Schriftgröße

Die Inline-Styles im Bundle überschreiben teilweise Token-basierte Klassen (z.B. `.summary-total`). Das zeigt, dass die Komponenten nicht alle Layout-Varianten abdecken.

---

## Abschnitt 4 — Tote Klassen & Ungenutzte Tokens

### 4.1 Ungenutzte Custom Properties

Definitiv ungenutzt (keine `var()`-Referenz in irgendeiner Datei):

| Token | Definiert | Hinweis |
|---|---|---|
| `--ratio` | inuvet.css:8 | Modular-Scale-Faktor, wird nicht verwendet |
| `--module-3xl` | inuvet.css:76 | Definiert, keine einzige Verwendung gefunden |
| `--z-below` | inuvet.css:98 | `-1`, nirgends referenziert |

Effektiv ungenutzt in `inuvet.css` selbst, aber in anderen Dateien genutzt:

| Token | Datei der Verwendung |
|---|---|
| `--z-dropdown` | pages/bundle.css:222 |

Funktional ungenutzt als eigenständige Farben (nur als `data-cat`-Hintergrund über Light-Varianten):  
Die 14 `--cat-X`-Primärfarben (dunkel, ohne `-light`) werden in keinem `var()`-Aufruf in inuvet.css oder den Seiten-CSS-Dateien referenziert. In `styleguide.html` werden sie in Farbkarten dargestellt, aber nie als aktive CSS-Werte genutzt. Status: **deklariert, dokumentiert, aber operativ ungenutzt.**

### 4.2 Ungenutzte CSS-Klassen (vermutlich)

**In `sg.css` — nur in `styleguide.html` nutzbar:**

| Klasse | Verwendungen in styleguide.html | Status |
|---|---|---|
| `.height-demo` | 0 | Vermutlich ungenutzt |
| `.height-card` | 0 | Vermutlich ungenutzt |
| `.height-viz` | 0 | Vermutlich ungenutzt |

Diese drei Klassen sind in `sg.css` (Zeilen 102–111) definiert, erscheinen aber nicht in `styleguide.html`. Möglicherweise wurden sie entfernt oder sind für eine geplante Sektion reserviert.

**In `inuvet.css` — möglicherweise ungenutzt:**

| Klasse | Verwendung | Hinweis |
|---|---|---|
| `.h1` | 0 in allen HTML-Dateien | Visuelle Heading-Klasse, nur dokumentiert nicht genutzt |
| `.h2` | 0 in allen HTML-Dateien | Dito |
| `.product-thumb-wrap` | Nur in bundle.css erwähnt | Atom für Cart+Listings |
| `.cart-item__counter` | Nur definiert, kein Fund in HTML | Zeile 1694 |
| `.order-item__link` | Nur in styleguide.html | Kein Mockup-Einsatz |
| `.article__tags` | Nur in inuvet.css | Kein HTML-Fund |
| `.pdp__oos-badge` | Nur in inuvet.css | Out-of-Stock-Zustand, kein Mockup |
| `.testimonial-more` | Nur in styleguide.html | Mobil-Trigger |

---

## Abschnitt 5 — Komponenten-Struktur

| Komponente | Basis-Klasse | Modifier / Varianten | Namenskonvention | Zeile (inuvet.css) |
|---|---|---|---|---|
| Announcement Bar | `.announcement-bar` | `.--closed` | -- | 163 |
| Navigation | `.site-nav` | — | — | 204 |
| Mobile Menu | `.mobile-menu` | `.open` (inkonsistent, nicht `--open`) | State-Inkonsistenz | 311 |
| Badge | `.badge` | `.--dark`, `.--sale`, `.--pill`, `.--free`, `.--count` | BEM-ähnlich mit `--` | 250 |
| Icon Badged | `.icon-badged` | — | Flat | 245 |
| Section Type | `.section-type` | `.--v1`, `.--v2`, `.--v3`, `.--viewport`, `.--reverse` | -- | 400 |
| Tile Grid | `.tile-grid` | `.--cols-2`, `.--cols-3`, `.--cols-4`, `.--boxed` | -- | 556 |
| Tile | `.tile` | `.--featured`, `.--product` | -- | 571 |
| Accordion | `.accordion` | `.accordion-item.--open` | BEM + -- | 721 |
| Tabs | `.tabs` | `.tab-btn.--active`, `.tab-panel.--active` | BEM + -- | 779 |
| Button | `.btn` | `.--primary`, `.--secondary`, `.--ghost`, `.--full`, `.--icon`, `.--with-icon`, `.--disabled` | -- | 792 |
| Rating | `.rating` | — | Flat | 854 |
| Price Stack | `.price-stack` | `.--old` | -- | 859 |
| Empty State | `.empty-state` | — | Flat | 863 |
| Shipping Hint | `.shipping-hint` | — | Flat | 868 |
| Pagination | `.pagination` | `.--current` | -- | 872 |
| Breadcrumb | `.breadcrumb` | `.--current` | -- | 880 |
| Toast | `.toast` | `.--success`, `.--error`, `.--info`, `.--out` | -- | 889 |
| Form Field | `.form-field` | `.--error`, `.--success` | -- | 901 |
| Form Check | `.form-check` | — | Flat | 1037 |
| Form Grid | `.form-grid` | `.--full` | -- | 1060 |
| Color Context | `.--on-green` | — | Utility | 1076 |
| Form Upload | `.form-upload` | `.--dragover` | -- | 1092 |
| Icon Box | `.icon-box` | `.--sm`, `.--md`, `.--lg` | -- | 1162 |
| Choice Box | `.choice-box` | `.--active`, `.--block` | -- | 1175 |
| Placeholder BG | `.placeholder-bg` | — | Flat | 1197 |
| Quantity Selector | `.qty-selector` | `.--sm` | -- | 1207 |
| Section Label | `.section-label` | — | Flat | 1220 |
| Label Caps | `.label-caps` | — | Flat | 1224 |
| Check List | `.check-list` | — | Flat | 1227 |
| Line / Divider | `.line` | `.--structural`, `.--light`, `.--dashed` | -- | 1249 |
| Spacing Utilities | `.mt-half`, `.mt-1`, `.mt-2`, `.mb-half`, `.mb-1` | — | Flat-Utility | 1254 |
| Newsletter | `.newsletter` | — | Flat | 1265 |
| Actionable Input | `.actionable-input` | — | Flat | 1277 |
| Summary Line | `.summary-line` | — | Flat | 1294 |
| Summary Total | `.summary-total` | — | Flat | 1296 |
| Checkout | `.checkout` | — | Flat | 1305 |
| Footer | `.site-footer` | — | BEM | 1323 |
| Marquee | `.marquee` | `.--green`, `.--dark` | -- | 1388 |
| Testimonial Grid | `.testimonial-grid` | `.--cols-3`, `.--cols-4` | -- | 1428 |
| Testimonial | `.testimonial` | `.--visible` | -- | 1436 |
| Testimonial Slider | `.testimonial-slider` | `.--cols-3`, `.--cols-4`, `.--on-green` | -- | 1496 |
| PDP | `.pdp` | — | BEM | 1567 |
| Cart Overlay | `.cart-overlay` | `.--open` | -- | 1646 |
| Cart Drawer | `.cart-drawer` | `.--open` | -- | 1648 |
| Cart Item | `.cart-item` | — | Flat | 1664 |
| Product Thumb | `.product-thumb` | — | Flat | 1666 |
| Collection Layout | `.collection-layout` | — | Flat | 1700 |
| Filter Tag | `.filter-tag` | — | Flat | 1709 |
| Modal | `.modal` | — | Flat | 1868 |
| Search Overlay | `.search-overlay` | `.--open` | -- | 1879 |
| Search Panel | `.search-panel` | — | BEM | 1891 |
| Blog Grid | `.blog-grid` | — | Flat | 2000 |
| Blog Card | `.blog-card` | — | BEM | 2004 |
| Article Layout | `.article-layout` | — | Flat | 2014 |
| Form Page | `.form-page` | — | BEM | 2039 |
| Order Item | `.order-item` | — | Flat | 1981 |
| Cookie Banner | `.cookie-banner` | — | Flat | 1991 |

**Systematisch (via `--modifier`):** ~80% der Komponenten  
**Abweichungen:** `.mobile-menu.open`, `.nav-hamburger.open`, `.bundle-item.is-entering`

---

## Abschnitt 6 — Architektur-Einschätzung

### 6.1 Primitive → Semantic → Component Schichtung

**Erkennbar:** Die `:root`-Tokens sind in primitive Werte (`--base`, `--module`, `--text-xs`) und semantisch abgeleitete Aliases (`--fg`, `--bg`, `--border-focus`) unterteilt. Das ist eine gute Basis.

**Wo die Schichtung gebrochen ist:**

1. **Keine explizite Semantic-Schicht für Spacing:** Es gibt `--base` und `--module`, aber kein `--spacing-xs/sm/md/lg/xl`-Mapping. Components greifen direkt auf `calc(var(--base) * 0.25)` etc. zu. Das ist 30+ mal in inuvet.css zu finden. Jede Komponente rechnet selbst, statt auf semantische Spacing-Tokens zu zeigen.

2. **Kategorie-Farben sind Primitive ohne Semantic-Mapping:** `--cat-herz: #FF6D6A` ist ein roher Farbwert. Es gibt kein `--cat-herz-bg` oder `--cat-herz-text` für den semantischen Einsatz. Die 14 dunklen `--cat-X`-Tokens haben keine aktive CSS-Verwendung (s. Abschnitt 4).

3. **Fehlende Font-Weight-Tokens:** Alle `font-weight`-Werte sind hartkodiert als `700`/`400`. Ein `--fw-bold` / `--fw-regular` fehlt — das ist kein kritisches Problem beim aktuellen Umfang, limitiert aber zukünftige Anpassungen.

4. **Max-Width nicht als Token:** `1536px` (Container-Breite) erscheint 4× hartkodiert.

### 6.2 Framework-Agnostizität

Das System ist CSS-nativ ohne Framework-Abhängigkeiten. Es funktioniert direkt in:
- **Shopify** (Liquid-Templates: CSS-Klassen können direkt übernommen werden)
- **HTML-Landing-Pages** (wie die vorhandenen Mockups belegen)
- **Web-Apps** (Vanilla-HTML-kompatibel)

Die Verwendung von `data-cat`-Attributen für Kategorie-Hintergrundfarben ist ein pragmatisches Pattern, das in Shopify-Kontexten gut funktioniert.

### 6.3 Was für eine neue Web-App fehlt

| Bereich | Fehlt | Aufwand |
|---|---|---|
| **Dark Mode** | Keine `prefers-color-scheme: dark` Media Query, kein Token-Override | M |
| **Loading/Skeleton States** | Kein Skeleton-Pattern, kein `--loading`-State für Komponenten | M |
| **Disabled States global** | `.btn:disabled` ist definiert; aber `.form-field--disabled`, `choice-box--disabled` fehlen | S |
| **Focus-Visible konsistent** | `:focus-visible` global auf `--green` gesetzt, aber in `.form-field` wird das outline auf `none` gesetzt (Zeile 948–950). Das kann Accessibility-Probleme erzeugen. | S |
| **Warning/Info-Farbtoken** | Nur Error vorhanden. `--color-warning`, `--color-info`, `--color-success` fehlen als Tokens (Toast nutzt `--green`, was kein semantisches Token ist) | M |
| **Breakpoint-Tokens** | Keine CSS Custom Properties für Breakpoints (nicht native möglich, aber als JS-zugängliche Werte oder SASS-Variablen denkbar) | L |
| **Grid-System für Web-App-Layouts** | `.col-grid` nur für Styleguide-Demo; `.tile-grid` für Listen; kein generisches App-Layout-Grid | M |
| **Scroll-Overflow-Patterns** | Kein `.overflow-y-auto`, `.scroll-area` etc. | S |
| **Print-Styles** | Keine `@media print` | L |

---

## Abschnitt 7 — Top-10 Prioritäten

Sortiert nach Impact (hoch → niedrig). Aufwand: **S** = <2h, **M** = halber Tag, **L** = >1 Tag.

| # | Problem | Impact | Aufwand | Datei / Zeile |
|---|---|---|---|---|
| 1 | **State-Klasse `.open` vs. `.--open` vereinheitlichen.** `.mobile-menu` und `.nav-hamburger` verwenden `.open` (ohne `--`), alle anderen verwenden `.--open`. Das erfordert Anpassungen im HTML und JS aller Mockups, aber ist für Konsistenz und Framework-Übergabe kritisch. | Hoch | M | inuvet.css:306–308, 325, 341 |
| 2 | **`--ratio` und `--module-3xl` entfernen oder tatsächlich verwenden.** Beide Tokens sind definiert aber nie genutzt. `--ratio: 1.5` legt nahe, dass ein Modular-Scale-System geplant war, aber nie vollständig umgesetzt wurde. Klare Entscheidung nötig. | Hoch | S | inuvet.css:8, 76 |
| 3 | **`--text-sm` in `Tierarzt-Empfehlung-Mockup.css` ist undefiniert.** `font-size: var(--text-sm)` (Zeile 65) referenziert ein nicht existierendes Token. Der Browser fällt auf `font-size: inherit` zurück. Entweder Token definieren oder `var(--text-xs)` verwenden. | Hoch | S | pages/Tierarzt-Empfehlung-Mockup.css:65 |
| 4 | **Max-Container-Breite `1536px` als Token extrahieren.** 4 separate Vorkommen im Code. Ein `--container-max` Token würde spätere Größenanpassungen auf einen Wert reduzieren. | Mittel | S | inuvet.css:366, 511, 1335, 1359 |
| 5 | **Warnfarben in `bundle.css` als Tokens definieren.** `#feffdc` und `#ffce00` (.warning-banner) sind hartkodiert. Entweder als `--color-warning` / `--color-warning-border` in `:root` oder als Bundle-lokale Custom Properties. | Mittel | S | pages/bundle.css:211–212 |
| 6 | **`rgba(0,0,0,0.4)` und `rgba(255,255,255,0.6)` als Tokens erfassen.** Beide Werte erscheinen mehrfach im Code. Je ein Token (`--overlay-bg` und `--glass-bg`) würde Konsistenz gewährleisten. | Mittel | S | inuvet.css:1088, 1489, 1554, 1591, 1646, 1734 |
| 7 | **`focus-visible`-Konflikt im Form-Field bereinigen.** `:focus-visible` setzt global `outline: 2px solid var(--green)`, aber `.form-field input:focus-visible` setzt `outline: none` (Zeile 948–950). Das lässt Inputs ohne sichtbares Focus-Indikator für Tastaturnutzer. Stattdessen sollte der Float-Label-Focus visuell ausreichend sein, oder es braucht eine alternative Fokus-Indikation. | Mittel | S | inuvet.css:935–950 |
| 8 | **`.col-grid` aus `bundle.css` mit Prefix isolieren.** Bundle.css redeklariert `.col-grid` mit anderem Verhalten (`minmax(0, 1fr)` statt `1fr`). Das kann zu unerwarteten Kaskaden-Problemen führen, wenn beide Sheets zusammen geladen werden. `.bundle-col-grid` oder ein Wrapper-Kontext wäre sicherer. | Mittel | S | pages/bundle.css:36–40 |
| 9 | **`.text-muted` Duplizierung zwischen `inuvet.css` und `sg.css` auflösen.** Entweder aus `sg.css` entfernen (wenn `inuvet.css` immer eingebunden ist) oder dokumentieren, dass `sg.css` immer nach `inuvet.css` geladen wird und die Regel redundant ist. | Niedrig | S | inuvet.css:392, sg.css:147 |
| 10 | **Hartkodierte Transitions in `mockup-ui.css` und `Tierarzt-Empfehlung-Mockup.css` auf Token umstellen.** `mockup-ui.css` ist bewusst kein Produktionscode, aber `Tierarzt-Empfehlung-Mockup.css` Zeile 68 (`transition: border-color 0.12s, background 0.12s, color 0.12s`) und Zeile 30 (`transition: transform 0.2s ease`) umgehen das `--anim-*`-Token-System. | Niedrig | S | pages/Tierarzt-Empfehlung-Mockup.css:68, mockup-ui.css:30 |

---

*Report-Ende. Keine bestehenden Dateien wurden geändert.*
