/* Bind — keeps every published figure in sync with the admin panel.
   <span data-bind="UCWF.returns.si">15.71</span>  → value from the performance sheet */
(function () {
  UC.register('bind', '[data-bind]', function (el) {
    var key = el.dataset.bind, root = UC.funds;
    if (key.indexOf('site:') === 0) { root = UC.site; key = key.slice(5); }
    var path = key.split('.'), v = root;
    for (var i = 0; i < path.length && v != null; i++) v = v[path[i]];
    if (v == null || v === '') return;
    el.textContent = typeof v === 'number' ? v.toFixed(2) : v;
  });
})();
