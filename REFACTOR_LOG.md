# Inuvet Styleguide — Refactor Log

---

## Block 1 — Quick Wins (2026-05)

Grundlage: `STYLEGUIDE_AUDIT.md` (erstellt in dieser Session).

| # | Aufgabe | Dateien | Commit |
|---|---|---|---|
| 1 | `--text-sm: 0.8rem` definiert | `inuvet.css` | — |
| 2 | 3 dead tokens entfernt (`--ratio`, `--module-3xl`, `--z-below`) | `inuvet.css` | — |
| 3 | `.text-muted` dedupliziert — bleibt in `inuvet.css`, aus `sg.css` entfernt | `inuvet.css`, `sg.css` | — |
| 4 | Overlay-Farben tokenisiert (`--color-overlay-dark/light`) | `inuvet.css`, `Tierarzt-Empfehlung-Mockup.css` | — |
| 5 | Container-max tokenisiert (`--container-max: 1536px`) | `inuvet.css` | — |

**Entscheidung `.text-muted`:** Audit schlug ursprünglich vor, die Klasse in `sg.css` zu belassen.
Befund ergab, dass `Bundle.html` und `Tierarzt-Empfehlung-Mockup.html` `.text-muted` nutzen,
aber `sg.css` nicht laden → Klasse muss in `inuvet.css` bleiben.

---

## Block 2 — State-Klassen + Focus-Visible (2026-05)

### Aufgabe 1 — Bestandsaufnahme (Analyse, kein Code)

Inventar aller State-Klassen in CSS, JS und HTML erstellt.

**Kernbefund:** Zwei parallele Systeme:
- `.open` (kein Präfix): nur `.nav-hamburger` und `.mobile-menu` in `inuvet.css` + `styleguide.html`
- `.--open` (BEM-Modifier): alle anderen Komponenten konsistent

**Bundle.html-Bug entdeckt:** `Bundle.html` toggelte bereits `.--open` für das mobile Menü
via JS, obwohl `inuvet.css` nur `.open` definierte → Mobile-Menü in Bundle.html war komplett
kaputt (öffnete sich nie). Wurde durch Migration automatisch behoben.

### Aufgabe 2 — Migration `.open` → `.--open`

Scope (Option A): nur die beiden `.open`-Ausreißer vereinheitlichen.

| Schritt | Änderung | Commit |
|---|---|---|
| `.nav-hamburger` | `inuvet.css` 3 Selektoren + `styleguide.html` JS (toggle/remove) | `refactor(states): unify .nav-hamburger to .--open convention` |
| `.mobile-menu` | `inuvet.css` 2 Selektoren (mobile + desktop @media) | `refactor(states): unify .mobile-menu to .--open convention` |

`Bundle.html` brauchte **keine Änderung** — war bereits korrekt und profitiert automatisch
von der CSS-Migration.

### Aufgabe 3 — Focus-Visible-Fix (a11y)

**Problem:** `.form-field input` setzt `outline: none` mit Spezifität (0,1,1), was den
globalen `:focus-visible`-Selektor (0,1,0) überschreibt. Keyboard-Nutzer sahen keinen
Focus-Indikator auf Formularfeldern.

**Lösung:**
1. Drei Tokens in `:root` ergänzt: `--focus-ring-width`, `--focus-ring-offset`, `--focus-ring-color`
2. Globalen `:focus-visible` auf Tokens umgestellt
3. `.form-field input/textarea/select:focus-visible` (0,2,1) mit Token-Outline überschreibt
   nun korrekt den Base-Selektor → Focus-Ring sichtbar bei Tastatur, unsichtbar bei Maus

Commit: `fix(a11y): restore visible focus on form fields, tokenize focus ring`

### Aufgabe 4 — Dokumentation

`STATES.md` erstellt mit:
- Vollständigem State-Klassen-Inventar + Präfix-Regel
- Migrations-Historie (`.open` → `.--open`)
- Focus-Konvention inkl. Spezifitäts-Erklärung für Form-Field-Wrapper

Commit: `docs(styleguide): document state class and focus conventions`

---

## Offene Punkte / Zurückgestellt

- `rgba(0,0,0,0.5)` in `mockup-ui.css:143` — andere Opacity als `--color-overlay-dark` (0.4),
  awaiting user decision ob neuer Token oder belassen
- `rgba(0,0,0,0.6)` in `inuvet.css` (modal-overlay) — ebenfalls nicht tokenisiert
- `rgba(255,255,255,0.4)` in `inuvet.css:1086` — nicht tokenisiert
