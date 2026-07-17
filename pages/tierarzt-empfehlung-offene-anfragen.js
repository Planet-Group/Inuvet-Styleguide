/* ════════════════════════════════════════════
   Tierarzt-Empfehlung-Offene-Anfragen — Posteingang
   Eine Tabellenzeile = eine Produktanfrage (Position).
   Zeilen-Aktionen als Links · Bulk über Dropdowns (.form-field.--sm).
   Daten: empfehlung-anfragen-mock.js
   ════════════════════════════════════════════ */

let openRequests = [];
const selectedIds = new Set();
let pendingRowAction = null; // { id, type: 'approve' | 'decline' }
const openSortState = { key: 'productLabel', dir: 'asc' };
const OPEN_SORT_GETTERS = {
  customerName: row => row.customerName,
  customerEmail: row => row.customerEmail,
  date: row => row.date,
  productLabel: row => row.productLabel,
};

function resetSelect(select) {
  if (!select) return;
  select.selectedIndex = 0;
}

function pruneSelection() {
  const valid = new Set(openRequests.map(row => row.id));
  [...selectedIds].forEach(id => {
    if (!valid.has(id)) selectedIds.delete(id);
  });
}

function selectedRows() {
  return openRequests.filter(row => selectedIds.has(row.id));
}

function updateBulkUi() {
  const bulk = document.getElementById('openRequestsBulk');
  const countEl = document.getElementById('openRequestsBulkCount');
  const selectAll = document.getElementById('openSelectAll');
  const bulkSelect = document.getElementById('openBulkSelect');
  const bulkAction = document.getElementById('openBulkAction');

  const total = openRequests.length;
  const selected = selectedIds.size;
  const hasSelection = selected > 0;

  if (bulk) bulk.hidden = total === 0;
  if (countEl) {
    countEl.textContent = selected === 1 ? '1 ausgewählt' : `${selected} ausgewählt`;
  }

  if (bulkSelect) bulkSelect.disabled = total === 0;
  if (bulkAction) {
    bulkAction.disabled = !hasSelection;
    if (!hasSelection) resetSelect(bulkAction);
  }

  if (selectAll) {
    selectAll.checked = total > 0 && selected === total;
    selectAll.indeterminate = selected > 0 && selected < total;
    selectAll.disabled = total === 0;
  }
}

function toggleRowSelection(id, checked) {
  if (checked) selectedIds.add(id);
  else selectedIds.delete(id);
  updateBulkUi();
}

function selectAllRows() {
  openRequests.forEach(row => selectedIds.add(row.id));
  renderOpenRequests();
}

function selectNoneRows() {
  selectedIds.clear();
  renderOpenRequests();
}

function onSelectAllChange(checked) {
  if (checked) selectAllRows();
  else selectNoneRows();
}

function onBulkSelectChange(select) {
  const value = select.value;
  resetSelect(select);
  if (value === 'all') selectAllRows();
  else if (value === 'none') selectNoneRows();
}

function onBulkActionChange(select) {
  const value = select.value;
  resetSelect(select);
  if (value === 'approve') bulkApproveSelected();
  else if (value === 'decline') bulkDeclineSelected();
}

function renderOpenRequests() {
  openRequests = empfehlungFlattenOpenRows();
  pruneSelection();
  const sorted = empfehlungSortRows(openRequests, openSortState, OPEN_SORT_GETTERS);

  const tbody = document.getElementById('openRequestsBody');
  const tableWrap = document.getElementById('openRequestsTableWrap');
  const emptyEl = document.getElementById('openRequestsEmpty');
  if (!tbody) return;

  const count = openRequests.length;
  if (tableWrap) tableWrap.hidden = count === 0;
  if (emptyEl) emptyEl.hidden = count !== 0;

  empfehlungSyncOpenRequestNavBadges();
  empfehlungSyncSortUi(
    tableWrap?.querySelector('table'),
    document.getElementById('openRequestsSort'),
    openSortState
  );

  tbody.innerHTML = sorted.map(row => {
    const checked = selectedIds.has(row.id) ? ' checked' : '';
    return `
    <tr data-id="${row.id}">
      <td class="data-table-select">
        <label class="form-check">
          <input type="checkbox"${checked} aria-label="Anfrage auswählen" onchange="toggleRowSelection('${row.id}', this.checked)">
        </label>
      </td>
      <td data-label="Name">${row.customerName}</td>
      <td class="--sm" data-label="E-Mail">${row.customerEmail}</td>
      <td class="--sm" data-label="Datum">${row.date}</td>
      <td class="--sm" data-label="Produkt">${row.productLabel}</td>
      <td>
        <div class="data-table-actions">
          <button type="button" class="order-item__link" onclick="quickApprove('${row.id}')">Freigeben</button>
          <span class="data-table-actions__sep" aria-hidden="true">·</span>
          <button type="button" class="order-item__link" onclick="quickDecline('${row.id}')">Nicht freigeben</button>
        </div>
      </td>
    </tr>`;
  }).join('');

  updateBulkUi();
}

