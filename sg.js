// ─── Modal ───
function openModal(id) {
  document.getElementById(id).classList.add('--open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('--open');
  document.body.style.overflow = '';
}
function openShopModal(id) {
  document.getElementById(id).classList.add('--open');
  document.body.style.overflow = 'hidden';
}
function closeShopModal(id) {
  document.getElementById(id).classList.remove('--open');
  document.body.style.overflow = '';
}

// Escape closes menu + modals + cart drawers
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeMobile();
    document.querySelectorAll('.modal-overlay.--open').forEach(function(m) { closeModal(m.id); });
    document.querySelectorAll('.shop-modal-overlay.--open').forEach(function(m) { closeShopModal(m.id); });
    if (document.getElementById('cartFull')?.classList.contains('--open')) closeCart('cartFull');
    if (document.getElementById('cartEmpty')?.classList.contains('--open')) closeCart('cartEmpty');
  }
});

// ─── Toast ───
function showToast(message, type) {
  type = type || 'info';
  var icons = { success: 'check_circle', error: 'error', info: 'info' };
  var container = document.getElementById('toastContainer');
  if (!container) return;
  var toast = document.createElement('div');
  toast.className = 'toast --' + type;
  toast.innerHTML = '<span class="material-icons">' + (icons[type] || 'info') + '</span><span>' + message + '</span>';
  container.appendChild(toast);
  setTimeout(function() {
    toast.classList.add('--out');
    setTimeout(function() { toast.remove(); }, 300);
  }, 3500);
}


// File upload
var zone = document.getElementById('uploadZone');
if (zone) {
  zone.addEventListener('dragover', function(e) { e.preventDefault(); zone.classList.add('--dragover'); });
  zone.addEventListener('dragleave', function() { zone.classList.remove('--dragover'); });
  zone.addEventListener('drop', function(e) {
    e.preventDefault();
    zone.classList.remove('--dragover');
    handleFiles(e.dataTransfer.files);
  });
}

// Accordion
function toggleAccordion(trigger) {
  var item = trigger.parentElement;
  var isOpen = item.classList.toggle('--open');
  trigger.setAttribute('aria-expanded', isOpen);
}

function handleFiles(files) {
  var list = document.getElementById('fileList');
  for (var i = 0; i < files.length; i++) {
    var size = (files[i].size / 1024).toFixed(0);
    var item = document.createElement('div');
    item.className = 'form-upload__file';
    item.innerHTML = '<span>' + files[i].name + ' <span class="text-muted">(' + size + ' KB)</span></span>' +
      '<button class="form-upload__remove" onclick="this.parentElement.remove()">×</button>';
    list.appendChild(item);
  }
}

// ─── Testimonial Grid: initTestimonials + showMore → inuvet.js ───

// ─── Testimonial Slider ───
// initSliders + showMoreSlider → inuvet.js
initSliders();

// ─── PDP ───
function selectVariant(btn) {
  btn.parentElement.querySelectorAll('.choice-box').forEach(function(b) { b.classList.remove('--active'); });
  btn.classList.add('--active');
}
function switchAccTab(btn, targetId) {
  var nav = btn.closest('.tab-nav');
  nav.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('--active'); b.setAttribute('aria-selected','false'); });
  btn.classList.add('--active'); btn.setAttribute('aria-selected','true');
  var panels = nav.nextElementSibling;
  while (panels) { if (panels.classList.contains('tab-panel')) panels.classList.remove('--active'); panels = panels.nextElementSibling; }
  document.getElementById(targetId).classList.add('--active');
}
function switchTab(btn, index) {
  var tabs = btn.closest('.tabs');
  tabs.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('--active'); b.setAttribute('aria-selected', 'false'); });
  tabs.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('--active'); });
  btn.classList.add('--active');
  btn.setAttribute('aria-selected', 'true');
  tabs.querySelectorAll('.tab-panel')[index].classList.add('--active');
}
function selectCheckout(btn) {
  btn.parentElement.querySelectorAll('.choice-box').forEach(function(b) { b.classList.remove('--active'); });
  btn.classList.add('--active');
}
function changeQty(delta) {
  var input = document.getElementById('qtyInput');
  var val = parseInt(input.value) + delta;
  if (val < 1) val = 1;
  input.value = val;
}

