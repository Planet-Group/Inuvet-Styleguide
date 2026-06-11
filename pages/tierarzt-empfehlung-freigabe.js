/* ════════════════════════════════════════════
   Tierarzt-Empfehlung-Freigabe — datengetriebenes Rendern
   Der Tierarzt sieht ALLE Produkte (5 Darreichungsformen) und kann
   pro Größe eine eigene Menge freigeben. Angefragte Produkte stehen oben.
   ════════════════════════════════════════════ */

const CALMIN_1 = '../assets/images/Calmin_Packshot_01.jpeg';
const CALMIN_2 = '../assets/images/Calmin_Packshot_02.png';
const HEPAX_1  = '../assets/images/Hepax_Packshot_01.jpeg';
const HEPAX_2  = '../assets/images/Hepax_Packshot_02.png';

/* Katalog — alle Darreichungsformen (gespiegelt aus tierarzt-empfehlung.js PRODUCTS).
   Nur Calmin- und Hepax-Packshots existieren; Inzym → Platzhalter (img:null).
   commission = Provision pro tatsächlicher Bestellung. */
const CATALOG = [
  { id: 1, cartName: 'Calmin balance Tabletten', img: CALMIN_1, imgHover: CALMIN_2,
    variants: [
      { label: '60 Stück', price: '39,90 €', commission: 4.50 },
      { label: '90 Stück', price: '54,90 €', commission: 6.20 },
    ] },
  { id: 2, cartName: 'Calmin balance Pulver', img: CALMIN_1, imgHover: CALMIN_2,
    variants: [
      { label: '30 g', price: '29,90 €', commission: 3.40 },
      { label: '60 g', price: '49,90 €', commission: 5.60 },
    ] },
  { id: 3, cartName: 'Hepax forte Tabletten', img: HEPAX_1, imgHover: HEPAX_2,
    variants: [
      { label: '30 Stück', price: '34,90 €', commission: 5.20 },
      { label: '60 Stück', price: '64,90 €', commission: 9.70 },
    ] },
  { id: 4, cartName: 'Hepax forte Pulver', img: HEPAX_1, imgHover: HEPAX_2,
    variants: [
      { label: '75 g',  price: '39,90 €', commission: 4.80 },
      { label: '175 g', price: '84,90 €', commission: 9.90 },
    ] },
  { id: 5, cartName: 'Inzym Pulver', img: null, imgHover: null,
    variants: [
      { label: '50 g',  price: '24,90 €', commission: 2.80 },
      { label: '100 g', price: '44,90 €', commission: 4.90 },
    ] },
];

/* Was der Tierbesitzer angefragt hat — qty = angefragte Packungszahl. */
const REQUEST = [
  { cartName: 'Calmin balance Tabletten', variantLabel: '60 Stück', qty: 2 },
  { cartName: 'Hepax forte Tabletten',    variantLabel: '30 Stück', qty: 1 },
];

const QTY_PRESETS = [1, 2, 5]; // Basis-Stufen im Dropdown

/* Zustand: nur in 'request' gibt es eine konkrete Anfrage (Badges + Vorauswahl).
   In 'direct' (Tierarzt stellt Empfehlung in der Praxis aus) existiert keine Anfrage. */
let approvalMode = 'request'; // 'request' | 'direct'

/* ── State: pro Variante (id = "produktId-variantenIndex") ein Freigabe-Wert ──
   'reject' | 'maxN' | 'unlimited' */
const approvalState = {};

function vid(productId, variantIndex) { return productId + '-' + variantIndex; }

// Anfrage-bezogene Helfer greifen nur im 'request'-Modus
function isRequestedProduct(cartName) {
  return approvalMode === 'request' && REQUEST.some(r => r.cartName === cartName);
}
function requestedQtyFor(cartName, label) {
  if (approvalMode !== 'request') return null;
  const r = REQUEST.find(x => x.cartName === cartName && x.variantLabel === label);
  return r ? 'max' + r.qty : null;
}
function defaultValueFor(cartName, label) {
  return requestedQtyFor(cartName, label) || 'reject';
}

