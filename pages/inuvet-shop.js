/* inuvet-Shop — seitenspezifische Logik */

window.quickAdd = (id, name) => {
  addToCart(id, 0, 0, 1);
  showToast(`${name} in den Warenkorb gelegt`);
  openCart();
};