// ─── Cart Drawer ───
function openCart(id) {
  id = id || 'cartFull';
  var overlayId = id === 'cartFull' ? 'overlayFull' : 'overlayEmpty';
  var overlay = document.getElementById(overlayId);
  var drawer  = document.getElementById(id);
  if (!overlay || !drawer) return;
  overlay.classList.add('--open');
  drawer.classList.add('--open');
  document.body.style.overflow = 'hidden';
}
function closeCart(id) {
  id = id || 'cartFull';
  var overlayId = id === 'cartFull' ? 'overlayFull' : 'overlayEmpty';
  var overlay = document.getElementById(overlayId);
  var drawer  = document.getElementById(id);
  if (!overlay || !drawer) return;
  overlay.classList.remove('--open');
  drawer.classList.remove('--open');
  document.body.style.overflow = '';
}

// ─── Collection Filter ───
function openFilter() {
  document.getElementById('filterSidebar').classList.add('--open');
  document.getElementById('filterOverlay').classList.add('--open');
  document.body.style.overflow = 'hidden';
}
function closeFilter() {
  document.getElementById('filterSidebar').classList.remove('--open');
  document.getElementById('filterOverlay').classList.remove('--open');
  document.body.style.overflow = '';
}

// ─── Scroll Animations ───
(function() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('--in-view');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -4% 0px' });

  function animate(el, delay) {
    el.setAttribute('data-animate', '');
    if (delay) el.style.setProperty('--anim-delay', delay + 'ms');
    observer.observe(el);
  }

  // Section types (full-bleed content blocks)
  document.querySelectorAll('.section-type').forEach(function(el) {
    animate(el);
  });

  // Newsletter block
  document.querySelectorAll('.newsletter').forEach(function(el) {
    animate(el);
  });

  // Marquee / Banner
  document.querySelectorAll('.marquee').forEach(function(el) {
    animate(el);
  });

  // Tiles — staggered per grid
  document.querySelectorAll('.tile-grid').forEach(function(grid) {
    grid.querySelectorAll('.tile').forEach(function(tile, i) {
      animate(tile, Math.min(i, 5) * 70);
    });
  });

  // Testimonials in grids — staggered
  document.querySelectorAll('.testimonial-grid').forEach(function(grid) {
    grid.querySelectorAll('.testimonial').forEach(function(t, i) {
      animate(t, Math.min(i, 5) * 70);
    });
  });

  // Testimonial slider slides
  document.querySelectorAll('.testimonial-slider__slide').forEach(function(el) {
    animate(el);
  });
})();