// State auf die Defaults des aktuellen Modus (re)initialisieren
function initState() {
  CATALOG.forEach(p => p.variants.forEach((v, vi) => {
    approvalState[vid(p.id, vi)] = defaultValueFor(p.cartName, v.label);
  }));
}

/* ── Helfer für Mengen-Werte ── */
function qtyMax(value) {
  if (value === 'reject')    return 0;
  if (value === 'unlimited') return Infinity;
  if (value && value.startsWith('max')) return parseInt(value.slice(3), 10);
  return null;
}
function qtyLabel(value) {
  if (value === 'reject')    return 'nicht freigeben';
  if (value === 'unlimited') return 'Unbegrenzt';
  if (value && value.startsWith('max')) return 'max. ' + value.slice(3) + '×';
  return value;
}
function formatEur(value) {
  return value.toFixed(2).replace('.', ',') + ' €';
}
/* ── Provision pro Produkt (Summe über alle freigegebenen Größen) ── */
function productCommissionText(p) {
  let fixed = 0;
  let unlimitedPerOrder = 0;
  p.variants.forEach((v, vi) => {
    const value = approvalState[vid(p.id, vi)];
    if (value === 'reject') return;
    const max = qtyMax(value);
    if (max === Infinity) unlimitedPerOrder += v.commission;
    else fixed += v.commission * max;
  });
  if (fixed === 0 && unlimitedPerOrder === 0) return { text: 'Keine Provision', muted: true };
  if (fixed > 0 && unlimitedPerOrder > 0) return { text: `Provision bis ${formatEur(fixed)} + ${formatEur(unlimitedPerOrder)} / Bestellung`, muted: false };
  if (fixed > 0) return { text: `Provision bis ${formatEur(fixed)}`, muted: false };
  return { text: `Provision ${formatEur(unlimitedPerOrder)} / Bestellung`, muted: false };
}

function updateProductCommission(productId) {
  const p  = CATALOG.find(x => x.id === productId);
  const el = document.getElementById('prodcomm-' + productId);
  if (!el) return;
  const c = productCommissionText(p);
  el.textContent = c.text;
  el.classList.toggle('--muted', c.muted);
}

/* ── Dropdown-Optionen — fügt die angefragte Menge dynamisch ein ── */
function optionsHTML(selected, requestedValue) {
  const nums = new Set(QTY_PRESETS);
  if (requestedValue && requestedValue.startsWith('max')) nums.add(parseInt(requestedValue.slice(3), 10));
  const sorted = [...nums].sort((a, b) => a - b);

  let opts = `<option value="reject"${selected === 'reject' ? ' selected' : ''}>nicht freigeben</option>`;
  opts += sorted.map(n => {
    const val = 'max' + n;
    return `<option value="${val}"${selected === val ? ' selected' : ''}>max. ${n}×</option>`;
  }).join('');
  opts += `<option value="unlimited"${selected === 'unlimited' ? ' selected' : ''}>Unbegrenzt</option>`;
  return opts;
}

/* ── Rendering ── */
function variantRowHTML(p, v, vi) {
  const id     = vid(p.id, vi);
  const reqVar = !!requestedQtyFor(p.cartName, v.label);
  const value  = approvalState[id];
  return `
    <div class="approval-variant-row">
      <span class="approval-variant-row__label">
        ${v.label}
        ${reqVar ? '<span class="badge approval-badge">Angefragt</span>' : ''}
      </span>
      <div class="form-field --sm">
        <select id="sel-${id}" onchange="setVariantQty('${id}', this.value)" aria-label="Freigabe-Menge ${v.label}">
          ${optionsHTML(value, requestedQtyFor(p.cartName, v.label))}
        </select>
      </div>
    </div>`;
}

