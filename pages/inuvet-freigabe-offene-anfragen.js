/* ════════════════════════════════════════════
   Inuvet-Freigabe-Offene-Anfragen — Posteingang · inuvet.com
   Eine Tabellenzeile = eine Produktanfrage (Position).
   Zeilen-Aktionen: Icon-Buttons (.btn.--icon.--success / .--danger) · Bulk: Dropdown wählt, Bestätigen führt aus.
   Daten: inuvet-freigabe-mock.js
   ════════════════════════════════════════════ */

let openRequests = [];
const selectedIds = new Set();
let pendingRowAction = null; // { id, type: 'approve' | 'decline' }
const openSortState = { key: 'customerName', dir: 'asc' };
const OPEN_SORT_GETTERS = {
  customerName: row => row.customerName,
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

  syncBulkFollowup();
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

function bulkActionType() {
  const value = document.getElementById('openBulkAction')?.value;
  return value === 'approve' || value === 'decline' ? value : null;
}

function resetBulkFollowup(clearNote) {
  resetSelect(document.getElementById('openBulkAction'));
  const followup = document.getElementById('openBulkFollowup');
  if (followup) {
    followup.hidden = true;
    followup.classList.remove('--danger');
  }
  if (clearNote) {
    const noteEl = document.getElementById('openBulkNote');
    if (noteEl) noteEl.value = '';
  }
  const hint = document.getElementById('openBulkNoteHint');
  if (hint) hint.hidden = true;
}

function syncBulkFollowup() {
  const type = bulkActionType();
  const rows = selectedRows();
  const followup = document.getElementById('openBulkFollowup');
  const confirmBtn = document.getElementById('openBulkConfirm');
  const hint = document.getElementById('openBulkNoteHint');
  const show = !!type && rows.length > 0;

  if (!show) {
    if (!rows.length) resetBulkFollowup(true);
    else if (followup) followup.hidden = true;
    return;
  }

  const customers = new Set(rows.map(row => row.customerEmail || row.customerName));
  if (followup) {
    followup.hidden = false;
    followup.classList.toggle('--danger', type === 'decline');
  }
  if (hint) hint.hidden = customers.size < 2;
  if (confirmBtn) {
    const verb = type === 'approve' ? 'freigeben' : 'nicht freigeben';
    confirmBtn.textContent = rows.length === 1 ? `1 Position ${verb}` : `${rows.length} Positionen ${verb}`;
  }
}

function onBulkActionChange() {
  syncBulkFollowup();
}

function cancelBulkFollowup() {
  resetBulkFollowup(true);
}

function confirmBulkAction() {
  const type = bulkActionType();
  const rows = selectedRows();
  if (!type || !rows.length) return;

  const note = document.getElementById('openBulkNote')?.value.trim() ?? '';
  const keys = buildBulkEmails(rows, type, note);

  rows.forEach(row => {
    if (type === 'approve') empfehlungMarkPositionApproved(row.id);
    else empfehlungMarkPositionDeclined(row.id, note);
  });

  selectedIds.clear();
  resetBulkFollowup(true);
  renderOpenRequests();

  const verb = type === 'approve' ? 'freigegeben' : 'nicht freigegeben';
  const toastMsg = rows.length === 1
    ? `„${rows[0].productLabel}“ ${verb}. Der Tierbesitzer wird per E-Mail informiert.`
    : `${rows.length} Positionen ${verb}. Die Tierhalter werden per E-Mail informiert.`;
  showToast(toastMsg, type === 'approve' ? 'success' : 'error');
  setTimeout(() => openEmailsOverlay(keys), 400);
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
      ${empfehlungCustomerNameCellHtml(row.customerName)}
      <td data-label="Datum">${row.date}</td>
      ${empfehlungProductCellHtml(row.cartName, row.variantLabel, row.qty, false, 'Angefragte Produkte')}
      ${empfehlungCustomerNoteCellHtml(row.customerNote)}
      <td class="data-table-action" data-label="Freigeben">
        <div class="data-table-actions">
          <button type="button" class="btn --icon --sm --success" aria-label="Freigeben, ${row.qty}×" onclick="quickApprove('${row.id}')">
            <span class="material-icons" aria-hidden="true">check</span>
          </button>
          <button type="button" class="btn --icon --sm --danger" aria-label="Nicht freigeben" onclick="quickDecline('${row.id}')">
            <span class="material-icons" aria-hidden="true">close</span>
          </button>
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

const OPEN_QTY_PRESETS = [1, 2, 5];

function packungLabel(n) {
  return n === 1 ? '1 Packung' : `${n} Packungen`;
}

function rowActionQtyValue(row) {
  return document.getElementById('rowActionQty')?.value || `max${row.qty}`;
}

function rowActionQtyOptionsHtml(requestedQty, selected) {
  const nums = new Set(OPEN_QTY_PRESETS);
  nums.add(requestedQty);
  const options = [...nums].sort((a, b) => a - b).map(n => {
    const val = `max${n}`;
    const asked = n === requestedQty ? ' (angefragt)' : '';
    return `<option value="${val}"${selected === val ? ' selected' : ''}>max. ${n}×${asked}</option>`;
  });
  options.push(`<option value="unlimited"${selected === 'unlimited' ? ' selected' : ''}>Unbegrenzt</option>`);
  return options.join('');
}

function rowActionApproveLead(row, value) {
  const parsed = empfehlungParseApprovalQty(value, row.qty);
  const head = `„${row.productLabel}“ für ${row.customerName}.`;
  if (parsed.unlimited) {
    return `${head} Sie geben unbegrenzt frei (angefragt: max. ${packungLabel(row.qty)}).`;
  }
  if (parsed.qty === row.qty) {
    return `${head} Sie geben die angefragte Menge frei: max. ${packungLabel(row.qty)}.`;
  }
  return `${head} Sie geben max. ${packungLabel(parsed.qty)} frei (angefragt: max. ${packungLabel(row.qty)}).`;
}

function rowActionConfirmLabel(value, requestedQty) {
  const parsed = empfehlungParseApprovalQty(value, requestedQty);
  return parsed.unlimited ? 'Unbegrenzt freigeben' : `${parsed.qty}× freigeben`;
}

function syncRowActionQtyUi() {
  if (!pendingRowAction || pendingRowAction.type !== 'approve') return;
  const row = openRequests.find(item => item.id === pendingRowAction.id);
  if (!row) return;
  const value = rowActionQtyValue(row);
  const leadEl = document.getElementById('rowActionModalLead');
  const confirmBtn = document.getElementById('rowActionConfirmBtn');
  if (leadEl) leadEl.textContent = rowActionApproveLead(row, value);
  if (confirmBtn) confirmBtn.textContent = rowActionConfirmLabel(value, row.qty);
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
  const customerNoteEl = document.getElementById('rowActionCustomerNote');
  const confirmBtn = document.getElementById('rowActionConfirmBtn');
  const qtyWrap = document.getElementById('rowActionQtyWrap');
  const qtySel = document.getElementById('rowActionQty');

  modalEl?.classList.toggle('--danger', !approve);
  if (titleEl) titleEl.textContent = title;
  if (qtyWrap) qtyWrap.hidden = !approve;
  if (approve && qtySel) {
    const requested = `max${row.qty}`;
    qtySel.innerHTML = rowActionQtyOptionsHtml(row.qty, requested);
    qtySel.value = requested;
  }
  if (leadEl) {
    leadEl.textContent = approve
      ? rowActionApproveLead(row, `max${row.qty}`)
      : `„${row.productLabel}“ für ${row.customerName} nicht freigeben.`;
  }
  if (customerNoteEl) {
    const empty = empfehlungCustomerNoteIsEmpty(row.customerNote);
    customerNoteEl.textContent = empty
      ? empfehlungCustomerNoteText('')
      : `Notiz des Tierhalters: ${empfehlungCustomerNoteText(row.customerNote)}`;
    customerNoteEl.classList.toggle('--empty', empty);
  }
  if (noteEl) noteEl.value = '';
  if (confirmBtn) confirmBtn.textContent = approve ? rowActionConfirmLabel(`max${row.qty}`, row.qty) : title;

  setRowActionModalOpen(true);
  (approve ? qtySel : noteEl)?.focus();
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
  if (counter) {
    counter.textContent = count === 1
      ? '1 Nachricht ausgelöst'
      : `${count} Nachrichten ausgelöst`;
  }
  if (body) {
    body.innerHTML = keys.map(key => {
      const d = emailOverlayData[key];
      if (!d) return '';
      const h = window.mockupNotifHeader(d);
      return `
      <div class="mockup-email-inline${d.internal ? ' --internal' : ''}">
        <div class="mockup-email-inline__header">
          <span class="mockup-email__tag${d.internal ? ' --internal' : ''}">${d.tag}</span>
          <span class="mockup-email-inline__to">${h.to}</span>
          <span class="mockup-email-inline__subject">${h.subject}</span>
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

function approvalSizeLine(row, parsed) {
  if (!parsed) return `${row.variantLabel} (angefragt: max. ${row.qty}×)`;
  if (parsed.unlimited) {
    return `${row.variantLabel}: unbegrenzt (angefragt: max. ${row.qty}×)`;
  }
  if (parsed.qty === row.qty) return `${row.variantLabel}: max. ${parsed.qty}×`;
  return `${row.variantLabel}: max. ${parsed.qty}× (angefragt: max. ${row.qty}×)`;
}

function b1DeclinedHintHtml(hasDeclined) {
  return hasDeclined
    ? '<p>Sprechen Sie gerne noch einmal mit Ihrer Praxis. Vielleicht passt ein anderes Inuvet-Produkt besser.</p>'
    : '';
}

function buildRowActionEmails(row, type, note, parsed) {
  const approved = type === 'approve';
  const sizeLine = approved ? approvalSizeLine(row, parsed) : `${row.variantLabel} (angefragt: max. ${row.qty}×)`;
  const noteBlock = note ? `<p><strong>Notiz an Sie:</strong> <em>${note}</em></p>` : '';
  const approvedBlock = approved
    ? `<p><strong>Freigegeben:</strong></p><ul><li><strong>${row.cartName}</strong> — ${sizeLine}</li></ul>`
    : '';
  const declinedBlock = !approved
    ? `<p><strong>Nicht freigegeben:</strong></p><ul><li><strong>${row.cartName}</strong> — ${sizeLine}</li></ul>`
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
        ${b1DeclinedHintHtml(!approved)}
        ${approved ? '<p>Sie können die freigegebenen Produkte jetzt auf tierarzt-empfehlung.com einlösen.</p>' : ''}`,
    },
  };
}

function groupRowsByCustomer(rows) {
  const groups = [];
  const indexByKey = new Map();
  rows.forEach(row => {
    const key = row.customerEmail || row.customerName;
    if (!indexByKey.has(key)) {
      indexByKey.set(key, groups.length);
      groups.push({ customerName: row.customerName, customerEmail: row.customerEmail, rows: [] });
    }
    groups[indexByKey.get(key)].rows.push(row);
  });
  return groups;
}

function buildBulkEmails(rows, type, note) {
  const approved = type === 'approve';
  const groups = groupRowsByCustomer(rows);
  const noteBlock = note ? `<p><strong>Notiz an Sie:</strong> <em>${note}</em></p>` : '';
  const keys = [];
  emailOverlayData = {};

  groups.forEach((group, i) => {
    const items = group.rows.map(row => {
      const parsed = empfehlungParseApprovalQty(`max${row.qty}`, row.qty);
      const line = approved
        ? approvalSizeLine(row, parsed)
        : `${row.variantLabel} (angefragt: max. ${row.qty}×)`;
      return `<li><strong>${row.cartName}</strong> — ${line}</li>`;
    }).join('');
    const heading = approved ? 'Freigegeben' : 'Nicht freigegeben';
    const key = `customer${i}`;
    keys.push(key);
    emailOverlayData[key] = {
      tag: 'E-Mail',
      recipient: group.customerEmail,
      subject: 'Ihre Empfehlungsanfrage wurde bearbeitet',
      body: `
        <p>Dr. Martina Müller (Tierarztpraxis Grüntal) hat Ihre Empfehlungsanfrage bearbeitet:</p>
        <p><strong>${heading}:</strong></p>
        <ul>${items}</ul>
        ${noteBlock}
        ${b1DeclinedHintHtml(!approved)}
        ${approved ? '<p>Sie können die freigegebenen Produkte jetzt auf tierarzt-empfehlung.com einlösen.</p>' : ''}`,
    };
  });

  return keys;
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
  const parsed = type === 'approve'
    ? empfehlungParseApprovalQty(rowActionQtyValue(row), row.qty)
    : null;

  if (type === 'approve') empfehlungMarkPositionApproved(id, parsed);
  else empfehlungMarkPositionDeclined(id, note);

  selectedIds.delete(id);
  buildRowActionEmails(row, type, note, parsed);
  closeRowActionModal();
  renderOpenRequests();

  const toastMsg = type === 'approve'
    ? (parsed.unlimited
      ? `„${row.productLabel}“ unbegrenzt freigegeben. Der Tierbesitzer wird per E-Mail informiert.`
      : `„${row.productLabel}“ freigegeben (${parsed.qty}×). Der Tierbesitzer wird per E-Mail informiert.`)
    : `„${row.productLabel}“ nicht freigegeben. Der Tierbesitzer wird per E-Mail informiert.`;
  showToast(toastMsg, type === 'approve' ? 'success' : 'error');
  setTimeout(() => openEmailsOverlay(['customer']), 400);
}

function quickApprove(id) {
  openRowActionModal(id, 'approve');
}

function quickDecline(id) {
  openRowActionModal(id, 'decline');
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
