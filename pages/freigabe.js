/* ════════════════════════════════════════════
   Produkt-Daten für diese Anfrage
   commissionPerOrder = Provision pro tatsächlicher Bestellung
   ════════════════════════════════════════════ */
const REQUEST_PRODUCTS = [
  {
    id: 1,
    cartName: 'Calmin Balance Tabletten',
    variants: [
      { label: '60 Stück', price: '39,90 €', commission: 4.50 },
      { label: '90 Stück', price: '54,90 €', commission: 6.20 },
    ],
  },
  {
    id: 2,
    cartName: 'Hepax forte Tabletten',
    variants: [
      { label: '30 Stück', price: '34,90 €', commission: 5.20 },
      { label: '60 Stück', price: '64,90 €', commission: 9.70 },
    ],
  },
];

// Mapping Empfehlungs-Stufe → maximale Anzahl Bestellungen
const QTY_MAX = { reject: 0, max1: 1, max2: 2, max5: 5, unlimited: Infinity };

const approvalState = {
  1: { qty: 'unlimited', variantLabel: '60 Stück' },
  2: { qty: 'unlimited', variantLabel: '30 Stück' },
};

function formatEur(value) {
  return value.toFixed(2).replace('.', ',') + ' €';
}

function getVariantCommission(productId) {
  const s       = approvalState[productId];
  const product = REQUEST_PRODUCTS.find(p => p.id === productId);
  const variant = product.variants.find(v => v.label === s.variantLabel) ?? product.variants[0];
  return variant.commission;
}

function commissionForProduct(productId) {
  const s        = approvalState[productId];
  if (!s || s.qty === null)  return { text: '—', muted: true };
  if (s.qty === 'reject')    return { text: 'Keine Provision', muted: true };
  const perOrder = getVariantCommission(productId);
  const max      = QTY_MAX[s.qty];
  if (max === Infinity) return { text: formatEur(perOrder) + ' pro Bestellung', muted: false };
  return { text: formatEur(perOrder) + ' × ' + max + ' = max. ' + formatEur(perOrder * max), muted: false };
}

function setVariant(productId, label, btn) {
  approvalState[productId].variantLabel = label;
  btn.closest('.approval-size-group').querySelectorAll('.choice-box').forEach(b => b.classList.remove('--active'));
  btn.classList.add('--active');
  updateCommission(productId);
  updateCounter();
}

function setQty(productId, value) {
  approvalState[productId].qty = value || null;
  const card = document.getElementById('card-' + productId);
  card.dataset.status = value === 'reject' ? 'rejected' : value ? 'approved' : 'open';
  updateCommission(productId);
  updateCounter();
}

function updateCommission(productId) {
  const el = document.getElementById('commission-' + productId);
  if (!el) return;
  const c = commissionForProduct(productId);
  el.textContent = c.text;
  el.classList.toggle('--muted', c.muted);
}

function updateCounter() {
  const total   = Object.keys(approvalState).length;
  const decided = Object.values(approvalState).filter(s => s.qty !== null).length;
  const counter = document.getElementById('approvalCounter');

  let totalFixed = 0;
  let unlimitedPerOrder = 0;
  REQUEST_PRODUCTS.forEach(p => {
    const s = approvalState[p.id];
    if (!s || s.qty === null || s.qty === 'reject') return;
    const perOrder = getVariantCommission(p.id);
    const max = QTY_MAX[s.qty];
    if (max === Infinity) unlimitedPerOrder += perOrder;
    else totalFixed += perOrder * max;
  });

  let text = `${decided} von ${total} Produkten entschieden`;
  if (totalFixed > 0 || unlimitedPerOrder > 0) {
    let provText;
    if (totalFixed > 0 && unlimitedPerOrder > 0) {
      provText = `bis zu ${formatEur(totalFixed)} + ${formatEur(unlimitedPerOrder)} pro Bestellung`;
    } else if (totalFixed > 0) {
      provText = `bis zu ${formatEur(totalFixed)}`;
    } else {
      provText = `${formatEur(unlimitedPerOrder)} pro Bestellung`;
    }
    text += ` · Provision: ${provText}`;
  }
  counter.textContent = text;
  counter.classList.toggle('--complete', decided === total);
}

