/* ════════════════════════════════════════════
   Tierarzt-Empfehlung-Offene-Anfragen — Posteingang
   Eine Tabellenzeile = eine Produktanfrage (Position).
   Quick-Aktionen wirken nur auf diese Zeile.
   Daten: empfehlung-anfragen-mock.js
   ════════════════════════════════════════════ */

const FREIGABE_PAGE = 'Tierarzt-Empfehlung-Anfrage-Freigabe.html';

let openRequests = [];

function formatPrice(value) {
  return value.toFixed(2).replace('.', ',') + ' €';
}

function detailHref(row) {
  const params = new URLSearchParams({ anfrage: row.requestId });
  return `${FREIGABE_PAGE}?${params.toString()}`;
}

function renderOpenRequests() {
  openRequests = empfehlungFlattenOpenRows();

  const tbody = document.getElementById('openRequestsBody');
  const tableWrap = document.getElementById('openRequestsTableWrap');
  const emptyEl = document.getElementById('openRequestsEmpty');
  if (!tbody) return;

  const count = openRequests.length;
  if (tableWrap) tableWrap.hidden = count === 0;
  if (emptyEl) emptyEl.hidden = count !== 0;

  empfehlungSyncOpenRequestNavBadges();

  tbody.innerHTML = openRequests.map(row => `
    <tr data-id="${row.id}">
      <td data-label="Name">${row.customerName}</td>
      <td data-label="Datum">${row.date}</td>
      <td data-label="Produkt">${row.productLabel}</td>
      <td data-label="Einzelpreis">${formatPrice(row.unitPrice)}</td>
      <td>
        <div class="data-table-actions">
          <button type="button" class="order-item__link" onclick="quickApprove('${row.id}')">Freigeben</button>
          <span class="data-table-actions__sep" aria-hidden="true">·</span>
          <button type="button" class="order-item__link" onclick="quickDecline('${row.id}')">Nicht freigeben</button>
          <span class="data-table-actions__sep" aria-hidden="true">·</span>
          <a href="${detailHref(row)}" class="order-item__link">Detailsansicht</a>
        </div>
      </td>
    </tr>
  `).join('');
}

function removeOpenRequest(id) {
  empfehlungMarkPositionRemoved(id);
  renderOpenRequests();
}

function quickApprove(id) {
  const row = openRequests.find(item => item.id === id);
  if (!row) return;
  empfehlungMarkPositionApproved(id);
  renderOpenRequests();
  showToast(`„${row.productLabel}“ freigegeben (${row.qty}×) — in der Detailsansicht markiert.`, 'success');
}

function quickDecline(id) {
  const row = openRequests.find(item => item.id === id);
  if (!row) return;
  empfehlungMarkPositionDeclined(id);
  renderOpenRequests();
  showToast(`„${row.productLabel}“ nicht freigegeben — in der Detailsansicht markiert.`, 'success');
}

document.addEventListener('DOMContentLoaded', renderOpenRequests);
window.addEventListener('pageshow', renderOpenRequests);