function cardHTML(p) {
  const prodComm = productCommissionText(p);
  const thumb = p.img
    ? `<div class="product-thumb"><img src="${p.img}" alt="${p.cartName}">${p.imgHover ? `<img src="${p.imgHover}" alt="" aria-hidden="true">` : ''}</div>`
    : `<div class="product-thumb placeholder-bg" aria-hidden="true"></div>`;
  return `
    <div class="approval-product-card" id="card-${p.id}">
      <div class="cart-item">
        ${thumb}
        <div class="cart-item__info">
          <div class="cart-item__top">
            <div>
              <p class="cart-item__name">${p.cartName}</p>
              <p class="approval-product-card__commission${prodComm.muted ? ' --muted' : ''}" id="prodcomm-${p.id}">${prodComm.text}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="approval-variants">
        ${p.variants.map((v, vi) => variantRowHTML(p, v, vi)).join('')}
      </div>
      <div class="approval-product-card__note">
        <div class="form-field">
          <textarea id="note-${p.id}" rows="2" placeholder=" "></textarea>
          <label for="note-${p.id}">Notiz an Tierbesitzer (optional)</label>
        </div>
      </div>
    </div>`;
}

/* ── Intro je Zustand: konkrete Anfrage vs. Direkt-Empfehlung in der Praxis ── */
function renderIntro() {
  const el = document.getElementById('approvalIntro');
  if (approvalMode === 'direct') {
    el.innerHTML = `
      <h1 class="h2">Empfehlung ausstellen</h1>
      <div class="approval-direct">
        <p class="approval-direct__hint">Keine digitale Anfrage vorhanden — bitte die E-Mail-Adresse des Tierbesitzers eintragen.</p>
        <div class="form-field">
          <input type="email" id="directEmail" placeholder=" " autocomplete="off" oninput="this.closest('.form-field').classList.remove('--error')">
          <label for="directEmail">E-Mail-Adresse des Tierbesitzers</label>
        </div>
        <label class="form-check approval-consent">
          <input type="checkbox" id="directConsent">
          <span>Ich bestätige, dass der*die Tierbesitzer*in mit der Weitergabe der E-Mail-Adresse an die Inuvet GmbH und verbundene Unternehmen einverstanden ist und dass er auf den werblichen Charakter der Tierarzt-Empfehlung (bezahlte Werbepartnerschaft) hingewiesen wurde.</span>
        </label>
      </div>`;
  } else {
    el.innerHTML = `
      <h1 class="h2">Empfehlungsanfrage</h1>
      <div class="approval-meta">
        <span class="approval-meta__item"><span class="label-caps">Name</span><span class="approval-meta__val">Max Mustermann</span></span>
        <span class="approval-meta__item"><span class="label-caps">Eingegangen</span><span class="approval-meta__val">07.05.2026</span></span>
        <span class="approval-meta__item"><span class="label-caps">E-Mail</span><span class="approval-meta__val">kunde@email.com</span></span>
      </div>`;
  }
}

function setApprovalMode(mode, btn) {
  approvalMode = mode;
  if (btn) {
    btn.closest('.mockup-bar__group').querySelectorAll('.mockup-btn').forEach(b => b.classList.remove('--active'));
    btn.classList.add('--active');
  }
  initState();                 // Defaults des neuen Modus (Direkt: alles „nicht freigeben")
  const trust = document.getElementById('trustToggle');
  if (trust) trust.checked = false;
  renderIntro();
  renderGrid();                // Grid neu: Badges + Vorauswahl nur im 'request'-Modus
}

/* Mockup-Steuerleiste ein-/ausblenden (analog Tierarzt-Empfehlung.html) */
function toggleMockupBar() {
  const bar    = document.getElementById('mockupBar');
  const revive = document.getElementById('mockupRevive');
  const hide   = !bar.classList.contains('--hidden');
  bar.classList.toggle('--hidden', hide);
  revive.classList.toggle('--visible', hide);
  document.body.classList.toggle('--mockup-bar-visible', !hide);
}

function renderGrid() {
  // Angefragte Produkte zuerst, dann der Rest (stabile Reihenfolge)
  const ordered = [
    ...CATALOG.filter(p => isRequestedProduct(p.cartName)),
    ...CATALOG.filter(p => !isRequestedProduct(p.cartName)),
  ];
  document.getElementById('approvalGrid').innerHTML = ordered.map(cardHTML).join('');
  updateCounter();
}

/* ── Interaktion ── */
function setVariantQty(id, value) {
  approvalState[id] = value;
  updateProductCommission(Number(id.split('-')[0]));
  syncTrustCheckbox();
  updateCounter();
}

