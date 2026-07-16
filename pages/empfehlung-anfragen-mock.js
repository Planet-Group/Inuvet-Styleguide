/* ════════════════════════════════════════════
   empfehlung-anfragen-mock.js — gemeinsame Demo-Daten
   Verknüpft „Offene Anfragen“ (Liste) und „Empfehlungsanfrage“ (Detail).
   Eine Anfrage = ein Tierbesitzer*in mit 1–n Produktpositionen.
   ════════════════════════════════════════════ */

const EMPFEHLUNG_VARIANT_PRICES = {
  'Calmin balance Tabletten|60 Stück': 39.90,
  'Calmin balance Tabletten|90 Stück': 54.90,
  'Calmin balance Pulver|30 g': 29.90,
  'Calmin balance Pulver|60 g': 49.90,
  'Hepax forte Tabletten|30 Stück': 34.90,
  'Hepax forte Tabletten|60 Stück': 64.90,
  'Hepax forte Pulver|75 g': 39.90,
  'Hepax forte Pulver|175 g': 84.90,
  'Inzym Pulver|50 g': 24.90,
  'Inzym Pulver|100 g': 44.90,
};

const EMPFEHLUNG_MOCK_REQUESTS = [
  {
    id: 'req-sommer',
    customerName: 'Sabine Sommer',
    customerEmail: 'sabine.sommer@beispiel.de',
    receivedAt: '2026-07-02',
    positions: [
      { id: 'pos-so-1', cartName: 'Calmin balance Tabletten', variantLabel: '60 Stück', qty: 2 },
      { id: 'pos-so-2', cartName: 'Hepax forte Tabletten', variantLabel: '30 Stück', qty: 1 },
      { id: 'pos-so-3', cartName: 'Inzym Pulver', variantLabel: '50 g', qty: 1 },
    ],
  },
  {
    id: 'req-krause',
    customerName: 'Otto Krause',
    customerEmail: 'otto.krause@beispiel.de',
    receivedAt: '2026-07-01',
    positions: [
      { id: 'pos-kr-1', cartName: 'Calmin balance Pulver', variantLabel: '30 g', qty: 1 },
      { id: 'pos-kr-2', cartName: 'Hepax forte Pulver', variantLabel: '75 g', qty: 1 },
    ],
  },
  {
    id: 'req-berger',
    customerName: 'Karl Friedrich Berger',
    customerEmail: 'kf.berger@beispiel.de',
    receivedAt: '2026-06-30',
    positions: [
      { id: 'pos-be-1', cartName: 'Calmin balance Tabletten', variantLabel: '90 Stück', qty: 1 },
    ],
  },
];

const EMPFEHLUNG_REMOVED_KEY = 'empfehlung-removed-positions';
const EMPFEHLUNG_DECLINED_KEY = 'empfehlung-declined-variants';
const EMPFEHLUNG_APPROVED_KEY = 'empfehlung-approved-variants';
const EMPFEHLUNG_REDEEMED_KEY = 'empfehlung-redeemed-rows';

/** Mock zurücksetzen bei Reload — Navigation zwischen Liste und Detail behält den State. */
function empfehlungResetMockStateOnReload() {
  try {
    const nav = performance.getEntriesByType('navigation')[0];
    if (nav?.type === 'reload') {
      sessionStorage.removeItem(EMPFEHLUNG_REMOVED_KEY);
      sessionStorage.removeItem(EMPFEHLUNG_DECLINED_KEY);
      sessionStorage.removeItem(EMPFEHLUNG_APPROVED_KEY);
      sessionStorage.removeItem(EMPFEHLUNG_REDEEMED_KEY);
    }
  } catch { /* ignore */ }
}
empfehlungResetMockStateOnReload();

function empfehlungVariantKey(requestId, cartName, variantLabel) {
  return `${requestId}|${cartName}|${variantLabel}`;
}

function empfehlungFindPosition(positionId) {
  for (const req of EMPFEHLUNG_MOCK_REQUESTS) {
    const position = req.positions.find(pos => pos.id === positionId);
    if (position) return { request: req, position };
  }
  return null;
}

