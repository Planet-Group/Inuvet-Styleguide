/* ════════════════════════════════════════════
   Tierarzt-Empfehlung-Eingeloeste-Empfehlungen — Historie
   Eine Tabellenzeile = eine eingelöste Produktposition (Bestellung).
   Daten: empfehlung-anfragen-mock.js
   ════════════════════════════════════════════ */

function formatPrice(value) {
  return value.toFixed(2).replace('.', ',') + ' €';
}

function renderRedeemedRecommendations() {
  const rows = empfehlungFlattenRedeemedRows();

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

  tbody.innerHTML = rows.map(row => `
    <tr data-id="${row.id}">
      <td data-label="Name">${row.customerName}</td>
      <td data-label="Datum">${row.date}</td>
      <td data-label="Produkt">${row.productLabel}</td>
      <td data-label="Einzelpreis">${formatPrice(row.unitPrice)}</td>
      <td data-label="Provision">${formatPrice(row.commission)}</td>
    </tr>
  `).join('');
}

document.addEventListener('DOMContentLoaded', renderRedeemedRecommendations);
window.addEventListener('pageshow', () => {
  renderRedeemedRecommendations();
  empfehlungSyncOpenRequestNavBadges();
});
document.addEventListener('DOMContentLoaded', empfehlungSyncOpenRequestNavBadges);
