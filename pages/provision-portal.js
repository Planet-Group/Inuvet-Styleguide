/* ═══════════════════════════════════════
   DATEN
   ═══════════════════════════════════════ */

const PREMIUMS = [
  {
    id: 3,
    name: 'Luxusreise nach Rimini',
    price: 1200.00,
    desc: 'Vier Tage Auszeit an der Adria: Hotel, Frühstück und Strandkorb inklusive.',
    longDesc: 'Erhol dich nach einem langen Praxis-Jahr an der Adria. Das Paket beinhaltet 4 Übernachtungen im 4-Sterne-Hotel mit Meerblick, tägliches Frühstücksbuffet sowie einen reservierten Strandkorb. Reisetermin frei wählbar (April–Oktober). Buchungsbestätigung innerhalb von 48 Stunden.',
    image: '../assets/images/Rimini.jpg'
  },
  {
    id: 2,
    name: 'Espresso-Maschine deLonghi',
    price: 456.99,
    desc: 'Professioneller Kaffeegenuß für zuhause — die deLonghi Dedica Style im klassischen Design.',
    longDesc: 'Die deLonghi Dedica Style EC 685 überzeugt mit kompakter Bauform und professioneller Brühtechnik. 15 Bar Pumpendruck, Thermoblock-Heizsystem und ein Milchaufschäumer für perfekten Cappuccino — direkt aus deiner Praxis-Küche. Lieferung frei Haus, innerhalb von 3–5 Werktagen.',
    image: '../assets/images/Kaffeemaschine.jpg'
  },
  {
    id: 1,
    name: 'Amazon Gutschein 400 Euro',
    price: 400.00,
    desc: 'Flexibel einlösbar im gesamten Amazon-Sortiment — von Tiernahrung bis Haushaltsgeräten.',
    longDesc: 'Dein Amazon Gutschein über 400 Euro ist sofort nach der Einlösung in deinem Amazon-Konto verfügbar. Nutze ihn für alles, was du brauchst — ohne Ablaufdatum und ohne Einschränkungen. Der Gutscheincode wird dir per E-Mail zugesendet.',
    voucher: { brand: 'amazon', value: '400 €' }
  }
];


/* ═══════════════════════════════════════
   ZUSTAND
   ═══════════════════════════════════════ */

let provisionTotal = 485.00;
let cart = [];
let currentPage = 'portal';
let activePremiumId = null;
let lastOrder = null;

/* ═══════════════════════════════════════
   HILFSFUNKTIONEN
   ═══════════════════════════════════════ */

function cartTotal() {
  return cart.reduce((sum, id) => sum + PREMIUMS.find(p => p.id === id).price, 0);
}

function provisionAvailable() {
  return provisionTotal - cartTotal();
}

function fmt(n) {
  return n.toFixed(2).replace('.', ',') + ' €';
}

function tilePct(p) {
  if (cart.includes(p.id)) return 100;
  return Math.min(100, Math.floor(provisionAvailable() / p.price * 100));
}

function canAfford(p) {
  return provisionAvailable() >= p.price;
}

/* ═══════════════════════════════════════
   CART
   ═══════════════════════════════════════ */

function openCart() {
  document.getElementById('cartOverlay').classList.add('--open');
  document.getElementById('cartDrawer').classList.add('--open');
}

function closeCart() {
  document.getElementById('cartOverlay').classList.remove('--open');
  document.getElementById('cartDrawer').classList.remove('--open');
}

function addToCart(id) {
  if (!cart.includes(id)) cart.push(id);
  render();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i !== id);
  render();
}

/* ═══════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════ */

function openPDP(id) {
  activePremiumId = id;
  currentPage = 'pdp';
  render();
  window.scrollTo(0, 0);
}

function backToPortal() {
  currentPage = 'portal';
  render();
  window.scrollTo(0, 0);
}

