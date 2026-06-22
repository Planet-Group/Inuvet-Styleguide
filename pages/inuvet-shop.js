/* inuvet-Shop — seitenspezifische Logik */

// Warenkorb-Drawer ist in diesem Mockup nicht Teil des Flows — Icon/Badge bleiben sichtbar.
window.openCart = () => {};

window.quickAdd = (id, name) => {
  addToCart(id, 0, 0, 1);
  showToast(`${name} in den Warenkorb gelegt`);
};

function openPracticeOptIn() {
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

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  setTimeout(openPracticeOptIn, 400);
});
