# Claude Code — Session-Einstieg für Inuvet Styleguide

> **Automatisch geladen zu Sessionbeginn. Bewusst kurz — alle Details in [`CONTEXT.md`](./CONTEXT.md).**

---

## Erstkontakt-Checkliste

1. [`CONTEXT.md`](./CONTEXT.md) lesen — Architektur, Tokens, Mockups, verworfene Entscheidungen
2. Sprache: **Deutsch** (Doku, Commits, Kommentare, Antworten)

---

## Goldene Regeln (nie brechen)

1. **Bestehende Klassen zuerst** — vor jeder neuen Klasse: `grep` in `inuvet.css`. Existiert die Funktion schon? → Wiederverwenden. Details + Anti-Pattern-Beispiel in CONTEXT.md.
2. **Keine Magic Numbers** — alles via `var(--…)`.
3. **`border-radius: 0`** — Ausnahmen nur: `.badge.--pill` und Avatar (`50%`).
4. **Kein `!important`**. Niemals.
5. **Kein `text-align: center`** für Inhalte — nur funktional (Button-Text, Qty-Input, Empty/Success-State).
6. **BEM-Modifier mit Doppel-Bindestrich**: `.btn.--primary`, `.--active`, `.--open`.
7. **Linien sparsam** — Whitespace trennt. `border-top` für Trennzwecke ist Code-Smell.

---

## Produkt-Modell

**Grundprinzip:** In den Warenkorb kommen immer Einzelprodukte, nie Familien. Sobald ein Preis oder eine Darreichungsform im Kontext steht, ist es ein Einzelprodukt.

| Kontext | Anzeige |
|---|---|
| Tiles, Collection, Suche | `Calmin Balance`, `Hepax forte` |
| Cart, Checkout, Bestellübersicht, Freigabe | `Calmin Balance Tabletten`, `Hepax forte Tabletten` |
| Einzelprodukte (immer mit Darreichungsform) | `Inzym Pulver` |

In Cart/Checkout: Varianten-Zeile zeigt nur Füllmenge (`60 Stück`). → Vollständiges Modell mit Indikation/Produkt/Variante/Familie in CONTEXT.md.

---

## Tokens — nicht raten, nachschlagen

Spacing: `--half-module`, `--module`, `--module-2xl/3xl` · Text: `--text-xs/sm/base/m/l/xl` · Layout: `--header-height`, `--page-pt`, `--container-max` · Z-Index: `--z-nav/overlay/drawer/modal` · Animation: `--anim-fast/mid/base/slow`

Container-Modifier: `.page.--narrow` (720px) · `.page.--form` (480px) · `.page.--no-pt`

→ Vollständige Werte mit `clamp()`-Formeln in CONTEXT.md.

---

## Sektions-Schema

A Foundations · B Atome · C Moleküle · D Organismen · E Seiten-Vorlagen — jeweils dezimal nummeriert (A.1, B.3, C.11 …). → Vollständige Tabelle in CONTEXT.md.

---

## Audit-Verhalten

Wenn der User **„analysiere das Projekt auf Inkonsistenzen"** sagt:
- `find . -name "*.html"` — ALLE HTML-Dateien, nicht nur `pages/`
- CSS-Schichten alle prüfen: `inuvet.css`, `sg.css`, `mockup-ui.css`, `pages/*.css`

---

## Pages aktiv

- `pages/Bundle.html` + `bundle.css` — Bundle-Builder mit Naturalrabatt
- `pages/Bundle-Info.html` — Konzept-Artikel zum Bundle
- `pages/Tierarzt-Empfehlung-Mockup.html` + `.css` — Hauptmockup, Rezeptanfrage-Flow
- `pages/Inuvet-Freigabe-Mockup.html` + `freigabe.css` — Vet-Portal, Empfehlungsfreigabe
- `pages/Formular-Reklamation.html` + `formulare.css` — Stand-Alone-Formular
- `pages/Prozess-Diagramm.html` — Swimlane-Diagramme

---

## Pflege

CLAUDE.md: nur bei Änderung der Goldenen Regeln, Token-Familien oder Pages. Details immer in CONTEXT.md.
