/* inuvet-shop.js — seitenspezifische Logik für Inuvet-Shop.html */

// Warenkorb-Drawer ist in diesem Mockup nicht Teil des Flows — Icon/Badge bleiben sichtbar.
window.openCart = () => {};

window.quickAdd = (id, name) => {
  addToCart(id, 0, 0, 1);
  showToast(`${name} in den Warenkorb gelegt`);
};

const SHOP_POPUP_DELAYS = {
  rezept: 400,
  'contact-fr': 1000,
};

let shopPopupVariant = 'contact-fr';
let shopPopupTimer = null;

function closeAllShopPopups() {
  document.getElementById('practiceOptInOverlay')?.classList.remove('--open');
  document.getElementById('contactFrOverlay')?.classList.remove('--open');
  document.body.style.overflow = '';
}

function openPracticeOptIn() {
  closeAllShopPopups();
  const overlay = document.getElementById('practiceOptInOverlay');
  if (!overlay) return;
  overlay.classList.add('--open');
  document.body.style.overflow = 'hidden';
}

window.closePracticeOptIn = (accepted) => {
  const overlay = document.getElementById('practiceOptInOverlay');
  if (!overlay) return;
  overlay.classList.remove('--open');
  document.body.style.overflow = '';
  if (accepted) showToast('Danke — wir melden uns bei euch!');
};

function resetContactFrForm() {
  const form = document.getElementById('contactFrForm');
  form?.reset();
  document.querySelectorAll('#contactFrForm .choice-box.--active').forEach((btn) => {
    btn.classList.remove('--active');
  });
  document.getElementById('contactFrFormView')?.classList.remove('--hidden');
  document.getElementById('contactFrSuccessView')?.classList.add('--hidden');
}

function openContactFr() {
  closeAllShopPopups();
  resetContactFrForm();
  const overlay = document.getElementById('contactFrOverlay');
  if (!overlay) return;
  overlay.classList.add('--open');
  document.body.style.overflow = 'hidden';
}

window.closeContactFr = () => {
  document.getElementById('contactFrOverlay')?.classList.remove('--open');
  document.body.style.overflow = '';
};

window.selectContactRole = (btn) => {
  btn.closest('.btn-row')?.querySelectorAll('.choice-box').forEach((el) => {
    el.classList.remove('--active');
  });
  btn.classList.add('--active');
};

window.submitContactFr = (event) => {
  event.preventDefault();
  const form = document.getElementById('contactFrForm');
  if (!form?.reportValidity()) return;
  document.getElementById('contactFrFormView')?.classList.add('--hidden');
  document.getElementById('contactFrSuccessView')?.classList.remove('--hidden');
};

function openActiveShopPopup() {
  if (shopPopupVariant === 'contact-fr') openContactFr();
  else openPracticeOptIn();
}

function scheduleShopPopup() {
  clearTimeout(shopPopupTimer);
  shopPopupTimer = setTimeout(openActiveShopPopup, SHOP_POPUP_DELAYS[shopPopupVariant]);
}

window.setShopPopup = (variant, btn) => {
  shopPopupVariant = variant;
  document.querySelectorAll('#mockupBar [data-popup]').forEach((el) => {
    el.classList.toggle('--active', el === btn);
  });
  closeAllShopPopups();
  resetContactFrForm();
  scheduleShopPopup();
};

window.openShopPopupNow = () => {
  clearTimeout(shopPopupTimer);
  openActiveShopPopup();
};

window.resetShopPopups = () => {
  closeAllShopPopups();
  resetContactFrForm();
  scheduleShopPopup();
};

window.toggleMockupBar = () => {
  const bar = document.getElementById('mockupBar');
  const revive = document.getElementById('mockupRevive');
  const hide = !bar.classList.contains('--hidden');
  bar.classList.toggle('--hidden', hide);
  revive.classList.toggle('--visible', hide);
  document.body.classList.toggle('--mockup-bar-visible', !hide);
};

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  scheduleShopPopup();
});
