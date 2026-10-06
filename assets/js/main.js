/* Boot — waits for content (if a loader is present), then runs every registered module. Loaded last. */
(function () {
  var UC = window.UC;
  function boot() {
    UC.modules.forEach(function (m) {
      UC.$$(m.selector).forEach(function (el) {
        try { m.init(el); } catch (err) { console.error('[UC] ' + m.name, err); }
      });
    });
    document.documentElement.classList.add('is-ready');
  }
  function start() { (UC.ready || Promise.resolve()).then(boot, boot); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
