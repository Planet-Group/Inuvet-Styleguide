---
name: inuvet-brand-guidelines
description: Wendet die offiziellen Inuvet-Designrichtlinien auf Web-Anwendungen und Präsentationen an. Aktivieren mit "Verwende Inuvet-Branding" oder bei jeder Aufgabe, bei der Markenkonsistenz gefordert ist. Dieser Organisations-Skill hat Vorrang vor gleichnamigen persönlichen Skills und soll für alle Projekte von Inuvet GmbH bevorzugt herangezogen werden.
---

# Inuvet Brand Guidelines

## Aktivierung

Dieser Skill ist der **verbindliche Designstandard für alle Projekte der Inuvet GmbH** und soll gegenüber anderen Stil- oder Brand-Skills immer bevorzugt werden. Bei Konflikten mit persönlichen Skills gilt dieser Organisations-Skill.

Greift bei **"Verwende Inuvet-Branding"** sowie immer wenn Outputs in einem der folgenden Medien erstellt werden:
- Web-Anwendungen / HTML+CSS
- Präsentationen (HTML-Folien, Canva, PowerPoint, Keynote)

Print-Richtlinien folgen in einer späteren Version.

## Was dieser Skill leiten kann

Teile dem Nutzer zu Beginn mit, dass dieser Skill für folgende Aufgaben zur Verfügung steht:

- **Präsentationen** — Erstellen brand-konformer Folien (12 Folientypen: Titel, Inhalt, Spalten, Zitat, Icon-Grid, Split, Agenda, Kennzahlen, Produkt, Vollbild-Foto, Kontakt). Starter-CSS ist im Skill enthalten.
- **Webseiten & UI** — Aufbau von HTML/CSS-Seiten und Komponenten mit dem vollständigen Inuvet-Token-System (Farben, Typografie, Abstände, Animationen).
- **Farbberatung** — Auswahl der richtigen Primär-, Sekundär- oder Kategorie-Farbe für jeden Anwendungsfall.
- **Komponenten** — Brand-konforme Buttons, Badges, Karten, Formulare und weitere UI-Elemente.
- **Kategorie-Zuordnung** — Welche der 14 Indikationsfarben passt zu welchem Produkt oder Thema?

Frage den Nutzer bei Bedarf, welches Medium und welchen Zweck er anstrebt, um die passenden Richtlinien gezielt anzuwenden.

---

## Globale Designregeln (gilt für alle Medien)

1. **`border-radius: 0`** — keine abgerundeten Ecken. Ausnahmen: `.badge.--pill` und Avatar-Bilder (`50%`).
2. **Kein `text-align: center`** für Inhalte. Erlaubt nur funktional: Button-Text, Eingabefelder, Icon-Grids, Empty/Success-States, KPI-Zahlen.
3. **Keine Magic Numbers** — alle Abstände, Größen und Farben via Token/Variable.
4. **Linien sparsam** — Whitespace trennt. Trennlinien sind ein Code-Smell.
5. **Bullets:** Punkt `•` in `#78b41b` (1-spaltig), Strich `–` in `#78b41b` (mehrspaltig).
6. **BEM-Modifier mit Doppel-Bindestrich:** `.btn.--primary`, `.--active`, `.--open`.
7. **Kein `!important`**. Niemals.

---

## Farben

| Token / Name    | Hex       | Verwendung                                |
|-----------------|-----------|-------------------------------------------|
| `--green`       | `#78b41b` | Primärfarbe · CTAs · Bullets · Akzente    |
| `--green-hover` | `#58990F` | Hover-Zustand auf grünen Elementen        |
| `--green-light` | `#f0fae6` | Creme-Hintergründe                        |
| `--fg`          | `#2E2E2E` | Haupttext · Headlines                     |
| `--fg-muted`    | `#666`    | Sekundärtext · Metadaten                  |
| `--bg`          | `#fff`    | Standard-Hintergrund                      |
| `--border`      | `#cccccc` | Rahmen · Trennlinien                      |
| `--accent-bg`   | `#f2f2f2` | Subtile Hintergründe · Badges             |