function goToCheckout() {
  closeCart();
  currentPage = 'checkout';
  render();
  window.scrollTo(0, 0);
}

function completeCheckout() {
  lastOrder = {
    items: cart.map(id => PREMIUMS.find(p => p.id === id)),
    total: cartTotal(),
    remaining: provisionAvailable()
  };
  provisionTotal = provisionAvailable();
  cart = [];
  currentPage = 'success';
  render();
  window.scrollTo(0, 0);
}

function setVoucher() {
  const brand = document.getElementById('voucherBrand').value.trim();
  const value = document.getElementById('voucherValue').value.trim();
  const p = PREMIUMS.find(x => x.voucher);
  if (p && (brand || value)) {
    if (brand) p.voucher.brand = brand;
    if (value) p.voucher.value = value;
    render();
    document.getElementById('mockupFabPanel').classList.remove('--open');
  }
}

const PAYOUT_MIN = 20;

function openAuszahlungModal() {
  const available = provisionAvailable();
  const notice = document.getElementById('payoutMinNotice');
  const amountEl = document.getElementById('payoutMinAmount');
  const belowMin = available < PAYOUT_MIN;
  notice.style.display = belowMin ? '' : 'none';
  if (belowMin) amountEl.textContent = fmt(available);
  document.getElementById('auszahlungModal').classList.add('--open');
}

function closeAuszahlungModal() {
  document.getElementById('auszahlungModal').classList.remove('--open');
}

function completePayout() {
  closeAuszahlungModal();
  const amount = provisionAvailable();
  provisionTotal = 0;
  cart = [];
  lastOrder = { items: [], total: amount, remaining: 0, payout: true };
  currentPage = 'success';
  render();
  window.scrollTo(0, 0);
}

function copyPromoCode(btn) {
  navigator.clipboard.writeText('T159075X').then(() => {
    const icon = btn.querySelector('.material-icons');
    icon.textContent = 'check';
    setTimeout(() => { icon.textContent = 'content_copy'; }, 1500);
  });
}

function setCheckoutOption(btn) {
  btn.closest('.tile-grid').querySelectorAll('.choice-box').forEach(b => b.classList.remove('--active'));
  btn.classList.add('--active');
}

/* ═══════════════════════════════════════
   MOCKUP FAB
   ═══════════════════════════════════════ */

function setProvision() {
  const val = parseFloat(document.getElementById('provisionInput').value);
  if (!isNaN(val) && val >= 0) {
    provisionTotal = val;
    cart = [];
    render();
    document.getElementById('mockupFabPanel').classList.remove('--open');
  }
}

/* ═══════════════════════════════════════
   RENDER: PORTAL
   ═══════════════════════════════════════ */

