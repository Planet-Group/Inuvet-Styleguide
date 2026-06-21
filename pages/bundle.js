/* ═══════════════════════════════════════════
   Bundle Builder — Seiten-spezifische Logik
   Naturalrabatt, Warenkorb, Cart-/Such-/Toast-UI: inuvet.js (global).
   ═══════════════════════════════════════════ */

const BUNDLE_MAX_PRODUCTS = 4;

// ── In den Warenkorb ────────────────────────────────────────────────────
// Jedes Bundle-Produkt wird als EIGENE Warenkorb-Position übernommen
// (kein Sammel-Paket mehr). Der Naturalrabatt gilt danach global pro Position.
window.addBundleToCart = () => {
  if (activeBundle.length === 0) { openCart(); return; }
  activeBundle.forEach(p => {
    const formIdx = p.isFamily ? p.selectedVariantIdx : 0;
    const sizeIdx = p.isFamily ? p.selectedSizeIdx : 0;
    addToCart(p.id, formIdx, sizeIdx, p.quantity);
  });
  showToast(`${activeBundle.length} Produkte in den Warenkorb gelegt`);
  openCart();
};

// Schnell-Hinzufügen aus den Produktkacheln (Einzelprodukte, Menge 1).
window.quickAdd = (id, name) => {
  addToCart(id, 0, 0, 1);
  showToast(`${name} in den Warenkorb gelegt`);
  openCart();
};

// ── Sichtbarkeits-Logik (einmalige Entscheidung beim Load) ──────────────
// Pool: letzte 549 Tage (18 Monate, past18Months).
// Mindestens ein Produkt mit Gratisartikel? → Section zeigen.
// Sonst: Section bleibt ausgeblendet.
//
// Nach dem initialen Entscheid wird bundleVisible NIE mehr geändert —
// auch dann nicht, wenn der User alle Produkte mit Rabatt entfernt.
let bundleVisible         = false;
let activeBundle          = [];
let initialBundleSnapshot = [];      // { id, quantity } — für Wiederherstellen

const snapshotBundle = () => {
  initialBundleSnapshot = activeBundle.map(p => ({ id: p.id, quantity: p.quantity }));
};

const initBundle = () => {
  bundleVisible         = false;
  activeBundle          = [];
  initialBundleSnapshot = [];

  const pool = allProducts
    .filter(p => (p.past18Months ?? 0) > 0)
    .sort((a, b) => (b.past18Months ?? 0) - (a.past18Months ?? 0));
  pool.forEach(p => { p.quantity = Math.ceil(p.past18Months / 8) * 8; });
  const bundle      = pool.slice(0, BUNDLE_MAX_PRODUCTS);
  const hasDiscount = bundle.some(p => calcFree(p) > 0);

  if (hasDiscount) {
    bundleVisible = true;
    activeBundle  = bundle;
    snapshotBundle();
  }
};

// ── Sticky Summary (Mobile) ─────────────────────────────────────────────
// Fixed-Bar am unteren Rand via Body-Portal — zuverlässig auf iOS.
// Sichtbar nur wenn #bundleSection im Viewport.
const summaryCard     = document.getElementById('summaryCard');
const summaryCardSlot = document.getElementById('summaryCardSlot');
const bundleSection   = document.getElementById('bundleSection');
const MOBILE_MQ       = window.matchMedia('(max-width: 767px)');

const syncSummaryPortal = () => {
  if (!summaryCard || !summaryCardSlot) return;
  if (MOBILE_MQ.matches) {
    summaryCard.classList.add('--mobile-portal');
    if (summaryCard.parentElement !== document.body) {
      document.body.appendChild(summaryCard);
    }
  } else {
    summaryCard.classList.remove('--mobile-portal', '--sticky-visible');
    if (summaryCard.parentElement !== summaryCardSlot) {
      summaryCardSlot.appendChild(summaryCard);
    }
  }
};

const syncSummarySpacer = () => {
  if (!bundleSection || !summaryCard || !MOBILE_MQ.matches) {
    if (bundleSection) bundleSection.style.paddingBottom = '';
    return;
  }
  if (summaryCard.classList.contains('--sticky-visible')) {
    const gap = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    bundleSection.style.paddingBottom = `${summaryCard.offsetHeight + gap}px`;
  } else {
    bundleSection.style.paddingBottom = '';
  }
};

