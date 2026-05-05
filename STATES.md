# State-Klassen-Konvention

## Präfix-Regel

Wir verwenden das `--`-Präfix als BEM-inspirierte Modifier-Syntax für alle State-Klassen.
State-Klassen werden **niemals allein** selektiert, sondern immer zusammen mit der
Komponenten-Klasse:

```css
/* ✓ korrekt */
.cart-drawer.--open { … }

/* ✗ falsch — zu unspezifisch, Kollisionsgefahr */
.--open { … }
```

## Etablierte State-Klassen

| Klasse | Bedeutung | Beispiel-Komponenten |
|---|---|---|
| `.--open` | Drawer, Modal, Menü oder Overlay ist sichtbar | `.cart-drawer`, `.mobile-menu`, `.accordion-item`, `.search-overlay` |
| `.--active` | Element ist selektiert oder aktiv | `.tab-btn`, `.choice-box`, `.pdp__thumb`, `.search-result` |
| `.--visible` | Element wird eingeblendet (Sichtbarkeitssteuerung) | `.testimonial`, `.testimonial-slider__slide` |
| `.--hidden` | Element wird ausgeblendet | `.testimonial-more`, `.pdp__caption` |
| `.--closed` | Komponente ist eingeklappt | `.announcement-bar` |
| `.--disabled` | Komponente ist deaktiviert | `.btn` |

## Toggle in JavaScript

```js
// Öffnen / Schließen
element.classList.toggle('--open');

// Gezieltes Setzen (z. B. beim Sync mehrerer Elemente)
btn.classList.toggle('--open', isOpen);

// Entfernen
element.classList.remove('--open');
```

## Nicht mehr verwenden

| Alt | Neu | Grund |
|---|---|---|
| `.open` | `.--open` | War Inkonsistenz; migriert in Refactor-Block 2 (2026-05) |

---

# Focus-Konvention

## Tokens

Definiert in `:root` in `inuvet.css`:

```css
--focus-ring-width:  2px;
--focus-ring-offset: 2px;
--focus-ring-color:  var(--green);
```

## Globale Regel

```css
:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}
```

## Komponenten-Regel

Komponenten dürfen `:focus-visible` **nicht** mit `outline: none` überschreiben.

Wenn eine Komponente einen abweichenden Focus-Stil benötigt, muss er **token-basiert**
angepasst werden — niemals entfernt:

```css
/* ✓ erlaubt — abweichender Stil, aber sichtbar */
.my-component:focus-visible {
  outline-color: var(--color-error);
}

/* ✗ verboten — Keyboard-Nutzer verlieren den Focus-Indikator */
.my-component:focus-visible {
  outline: none;
}
```

## Spezifitäts-Hinweis für Form Fields

`inuvet.css` setzt auf `.form-field input` ein `outline: none` (Spezifität 0,1,1),
das den globalen `:focus-visible`-Selektor (0,1,0) überschreiben würde.
Daher gibt es einen expliziten Gegenselektor mit höherer Spezifität:

```css
.form-field input:focus-visible,
.form-field textarea:focus-visible,
.form-field select:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}
```

Dieses Muster beibehalten, falls weitere Input-Wrapper-Komponenten hinzukommen.

## Maus vs. Tastatur

| Interaktion | Klasse | Outline |
|---|---|---|
| Mausklick | `:focus` (ohne `:focus-visible`) | Kein Ring — Browser wendet `:focus-visible` nicht an |
| Tab-Navigation | `:focus-visible` | Grüner Ring gemäß Tokens |