function renderTile(p) {
  const pct = tilePct(p);
  const inCart = cart.includes(p.id);
  const affordable = canAfford(p);

  let cartOverlay = '';
  let floatingMeta = '';

  if (inCart) {
    cartOverlay = `<div class="tile__cart"><button class="btn --secondary --full" onclick="event.stopPropagation(); removeFromCart(${p.id})">Entfernen</button></div>`;
  } else if (affordable) {
    floatingMeta = `<div class="floating-meta"><div class="badge --sale">Einlösbar</div></div>`;
    cartOverlay = `<div class="tile__cart"><button class="btn --secondary --full" onclick="event.stopPropagation(); addToCart(${p.id})">In den Warenkorb</button></div>`;
  } else {
    const missing = p.price - provisionAvailable();
    floatingMeta = `<div class="floating-meta"><div class="badge --dark">Noch ${fmt(missing)}</div></div>`;
  }

  return `
    <div class="tile --product" onclick="openPDP(${p.id})">
      <div class="tile__image-wrap">
${p.voucher
          ? `<div class="tile__image --square voucher-frame">${floatingMeta}<div class="voucher-card"><span class="voucher-card__brand">${p.voucher.brand}</span><span class="voucher-card__value">${p.voucher.value}</span></div></div>`
          : `<div class="tile__image --square${p.image ? '' : ' placeholder-bg'}">${p.image ? `<img src="${p.image}" alt="${p.name}">` : ''}${floatingMeta}</div>`
        }
        <svg class="tile__ring" viewBox="0 0 48 48" width="72" height="72" aria-hidden="true">
          <circle cx="24" cy="24" r="23" fill="rgba(255,255,255,0.7)"/>
          <circle cx="24" cy="24" r="18" fill="none" stroke="var(--border-light)" stroke-width="3"/>
          <circle cx="24" cy="24" r="18" fill="none" stroke="var(--green)" stroke-width="3"
            stroke-linecap="round" stroke-dasharray="113.1" stroke-dashoffset="113.1"
            transform="rotate(-90 24 24)" class="tile__ring-fill" data-pct="${pct}"/>
          <text x="24" y="28" text-anchor="middle" font-size="9" font-weight="700" fill="var(--fg)" class="tile__ring-text">${pct}%</text>
        </svg>
        ${cartOverlay}
      </div>
      <div class="tile__headline-row">
        <h3 class="tile__headline">${p.name}</h3>
      </div>
      <p class="tile__description">${p.desc}</p>
      <div class="tile__price">
        <div class="price-stack"><span>${fmt(p.price)}</span></div>
      </div>
    </div>`;
}


function nextNonAffordable() {
  const available = provisionAvailable();
  return [...PREMIUMS].sort((a, b) => a.price - b.price).find(p => p.price > available) || null;
}

function renderPortal() {
  const available = provisionAvailable();
  const target = nextNonAffordable();
  const circ = 515.2;
  const pct = target ? Math.min(available / target.price, 1) : 1;
  const offset = +(circ * (1 - pct)).toFixed(2);
  const hintText = target
    ? `Noch <strong>${fmt(target.price - available)}</strong> bis<br><a href="#" onclick="openPDP(${target.id});return false;"><em>${target.name}</em></a>`
    : `Alle Prämien einlösbar`;

  const pctInt = Math.round(pct * 100);

  return `
    <section class="provision-hero">
      <div class="provision-hero__grid">
        <div class="provision-hero__col --label">
          <p class="provision-hero__title">Deine aktuelle Provision</p>
        </div>
        <div class="provision-hero__col">
          <p class="provision-hero__mobile-title">Deine aktuelle Provision</p>
          <span class="provision-hero__amount" id="provisionAmount">${fmt(available)}</span>
          <button class="btn --primary" onclick="openAuszahlungModal()">Sofort auszahlen</button>
        </div>
        <div class="provision-hero__col --ring">
          <div class="provision-hero__ring-wrap">
            <svg class="provision-hero__ring-svg" viewBox="0 0 200 200" aria-hidden="true">
              <circle cx="100" cy="100" r="82" fill="none" stroke="var(--border-light)" stroke-width="16"/>
              <circle cx="100" cy="100" r="82" fill="none" stroke="var(--green)" stroke-width="16"
                stroke-linecap="round"
                stroke-dasharray="${circ}"
                stroke-dashoffset="${circ}"
                transform="rotate(-90 100 100)"
                class="provision-hero__ring-fill"
                data-offset="${offset}"/>
            </svg>
            <div class="provision-hero__ring-inner">
              <span class="provision-hero__ring-pct">${pctInt}%</span>
            </div>
          </div>
        </div>

        <div class="provision-hero__sub --label">auf Basis von 5 Empfehlungen</div>
        <div class="provision-hero__sub --oder">oder</div>
        <div class="provision-hero__sub --hint">${hintText}</div>
      </div>
    </section>

    <div class="page --no-pt portal-section">
      <h2 class="portal-section__title">Prämie kassieren</h2>
      <div class="tile-grid --cols-3">
        ${PREMIUMS.map(renderTile).join('')}
      </div>
    </div>

    `;
}

