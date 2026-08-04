/* List-Collections — Mockup: Shopify show_title / show_description
   Pattern analog Collection.html (URL-Params, Mockup-Bar an/aus). */
(function () {
  const params = new URLSearchParams(location.search);
  const paramOn = (key, fallback = false) => {
    const v = (params.get(key) ?? '').toLowerCase();
    if (['1', 'true', 'on'].includes(v)) return true;
    if (['0', 'false', 'off'].includes(v)) return false;
    return fallback;
  };

  // Shopify-Default: beide aus (wie Collection)
  let showTitle = paramOn('title', false);
  let showDescription = paramOn('description', false);

  const syncUrl = () => {
    const url = new URL(location.href);
    if (showTitle) url.searchParams.set('title', '1');
    else url.searchParams.delete('title');
    if (showDescription) url.searchParams.set('description', '1');
    else url.searchParams.delete('description');
    history.replaceState(null, '', url);
  };

  const applyIntro = () => {
    const intro = document.getElementById('collectionIntro');
    const title = document.getElementById('collectionTitle');
    const desc = document.getElementById('collectionDesc');
    if (!intro || !title || !desc) return;
    const any = showTitle || showDescription;
    intro.hidden = !any;
    title.hidden = !showTitle;
    desc.hidden = !showDescription;
    document.getElementById('mockTitleOn')?.classList.toggle('--active', showTitle);
    document.getElementById('mockTitleOff')?.classList.toggle('--active', !showTitle);
    document.getElementById('mockDescOn')?.classList.toggle('--active', showDescription);
    document.getElementById('mockDescOff')?.classList.toggle('--active', !showDescription);
  };

  const setShowTitle = (on) => {
    showTitle = on;
    applyIntro();
    syncUrl();
  };

  const setShowDescription = (on) => {
    showDescription = on;
    applyIntro();
    syncUrl();
  };

  const init = () => {
    applyIntro();
    document.getElementById('mockTitleOn')?.addEventListener('click', () => setShowTitle(true));
    document.getElementById('mockTitleOff')?.addEventListener('click', () => setShowTitle(false));
    document.getElementById('mockDescOn')?.addEventListener('click', () => setShowDescription(true));
    document.getElementById('mockDescOff')?.addEventListener('click', () => setShowDescription(false));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
