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
    customerEmail: request.customerEmail,
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
        customerEmail: req.customerEmail,
        date: req.receivedAt,
        productLabel: empfehlungProductLabel(pos.cartName, pos.variantLabel),
        unitPrice: empfehlungUnitPrice(pos.cartName, pos.variantLabel),
        qty: pos.qty,
        cartName: pos.cartName,
        variantLabel: pos.variantLabel,
      }))
  ).sort((a, b) => a.productLabel.localeCompare(b.productLabel, 'de'));
}

/* ── Tabellen-Sortierung (Offene Anfragen / Freigegeben) ── */
function empfehlungCompareSortValues(a, b, dir) {
  const mult = dir === 'desc' ? -1 : 1;
  if (typeof a === 'number' && typeof b === 'number') return (a - b) * mult;
  return String(a).localeCompare(String(b), 'de', { numeric: true, sensitivity: 'base' }) * mult;
}

function empfehlungSortRows(rows, sortState, getters) {
  const get = getters[sortState.key];
  if (!get) return rows.slice();
  return rows.slice().sort((a, b) => empfehlungCompareSortValues(get(a), get(b), sortState.dir));
}

function empfehlungSyncSortUi(table, select, sortState) {
  if (table) {
    table.querySelectorAll('th[data-sort]').forEach(th => {
      const active = th.dataset.sort === sortState.key;
      th.setAttribute('aria-sort', active ? (sortState.dir === 'asc' ? 'ascending' : 'descending') : 'none');
      const icon = th.querySelector('.material-icons');
      if (icon) icon.textContent = active
        ? (sortState.dir === 'asc' ? 'arrow_upward' : 'arrow_downward')
        : 'unfold_more';
    });
  }
  if (select) select.value = `${sortState.key}:${sortState.dir}`;
}

function empfehlungInitTableSort({ table, select, sortState, onSort }) {
  if (!table) return;

  table.querySelectorAll('th[data-sort] button').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.closest('th')?.dataset.sort;
      if (!key) return;
      if (sortState.key === key) {
        sortState.dir = sortState.dir === 'asc' ? 'desc' : 'asc';
      } else {
        sortState.key = key;
        sortState.dir = 'asc';
      }
      empfehlungSyncSortUi(table, select, sortState);
      onSort();
    });
  });

  if (select) {
    select.addEventListener('change', () => {
      const [key, dir] = select.value.split(':');
      if (!key || !dir) return;
      sortState.key = key;
      sortState.dir = dir;
      empfehlungSyncSortUi(table, select, sortState);
      onSort();
    });
  }

  empfehlungSyncSortUi(table, select, sortState);
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

  /* Footer auf Portal-Seiten — nicht auf Freigabe ausstellen (Produktauswahl) */
  if (!document.getElementById('approvalMain')) empfehlungEnsurePortalFooter();
}

/* Portal-Footer ohne Newsletter (Styleguide: „Ohne Newsletter — Tierarztpraxis“) */
function empfehlungEnsurePortalFooter() {
  if (document.getElementById('portalFooter')) return;
  document.body.insertAdjacentHTML('beforeend', `
<footer class="site-footer" id="portalFooter">
  <div class="footer-main">
    <div class="footer-col">
      <h4>Shop</h4>
      <ul>
        <li><a href="Tierarzt-Empfehlung.html">Alle Produkte</a></li>
        <li><a href="Tierarzt-Empfehlung.html">Produktfinder</a></li>
        <li><a href="#">Persönliches Angebot</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Ratgeber</h4>
      <ul>
        <li><a href="#">Ernährung</a></li>
        <li><a href="#">Gesundheit</a></li>
        <li><a href="#">Über uns</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Folge uns</h4>
      <div class="footer-social">
        <a href="#" class="footer-social__link" aria-label="Facebook">
          <svg class="footer-social__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/></svg>
        </a>
        <a href="#" class="footer-social__link" aria-label="Instagram">
          <svg class="footer-social__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></svg>
        </a>
        <a href="#" class="footer-social__link" aria-label="YouTube">
          <svg class="footer-social__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        </a>
        <a href="#" class="footer-social__link" aria-label="LinkedIn">
          <svg class="footer-social__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </a>
      </div>
    </div>
    <div class="footer-col">
      <h4>Über inuvet</h4>
      <p>Natürlich gesunde Tiere, nur in eurer Tierarztpraxis — seit über 15 Jahren.</p>
    </div>
  </div>
  <div class="footer-bar">
    <span>© 2026 inuvet · <a href="#">Impressum</a> · <a href="#">Datenschutz</a> · <a href="#">AGB</a> · <a href="#">Widerruf</a></span>
    <span>Visa · Mastercard · PayPal · Klarna</span>
  </div>
</footer>`);
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

function empfehlungAddRedeemedEntry({ customerName, customerEmail, cartName, variantLabel, qty, unlimited, sourceId }) {
  const entries = empfehlungGetRedeemedEntries();
  if (sourceId && entries.some(entry => entry.sourceId === sourceId)) return;
  entries.push({
    id: `red-${sourceId || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`}`,
    sourceId: sourceId || null,
    customerName,
    customerEmail: customerEmail || '',
    orderDate: empfehlungTodayISO(),
    cartName,
    variantLabel,
    qty,
    unlimited: !!unlimited,
  });
  empfehlungPersistRedeemedEntries(entries);
}

function empfehlungRecordRedeemedFromSubmit(customerName, requestId, approvedVariants, customerEmail) {
  approvedVariants.forEach(item => {
    const parsed = empfehlungParseApprovalQty(item.value, item.fallbackQty);
    const sourceId = item.positionId
      || (requestId ? `${requestId}|${item.cartName}|${item.variantLabel}` : null)
      || `direct-${item.cartName}|${item.variantLabel}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    empfehlungAddRedeemedEntry({
      customerName,
      customerEmail,
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
    customerEmail: row.customerEmail || '',
    date: row.orderDate,
    productLabel: empfehlungRedeemedProductLabel(row.cartName, row.variantLabel, row.qty, row.unlimited),
    unitPrice: empfehlungUnitPrice(row.cartName, row.variantLabel),
    commission: empfehlungRedeemedCommission(row.cartName, row.variantLabel, row.qty, row.unlimited),
  })).sort((a, b) => {
    const byDate = b.date.localeCompare(a.date);
    return byDate !== 0 ? byDate : a.productLabel.localeCompare(b.productLabel, 'de');
  });
}
