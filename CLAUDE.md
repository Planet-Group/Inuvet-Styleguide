# Claude Code — Session-Einstieg für Inuvet Styleguide

> **Automatisch geladen zu Sessionbeginn. Bewusst kurz — alle Details in [`CONTEXT.md`](./CONTEXT.md).**

---

## Erstkontakt-Checkliste

1. [`CONTEXT.md`](./CONTEXT.md) lesen — Architektur, Tokens, Mockups, verworfene Entscheidungen
2. Sprache: **Deutsch** (Doku, Commits, Kommentare, Antworten)
3. Globale JS-Datei: `inuvet.js` — enthält `toggleMobile()` / `closeMobile()`, `closeAnnouncement()`, `initMarquees()`, `toggleAccordion()`, `initScrollAnimations()` — wird in alle Pages eingebunden (analog zu `inuvet.css`)

---

## Goldene Regeln (nie brechen)

1. **Bestehende Klassen zuerst** — vor jeder neuen Klasse: `grep` in `inuvet.css`. Existiert die Funktion schon? → Wiederverwenden. Details + Anti-Pattern-Beispiel in CONTEXT.md.
2. **Neue Styles immer zuerst in temp.css** — Jedes neue CSS-Element landet zunächst in `temp.css`, egal ob es sich später als global oder seitenspezifisch herausstellt. Das wird zum Zeitpunkt der Entwicklung noch nicht entschieden. Erst wenn ein Element abgeschlossen ist, entscheiden wir gemeinsam: → `inuvet.css` (global) oder → die zugehörige Page-CSS-Datei (seitenspezifisch). Nie direkt in `inuvet.css` oder eine Page-CSS schreiben ohne vorherigen Test in `temp.css`. Details zum Workflow in CONTEXT.md.
3. **Keine Magic Numbers** — alles via `var(--…)`.
4. **`border-radius: 0`** — Ausnahmen nur: `.badge.--pill` und Avatar (`50%`).
5. **Kein `!important`**. Niemals.
6. **Kein `text-align: center`** für Inhalte — nur funktional (Button-Text, Qty-Input, Empty/Success-State).
7. **BEM-Modifier mit Doppel-Bindestrich**: `.btn.--primary`, `.--active`, `.--open`.
8. **Linien sparsam** — Whitespace trennt. `border-top` für Trennzwecke ist Code-Smell.
9. **Neue Komponente = Styleguide + Index** — Jede neue globale Komponente muss sofort an zwei Stellen dokumentiert werden: (1) als Demo-Abschnitt in `styleguide.html`, (2) als Zeile in der Klassen-Schnellreferenz in `CONTEXT.md`. Beides zusammen, nie nur eines.
10. **Neues CSS? Erst fragen** — Bevor neues CSS angelegt wird (egal ob in `temp.css`, einer Page-CSS oder `inuvet.css`): kurz mitteilen, was fehlt und warum keine bestehende Klasse passt — und Bestätigung abwarten.
11. **Einzelprodukt oder Produktfamilie? Erst fragen** — Wenn aus dem Kontext nicht eindeutig hervorgeht, ob es sich um ein Einzelprodukt (mit Darreichungsform im Namen) oder eine Produktfamilie handelt: immer nachfragen, bevor Namen, Darstellung oder Struktur festgelegt werden.
12. **Mockup-UI strikt isoliert** — Alle Styles für Mockup-Steuerelemente (FAB, Panel, Bar, Buttons darin) kommen ausschließlich aus `mockup-ui.css`. Keine `inuvet.css`-Klassen (`.btn`, `.form-field` etc.) innerhalb von `.mockup-fab-panel`, `.mockup-bar` oder `.mockup-modal` verwenden. Eigene Elemente: `.mockup-btn`, `.mockup-fab-panel__field` u. a.

---

## Produkt-Modell

**Grundprinzip:** In den Warenkorb kommen immer Einzelprodukte, nie Familien. Sobald ein Preis oder eine Darreichungsform im Kontext steht, ist es ein Einzelprodukt.

| Kontext | Anzeige |
|---|---|
| Tiles, Collection, Suche | `Calmin Balance`, `Hepax forte` |
| Cart, Checkout, Bestellübersicht, Freigabe | `Calmin Balance Tabletten`, `Hepax forte Tabletten` |
| Einzelprodukte (immer mit Darreichungsform) | `Inzym Pulver` |

In Cart/Checkout: Varianten-Zeile zeigt Füllmenge + Preis — **immer `.cart-item__variant`** (xs, muted), Format: `60 Stück · 39,90 €`. Nie eigene Klassen für diese Zeile. Button statt `qty-selector` → `.btn.--sm` in `.cart-item__bottom` (Demo 5 in C.2). → Vollständiges Modell mit Indikation/Produkt/Variante/Familie in CONTEXT.md.

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
- `pages/Tierarzt-Empfehlung-Mockup.html` + `Tierarzt-Empfehlung-Mockup.css` — Hauptmockup, Freigabe-Flow
- `pages/Tierarzt-Empfehlung-Testprotokoll.html` — Testprotokoll (Online-Formular, druckbar/exportierbar)
- `pages/Tierarzt-Empfehlung-Info.html` — Technische Dokumentation zum Rezeptanfrage-System
- `pages/Inuvet-Freigabe-Mockup.html` + `freigabe.css` — Vet-Portal, Empfehlungsfreigabe
- `pages/Formular-Reklamation.html` + `formulare.css` — Stand-Alone-Formular
- `pages/Formular-Nebenwirkungen.html` + `nebenwirkungen.css` — Meldeformular unerwünschte Wirkungen (Tierbesitzer)
- `pages/Produkt-Modell.html` — Erklärungs-Artikel: Indikation → Familie → Einzelprodukt → Variante
- `pages/Provision-Portal.html` + `provision-portal.css` — Mockup: Tierarzt löst Provisionen ein (Barauszahlung oder Prämie), inkl. Checkout + Erfolgsseite
- `pages/Provision-Portal-Info.html` — Technische Dokumentation zum Provisions-Portal
- `pages/_template.html` — Boilerplate für neue Mockup-Pages

---

## Pflege

CLAUDE.md: nur bei Änderung der Goldenen Regeln, Token-Familien oder Pages. Details immer in CONTEXT.md.
