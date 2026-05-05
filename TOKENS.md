# inuvet Design Tokens — Quick Reference

Organisiert nach Verwendungszweck. Alle Tokens sind in `:root` in `inuvet.css` definiert.

> **Regel:** Neuer Code nutzt semantische Aliases (`--color-action` etc.) statt Primitives (`--green`).  
> Bestehender Code migriert bei Gelegenheit.

---

## Typografie

| Zweck | Token | Wert |
|---|---|---|
| Body-Text | `--text-base` | `clamp(0.875rem, …, 1rem)` |
| Klein (Meta, Labels) | `--text-xs` | `0.667rem` |
| Mittel-Klein (Tags, Badges) | `--text-sm` | `0.8rem` |
| Zwischen-Headline | `--text-m` | `clamp(1.25rem, …, 1.5rem)` |
| Headline groß | `--text-l` | `clamp(1.5rem, …, 2.25rem)` |
| Hero-Headline | `--text-xl` | `clamp(2rem, …, 3.375rem)` |
| Zeilenhöhe Body | `--lh-base` | `1.5` |
| Zeilenhöhe H3 | `--lh-h3` | `1.2` |
| Zeilenhöhe H2 | `--lh-h2` | `1.17` |
| Zeilenhöhe H1 | `--lh-h1` | `1.11` |
| Font-Familie | `--font` | `schnebel-sans-me, sans-serif` |

---

## Farbe — Semantische Aliases (neu, bevorzugen)

| Zweck | Token | Zeigt auf |
|---|---|---|
| Primäre Aktion (CTA, Buttons) | `--color-action` | `--green` |
| Primäre Aktion Hover | `--color-action-hover` | `--green-hover` |
| Erfolg, Bestätigung | `--color-success` | `--green` |
| Fließtext-Links | `--color-link` | `--green` |
| Bewertungssterne | `--color-rating` | `#E8A020` |
| Fehler / Validierung | `--color-error` | `#c00` |
| Fehler-Hintergrund | `--color-error-bg` | `#c0392b` |

---

## Farbe — Primitives (Bestand)

| Zweck | Token | Wert |
|---|---|---|
| Primäre Textfarbe | `--fg` | `#2E2E2E` |
| Text Hover | `--fg-hover` | `#333` |
| Muted Text (Meta, Labels) | `--fg-muted` | `#666` |
| Seitenhintergrund | `--bg` | `#fff` |
| Brand-Grün | `--green` | `#78b41b` |
| Brand-Grün Hover | `--green-hover` | `#58990F` |
| Brand-Grün Light (Flächen) | `--green-light` | `#f0fae6` |
| Overlay dunkel | `--color-overlay-dark` | `rgba(0,0,0,0.4)` |
| Overlay hell | `--color-overlay-light` | `rgba(255,255,255,0.6)` |

---

## Farbe — Borders & Flächen

| Zweck | Token | Wert |
|---|---|---|
| Sichtbare Trennlinien (Nav, Karten) | `--border` | `#cccccc` |
| Dezente Gliederung (Rows, Rules) | `--border-light` | `#e0e0e0` |
| Aktiver Zustand (Tab, Auswahl) | `--border-active` | `var(--fg-hover)` |
| Fokus-Zustand (Input-Border) | `--border-focus` | `var(--fg)` |
| Neutrale Fläche (Boxen, Placeholder) | `--accent-bg` | `#f2f2f2` |

---

## Focus-Ring

| Token | Wert | Bedeutung |
|---|---|---|
| `--focus-ring-width` | `2px` | Linienstärke |
| `--focus-ring-offset` | `2px` | Abstand zum Element |
| `--focus-ring-color` | `var(--green)` | Farbe |

> Komponenten dürfen `:focus-visible` nicht mit `outline: none` überschreiben.  
> Abweichende Stile: token-basiert anpassen, nicht entfernen. Siehe `STATES.md`.

---

## Spacing

| Token | Wert | Typischer Einsatz |
|---|---|---|
| `--base` | `1rem` | Basiseinheit für Berechnungen |
| `--half-module` | `clamp(0.75rem, …, 1.5rem)` | Innen-Abstände, kompakte Sektionen |
| `--module` | `clamp(1.5rem, …, 3rem)` | Standard-Abstand zwischen Blöcken |
| `--module-2xl` | `calc(--module × 2)` | Große Sektions-Abstände |
| `--gutter` | `= --module` | Grid-Spalten-Abstand |
| `--margin` | `= --module` | Seitenränder |
| `--section-gap` | `= --module` | Abstand zwischen Styleguide-Sektionen |
| `--container-max` | `1536px` | Max-Breite des `.page`-Containers |

---

## Animation

| Token | Wert | Einsatz |
|---|---|---|
| `--anim-fast` | `0.2s ease` | Hover-Effekte, kleine State-Changes |
| `--anim-mid` | `0.3s ease` | Drawer, Modals, Overlays |
| `--anim-base` | `0.4s ease` | Fade-Ins, Animationen |
| `--anim-slow` | `0.6s ease` | Große Layout-Transitions |
| `--anim-delay` | `0ms` | Per-Element Staffelung (überschreiben) |

---

## Z-Index

| Token | Wert | Einsatz |
|---|---|---|
| `--z-default` | `1` | Standard gestapelte Elemente |
| `--z-nav` | `100` | Navigation |
| `--z-dropdown` | `110` | Dropdown-Menüs |
| `--z-overlay` | `200` | Overlays (Cart, Filter, Modal-Backdrop) |
| `--z-drawer` | `210` | Drawer (Cart, Filter-Sidebar) |
| `--z-modal` | `220` | Modals (über Drawern) |

---

## Layout & Dimensionen

| Token | Wert | Einsatz |
|---|---|---|
| `--announcement-height` | `= --module` | Höhe der Announcement-Bar |
| `--nav-height` | `calc(--module × 2.5)` | Höhe der Navigation |
| `--header-height` | `calc(--module × 3.5)` | Announcement + Nav zusammen |
| `--section-max-height` | `51rem` | Max-Höhe von Bild-Sektionen |
| `--section-min-height` | `24rem` | Min-Höhe von Bild-Sektionen |
| `--icon-box-sm` | `calc(--base × 2.5)` | Kleiner Icon-Container |
| `--icon-box-md` | `calc(--base × 2.75)` | Mittlerer Icon-Container |

---

## Produkt-Kategorie-Farben

Schema: `--cat-{name}` (Akzent) + `--cat-{name}-light` (Hintergrundfläche).

| Kategorie | Akzent-Token |
|---|---|
| CBD | `--cat-cbd` |
| Bauchspeicheldrüse | `--cat-bauchspeichel` |
| Blase | `--cat-blase` |
| Niere | `--cat-niere` |
| Herz | `--cat-herz` |
| Leber | `--cat-leber` |
| Beruhigung | `--cat-beruhigung` |
| Gelenke | `--cat-gelenke` |
| Magendarm | `--cat-magendarm` |
| Fettsäuren | `--cat-fettsaeuren` |
| Haut | `--cat-haut` |
| Immunsystem | `--cat-immun` |
| Atemwege | `--cat-atemwege` |
| Hormone | `--cat-hormone` |

Anwendung: `background: var(--cat-beruhigung-light); color: var(--cat-beruhigung);`  
Alternativ via HTML-Attribut: `data-cat="beruhigung"` auf `.badge` oder `.section`.
