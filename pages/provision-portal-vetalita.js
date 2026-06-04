/* ═══════════════════════════════════════
   DATI
   ═══════════════════════════════════════ */

const PREMIUMS = [
  {
    id: 3,
    name: 'Viaggio di lusso a Rimini',
    price: 1200.00,
    desc: 'Quattro giorni di pausa sull\'Adriatico: hotel, colazione e lettino da spiaggia inclusi.',
    longDesc: 'Ricaricati dopo un lungo anno di lavoro in clinica sull\'Adriatico. Il pacchetto include 4 notti in hotel 4 stelle con vista mare, buffet colazione giornaliero e lettino da spiaggia riservato. Data di viaggio liberamente scelta (aprile–ottobre). Conferma prenotazione entro 48 ore.',
    image: '../assets/images/Rimini.jpg'
  },
  {
    id: 2,
    name: 'Macchina da caffè deLonghi',
    price: 456.99,
    desc: 'Piacere del caffè professionale per casa — la deLonghi Dedica Style nel design classico.',
    longDesc: 'La deLonghi Dedica Style EC 685 convince con dimensioni compatte e tecnica di estrazione professionale. 15 bar di pressione pompa, sistema di riscaldamento thermoblock e schiumalatte per un cappuccino perfetto — direttamente dalla tua cucina in clinica. Consegna a domicilio entro 3–5 giorni lavorativi.',
    image: '../assets/images/Kaffeemaschine.jpg'
  },
  {
    id: 1,
    name: 'Buono Amazon 400 Euro',
    price: 400.00,
    desc: 'Utilizzabile su tutto l\'assortimento Amazon — dal cibo per animali agli elettrodomestici.',
    longDesc: 'Il tuo buono Amazon da 400 Euro è immediatamente disponibile nel tuo account Amazon dopo il riscatto. Usalo per tutto ciò di cui hai bisogno — senza scadenza e senza restrizioni. Il codice buono ti verrà inviato via e-mail.',
    voucher: { brand: 'amazon', value: '400 €' }
  }
];


/* ═══════════════════════════════════════
   STATO
   ═══════════════════════════════════════ */

let provisionTotal = 485.00;
let cart = [];
let currentPage = 'portal';
let activePremiumId = null;
let lastOrder = null;

/* ═══════════════════════════════════════
   FUNZIONI DI UTILITÀ
   ═══════════════════════════════════════ */

function cartTotal() {
  return cart.reduce((sum, id) => sum + PREMIUMS.find(p => p.id === id).price, 0);
}

function provisionAvailable() {
  return provisionTotal - cartTotal();
}

function fmt(n) {
  return n.toFixed(2).replace('.', ',') + ' €';
}

function tilePct(p) {
  if (cart.includes(p.id)) return 100;
  return Math.min(100, Math.floor(provisionAvailable() / p.price * 100));
}

function canAfford(p) {
  return provisionAvailable() >= p.price;
}

/* ═══════════════════════════════════════
   CARRELLO
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
   NAVIGAZIONE
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

function openAuszahlungModal() {
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
   RENDER: PORTALE
   ═══════════════════════════════════════ */

