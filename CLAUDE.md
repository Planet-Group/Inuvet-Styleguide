# Claude Code — Session-Einstieg für Inuvet Styleguide

> **Diese Datei wird von Claude Code automatisch zu Beginn jeder Session geladen.** Sie ist bewusst kompakt: detaillierte Doku in [`CONTEXT.md`](./CONTEXT.md).

---

## Erstkontakt-Checkliste

Bevor du loslegst:

1. **Lies [`CONTEXT.md`](./CONTEXT.md) komplett** — Architektur, Tokens, Komponenten, Mockups, verworfene Entscheidungen
2. **Skizze des Projekts**: Design System (`inuvet.css`) + Styleguide (`styleguide.html`, ~40 Sektionen) + 6 Mockup-/Page-Files in `pages/`
3. **Sprache**: Deutsch (Doku, Commits, Kommentare). Code-Kommentare auch deutsch.

## Sektions-Schema im Styleguide

Atomic Design konsequent durchgezogen — fünf Gruppen, dezimale Nummerierung:

- **A — Foundations** (A.1–A.10): Tokens, Typografie, Farben, Spacing, Responsive, Meta-Doku
- **B — Atome** (B.1–B.6): Buttons, Badges, Icons, Form-Felder, Product Thumb, Breadcrumb
- **C — Moleküle** (C.1–C.10): Karten, Tabs, Notice, Empty/Success, Toast, Modal
- **D — Organismen** (D.1–D.8): Navigation, Footer, Hero-Sections, Kachel-Raster, Testimonials, Marquee, Newsletter, Cookie
- **E — Seiten-Vorlagen** (E.1–E.10): Page-Skeleton, PDP, Collection, Cart-Drawer, Checkout, Account, Suche, Blog, OOS, Landing-Pages

> **Erweiterung**: Neue Komponente kommt einfach als nächste Nummer in der passenden Gruppe (z.B. `C.11`). Keine Suffixe wie `12a`/`17a` mehr.

---

## Goldene Regeln (nie verletzen)

1. **Bestehende Klassen zuerst — als Pflicht-Workflow**

   **BEVOR du in einer page-css eine neue Klasse benennst:**
   1. Funktional beschreiben („kleines Uppercase-Label", „Status-Border", „bordered Card mit Padding")
   2. `grep "Begriff\|css-property" inuvet.css` — gibt es eine Klasse mit dieser Funktion?
   3. Falls ja: **wiederverwenden**. Falls die existierende Klasse 90% passt, nutze sie + page-spezifischen Kontext-Selektor für den Rest.

   **Anti-Pattern (Live-Beispiel aus 2026-05-08):**
   In `freigabe.css` wurde `.approval-qty-label` definiert mit:
   ```css
   font-size: var(--text-xs); text-transform: uppercase;
   letter-spacing: 0.05em; color: var(--fg-muted); font-weight: 700;
   ```
   Das ist **exakt** `.label-caps` aus `inuvet.css`. Reine Duplikation eines globalen Atoms — der schlimmste Verstoß gegen das System.

   **So sollte es aussehen:**
   ```html
   <!-- Direkt globale Klasse benutzen -->
   <div class="label-caps">Empfehlung</div>
   ```
   Wenn page-spezifischer Margin nötig: per Kontext-Selektor:
   ```css
   .approval-product-info .label-caps { margin-bottom: calc(var(--base) * 0.375); }
   ```

   **Verstöße zählen als technische Schuld.** Bei Wartungs-Audits werden lokale Klassen, die globale duplizieren, immer aufgespürt und entfernt — besser, sie kommen gar nicht erst rein.

2. **Keine Magic Numbers** — Alle Werte über Tokens (`var(--…)`). Hardcoded `rem`/`px`/Farben sind Code-Smells.
3. **`border-radius: 0`** — überall. Ausnahmen nur: `.badge.--pill` (`2em`) und Avatar (`50%`).
4. **Kein `!important`**. Niemals.
5. **Kein `text-align: center`** für Inhalte. Nur funktional (Button-Text, Qty-Input, Empty/Success-State).
6. **BEM-Modifier mit Doppel-Bindestrich**: `.btn.--primary`, `.--active`, `.--open`.
7. **Linien sparsam** — Whitespace ist die Standard-Trennung. `border-top` für Trennzwecke ist meist ein Code-Smell. Mehrere parallele Linien (Meta-Border + Section-Label-Border + Card-Border) konkurrieren visuell — wenn zwei Trenner direkt aufeinanderfolgen, eine davon raus.
8. **Sprache der Antworten**: deutsch.

## Wichtige Tokens (nicht raten, sondern nachschlagen)

- Spacing-Skala: `--half-module`, `--module`, `--module-2xl`, `--module-3xl` (alle fluid via `clamp`)
- Text-Skala: `--text-xs/sm/base/m/l/xl`, Line-Heights `--lh-base/h3/h2/h1`
- Layout: `--header-height`, **`--page-pt`** (Atemraum unter sticky Header), `--container-max`
- Container-Modifier: `.page.--narrow` (720px), `.page.--form` (480px), `.page.--no-pt`
- Z-Index: `--z-default/nav/dropdown/overlay/drawer/modal`
- Animation: `--anim-fast/mid/base/slow`

→ Vollständige Werte und Erklärungen in [`CONTEXT.md`](./CONTEXT.md).

## Audit-Verhalten

Wenn der User **„analysiere das Projekt auf Inkonsistenzen"** sagt:

- **Vollständigen File-Scope explizit machen** — `find . -name "*.html"` (ALLE HTML-Dateien, nicht nur `pages/`)
- Root-Files (`styleguide.html`) und Pages (`pages/*.html`) gleichermaßen prüfen
- CSS-Schichten alle einbeziehen: `inuvet.css`, `sg.css`, `mockup-ui.css`, `pages/*.css`
- Auch Boilerplate-/Template-Files (`starter.html`-artige) prüfen, falls vorhanden

## Pages aktiv

- `pages/Bundle.html` + `bundle.css` — Bundle-Builder mit Naturalrabatt
- `pages/Bundle-Info.html` — Konzept-Artikel zum Bundle
- `pages/Tierarzt-Empfehlung-Mockup.html` (+ `.css`) — Hauptmockup, Rezeptanfrage-Flow
- `pages/Inuvet-Freigabe-Mockup.html` + `freigabe.css` — Vet-Portal, Empfehlungsfreigabe
- `pages/Formular-Reklamation.html` + `formulare.css` — Stand-Alone-Formular
- `pages/Prozess-Diagramm.html` — Swimlane-Diagramme

> `starter.html` wurde gelöscht. Wer eine neue Page braucht: existing copy-pasten und anpassen.

## Pflege dieser Datei

Nach größeren strukturellen Änderungen (neue Komponente, neue Page, neue globale Konvention) → CONTEXT.md aktualisieren und Audit-Historie ergänzen. CLAUDE.md nur bei Änderung der Goldenen Regeln oder Token-Familien.