function setRowActionModalOpen(open) {
  document.getElementById('rowActionModalOverlay')?.classList.toggle('--open', open);
  document.body.style.overflow = document.querySelector('.modal-overlay.--open') ? 'hidden' : '';
}

function openRowActionModal(id, type) {
  const row = openRequests.find(item => item.id === id);
  if (!row) return;

  pendingRowAction = { id, type };
  const approve = type === 'approve';
  const title = approve ? 'Freigeben' : 'Nicht freigeben';
  const modalEl = document.getElementById('rowActionModal');
  const titleEl = document.getElementById('rowActionModalTitle');
  const leadEl = document.getElementById('rowActionModalLead');
  const noteEl = document.getElementById('rowActionNote');
  const confirmBtn = document.getElementById('rowActionConfirmBtn');

  modalEl?.classList.toggle('--danger', !approve);
  if (titleEl) titleEl.textContent = title;
  if (leadEl) {
    leadEl.textContent = approve
      ? `„${row.productLabel}“ für ${row.customerName} freigeben (${row.qty}×).`
      : `„${row.productLabel}“ für ${row.customerName} nicht freigeben.`;
  }
  if (noteEl) noteEl.value = '';
  if (confirmBtn) confirmBtn.textContent = title;

  setRowActionModalOpen(true);
  noteEl?.focus();
}

function closeRowActionModal() {
  pendingRowAction = null;
  const noteEl = document.getElementById('rowActionNote');
  if (noteEl) noteEl.value = '';
  setRowActionModalOpen(false);
}

let emailOverlayData = {};

