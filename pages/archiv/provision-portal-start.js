function switchTab(btn, panelId) {
  btn.closest('.tabs').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('--active'));
  btn.classList.add('--active');
  const option = btn.closest('.portal-start__option');
  option.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('--active'));
  option.querySelector('#' + panelId).classList.add('--active');
}

function openRegisterModal() {
  document.getElementById('registerModal').classList.add('--open');
}

function closeRegisterModal() {
  document.getElementById('registerModal').classList.remove('--open');
}

function submitRegister(e) {
  e.preventDefault();
  openRegisterModal();
}

function submitLogin(e) {
  e.preventDefault();
  window.location.href = 'Provision-Portal.html';
}