function allUnlimited() {
  return Object.values(approvalState).every(v => v === 'unlimited');
}
function syncTrustCheckbox() {
  const cb = document.getElementById('trustToggle');
  if (cb) cb.checked = allUnlimited();
}

/* Vertrauens-Modus: setzt alles auf „Unbegrenzt", bleibt editierbar */
function toggleTrust(on) {
  CATALOG.forEach(p => {
    p.variants.forEach((v, vi) => {
      const id = vid(p.id, vi);
      approvalState[id] = on ? 'unlimited' : defaultValueFor(p.cartName, v.label);
      const sel = document.getElementById('sel-' + id);
      if (sel) sel.value = approvalState[id];
    });
    updateProductCommission(p.id);
  });
  updateCounter();
}

function updateCounter() {
  let approvedProducts = 0;
  let totalFixed = 0;
  let unlimitedPerOrder = 0;

  CATALOG.forEach(p => {
    let anyApproved = false;
    p.variants.forEach((v, vi) => {
      const value = approvalState[vid(p.id, vi)];
      if (value === 'reject') return;
      anyApproved = true;
      const max = qtyMax(value);
      if (max === Infinity) unlimitedPerOrder += v.commission;
      else totalFixed += v.commission * max;
    });
    if (anyApproved) approvedProducts++;
  });

  const counter = document.getElementById('approvalCounter');
  counter.classList.remove('--error');
  counter.style.color = '';
  let text = `${approvedProducts} von ${CATALOG.length} Produkten freigegeben`;
  if (totalFixed > 0 || unlimitedPerOrder > 0) {
    let prov;
    if (totalFixed > 0 && unlimitedPerOrder > 0) prov = `bis zu ${formatEur(totalFixed)} + ${formatEur(unlimitedPerOrder)} pro Bestellung`;
    else if (totalFixed > 0)                     prov = `bis zu ${formatEur(totalFixed)}`;
    else                                         prov = `${formatEur(unlimitedPerOrder)} pro Bestellung`;
    text += ` · Provision: ${prov}`;
  }
  counter.textContent = text;
  counter.classList.toggle('--complete', approvedProducts > 0);
}

/* ── E-Mail-Overlay ── */
let emailOverlayData = {};

function openEmailsOverlay(keys) {
  const count = keys.length;
  document.getElementById('emailPanelCounter').textContent = `${count} Nachrichten ausgelöst`;
  document.getElementById('emailPanelBody').innerHTML = keys.map(key => {
    const d = emailOverlayData[key];
    if (!d) return '';
    return `
      <div class="mockup-email-inline${d.internal ? ' --internal' : ''}">
        <div class="mockup-email-inline__header">
          <span class="mockup-email__tag${d.internal ? ' --internal' : ''}">${d.tag}</span>
          <span class="mockup-email-inline__to">an: ${d.recipient}</span>
          <span class="mockup-email-inline__subject">Betreff: ${d.subject}</span>
        </div>
        <div class="mockup-email-inline__body">${d.body}</div>
      </div>`;
  }).join('');
  document.getElementById('emailOverlay').classList.add('--open');
  document.getElementById('emailPanel').classList.add('--open');
}

function closeEmailOverlay() {
  document.getElementById('emailOverlay').classList.remove('--open');
  document.getElementById('emailPanel').classList.remove('--open');
}

