/* inuvet-Shop — seitenspezifische Logik */

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
  setTimeout(openPracticeOptIn, 400);
});