// ─── SEARCH ───────────────────────────────────────────
const SEARCH_DATA = {
  queries: [
    { text: 'Beruhigung' },
    { text: 'Leber' },
    { text: 'Calmin balance' },
  ],
  products: [
    { name: 'Hepax forte', meta: 'Leber', price: '44,90 €', img: 'assets/images/Hepax_Packshot_01.jpeg', imgHover: 'assets/images/Hepax_Packshot_02.png' },
    { name: 'Calmin balance', meta: 'Beruhigung', price: '39,90 €', img: 'assets/images/Calmin_Packshot_01.jpeg', imgHover: 'assets/images/Calmin_Packshot_02.png' },
    { name: 'Hepax forte', meta: 'Leber', price: '44,90 €', img: 'assets/images/Hepax_Packshot_01.jpeg', imgHover: 'assets/images/Hepax_Packshot_02.png' },
  ]
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
    html += `<div class="search-results__section">
      <div class="section-label">Vorschläge</div>`;
    matchedQueries.forEach((qr, i) => {
      html += `<div class="search-result" role="option" data-index="${i}" onclick="closeSearch()">
        <div class="icon-box --lg"><span class="material-icons">search</span></div>
        <div class="search-result__info"><p class="search-result__name">${qr.text}</p></div>
      </div>`;
    });
    html += `</div>`;
  }

  if (matchedProducts.length) {
    html += `<div class="search-results__section">
      <div class="section-label">Produkte</div>`;
    matchedProducts.forEach((p, i) => {
      html += `<div class="search-result" role="option" data-index="${matchedQueries.length + i}" onclick="closeSearch()">
        <div class="search-result__image product-thumb"><img src="${p.img}" alt="${p.name}">${p.imgHover ? `<img src="${p.imgHover}" alt="">` : ''}</div>
        <div class="search-result__info">
          <p class="search-result__name">${p.name}</p>
          <div class="search-result__meta">${p.meta}</div>
        </div>
        <div class="search-result__price">${p.price}</div>
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
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      searchActiveIndex = Math.min(searchActiveIndex + 1, items.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      searchActiveIndex = Math.max(searchActiveIndex - 1, -1);
    } else if (e.key === 'Enter' && searchActiveIndex >= 0) {
      items[searchActiveIndex].click();
      return;
    } else if (e.key === 'Escape') {
      closeSearch();
      return;
    }

    items.forEach((item, i) => item.classList.toggle('--active', i === searchActiveIndex));
    if (searchActiveIndex >= 0) items[searchActiveIndex].scrollIntoView({ block: 'nearest' });
  });
});

(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
  requestAnimationFrame(() => {
    document.querySelectorAll('.announcement-bar.--marquee .announcement-bar__track').forEach(track => {
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
});



// ─── PDP Thumbnail Switcher ───
function openOptionsDrawer() {
  document.getElementById('sgOptionsOverlay').classList.add('--open');
  document.getElementById('sgOptionsDrawer').classList.add('--open');
  document.body.style.overflow = 'hidden';
}
function closeOptionsDrawer() {
  document.getElementById('sgOptionsOverlay').classList.remove('--open');
  document.getElementById('sgOptionsDrawer').classList.remove('--open');
  document.body.style.overflow = '';
}

function pdpSwitch(el, src, captionText, authorText) {
  var pdp = el.closest('.pdp');
  if (!pdp) return;
  var main = pdp.querySelector('.pdp__main-image');
  var img = main.querySelector('img');
  var video = main.querySelector('video');
  var isVideo = /\.mp4(\?|$)/i.test(src);

  pdp.querySelectorAll('.pdp__thumbs .pdp__thumb').forEach(function(t) {
    t.classList.remove('--active');
  });
  el.classList.add('--active');

  if (isVideo && video) {
    if (img) img.classList.add('--hidden');
    video.classList.remove('--hidden');
    if (video.getAttribute('src') !== src) video.setAttribute('src', src);
    video.play().catch(function() {});
  } else if (img) {
    if (video) {
      video.pause();
      video.classList.add('--hidden');
    }
    img.classList.remove('--hidden');
    img.src = src;
  }

  var cap = main.querySelector('.pdp__caption');
  if (!cap) return;
  var show = captionText || authorText;
  if (show) {
    cap.innerHTML = captionText
      + (authorText ? '<span class="pdp__caption-author">' + authorText + '</span>' : '');
    cap.classList.remove('--hidden');
  } else {
    cap.classList.add('--hidden');
  }
}

/* D.1 Demo: Scroll-Away-Modus live umschalten (body.--ann-scroll).
   Schaltet die echte Announcement Bar oben auf dieser Seite um. */
function toggleAnnScrollDemo(btn) {
  var on = document.body.classList.toggle('--ann-scroll');
  btn.classList.toggle('--primary', on);
  btn.classList.toggle('--secondary', !on);
  btn.textContent = on ? 'Scroll-Away deaktivieren' : 'Scroll-Away aktivieren';
}

/* ─── Styleguide v2: Scrollspy — aktuellen Abschnitt in der Sidebar markieren ───
   Tut nichts im alten Guide (kein .sg-sidebar / .sg-section-v2). */
(function () {
  var sidebar = document.querySelector('.sg-sidebar');
  if (!sidebar) return;
  var sections = Array.prototype.slice.call(document.querySelectorAll('.sg-section-v2[id]'));
  if (!sections.length) return;

  var links = {};
  sidebar.querySelectorAll('a[href^="#"]').forEach(function (a) {
    links[a.getAttribute('href').slice(1)] = a;
  });

  var current = null;

  // Aktiven Link in der scrollbaren Sidebar sichtbar halten (ohne das Fenster zu scrollen)
  function keepVisible(link) {
    var lr = link.getBoundingClientRect();
    var cr = sidebar.getBoundingClientRect();
    if (lr.top < cr.top) sidebar.scrollTop -= (cr.top - lr.top) + 8;
    else if (lr.bottom > cr.bottom) sidebar.scrollTop += (lr.bottom - cr.bottom) + 8;
  }

  function setActive(id) {
    if (id === current) return;
    current = id;
    sidebar.querySelectorAll('a.--active').forEach(function (a) { a.classList.remove('--active'); });
    var link = links[id];
    if (!link) return;
    link.classList.add('--active');
    keepVisible(link);
  }

  function update() {
    // Aktiv = letzte Section, deren Oberkante über der Aktivierungslinie liegt
    var line = 140;
    var active = sections[0];
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= line) active = sections[i];
      else break;
    }
    setActive(active.id);
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { update(); ticking = false; });
  }, { passive: true });

  update();
})();