function submitApproval() {
  const counter = document.getElementById('approvalCounter');

  // Direkt-Empfehlung (kein digitaler Antrag): E-Mail + Einverständnis Pflicht
  if (approvalMode === 'direct') {
    const emailEl   = document.getElementById('directEmail');
    const consentEl = document.getElementById('directConsent');
    if (!emailEl.value.trim()) {
      emailEl.closest('.form-field').classList.add('--error');
      counter.classList.add('--error');
      counter.style.color = 'var(--color-error)';
      counter.textContent = 'Bitte die E-Mail-Adresse des Tierbesitzers eintragen.';
      emailEl.focus();
      return;
    }
    if (!consentEl.checked) {
      counter.classList.add('--error');
      counter.style.color = 'var(--color-error)';
      counter.textContent = 'Bitte das Einverständnis des Tierbesitzers bestätigen.';
      consentEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
  }

  const custEmail = approvalMode === 'direct' ? document.getElementById('directEmail').value.trim() : 'kunde@email.com';
  const custName  = approvalMode === 'direct' ? null : 'Max Mustermann';

  // Sammle Freigaben gruppiert pro Produkt
  const byProduct = {};
  let rejectedCount = 0;
  CATALOG.forEach(p => {
    const note = document.getElementById('note-' + p.id)?.value ?? '';
    p.variants.forEach((v, vi) => {
      const value = approvalState[vid(p.id, vi)];
      if (value === 'reject') { rejectedCount++; return; }
      (byProduct[p.id] ??= { name: p.cartName, note, sizes: [] })
        .sizes.push(`${v.label}: ${qtyLabel(value)}`);
    });
  });

  const approvedProducts = Object.values(byProduct);
  if (approvedProducts.length === 0) {
    counter.classList.add('--error');
    counter.style.color = 'var(--color-error)';
    counter.textContent = 'Bitte mindestens eine Größe freigeben, bevor du absendest.';
    counter.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const customerLines = approvedProducts.map(g =>
    `<li><strong>${g.name}</strong> — ${g.sizes.join(', ')}${g.note ? ` <em>(${g.note})</em>` : ''}</li>`
  ).join('');
  const internalLines = approvedProducts.map(g =>
    `<li><strong>${g.name}</strong>: ${g.sizes.join(', ')}${g.note ? ` – <em>${g.note}</em>` : ''}</li>`
  ).join('');

  const intro = approvalMode === 'direct'
    ? 'Dr. Martina Müller (Tierarztpraxis Grüntal) hat eine Empfehlung für Sie ausgestellt und folgende Produkte freigegeben:'
    : 'Dr. Martina Müller (Tierarztpraxis Grüntal) hat Ihre Empfehlungsanfrage bearbeitet und folgende Produkte freigegeben:';

  emailOverlayData = {
    customer: {
      tag: 'E-Mail',
      recipient: custEmail,
      subject: 'Ihre Empfehlung ist da!',
      body: `
        <p>${intro}</p>
        <ul>${customerLines}</ul>
        <p>Sie können die freigegebenen Produkte jetzt auf inuvet.com einlösen.</p>`,
    },
    internal: {
      tag: 'Intern',
      recipient: 'team@inuvet.com',
      subject: `${approvalMode === 'direct' ? 'Direkt-Empfehlung' : 'Freigabe'} bearbeitet: ${custName || custEmail}`,
      internal: true,
      body: `
        <p>Dr. Martina Müller (Tierarztpraxis Grüntal) hat ${approvalMode === 'direct' ? 'eine Direkt-Empfehlung (in der Praxis ausgestellt)' : 'die Empfehlungsanfrage'} für <strong>${custName || 'Tierbesitzer*in'}</strong> (${custEmail}) bearbeitet:</p>
        <ul>${internalLines}</ul>
        <p>${approvedProducts.length} Produkt${approvedProducts.length !== 1 ? 'e' : ''} freigegeben${rejectedCount > 0 ? `, ${rejectedCount} Größe${rejectedCount !== 1 ? 'n' : ''} nicht freigegeben` : ''}.</p>
        ${approvalMode === 'direct' ? '<p class="mockup-email-panel__note">Direkt-Empfehlung: E-Mail-Weitergabe + werblicher Charakter wurden vom Tierarzt bestätigt.</p>' : ''}
        <p class="mockup-email-panel__note">${custName || 'Der Tierbesitzer'} wurde automatisch per E-Mail benachrichtigt.</p>`,
    },
  };

  document.getElementById('approvalMain').innerHTML = `
    <div class="success-state">
      <span class="material-icons success-state__icon">check_circle</span>
      <h2 class="success-state__title">Freigabe übermittelt</h2>
      <p class="success-state__body">
        Der Tierbesitzer wird per E-Mail über Ihre Entscheidung informiert.
      </p>
    </div>
    <div class="approval-footer">
      <a href="#" onclick="location.reload();return false;" class="btn --ghost">Zurück zur Übersicht</a>
    </div>`;

  setTimeout(() => openEmailsOverlay(['customer', 'internal']), 500);
}

/* ── Initial render ── */
initState();
renderIntro();
renderGrid();