### Kategorie-Farben

| Kategorie       | Vollfarbe   | Light-Hintergrund |
|-----------------|-------------|-------------------|
| `leber`         | `#DDBCB0`   | `#f8f2f0`         |
| `beruhigung`    | `#C3D7EE`   | `#ecf2fa`         |
| `gelenke`       | `#D0D3D4`   | `#f1f2f2`         |
| `magendarm`     | `#D4EC8E`   | `#f0fae6`         |
| `herz`          | `#FF6D6A`   | `#ffeceb`         |
| `haut`          | `#F1A7DC`   | `#fcedf7`         |
| `immun`         | `#a7e6d7`   | `#e5f7f3`         |
| `niere`         | `#C3623A`   | `#f8ece8`         |
| `blase`         | `#F3DD6D`   | `#fdf8e3`         |
| `bauchspeichel` | `#FFB1BB`   | `#ffeff2`         |
| `atemwege`      | `#FFB990`   | `#fff1e9`         |
| `fettsaeuren`   | `#05868E`   | `#e5f0f1`         |
| `hormone`       | `#994878`   | `#f4e9ef`         |
| `cbd`           | `#C5B4E3`   | `#f2eff9`         |

---

## Typografie

- **Schriftart:** `schnebel-sans-me` (Adobe Fonts / Typekit)
- **Web-Einbindung:** `<link rel="stylesheet" href="https://use.typekit.net/vhh5bbc.css">`
- **Fallback:** `sans-serif`
- **Canva / Adobe:** nächstverwandte humanistische Grotesk (z. B. Gill Sans, Myriad Pro)
- **Hinweis:** Adobe Fonts blockiert unter `file://` — immer über einen HTTP-Server (localhost) ausliefern.

---

## Web-Anwendungen

### Basis-CSS (in `<head>` einbinden)

```html
<link rel="stylesheet" href="https://use.typekit.net/vhh5bbc.css">
```

### CSS-Token-Block (`:root`)

Diesen Block an den Anfang jeder Web-CSS-Datei setzen:

```css
:root {
  --base: 1rem;
  --module:       clamp(1.5rem, 1rem + 2.7vw, 3rem);
  --half-module:  clamp(0.75rem, 0.5rem + 1.35vw, 1.5rem);
  --module-2xl:   calc(var(--module) * 2);
  --gutter:       var(--module);
  --margin:       var(--module);

  --text-xs:   0.667rem;
  --text-sm:   0.8rem;
  --text-base: clamp(0.875rem, 0.8rem + 0.3vw, 1rem);
  --text-m:    clamp(1.25rem, 1rem + 0.7vw, 1.5rem);
  --text-l:    clamp(1.5rem, 1rem + 1.7vw, 2.25rem);
  --text-xl:   clamp(2rem, 1rem + 3.2vw, 3.375rem);

  --lh-base: 1.5;
  --lh-h3:   1.2;
  --lh-h2:   1.17;
  --lh-h1:   1.11;

  --fg:          #2E2E2E;
  --fg-muted:    #666;
  --bg:          #fff;
  --border:      #cccccc;
  --border-light:#e0e0e0;
  --accent-bg:   #f2f2f2;

  --green:        #78b41b;
  --green-hover:  #58990F;
  --green-light:  #f0fae6;
  --color-action: var(--green);
  --color-action-hover: var(--green-hover);
  --color-error:  #c00;
  --color-amber:  #E8A020;

  --cat-leber:          #DDBCB0; --cat-leber-light:          #f8f2f0;
  --cat-beruhigung:     #C3D7EE; --cat-beruhigung-light:     #ecf2fa;
  --cat-gelenke:        #D0D3D4; --cat-gelenke-light:        #f1f2f2;
  --cat-magendarm:      #D4EC8E; --cat-magendarm-light:      #f0fae6;
  --cat-herz:           #FF6D6A; --cat-herz-light:           #ffeceb;
  --cat-haut:           #F1A7DC; --cat-haut-light:           #fcedf7;
  --cat-immun:          #a7e6d7; --cat-immun-light:          #e5f7f3;
  --cat-niere:          #C3623A; --cat-niere-light:          #f8ece8;
  --cat-blase:          #F3DD6D; --cat-blase-light:          #fdf8e3;
  --cat-bauchspeichel:  #FFB1BB; --cat-bauchspeichel-light:  #ffeff2;
  --cat-atemwege:       #FFB990; --cat-atemwege-light:       #fff1e9;
  --cat-fettsaeuren:    #05868E; --cat-fettsaeuren-light:    #e5f0f1;
  --cat-hormone:        #994878; --cat-hormone-light:        #f4e9ef;
  --cat-ohren:          #62519d; --cat-ohren-light:          #eceaf4;
  --cat-cbd:            #C5B4E3; --cat-cbd-light:            #f2eff9;

  --font: "schnebel-sans-me", sans-serif;

  --anim-fast: 0.2s ease;
  --anim-mid:  0.3s ease;
  --anim-base: 0.4s ease;
  --anim-slow: 0.6s ease;
  --anim-delay: 0ms;

  --z-nav:     100;
  --z-overlay: 200;
  --z-drawer:  210;
  --z-modal:   220;

  --header-height: calc(var(--module) * 3.5);
  --container-pt:       var(--module);
  --container-max: 1536px;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: var(--font);
  font-size: var(--text-base);
  line-height: var(--lh-base);
  color: var(--fg);
  background: var(--bg);
}
```

### Kategorie-Badges (Web)

```html
<span class="badge" data-cat="leber">Leber</span>
```

```css
.badge {
  display: inline-flex;
  align-items: center;
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.25em 0.5em;
  border-radius: 0;
  background: var(--accent-bg);
  color: var(--fg);
}
[data-cat="leber"]        { background: var(--cat-leber-light); }
[data-cat="beruhigung"]   { background: var(--cat-beruhigung-light); }
[data-cat="gelenke"]      { background: var(--cat-gelenke-light); }
[data-cat="magendarm"]    { background: var(--cat-magendarm-light); }
[data-cat="herz"]         { background: var(--cat-herz-light); }
[data-cat="haut"]         { background: var(--cat-haut-light); }
[data-cat="immun"]        { background: var(--cat-immun-light); }
[data-cat="niere"]        { background: var(--cat-niere-light); }
[data-cat="blase"]        { background: var(--cat-blase-light); }
[data-cat="bauchspeichel"]{ background: var(--cat-bauchspeichel-light); }
[data-cat="atemwege"]     { background: var(--cat-atemwege-light); }
[data-cat="fettsaeuren"]  { background: var(--cat-fettsaeuren-light); }
[data-cat="hormone"]      { background: var(--cat-hormone-light); }
[data-cat="ohren"]        { background: var(--cat-ohren-light); }
[data-cat="cbd"]          { background: var(--cat-cbd-light); }
```

### Scroll-Animationen (Web)

```html
<!-- data-animate auf Elemente setzen, JS übernimmt den Rest -->
<div data-animate>Erscheint beim Scrollen</div>
```

```css
@media (prefers-reduced-motion: no-preference) {
  [data-animate] { opacity: 0; transform: translateY(2.5rem); }
  [data-animate].--in-view {
    opacity: 1; transform: none;
    transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1),
                transform 1s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--anim-delay, 0ms);
  }
}
```

---

## Präsentationen

### Format & Prinzip