/* ═══════════════════════════════════════
   RENDER: PDP
   ═══════════════════════════════════════ */

function renderPDP() {
  const p = PREMIUMS.find(x => x.id === activePremiumId);
  const inCart = cart.includes(p.id);
  const affordable = canAfford(p);

  let actionBtn;
  if (inCart) {
    actionBtn = `<button class="btn --secondary" onclick="removeFromCart(${p.id}); backToPortal()">Aus Warenkorb entfernen</button>`;
  } else if (affordable) {
    actionBtn = `<button class="btn --primary" onclick="addToCart(${p.id})">In den Warenkorb</button>`;
  } else {
    const missing = p.price - provisionAvailable();
    actionBtn = `<button class="btn --primary" disabled>Noch ${fmt(missing)} fehlend</button>`;
  }

  const pct = tilePct(p);
  let pdpBadge = '';
  if (!inCart && affordable) pdpBadge = `<div class="floating-meta"><div class="badge --sale">Einlösbar</div></div>`;
  else if (!inCart) pdpBadge = `<div class="floating-meta"><div class="badge --dark">Noch ${fmt(p.price - provisionAvailable())}</div></div>`;
  const pdpRing = `
    <svg class="tile__ring" viewBox="0 0 48 48" width="72" height="72" aria-hidden="true">
      <circle cx="24" cy="24" r="23" fill="rgba(255,255,255,0.7)"/>
      <circle cx="24" cy="24" r="18" fill="none" stroke="var(--border-light)" stroke-width="3"/>
      <circle cx="24" cy="24" r="18" fill="none" stroke="var(--green)" stroke-width="3"
        stroke-linecap="round" stroke-dasharray="113.1" stroke-dashoffset="113.1"
        transform="rotate(-90 24 24)" class="tile__ring-fill" data-pct="${pct}"/>
      <text x="24" y="28" text-anchor="middle" font-size="9" font-weight="700" fill="var(--fg)" class="tile__ring-text">${pct}%</text>
    </svg>`;

  return `
    <div class="page portal-section">
      <button class="btn --ghost --back --sm portal-back-btn" onclick="backToPortal()">Alle Prämien</button>
      <div class="pdp">
        <div class="pdp__gallery">
          ${p.voucher
            ? `<div class="pdp__main-image voucher-frame">${pdpBadge}<div class="pdp__caption --hidden" aria-live="polite"></div>${pdpRing}<div class="voucher-card"><span class="voucher-card__brand">${p.voucher.brand}</span><span class="voucher-card__value">${p.voucher.value}</span></div></div>`
            : `<div class="pdp__main-image${p.image ? '' : ' placeholder-bg'}">${pdpBadge}<div class="pdp__caption --hidden" aria-live="polite"></div>${p.image ? `<img src="${p.image}" alt="${p.name}">` : ''}${pdpRing}</div>`
          }
          <div class="pdp__thumbs">
            <div class="pdp__thumb --active${p.image ? '' : ' placeholder-bg'}">${p.image ? `<img src="${p.image}" alt="${p.name}">` : ''}</div>
            <div class="pdp__thumb placeholder-bg"></div>
            <div class="pdp__thumb placeholder-bg"></div>
            <div class="pdp__thumb placeholder-bg"></div>
            <div class="pdp__thumb placeholder-bg"></div>
          </div>
        </div>
        <div class="pdp__info">
          <h1 class="pdp__title">${p.name}</h1>
          <p class="pdp__description">${p.desc}</p>
          <div class="pdp__price">
            <div class="price-stack"><span>${fmt(p.price)}</span></div>
            <span class="label-caps">Provisionswert</span>
          </div>
          <div class="pdp__actions">
            ${actionBtn}
          </div>
          <div class="accordion">
            <div class="accordion-item --open">
              <button class="accordion-trigger" type="button" aria-expanded="true" onclick="toggleAccordion(this)">Beschreibung<span class="accordion-icon material-icons">expand_more</span></button>
              <div class="accordion-content"><div class="accordion-content__inner"><p>${p.longDesc}</p></div></div>
            </div>
            <div class="accordion-item">
              <button class="accordion-trigger" type="button" aria-expanded="false" onclick="toggleAccordion(this)">Wie funktioniert das?<span class="accordion-icon material-icons">expand_more</span></button>
              <div class="accordion-content"><div class="accordion-content__inner"><p>Der Wert der Prämie wird von deiner verfügbaren Provision abgezogen. Du hast aktuell <strong>${fmt(provisionAvailable())}</strong> verfügbar.</p></div></div>
            </div>
            <div class="accordion-item">
              <button class="accordion-trigger" type="button" aria-expanded="false" onclick="toggleAccordion(this)">Versand &amp; Lieferung<span class="accordion-icon material-icons">expand_more</span></button>
              <div class="accordion-content"><div class="accordion-content__inner"><p>Die Prämie wird innerhalb von 5–7 Werktagen nach Einlösung an deine hinterlegte Adresse gesendet.</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

/* ═══════════════════════════════════════
   RENDER: CART DRAWER
   ═══════════════════════════════════════ */

function renderCartDrawer() {
  if (cart.length === 0) {
    return `
      <div class="cart-drawer__header">
        <span class="cart-drawer__title">Prämien-Warenkorb <span class="cart-drawer__count">(0)</span></span>
        <button type="button" class="btn --icon" onclick="closeCart()" aria-label="Schließen">
          <span class="material-icons">close</span>
        </button>
      </div>
      <div class="cart-drawer__empty">
        <div class="empty-state">
          <span class="material-icons">redeem</span>
          <p class="empty-state__title">Noch keine Prämie gewählt</p>
          <p class="empty-state__sub">Wähle eine Prämie aus und löse deine Provision ein.</p>
        </div>
      </div>`;
  }

  const items = cart.map(id => {
    const p = PREMIUMS.find(x => x.id === id);
    return `
      <div class="cart-item">
        <div class="product-thumb${p.image ? '' : ' placeholder-bg'}">${p.image ? `<img src="${p.image}" alt="${p.name}">` : ''}</div>
        <div class="cart-item__info">
          <div class="cart-item__top">
            <div>
              <p class="cart-item__name">${p.name}</p>
              <div class="cart-item__variant">Prämie</div>
            </div>
            <button type="button" class="btn --icon cart-item__remove" onclick="removeFromCart(${id})" aria-label="Entfernen">
              <span class="material-icons">close</span>
            </button>
          </div>
          <div class="cart-item__bottom">
            <span></span>
            <span class="cart-item__price">${fmt(p.price)}</span>
          </div>
        </div>
      </div>`;
  }).join('');

  const total = cartTotal();
  const remaining = provisionAvailable();

  return `
    <div class="cart-drawer__header">
      <span class="cart-drawer__title">Prämien-Warenkorb <span class="cart-drawer__count">(${cart.length})</span></span>
      <button type="button" class="btn --icon" onclick="closeCart()" aria-label="Schließen">
        <span class="material-icons">close</span>
      </button>
    </div>
    <div class="cart-drawer__items">${items}</div>
    <div class="cart-drawer__footer">
      <div class="summary-total">
        <span>Gesamt</span>
        <span>${fmt(total)}</span>
      </div>
      <div class="cart-drawer__tax">
        Verbleibende Provision nach Einlösung: ${fmt(remaining)}
      </div>
      <button class="btn --primary cart-drawer__checkout" onclick="goToCheckout()">Prämie einlösen</button>
      <div class="cart-drawer__continue-wrap">
        <button class="btn --ghost cart-drawer__continue" onclick="closeCart()">Weiter stöbern</button>
      </div>
    </div>`;
}

/* ═══════════════════════════════════════
   RENDER: CHECKOUT
   ═══════════════════════════════════════ */

function renderCheckout() {
  const items = cart.map(id => {
    const p = PREMIUMS.find(x => x.id === id);
    return `
      <div class="cart-item">
        <div class="cart-item__image product-thumb${p.image ? '' : ' placeholder-bg'}">${p.image ? `<img src="${p.image}" alt="${p.name}">` : ''}</div>
        <div class="cart-item__info">
          <div class="cart-item__top">
            <div>
              <p class="cart-item__name">${p.name}</p>
              <div class="cart-item__variant">Prämie</div>
            </div>
          </div>
          <div class="cart-item__bottom">
            <div class="cart-item__qty-text">1 Stück</div>
            <div class="price-stack">${fmt(p.price)}</div>
          </div>
        </div>
      </div>`;
  }).join('');

  const total = cartTotal();
  const remaining = provisionAvailable();

  return `
    <div class="page portal-section">
      <button class="btn --ghost --back --sm portal-back-btn" onclick="backToPortal()">Prämienauswahl</button>
      <div class="checkout">

        <!-- Linke Spalte: Adresse + Versand -->
        <div>
          <div>
            <h3 class="section-label --sub">Lieferadresse</h3>
            <div class="form-grid">
              <div class="form-field">
                <input type="text" id="co-vorname" placeholder=" " value="Michael">
                <label for="co-vorname">Vorname</label>
              </div>
              <div class="form-field">
                <input type="text" id="co-nachname" placeholder=" " value="Berger">
                <label for="co-nachname">Nachname</label>
              </div>
              <div class="form-field">
                <input type="text" id="co-strasse" placeholder=" " value="Musterstraße">
                <label for="co-strasse">Straße</label>
              </div>
              <div class="form-field">
                <input type="text" id="co-hausnr" placeholder=" " value="12">
                <label for="co-hausnr">Nr.</label>
              </div>
              <div class="form-field">
                <input type="text" id="co-plz" placeholder=" " value="80333">
                <label for="co-plz">PLZ</label>
              </div>
              <div class="form-field">
                <input type="text" id="co-ort" placeholder=" " value="München">
                <label for="co-ort">Ort</label>
              </div>
              <div class="form-field --span-2">
                <input type="email" id="co-email" placeholder=" " value="m.berger@tierarztpraxis-berger.de">
                <label for="co-email">E-Mail-Adresse</label>
              </div>
              <div class="form-field --span-2">
                <input type="tel" id="co-tel" placeholder=" " value="+49 89 123456">
                <label for="co-tel">Telefon (optional)</label>
              </div>
            </div>
          </div>

          <div>
            <h3 class="section-label --sub">Versandart</h3>
            <div class="tile-grid --compact">
              <button class="choice-box --block --active" type="button" onclick="setCheckoutOption(this)">
                <span class="material-icons">local_shipping</span>
                <span><strong>Standardversand</strong> — DHL · 3–5 Werktage · <strong>kostenlos</strong></span>
              </button>
              <button class="choice-box --block" type="button" onclick="setCheckoutOption(this)">
                <span class="material-icons">rocket_launch</span>
                <span><strong>Expressversand</strong> — DHL Express · 1–2 Werktage · <strong>4,99 €</strong></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Rechte Spalte: Bestellübersicht -->
        <aside class="checkout__sidebar">
          <h3 class="section-label --sub">Bestellübersicht</h3>
          ${items}
          <div class="summary-line"><span>Provisionswert</span><span>${fmt(total)}</span></div>
          <div class="summary-line"><span>Versand</span><span>kostenlos</span></div>
          <div class="summary-total"><span>Verbleibende Provision</span><span>${fmt(remaining)}</span></div>
          <div class="checkout__cta">
            <button class="btn --primary --full" type="button" onclick="completeCheckout()">Prämie einlösen</button>
          </div>
        </aside>

      </div>
    </div>`;
}

/* ═══════════════════════════════════════
   RENDER: ERFOLG
   ═══════════════════════════════════════ */

function renderSuccess() {
  if (lastOrder.payout) {
    return `
      <div class="page --narrow portal-section">
        <div class="success-state">
          <span class="success-state__icon material-icons">check_circle</span>
          <h1 class="success-state__title">Auszahlung beantragt!</h1>
          <p class="success-state__body"><strong>${fmt(lastOrder.total)}</strong> werden innerhalb von 3–5 Werktagen auf dein hinterlegtes Konto überwiesen.</p>
        </div>
        <div class="success-state__actions">
          <button class="btn --primary" onclick="backToPortal()">Zurück zur Übersicht</button>
        </div>
      </div>`;
  }

  const items = lastOrder.items.map(p => `
    <div class="cart-item">
      <div class="cart-item__image product-thumb placeholder-bg"></div>
      <div class="cart-item__info">
        <div class="cart-item__top">
          <div>
            <p class="cart-item__name">${p.name}</p>
            <div class="cart-item__variant">Prämie</div>
          </div>
        </div>
        <div class="cart-item__bottom">
          <div class="cart-item__qty-text">1 Stück</div>
          <div class="price-stack">${fmt(p.price)}</div>
        </div>
      </div>
    </div>`).join('');

  return `
    <div class="page --narrow portal-section">
      <div class="success-state">
        <span class="success-state__icon material-icons">check_circle</span>
        <h1 class="success-state__title">Deine Prämie ist unterwegs!</h1>
        <p class="success-state__body">Du hast <strong>${fmt(lastOrder.total)}</strong> Provision erfolgreich eingelöst. Eine Bestätigung wird an deine hinterlegte E-Mail-Adresse gesendet.</p>
      </div>
      <div class="portal-success__items">
        ${items}
        <div class="summary-line"><span>Eingelöste Provision</span><span>${fmt(lastOrder.total)}</span></div>
        <div class="summary-total"><span>Verbleibende Provision</span><span>${fmt(lastOrder.remaining)}</span></div>
      </div>
      <div class="success-state__actions">
        <button class="btn --primary" onclick="backToPortal()">Zurück zur Übersicht</button>
      </div>
    </div>`;
}

/* ═══════════════════════════════════════
   HAUPT-RENDER
   ═══════════════════════════════════════ */


function initRings() {
  const circ = 113.1;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill = entry.target.querySelector('.tile__ring-fill');
      if (!fill || fill.dataset.animated) return;
      fill.dataset.animated = '1';
      const pct = parseFloat(fill.dataset.pct);
      fill.style.strokeDashoffset = circ * (1 - pct / 100);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.tile.--product').forEach(t => observer.observe(t));
}

function countUp(target, duration = 1800) {
  const el = document.getElementById('provisionAmount');
  if (!el) return;
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = fmt(eased * target);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function animateHeroRing() {
  const fill = document.querySelector('.provision-hero__ring-fill');
  if (!fill) return;
  fill.style.strokeDashoffset = fill.dataset.offset;
}

function animatePDPRing() {
  const fill = document.querySelector('.pdp__main-image .tile__ring-fill');
  if (!fill || fill.dataset.animated) return;
  fill.dataset.animated = '1';
  fill.style.strokeDashoffset = 113.1 * (1 - parseFloat(fill.dataset.pct) / 100);
}

function render() {
  const views = { portal: renderPortal, pdp: renderPDP, checkout: renderCheckout, success: renderSuccess };
  document.getElementById('app').innerHTML = (views[currentPage] || renderPortal)();
  document.getElementById('cartDrawer').innerHTML = renderCartDrawer();
  if (currentPage === 'portal') { countUp(provisionAvailable()); requestAnimationFrame(() => { animateHeroRing(); initRings(); initScrollAnimations(); }); }
  if (currentPage === 'pdp') { requestAnimationFrame(animatePDPRing); }
}

render();