// Initialzustand rendern (Default: Unbegrenzt für alle Produkte)
REQUEST_PRODUCTS.forEach(p => updateCommission(p.id));
updateCounter();

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
  const undecided = Object.entries(approvalState).filter(([_, s]) => s.qty === null);
  if (undecided.length > 0) {
    const counter = document.getElementById('approvalCounter');
    counter.style.color = 'var(--color-error)';
    counter.textContent = `Bitte alle ${Object.keys(approvalState).length} Produkte entscheiden, bevor du absendest.`;
    counter.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const qtyLabel = { max1: 'max. 1×', max2: 'max. 2×', max5: 'max. 5×', unlimited: 'Unbegrenzt' };

  const results = REQUEST_PRODUCTS.map(p => {
    const s    = approvalState[p.id];
    const note = document.getElementById('note-' + p.id)?.value ?? '';
    return { ...p, qty: s.qty, variantLabel: s.variantLabel, note };
  });

  const approvedResults = results.filter(r => r.qty !== 'reject');
  const rejectedResults = results.filter(r => r.qty === 'reject');
  const allRejected     = approvedResults.length === 0;

  const customerLines = results.map(r => {
    const variant = r.variantLabel ? ` (${r.variantLabel})` : '';
    if (r.qty === 'reject') return `<li>${r.cartName}${variant}: <em>Nicht freigegeben</em>${r.note ? ` – ${r.note}` : ''}</li>`;
    return `<li>${r.cartName}${variant}: ${qtyLabel[r.qty] || r.qty}${r.note ? ` – <em>${r.note}</em>` : ''}</li>`;
  }).join('');

  const internalLines = results.map(r => {
    const variant = r.variantLabel ? ` (${r.variantLabel})` : '';
    if (r.qty === 'reject') return `<li>${r.cartName}${variant}: <strong>Abgelehnt</strong>${r.note ? ` – ${r.note}` : ''}</li>`;
    return `<li>${r.cartName}${variant}: <strong>${qtyLabel[r.qty] || r.qty}</strong>${r.note ? ` – <em>${r.note}</em>` : ''}</li>`;
  }).join('');

  emailOverlayData = {
    customer: {
      tag: 'E-Mail',
      recipient: 'kunde@email.com',
      subject: allRejected ? 'Ihre Empfehlungsanfrage wurde bearbeitet' : 'Ihre Empfehlung ist da!',
      body: `
        <p>Dr. Martina Müller (Tierarztpraxis Grüntal) hat Ihre Empfehlungsanfrage bearbeitet:</p>
        <ul>${customerLines}</ul>
        ${allRejected
          ? '<p>Leider wurden keine Produkte freigegeben. Bei Fragen wenden Sie sich bitte an Ihre Tierarztpraxis.</p>'
          : '<p>Sie können freigegebene Produkte jetzt auf inuvet.com einlösen.</p>'}
      `,
    },
    internal: {
      tag: 'Intern',
      recipient: 'team@inuvet.com',
      subject: `Freigabe bearbeitet: Max Mustermann`,
      internal: true,
      body: `
        <p>Dr. Martina Müller (Tierarztpraxis Grüntal) hat die Empfehlungsanfrage von <strong>Max Mustermann</strong> (kunde@email.com) bearbeitet:</p>
        <ul>${internalLines}</ul>
        <p>${approvedResults.length} von ${results.length} Produkt${results.length !== 1 ? 'en' : ''} freigegeben${rejectedResults.length > 0 ? `, ${rejectedResults.length} abgelehnt` : ''}.</p>
        <p class="mockup-email-panel__note">Max Mustermann wurde automatisch per E-Mail benachrichtigt.</p>
      `,
    },
  };

  document.getElementById('approvalMain').innerHTML = `
    <div class="success-state">
      <span class="material-icons success-state__icon">check_circle</span>
      <h2 class="success-state__title">Freigabe übermittelt</h2>
      <p class="success-state__body">
        Max Mustermann wird per E-Mail über Ihre Entscheidung informiert.
      </p>
    </div>
    <div class="approval-footer">
      <a href="#" onclick="location.reload();return false;" class="btn --ghost">Zurück zur Übersicht</a>
    </div>
  `;

  setTimeout(() => openEmailsOverlay(['customer', 'internal']), 500);
}
