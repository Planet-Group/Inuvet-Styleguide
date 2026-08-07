/* ════════════════════════════════════════════
   Tierarzt-Empfehlung-Eingeloeste-Empfehlungen — Historie
   Eine Tabellenzeile = eine eingelöste Produktposition (Bestellung).
   Daten: tierarzt-empfehlung-anfrage-mock.js
   ════════════════════════════════════════════ */

const redeemedSortState = { key: 'date', dir: 'desc' };
const REDEEMED_SORT_GETTERS = {
  customerName: row => row.customerName,
  date: row => row.date,
  productLabel: row => row.productLabel,
  commission: row => row.commission,
};

function formatPrice(value) {
  return value.toFixed(2).replace('.', ',') + ' €';
}

function renderRedeemedRecommendations() {
  const rows = empfehlungFlattenRedeemedRows();
  const sorted = empfehlungSortRows(rows, redeemedSortState, REDEEMED_SORT_GETTERS);

  const tbody = document.getElementById('redeemedBody');
  const countEl = document.getElementById('redeemedCount');
  const tableWrap = document.getElementById('redeemedTableWrap');
  const emptyEl = document.getElementById('redeemedEmpty');
  if (!tbody) return;

  const count = rows.length;
  if (countEl) {
    countEl.textContent = String(count);
    countEl.setAttribute('aria-label', `${count} erteilte Freigaben`);
  }

  if (tableWrap) tableWrap.hidden = count === 0;
  if (emptyEl) emptyEl.hidden = count !== 0;

  empfehlungSyncSortUi(
    tableWrap?.querySelector('table'),
    document.getElementById('redeemedSort'),
    redeemedSortState
  );

  tbody.innerHTML = sorted.map(row => `
    <tr data-id="${row.id}">
      ${empfehlungCustomerNameCellHtml(row.customerName)}
      <td data-label="Datum">${row.date}</td>
      ${empfehlungProductCellHtml(row.cartName, row.variantLabel, row.qty, row.unlimited)}
      ${empfehlungCustomerNoteCellHtml(row.customerNote)}
      <td class="data-table-commission" data-label="Provision">${formatPrice(row.commission)}</td>
    </tr>
  `).join('');
}

function initRedeemedPage() {
  const table = document.querySelector('#redeemedTableWrap table');
  const select = document.getElementById('redeemedSort');
  empfehlungInitTableSort({
    table,
    select,
    sortState: redeemedSortState,
    onSort: renderRedeemedRecommendations,
  });
  renderRedeemedRecommendations();
  empfehlungSyncOpenRequestNavBadges();
}

document.addEventListener('DOMContentLoaded', initRedeemedPage);
window.addEventListener('pageshow', () => {
  renderRedeemedRecommendations();
  empfehlungSyncOpenRequestNavBadges();
});