const updateStickySummary = () => {
  syncSummaryPortal();
  if (!summaryCard || !bundleSection) return;

  const sectionHidden = getComputedStyle(bundleSection).display === 'none';

  if (!MOBILE_MQ.matches || sectionHidden) {
    summaryCard.classList.remove('--sticky-visible');
    syncSummarySpacer();
    return;
  }

  const rect   = bundleSection.getBoundingClientRect();
  const inView = rect.bottom > 0 && rect.top < window.innerHeight;
  summaryCard.classList.toggle('--sticky-visible', inView);
  syncSummarySpacer();
};

if (bundleSection && summaryCard) {
  const stickyObserver = new IntersectionObserver(() => updateStickySummary(), { threshold: 0 });
  stickyObserver.observe(bundleSection);
}

window.addEventListener('scroll', updateStickySummary, { passive: true });
window.addEventListener('resize', updateStickySummary);
MOBILE_MQ.addEventListener('change', updateStickySummary);

// Wendet bundleVisible auf das DOM an.
const applyVisibility = () => {
  document.getElementById('bundleSection').style.display = bundleVisible ? '' : 'none';
  updateStickySummary();
};

// ── Render: Bundle ─────────────────────────────────────────────────────
const renderBundle = () => {
  const introP = document.querySelector('#bundleSection > .col-grid:first-child p');
  if (introP) {
    introP.textContent = 'Basierend auf deinen Einkäufen der letzten 18 Monate haben wir dieses Set für dich zusammengestellt.';
  }

  const list = document.getElementById('productList');
  list.innerHTML = '';

  if (activeBundle.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <span class="material-icons">inventory_2</span>
        <p>Dein Bundle ist leer.</p>
        <button type="button" class="btn --secondary --sm" onclick="restoreBundle()">Wiederherstellen</button>
      </div>`;
    updateSummary();
    return;
  }

  activeBundle.forEach(p => {
    const freeItems = calcFree(p);

    const historyText = p.past18Months > 0
      ? ` · <strong>Letzte 18 Monate: ${p.past18Months}× gekauft</strong>` : '';

    const thumbContentHtml = p.image
      ? `<img src="${p.image}" alt="${p.title}" >`
      : '';

    const card = document.createElement('div');
    card.className = `cart-item bundle-item${p.isNew ? ' is-entering' : ''}`;
    p.isNew = false;

    const tierHint = formatHint(getHint(p), p.pricingModel || 'A');
    const variant  = p.isFamily ? p.variants[p.selectedVariantIdx] : null;
    const sizeLabel = variant ? variant.sizes[p.selectedSizeIdx].label + ' · ' : '';
    const displayName = p.isFamily ? `${p.title} ${variant.type}` : p.title;

    card.innerHTML = `
      <div class="product-thumb-wrap">
        <div class="product-thumb placeholder-bg">${thumbContentHtml}</div>
      </div>
      <div class="cart-item__info">
        <div class="cart-item__top">
          <div>
            <p class="cart-item__name">${displayName}</p>
            <div class="cart-item__variant">${sizeLabel}${fmt(getActivePrice(p))} / Stk.${historyText}</div>
          </div>
          <button type="button" class="btn --icon cart-item__remove"
            onclick="removeProduct(${p.id})" title="Entfernen">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="cart-item__bottom">
          <div class="cart-item__counter">
            <div class="qty-selector --sm">
              <button type="button" class="qty-selector__btn"
                onclick="updateQuantity(${p.id}, -1)">
                <span class="material-icons">remove</span>
              </button>
              <input class="qty-selector__input" type="number"
                value="${p.quantity}" min="1"
                onchange="setQuantity(${p.id}, parseInt(this.value)||1)">
              <button type="button" class="qty-selector__btn"
                onclick="updateQuantity(${p.id}, 1)">
                <span class="material-icons">add</span>
              </button>
            </div>
            ${freeItems > 0 ? `<span class="badge --free">+ ${freeItems} Gratis</span>` : ''}
          </div>
        </div>
      </div>
      ${tierHint ? `<span class="bundle-item__tier-hint" aria-hidden="true">${tierHint}</span>` : ''}`;
    list.appendChild(card);
  });

  updateSummary();
};

// ── Aktionen ────────────────────────────────────────────────────────────
window.updateQuantity = (id, delta) => {
  const p = activeBundle.find(p => p.id === id);
  if (p && p.quantity + delta >= 1) { p.quantity += delta; renderBundle(); }
};

window.setQuantity = (id, val) => {
  const p = activeBundle.find(p => p.id === id);
  if (p && val >= 1) { p.quantity = val; renderBundle(); }
};

window.removeProduct = (id) => {
  const i = activeBundle.findIndex(p => p.id === id);
  if (i === -1) return;
  activeBundle.splice(i, 1);
  renderBundle();
};

window.restoreBundle = () => {
  if (!initialBundleSnapshot.length) return;
  activeBundle = initialBundleSnapshot.map(snap => {
    const p = allProducts.find(p => p.id === snap.id);
    p.quantity = snap.quantity;
    return p;
  });
  renderBundle();
};

// ── Summary ─────────────────────────────────────────────────────────────
const updateSummary = () => {
  let paidItems = 0, freeItems = 0, savings = 0;

  activeBundle.forEach(p => {
    paidItems += p.quantity;
    const free = calcFree(p);
    freeItems += free;
    savings   += free * getActivePrice(p);
  });

  const names = activeBundle.map(p => p.title).join(', ');
  document.getElementById('summaryProducts').textContent = names || '—';
  document.getElementById('paidCount').textContent  = paidItems;
  document.getElementById('savingsAmount').textContent = `+ ${fmt(savings)}`;
  document.querySelector('.summary-card__line.--free').style.display = freeItems > 0 ? '' : 'none';

  updateStickySummary();
};


// ── Settings Modal ──────────────────────────────────────────────────────
window.openSettings = () => {
  renderCustomerToggle();
  renderModelSelector();
  document.getElementById('settingsModal').classList.add('--open');
};
window.closeSettings = () => document.getElementById('settingsModal').classList.remove('--open');
window.handleOverlayClick = (e) => {
  if (e.target === document.getElementById('settingsModal')) closeSettings();
};

// Aktualisiert den aktiven Zustand der Kundentyp-Buttons
const renderCustomerToggle = () => {
  document.querySelectorAll('#customerToggle .mockup-toggle-btn').forEach(btn => {
    btn.classList.toggle('--active', btn.dataset.type === customerType);
  });
};

window.setCustomerType = (type) => {
  setCustomerTypeGlobal(type);   // global + localStorage (gilt auch für Warenkorb & PDP)
  renderCustomerToggle();
  renderBundle();                // alle Berechnungen neu (Bundle + Summary)
  if (document.getElementById('cartDrawer').classList.contains('--open')) renderCartDrawer();
};

// Pro Produktfamilie bzw. Einzelprodukt eine Zeile: Name + A/B-Toggle
const renderModelSelector = () => {
  const container = document.getElementById('modelSelector');
  container.innerHTML = '';
  pricingConfigEntries().forEach(p => {
    const row = document.createElement('div');
    row.className = 'mockup-model-row';
    const model = p.pricingModel || 'A';
    row.innerHTML = `
      <span class="mockup-model-row__name">${p.title}</span>
      <div class="mockup-model-row__toggle">
        <button type="button" class="mockup-toggle-btn ${model === 'A' ? '--active' : ''}"
                onclick="setProductModel(${p.id}, 'A')">Kondition A</button>
        <button type="button" class="mockup-toggle-btn ${model === 'B' ? '--active' : ''}"
                onclick="setProductModel(${p.id}, 'B')">Kondition B</button>
      </div>`;
    container.appendChild(row);
  });
};

window.setProductModel = (productId, model) => {
  const p = allProducts.find(p => p.id === productId);
  if (!p) return;
  p.pricingModel = model;
  renderModelSelector();
  renderBundle();
};

// ── Testimonial-Slider ──────────────────────────────────────────────────
const TESTIMONIALS = [
  { text: 'Nach wenigen Wochen hat sich die Beweglichkeit meiner Hündin spürbar verbessert. Das Vorrats-Bundle spart mir Zeit und bringt echte Vorteile.',    name: 'Sandra M.',   role: 'Labrador-Besitzerin, München'    },
  { text: 'Endlich eine einfache Möglichkeit, regelmäßig nachzubestellen. Hypolene ist aus dem Alltag mit meinem Retriever nicht mehr wegzudenken.',           name: 'Thomas K.',   role: 'Hundebesitzer, Hamburg'          },
  { text: 'Das Naturalrabatt-System ist eine tolle Idee. Ich bekomme Gratis-Produkte dazu und muss nicht jedes Mal neu überlegen, was ich bestelle.',           name: 'Julia R.',    role: 'Tierliebhaberin, Berlin'         },
  { text: 'Seit ich das Bundle nutze, habe ich Respirax immer vorrätig. Mein Tierarzt ist begeistert – und mein Hund auch.',                                    name: 'Markus T.',   role: 'Golden-Retriever-Besitzer'       },
  { text: 'Der Vorteil beim Bundle ist unschlagbar. Ich zahle weniger und habe immer genug auf Lager. Absolute Empfehlung für alle, die regelmäßig bestellen.', name: 'Petra L.',    role: 'Hundebesitzerin, Köln'           },
  { text: 'Ich habe das Bundle meiner Tierärztin gezeigt – sie war sofort überzeugt. Jetzt nutzen wir es schon seit Monaten und sind sehr zufrieden.',          name: 'Anna W.',     role: 'Beagle-Mama, Frankfurt'          },
];

(function initSlider() {
  const track   = document.getElementById('tTrack');
  const counter = document.getElementById('tCounter');
  const slider  = document.getElementById('tSlider');
  const prevBtn = slider.querySelector('[data-dir="prev"]');
  const nextBtn = slider.querySelector('[data-dir="next"]');
  let current   = 0;

  track.innerHTML = TESTIMONIALS.map(t => `
    <div class="testimonial-slider__slide testimonial">
      <div class="testimonial__quote-mark"><span class="material-icons">format_quote</span></div>
      <p class="testimonial__text">${t.text}</p>
      <div class="rating">
        <span class="material-icons" aria-hidden="true">star</span><span class="material-icons" aria-hidden="true">star</span><span class="material-icons" aria-hidden="true">star</span><span class="material-icons" aria-hidden="true">star</span><span class="material-icons" aria-hidden="true">star</span>
      </div>
      <div class="testimonial__author">
        <div class="testimonial__avatar icon-box placeholder-bg"></div>
        <div><p class="testimonial__name">${t.name}</p><div class="testimonial__role">${t.role}</div></div>
      </div>
    </div>`).join('');

  const slides = track.querySelectorAll('.testimonial-slider__slide');

  function getVisible() {
    const w = window.innerWidth;
    if (w <= 767) return slides.length; // Mobile: alle sichtbar (vertikaler Stack via CSS)
    return w <= 1100 ? 2 : 3;
  }
  function getMaxPage() { return Math.max(0, slides.length - getVisible()); }
  function update() {
    const vis     = getVisible();
    const maxPage = getMaxPage();
    if (current > maxPage) current = maxPage;

    // .--visible setzen — auf Mobile braucht inuvet.css diese Klasse
    slides.forEach((s, idx) => {
      s.classList.toggle('--visible', idx >= current && idx < current + vis);
    });

    if (slides.length > 0 && vis < slides.length) {
      const slideWidth = slides[0].offsetWidth;
      const gap = slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft - slideWidth : 0;
      track.style.transform = `translateX(-${current * (slideWidth + gap)}px)`;
    } else {
      track.style.transform = 'translateX(0)';
    }
    if (counter) counter.textContent = `${current + 1} – ${Math.min(current + vis, slides.length)} / ${slides.length}`;
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current >= maxPage;
  }

  prevBtn.addEventListener('click', () => { if (current > 0) { current--; update(); } });
  nextBtn.addEventListener('click', () => { if (current < getMaxPage()) { current++; update(); } });

  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && current < getMaxPage()) current++;
      else if (diff < 0 && current > 0) current--;
      update();
    }
  });

  window.addEventListener('resize', update);
  update();
})();

// ── Init ────────────────────────────────────────────────────────────────
// Sichtbarkeit einmalig beim Load bestimmen — danach nicht mehr ändern.
initBundle();
applyVisibility();
if (bundleVisible) renderBundle();
requestAnimationFrame(() => {
  updateStickySummary();
  requestAnimationFrame(updateStickySummary);
});
updateCartBadge();
