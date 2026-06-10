/* ════════════════════════════════════════════
   BILD-KONSTANTEN
   ════════════════════════════════════════════ */
const HERO_IMG = '../assets/images/Hero_Mood_03.jpg';

const CALMIN_1 = '../assets/images/Calmin_Packshot_01.jpeg';
const CALMIN_2 = '../assets/images/Calmin_Packshot_02.png';
const CALMIN_3 = '../assets/images/Calmin_Packshot_03.png';
const HEPAX_1  = '../assets/images/Hepax_Packshot_01.jpeg';
const HEPAX_2  = '../assets/images/Hepax_Packshot_02.png';

/* ════════════════════════════════════════════
   PRODUKTDATEN — 3 kanonische Produkte
   familie:true  → Produktfamilie mit darreichungsformen[]
   familie:false → Einzelprodukt mit variants[]
   ════════════════════════════════════════════ */
const PRODUCTS = [
  {
    id: 1, name: 'Calmin balance', familie: true, cat: 'beruhigung', catLabel: 'Beruhigung',
    img: CALMIN_1, imgHover: CALMIN_2, imgDetail: CALMIN_3, rating: '4,8', approved: true,
    shortDesc: 'Für Entspannung und innere Balance.',
    desc: 'Unterstützt die natürliche Ausgeglichenheit von Hunden und Katzen. Schonend gewonnen, tierärztlich entwickelt und geprüft.',
    ingredients: 'Passionsblumenextrakt, Baldrian, L-Tryptophan, Vitamin B1. Ohne künstliche Zusatzstoffe.',
    darreichungsformen: [
      { label: 'Tabletten', cartName: 'Calmin balance Tabletten', animals: 'Hund, Katze',
        variants: [{ label: '60 Stück', price: '39,90 €' }, { label: '90 Stück', price: '54,90 €' }] },
      { label: 'Pulver',    cartName: 'Calmin balance Pulver',    animals: 'Hund, Katze', note: 'für Allergiker geeignet',
        variants: [{ label: '30 g',    price: '29,90 €' }, { label: '60 g',    price: '49,90 €' }] },
    ],
  },
  {
    id: 2, name: 'Hepax forte', familie: true, cat: 'leber', catLabel: 'Leber',
    img: HEPAX_1, imgHover: HEPAX_2, rating: '4,6', approved: true,
    shortDesc: 'Unterstützt die Leberfunktion.',
    desc: 'Spezialformel zur Unterstützung der Leberfunktion bei Hunden und Katzen. Mit natürlichen Pflanzenextrakten, tierärztlich entwickelt.',
    ingredients: 'Mariendistel-Extrakt (Silymarin), Artischockenextrakt, Taurin, Zink. Frei von Getreide und Soja.',
    darreichungsformen: [
      { label: 'Tabletten', cartName: 'Hepax forte Tabletten', animals: 'Hund',
        variants: [{ label: '30 Stück', price: '34,90 €' }, { label: '60 Stück', price: '64,90 €' }] },
      { label: 'Pulver',    cartName: 'Hepax forte Pulver',    animals: 'Katze, Hund', note: 'für Allergiker geeignet',
        variants: [{ label: '75 g',    price: '39,90 €' }, { label: '175 g',   price: '84,90 €' }] },
    ],
  },
  {
    id: 3, name: 'Inzym Pulver', familie: false, cat: 'bauchspeichel', catLabel: 'Bauchspeicheldrüse',
    img: null, imgHover: null, rating: '4,4', approved: false,
    shortDesc: 'Unterstützt die Bauchspeicheldrüse.',
    desc: 'Hochwertige Enzymformel zur Unterstützung der Verdauung bei Erkrankungen der Bauchspeicheldrüse. Für Hunde und Katzen.',
    ingredients: 'Pankreasenzym-Konzentrat (Lipase, Amylase, Protease), Bromelain. Ohne künstliche Konservierungsstoffe.',
    variants: [{ label: '50 g', price: '24,90 €' }, { label: '100 g', price: '44,90 €' }],
  },
];

/* ════════════════════════════════════════════
   STATE
   cartApproved/cartRequested: Array von {id, cartName, variantLabel, price, qty}
   ════════════════════════════════════════════ */
let state         = 'guest';
let page          = 'home';
let activeProduct = PRODUCTS[0];
let cartApproved  = [];
let cartRequested = [];

/* ════════════════════════════════════════════
   HILFSFUNKTIONEN
   ════════════════════════════════════════════ */
const getProduct = id => PRODUCTS.find(p => p.id === id);
const cartTotal  = () => cartApproved.length + cartRequested.length;
let approvedProductIds    = new Set(PRODUCTS.filter(p => p.approved).map(p => p.id));
let approvedVariantByProduct = new Map(PRODUCTS.filter(p => p.approved).map(p => [p.id, { formIndex: 0, variantIndex: 0, maxQty: 2 }]));
const isApproved = p => state === 'with-release' && approvedProductIds.has(p.id);
const isApprovedVariant = (p, formIndex, variantIndex) => {
  if (!isApproved(p)) return false;
  const av = approvedVariantByProduct.get(p.id);
  return av && av.formIndex === formIndex && av.variantIndex === variantIndex;
};

function productStartPrice(p) {
  return p.familie ? p.darreichungsformen[0].variants[0].price : p.variants[0].price;
}

function ratingStarsHTML(ratingStr) {
  const val = parseFloat((ratingStr || '0').replace(',', '.'));
  const full = Math.round(val);
  return Array.from({ length: 5 }, (_, i) =>
    i < full
      ? `<span class="material-icons" aria-hidden="true">star</span>`
      : `<span class="material-icons --empty" aria-hidden="true">star_border</span>`
  ).join('');
}

function updateCartBadge() {
  const badge = document.getElementById('cartCount');
  const n = cartTotal();
  badge.style.display = n > 0 ? 'flex' : 'none';
  badge.textContent   = n;
}

/* Pending approved IDs — zwischengespeichert bis Popup bestätigt wird */
let _pendingApprovedIds = [];

/* Toast (C.9) */
function showToast(msg, type = '') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icon = type === 'success' ? 'check_circle' : type === 'error' ? 'error_outline' : 'info';
  const el = document.createElement('div');
  el.className = 'toast' + (type ? ' --' + type : '');
  el.innerHTML = `<span class="material-icons">${icon}</span><span>${msg}</span>`;
  container.appendChild(el);
  setTimeout(() => { el.classList.add('--out'); setTimeout(() => el.remove(), 300); }, 3000);
}

/* Menge im Warenkorb-Drawer ändern */
function changeCartQty(cartName, variantLabel, type, delta) {
  const arr  = type === 'approved' ? cartApproved : cartRequested;
  const item = arr.find(x => x.cartName === cartName && x.variantLabel === variantLabel);
  if (!item) return;
  if (delta > 0 && type === 'approved') {
    const av     = approvedVariantByProduct.get(item.id);
    const maxQty = av ? av.maxQty : 99;
    if (item.qty >= maxQty) {
      showToast(`Dein Tierarzt hat max. ${maxQty} Packung${maxQty !== 1 ? 'en' : ''} freigegeben.`, 'info');
      return;
    }
  }
  item.qty = Math.max(1, item.qty + delta);
  renderCartDrawer();
}

/* Menge im Options-Drawer ändern */
function optionsQtyChange(delta) {
  const inp     = document.getElementById('optionsQty');
  const p       = getProduct(optionsState.productId);
  const approved = isApprovedVariant(p, optionsState.formIndex, optionsState.variantIndex);
  const maxQty  = approved ? (approvedVariantByProduct.get(p.id)?.maxQty ?? 99) : 99;
  const newVal  = Math.max(1, +inp.value + delta);
  if (delta > 0 && newVal > maxQty) {
    showToast(`Dein Tierarzt hat max. ${maxQty} Packung${maxQty !== 1 ? 'en' : ''} freigegeben.`, 'info');
    return;
  }
  inp.value = newVal;
}

function addToCart(item, type) {
  const arr    = type === 'approved' ? cartApproved : cartRequested;
  const maxQty = type === 'approved' ? (approvedVariantByProduct.get(item.id)?.maxQty ?? 99) : 99;

  const existing = arr.find(x => x.cartName === item.cartName && x.variantLabel === item.variantLabel);
  if (existing) {
    const combined = existing.qty + item.qty;
    if (type === 'approved' && combined > maxQty) {
      existing.qty = maxQty;
      showToast(`Dein Tierarzt hat max. ${maxQty} Packung${maxQty !== 1 ? 'en' : ''} freigegeben.`, 'info');
    } else {
      existing.qty = combined;
    }
  } else {
    arr.push({ ...item, qty: type === 'approved' ? Math.min(item.qty, maxQty) : item.qty });
  }
  updateCartBadge();
  if (document.getElementById('cartDrawer').classList.contains('--open')) renderCartDrawer();
}

/* ════════════════════════════════════════════
   FREIGABE-WILLKOMMEN POPUP
   ════════════════════════════════════════════ */
const VET_NAME = 'Dr. Müller'; // Mockup-Platzhalter für Tierarzt-Name

function showReleaseWelcome() {
  const items = cartApproved.map(item =>
    `<li style="display:flex;justify-content:space-between;align-items:baseline;
                padding:calc(var(--base)*0.35) 0;border-bottom:1px solid var(--border-light);">
       <span style="font-weight:700;color:var(--fg);">${item.cartName}</span>
       <span style="color:var(--fg-muted);font-size:var(--text-sm);white-space:nowrap;margin-left:0.5rem;">
         ${item.variantLabel} · ${item.qty}×
       </span>
     </li>`
  ).join('');

  document.getElementById('releaseWelcomeTitle').textContent = `Freigabe von ${VET_NAME}`;
  document.getElementById('releaseWelcomeBody').innerHTML =
    `<p style="margin-bottom:var(--half-module);">Dein Tierarzt hat folgende Produkte für dich freigegeben – wir haben sie bereits in den Warenkorb gelegt:</p>
     <ul style="list-style:none;margin:0 0 var(--half-module);padding:0;">${items}</ul>`;
  document.getElementById('releaseWelcomeOverlay').classList.add('--open');
}

function closeReleaseWelcome(goToCart) {
  document.getElementById('releaseWelcomeOverlay').classList.remove('--open');
  if (goToCart) openCart();
}

function removeFromCart(cartName, variantLabel) {
  cartApproved  = cartApproved.filter(x => !(x.cartName === cartName && x.variantLabel === variantLabel));
  cartRequested = cartRequested.filter(x => !(x.cartName === cartName && x.variantLabel === variantLabel));
  updateCartBadge();
  if (document.getElementById('cartDrawer').classList.contains('--open')) renderCartDrawer();
}

function calcTotal(items) {
  return items.reduce((s, item) => s + item.price * item.qty, 0);
}


/* ════════════════════════════════════════════
   UI-HELFER
   ════════════════════════════════════════════ */
function toggleMockupBar() {
  const bar    = document.getElementById('mockupBar');
  const revive = document.getElementById('mockupRevive');
  const hide   = !bar.classList.contains('--hidden');
  bar.classList.toggle('--hidden', hide);
  revive.classList.toggle('--visible', hide);
  document.body.classList.toggle('--mockup-bar-visible', !hide);
}

function pdpSetImg(thumb, src) {
  document.getElementById('pdpMainImg').src = src;
  document.querySelectorAll('.pdp__thumb').forEach(t => t.classList.remove('--active'));
  thumb.classList.add('--active');
}

function toggleAccordion(btn) {
  const item    = btn.closest('.accordion-item');
  const content = item.querySelector('.accordion-content');
  const isOpen  = item.classList.contains('--open');
  item.classList.toggle('--open', !isOpen);
  btn.setAttribute('aria-expanded', String(!isOpen));
}

// ── Tierarzt-Daten ──────────────────────────────────────────────────────────
const VETS = [
  { id:1, name:'Kleintierpraxis am See',          doctor:'Dr. Thomas Berger',            city:'Hamburg',    hasRecommended:true  },
  { id:2, name:'Praxis für Kleintiere',           doctor:'Dr. Andreas Weber',            city:'Frankfurt',  hasRecommended:false },
  { id:3, name:'Tierärztliches Zentrum Mitte',    doctor:'Dr. Sarah Koch',               city:'Berlin',     hasRecommended:true  },
  { id:4, name:'Tierarztpraxis Grüntal',          doctor:'Dr. med. vet. Martina Müller', city:'München',    hasRecommended:true  },
  { id:5, name:'Tierarztpraxis Sonnenhügel',      doctor:'Dr. Lisa Braun',               city:'Stuttgart',  hasRecommended:false },
  { id:6, name:'Tiermedizinisches Zentrum Nord',  doctor:'Dr. Klaus Hoffmann',           city:'Dortmund',   hasRecommended:false },
];
let selectedVet    = null;
let approvedByVet  = null; // Praxis, die zuletzt Produkte freigegeben hat
let cartDrawerStep = 1;

