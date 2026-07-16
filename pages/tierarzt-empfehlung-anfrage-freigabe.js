/* ════════════════════════════════════════════
   Tierarzt-Empfehlung-Anfrage-Freigabe — datengetriebenes Rendern
   Der Tierarzt sieht ALLE Produkte (5 Darreichungsformen) und kann
   pro Größe eine eigene Menge freigeben. Angefragte Produkte stehen oben.
   ════════════════════════════════════════════ */

const CALMIN_1 = '../assets/images/Calmin_Packshot_01.jpeg';
const CALMIN_2 = '../assets/images/Calmin_Packshot_02.png';
const HEPAX_1  = '../assets/images/Hepax_Packshot_01.jpeg';
const HEPAX_2  = '../assets/images/Hepax_Packshot_02.png';

/* Katalog — alle Darreichungsformen (gespiegelt aus tierarzt-empfehlung.js PRODUCTS).
   Nur Calmin- und Hepax-forte-Packshots existieren (Dateipräfix Hepax_); Inzym → Platzhalter (img:null).
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

/* Was der Tierbesitzer angefragt hat — qty = angefragte Packungszahl.
   Wird aus empfehlung-anfragen-mock.js geladen (aktive Anfrage). */
let activeRequest = null;
let REQUEST = [];

const QTY_PRESETS = [1, 2, 5]; // Basis-Stufen im Dropdown

/* Zustand: 'direct' = Empfehlung ausstellen · 'request' = Empfehlungsanfrage (via Link).
   Default Dropdown: „–“; „nicht freigeben“ nur nach aktiver Wahl. Ausnahme request: angefragte Menge vorausgewählt. */
let approvalMode = 'direct'; // 'direct' (Standard) | 'request' (via Anfrage-Link)
let requestHandled = false;   // Anfrage-Modus: nach Freigabe abgeschlossen

/* ── State: pro Variante (id = "produktId-variantenIndex") ein Freigabe-Wert ──
   'reject' | 'maxN' | 'unlimited' | 'settled' (–, bereits über Tabelle erledigt) */
const VARIANT_SETTLED = 'settled';
const approvalState = {};
let trustSnapshot = null; // Zustand vor „Volles Vertrauen“

function vid(productId, variantIndex) { return productId + '-' + variantIndex; }

// Anfrage-bezogene Helfer greifen nur im 'request'-Modus
function isRequestedProduct(cartName) {
  return approvalMode === 'request' && !requestHandled && REQUEST.some(r => r.cartName === cartName);
}
function isRequestedVariant(cartName, label) {
  return REQUEST.some(r => r.cartName === cartName && r.variantLabel === label);
}

function isVariantQueueProcessed(cartName, label) {
  if (!activeRequest) return false;
  const reqId = activeRequest.id;
  return empfehlungIsVariantApproved(reqId, cartName, label) ||
    empfehlungIsVariantDeclined(reqId, cartName, label);
}

function requestedQtyFor(cartName, label) {
  if (approvalMode !== 'request' || requestHandled) return null;
  const r = REQUEST.find(x => x.cartName === cartName && x.variantLabel === label);
  return r ? 'max' + r.qty : null;
}

function isRequestDecisionMode() {
  return approvalMode === 'request' && !requestHandled;
}

function showSettledOption() {
  return approvalMode === 'direct' || isRequestDecisionMode();
}

function defaultValueFor(cartName, label) {
  if (approvalMode === 'request' && requestHandled) return 'reject';
  if (isRequestDecisionMode()) {
    if (isVariantQueueProcessed(cartName, label)) return VARIANT_SETTLED;
    const requested = requestedQtyFor(cartName, label);
    if (requested) return requested;
  }
  return VARIANT_SETTLED;
}

function variantSelectionValue(p, v, vi) {
  return approvalState[vid(p.id, vi)];
}

function submitVariantValue(p, v, vi) {
  const value = variantSelectionValue(p, v, vi);
  if (value === VARIANT_SETTLED) return null;
  return value;
}

function isExplicitApprovalValue(value) {
  return value !== VARIANT_SETTLED && value !== 'reject';
}