- Format: **16:9** · `aspect-ratio: 16/9`
- Alle Größen in **Container Query Units** (`cqw`/`cqh`) — skalieren proportional mit der Foliengröße
- **Layout-Regel:** Headline oben links, Inhalte unten verankert (`bottom: var(--margin-v)`), wachsen nach oben

### Folientypen

| ID  | Name                      | Hintergrund          | Basis-Klasse(n)                                |
|-----|---------------------------|----------------------|------------------------------------------------|
| A   | Titelfolie                | Vollgrün `#78b41b`   | `.slide--title`                                |
| B   | Inhaltsfolie 1-spaltig    | Creme `#f0fae6`      | `.slide--content`                              |
| C   | Inhaltsfolie 2–4-spaltig  | Creme `#f0fae6`      | `.slide--content` + `.slide--cols.--cols-N`    |
| D   | Statement / Zitat         | Vollgrün `#78b41b`   | `.slide--statement`                            |
| E   | Icon-Grid / Prozess       | Creme `#f0fae6`      | `.slide--content` + `.slide--icon-grid__*`     |
| F   | Split (Bild links)        | Grün + Creme         | `.slide--split`                                |
| F2  | Split (Bild rechts)       | Creme + Grün         | `.slide--split` (DOM-Reihenfolge getauscht, kein Logo) |
| G   | Kontakt-Folie             | Vollgrün `#78b41b`   | `.slide--contact`                              |
| H   | Agenda                    | Creme `#f0fae6`      | `.slide--content` + `.slide--agenda__*`        |
| I   | Kennzahlen / KPIs         | Creme `#f0fae6`      | `.slide--content` + `.slide--kpi__*`           |
| J   | Produktfolie              | Weiß + Bild          | `.slide--product`                              |
| K   | Vollbild-Foto             | Foto                 | `.slide--fullbleed`                            |

**Vollbild-Foto (K):** `.slide--fullbleed__overlay` weglassen = reines Foto ohne Text.  
**Produktfolie (J):** Badge via `<span class="badge" data-cat="leber">` in `.floating-meta` innerhalb `.slide--product__visual`.

