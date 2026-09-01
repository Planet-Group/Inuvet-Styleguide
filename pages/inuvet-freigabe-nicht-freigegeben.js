/* ════════════════════════════════════════════
   Inuvet-Freigabe-Nicht-Freigegeben — Historie abgelehnter Positionen · inuvet.com
   „Jetzt freigeben“ kehrt die Ablehnung um (Menge + optionale neue Notiz).
   Daten: inuvet-freigabe-mock.js
   ════════════════════════════════════════════ */

const DECLINED_QTY_PRESETS = [1, 2, 5];
const declinedSortState = { key: 'date', dir: 'desc' };
const DECLINED_SORT_GETTERS = {
  customerName: row => row.customerName,
  date: row => row.date,
  productLabel: row => row.productLabel,
};

let pendingDeclinedId = null;
let emailOverlayData = {};

function packungLabel(n) {
  return n === 1 ? '1 Packung' : `${n} Packungen`;
}

function qtyOptionsHtml(requestedQty, selected) {
  const nums = new Set(DECLINED_QTY_PRESETS);
  nums.add(requestedQty);
  const options = [...nums].sort((a, b) => a - b).map(n => {
    const val = `max${n}`;
    const asked = n === requestedQty ? ' (angefragt)' : '';
    return `<option value="${val}"${selected === val ? ' selected' : ''}>max. ${n}×${asked}</option>`;
  });
  options.push(`<option value="unlimited"${selected === 'unlimited' ? ' selected' : ''}>Unbegrenzt</option>`);
  return options.join('');
}

function approveLead(row, value) {
  const parsed = empfehlungParseApprovalQty(value, row.qty);
  const head = `„${row.productLabel}“ für ${row.customerName} war abgelehnt (${empfehlungFormatDateDE(row.date)}).`;
  if (parsed.unlimited) {
    return `${head} Sie geben jetzt unbegrenzt frei (angefragt: max. ${packungLabel(row.qty)}).`;
  }
  if (parsed.qty === row.qty) {
    return `${head} Sie geben die angefragte Menge frei: max. ${packungLabel(row.qty)}.`;
  }
  return `${head} Sie geben max. ${packungLabel(parsed.qty)} frei (angefragt: max. ${packungLabel(row.qty)}).`;
}

function confirmLabel(value, requestedQty) {
  const parsed = empfehlungParseApprovalQty(value, requestedQty);
  return parsed.unlimited ? 'Unbegrenzt freigeben' : `${parsed.qty}× freigeben`;
}

function currentDeclinedRow() {
  return empfehlungFlattenDeclinedRows().find(item => item.id === pendingDeclinedId) || null;
}

function syncApproveDeclinedQtyUi() {
  const row = currentDeclinedRow();
  if (!row) return;
  const value = document.getElementById('approveDeclinedQty')?.value || `max${row.qty}`;
  const leadEl = document.getElementById('approveDeclinedLead');
  const confirmBtn = document.getElementById('approveDeclinedConfirm');
  if (leadEl) leadEl.textContent = approveLead(row, value);
  if (confirmBtn) confirmBtn.textContent = confirmLabel(value, row.qty);
}

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
      <td class="data-table-action" data-label="Freigeben">
        <div class="data-table-actions">
          <button type="button" class="btn --icon --sm --success" aria-label="Jetzt freigeben" onclick="openApproveDeclinedModal('${row.id}')">
            <span class="material-icons" aria-hidden="true">check</span>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function setApproveDeclinedOpen(open) {
  document.getElementById('approveDeclinedOverlay')?.classList.toggle('--open', open);
  document.body.style.overflow = document.querySelector('.modal-overlay.--open') ? 'hidden' : '';
}

function openApproveDeclinedModal(id) {
  const row = empfehlungFlattenDeclinedRows().find(item => item.id === id);
  if (!row) return;
  pendingDeclinedId = id;
  const qtySel = document.getElementById('approveDeclinedQty');
  const noteEl = document.getElementById('approveDeclinedNote');
  const prevEl = document.getElementById('approveDeclinedPrevNote');
  const requested = `max${row.qty}`;
  if (qtySel) {
    qtySel.innerHTML = qtyOptionsHtml(row.qty, requested);
    qtySel.value = requested;
  }
  if (noteEl) noteEl.value = '';
  if (prevEl) {
    const empty = empfehlungCustomerNoteIsEmpty(row.vetNote);
    prevEl.textContent = empty
      ? 'Bei der Ablehnung wurde keine Notiz an den Tierbesitzer hinterlassen.'
      : `Notiz bei Ablehnung: ${row.vetNote}`;
    prevEl.classList.toggle('--empty', empty);
  }
  syncApproveDeclinedQtyUi();
  setApproveDeclinedOpen(true);
  qtySel?.focus();
}

function closeApproveDeclinedModal() {
  pendingDeclinedId = null;
  const noteEl = document.getElementById('approveDeclinedNote');
  if (noteEl) noteEl.value = '';
  setApproveDeclinedOpen(false);
}

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

function buildApproveDeclinedEmails(row, parsed, note) {
  const sizeLine = parsed.unlimited
    ? `${row.variantLabel}: unbegrenzt (angefragt: max. ${row.qty}×)`
    : parsed.qty === row.qty
      ? `${row.variantLabel}: max. ${parsed.qty}×`
      : `${row.variantLabel}: max. ${parsed.qty}× (angefragt: max. ${row.qty}×)`;
  const noteBlock = note ? `<p><strong>Notiz an Sie:</strong> <em>${note}</em></p>` : '';
  emailOverlayData = {
    customer: {
      tag: 'E-Mail',
      recipient: row.customerEmail,
      subject: 'Ihre Empfehlungsanfrage wurde bearbeitet',
      body: `
        <p>Dr. Martina Müller (Tierarztpraxis Grüntal) hat Ihre Empfehlungsanfrage erneut geprüft und freigegeben:</p>
        <p><strong>Freigegeben:</strong></p>
        <ul><li><strong>${row.cartName}</strong> — ${sizeLine}</li></ul>
        ${noteBlock}
        <p>Sie können die freigegebenen Produkte jetzt auf tierarzt-empfehlung.com einlösen.</p>`,
    },
  };
}

function confirmApproveDeclined() {
  const row = currentDeclinedRow();
  if (!row) {
    closeApproveDeclinedModal();
    return;
  }
  const value = document.getElementById('approveDeclinedQty')?.value || `max${row.qty}`;
  const parsed = empfehlungParseApprovalQty(value, row.qty);
  const note = document.getElementById('approveDeclinedNote')?.value.trim() ?? '';
  buildApproveDeclinedEmails(row, parsed, note);
  empfehlungApproveDeclinedRow(row.id, parsed);
  closeApproveDeclinedModal();
  renderDeclinedRequests();
  empfehlungSyncOpenRequestNavBadges();
  const toastMsg = parsed.unlimited
    ? `„${row.productLabel}“ nachträglich unbegrenzt freigegeben. Der Tierbesitzer wird per E-Mail informiert.`
    : `„${row.productLabel}“ nachträglich freigegeben (${parsed.qty}×). Der Tierbesitzer wird per E-Mail informiert.`;
  showToast(toastMsg, 'success');
  setTimeout(() => openEmailsOverlay(['customer']), 400);
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