function empfehlungGetDeclinedVariantKeys() {
  try {
    const raw = sessionStorage.getItem(EMPFEHLUNG_DECLINED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function empfehlungIsVariantDeclined(requestId, cartName, variantLabel) {
  return empfehlungGetDeclinedVariantKeys().includes(
    empfehlungVariantKey(requestId, cartName, variantLabel)
  );
}

function empfehlungMarkVariantDeclined(requestId, cartName, variantLabel) {
  const declined = new Set(empfehlungGetDeclinedVariantKeys());
  declined.add(empfehlungVariantKey(requestId, cartName, variantLabel));
  sessionStorage.setItem(EMPFEHLUNG_DECLINED_KEY, JSON.stringify([...declined]));
  empfehlungClearVariantApproved(requestId, cartName, variantLabel);
}

function empfehlungClearVariantDeclined(requestId, cartName, variantLabel) {
  const key = empfehlungVariantKey(requestId, cartName, variantLabel);
  const declined = empfehlungGetDeclinedVariantKeys().filter(k => k !== key);
  sessionStorage.setItem(EMPFEHLUNG_DECLINED_KEY, JSON.stringify(declined));
}

function empfehlungClearDeclinedForRequest(requestId) {
  const prefix = `${requestId}|`;
  const declined = empfehlungGetDeclinedVariantKeys().filter(k => !k.startsWith(prefix));
  sessionStorage.setItem(EMPFEHLUNG_DECLINED_KEY, JSON.stringify(declined));
}

function empfehlungMarkPositionDeclined(positionId) {
  const found = empfehlungFindPosition(positionId);
  if (!found) return;
  const { request, position } = found;
  empfehlungMarkVariantDeclined(request.id, position.cartName, position.variantLabel);
  empfehlungClearVariantApproved(request.id, position.cartName, position.variantLabel);
  empfehlungMarkPositionRemoved(positionId);
}

function empfehlungGetApprovedVariants() {
  try {
    const raw = sessionStorage.getItem(EMPFEHLUNG_APPROVED_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function empfehlungIsVariantApproved(requestId, cartName, variantLabel) {
  return empfehlungVariantKey(requestId, cartName, variantLabel) in empfehlungGetApprovedVariants();
}

function empfehlungGetApprovedQty(requestId, cartName, variantLabel) {
  const qty = empfehlungGetApprovedVariants()[empfehlungVariantKey(requestId, cartName, variantLabel)];
  return qty != null ? qty : null;
}

function empfehlungMarkVariantApproved(requestId, cartName, variantLabel, qty) {
  const approved = { ...empfehlungGetApprovedVariants() };
  approved[empfehlungVariantKey(requestId, cartName, variantLabel)] = qty;
  sessionStorage.setItem(EMPFEHLUNG_APPROVED_KEY, JSON.stringify(approved));
}

function empfehlungClearVariantApproved(requestId, cartName, variantLabel) {
  const key = empfehlungVariantKey(requestId, cartName, variantLabel);
  const approved = { ...empfehlungGetApprovedVariants() };
  delete approved[key];
  sessionStorage.setItem(EMPFEHLUNG_APPROVED_KEY, JSON.stringify(approved));
}

function empfehlungClearApprovedForRequest(requestId) {
  const prefix = `${requestId}|`;
  const approved = { ...empfehlungGetApprovedVariants() };
  Object.keys(approved).forEach(key => {
    if (key.startsWith(prefix)) delete approved[key];
  });
  sessionStorage.setItem(EMPFEHLUNG_APPROVED_KEY, JSON.stringify(approved));
}

function empfehlungMarkPositionApproved(positionId) {
  const found = empfehlungFindPosition(positionId);
  if (!found) return;
  const { request, position } = found;
  empfehlungClearVariantDeclined(request.id, position.cartName, position.variantLabel);
  empfehlungMarkVariantApproved(request.id, position.cartName, position.variantLabel, position.qty);
  empfehlungMarkPositionRemoved(positionId);
  empfehlungAddRedeemedEntry({
    customerName: request.customerName,
    cartName: position.cartName,
    variantLabel: position.variantLabel,
    qty: position.qty,
    unlimited: false,
    sourceId: positionId,
  });
}

function empfehlungFormatDateDE(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

function empfehlungProductLabel(cartName, variantLabel) {
  return `${cartName} / ${variantLabel}`;
}

function empfehlungUnitPrice(cartName, variantLabel) {
  return EMPFEHLUNG_VARIANT_PRICES[`${cartName}|${variantLabel}`] ?? 0;
}

function empfehlungGetRequest(requestId) {
  return EMPFEHLUNG_MOCK_REQUESTS.find(req => req.id === requestId) ?? null;
}

function empfehlungGetDefaultRequest() {
  return EMPFEHLUNG_MOCK_REQUESTS[0];
}

function empfehlungRequestItems(requestId) {
  const req = empfehlungGetRequest(requestId);
  if (!req) return [];
  return req.positions.map(pos => ({
    cartName: pos.cartName,
    variantLabel: pos.variantLabel,
    qty: pos.qty,
  }));
}

function empfehlungGetRemovedPositionIds() {
  try {
    const raw = sessionStorage.getItem(EMPFEHLUNG_REMOVED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function empfehlungMarkPositionRemoved(positionId) {
  const removed = new Set(empfehlungGetRemovedPositionIds());
  removed.add(positionId);
  sessionStorage.setItem(EMPFEHLUNG_REMOVED_KEY, JSON.stringify([...removed]));
}

function empfehlungMarkRequestRemoved(requestId) {
  const req = empfehlungGetRequest(requestId);
  if (!req) return;
  const removed = new Set(empfehlungGetRemovedPositionIds());
  req.positions.forEach(pos => removed.add(pos.id));
  sessionStorage.setItem(EMPFEHLUNG_REMOVED_KEY, JSON.stringify([...removed]));
  empfehlungClearDeclinedForRequest(requestId);
  empfehlungClearApprovedForRequest(requestId);
}

function empfehlungFlattenOpenRows() {
  const removed = new Set(empfehlungGetRemovedPositionIds());
  return EMPFEHLUNG_MOCK_REQUESTS.flatMap(req =>
    req.positions
      .filter(pos => !removed.has(pos.id))
      .map(pos => ({
        id: pos.id,
        requestId: req.id,
        customerName: req.customerName,
        date: req.receivedAt,
        productLabel: empfehlungProductLabel(pos.cartName, pos.variantLabel),
        unitPrice: empfehlungUnitPrice(pos.cartName, pos.variantLabel),
        qty: pos.qty,
        cartName: pos.cartName,
        variantLabel: pos.variantLabel,
      }))
  ).sort((a, b) => a.productLabel.localeCompare(b.productLabel, 'de'));
}

/** Nav-Badges + Seiten-Zähler (H1) für offene Anfragen synchronisieren. */
function empfehlungSyncOpenRequestNavBadges() {
  const count = empfehlungFlattenOpenRows().length;
  const label = `${count} offene Produktanfragen`;

  document.querySelectorAll('[data-nav-open-count]').forEach(el => {
    el.textContent = String(count);
    if (count === 0) {
      el.setAttribute('hidden', '');
      el.setAttribute('aria-hidden', 'true');
    } else {
      el.removeAttribute('hidden');
      el.removeAttribute('aria-hidden');
    }
  });

  const pageCount = document.getElementById('openRequestsCount');
  if (pageCount) {
    pageCount.textContent = String(count);
    pageCount.setAttribute('aria-label', label);
  }

  const hamburger = document.getElementById('hamburger');
  if (hamburger?.querySelector('[data-nav-open-count]')) {
    hamburger.setAttribute('aria-label', count > 0
      ? `Navigation öffnen, ${count} offene Anfragen`
      : 'Navigation öffnen');
  }
}

/* Freigegeben — Historie; wächst mit Freigaben (sessionStorage, Start leer). */
const EMPFEHLUNG_VARIANT_COMMISSIONS = {
  'Calmin balance Tabletten|60 Stück': 4.50,
  'Calmin balance Tabletten|90 Stück': 6.20,
  'Calmin balance Pulver|30 g': 3.40,
  'Calmin balance Pulver|60 g': 5.60,
  'Hepax forte Tabletten|30 Stück': 5.20,
  'Hepax forte Tabletten|60 Stück': 9.70,
  'Hepax forte Pulver|75 g': 4.80,
  'Hepax forte Pulver|175 g': 9.90,
  'Inzym Pulver|50 g': 2.80,
  'Inzym Pulver|100 g': 4.90,
};

function empfehlungTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

function empfehlungGetRedeemedEntries() {
  try {
    const raw = sessionStorage.getItem(EMPFEHLUNG_REDEEMED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function empfehlungPersistRedeemedEntries(entries) {
  sessionStorage.setItem(EMPFEHLUNG_REDEEMED_KEY, JSON.stringify(entries));
}

function empfehlungParseApprovalQty(value, fallbackQty) {
  if (value === 'unlimited') return { qty: fallbackQty ?? 1, unlimited: true };
  if (value && value.startsWith('max')) return { qty: parseInt(value.slice(3), 10), unlimited: false };
  return { qty: fallbackQty ?? 1, unlimited: false };
}

function empfehlungAddRedeemedEntry({ customerName, cartName, variantLabel, qty, unlimited, sourceId }) {
  const entries = empfehlungGetRedeemedEntries();
  if (sourceId && entries.some(entry => entry.sourceId === sourceId)) return;
  entries.push({
    id: `red-${sourceId || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`}`,
    sourceId: sourceId || null,
    customerName,
    orderDate: empfehlungTodayISO(),
    cartName,
    variantLabel,
    qty,
    unlimited: !!unlimited,
  });
  empfehlungPersistRedeemedEntries(entries);
}

function empfehlungRecordRedeemedFromSubmit(customerName, requestId, approvedVariants) {
  approvedVariants.forEach(item => {
    const parsed = empfehlungParseApprovalQty(item.value, item.fallbackQty);
    const sourceId = item.positionId
      || (requestId ? `${requestId}|${item.cartName}|${item.variantLabel}` : null)
      || `direct-${item.cartName}|${item.variantLabel}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    empfehlungAddRedeemedEntry({
      customerName,
      cartName: item.cartName,
      variantLabel: item.variantLabel,
      qty: parsed.unlimited ? (item.fallbackQty ?? 1) : parsed.qty,
      unlimited: parsed.unlimited,
      sourceId,
    });
  });
}

function empfehlungLineCommission(cartName, variantLabel, qty) {
  const perUnit = EMPFEHLUNG_VARIANT_COMMISSIONS[`${cartName}|${variantLabel}`] ?? 0;
  return perUnit * qty;
}

function empfehlungRedeemedCommission(cartName, variantLabel, qty, unlimited) {
  const perUnit = EMPFEHLUNG_VARIANT_COMMISSIONS[`${cartName}|${variantLabel}`] ?? 0;
  return unlimited ? perUnit : empfehlungLineCommission(cartName, variantLabel, qty);
}

function empfehlungRedeemedProductLabel(cartName, variantLabel, qty, unlimited) {
  const suffix = unlimited ? 'unbegrenzt' : `${qty}×`;
  return `${empfehlungProductLabel(cartName, variantLabel)} · ${suffix}`;
}

function empfehlungFlattenRedeemedRows() {
  return empfehlungGetRedeemedEntries().map(row => ({
    id: row.id,
    customerName: row.customerName,
    date: row.orderDate,
    productLabel: empfehlungRedeemedProductLabel(row.cartName, row.variantLabel, row.qty, row.unlimited),
    unitPrice: empfehlungUnitPrice(row.cartName, row.variantLabel),
    commission: empfehlungRedeemedCommission(row.cartName, row.variantLabel, row.qty, row.unlimited),
  })).sort((a, b) => {
    const byDate = b.date.localeCompare(a.date);
    return byDate !== 0 ? byDate : a.productLabel.localeCompare(b.productLabel, 'de');
  });
}

function empfehlungResolveRequestFromURL() {
  const params = new URLSearchParams(window.location.search);
  const requestId = params.get('anfrage');
  if (requestId) return empfehlungGetRequest(requestId) ?? empfehlungGetDefaultRequest();
  return empfehlungGetDefaultRequest();
}