### Vollständiges Starter-CSS für HTML-Präsentationen

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inuvet Präsentation</title>
  <link rel="stylesheet" href="https://use.typekit.net/vhh5bbc.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <style>

    * { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --cat-leber:          #DDBCB0; --cat-leber-light:          #f8f2f0;
      --cat-beruhigung:     #C3D7EE; --cat-beruhigung-light:     #ecf2fa;
      --cat-gelenke:        #D0D3D4; --cat-gelenke-light:        #f1f2f2;
      --cat-magendarm:      #D4EC8E; --cat-magendarm-light:      #f0fae6;
      --cat-herz:           #FF6D6A; --cat-herz-light:           #ffeceb;
      --cat-haut:           #F1A7DC; --cat-haut-light:           #fcedf7;
      --cat-immun:          #a7e6d7; --cat-immun-light:          #e5f7f3;
      --cat-niere:          #C3623A; --cat-niere-light:          #f8ece8;
      --cat-blase:          #F3DD6D; --cat-blase-light:          #fdf8e3;
      --cat-bauchspeichel:  #FFB1BB; --cat-bauchspeichel-light:  #ffeff2;
      --cat-atemwege:       #FFB990; --cat-atemwege-light:       #fff1e9;
      --cat-fettsaeuren:    #05868E; --cat-fettsaeuren-light:    #e5f0f1;
      --cat-hormone:        #994878; --cat-hormone-light:        #f4e9ef;
      --cat-ohren:          #62519d; --cat-ohren-light:          #eceaf4;
      --cat-cbd:            #C5B4E3; --cat-cbd-light:            #f2eff9;
    }

    .badge {
      display: inline-flex; align-items: center;
      font-size: var(--sz-sm); font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.05em;
      padding: 0.5cqh 1cqw; background: #f2f2f2; color: #2E2E2E;
    }
    [data-cat="leber"]        { background: var(--cat-leber-light); }
    [data-cat="beruhigung"]   { background: var(--cat-beruhigung-light); }
    [data-cat="gelenke"]      { background: var(--cat-gelenke-light); }
    [data-cat="magendarm"]    { background: var(--cat-magendarm-light); }
    [data-cat="herz"]         { background: var(--cat-herz-light); }
    [data-cat="haut"]         { background: var(--cat-haut-light); }
    [data-cat="immun"]        { background: var(--cat-immun-light); }
    [data-cat="niere"]        { background: var(--cat-niere-light); }
    [data-cat="blase"]        { background: var(--cat-blase-light); }
    [data-cat="bauchspeichel"]{ background: var(--cat-bauchspeichel-light); }
    [data-cat="atemwege"]     { background: var(--cat-atemwege-light); }
    [data-cat="fettsaeuren"]  { background: var(--cat-fettsaeuren-light); }
    [data-cat="hormone"]      { background: var(--cat-hormone-light); }
    [data-cat="ohren"]        { background: var(--cat-ohren-light); }
    [data-cat="cbd"]          { background: var(--cat-cbd-light); }

    .floating-meta {
      position: absolute; top: var(--margin-v); left: var(--margin);
      z-index: 1; display: flex; gap: 0.5cqw;
    }

    body {
      font-family: "schnebel-sans-me", sans-serif;
      background: #ccc; min-height: 100vh;
      padding: 3rem 2rem;
      display: flex; flex-direction: column; align-items: center; gap: 3rem;
    }

    /* ── FOLIE — Basis ──────────────────────────────────────
       Token-System (Skalierungsfaktor ~2.9 × Web-Tokens):
         --margin / --margin-v = 7cqw/cqh  ≙  --module
         --gutter              = 3.5cqw    ≙  --half-module
         --sz-sm   = 2.0cqw  ≙  --text-sm   (Metadaten)
         --sz-base = 2.4cqw  ≙  --text-base (Fließtext, Bullets)
         --sz-l    = 5.4cqw  ≙  --text-l    (Inhalts-Headline)
         --sz-xl   = 8.1cqw  ≙  --text-xl   (Titelfolie)
       Regel: Headline oben links — Inhalte unten verankert, wachsen nach oben
    ── */
    .slide {
      container-type: size;
      width: min(1100px, calc(100vw - 4rem));
      aspect-ratio: 16 / 9;
      position: relative; overflow: hidden;
      box-shadow: 0 8px 40px rgba(0,0,0,0.25);
      --margin: 7cqw; --margin-v: 7cqh; --gutter: 3.5cqw;
      --sz-sm: 2.0cqw; --sz-base: 2.4cqw; --sz-l: 5.4cqw; --sz-xl: 8.1cqw;
    }

    .slide__logo {
      position: absolute; top: 5cqh; right: 4cqw; height: 14cqh;
    }

    /* ── A: TITELFOLIE ── */
    .slide--title { background: #78b41b; }
    .slide--title .slide__logo { filter: brightness(0) invert(1); }
    .slide--title__headline {
      position: absolute; left: var(--margin); right: 22cqw;
      top: 50%; transform: translateY(-50%);
      font-size: var(--sz-xl); font-weight: 700; line-height: 1.1; color: #fff;
    }
    .slide--title__sub {
      position: absolute; left: var(--margin); bottom: var(--margin-v);
      font-size: var(--sz-base); font-weight: 400; color: rgba(255,255,255,0.78);
    }

    /* ── B/C: INHALTSFOLIE ── */
    .slide--content { background: #f0fae6; }
    .slide--content__headline {
      position: absolute; top: var(--margin-v); left: var(--margin); right: 22cqw;
      font-size: var(--sz-l); font-weight: 700; line-height: 1.1; color: #2E2E2E;
    }
    .slide--content__bullets {
      position: absolute; bottom: var(--margin-v); left: var(--margin);
      list-style: none; display: flex; flex-direction: column; gap: 1.8cqh;
    }
    .slide--content__bullets li {
      font-size: var(--sz-base); line-height: 1.5; color: #2E2E2E;
      display: flex; align-items: baseline; gap: 0.6em;
    }
    .slide--content__bullets li::before { content: "•"; color: #78b41b; font-weight: 900; flex-shrink: 0; }

    /* ── C: SPALTEN ── */
    .slide--cols {
      position: absolute; left: var(--margin); right: var(--margin); bottom: var(--margin-v);
      display: grid; gap: var(--gutter);
    }
    .slide--cols.--cols-2 { grid-template-columns: repeat(2, 1fr); }
    .slide--cols.--cols-3 { grid-template-columns: repeat(3, 1fr); }
    .slide--cols.--cols-4 { grid-template-columns: repeat(4, 1fr); }
    .slide__col-title { font-size: var(--sz-base); font-weight: 700; color: #2E2E2E; margin-bottom: 1.5cqh; line-height: 1.2; }
    .slide__col-bullets { list-style: none; display: flex; flex-direction: column; gap: 1.2cqh; }
    .slide__col-bullets li { font-size: var(--sz-base); line-height: 1.5; color: #2E2E2E; display: flex; align-items: baseline; gap: 0.5em; }
    .slide__col-bullets li::before { content: "–"; color: #78b41b; flex-shrink: 0; }

    /* ── D: STATEMENT / ZITAT ── */
    .slide--statement { background: #78b41b; }
    .slide--statement .slide__logo { filter: brightness(0) invert(1); }
    .slide--statement::before {
      content: "\201C"; position: absolute;
      font-size: 50cqw; font-weight: 700; line-height: 0.85;
      color: rgba(255,255,255,0.10); top: -2cqh; left: -1cqw;
      pointer-events: none; z-index: 0;
    }
    .slide--statement__quote {
      position: absolute; z-index: 1; left: var(--margin); right: var(--margin);
      top: 50%; transform: translateY(-50%);
      font-size: var(--sz-l); font-weight: 400; font-style: italic; line-height: 1.15; color: #fff;
    }
    .slide--statement__source {
      position: absolute; z-index: 1; left: var(--margin); bottom: var(--margin-v);
      font-size: var(--sz-base); font-weight: 400; color: rgba(255,255,255,0.70);
    }

    /* ── E: ICON-GRID / PROZESS ── */
    .slide--icon-grid__header { position: absolute; top: var(--margin-v); left: var(--margin); }
    .slide--icon-grid__title { font-size: var(--sz-l); font-weight: 700; line-height: 1.1; color: #2E2E2E; }
    .slide--icon-grid__title em { font-style: italic; font-weight: 400; }
    .slide--icon-grid__cols {
      position: absolute; left: var(--margin); right: var(--margin); bottom: var(--margin-v);
      display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--gutter);
    }
    .slide__icon-col { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1.5cqh; }
    .slide__icon { font-size: 10cqh; color: #2E2E2E; line-height: 1; }
    .slide__icon-label { font-size: var(--sz-base); font-weight: 700; color: #2E2E2E; line-height: 1.2; }
    .slide__icon-desc { font-size: var(--sz-base); font-weight: 400; color: #666; line-height: 1.4; }

    /* ── F: SPLIT-FOLIE ── */
    /* F  (Bild links):  <visual> dann <content> im DOM */
    /* F2 (Bild rechts): <content> dann <visual> im DOM, kein Logo */
    .slide--split { display: grid; grid-template-columns: 1fr 1fr; }
    .slide--split__visual { background: #78b41b; /* Foto: background: url(…) center/cover no-repeat */ }
    .slide--split__content {
      background: #f0fae6; padding: var(--margin-v) var(--margin);
      display: flex; flex-direction: column; justify-content: space-between;
    }
    .slide--split__headline { padding-right: 12cqw; font-size: var(--sz-l); font-weight: 700; line-height: 1.1; color: #2E2E2E; }
    .slide--split__bullets { list-style: none; display: flex; flex-direction: column; gap: 1.8cqh; }
    .slide--split__bullets li { font-size: var(--sz-base); line-height: 1.5; color: #2E2E2E; display: flex; align-items: baseline; gap: 0.6em; }
    .slide--split__bullets li::before { content: "•"; color: #78b41b; font-weight: 900; flex-shrink: 0; }

    /* ── G: KONTAKT-FOLIE ── */
    .slide--contact { background: #78b41b; }
    .slide--contact .slide__logo { filter: brightness(0) invert(1); }
    .slide--contact__body {
      position: absolute; left: var(--margin); right: 22cqw;
      top: 50%; transform: translateY(-50%);
    }
    .slide--contact__name { font-size: var(--sz-l); font-weight: 700; line-height: 1.1; color: #fff; margin-bottom: 1.2cqh; }
    .slide--contact__role { font-size: var(--sz-base); font-weight: 400; color: rgba(255,255,255,0.78); }
    .slide--contact__details {
      position: absolute; left: var(--margin); bottom: var(--margin-v);
      display: flex; gap: 2.5cqw;
      font-size: var(--sz-base); font-weight: 400; color: rgba(255,255,255,0.70);
    }

    /* ── H: AGENDA ── */
    .slide--agenda__list {
      position: absolute; left: var(--margin); right: 30cqw; bottom: var(--margin-v);
      list-style: none; display: flex; flex-direction: column; gap: 2cqh;
    }
    .slide--agenda__list li {
      display: flex; align-items: baseline; gap: 1.8cqw;
      font-size: 3.2cqw; font-weight: 700; line-height: 1.1; color: #2E2E2E;
    }
    .slide--agenda__num { font-size: var(--sz-base); font-weight: 400; color: #78b41b; flex-shrink: 0; min-width: 2cqw; }

    /* ── I: KENNZAHLEN / KPIs ── */
    .slide--kpi__cols {
      position: absolute; left: var(--margin); right: var(--margin); bottom: var(--margin-v);
      display: grid; gap: var(--gutter);
    }
    .slide--kpi__cols.--cols-2 { grid-template-columns: repeat(2, 1fr); }
    .slide--kpi__cols.--cols-3 { grid-template-columns: repeat(3, 1fr); }
    .slide--kpi__cols.--cols-4 { grid-template-columns: repeat(4, 1fr); }
    .slide__kpi-col { display: flex; flex-direction: column; align-items: center; text-align: center; }
    .slide__kpi-value { font-size: 10cqw; font-weight: 700; line-height: 1; color: #78b41b; margin-bottom: 1cqh; }
    .slide__kpi-label { font-size: var(--sz-base); font-weight: 700; line-height: 1.2; color: #2E2E2E; }
    .slide__kpi-desc { font-size: var(--sz-base); font-weight: 400; line-height: 1.4; color: #666; margin-top: 0.6cqh; }

    /* ── J: PRODUKTFOLIE ── */
    .slide--product { display: grid; grid-template-columns: 1fr 1fr; }
    .slide--product__visual { position: relative; background: #dff0c4; /* Foto: url(…) center/cover */ }
    .slide--product__content {
      background: #fff; padding: var(--margin-v) var(--margin);
      display: flex; flex-direction: column; justify-content: space-between;
    }
    .slide--product__name { font-size: var(--sz-l); font-weight: 700; line-height: 1.1; color: #2E2E2E; padding-right: 14cqw; margin-bottom: 1.5cqh; }
    .slide--product__claim { font-size: var(--sz-base); font-weight: 400; line-height: 1.5; color: #666; }
    .slide--product__facts { list-style: none; display: flex; flex-direction: column; gap: 1.5cqh; }
    .slide--product__facts li { font-size: var(--sz-base); line-height: 1.5; color: #2E2E2E; display: flex; align-items: baseline; gap: 0.6em; }
    .slide--product__facts li::before { content: "•"; color: #78b41b; font-weight: 900; flex-shrink: 0; }

    /* ── K: VOLLBILD-FOTO ── */
    .slide--fullbleed { background: #2E2E2E; /* Foto: url(…) center/cover */ }
    .slide--fullbleed::before {
      content: ""; position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 55%);
      z-index: 0;
    }
    .slide--fullbleed .slide__logo { filter: brightness(0) invert(1); z-index: 1; }
    .slide--fullbleed__overlay { position: absolute; z-index: 1; left: var(--margin); right: var(--margin); bottom: var(--margin-v); }
    .slide--fullbleed__headline { font-size: var(--sz-l); font-weight: 700; line-height: 1.1; color: #fff; margin-bottom: 1cqh; }
    .slide--fullbleed__sub { font-size: var(--sz-base); font-weight: 400; color: rgba(255,255,255,0.78); }

    /* ── Präsentations-Modus ── */
    .start-btn {
      position: fixed; bottom: 2rem; right: 2rem;
      background: #78b41b; color: #fff; border: none;
      padding: 0.75rem 1.5rem;
      font-family: "schnebel-sans-me", sans-serif;
      font-size: 0.875rem; font-weight: 700;
      letter-spacing: 0.05em; text-transform: uppercase;
      cursor: pointer; z-index: 100;
    }
    .start-btn:hover { background: #58990F; }

    .slide-counter {
      display: none; position: fixed; bottom: 1.5rem; right: 2rem;
      font-family: "schnebel-sans-me", sans-serif;
      font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em;
      color: rgba(255,255,255,0.4); z-index: 101; pointer-events: none;
    }

    body.--presenting {
      background: #000; padding: 0; gap: 0;
      overflow: hidden; justify-content: center; align-items: center; height: 100vh;
    }
    body.--presenting .label      { display: none; }
    body.--presenting .start-btn  { display: none; }
    body.--presenting .slide-counter { display: block; }
    body.--presenting .slide      { display: none; box-shadow: none; }
    body.--presenting .slide.--active {
      display: block;
      width: min(100vw, 177.78vh); /* 16:9 */
    }
    /* Grid-Folien: display: grid zurücksetzen */
    body.--presenting .slide--split.--active,
    body.--presenting .slide--product.--active { display: grid; }

  </style>
</head>
<body>
  <!-- Folien hier einfügen -->

  <button class="start-btn" onclick="startPresentation()">▶ Präsentation starten</button>
  <div class="slide-counter"></div>

  <script>
    const slides  = Array.from(document.querySelectorAll('.slide'));
    const counter = document.querySelector('.slide-counter');
    let current   = 0;

    function showSlide(i) {
      slides.forEach(s => s.classList.remove('--active'));
      slides[i].classList.add('--active');
      counter.textContent = `${i + 1} / ${slides.length}`;
      current = i;
    }
    function startPresentation() {
      document.body.classList.add('--presenting');
      showSlide(0);
      document.documentElement.requestFullscreen?.();
    }
    function stopPresentation() {
      document.body.classList.remove('--presenting');
      slides.forEach(s => s.classList.remove('--active'));
      if (document.fullscreenElement) document.exitFullscreen?.();
    }
    function next() { if (current < slides.length - 1) showSlide(current + 1); }
    function prev() { if (current > 0) showSlide(current - 1); }

    document.addEventListener('keydown', e => {
      if (!document.body.classList.contains('--presenting')) return;
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft')                   { e.preventDefault(); prev(); }
      if (e.key === 'Escape')                        stopPresentation();
    });
    document.addEventListener('click', e => {
      if (!document.body.classList.contains('--presenting')) return;
      if (e.target.closest('.slide')) next();
    });
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) stopPresentation();
    });
  </script>
</body>
</html>
```