function syncQueueFlagsAfterChange(p, v, value) {
  if (!activeRequest || value === VARIANT_SETTLED) return;
  const reqId = activeRequest.id;
  if (empfehlungIsVariantApproved(reqId, p.cartName, v.label)) {
    empfehlungClearVariantApproved(reqId, p.cartName, v.label);
  }
  if (empfehlungIsVariantDeclined(reqId, p.cartName, v.label)) {
    empfehlungClearVariantDeclined(reqId, p.cartName, v.label);
  }
}

// State auf die Defaults des aktuellen Modus (re)initialisieren
function initState() {
  trustSnapshot = null;
  CATALOG.forEach(p => p.variants.forEach((v, vi) => {
    approvalState[vid(p.id, vi)] = defaultValueFor(p.cartName, v.label);
  }));
}

function captureTrustSnapshot() {
  const snap = {};
  CATALOG.forEach(p => p.variants.forEach((v, vi) => {
    snap[vid(p.id, vi)] = approvalState[vid(p.id, vi)];
  }));
  return snap;
}

/* ── Helfer für Mengen-Werte ── */
function qtyMax(value) {
  if (value === 'reject' || value === VARIANT_SETTLED) return 0;
  if (value === 'unlimited') return Infinity;
  if (value && value.startsWith('max')) return parseInt(value.slice(3), 10);
  return null;
}
function qtyLabel(value) {
  if (value === VARIANT_SETTLED) return '–';
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
    const value = submitVariantValue(p, v, vi);
    if (!isExplicitApprovalValue(value)) return;
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

function optionsHTML(selected, requestedValue, withSettled) {
  const nums = new Set(QTY_PRESETS);
  if (requestedValue && requestedValue.startsWith('max')) nums.add(parseInt(requestedValue.slice(3), 10));
  const sorted = [...nums].sort((a, b) => a - b);

  let opts = '';
  if (withSettled) {
    opts += `<option value="${VARIANT_SETTLED}"${selected === VARIANT_SETTLED ? ' selected' : ''}>–</option>`;
  }
  opts += `<option value="reject"${selected === 'reject' ? ' selected' : ''}>nicht freigeben</option>`;
  opts += sorted.map(n => {
    const val = 'max' + n;
    return `<option value="${val}"${selected === val ? ' selected' : ''}>max. ${n}×</option>`;
  }).join('');
  opts += `<option value="unlimited"${selected === 'unlimited' ? ' selected' : ''}>Unbegrenzt</option>`;
  return opts;
}

/* ── Rendering ── */
function approvalBadgeClass(content) {
  if (content.declined) return ' --muted';
  if (content.approved) return ' --free';
  return ' --honey';
}

function requestedQtyNumber(cartName, label) {
  const item = REQUEST.find(x => x.cartName === cartName && x.variantLabel === label);
  return item ? item.qty : null;
}

function declinedBadgeText(cartName, label) {
  const qty = requestedQtyNumber(cartName, label);
  return qty != null ? `nicht freigeben max. ${qty}×` : 'nicht freigeben';
}

function variantStatusBadgeContent(p, v, vi) {
  if (approvalMode !== 'request' || requestHandled) return null;
  if (activeRequest) {
    const value = approvalState[vid(p.id, vi)];
    if (value === VARIANT_SETTLED) {
      const approvedQty = empfehlungGetApprovedQty(activeRequest.id, p.cartName, v.label);
      if (approvedQty != null) {
        return { text: `Freigegeben max. ${approvedQty}×`, approved: true };
      }
      if (empfehlungIsVariantDeclined(activeRequest.id, p.cartName, v.label)) {
        return { text: declinedBadgeText(p.cartName, v.label), declined: true };
      }
      const requestedVal = requestedQtyFor(p.cartName, v.label);
      if (requestedVal) return { text: 'Angefragt', declined: false };
    }
  }
  const requestedVal = requestedQtyFor(p.cartName, v.label);
  if (!requestedVal) return null;
  const value = approvalState[vid(p.id, vi)];
  if (value === 'reject') return { text: declinedBadgeText(p.cartName, v.label), declined: true };
  if (value === requestedVal || value === 'unlimited') return { text: 'Angefragt', declined: false };
  return null;
}

function variantStatusBadgeHTML(p, v, vi) {
  const content = variantStatusBadgeContent(p, v, vi);
  if (!content) return '';
  const mod = approvalBadgeClass(content);
  return `<span class="badge${mod}" id="badge-${vid(p.id, vi)}">${content.text}</span>`;
}

function updateVariantBadge(id) {
  const [productId, viStr] = id.split('-');
  const p = CATALOG.find(x => x.id === Number(productId));
  if (!p) return;
  const v = p.variants[Number(viStr)];
  const rowLabel = document.querySelector(`#sel-${id}`)?.closest('.approval-variant-row')?.querySelector('.approval-variant-row__label');
  if (!rowLabel) return;

  const existing = document.getElementById('badge-' + id);
  const content = variantStatusBadgeContent(p, v, Number(viStr));

  if (!content) {
    existing?.remove();
    return;
  }

  const mod = approvalBadgeClass(content);
  if (existing) {
    existing.textContent = content.text;
    existing.className = 'badge' + mod;
    return;
  }

  rowLabel.insertAdjacentHTML('beforeend', `<span class="badge${mod}" id="badge-${id}">${content.text}</span>`);
}

function variantRowHTML(p, v, vi) {
  const id = vid(p.id, vi);
  const value = approvalState[id];
  const withSettled = showSettledOption();
  const requestedValue = requestedQtyNumber(p.cartName, v.label);
  const extraQty = requestedValue != null ? 'max' + requestedValue : null;
  return `
    <div class="approval-variant-row">
      <span class="approval-variant-row__label">
        ${v.label}
        ${variantStatusBadgeHTML(p, v, vi)}
      </span>
      <div class="form-field --sm${value === VARIANT_SETTLED ? ' --settled' : ''}">
        <select id="sel-${id}" onchange="setVariantQty('${id}', this.value)" aria-label="Freigabe-Menge ${v.label}">
          ${optionsHTML(value, extraQty, withSettled)}
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
    </div>`;
}

/* ── Submit-Leiste + Direkt-Modal ── */
function isDirectFormReady() {
  const emailEl   = document.getElementById('directEmail');
  const consentEl = document.getElementById('directConsent');
  if (!emailEl || !consentEl) return false;
  return emailEl.value.trim() !== '' && emailEl.validity.valid && consentEl.checked;
}

function hasApprovedProducts() {
  return CATALOG.some(p => p.variants.some((v, vi) => {
    const value = approvalMode === 'request'
      ? variantSelectionValue(p, v, vi)
      : submitVariantValue(p, v, vi);
    return isExplicitApprovalValue(value);
  }));
}

function hasExplicitSelection() {
  if (approvalMode === 'direct') return hasApprovedProducts();
  return CATALOG.some(p => p.variants.some((v, vi) =>
    variantSelectionValue(p, v, vi) !== VARIANT_SETTLED
  ));
}

function setCounterText(line1, line2) {
  const counter = document.getElementById('approvalCounter');
  if (!counter) return;
  if (line2) counter.innerHTML = `${line1}<br>${line2}`;
  else counter.textContent = line1;
}

function showCounterError(message) {
  const counter = document.getElementById('approvalCounter');
  if (!counter) return;
  counter.classList.remove('--complete');
  counter.classList.add('--error');
  setCounterText(message);
  counter.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function syncBodyScroll() {
  document.body.style.overflow = document.querySelector('.modal-overlay.--open') ? 'hidden' : '';
}

function setModalOpen(id, open) {
  document.getElementById(id)?.classList.toggle('--open', open);
  syncBodyScroll();
}

function updateBarButtons() {
  const btn = document.getElementById('submitApprovalBtn');
  if (!btn) return;
  const hasProducts = hasApprovedProducts();

  if (approvalMode === 'direct') {
    btn.textContent = 'Weiter';
    btn.classList.remove('--primary');
    btn.classList.add('--secondary');
  } else {
    btn.textContent = 'Auswahl absenden';
    btn.classList.remove('--secondary');
    btn.classList.add('--primary');
  }
  btn.disabled = approvalMode === 'direct' ? !hasProducts : !hasExplicitSelection();
}

function updateDirectModalReady() {
  const btn = document.getElementById('directSubmitBtn');
  if (btn) btn.disabled = !isDirectFormReady();
}

function onDirectFieldChange() {
  document.getElementById('directEmailField')?.classList.remove('--error');
  updateDirectModalReady();
}

function resetDirectFormFields() {
  const emailEl   = document.getElementById('directEmail');
  const consentEl = document.getElementById('directConsent');
  if (emailEl) emailEl.value = '';
  if (consentEl) consentEl.checked = false;
  document.getElementById('directEmailField')?.classList.remove('--error');
  updateDirectModalReady();
}

function openDirectModal() {
  if (!hasApprovedProducts()) return;
  setModalOpen('directModalOverlay', true);
  updateDirectModalReady();
  document.getElementById('directEmail')?.focus();
}

function closeDirectModal() {
  setModalOpen('directModalOverlay', false);
}

function openSuccessModal(message) {
  const body = document.getElementById('successModalBody');
  if (body && message) body.textContent = message;
  setModalOpen('successModalOverlay', true);
}

function loadActiveRequest() {
  activeRequest = empfehlungResolveRequestFromURL();
  REQUEST = empfehlungRequestItems(activeRequest.id);
}

function resetAfterSuccess() {
  closeEmailOverlay();
  if (approvalMode === 'request') {
    requestHandled = true;
    empfehlungMarkRequestRemoved(activeRequest.id);
  }
  initState();
  const trust = document.getElementById('trustToggle');
  if (trust) trust.checked = false;
  if (approvalMode === 'direct') resetDirectFormFields();
  const noteEl = document.getElementById('approvalNote');
  if (noteEl) noteEl.value = '';
  renderIntro();
  renderGrid();
  empfehlungSyncOpenRequestNavBadges();
}

function closeSuccessModal(reset) {
  setModalOpen('successModalOverlay', false);
  if (reset) resetAfterSuccess();
}

function handlePrimaryAction() {
  if (approvalMode === 'direct') {
    openDirectModal();
    return;
  }
  submitApproval();
}

function submitDirectApproval() {
  const emailEl   = document.getElementById('directEmail');
  const consentEl = document.getElementById('directConsent');
  const field     = document.getElementById('directEmailField');

  if (!emailEl.value.trim()) {
    field?.classList.add('--error');
    emailEl.focus();
    return;
  }
  if (!consentEl.checked) {
    consentEl.focus();
    return;
  }
  submitApproval();
}

/* ── Intro je Zustand: konkrete Anfrage vs. Direkt-Empfehlung in der Praxis ── */
function renderIntro() {
  const el = document.getElementById('approvalIntro');
  if (approvalMode === 'direct') {
    el.innerHTML = `<h1>Freigabe ausstellen</h1>`;
  } else if (requestHandled) {
    el.innerHTML = `<h1>Anfrage bearbeitet</h1>`;
  } else {
    el.innerHTML = `
      <h1>Freigabe-Anfrage</h1>
      <div class="approval-meta">
        <span class="approval-meta__item"><span class="label-caps">Name</span><span class="approval-meta__val">${activeRequest.customerName}</span></span>
        <span class="approval-meta__item"><span class="label-caps">Eingegangen</span><span class="approval-meta__val">${empfehlungFormatDateDE(activeRequest.receivedAt)}</span></span>
        <span class="approval-meta__item"><span class="label-caps">E-Mail</span><span class="approval-meta__val">${activeRequest.customerEmail}</span></span>
      </div>`;
  }
}

function syncMockupBarMode() {
  document.querySelectorAll('#mockupBar [data-mode]').forEach(btn => {
    btn.classList.toggle('--active', btn.dataset.mode === approvalMode);
  });
}

function setApprovalMode(mode, btn) {
  approvalMode = mode;
  requestHandled = false;
  closeDirectModal();
  setModalOpen('successModalOverlay', false);
  if (btn) {
    btn.closest('.mockup-bar__group').querySelectorAll('.mockup-btn').forEach(b => b.classList.remove('--active'));
    btn.classList.add('--active');
  }
  if (mode === 'request') loadActiveRequest();
  initState();
  const trust = document.getElementById('trustToggle');
  if (trust) trust.checked = false;
  if (mode === 'direct') resetDirectFormFields();
  renderIntro();
  renderGrid();
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
  const ordered = [...CATALOG].sort((a, b) => a.cartName.localeCompare(b.cartName, 'de'));
  document.getElementById('approvalGrid').innerHTML = ordered.map(cardHTML).join('');
  updateCounter();
}

/* ── Interaktion ── */
function refreshVariantSelect(id) {
  const [productId, viStr] = id.split('-');
  const p = CATALOG.find(x => x.id === Number(productId));
  if (!p) return;
  const v = p.variants[Number(viStr)];
  const sel = document.getElementById('sel-' + id);
  if (!sel) return;
  const value = approvalState[id];
  const withSettled = showSettledOption();
  const requestedValue = requestedQtyNumber(p.cartName, v.label);
  const extraQty = requestedValue != null ? 'max' + requestedValue : null;
  sel.innerHTML = optionsHTML(value, extraQty, withSettled);
  sel.value = value;
  sel.closest('.form-field')?.classList.toggle('--settled', value === VARIANT_SETTLED);
}

function setVariantQty(id, value) {
  approvalState[id] = value;
  const [productId, viStr] = id.split('-');
  const p = CATALOG.find(x => x.id === Number(productId));
  const v = p?.variants[Number(viStr)];
  if (p && v && activeRequest) syncQueueFlagsAfterChange(p, v, value);
  refreshVariantSelect(id);
  updateVariantBadge(id);
  updateProductCommission(Number(productId));
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
function applyApprovalValues(valueForVariant, { syncQueue = true } = {}) {
  CATALOG.forEach(p => {
    p.variants.forEach((v, vi) => {
      const id = vid(p.id, vi);
      const next = valueForVariant(p, v, vi);
      approvalState[id] = next;
      if (syncQueue) syncQueueFlagsAfterChange(p, v, next);
      refreshVariantSelect(id);
      const sel = document.getElementById('sel-' + id);
      if (sel) sel.value = approvalState[id];
      updateVariantBadge(id);
    });
    updateProductCommission(p.id);
  });
  updateCounter();
}

function toggleTrust(on) {
  if (on) {
    trustSnapshot = captureTrustSnapshot();
    applyApprovalValues(() => 'unlimited', { syncQueue: false });
    return;
  }
  const snap = trustSnapshot;
  trustSnapshot = null;
  applyApprovalValues(
    (p, v, vi) => snap != null ? snap[vid(p.id, vi)] : defaultValueFor(p.cartName, v.label),
    { syncQueue: false }
  );
}

function updateCounter() {
  let approvedProducts = 0;
  let totalFixed = 0;
  let unlimitedPerOrder = 0;
  let explicitRejections = 0;

  CATALOG.forEach(p => {
    let anyApproved = false;
    p.variants.forEach((v, vi) => {
      const value = variantSelectionValue(p, v, vi);
      if (value === 'reject') {
        if (approvalMode === 'request') explicitRejections++;
        return;
      }
      if (!isExplicitApprovalValue(value)) return;
      anyApproved = true;
      const max = qtyMax(value);
      if (max === Infinity) unlimitedPerOrder += v.commission;
      else totalFixed += v.commission * max;
    });
    if (anyApproved) approvedProducts++;
  });

  const counter = document.getElementById('approvalCounter');
  counter.classList.remove('--error');

  if (approvedProducts > 0) {
    const countLine = `${approvedProducts} Produkt${approvedProducts !== 1 ? 'e' : ''} ausgewählt`;
    const provLine  = `Provision: ca. ${formatEur(totalFixed + unlimitedPerOrder)}`;
    setCounterText(countLine, provLine);
  } else if (approvalMode === 'request' && explicitRejections > 0) {
    setCounterText('Nur Absagen ausgewählt');
  } else {
    setCounterText('Noch keine Entscheidung getroffen');
  }

  counter.classList.toggle('--complete', approvalMode === 'request'
    ? hasExplicitSelection()
    : approvedProducts > 0);
  updateBarButtons();
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
  if (approvalMode === 'direct' && !isDirectFormReady()) return;

  const custEmail = approvalMode === 'direct' ? document.getElementById('directEmail').value.trim() : activeRequest.customerEmail;
  const custName  = approvalMode === 'direct' ? null : activeRequest.customerName;
  const note      = document.getElementById('approvalNote')?.value.trim() ?? '';

  const byProduct = {};
  const rejectedItems = [];
  const redeemedVariants = [];
  let skippedSettled = 0;

  CATALOG.forEach(p => {
    p.variants.forEach((v, vi) => {
      const value = submitVariantValue(p, v, vi);
      if (value == null) {
        skippedSettled++;
        return;
      }
      if (value === 'reject') {
        if (approvalMode === 'request') {
          rejectedItems.push({
            name: p.cartName,
            variant: v.label,
            qty: requestedQtyNumber(p.cartName, v.label),
          });
        }
        return;
      }
      const position = activeRequest?.positions?.find(
        pos => pos.cartName === p.cartName && pos.variantLabel === v.label
      );
      redeemedVariants.push({
        cartName: p.cartName,
        variantLabel: v.label,
        value,
        fallbackQty: position?.qty ?? requestedQtyNumber(p.cartName, v.label),
        positionId: position?.id ?? null,
      });
      (byProduct[p.id] ??= { name: p.cartName, sizes: [] })
        .sizes.push(`${v.label}: ${qtyLabel(value)}`);
    });
  });

  const approvedProducts = Object.values(byProduct);

  if (approvalMode === 'request') {
    if (!hasExplicitSelection()) {
      showCounterError('Bitte mindestens eine Entscheidung treffen.');
      return;
    }
  } else if (approvedProducts.length === 0) {
    showCounterError('Bitte mindestens eine Größe freigeben.');
    return;
  }

  if (approvalMode === 'direct') {
    const customerLines = approvedProducts.map(g =>
      `<li><strong>${g.name}</strong> — ${g.sizes.join(', ')}</li>`
    ).join('');
    const internalLines = approvedProducts.map(g =>
      `<li><strong>${g.name}</strong>: ${g.sizes.join(', ')}</li>`
    ).join('');
    const noteBlock = note ? `<p><strong>Notiz an Sie:</strong> <em>${note}</em></p>` : '';
    const noteBlockInternal = note ? `<p><strong>Notiz an Tierbesitzer:</strong> <em>${note}</em></p>` : '';

    emailOverlayData = {
      customer: {
        tag: 'E-Mail',
        recipient: custEmail,
        subject: 'Ihre Empfehlung ist da!',
        body: `
          <p>Dr. Martina Müller (Tierarztpraxis Grüntal) hat eine Empfehlung für Sie ausgestellt und folgende Produkte freigegeben:</p>
          <ul>${customerLines}</ul>
          ${noteBlock}
          <p>Sie können die freigegebenen Produkte jetzt auf inuvet.com einlösen.</p>`,
      },
      internal: {
        tag: 'Intern',
        recipient: 'team@inuvet.com',
        subject: `Direkt-Empfehlung bearbeitet: ${custEmail}`,
        internal: true,
        body: `
          <p>Dr. Martina Müller (Tierarztpraxis Grüntal) hat eine Direkt-Empfehlung (in der Praxis ausgestellt) für <strong>${custName || 'Tierbesitzer*in'}</strong> (${custEmail}) bearbeitet:</p>
          <ul>${internalLines}</ul>
          ${noteBlockInternal}
          <p>${approvedProducts.length} Produkt${approvedProducts.length !== 1 ? 'e' : ''} freigegeben.</p>
          <p class="mockup-email-panel__note">Direkt-Empfehlung: E-Mail-Weitergabe + werblicher Charakter wurden vom Tierarzt bestätigt.</p>
          <p class="mockup-email-panel__note">${custName || 'Der Tierbesitzer'} wurde automatisch per E-Mail benachrichtigt.</p>`,
      },
    };
  } else {
    const approvedLines = approvedProducts.map(g =>
      `<li><strong>${g.name}</strong> — ${g.sizes.join(', ')}</li>`
    ).join('');
    const rejectedLines = rejectedItems.map(item => {
      const qtyPart = item.qty != null ? ` (angefragt: max. ${item.qty}×)` : '';
      return `<li><strong>${item.name}</strong> — ${item.variant}${qtyPart}</li>`;
    }).join('');

    const approvedBlock = approvedLines
      ? `<p><strong>Freigegeben:</strong></p><ul>${approvedLines}</ul>`
      : '';
    const rejectedBlock = rejectedLines
      ? `<p><strong>Nicht freigegeben:</strong></p><ul>${rejectedLines}</ul>`
      : '';
    const noteBlock = note ? `<p><strong>Notiz an Sie:</strong> <em>${note}</em></p>` : '';
    const noteBlockInternal = note ? `<p><strong>Notiz an Tierbesitzer:</strong> <em>${note}</em></p>` : '';

    emailOverlayData = {
      customer: {
        tag: 'E-Mail',
        recipient: custEmail,
        subject: 'Ihre Empfehlungsanfrage wurde bearbeitet',
        body: `
          <p>Dr. Martina Müller (Tierarztpraxis Grüntal) hat Ihre Empfehlungsanfrage bearbeitet:</p>
          ${approvedBlock}
          ${rejectedBlock}
          ${noteBlock}
          ${approvedLines ? '<p>Sie können die freigegebenen Produkte jetzt auf inuvet.com einlösen.</p>' : ''}`,
      },
      internal: {
        tag: 'Intern',
        recipient: 'team@inuvet.com',
        subject: `Empfehlungsanfrage bearbeitet: ${custName || custEmail}`,
        internal: true,
        body: `
          <p>Dr. Martina Müller (Tierarztpraxis Grüntal) hat die Empfehlungsanfrage für <strong>${custName || 'Tierbesitzer*in'}</strong> (${custEmail}) bearbeitet:</p>
          ${approvedBlock}
          ${rejectedBlock}
          ${noteBlockInternal}
          <p>${approvedProducts.length} Produkt${approvedProducts.length !== 1 ? 'e' : ''} freigegeben, ${rejectedItems.length} Position${rejectedItems.length !== 1 ? 'en' : ''} abgelehnt${skippedSettled > 0 ? `, ${skippedSettled} ohne Entscheidung (–)` : ''}.</p>
          <p class="mockup-email-panel__note">${custName || 'Der Tierbesitzer'} wurde automatisch per E-Mail benachrichtigt.</p>`,
      },
    };
  }

  closeDirectModal();

  const redeemedCustomer = approvalMode === 'direct'
    ? custEmail
    : (custName || custEmail);
  const redeemedRequestId = approvalMode === 'request' ? activeRequest?.id : null;
  empfehlungRecordRedeemedFromSubmit(redeemedCustomer, redeemedRequestId, redeemedVariants);

  const successMsg = approvalMode === 'direct'
    ? 'Die Freigabe wurde erteilt. Der Tierbesitzer wird per E-Mail informiert.'
    : 'Ihre Auswahl wurde abgesendet. Der Tierbesitzer wird per E-Mail über Freigaben und Absagen informiert.';

  openSuccessModal(successMsg);
  setTimeout(() => openEmailsOverlay(['customer', 'internal']), 500);
}

/* ── Initial render ── */
if (new URLSearchParams(window.location.search).has('anfrage')) {
  approvalMode = 'request';
}
loadActiveRequest();
initState();
syncMockupBarMode();
renderIntro();
renderGrid();
document.addEventListener('DOMContentLoaded', empfehlungSyncOpenRequestNavBadges);
window.addEventListener('pageshow', empfehlungSyncOpenRequestNavBadges);
empfehlungSyncOpenRequestNavBadges();
