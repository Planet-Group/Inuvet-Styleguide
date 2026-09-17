/* ════════════════════════════════════════════
   Inuvet-Freigabe-Nicht-Freigegeben — Historie abgelehnter Positionen · inuvet.com
   Nur nachvollziehbar; keine nachträgliche Freigabe.
   Daten: inuvet-freigabe-mock.js
   ════════════════════════════════════════════ */

const declinedSortState = { key: 'date', dir: 'desc' };
const DECLINED_SORT_GETTERS = {
  customerName: row => row.customerName,
  date: row => row.date,
  productLabel: row => row.productLabel,
};

function renderDeclinedRequests() {
  const rows = empfehlungFlattenDeclinedRows();
  const sorted = empfehlungSortRows(rows, declinedSortState, DECLINED_SORT_GETTERS);
  const tbody = document.getElementById('declinedBody');
  const tableWrap = document.getElementById('declinedTableWrap');
  const emptyEl = document.getElementById('declinedEmpty');
  if (!tbody) return;

  const count = rows.length;
  if (tableWrap) tableWrap.hidden = count === 0;
  if (emptyEl) emptyEl.hidden = count !== 0;

  empfehlungSyncSortUi(
    tableWrap?.querySelector('table'),
    document.getElementById('declinedSort'),
    declinedSortState
  );

  tbody.innerHTML = sorted.map(row => `
    <tr data-id="${row.id}">
      ${empfehlungCustomerNameCellHtml(row.customerName)}
      <td class="data-table-date" data-label="Abgelehnt am">${empfehlungFormatDateDE(row.date)}</td>
      ${empfehlungProductCellHtml(row.cartName, row.variantLabel, row.qty, false, 'Angefragte Produkte')}
      ${empfehlungCustomerNoteCellHtml(row.customerNote)}
      ${empfehlungVetNoteCellHtml(row.vetNote)}
    </tr>
  `).join('');
}

function initDeclinedPage() {
  empfehlungInitTableSort({
    table: document.querySelector('#declinedTableWrap table'),
    select: document.getElementById('declinedSort'),
    sortState: declinedSortState,
    onSort: renderDeclinedRequests,
  });
  renderDeclinedRequests();
  empfehlungSyncOpenRequestNavBadges();
}

document.addEventListener('DOMContentLoaded', initDeclinedPage);
window.addEventListener('pageshow', () => {
  renderDeclinedRequests();
  empfehlungSyncOpenRequestNavBadges();
});
