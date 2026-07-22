/* ════════════════════════════════════════════
   Tierarzt-Empfehlung-Anfrage-Freigabe — Freigabe ausstellen (Direkt)
   Der Tierarzt sieht alle Produkte und kann pro Größe eine Menge
   freigeben. Anfragen laufen über Offene Anfragen — nicht über diese Seite.
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

const QTY_PRESETS = [1, 2, 5]; // Basis-Stufen im Dropdown

/* State: pro Variante (id = "produktId-variantenIndex") ein Freigabe-Wert
   'maxN' | 'unlimited' | 'settled' (–) */
const VARIANT_SETTLED = 'settled';
const approvalState = {};
let trustSnapshot = null; // Zustand vor „Volles Vertrauen“

function vid(productId, variantIndex) { return productId + '-' + variantIndex; }

function defaultValueFor() {
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
  return value !== VARIANT_SETTLED && value != null;
}

function initState() {
  trustSnapshot = null;
  CATALOG.forEach(p => p.variants.forEach((v, vi) => {
    approvalState[vid(p.id, vi)] = defaultValueFor();
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
  if (value === VARIANT_SETTLED) return 0;
  if (value === 'unlimited') return Infinity;
  if (value && value.startsWith('max')) return parseInt(value.slice(3), 10);
  return null;
}
function qtyLabel(value) {
  if (value === VARIANT_SETTLED) return '–';
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

function optionsHTML(selected) {
  const sorted = [...QTY_PRESETS].sort((a, b) => a - b);
  let opts = `<option value="${VARIANT_SETTLED}"${selected === VARIANT_SETTLED ? ' selected' : ''}>–</option>`;
  opts += sorted.map(n => {
    const val = 'max' + n;
    return `<option value="${val}"${selected === val ? ' selected' : ''}>max. ${n}×</option>`;
  }).join('');
  opts += `<option value="unlimited"${selected === 'unlimited' ? ' selected' : ''}>Unbegrenzt</option>`;
  return opts;
}

/* ── Rendering ── */
function variantRowHTML(p, v, vi) {
  const id = vid(p.id, vi);
  const value = approvalState[id];
  return `
    <div class="approval-variant-row">
      <span class="approval-variant-row__label">${v.label}</span>
      <div class="form-field --sm${value === VARIANT_SETTLED ? ' --settled' : ''}">
        <select id="sel-${id}" onchange="setVariantQty('${id}', this.value)" aria-label="Freigabe-Menge ${v.label}">
          ${optionsHTML(value)}
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

/* ── Zweistufiger Flow: 1 Empfänger → 2 Produkte ── */
let approvalStep = 1; // 1 = Consent/E-Mail · 2 = Produktauswahl

function isRecipientFormReady() {
  const emailEl   = document.getElementById('directEmail');
  const consentEl = document.getElementById('directConsent');
  if (!emailEl || !consentEl) return false;
  return emailEl.value.trim() !== '' && emailEl.validity.valid && consentEl.checked;
}

function hasApprovedProducts() {
  return CATALOG.some(p => p.variants.some((v, vi) =>
    isExplicitApprovalValue(submitVariantValue(p, v, vi))
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
  btn.textContent = 'Produkte freigeben';
  btn.classList.add('--primary');
  btn.classList.remove('--secondary');
  btn.disabled = !hasApprovedProducts();
}

function updateRecipientStepReady() {
  const btn = document.getElementById('continueToProductsBtn');
  if (btn) btn.disabled = !isRecipientFormReady();
}

function onRecipientFieldChange() {
  document.getElementById('directEmailField')?.classList.remove('--error');
  updateRecipientStepReady();
}

function resetRecipientFormFields() {
  const emailEl   = document.getElementById('directEmail');
  const consentEl = document.getElementById('directConsent');
  if (emailEl) emailEl.value = '';
  if (consentEl) consentEl.checked = false;
  document.getElementById('directEmailField')?.classList.remove('--error');
  updateRecipientStepReady();
}

function syncApprovalStepUi() {
  const step1 = document.getElementById('approvalStepRecipient');
  const step2 = document.getElementById('approvalStepProducts');
  const bar = document.getElementById('approvalSubmitBar');
  const main = document.getElementById('approvalMain');
  const onProducts = approvalStep === 2;

  if (step1) step1.hidden = onProducts;
  if (step2) step2.hidden = !onProducts;
  if (bar) bar.hidden = !onProducts;
  main?.classList.toggle('--products', onProducts);

  document.querySelectorAll('#approvalSteps .tab-btn').forEach(btn => {
    const active = Number(btn.dataset.step) === approvalStep;
    btn.classList.toggle('--active', active);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
  });

  if (onProducts) {
    const email = document.getElementById('directEmail')?.value.trim() || '';
    const display = document.getElementById('recipientEmailDisplay');
    if (display) display.textContent = email;
  }
}

function continueToProducts() {
  const emailEl = document.getElementById('directEmail');
  const consentEl = document.getElementById('directConsent');
  const field = document.getElementById('directEmailField');

  if (!emailEl?.value.trim() || !emailEl.validity.valid) {
    field?.classList.add('--error');
    emailEl?.focus();
    return false;
  }
  if (!consentEl?.checked) {
    consentEl?.focus();
    return false;
  }

  approvalStep = 2;
  syncApprovalStepUi();
  renderGrid();
  document.getElementById('approvalStepProducts')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
}

function backToRecipient() {
  approvalStep = 1;
  syncApprovalStepUi();
  updateRecipientStepReady();
  document.getElementById('directEmail')?.focus();
}

function goToApprovalStep(step) {
  if (step === approvalStep) return;
  if (step === 1) {
    backToRecipient();
    return;
  }
  if (step === 2) continueToProducts();
}

function openSuccessModal(message) {
  const body = document.getElementById('successModalBody');
  if (body && message) body.textContent = message;
  setModalOpen('successModalOverlay', true);
}

function resetAfterSuccess() {
  closeEmailOverlay();
  initState();
  const trust = document.getElementById('trustToggle');
  if (trust) trust.checked = false;
  resetRecipientFormFields();
  const noteEl = document.getElementById('approvalNote');
  if (noteEl) noteEl.value = '';
  approvalStep = 1;
  syncApprovalStepUi();
  renderIntro();
  empfehlungSyncOpenRequestNavBadges();
}

function closeSuccessModal(reset) {
  setModalOpen('successModalOverlay', false);
  if (reset) resetAfterSuccess();
}

function handlePrimaryAction() {
  submitApproval();
}

function renderIntro() {
  const el = document.getElementById('approvalIntro');
  if (el) el.innerHTML = `<h1>Freigabe ausstellen</h1>`;
}

function renderGrid() {
  const grid = document.getElementById('approvalGrid');
  if (!grid) return;
  const ordered = [...CATALOG].sort((a, b) => a.cartName.localeCompare(b.cartName, 'de'));
  grid.innerHTML = ordered.map(cardHTML).join('');
  updateCounter();
}

/* ── Interaktion ── */
function refreshVariantSelect(id) {
  const sel = document.getElementById('sel-' + id);
  if (!sel) return;
  const value = approvalState[id];
  sel.innerHTML = optionsHTML(value);
  sel.value = value;
  sel.closest('.form-field')?.classList.toggle('--settled', value === VARIANT_SETTLED);
}

function setVariantQty(id, value) {
  approvalState[id] = value;
  const [productId] = id.split('-');
  refreshVariantSelect(id);
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
function applyApprovalValues(valueForVariant) {
  CATALOG.forEach(p => {
    p.variants.forEach((v, vi) => {
      const id = vid(p.id, vi);
      approvalState[id] = valueForVariant(p, v, vi);
      refreshVariantSelect(id);
      const sel = document.getElementById('sel-' + id);
      if (sel) sel.value = approvalState[id];
    });
    updateProductCommission(p.id);
  });
  updateCounter();
}

function toggleTrust(on) {
  if (on) {
    trustSnapshot = captureTrustSnapshot();
    applyApprovalValues(() => 'unlimited');
    return;
  }
  const snap = trustSnapshot;
  trustSnapshot = null;
  applyApprovalValues(
    (p, v, vi) => snap != null ? snap[vid(p.id, vi)] : defaultValueFor()
  );
}

function updateCounter() {
  let approvedProducts = 0;
  let totalFixed = 0;
  let unlimitedPerOrder = 0;

  CATALOG.forEach(p => {
    let anyApproved = false;
    p.variants.forEach((v, vi) => {
      const value = variantSelectionValue(p, v, vi);
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
  } else {
    setCounterText('Noch keine Entscheidung getroffen');
  }

  counter.classList.toggle('--complete', approvedProducts > 0);
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
  if (approvalStep !== 2 || !isRecipientFormReady()) return;

  const custEmail = document.getElementById('directEmail').value.trim();
  const custName  = null;
  const note      = document.getElementById('approvalNote')?.value.trim() ?? '';

  const byProduct = {};
  const redeemedVariants = [];

  CATALOG.forEach(p => {
    p.variants.forEach((v, vi) => {
      const value = submitVariantValue(p, v, vi);
      if (value == null) return;
      redeemedVariants.push({
        cartName: p.cartName,
        variantLabel: v.label,
        value,
        fallbackQty: 1,
        positionId: null,
      });
      (byProduct[p.id] ??= { name: p.cartName, sizes: [] })
        .sizes.push(`${v.label}: ${qtyLabel(value)}`);
    });
  });

  const approvedProducts = Object.values(byProduct);

  if (approvedProducts.length === 0) {
    showCounterError('Bitte mindestens eine Größe freigeben.');
    return;
  }

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

  empfehlungRecordRedeemedFromSubmit(custName || custEmail, null, redeemedVariants, custEmail);

  openSuccessModal('Die Freigabe wurde erteilt. Der Tierbesitzer wird per E-Mail informiert.');
  setTimeout(() => openEmailsOverlay(['customer', 'internal']), 500);
}

/* ── Initial render ── */
initState();
renderIntro();
syncApprovalStepUi();
updateRecipientStepReady();
document.addEventListener('DOMContentLoaded', empfehlungSyncOpenRequestNavBadges);
window.addEventListener('pageshow', empfehlungSyncOpenRequestNavBadges);
empfehlungSyncOpenRequestNavBadges();