function renderTile(p) {
  const pct = tilePct(p);
  const inCart = cart.includes(p.id);
  const affordable = canAfford(p);

  let cartOverlay = '';
  let floatingMeta = '';

  if (inCart) {
    cartOverlay = `<div class="tile__cart"><button class="btn --secondary --full" onclick="event.stopPropagation(); removeFromCart(${p.id})">Rimuovi</button></div>`;
  } else if (affordable) {
    floatingMeta = `<div class="floating-meta"><div class="badge --sale">Riscattabile</div></div>`;
    cartOverlay = `<div class="tile__cart"><button class="btn --secondary --full" onclick="event.stopPropagation(); addToCart(${p.id})">Aggiungi al carrello</button></div>`;
  } else {
    const missing = p.price - provisionAvailable();
    floatingMeta = `<div class="floating-meta"><div class="badge --dark">Ancora ${fmt(missing)}</div></div>`;
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
    ? `Ancora <strong>${fmt(target.price - available)}</strong> per<br><a href="#" onclick="openPDP(${target.id});return false;"><em>${target.name}</em></a>`
    : `Tutti i premi riscattabili`;

  const pctInt = Math.round(pct * 100);

  return `
    <section class="provision-hero">
      <div class="provision-hero__grid">
        <div class="provision-hero__col --label">
          <p class="provision-hero__title">La tua provvigione attuale</p>
        </div>
        <div class="provision-hero__col">
          <p class="provision-hero__mobile-title">La tua provvigione attuale</p>
          <span class="provision-hero__amount" id="provisionAmount">${fmt(available)}</span>
          <button class="btn --primary" onclick="openAuszahlungModal()">Paga subito</button>
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

        <div class="provision-hero__sub --label">sulla base di 5 raccomandazioni</div>
        <div class="provision-hero__sub --oder">oppure</div>
        <div class="provision-hero__sub --hint">${hintText}</div>
      </div>
    </section>

    <div class="page --no-pt portal-section">
      <h2 class="portal-section__title">Riscatta il premio</h2>
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
    actionBtn = `<button class="btn --secondary" onclick="removeFromCart(${p.id}); backToPortal()">Rimuovi dal carrello</button>`;
  } else if (affordable) {
    actionBtn = `<button class="btn --primary" onclick="addToCart(${p.id})">Aggiungi al carrello</button>`;
  } else {
    const missing = p.price - provisionAvailable();
    actionBtn = `<button class="btn --primary" disabled>Ancora ${fmt(missing)} mancanti</button>`;
  }

  const pct = tilePct(p);
  let pdpBadge = '';
  if (!inCart && affordable) pdpBadge = `<div class="floating-meta"><div class="badge --sale">Riscattabile</div></div>`;
  else if (!inCart) pdpBadge = `<div class="floating-meta"><div class="badge --dark">Ancora ${fmt(p.price - provisionAvailable())}</div></div>`;
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
      <button class="btn --ghost --back --sm portal-back-btn" onclick="backToPortal()">Tutti i premi</button>
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
            <span class="label-caps">Valore provvigione</span>
          </div>
          <div class="pdp__actions">
            ${actionBtn}
          </div>
          <div class="accordion">
            <div class="accordion-item --open">
              <button class="accordion-trigger" type="button" aria-expanded="true" onclick="toggleAccordion(this)">Descrizione<span class="accordion-icon material-icons">expand_more</span></button>
              <div class="accordion-content"><div class="accordion-content__inner"><p>${p.longDesc}</p></div></div>
            </div>
            <div class="accordion-item">
              <button class="accordion-trigger" type="button" aria-expanded="false" onclick="toggleAccordion(this)">Come funziona?<span class="accordion-icon material-icons">expand_more</span></button>
              <div class="accordion-content"><div class="accordion-content__inner"><p>Il valore del premio viene detratto dalla tua provvigione disponibile. Attualmente hai <strong>${fmt(provisionAvailable())}</strong> disponibili.</p></div></div>
            </div>
            <div class="accordion-item">
              <button class="accordion-trigger" type="button" aria-expanded="false" onclick="toggleAccordion(this)">Spedizione &amp; consegna<span class="accordion-icon material-icons">expand_more</span></button>
              <div class="accordion-content"><div class="accordion-content__inner"><p>Il premio verrà inviato entro 5–7 giorni lavorativi dal riscatto all'indirizzo registrato.</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

/* ═══════════════════════════════════════
   RENDER: CASSETTO CARRELLO
   ═══════════════════════════════════════ */

function renderCartDrawer() {
  if (cart.length === 0) {
    return `
      <div class="cart-drawer__header">
        <h2 class="cart-drawer__title">Carrello premi</h2>
        <button class="btn --icon" onclick="closeCart()" aria-label="Chiudi">
          <span class="material-icons">close</span>
        </button>
      </div>
      <div class="cart-drawer__empty">
        <div class="empty-state">
          <span class="material-icons">redeem</span>
          <p class="empty-state__title">Nessun premio selezionato</p>
          <p class="empty-state__sub">Scegli un premio e riscatta la tua provvigione.</p>
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
              <div class="cart-item__variant">Premio</div>
            </div>
            <button type="button" class="btn --icon cart-item__remove" onclick="removeFromCart(${id})" aria-label="Rimuovi">
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
      <h2 class="cart-drawer__title">Carrello premi <span class="cart-drawer__count">(${cart.length})</span></h2>
      <button class="btn --icon" onclick="closeCart()" aria-label="Chiudi">
        <span class="material-icons">close</span>
      </button>
    </div>
    <div class="cart-drawer__items">${items}</div>
    <div class="cart-drawer__footer">
      <div class="summary-total">
        <span>Totale</span>
        <span>${fmt(total)}</span>
      </div>
      <div class="cart-drawer__tax">
        Provvigione rimanente dopo il riscatto: ${fmt(remaining)}
      </div>
      <button class="btn --primary cart-drawer__checkout" onclick="goToCheckout()">Riscatta premio</button>
      <div class="cart-drawer__continue-wrap">
        <button class="btn --ghost cart-drawer__continue" onclick="closeCart()">Continua a sfogliare</button>
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
              <div class="cart-item__variant">Premio</div>
            </div>
          </div>
          <div class="cart-item__bottom">
            <div class="cart-item__qty-text">1 pezzo</div>
            <div class="price-stack">${fmt(p.price)}</div>
          </div>
        </div>
      </div>`;
  }).join('');

  const total = cartTotal();
  const remaining = provisionAvailable();

  return `
    <div class="page portal-section">
      <button class="btn --ghost --back --sm portal-back-btn" onclick="backToPortal()">Selezione premi</button>
      <div class="checkout">

        <!-- Colonna sinistra: indirizzo + spedizione -->
        <div>
          <div>
            <h3 class="section-label --sub">Indirizzo di consegna</h3>
            <div class="form-grid">
              <div class="form-field">
                <input type="text" id="co-vorname" placeholder=" " value="Marco">
                <label for="co-vorname">Nome</label>
              </div>
              <div class="form-field">
                <input type="text" id="co-nachname" placeholder=" " value="Rossi">
                <label for="co-nachname">Cognome</label>
              </div>
              <div class="form-field">
                <input type="text" id="co-strasse" placeholder=" " value="Via Roma">
                <label for="co-strasse">Via</label>
              </div>
              <div class="form-field">
                <input type="text" id="co-hausnr" placeholder=" " value="12">
                <label for="co-hausnr">N.</label>
              </div>
              <div class="form-field">
                <input type="text" id="co-plz" placeholder=" " value="20121">
                <label for="co-plz">CAP</label>
              </div>
              <div class="form-field">
                <input type="text" id="co-ort" placeholder=" " value="Milano">
                <label for="co-ort">Città</label>
              </div>
              <div class="form-field --span-2">
                <input type="email" id="co-email" placeholder=" " value="m.rossi@clinicaveterinaria-rossi.it">
                <label for="co-email">Indirizzo e-mail</label>
              </div>
              <div class="form-field --span-2">
                <input type="tel" id="co-tel" placeholder=" " value="+39 02 123456">
                <label for="co-tel">Telefono (opzionale)</label>
              </div>
            </div>
          </div>

          <div>
            <h3 class="section-label --sub">Metodo di spedizione</h3>
            <div class="tile-grid --compact">
              <button class="choice-box --block --active" type="button" onclick="setCheckoutOption(this)">
                <span class="material-icons">local_shipping</span>
                <span><strong>Spedizione standard</strong> — GLS · 3–5 giorni lavorativi · <strong>gratuita</strong></span>
              </button>
              <button class="choice-box --block" type="button" onclick="setCheckoutOption(this)">
                <span class="material-icons">rocket_launch</span>
                <span><strong>Spedizione express</strong> — GLS Express · 1–2 giorni lavorativi · <strong>4,99 €</strong></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Colonna destra: riepilogo ordine -->
        <aside class="checkout__sidebar">
          <h3 class="section-label --sub">Riepilogo ordine</h3>
          ${items}
          <div class="summary-line"><span>Valore provvigione</span><span>${fmt(total)}</span></div>
          <div class="summary-line"><span>Spedizione</span><span>gratuita</span></div>
          <div class="summary-total"><span>Provvigione rimanente</span><span>${fmt(remaining)}</span></div>
          <div class="checkout__cta">
            <button class="btn --primary --full" type="button" onclick="completeCheckout()">Riscatta premio</button>
          </div>
        </aside>

      </div>
    </div>`;
}

/* ═══════════════════════════════════════
   RENDER: SUCCESSO
   ═══════════════════════════════════════ */

function renderSuccess() {
  if (lastOrder.payout) {
    return `
      <div class="page --narrow portal-section">
        <div class="success-state">
          <span class="success-state__icon material-icons">check_circle</span>
          <h1 class="success-state__title">Pagamento richiesto!</h1>
          <p class="success-state__body"><strong>${fmt(lastOrder.total)}</strong> saranno accreditati entro 3–5 giorni lavorativi sul tuo conto registrato.</p>
        </div>
        <div class="success-state__actions">
          <button class="btn --primary" onclick="backToPortal()">Torna alla panoramica</button>
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
            <div class="cart-item__variant">Premio</div>
          </div>
        </div>
        <div class="cart-item__bottom">
          <div class="cart-item__qty-text">1 pezzo</div>
          <div class="price-stack">${fmt(p.price)}</div>
        </div>
      </div>
    </div>`).join('');

  return `
    <div class="page --narrow portal-section">
      <div class="success-state">
        <span class="success-state__icon material-icons">check_circle</span>
        <h1 class="success-state__title">Il tuo premio è in arrivo!</h1>
        <p class="success-state__body">Hai riscattato con successo <strong>${fmt(lastOrder.total)}</strong> di provvigione. Una conferma verrà inviata al tuo indirizzo e-mail registrato.</p>
      </div>
      <div class="portal-success__items">
        ${items}
        <div class="summary-line"><span>Provvigione riscattata</span><span>${fmt(lastOrder.total)}</span></div>
        <div class="summary-total"><span>Provvigione rimanente</span><span>${fmt(lastOrder.remaining)}</span></div>
      </div>
      <div class="success-state__actions">
        <button class="btn --primary" onclick="backToPortal()">Torna alla panoramica</button>
      </div>
    </div>`;
}

/* ═══════════════════════════════════════
   RENDER PRINCIPALE
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