function openEmailsOverlay(keys) {
  const count = keys.length;
  const counter = document.getElementById('emailPanelCounter');
  const body = document.getElementById('emailPanelBody');
  if (counter) counter.textContent = `${count} Nachrichten ausgelöst`;
  if (body) {
    body.innerHTML = keys.map(key => {
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
  }
  document.getElementById('emailOverlay')?.classList.add('--open');
  document.getElementById('emailPanel')?.classList.add('--open');
}

function closeEmailOverlay() {
  document.getElementById('emailOverlay')?.classList.remove('--open');
  document.getElementById('emailPanel')?.classList.remove('--open');
}

function buildRowActionEmails(row, type, note) {
  const approved = type === 'approve';
  const sizeLine = `${row.variantLabel}: max. ${row.qty}×`;
  const noteBlock = note ? `<p><strong>Notiz an Sie:</strong> <em>${note}</em></p>` : '';
  const noteBlockInternal = note ? `<p><strong>Notiz an Tierbesitzer:</strong> <em>${note}</em></p>` : '';
  const approvedBlock = approved
    ? `<p><strong>Freigegeben:</strong></p><ul><li><strong>${row.cartName}</strong> — ${sizeLine}</li></ul>`
    : '';
  const declinedBlock = !approved
    ? `<p><strong>Nicht freigegeben:</strong></p><ul><li><strong>${row.cartName}</strong> — ${row.variantLabel} (angefragt: max. ${row.qty}×)</li></ul>`
    : '';

  emailOverlayData = {
    customer: {
      tag: 'E-Mail',
      recipient: row.customerEmail,
      subject: 'Ihre Empfehlungsanfrage wurde bearbeitet',
      body: `
        <p>Dr. Martina Müller (Tierarztpraxis Grüntal) hat Ihre Empfehlungsanfrage bearbeitet:</p>
        ${approvedBlock}
        ${declinedBlock}
        ${noteBlock}
        ${approved ? '<p>Sie können die freigegebenen Produkte jetzt auf inuvet.com einlösen.</p>' : ''}`,
    },
    internal: {
      tag: 'Intern',
      recipient: 'team@inuvet.com',
      subject: `Empfehlungsanfrage bearbeitet: ${row.customerName}`,
      internal: true,
      body: `
        <p>Dr. Martina Müller (Tierarztpraxis Grüntal) hat die Empfehlungsanfrage für <strong>${row.customerName}</strong> (${row.customerEmail}) bearbeitet:</p>
        ${approvedBlock}
        ${declinedBlock}
        ${noteBlockInternal}
        <p>${approved ? '1 Produkt freigegeben, 0 Positionen abgelehnt' : '0 Produkte freigegeben, 1 Position abgelehnt'} (Schnellaktion in Offene Anfragen).</p>
        <p class="mockup-email-panel__note">${row.customerName} wurde automatisch per E-Mail benachrichtigt.</p>`,
    },
  };
}

function confirmRowAction() {
  if (!pendingRowAction) return;
  const { id, type } = pendingRowAction;
  const row = openRequests.find(item => item.id === id);
  if (!row) {
    closeRowActionModal();
    return;
  }

  const note = document.getElementById('rowActionNote')?.value.trim() ?? '';

  if (type === 'approve') empfehlungMarkPositionApproved(id);
  else empfehlungMarkPositionDeclined(id);

  selectedIds.delete(id);
  buildRowActionEmails(row, type, note);
  closeRowActionModal();
  renderOpenRequests();

  const toastMsg = type === 'approve'
    ? `„${row.productLabel}“ freigegeben (${row.qty}×). Der Tierbesitzer wird per E-Mail informiert.`
    : `„${row.productLabel}“ nicht freigegeben. Der Tierbesitzer wird per E-Mail informiert.`;
  showToast(toastMsg, 'success');
  setTimeout(() => openEmailsOverlay(['customer', 'internal']), 400);
}

function quickApprove(id) {
  openRowActionModal(id, 'approve');
}

function quickDecline(id) {
  openRowActionModal(id, 'decline');
}

function bulkApproveSelected() {
  const rows = selectedRows();
  if (!rows.length) return;
  rows.forEach(row => empfehlungMarkPositionApproved(row.id));
  selectedIds.clear();
  renderOpenRequests();
  showToast(
    rows.length === 1
      ? `„${rows[0].productLabel}“ freigegeben.`
      : `${rows.length} Positionen freigegeben.`,
    'success'
  );
}

function bulkDeclineSelected() {
  const rows = selectedRows();
  if (!rows.length) return;
  rows.forEach(row => empfehlungMarkPositionDeclined(row.id));
  selectedIds.clear();
  renderOpenRequests();
  showToast(
    rows.length === 1
      ? `„${rows[0].productLabel}“ nicht freigegeben.`
      : `${rows.length} Positionen nicht freigegeben.`,
    'success'
  );
}

function initOpenRequestsPage() {
  const table = document.querySelector('#openRequestsTableWrap table');
  const select = document.getElementById('openRequestsSort');
  empfehlungInitTableSort({
    table,
    select,
    sortState: openSortState,
    onSort: renderOpenRequests,
  });

  document.getElementById('openSelectAll')?.addEventListener('change', e => {
    onSelectAllChange(e.target.checked);
  });
  document.getElementById('openBulkSelect')?.addEventListener('change', e => {
    onBulkSelectChange(e.target);
  });
  document.getElementById('openBulkAction')?.addEventListener('change', e => {
    onBulkActionChange(e.target);
  });

  renderOpenRequests();
}

document.addEventListener('DOMContentLoaded', initOpenRequestsPage);
window.addEventListener('pageshow', renderOpenRequests);
