/* inuvet-Shop — seitenspezifische Logik */

// Praxis-Vorteile — Lottie-Dateinamen (assets/lotties/) eintragen
const PRAXIS_VORTEILE_LOTTIES = {
  nurBeiEuch:   'inuvet_tierarzt_nur_bei_euch.json',
  vertraeglich: 'Inuvet_animation_Weltweit.json',
  gruenePfoten: 'inuvet_animation_inhaltsstoffe.json',
};

function initPraxisVorteileLotties() {
  const map = [
    ['lottieNurBeiEuch',   PRAXIS_VORTEILE_LOTTIES.nurBeiEuch],
    ['lottieVertraeglich', PRAXIS_VORTEILE_LOTTIES.vertraeglich],
    ['lottieGruenePfoten', PRAXIS_VORTEILE_LOTTIES.gruenePfoten],
  ];
  map.forEach(([id, file]) => {
    if (!file) return;
    const el = document.getElementById(id);
    if (el) el.src = `../assets/lotties/${file}`;
  });
}

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
  initPraxisVorteileLotties();
  updateCartBadge();
  setTimeout(openPracticeOptIn, 400);
});