/* ════════════════════════════════════════════
   WARENKORB-DRAWER
   ════════════════════════════════════════════ */
function openCart() {
  cartDrawerStep = 1;
  renderCartDrawer();
  document.getElementById('cartOverlay').classList.add('--open');
  document.getElementById('cartDrawer').classList.add('--open');
}

function closeCart() {
  document.getElementById('cartOverlay').classList.remove('--open');
  document.getElementById('cartDrawer').classList.remove('--open');
}

/* ════════════════════════════════════════════
   OPTIONS-DRAWER (Varianten wählen)
   optionsState hält den aktuellen Auswahl-Stand
   ════════════════════════════════════════════ */
const optionsState = { productId: null, formIndex: 0, variantIndex: 0 };

/* ── Login-Modal ── */
let loginTargetState    = 'no-release';
let loginAfterCallback  = null;

function openLoginModal(tab, targetState) {
  loginTargetState = targetState || 'no-release';
  switchLoginTab(tab || 'login');

  // Wenn aus dem Warenkorb-Flow: CTA durch Simulation-Auswahl ersetzen
  document.getElementById('loginOverlay').classList.add('--open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('login-email')?.focus(), 320);
}

function closeLoginModal() {
  document.getElementById('loginOverlay').classList.remove('--open');
  document.body.style.overflow = '';
}

function handleLoginOverlayClick(e) {
  if (e.target === document.getElementById('loginOverlay')) closeLoginModal();
}

function switchLoginTab(tab) {
  document.querySelectorAll('.login-tab').forEach(t =>
    t.classList.toggle('--active', t.dataset.tab === tab));
  document.getElementById('loginPanel').classList.toggle('--hidden',    tab !== 'login');
  document.getElementById('registerPanel').classList.toggle('--hidden', tab !== 'register');
}

let _loginPending = null;

function simulateLogin() {
  closeLoginModal();
  _loginPending = {
    savedRequested: [...cartRequested],
    savedApproved:  [...cartApproved],
    callback:       loginAfterCallback,
    targetState:    loginTargetState
  };
  loginAfterCallback = null;
  openLoginResultPopup();
}

function loginPopupVariantHTML(p) {
  const qtyInput = `<input id="loginVariant_qty_${p.id}" type="number" value="2" min="1" max="99"
    class="mockup-qty-input" title="Max. freigegebene Menge">`;
  if (!p.familie) {
    const av = approvedVariantByProduct.get(p.id);
    return `<div id="loginVariant_${p.id}" class="mockup-variant-row">
      <select id="loginVariant_size_${p.id}" class="mockup-select">
        ${p.variants.map((v, i) => `<option value="${i}"${av && av.variantIndex === i ? ' selected' : ''}>${v.label}</option>`).join('')}
      </select>
      <span class="mockup-variant-sep">×</span>
      ${qtyInput}
    </div>`;
  }
  const av = approvedVariantByProduct.get(p.id);
  const initFormIdx = av ? av.formIndex : 0;
  const initSizeIdx = av ? av.variantIndex : 0;
  const formOptions = p.darreichungsformen.map((f, i) => `<option value="${i}"${i === initFormIdx ? ' selected' : ''}>${f.label}</option>`).join('');
  const sizeOptions = p.darreichungsformen[initFormIdx].variants.map((v, i) => `<option value="${i}"${i === initSizeIdx ? ' selected' : ''}>${v.label}</option>`).join('');
  return `<div id="loginVariant_${p.id}" class="mockup-variant-row">
    <select id="loginVariant_form_${p.id}" class="mockup-select" onchange="updateLoginSizeSelect(${p.id})">
      ${formOptions}
    </select>
    <select id="loginVariant_size_${p.id}" class="mockup-select">
      ${sizeOptions}
    </select>
    <span class="mockup-variant-sep">×</span>
    ${qtyInput}
  </div>`;
}

function updateLoginSizeSelect(productId) {
  const p = getProduct(productId);
  const formSel = document.getElementById(`loginVariant_form_${productId}`);
  const sizeSel = document.getElementById(`loginVariant_size_${productId}`);
  if (!formSel || !sizeSel || !p.familie) return;
  const formIndex = +formSel.value;
  sizeSel.innerHTML = p.darreichungsformen[formIndex].variants.map((v, i) =>
    `<option value="${i}">${v.label}</option>`).join('');
}

function toggleLoginVariant(productId) {
  const el = document.getElementById(`loginVariantWrap_${productId}`);
  const cb = document.querySelector(`#loginResultBody input[data-product-id="${productId}"]`);
  if (el) el.style.display = cb && cb.checked ? '' : 'none';
}

function openLoginResultPopup() {
  const rows = PRODUCTS.map(p => {
    const preChecked = approvedProductIds.has(p.id) ? 'checked' : '';
    return `
      <label class="mockup-check-row">
        <input type="checkbox" data-product-id="${p.id}" ${preChecked}
          onchange="toggleLoginVariant(${p.id})">
        <span>${p.name}</span>
      </label>
      <div id="loginVariantWrap_${p.id}" style="${preChecked ? '' : 'display:none'}">${loginPopupVariantHTML(p)}</div>`;
  }).join('');

  document.getElementById('loginResultBody').innerHTML = `
    <div class="mockup-modal__note">
      <span class="material-icons">info</span>
      <span>Simuliert die Backend-Antwort nach Login — welche Freigaben liegen für diesen Kunden vor?</span>
    </div>
    <p class="mockup-modal__desc">Freigaben für diesen Kunden:</p>
    <div class="mockup-product-list">${rows}</div>
    <div class="mockup-modal__footer">
      <button class="mockup-btn" onclick="applyLoginResult(
        [...document.querySelectorAll('#loginResultBody input[type=checkbox]:checked')].map(el => +el.dataset.productId)
      )">Weiter →</button>
    </div>`;

  document.getElementById('loginResultOverlay').classList.add('--open');
}

function applyLoginResult(approvedIds) {
  document.getElementById('loginResultOverlay').classList.remove('--open');
  if (!_loginPending) return;
  const { savedRequested, savedApproved, callback, targetState } = _loginPending;
  _loginPending = null;

  approvedProductIds = new Set(approvedIds);
  approvedVariantByProduct = new Map();
  approvedIds.forEach(id => {
    const formSel = document.getElementById(`loginVariant_form_${id}`);
    const sizeSel = document.getElementById(`loginVariant_size_${id}`);
    const qtySel = document.getElementById(`loginVariant_qty_${id}`);
    approvedVariantByProduct.set(id, {
      formIndex:    formSel ? +formSel.value : 0,
      variantIndex: sizeSel ? +sizeSel.value : 0,
      maxQty:       qtySel  ? Math.max(1, parseInt(qtySel.value, 10) || 1) : 1
    });
  });

  const newState = approvedIds.length > 0 ? 'with-release' : 'no-release';
  if (approvedIds.length > 0) approvedByVet = VETS.find(v => v.hasRecommended) || VETS[0];
  setState(newState, document.querySelector(`[data-state="${newState}"]`), true);

  savedRequested.forEach(item => {
    addToCart(item, approvedIds.includes(item.id) ? 'approved' : 'requested');
  });
  savedApproved.forEach(item => addToCart(item, 'approved'));

  // Freigegebene Produkte mit der konfigurierten Menge in den Cart legen
  approvedIds.forEach(id => {
    const p  = getProduct(id);
    if (!p) return;
    const av       = approvedVariantByProduct.get(id);
    const df       = p.familie ? p.darreichungsformen[av.formIndex] : null;
    const v        = p.familie ? df.variants[av.variantIndex] : p.variants[av.variantIndex];
    const cartName = p.familie ? df.cartName : p.name;
    const price    = parseFloat(v.price.replace(',', '.').replace(' €', ''));
    if (!cartApproved.find(x => x.cartName === cartName && x.variantLabel === v.label)) {
      cartApproved.push({ id: p.id, cartName, variantLabel: v.label, price, qty: av.maxQty });
    }
  });
  updateCartBadge();

  if (approvedIds.length > 0) {
    showReleaseWelcome();
  } else if (callback) {
    if (cartRequested.length > 0) {
      callback();
    } else {
      cartDrawerStep = 1;
      renderCartDrawer();
    }
  }
}

function proceedToRequest() {
  if (state === 'guest') {
    loginAfterCallback = () => setCartStep(2);
    openLoginModal('login', 'with-release');
    return;
  }
  setCartStep(2);
}

function openOptions(id) {
  const av = isApproved(getProduct(id)) ? approvedVariantByProduct.get(id) : null;
  optionsState.productId    = id;
  optionsState.formIndex    = av ? av.formIndex    : 0;
  optionsState.variantIndex = av ? av.variantIndex : 0;
  renderOptionsDrawer();
  document.getElementById('optionsOverlay').classList.add('--open');
  document.getElementById('optionsDrawer').classList.add('--open');
}

function closeOptions() {
  document.getElementById('optionsOverlay').classList.remove('--open');
  document.getElementById('optionsDrawer').classList.remove('--open');
}

function selectOptionsForm(index) {
  optionsState.formIndex    = index;
  optionsState.variantIndex = 0;
  renderOptionsDrawer();
}

function selectOptionsVariant(index) {
  optionsState.variantIndex = index;
  const p = getProduct(optionsState.productId);
  const price = p.familie
    ? p.darreichungsformen[optionsState.formIndex].variants[index].price
    : p.variants[index].price;
  const priceEl = document.getElementById('optionsPrice');
  if (priceEl) priceEl.textContent = price;
  document.querySelectorAll('#optionsSizeVariants .choice-box').forEach((btn, i) =>
    btn.classList.toggle('--active', i === index));
  // CTA aktualisieren: nur freigegebene Variante → "In den Warenkorb"
  const approvedNow = isApprovedVariant(p, optionsState.formIndex, index);
  const ctaBtn = document.querySelector('.cart-drawer__checkout');
  if (ctaBtn) {
    ctaBtn.className = `btn ${approvedNow ? '--primary' : '--honey'} cart-drawer__checkout`;
    ctaBtn.textContent = approvedNow ? 'In den Warenkorb' : 'Freigabe-Anfrage in den Korb legen';
  }
}

function renderOptionsDrawer() {
  const p       = getProduct(optionsState.productId);
  const approved = isApprovedVariant(p, optionsState.formIndex, optionsState.variantIndex);

  let currentVariants, currentPrice;
  if (p.familie) {
    const form   = p.darreichungsformen[optionsState.formIndex];
    currentVariants = form.variants;
    currentPrice    = form.variants[optionsState.variantIndex].price;
  } else {
    currentVariants = p.variants;
    currentPrice    = p.variants[optionsState.variantIndex].price;
  }

  const ctaClass = approved ? 'btn --primary' : 'btn --honey';
  const ctaLabel = approved ? 'In den Warenkorb' : 'Freigabe-Anfrage in den Korb legen';

  const thumbHTML  = p.img
    ? `<img src="${p.img}" alt="${p.name}">${p.imgHover ? `<img src="${p.imgHover}" alt="" aria-hidden="true">` : ''}`
    : '';
  const thumbClass = p.img ? 'product-thumb' : 'product-thumb placeholder-bg';

  const av = approved ? approvedVariantByProduct.get(p.id) : null;

  let formSection = '';
  if (p.familie) {
    const formBtns = p.darreichungsformen.map((f, i) => {
      const isApprovedForm = av && av.formIndex === i;
      return `<button class="choice-box${i === optionsState.formIndex ? ' --active' : ''}${isApprovedForm ? ' --approved' : ''}" type="button"
        onclick="selectOptionsForm(${i})">${f.label}${isApprovedForm ? '<span class="circle-badge --check choice-box__check"><span class="material-icons">check</span></span>' : ''}</button>`;
    }).join('');
    formSection = `
    <div class="options-drawer__section">
      <div class="label-caps options-drawer__section-label">Darreichungsform</div>
      <div class="options-variants">${formBtns}</div>
    </div>`;
  }

  const variantBtns = currentVariants.map((v, i) => {
    const isApprovedSize = av && av.formIndex === optionsState.formIndex && av.variantIndex === i;
    return `<button class="choice-box --sm${i === optionsState.variantIndex ? ' --active' : ''}${isApprovedSize ? ' --approved' : ''}" type="button"
      onclick="selectOptionsVariant(${i})">${v.label}${isApprovedSize ? '<span class="circle-badge --check choice-box__check"><span class="material-icons">check</span></span>' : ''}</button>`;
  }).join('');

  document.getElementById('optionsDrawer').innerHTML = `
    <div class="cart-drawer__header">
      <h2 class="cart-drawer__title">Optionen wählen</h2>
      <button class="btn --icon" onclick="closeOptions()" aria-label="Schließen">
        <span class="material-icons">close</span>
      </button>
    </div>
    <div class="options-drawer__items">
      <div class="cart-item options-drawer__product">
        <div class="${thumbClass}">${thumbHTML}</div>
        <div class="cart-item__info">
          <div class="cart-item__top">
            <div>
              <p class="cart-item__name">${p.name}</p>
              <div class="cart-item__variant" id="optionsPrice">${currentPrice}</div>
            </div>
          </div>
        </div>
      </div>
      ${formSection}
      <div class="options-drawer__section">
        <div class="label-caps options-drawer__section-label">Größe</div>
        <div class="options-variants" id="optionsSizeVariants">${variantBtns}</div>
      </div>
      <div class="options-drawer__section">
        <div class="label-caps options-drawer__section-label">Menge</div>
        <div class="qty-selector --sm">
          <button class="qty-selector__btn" type="button" aria-label="Weniger"
            onclick="optionsQtyChange(-1)">
            <span class="material-icons">remove</span>
          </button>
          <input class="qty-selector__input" type="number" value="1" min="1" max="99" id="optionsQty">
          <button class="qty-selector__btn" type="button" aria-label="Mehr"
            onclick="optionsQtyChange(1)">
            <span class="material-icons">add</span>
          </button>
        </div>
      </div>
    </div>
    <div class="cart-drawer__footer">
      <button class="${ctaClass} cart-drawer__checkout" onclick="confirmOptions()">
        ${ctaLabel}
      </button>
      <div class="cart-drawer__continue-wrap">
        <button class="btn --ghost cart-drawer__continue" onclick="closeOptions()">Zurück</button>
      </div>
    </div>`;
}

function confirmOptions() {
  const p        = getProduct(optionsState.productId);
  const approved = isApprovedVariant(p, optionsState.formIndex, optionsState.variantIndex);
  let cartName, variantLabel, priceStr;

  if (p.familie) {
    const form    = p.darreichungsformen[optionsState.formIndex];
    const variant = form.variants[optionsState.variantIndex];
    cartName     = form.cartName;
    variantLabel = variant.label;
    priceStr     = variant.price;
  } else {
    const variant = p.variants[optionsState.variantIndex];
    cartName      = p.name;
    variantLabel  = variant.label;
    priceStr      = variant.price;
  }

  const price  = parseFloat(priceStr.replace(',', '.').replace(' €', ''));
  let   qty    = parseInt(document.getElementById('optionsQty')?.value || '1', 10);
  if (approved) {
    const maxQty = approvedVariantByProduct.get(p.id)?.maxQty ?? 99;
    if (qty > maxQty) {
      qty = maxQty;
      showToast(`Dein Tierarzt hat max. ${maxQty} Packung${maxQty !== 1 ? 'en' : ''} freigegeben.`, 'info');
    }
  }
  addToCart({ id: p.id, cartName, variantLabel, price, qty }, approved ? 'approved' : 'requested');
  closeOptions();
  openCart();
}

/* ════════════════════════════════════════════
   PDP-VARIANTEN-AUSWAHL (direkt auf der Produktseite)
   ════════════════════════════════════════════ */
const pdpState = { formIndex: 0, variantIndex: 0 };

function selectPdpForm(index) {
  pdpState.formIndex    = index;
  pdpState.variantIndex = 0;
  const p    = activeProduct;
  const form = p.darreichungsformen[index];
  const av   = isApproved(p) ? approvedVariantByProduct.get(p.id) : null;
  const sizeEl = document.getElementById('pdpSizeOptions');
  if (sizeEl) sizeEl.innerHTML = form.variants.map((v, i) => {
    const isApprovedSize = av && av.formIndex === index && av.variantIndex === i;
    return `<button class="choice-box${i === 0 ? ' --active' : ''}${isApprovedSize ? ' --approved' : ''}" type="button"
      onclick="selectPdpVariant(${i})">${v.label}${isApprovedSize ? '<span class="circle-badge --check choice-box__check"><span class="material-icons">check</span></span>' : ''}</button>`;
  }).join('');
  const priceEl = document.getElementById('pdpPrice');
  if (priceEl) priceEl.textContent = form.variants[0].price;
  updatePdpQtyMax();
  updatePdpCta();
}

function selectPdpVariant(index) {
  pdpState.variantIndex = index;
  const p = activeProduct;
  const price = p.familie
    ? p.darreichungsformen[pdpState.formIndex].variants[index].price
    : p.variants[index].price;
  document.querySelectorAll('#pdpSizeOptions .choice-box').forEach((b, i) =>
    b.classList.toggle('--active', i === index));
  const priceEl = document.getElementById('pdpPrice');
  if (priceEl) priceEl.textContent = price;
  updatePdpQtyMax();
  updatePdpCta();
}

function updatePdpCta() {
  const p           = activeProduct;
  const approvedNow = isApprovedVariant(p, pdpState.formIndex, pdpState.variantIndex);
  const btn         = document.querySelector('.pdp__actions button[onclick="pdpAddToCart()"]');
  if (!btn) return;
  btn.className  = `btn ${approvedNow ? '--primary' : '--honey'}`;
  btn.textContent = approvedNow ? 'In den Warenkorb' : 'Freigabe-Anfrage in den Korb legen';
}

function pdpMaxQty() {
  const p = activeProduct;
  const approved = isApprovedVariant(p, pdpState.formIndex, pdpState.variantIndex);
  return approved ? (approvedVariantByProduct.get(p.id)?.maxQty ?? 99) : 99;
}

function updatePdpQtyMax() {
  const inp = document.getElementById('pdpQty');
  if (inp) inp.max = pdpMaxQty();
}

function pdpQtyChange(delta) {
  const inp    = document.getElementById('pdpQty');
  const maxQty = pdpMaxQty();
  const newVal = Math.max(1, +inp.value + delta);
  if (delta > 0 && newVal > maxQty) {
    showToast(`Dein Tierarzt hat max. ${maxQty} Packung${maxQty !== 1 ? 'en' : ''} freigegeben.`, 'info');
    return;
  }
  inp.value = newVal;
}

function pdpAddToCart() {
  const p        = activeProduct;
  const approved = isApprovedVariant(p, pdpState.formIndex, pdpState.variantIndex);
  let cartName, variantLabel, priceStr;
  if (p.familie) {
    const form    = p.darreichungsformen[pdpState.formIndex];
    const variant = form.variants[pdpState.variantIndex];
    cartName     = form.cartName;
    variantLabel = variant.label;
    priceStr     = variant.price;
  } else {
    const variant = p.variants[pdpState.variantIndex];
    cartName      = p.name;
    variantLabel  = variant.label;
    priceStr      = variant.price;
  }
  const price  = parseFloat(priceStr.replace(',', '.').replace(' €', ''));
  let   qty    = parseInt(document.getElementById('pdpQty')?.value || '1', 10);
  if (approved) {
    const maxQty = approvedVariantByProduct.get(p.id)?.maxQty ?? 99;
    if (qty > maxQty) {
      qty = maxQty;
      showToast(`Dein Tierarzt hat max. ${maxQty} Packung${maxQty !== 1 ? 'en' : ''} freigegeben.`, 'info');
    }
  }
  addToCart({ id: p.id, cartName, variantLabel, price, qty }, approved ? 'approved' : 'requested');
  openCart();
}

function setCartStep(step) {
  cartDrawerStep = step;
  document.getElementById('cartDrawer').classList.toggle('--request-step', step === 2);
  renderCartDrawer();
}

function vetItemHTML(v) {
  return `<div class="vet-dropdown__item" onclick="selectVet(${v.id})">
    <strong>${v.hasRecommended ? '<span class="vet-recommended-dot">●</span> ' : '<span class="vet-recommended-dot --empty">●</span> '}${v.name}</strong><br>
    <span class="vet-dropdown__meta">${v.doctor} · ${v.city}</span>
  </div>`;
}

function filterVets(query) {
  const dropdown = document.getElementById('vetDropdown');
  const q = (query || '').toLowerCase().trim();
  const matches = q
    ? VETS.filter(v => v.name.toLowerCase().includes(q) || v.doctor.toLowerCase().includes(q) || v.city.toLowerCase().includes(q))
    : VETS;

  let html = matches.map(vetItemHTML).join('');

  // Freie Eingabe anbieten, wenn kein exakter Treffer
  if (q && !matches.find(v => v.name.toLowerCase() === q)) {
    const escaped = query.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    html += `<div class="vet-dropdown__item vet-dropdown__custom" onclick="selectCustomVet('${escaped}')">
      <span class="material-icons vet-dropdown__add-icon">add_circle_outline</span>
      <strong>„${query}" verwenden</strong>
    </div>`;
  }

  if (!html) { dropdown.style.display = 'none'; return; }
  dropdown.innerHTML = html;
  dropdown.style.display = '';
}


function showVetDropdown() {
  // Bei Fokus immer alle Praxen zeigen — unabhängig vom aktuellen Input-Wert
  const dropdown = document.getElementById('vetDropdown');
  dropdown.innerHTML = VETS.map(vetItemHTML).join('');
  dropdown.style.display = '';
}

function updateVetHint() {
  const el = document.getElementById('vetHint');
  if (!el) return;
  if (selectedVet && selectedVet.hasRecommended) {
    el.innerHTML = '<span class="vet-recommended-dot">●</span> Praxis ist bereits im Empfehlungsprogramm – in der Regel schnellere Bearbeitung';
  } else if (selectedVet && selectedVet.custom) {
    el.innerHTML = '<span class="vet-recommended-dot --empty">●</span> Wir werden diese Praxis für Sie kontaktieren. Diese Praxis ist bisher noch nicht im Empfehlungsprogramm von Inuvet. Bitte geben Sie uns noch ein paar Details:';
  } else {
    el.innerHTML = '<span class="vet-recommended-dot --empty">●</span> Praxis noch nicht im Empfehlungsprogramm – in der Regel längere Bearbeitungszeit';
  }
}

function handleVetInputKeydown(e) {
  if (e.key !== 'Enter') return;
  e.preventDefault();
  const val = e.target.value.trim();
  if (!val) return;
  // Exakter Treffer in der Liste → Praxis auswählen
  const match = VETS.find(v => v.name.toLowerCase() === val.toLowerCase());
  if (match) {
    selectVet(match.id);
  } else {
    // Kein Treffer → freie Eingabe bestätigen (wie „Verwenden"-Klick)
    selectCustomVet(val);
  }
}

function selectVet(id) {
  selectedVet = VETS.find(v => v.id === id);
  const input = document.getElementById('vetSearchInput');
  if (input) input.value = selectedVet.name;
  document.getElementById('vetDropdown').style.display = 'none';
  // Zusatzfelder ausblenden (falls vorher freie Eingabe gewählt)
  const extra = document.getElementById('customVetExtra');
  if (extra) extra.style.display = 'none';
  updateVetHint();
}

function selectCustomVet(name) {
  selectedVet = { id: null, name, doctor: '', city: '', hasRecommended: false, custom: true };
  const input = document.getElementById('vetSearchInput');
  if (input) input.value = name;
  document.getElementById('vetDropdown').style.display = 'none';

  updateVetHint();
  // Zusatzfelder für unbekannte Praxis einblenden
  const extra = document.getElementById('customVetExtra');
  if (extra) {
    extra.style.display = '';
    const plzInput = document.getElementById('customVetPlz');
    if (plzInput) setTimeout(() => plzInput.focus(), 80);
  }
}

function submitVetRequest() {
  // Freie Praxis: PLZ + Ort prüfen
  if (selectedVet && selectedVet.custom) {
    const plzField  = document.getElementById('customVetPlz');
    const cityField = document.getElementById('customVetCity');
    const plz  = plzField  ? plzField.value.trim()  : '';
    const city = cityField ? cityField.value.trim() : '';
    let hasError = false;
    if (!plz)  { plzField.closest('.form-field').classList.add('--error');  plzField.focus();  hasError = true; }
    if (!city) { cityField.closest('.form-field').classList.add('--error'); if (!hasError) cityField.focus(); hasError = true; }
    if (hasError) return;
    plzField.closest('.form-field').classList.remove('--error');
    cityField.closest('.form-field').classList.remove('--error');
    selectedVet.city = `${plz} ${city}`;
  }
  setCartStep(3);
}

/* ── E-Mail-Overlay ──────────────────────────────────────────────── */
let emailOverlayData = {};

function openEmailsOverlay(keys) {
  // Alle Nachrichten auf einmal im Panel zeigen
  const count = keys.length;
  document.getElementById('emailPanelCounter').textContent = `${count} Nachrichten ausgelöst`;

  // Body: alle E-Mails untereinander
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
  // Footer freischalten
  const footer = document.getElementById('drawerFooter');
  if (footer) {
    footer.style.opacity = '0';
    footer.style.display = '';
    requestAnimationFrame(() => { footer.style.transition = 'opacity 0.3s'; footer.style.opacity = '1'; });
  }
}

function renderRequestStep() {
  selectedVet = (state === 'with-release' && approvedByVet) ? approvedByVet : null;
  const drawer = document.getElementById('cartDrawer');
  drawer.classList.add('--request-step');
  drawer.innerHTML = `
    <div class="cart-drawer__header">
      <button class="btn --icon" onclick="setCartStep(1)" aria-label="Zurück"><span class="material-icons">arrow_back</span></button>
      <h2 class="cart-drawer__title">Deine Anfragen</h2>
      <button class="btn --icon" onclick="closeCart()" aria-label="Schließen"><span class="material-icons">close</span></button>
    </div>
    <div class="cart-drawer__items">
      <p class="vet-search__intro">An welche Praxis möchtest du deine Freigabe-Anfrage stellen?</p>
      <!-- Vet search field -->
      <div class="vet-search">
        <div class="form-field">
          <input type="text" id="vetSearchInput" autocomplete="off"
            placeholder=" "
            value="${selectedVet ? selectedVet.name + ' – ' + selectedVet.city : ''}"
            oninput="filterVets(this.value)" onfocus="showVetDropdown()" onkeydown="handleVetInputKeydown(event)">
          <label for="vetSearchInput">Tierarztpraxis</label>
        </div>
        <div id="vetDropdown" class="vet-dropdown" style="display:none;"></div>
        <p id="vetHint" class="vet-legend">${
          selectedVet && selectedVet.hasRecommended
            ? '<span class=\'vet-recommended-dot\'>●</span> Praxis ist bereits im Empfehlungsprogramm – in der Regel schnellere Bearbeitung'
            : selectedVet && selectedVet.custom
              ? '<span class=\'vet-recommended-dot --empty\'>●</span> Wir werden diese Praxis für Sie kontaktieren. Diese Praxis ist bisher noch nicht im Empfehlungsprogramm von Inuvet. Bitte geben Sie uns noch ein paar Details:'
              : selectedVet
                ? '<span class=\'vet-recommended-dot --empty\'>●</span> Praxis noch nicht im Empfehlungsprogramm – in der Regel längere Bearbeitungszeit'
                : ''
        }</p>
      </div>
      <!-- Zusatzfelder: nur bei freier Praxis-Eingabe sichtbar -->
      <div id="customVetExtra" style="display:none;">
        <div class="form-grid">
          <div class="form-field">
            <input type="text" id="customVetPlz" placeholder=" " maxlength="5"
              oninput="this.closest('.form-field').classList.remove('--error')">
            <label for="customVetPlz">PLZ *</label>
            <div class="form-field__error">Bitte PLZ angeben</div>
          </div>
          <div class="form-field">
            <input type="text" id="customVetCity" placeholder=" "
              oninput="this.closest('.form-field').classList.remove('--error')">
            <label for="customVetCity">Ort *</label>
            <div class="form-field__error">Bitte Ort angeben</div>
          </div>
        </div>
      </div>
      <!-- Notes -->
      <div class="form-field">
        <textarea id="vetNotes" rows="4" placeholder=""></textarea>
        <label for="vetNotes">Notizen an die Tierarztpraxis (optional)</label>
      </div>
    </div>
    <div class="cart-drawer__footer">
      <button class="btn --honey cart-drawer__checkout" onclick="submitVetRequest()">Weiter</button>
    </div>`;
}

function renderSuccessStep() {
  const hasApproved = cartApproved.length > 0;
  const vetName     = selectedVet ? selectedVet.name : 'der Tierarztpraxis';
  const vetDoctor   = selectedVet ? selectedVet.doctor : '';
  const vetKnown    = selectedVet && selectedVet.hasRecommended;
  const vetEmail    = `praxis@${vetName.toLowerCase().replace(/\s+/g,'-')}.de`;

  const requestedNames = cartRequested.map(item => item.cartName).join(', ');

  // E-Mail-Adresse ist nach Login bekannt — Overlay kann sofort nach Submit ausgelöst werden
  emailOverlayData = {
    owner: {
      tag: 'E-Mail', recipient: 'kunde@email.com',
      subject: 'Neue Anfrage', internal: false,
      body: `
        <p>Anfrage an <strong>${vetName}</strong> erfolgreich versendet.</p>
        <p>Sie erhalten eine Nachricht per E-Mail (kunde@email.com), sobald die Anfrage von Ihrem Tierarzt freigegeben wurde.</p>`
    }
  };

  if (vetKnown) {
    emailOverlayData.vet = {
      tag: 'E-Mail', recipient: vetEmail,
      subject: 'Neue Anfrage von Max Mustermann', internal: false,
      body: `
        <p>Tierbesitzer*in <strong>Max Mustermann</strong> hat eine neue Freigabe-Anfrage gestellt.</p>
        <p>Angefragt: <strong>${requestedNames}</strong></p>
        <p>Diese können Sie hier einsehen und freigeben:<br>
        <a href="Freigabe.html" target="_blank" style="color:var(--green);">→ Zur Anfrage auf inuvet.com</a></p>
        <p class="mockup-email-panel__note">@Birka (Marketing): Hier motivierender Text über Vorteile der Empfehlung einfügen (z.B. Provision, Patientenbindung).</p>`
    };
  } else {
    emailOverlayData.internal = {
      tag: 'Intern', recipient: 'team@inuvet.com',
      subject: 'Dringende Freigabe-Anfrage!', internal: true,
      body: `
        <p>Tierbesitzer*in <strong>Max Mustermann</strong> möchte bei <strong>${vetName}</strong> (${vetDoctor}) eine Freigabe erhalten.</p>
        <p>Angefragt: <strong>${requestedNames}</strong></p>
        <p><strong>Bitte kontaktiere umgehend die Praxis.</strong> Nimm sie in das Empfehlungsprogramm auf und sorge dafür, dass das Rezept für den/die Tierbesitzer*in ausgestellt wird.</p>
        <p class="mockup-email-panel__note">⚠ An diese Praxis darf noch keine E-Mail gesendet werden – sie ist noch nicht im Empfehlungsprogramm.</p>`
    };
  }

  const drawer = document.getElementById('cartDrawer');
  drawer.innerHTML = `
    <div class="cart-drawer__header">
      <h2 class="cart-drawer__title">Anfrage versendet</h2>
      <button class="btn --icon" onclick="closeCart()" aria-label="Schließen"><span class="material-icons">close</span></button>
    </div>
    <div class="cart-drawer__items">
      <div class="success-state">
        <span class="material-icons success-state__icon">check_circle</span>
        <h3 class="success-state__title">Anfrage an <strong>${vetName}</strong> erfolgreich versendet.</h3>
        <p class="success-state__body">
          Sie erhalten eine Nachricht per E-Mail, sobald die Anfrage von Ihrer Tierarztpraxis freigegeben wurde.
        </p>
      </div>
    </div>
    <div class="cart-drawer__footer" id="drawerFooter" style="display:none">
      ${hasApproved ? `<button class="btn --primary cart-drawer__checkout" onclick="closeCart();setPage('checkout')">Weiter zum Checkout</button>` : ''}
      <div class="cart-drawer__continue-wrap">
        <button class="btn --ghost cart-drawer__continue" onclick="closeCart()">Weiter einkaufen</button>
      </div>
    </div>`;

  // Login war Pflicht vor diesem Schritt → E-Mail bekannt → Nachrichten sofort auslösen
  setTimeout(() => openEmailsOverlay(vetKnown ? ['owner', 'vet'] : ['owner', 'internal']), 500);
}

function renderCartDrawer() {
  const hasApproved  = cartApproved.length  > 0;
  const hasRequested = cartRequested.length > 0;
  const drawer       = document.getElementById('cartDrawer');

  if (cartDrawerStep === 2) { renderRequestStep(); return; }
  if (cartDrawerStep === 3) { renderSuccessStep(); return; }

  if (!hasApproved && !hasRequested) {
    drawer.innerHTML = `
      <div class="cart-drawer__header">
        <h2 class="cart-drawer__title">Warenkorb <span class="cart-drawer__count">(0)</span></h2>
        <button class="btn --icon" onclick="closeCart()" aria-label="Schließen"><span class="material-icons">close</span></button>
      </div>
      <div class="cart-drawer__empty">
        <p class="text-muted">Dein Warenkorb ist leer.</p>
      </div>`;
    return;
  }

  let items = '';

  if (hasApproved) {
    items += `<h3 class="section-label">Einzulösende Produkte</h3>`;
    items += cartApproved.map(item => drawerItemHTML(item, 'approved')).join('');
  }
  if (hasRequested) {
    items += `<div class="cart-section--requested">
      <h3 class="section-label">Freizugebende Produkte</h3>
      ${cartRequested.map(item => drawerItemHTML(item, 'requested')).join('')}
    </div>`;
  }

  const totalApproved = calcTotal(cartApproved);

  /* CTA-Label und -Aktion je nach Warenkorb-Inhalt */
  let ctaLabel, ctaFn, ctaClass;
  if (hasRequested && hasApproved) {
    ctaLabel = 'Kaufen & Jetzt Freigabe anfragen';
    ctaFn    = `proceedToRequest()`;
    ctaClass = '--honey';
  } else if (hasRequested) {
    ctaLabel = 'Jetzt Freigabe anfragen';
    ctaFn    = `proceedToRequest()`;
    ctaClass = '--honey';
  } else {
    ctaLabel = 'Zur Kasse';
    ctaFn    = `closeCart();setPage('checkout')`;
    ctaClass = '--primary';
  }

  drawer.innerHTML = `
    <div class="cart-drawer__header">
      <h2 class="cart-drawer__title">Warenkorb <span class="cart-drawer__count">(${cartTotal()})</span></h2>
      <button class="btn --icon" onclick="closeCart()" aria-label="Schließen"><span class="material-icons">close</span></button>
    </div>
    <div class="cart-drawer__items">${items}</div>
    <div class="cart-drawer__footer">
      ${hasApproved ? `
      <div class="summary-total"><span>Gesamt (einzulösend)</span><span>${totalApproved.toFixed(2).replace('.',',')} €</span></div>
      <div class="cart-drawer__tax">inkl. MwSt., zzgl. Versandkosten</div>` : ''}
      <button class="btn ${ctaClass} cart-drawer__checkout" onclick="${ctaFn}">${ctaLabel}</button>
      <div class="cart-drawer__continue-wrap">
        <button class="btn --ghost cart-drawer__continue" onclick="closeCart()">Weiter einkaufen</button>
      </div>
    </div>`;
}

/* Cart-Item im Drawer (mit Mengenauswahl + Entfernen) */
function drawerItemHTML(item, type) {
  const p         = getProduct(item.id);
  const maxQty    = type === 'approved' ? (approvedVariantByProduct.get(item.id)?.maxQty ?? 99) : 99;

  const thumbHTML = p.img
    ? `<img src="${p.img}" alt="${item.cartName}">${p.imgHover ? `<img src="${p.imgHover}" alt="" aria-hidden="true">` : ''}`
    : '';
  const thumbClass = p.img ? 'product-thumb' : 'product-thumb placeholder-bg';
  const eName = item.cartName.replace(/'/g, "\\'");
  const eVar  = item.variantLabel.replace(/'/g, "\\'");
  return `<div class="cart-item">
    <div class="${thumbClass}">${thumbHTML}</div>
    <div class="cart-item__info">
      <div class="cart-item__top">
        <div>
          <p class="cart-item__name">${item.cartName}</p>
          <div class="cart-item__variant">${item.variantLabel} · ${item.price.toFixed(2).replace('.',',')} €</div>
        </div>
        <button type="button" class="btn --icon cart-item__remove" aria-label="Entfernen"
          onclick="removeFromCart('${eName}','${eVar}')">
          <span class="material-icons">close</span>
        </button>
      </div>
      <div class="cart-item__bottom">
        <div class="qty-selector --sm">
          <button class="qty-selector__btn" type="button" aria-label="Weniger"
            onclick="changeCartQty('${eName}','${eVar}','${type}',-1)"><span class="material-icons">remove</span></button>
          <input class="qty-selector__input" type="number" value="${item.qty}" min="1" max="${maxQty}" readonly>
          <button class="qty-selector__btn" type="button" aria-label="Mehr"
            onclick="changeCartQty('${eName}','${eVar}','${type}',1)"><span class="material-icons">add</span></button>
        </div>
        <span class="cart-item__qty-text">${(item.price * item.qty).toFixed(2).replace('.',',')} €</span>
      </div>
    </div>
  </div>`;
}

/* Cart-Item in der Checkout-Übersicht (vereinfacht, kein Remove) */
function checkoutItemHTML(item) {
  const p         = getProduct(item.id);
  const thumbHTML = p.img
    ? `<img src="${p.img}" alt="${item.cartName}">${p.imgHover ? `<img src="${p.imgHover}" alt="" aria-hidden="true">` : ''}`
    : '';
  const thumbClass = p.img ? 'product-thumb' : 'product-thumb placeholder-bg';
  return `<div class="cart-item">
    <div class="${thumbClass}">${thumbHTML}</div>
    <div class="cart-item__info">
      <div class="cart-item__top">
        <div>
          <p class="cart-item__name">${item.cartName}</p>
          <div class="cart-item__variant">${item.variantLabel} · ${item.price.toFixed(2).replace('.',',')} €</div>
        </div>
      </div>
      <div class="cart-item__bottom">
        <span class="cart-item__qty-text">${item.qty} Stück</span>
        <span class="cart-item__qty-text">${(item.price * item.qty).toFixed(2).replace('.',',')} €</span>
      </div>
    </div>
  </div>`;
}

/* ════════════════════════════════════════════
   ZUSTAND & SEITE WECHSELN
   ════════════════════════════════════════════ */
function setState(s, btn, skipApprovedReset = false) {
  state = s;
  if (!skipApprovedReset) {
    approvedProductIds       = new Set(PRODUCTS.filter(p => p.approved).map(p => p.id));
    approvedVariantByProduct = new Map(PRODUCTS.filter(p => p.approved).map(p => [p.id, { formIndex: 0, variantIndex: 0, maxQty: 2 }]));
  }
  cartApproved = []; cartRequested = [];
  updateCartBadge();

  document.querySelectorAll('[data-state]').forEach(b => b.classList.remove('--active'));
  if (btn) btn.classList.add('--active');

  const btnRec = document.getElementById('btnRecommended');
  btnRec.style.display = state === 'with-release' ? '' : 'none';
  if (state !== 'with-release' && page === 'recommended') setPage('collection');

  render();
}

function setPage(p, btn) {
  page = p;
  document.querySelectorAll('#pageNav .mockup-btn').forEach(b => b.classList.remove('--active'));
  if (btn) btn.classList.add('--active');

  const picker    = document.getElementById('productPicker');
  const pickerSep = document.getElementById('productPickerSep');
  if (p === 'product') {
    picker.style.display = pickerSep.style.display = '';
    renderProductPicker();
  } else {
    picker.style.display = pickerSep.style.display = 'none';
  }

  document.getElementById('checkoutModal').classList.remove('--open');
  closeCart();
  window.scrollTo({ top: 0 });
  render();
}

function renderProductPicker() {
  const picker = document.getElementById('productPicker');
  picker.innerHTML = '<span class="mockup-bar__group-label">Produkt:</span>';
  PRODUCTS.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'mockup-btn' + (activeProduct.id === p.id ? ' --active' : '');
    btn.textContent = `${p.name} (${p.catLabel})`;
    btn.onclick = () => {
      activeProduct = p;
      picker.querySelectorAll('.mockup-btn').forEach(b => b.classList.remove('--active'));
      btn.classList.add('--active');
      render();
    };
    picker.appendChild(btn);
  });
}

/* ════════════════════════════════════════════
   NAV
   ════════════════════════════════════════════ */
function renderNav() {
  const navLinks = document.getElementById('navLinks');
  const navRight = document.getElementById('navRight');

  // Desktop-Links (hinter dem Hamburger)
  const hamburger = navLinks.querySelector('.nav-hamburger');
  navLinks.innerHTML = '';
  if (hamburger) navLinks.appendChild(hamburger);

  const addLink = (label, handler) => {
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = label;
    a.onclick = handler;
    navLinks.appendChild(a);
  };

  addLink('Alle Produkte', (e) => { e.preventDefault(); setPage('collection'); });
  if (state === 'with-release') {
    addLink('Empfohlene Produkte', (e) => { e.preventDefault(); setPage('recommended'); });
  }

  const docsLink = document.createElement('a');
  docsLink.href = 'Tierarzt-Empfehlung-Info.html';
  docsLink.textContent = 'Dokumentation';
  navLinks.appendChild(docsLink);

  // Mobile-Menu synchronisieren
  const mobileRec = document.getElementById('mobileRecommended');
  if (mobileRec) mobileRec.style.display = state === 'with-release' ? '' : 'none';

  navRight.innerHTML = '';

  // Cart immer als Cart — Login-Link für Gäste in navRight
  const cartBtn = document.getElementById('cartBtn');
  cartBtn.setAttribute('aria-label', 'Warenkorb öffnen');
  cartBtn.setAttribute('onclick', 'openCart()');
  cartBtn.querySelector('.material-icons').textContent = 'shopping_cart';

  if (state === 'guest') {
    const loginBtn = document.createElement('button');
    loginBtn.className = 'btn --icon';
    loginBtn.setAttribute('aria-label', 'Einloggen');
    loginBtn.innerHTML = '<span class="material-icons">person_outline</span>';
    loginBtn.onclick = () => openLoginModal('login', 'no-release');
    navRight.appendChild(loginBtn);
  }
}

/* ════════════════════════════════════════════
   NEWSLETTER (geteilt, alle Seiten)
   ════════════════════════════════════════════ */
/* ════════════════════════════════════════════
   TESTIMONIAL-SLIDER
   ════════════════════════════════════════════ */
const TESTIMONIALS = [
  { text: 'Nach der Empfehlung meines Tierarztes haben wir Calmin balance ausprobiert — mein ängstlicher Beagle ist eine andere Seele geworden.', name: 'Anna W.',    role: 'Beagle-Mama, Frankfurt',    img: '../assets/images/Partner_Krause_Erl_Thumbnail.jpg' },
  { text: 'Super Service und top Beratung. Meine Tierärztin arbeitet seit Jahren mit Inuvet und ich merke den Unterschied jeden Tag.',             name: 'Sandra M.', role: 'Hundemama, München',        img: '../assets/images/Tierhalter_Test_Thumbnail.jpg' },
  { text: 'Gut verträglich, transparente Inhaltsstoffe — ich empfehle Inuvet-Produkte regelmäßig in meiner Praxis.',                              name: 'Julia R.',  role: 'Tierliebhaberin, Berlin',   img: '../assets/images/Partner_Mia_01.png' },
  { text: 'Meine Katze hat nach zwei Wochen deutlich besser geschlafen. Ohne die Empfehlung unseres Tierarztes hätte ich es nicht gekauft.', name: 'Petra K.', role: 'Katzenbesitzerin, Hamburg', img: null },
];

function testimonialSlideHTML(t) {
  return `
    <div class="testimonial-slider__slide testimonial">
      <div class="testimonial__quote-mark"><span class="material-icons">format_quote</span></div>
      <p class="testimonial__text">${t.text}</p>
      <div class="rating">
        <span class="material-icons" aria-hidden="true">star</span><span class="material-icons" aria-hidden="true">star</span><span class="material-icons" aria-hidden="true">star</span><span class="material-icons" aria-hidden="true">star</span><span class="material-icons" aria-hidden="true">star</span>
      </div>
      <div class="testimonial__author">
        <div class="testimonial__avatar icon-box${t.img ? '' : ' placeholder-bg'}">${t.img ? `<img src="${t.img}" alt="${t.name}">` : ''}</div>
        <div><p class="testimonial__name">${t.name}</p><div class="testimonial__role">${t.role}</div></div>
      </div>
    </div>`;
}

function testimonialSectionHTML(extraClass = '') {
  return `
    <div class="page">
      <div class="testimonial-slider --cols-4${extraClass ? ' ' + extraClass : ''}" id="tSlider${Math.random().toString(36).slice(2,7)}">
        <div class="testimonial-slider__track">
          ${TESTIMONIALS.map(testimonialSlideHTML).join('')}
        </div>
        <div class="slider-nav">
          <button class="slider-btn icon-box" type="button" aria-label="Zurück" data-dir="prev" disabled><span class="material-icons">arrow_back</span></button>
          <span class="slider-counter"></span>
          <button class="slider-btn icon-box" type="button" aria-label="Weiter" data-dir="next"><span class="material-icons">arrow_forward</span></button>
        </div>
      </div>
      <div class="testimonial-more"><button class="btn --secondary" type="button" onclick="showMoreSlider(this)">Mehr anzeigen</button></div>
    </div>`;
}


function newsletterHTML() {
  return `
    <div class="page">
      <div class="newsletter --on-green">
        <div class="newsletter__content">
          <p class="label">Newsletter</p>
          <h3>Bleib auf dem Laufenden</h3>
          <p>Tipps, Angebote und Neuigkeiten rund um die Gesundheit deines Tieres.</p>
        </div>
        <form class="actionable-input" onsubmit="return false;">
          <div class="form-field">
            <input type="email" id="nl-email" placeholder="">
            <label for="nl-email">E-Mail-Adresse</label>
          </div>
          <button class="btn --primary" type="submit">Anmelden</button>
        </form>
      </div>
    </div>`;
}

/* ════════════════════════════════════════════
   PRODUKT-KACHEL (.tile --product)
   ════════════════════════════════════════════ */
function tileHTML(p) {
  const approved = isApproved(p);

  let cartOverlay = '';
  if (approved) {
    cartOverlay = `
      <button class="tile__cart-icon" type="button" aria-label="In den Warenkorb" onclick="openOptions(${p.id})">
        <span class="material-icons">shopping_cart</span>
      </button>
      <div class="tile__cart">
        <button class="btn --primary" onclick="openOptions(${p.id})">In den Warenkorb</button>
      </div>`;
  } else {
    cartOverlay = `
      <button class="tile__cart-icon" type="button" aria-label="Freigabe anfragen" onclick="openOptions(${p.id})">
        <span class="material-icons">mail_outline</span>
      </button>
      <div class="tile__cart">
        <button class="btn --honey" onclick="openOptions(${p.id})">Freigabe anfragen</button>
      </div>`;
  }

  const imgContent = p.img
    ? `<img src="${p.img}" alt="${p.name}" loading="lazy">${p.imgHover ? `<img src="${p.imgHover}" alt="" loading="lazy" aria-hidden="true">` : ''}`
    : '';
  const imgClass = p.img ? 'tile__image' : 'tile__image placeholder-bg';

  return `<div class="tile --product" onclick="if(!event.target.closest('.tile__cart,.tile__cart-icon')){activeProduct=PRODUCTS.find(x=>x.id===${p.id});setPage('product')}">
    <div class="tile__image-wrap">
      <div class="floating-meta">
        <div class="badge" data-cat="${p.cat}">${p.catLabel}</div>
        ${p.familie ? '<div class="badge">Produktfamilie</div>' : ''}
      </div>
      <div class="floating-meta --right">${approved ? '<div class="badge badge--rec"><span class="material-icons" aria-hidden="true">check</span>freigegeben</div>' : '<div class="badge badge--needs-release">Freigabe benötigt</div>'}</div>
      <div class="${imgClass}">${imgContent}</div>
      ${cartOverlay}
    </div>
    <div class="tile__headline-row">
      <h3 class="tile__headline">${p.name}</h3>
      ${p.rating ? `<div class="rating"><span class="material-icons" aria-hidden="true">star</span><span>${p.rating}</span></div>` : ''}
    </div>
    <div class="tile__description">${p.shortDesc}</div>
    <div class="tile__price">
      <div class="price-stack"><span>ab ${productStartPrice(p)}</span></div>
    </div>
  </div>`;
}

/* ════════════════════════════════════════════
   SEITEN
   ════════════════════════════════════════════ */

/* ── Testimonial-Strip ── */
const STRIP_TESTIMONIALS = [
  { text: 'Schon nach wenigen Wochen war mein Golden Retriever viel entspannter — ich bin so dankbar für die Empfehlung.',  name: 'Sandra M.',         role: 'Tierbesitzerin, München', img: '../assets/images/Tierhalter_Test_Thumbnail.jpg' },
  { text: 'Gut verträglich, transparente Inhaltsstoffe — ich empfehle Inuvet-Produkte regelmäßig in meiner Praxis.',       name: 'Dr. Thomas Berger', role: 'Tierarzt, Hamburg',       img: '../assets/images/Partner_Krause_Erl_Thumbnail.jpg' },
  { text: 'Hepax forte hat meiner Katze nach der OP wirklich geholfen. Schnelle Lieferung, unkompliziert.',                name: 'Klaus W.',          role: 'Tierhalter, Frankfurt' },
  { text: 'Als Tierärztin schätze ich fundierte Formeln — und meine Klientinnen fragen regelmäßig gezielt danach.',        name: 'Dr. Sarah Koch',    role: 'Tierärztin, Berlin' },
];

const HIW_STEPS = [
  'Entdecke Produkte, die speziell für die Gesundheit und das Wohlbefinden deines Tieres entwickelt wurden.',
  'Lass das Produkt von deinem Tierarzt freigeben — diese*r weiß, was dein Tier wirklich braucht.',
  'Bestell direkt nach Hause: dein Tier bekommt genau das, was gut für es ist.',
];

function hiwHTML() {
  const items = HIW_STEPS.map((text, i) => {
    const step = `
      <div class="hiw__step">
        <span class="hiw__node" aria-hidden="true"></span>
        <div class="hiw__body">
          <span class="hiw__num">0${i + 1}</span>
          <p class="hiw__text">${text}</p>
        </div>
      </div>`;
    const connector = i < HIW_STEPS.length - 1
      ? '<span class="hiw__connector" aria-hidden="true"></span>'
      : '';
    return step + connector;
  }).join('');
  return `
    <div class="hiw">
      <div class="page">
        <div class="hiw__track">${items}</div>
      </div>
    </div>`;
}

/* ── Produktfinder ── */
const FINDER_ANIMALS = [
  { value: 'hund',  label: 'Hund'  },
  { value: 'katze', label: 'Katze' },
];
const FINDER_INDICATIONS = [
  { value: 'beruhigung',    label: 'Nervosität & Stress',   desc: 'Mein Tier ist ängstlich, unruhig oder gestresst.' },
  { value: 'leber',         label: 'Leber & Stoffwechsel',  desc: 'Unterstützung bei Leberproblemen oder Verdauungsschwäche.' },
  { value: 'bauchspeichel', label: 'Verdauung',             desc: 'Verdauungsprobleme, Unterstützung der Bauchspeicheldrüse.' },
];

let finderAnimal = null;
let finderStep   = 0;

function openFinder() {
  finderAnimal = null; finderStep = 0;
  let overlay = document.getElementById('finderOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'finderOverlay';
    overlay.onclick = e => { if (e.target === overlay) closeFinder(); };
    document.body.appendChild(overlay);
  }
  renderFinderStep();
}

function closeFinder() {
  document.getElementById('finderOverlay')?.classList.remove('--open');
}

function finderPickAnimal(v) {
  finderAnimal = v; finderStep = 1; renderFinderStep();
}

function finderPickIndication(indication) {
  const matches = PRODUCTS.filter(p => {
    if (p.cat !== indication) return false;
    const animals = (p.darreichungsformen || [])
      .flatMap(d => (d.animals || '').toLowerCase().split(',').map(a => a.trim()))
      .filter(Boolean);
    return animals.length === 0 || animals.some(a => a.includes(finderAnimal));
  });
  renderFinderResult(matches);
}

function renderFinderStep() {
  const overlay = document.getElementById('finderOverlay');
  const isAnimal = finderStep === 0;

  // Schritt 1: Tierwahl — Choice-Boxes nebeneinander
  const options = isAnimal
    ? FINDER_ANIMALS.map(a =>
        `<button class="choice-box" onclick="finderPickAnimal('${a.value}')">${a.label}</button>`
      ).join('')
    // Schritt 2: Indikation — choice-box mit Label + Beschreibung
    : FINDER_INDICATIONS.map(ind =>
        `<button class="choice-box --detail" onclick="finderPickIndication('${ind.value}')">
          <span class="choice-box__content">
            <span class="choice-box__label">${ind.label}</span>
            <span class="choice-box__desc">${ind.desc}</span>
          </span>
        </button>`
      ).join('');

  const back = finderStep > 0
    ? `<div class="finder__footer"><button class="btn --ghost --back --sm" onclick="finderStep=0;finderAnimal=null;renderFinderStep()">Zurück</button></div>` : '';

  overlay.innerHTML = `
    <div class="modal finder__modal">
      <div class="finder__header">
        <span class="label-caps">Schritt ${finderStep + 1} von 2</span>
        <button class="btn --icon" onclick="closeFinder()"><span class="material-icons">close</span></button>
      </div>
      <div class="finder__body">
        <p class="finder__question">${isAnimal ? 'Welches Tier hast du?' : 'Was beschäftigt dich?'}</p>
        <div class="finder__options ${isAnimal ? '--row' : ''}">${options}</div>
      </div>
      ${back}
    </div>`;
  overlay.classList.add('--open');
}

function renderFinderResult(matches) {
  const overlay = document.getElementById('finderOverlay');
  const items = matches.length
    ? matches.map(p => {
        const dform        = p.darreichungsformen?.[0];
        const firstVariant = dform?.variants?.[0];
        const cartName  = dform?.cartName || p.name;
        // Unterzeile: "60 Stück · 39,90 €"
        const variant   = [firstVariant?.label, firstVariant?.price].filter(Boolean).join(' · ');
        return `
        <div class="cart-item --clickable" onclick="closeFinder();activeProduct=PRODUCTS.find(x=>x.id===${p.id});setPage('product')">
          <div class="product-thumb">
            ${p.img ? `<img src="${p.img}" alt="${cartName}">` : ''}
            ${p.imgHover ? `<img src="${p.imgHover}" alt="" aria-hidden="true">` : ''}
          </div>
          <div class="cart-item__info">
            <div class="cart-item__top">
              <div>
                <p class="cart-item__name">${cartName}</p>
                ${variant ? `<div class="cart-item__variant">${variant}</div>` : ''}
              </div>
            </div>
            <div class="cart-item__bottom">
              <button class="btn --primary --sm" onclick="event.stopPropagation();closeFinder();activeProduct=PRODUCTS.find(x=>x.id===${p.id});setPage('product')">Zum Produkt</button>
            </div>
          </div>
        </div>`;
      }).join('')
    : `<p class="text-xs text-muted">Kein passendes Produkt gefunden — frag deinen Tierarzt.</p>`;

  overlay.innerHTML = `
    <div class="modal finder__modal">
      <div class="finder__header">
        <span class="label-caps">Unser Tipp für dich</span>
        <button class="btn --icon" onclick="closeFinder()"><span class="material-icons">close</span></button>
      </div>
      <div class="finder__body">
        <p class="finder__question">Das könnte passen:</p>
        <div class="finder__results">${items}</div>
      </div>
      <div class="finder__footer">
        <button class="btn --ghost --back --sm" onclick="openFinder()">Neu starten</button>
        <button class="btn --ghost --sm" onclick="closeFinder();setPage('collection')">Alle Produkte</button>
      </div>
    </div>`;
}

/* ── Startseite ── */
function renderHome() {
  let headline     = '';
  let body         = '';
  let cta          = '';
  let heroModifier = '';
  let testHero     = '';

  if (state === 'guest') {
    headline     = 'Weil dein Tier das Beste verdient';
    body         = '';
    heroModifier = '--has-split';
    cta          = `
      <div class="hero-split">
        <div class="hero-split__col flow">
          <p class="hero-split__text"><strong>Du hast eine Produkt-Freigabe von deiner Praxis?</strong> Dann kannst du sie hier einlösen</p>
          <button class="btn --primary" onclick="openLoginModal('login','with-release')">Freigabe einlösen</button>
        </div>
        <div class="hero-split__divider"></div>
        <div class="hero-split__col flow">
          <p class="hero-split__text"><strong>Du hast noch keine Produkt-Freigabe?</strong> Sende deine Produkt-Anfrage online an eine Praxis deiner Wahl</p>
          <button class="btn --honey" onclick="setPage('collection')">Produkte finden</button>
        </div>
      </div>`;
    testHero = `
      <div class="section-type --v1 --hero-test">
        <div class="section-type__animation">
          <lottie-player src="../assets/lotties/Inuvet_animation_Weltweit.json" background="transparent" speed="1" loop autoplay></lottie-player>
        </div>
        <div class="section-type__content flow">
          <h2 class="section-type__headline">${headline}</h2>
          ${cta}
        </div>
      </div>`;
  } else if (state === 'no-release') {
    headline   = 'Dein Tierarzt weiß, was dein Tier wirklich braucht.';
    body       = 'Finde das Richtige für dein Tier und lass es von deinem Tierarzt persönlich freigeben — weil Gesundheit mit dem richtigen Rat beginnt.';
    cta        = `<div class="btn-row">
      <button class="btn --primary" onclick="setPage('collection')">Produkte finden</button>
    </div>`;
  } else {
    headline   = 'Deine Praxis hat entschieden — für dein Tier.';
    const approvedCount = approvedProductIds.size;
    body       = `${approvedCount} ${approvedCount === 1 ? 'Produkt wurde' : 'Produkte wurden'} von deinem Tierarzt freigegeben. Jetzt einlösen und direkt bestellen.`;
    cta        = `<div class="btn-row">
      <button class="btn --primary" onclick="setPage('recommended')">Freigabe einlösen</button>
      <button class="btn --ghost"   onclick="setPage('collection')">Alle Produkte</button>
    </div>`;
  }

  const topHero = false ? `
    <div class="section-type --v1">
      <div class="section-type__animation">
        <lottie-player src="../assets/lotties/Inuvet_animation_Weltweit.json" background="transparent" speed="1" loop autoplay></lottie-player>
      </div>
      <div class="section-type__content flow">
        <h2 class="section-type__headline">Weil dein Tier das Beste verdient</h2>
        <div class="section-type__bottom">
          <p class="section-type__body">Produkt-Freigaben von deiner Praxis kannst du hier direkt einlösen. Falls du noch keine Produkt-Freigabe hast, suche <a href="#" onclick="setPage('collection');return false;">hier</a> das passende Produkt und sende deine Produkt-Anfrage an eine Praxis deiner Wahl.</p>
          <div class="btn-row">
            <button class="btn --primary" onclick="openLoginModal('login','with-release')">Freigabe einlösen</button>
            <button class="btn --ghost" onclick="setPage('collection')">Produkte finden</button>
          </div>
        </div>
      </div>
    </div>` : '';

  return `
    ${topHero}
    ${testHero}
    <div class="section-type --v3 --viewport --reverse ${heroModifier}" ${state === 'guest' ? 'style="display:none"' : ''}>
      <div class="section-type__image" style="background-image:url('${HERO_IMG}');"></div>
      <div class="section-type__inner">
        <div class="section-type__content flow">
          <h2 class="section-type__headline">${headline}</h2>
          ${body ? `<p class="section-type__body">${body}</p>` : ''}
          ${cta}
        </div>
      </div>
    </div>
    <div class="page">
      <div class="tile-grid --cols-4">
        <div class="tile">
          <div class="tile__icon">
            <lottie-player src="../assets/lotties/Icon_Tierarztpraxis.json" background="transparent" speed="1" loop autoplay style="width:calc(var(--base)*4);height:calc(var(--base)*4);display:block;"></lottie-player>
          </div>
          <p class="tile__headline">Beste Expertise</p>
          <p class="tile__body">Kaufe Inuvet-Produkte online – mit der Empfehlung deiner Tierarztpraxis</p>
        </div>
        <div class="tile">
          <div class="tile__icon">
            <lottie-player src="../assets/lotties/Icon_Langzeitgabe.json" background="transparent" speed="1" loop autoplay style="width:calc(var(--base)*4);height:calc(var(--base)*4);display:block;"></lottie-player>
          </div>
          <p class="tile__headline">Für die Langzeitgabe</p>
          <p class="tile__body">Mit natürlichen Inhaltsstoffen, die deinem Tier gut tun</p>
        </div>
        <div class="tile">
          <div class="tile__icon">
            <lottie-player src="../assets/lotties/Icon_Schutz.json" background="transparent" speed="1" loop autoplay style="width:calc(var(--base)*4);height:calc(var(--base)*4);display:block;"></lottie-player>
          </div>
          <p class="tile__headline">Immer gut unterstützt</p>
          <p class="tile__body">Mit Produkten, die auf den Geschmack der Patienten optimiert sind.</p>
        </div>
        <div class="tile">
          <div class="tile__icon">
            <lottie-player src="../assets/lotties/Icon_Auto.json" background="transparent" speed="1" loop autoplay style="width:calc(var(--base)*4);height:calc(var(--base)*4);display:block;"></lottie-player>
          </div>
          <p class="tile__headline">Schnell bei dir</p>
          <p class="tile__body">Mit maximalen Lieferzeiten von 2–3 Tagen</p>
        </div>
      </div>
    </div>
    <div class="section-type --v2 --reverse" id="aboutPraxis">
      <div class="section-type__image" style="background-image:url('../assets/images/Partner_Mia_01.png');"></div>
      <div class="section-type__content flow">
        <h2 class="section-type__headline">Ich habe keine Produktfreigabe. Was tun?</h2>
        <div class="section-type__bottom">
          <p class="section-type__body">Kein Problem — stöbere einfach durch unser Sortiment und wähle ein Produkt aus, das zu deinem Tier passt. Mit einem Klick sendest du eine Anfrage an eine Tierarztpraxis deiner Wahl. Dein Tierarzt prüft die Anfrage und gibt das Produkt persönlich für dich frei. So bestellst du nur das, was wirklich Sinn macht — direkt nach Hause.</p>
          <div class="btn-row">
            <button class="btn --primary" onclick="setPage('collection')">Produkte finden</button>
            <button class="btn --ghost" onclick="openLoginModal('login','with-release')">Freigabe einlösen</button>
          </div>
        </div>
      </div>
    </div>
    <div class="page">
      <h3 class="section-label">Beliebte Produkte</h3>
      <div class="tile-grid --cols-3">
        ${PRODUCTS.map(tileHTML).join('')}
      </div>
    </div>
    ${testimonialSectionHTML('--no-borders')}
    <div class="section-type --v1">
      <div class="section-type__animation">
        <lottie-player src="../assets/lotties/Animation_About_Inuvet.json" background="transparent" speed="1" loop autoplay></lottie-player>
      </div>
      <div class="section-type__content flow">
        <h2 class="section-type__headline">Nur über deine Tierarztpraxis</h2>
        <div class="section-type__bottom">
          <p class="section-type__body">Weil deine Tierärzt*in dein Tier besser kennt als Google und weiß, welches Produkt für dein Tier am besten ist. Du interessierst dich für ein Produkt von Inuvet? Dann kannst du direkt hier eine Freigabeanfrage senden.</p>
          <div class="btn-row">
            <button class="btn --primary" onclick="setPage('collection')">Produkte finden und anfragen</button>
          </div>
        </div>
      </div>
    </div>
`;
}

/* ── Was ist Inuvet? ── */
function renderAbout() {
  return `
    <div class="section-type --v1">
      <div class="section-type__animation">
        <lottie-player src="../assets/lotties/Animation_About_Inuvet.json" background="transparent" speed="1" loop autoplay></lottie-player>
      </div>
      <div class="section-type__content flow">
        <h2 class="section-type__headline">Pflanzlich. Hoch dosiert. Nur über die Praxis.</h2>
        <div class="section-type__bottom">
          <p class="section-type__body">Du möchtest dein Tier pflanzlich unterstützen? Dann bist du hier genau richtig. Produkte von Inuvet sind pflanzlich, hoch dosiert und seit mehr als 15 Jahren in der Tiermedizin im Einsatz — stetig weiterentwickelt, nah an der Forschung.</p>
          <button class="btn --ghost" onclick="document.getElementById('aboutPraxis').scrollIntoView({behavior:'smooth'})">Warum nur in der Praxis?</button>
        </div>
      </div>
    </div>
    <div class="page">
      <div class="tile-grid --cols-4">
        <div class="tile">
          <div class="tile__icon">
            <lottie-player src="../assets/lotties/Icon_Tierarztpraxis.json" background="transparent" speed="1" loop autoplay style="width:calc(var(--base)*4);height:calc(var(--base)*4);display:block;"></lottie-player>
          </div>
          <p class="tile__headline">Beste Expertise</p>
          <p class="tile__body">Kaufe Inuvet-Produkte online – mit der Empfehlung deiner Tierarztpraxis</p>
        </div>
        <div class="tile">
          <div class="tile__icon">
            <lottie-player src="../assets/lotties/Icon_Langzeitgabe.json" background="transparent" speed="1" loop autoplay style="width:calc(var(--base)*4);height:calc(var(--base)*4);display:block;"></lottie-player>
          </div>
          <p class="tile__headline">Für die Langzeitgabe</p>
          <p class="tile__body">Mit natürlichen Inhaltsstoffen, die deinem Tier gut tun</p>
        </div>
        <div class="tile">
          <div class="tile__icon">
            <lottie-player src="../assets/lotties/Icon_Schutz.json" background="transparent" speed="1" loop autoplay style="width:calc(var(--base)*4);height:calc(var(--base)*4);display:block;"></lottie-player>
          </div>
          <p class="tile__headline">Immer gut unterstützt</p>
          <p class="tile__body">Mit Produkten, die auf den Geschmack der Patienten optimiert sind.</p>
        </div>
        <div class="tile">
          <div class="tile__icon">
            <lottie-player src="../assets/lotties/Icon_Auto.json" background="transparent" speed="1" loop autoplay style="width:calc(var(--base)*4);height:calc(var(--base)*4);display:block;"></lottie-player>
          </div>
          <p class="tile__headline">Schnell bei dir</p>
          <p class="tile__body">Mit maximalen Lieferzeiten von 2–3 Tagen</p>
        </div>
      </div>
    </div>
    <div class="section-type --v2 --reverse" id="aboutPraxis">
      <div class="section-type__image" style="background-image:url('../assets/images/Partner_Mia_01.png');"></div>
      <div class="section-type__content flow">
        <h2 class="section-type__headline">Warum gibt es Inuvet-Produkte nur über deine Tierarztpraxis?</h2>
        <div class="section-type__bottom">
          <p class="section-type__body">Weil deine Tierärztin oder dein Tierarzt dein Tier besser kennt als Google — und weiß, wann welches Produkt Sinn macht und wann nicht. Damit du nicht für jede Nachbestellung in die Praxis musst, gibt es die Tierarzt-Empfehlung. Damit bestellst du das empfohlene Produkt direkt nach Hause — solange deine Praxis es dir empfohlen hat.</p>
          <div class="btn-row">
            <button class="btn --primary" onclick="openLoginModal('login','with-release')">Freigabe jetzt einlösen</button>
            <button class="btn --ghost" onclick="setPage('collection')">Produkte finden</button>
          </div>
        </div>
      </div>
    </div>
    <div class="page">
      <h3 class="section-label">Beliebte Produkte</h3>
      <div class="tile-grid --cols-3">
        ${PRODUCTS.map(tileHTML).join('')}
      </div>
    </div>
`;
}

/* ── Alle Produkte ── */
function renderCollection() {
  return `
    <div class="section-type --v1 --reverse">
      <div class="section-type__animation">
        <lottie-player src="../assets/lotties/inuvet_website_animation_pagenotfound_json.json" background="transparent" speed="1" loop autoplay></lottie-player>
      </div>
      <div class="section-type__content flow">
        <h2 class="section-type__headline">Produkte finden und von deinem Tierarzt freigeben lassen</h2>
        <div class="section-type__bottom">
          <p class="section-type__body">Inuvet Produkte sind pflanzlich und hoch dosiert — in enger Zusammenarbeit mit Tierärzten. Hast du bereits eine Empfehlung? Dann kannst du sie hier direkt einlösen. Noch keine? Kein Problem — stöbere durch unser Sortiment und frage ein Produkt bei deiner Praxis an.</p>
          <div class="btn-row">
            <button class="btn --primary" onclick="openFinder()">Produktfinder starten</button>
            <button class="btn --ghost" onclick="document.getElementById('collectionGrid').scrollIntoView({behavior:'smooth'})">Alle Produkte</button>
          </div>
        </div>
      </div>
    </div>
    <div class="page" id="collectionGrid">
      <div class="tile-grid --cols-3">
        ${PRODUCTS.map(tileHTML).join('')}
      </div>
    </div>
    ${testimonialSectionHTML()}
`;
}

/* ── Empfohlene Produkte ── */
function renderRecommended() {
  const approved = PRODUCTS.filter(p => approvedProductIds.has(p.id));
  return `
    <div class="page">
      <h2 class="shop-page-title">Empfohlene Produkte</h2>
      <div class="collection-toolbar"></div>
      <div class="tile-grid --cols-3">
        ${approved.map(tileHTML).join('')}
      </div>
    </div>
    ${testimonialSectionHTML()}
`;
}

/* ── Produktseite (PDP) ── */
function renderProduct() {
  const p        = activeProduct;
  const approved = isApproved(p);

  // Approved Variante vorauswählen, sonst auf Index 0 zurücksetzen
  const pdpAv = approved ? approvedVariantByProduct.get(p.id) : null;
  pdpState.formIndex    = pdpAv ? pdpAv.formIndex    : 0;
  pdpState.variantIndex = pdpAv ? pdpAv.variantIndex : 0;

  const imgBadges = `<div class="floating-meta">
    <div class="badge" data-cat="${p.cat}">${p.catLabel}</div>
    ${p.familie ? '<div class="badge">Produktfamilie</div>' : ''}
  </div>
  <div class="floating-meta --right">${approved ? '<div class="badge badge--rec"><span class="material-icons" aria-hidden="true">check</span>freigegeben</div>' : '<div class="badge badge--needs-release">Freigabe benötigt</div>'}</div>`;


  // Bewertung — wie im Styleguide: Sterne + Text
  const ratingHTML = p.rating ? `
    <div class="rating">
      ${ratingStarsHTML(p.rating)}
      <span class="text-muted">${p.rating} (Bewertungen)</span>
    </div>` : '';

  let typeSection  = '';
  let priceDisplay = '';
  let sizeSection  = '';
  let actions      = '';

  {
    const startForm     = p.familie ? p.darreichungsformen[pdpState.formIndex] : null;
    const startVariants = startForm ? startForm.variants : p.variants;
    const startPrice    = startVariants[pdpState.variantIndex].price;

    priceDisplay = `<div class="pdp__price"><div class="price-stack"><span id="pdpPrice">${startPrice}</span></div></div>`;

    // Darreichungsform-Auswahl — nur Familien, VOR dem Preis (wie Styleguide)
    if (p.familie) {
      const formRows = p.darreichungsformen.map((f, i) => {
        const isApprovedForm = pdpAv && pdpAv.formIndex === i;
        const badge = isApprovedForm
          ? '<span class="circle-badge --check pdp__type-badge"><span class="material-icons">check</span></span>'
          : '';
        return `<label class="pdp__type-row${isApprovedForm ? ' --approved' : ''}">
          <input type="radio" name="pdpType"${i === pdpState.formIndex ? ' checked' : ''} onchange="selectPdpForm(${i})">
          <span class="pdp__type-label">${f.label}${f.note ? ` (${f.note})` : ''}${badge}</span>
          <span class="pdp__type-animals">${f.animals || ''}</span>
        </label>`;
      }).join('');
      typeSection = `
        <div class="pdp__variants">
          <div class="pdp__type-selector">
            <div class="pdp__type-selector-header">
              <span>Darreichungsform</span>
              <span>Geeignet für</span>
            </div>
            ${formRows}
          </div>
          <div class="notice"><p>Beachte: Je nach Produkttyp ändern sich die Inhaltsstoffe.</p></div>
        </div>`;
    }

    // Größen-Auswahl
    const sizeBtns = startVariants.map((v, i) => {
      const isApprovedSize = pdpAv && pdpAv.formIndex === pdpState.formIndex && pdpAv.variantIndex === i;
      return `<button class="choice-box${i === pdpState.variantIndex ? ' --active' : ''}${isApprovedSize ? ' --approved' : ''}" type="button"
        onclick="selectPdpVariant(${i})">${v.label}${isApprovedSize ? '<span class="circle-badge --check choice-box__check"><span class="material-icons">check</span></span>' : ''}</button>`;
    }).join('');
    sizeSection = `
      <div class="pdp__variants">
        <div class="pdp__variant-label label-caps">Größe</div>
        <div class="pdp__variant-options" id="pdpSizeOptions">${sizeBtns}</div>
      </div>`;

    const ctaClass = approved ? 'btn --primary' : 'btn --honey';
    const ctaIcon  = '';
    const ctaLabel = approved ? 'In den Warenkorb' : 'Freigabe-Anfrage in den Korb legen';
    actions = `<div class="pdp__actions">
      <div>
        <div class="pdp__variant-label label-caps">Menge</div>
        <div class="qty-selector">
          <button class="qty-selector__btn" type="button" aria-label="Weniger"
            onclick="pdpQtyChange(-1)">
            <span class="material-icons">remove</span>
          </button>
          <input class="qty-selector__input" type="number" value="1" min="1" max="${approved ? (approvedVariantByProduct.get(p.id)?.maxQty ?? 99) : 99}" id="pdpQty">
          <button class="qty-selector__btn" type="button" aria-label="Mehr"
            onclick="pdpQtyChange(1)">
            <span class="material-icons">add</span>
          </button>
        </div>
      </div>
      <button class="${ctaClass}" onclick="pdpAddToCart()">${ctaIcon}${ctaLabel}</button>
      ${approved ? `<button class="pdp__wishlist icon-box --md" type="button" aria-label="Zur Wunschliste"><span class="material-icons">favorite_border</span></button>` : ''}
    </div>`;
  }

  const gallerySection = p.img ? `
    <div class="pdp__gallery">
      <div class="pdp__main-image" id="pdpMainImage">
        <img src="${p.img}" alt="${p.name}" id="pdpMainImg">
        ${imgBadges}
      </div>
      <div class="pdp__thumbs">
        <button class="pdp__thumb --active" onclick="pdpSetImg(this,'${p.img}')"><img src="${p.img}" alt="${p.name}"></button>
        ${p.imgHover  ? `<button class="pdp__thumb" onclick="pdpSetImg(this,'${p.imgHover}')"><img src="${p.imgHover}" alt="${p.name} Ansicht 2"></button>` : ''}
        ${p.imgDetail ? `<button class="pdp__thumb" onclick="pdpSetImg(this,'${p.imgDetail}')"><img src="${p.imgDetail}" alt="${p.name} Ansicht 3"></button>` : ''}
      </div>
    </div>` : `
    <div class="pdp__gallery">
      <div class="pdp__main-image placeholder-bg" id="pdpMainImage">
        ${imgBadges}
      </div>
    </div>`;

  return `
    <div class="page">
      <div class="pdp">
        ${gallerySection}
        <div class="pdp__info">
          <h1 class="pdp__title">${p.name}</h1>
          ${ratingHTML}
          <p class="pdp__description">${p.shortDesc}</p>
          ${typeSection}
          ${priceDisplay}
          ${sizeSection}
          ${actions}
          <div class="accordion">
            <div class="accordion-item --open">
              <button class="accordion-trigger" type="button" aria-expanded="true" onclick="toggleAccordion(this)">Beschreibung<span class="accordion-icon material-icons">expand_more</span></button>
              <div class="accordion-content"><div class="accordion-content__inner"><p>${p.desc}</p></div></div>
            </div>
            <div class="accordion-item">
              <button class="accordion-trigger" type="button" aria-expanded="false" onclick="toggleAccordion(this)">Inhaltsstoffe<span class="accordion-icon material-icons">expand_more</span></button>
              <div class="accordion-content"><div class="accordion-content__inner"><p>${p.ingredients}</p></div></div>
            </div>
            <div class="accordion-item">
              <button class="accordion-trigger" type="button" aria-expanded="false" onclick="toggleAccordion(this)">Versand &amp; Lieferung<span class="accordion-icon material-icons">expand_more</span></button>
              <div class="accordion-content"><div class="accordion-content__inner"><p>Standardversand: 3–5 Werktage. Expressversand: 1–2 Werktage. Ab 50 € versandkostenfrei.</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    ${testimonialSectionHTML()}
`;
}

/* ── Checkout-Seite ── */
function renderCheckout() {
  if (cartApproved.length === 0) {
    setPage('collection');
    return '';
  }

  const total   = calcTotal(cartApproved);
  const items   = cartApproved.map(checkoutItemHTML).join('');

  return `
    <div class="page">
      <div class="checkout">

        <!-- ── Linke Spalte ── -->
        <div>
          <div>
            <h3 class="section-label">Lieferadresse</h3>
            <div class="form-grid">
              <div class="form-field"><input type="text" id="co-vorname"  placeholder=""><label for="co-vorname">Vorname</label></div>
              <div class="form-field"><input type="text" id="co-nachname" placeholder=""><label for="co-nachname">Nachname</label></div>
              <div class="form-field"><input type="text" id="co-strasse"  placeholder=""><label for="co-strasse">Straße</label></div>
              <div class="form-field"><input type="text" id="co-hausnr"   placeholder=""><label for="co-hausnr">Nr.</label></div>
              <div class="form-field"><input type="text" id="co-plz"      placeholder=""><label for="co-plz">PLZ</label></div>
              <div class="form-field"><input type="text" id="co-ort"      placeholder=""><label for="co-ort">Ort</label></div>
              <div class="form-field --full"><input type="email" id="co-email" placeholder="" required><label for="co-email">E-Mail-Adresse *</label></div>
            </div>
          </div>

          <div>
            <h3 class="section-label">Versandart</h3>
            <div class="tile-grid" style="gap:var(--half-module)">
              <button class="choice-box --block --active" type="button" onclick="this.parentNode.querySelectorAll('.choice-box').forEach(b=>b.classList.remove('--active'));this.classList.add('--active')">
                <span class="material-icons">local_shipping</span>
                <span><strong>Standardversand</strong> — DHL · 3–5 Werktage · <strong>kostenlos</strong></span>
              </button>
              <button class="choice-box --block" type="button" onclick="this.parentNode.querySelectorAll('.choice-box').forEach(b=>b.classList.remove('--active'));this.classList.add('--active')">
                <span class="material-icons">rocket_launch</span>
                <span><strong>Expressversand</strong> — DHL Express · 1–2 Werktage · <strong>4,99 €</strong></span>
              </button>
            </div>
          </div>

          <div>
            <h3 class="section-label">Zahlung</h3>
            <div class="tile-grid" style="gap:var(--half-module)">
              <button class="choice-box --block --active" type="button" onclick="this.parentNode.querySelectorAll('.choice-box').forEach(b=>b.classList.remove('--active'));this.classList.add('--active')">
                <span class="material-icons">credit_card</span>
                <span>Kreditkarte</span>
              </button>
              <button class="choice-box --block" type="button" onclick="this.parentNode.querySelectorAll('.choice-box').forEach(b=>b.classList.remove('--active'));this.classList.add('--active')">
                <span class="material-icons">account_balance_wallet</span>
                <span>PayPal</span>
              </button>
              <button class="choice-box --block" type="button" onclick="this.parentNode.querySelectorAll('.choice-box').forEach(b=>b.classList.remove('--active'));this.classList.add('--active')">
                <span class="material-icons">receipt_long</span>
                <span>Rechnung</span>
              </button>
            </div>
          </div>
        </div>

        <!-- ── Rechte Spalte ── -->
        <aside class="checkout__sidebar">
          <h3 class="section-label">Bestellübersicht</h3>
          ${items}
          <div class="summary-line"><span>Zwischensumme</span><span>${total.toFixed(2).replace('.',',')} €</span></div>
          <div class="summary-line"><span>Versand</span><span>kostenlos</span></div>
          <div class="summary-total"><span>Gesamt</span><span>${total.toFixed(2).replace('.',',')} €</span></div>
          <div class="checkout__cta">
            <button class="btn --primary cart-drawer__checkout">Jetzt kaufen</button>
          </div>
        </aside>

      </div>
    </div>
    ${testimonialSectionHTML()}
`;
}

/* ════════════════════════════════════════════
   CHECKOUT-MODAL (nur bei angefragten Produkten)
   ════════════════════════════════════════════ */
function openCheckoutModal() {
  const hasApproved  = cartApproved.length  > 0;
  const hasRequested = cartRequested.length > 0;
  const modal        = document.getElementById('checkoutModal');

  const names = cartRequested.map(item => item.cartName).join(', ');
  document.getElementById('modalTitle').textContent = 'Produkte erfolgreich angefragt!';
  document.getElementById('modalBody').innerHTML =
    `<strong>Produkte erfolgreich bei Tierarzt Dr. med. vet. Martina Müller (Tierarztpraxis Grüntal) angefragt.</strong><br><br>
     Angefragte Produkte: ${names}.<br><br>
     Deine Praxis wurde benachrichtigt und meldet sich bei dir.`;

  const actions = document.getElementById('modalActions');
  actions.innerHTML = '';

  if (hasApproved) {
    const btn = document.createElement('button');
    btn.className   = 'btn --primary --full';
    btn.textContent = 'Zum Check-Out';
    btn.onclick     = () => { modal.classList.remove('--open'); setPage('checkout'); };
    actions.appendChild(btn);
  }

  const back = document.createElement('button');
  back.className   = 'btn --ghost --full';
  back.textContent = 'Zurück zum Shop';
  back.onclick     = () => { modal.classList.remove('--open'); setPage('home'); };
  actions.appendChild(back);

  modal.classList.add('--open');
}

document.getElementById('checkoutModal').addEventListener('click', function(e) {
  if (e.target === this) this.classList.remove('--open');
});

/* ════════════════════════════════════════════
   HAUPT-RENDER
   ════════════════════════════════════════════ */
function render() {
  renderNav();
  document.body.classList.toggle('--page-home', page === 'home');
  const main = document.getElementById('shopMain');
  switch (page) {
    case 'home':
      main.innerHTML = renderHome();
      requestAnimationFrame(() => {
        const strip = document.querySelector('.intro-strip');
        if (strip) document.documentElement.style.setProperty('--intro-strip-height', strip.offsetHeight + 'px');
      });
      break;
    case 'about':       main.innerHTML = renderAbout();       break;
    case 'collection':  main.innerHTML = renderCollection();  break;
    case 'recommended': main.innerHTML = renderRecommended(); break;
    case 'product':     main.innerHTML = renderProduct();     break;
    case 'checkout':    main.innerHTML = renderCheckout();    break;
  }
  initSliders();
  initMarquees();
}

/* ════════════════════════════════════════════
   SUCHE
   ════════════════════════════════════════════ */
const SEARCH_DATA = {
  queries: [
    { text: 'Beruhigung & Entspannung' },
    { text: 'Leber & Stoffwechsel' },
    { text: 'Bauchspeicheldrüse & Verdauung' },
    { text: 'Tierärztlich empfohlene Produkte' },
  ],
  products: PRODUCTS.map(p => ({
    name: p.name, meta: p.catLabel,
    price: productStartPrice(p),
    img: p.img, imgHover: p.imgHover, id: p.id,
  })),
};

let searchActiveIndex = -1;

function openSearch() {
  document.getElementById('searchOverlay').classList.add('--open');
  setTimeout(() => document.getElementById('searchInput').focus(), 300);
  document.body.style.overflow = 'hidden';
}

function closeSearch() {
  document.getElementById('searchOverlay').classList.remove('--open');
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').innerHTML = '';
  searchActiveIndex = -1;
  document.body.style.overflow = '';
}

function handleSearchOverlayClick(e) {
  if (e.target === document.getElementById('searchOverlay')) closeSearch();
}

function renderSearchResults(query) {
  const container = document.getElementById('searchResults');
  if (!query.trim()) { container.innerHTML = ''; return; }

  const q = query.toLowerCase();
  const matchedProducts = SEARCH_DATA.products.filter(p =>
    p.name.toLowerCase().includes(q) || p.meta.toLowerCase().includes(q)
  );
  const matchedQueries = SEARCH_DATA.queries.filter(qr =>
    qr.text.toLowerCase().includes(q)
  );

  if (!matchedProducts.length && !matchedQueries.length) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="material-icons">search_off</span>
        <p>Keine Ergebnisse für „${query}"</p>
      </div>`;
    return;
  }

  let html = '';
  if (matchedQueries.length) {
    html += `<div class="search-results__section"><div class="section-label">Vorschläge</div>`;
    matchedQueries.forEach((qr, i) => {
      html += `<div class="search-result" role="option" data-index="${i}" onclick="closeSearch()">
        <div class="icon-box --lg"><span class="material-icons">search</span></div>
        <div class="search-result__info"><p class="search-result__name">${qr.text}</p></div>
      </div>`;
    });
    html += `</div>`;
  }
  if (matchedProducts.length) {
    html += `<div class="search-results__section"><div class="section-label">Produkte</div>`;
    matchedProducts.forEach((p, i) => {
      const srThumb = p.img
        ? `<img src="${p.img}" alt="${p.name}">${p.imgHover ? `<img src="${p.imgHover}" alt="">` : ''}`
        : '';
      const srThumbClass = p.img ? 'search-result__image product-thumb' : 'search-result__image product-thumb placeholder-bg';
      html += `<div class="search-result" role="option" data-index="${matchedQueries.length + i}"
        onclick="closeSearch();activeProduct=PRODUCTS.find(x=>x.id===${p.id});setPage('product')">
        <div class="${srThumbClass}">${srThumb}</div>
        <div class="search-result__info">
          <p class="search-result__name">${p.name}</p>
          <div class="search-result__meta">${p.meta}</div>
        </div>
        <div class="search-result__price">ab ${p.price}</div>
      </div>`;
    });
    html += `</div>`;
  }

  container.innerHTML = html;
  searchActiveIndex = -1;
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  if (!input) return;
  let debounceTimer;
  input.addEventListener('input', e => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => renderSearchResults(e.target.value), 200);
  });
  input.addEventListener('keydown', e => {
    const items = document.querySelectorAll('#searchResults .search-result');
    if (e.key === 'Escape') { closeSearch(); return; }
    if (!items.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); searchActiveIndex = Math.min(searchActiveIndex + 1, items.length - 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); searchActiveIndex = Math.max(searchActiveIndex - 1, -1); }
    else if (e.key === 'Enter' && searchActiveIndex >= 0) { items[searchActiveIndex].click(); return; }
    items.forEach((item, i) => item.classList.toggle('--active', i === searchActiveIndex));
    if (searchActiveIndex >= 0) items[searchActiveIndex].scrollIntoView({ block: 'nearest' });
  });
});

/* Escape schließt Drawer + Login-Modal */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (document.getElementById('optionsDrawer').classList.contains('--open')) closeOptions();
  if (document.getElementById('loginOverlay').classList.contains('--open'))  closeLoginModal();
});

/* Vet-Dropdown schließen bei Klick außerhalb */
document.addEventListener('click', e => {
  if (!e.target.closest('.vet-search')) {
    const d = document.getElementById('vetDropdown');
    if (d) d.style.display = 'none';
  }
});

const _marqueeBase = new Map();

function initMarquees() {
  requestAnimationFrame(() => {
    document.querySelectorAll('.announcement-bar.--marquee .announcement-bar__track').forEach(track => {
      if (_marqueeBase.has(track)) {
        track.innerHTML = _marqueeBase.get(track);
      } else {
        _marqueeBase.set(track, track.innerHTML);
      }
      track.querySelectorAll('.--guest-only').forEach(el => {
        el.style.display = (state === 'guest') ? '' : 'none';
      });
      const sentinel = track.querySelector('.announcement-bar__sentinel');
      if (!sentinel) return;
      const shift = sentinel.offsetLeft;
      const barWidth = track.parentElement.offsetWidth;
      const afterSentinel = Array.from(track.children).slice(
        Array.from(track.children).indexOf(sentinel) + 1
      );
      let safety = 0;
      while (track.scrollWidth - shift < barWidth * 2 && safety++ < 20) {
        afterSentinel.forEach(el => track.appendChild(el.cloneNode(true)));
      }
      track.style.setProperty('--marquee-shift', `-${shift}px`);
    });
  });
}

(document.fonts ? document.fonts.ready : Promise.resolve()).then(initMarquees);

render();
initSliders();

