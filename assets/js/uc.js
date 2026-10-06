/* UpperCrust — tiny module registry. Loaded first on every page. */
(function () {
  var UC = (window.UC = window.UC || {});
  UC.modules = UC.modules || [];
  UC.register = function (name, selector, init) { UC.modules.push({ name: name, selector: selector, init: init }); };
  UC.reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  UC.$ = function (sel, root) { return (root || document).querySelector(sel); };
  UC.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  UC.onceInView = function (el, cb, threshold) {
    if (!('IntersectionObserver' in window)) { cb(el); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { cb(e.target); io.unobserve(e.target); } });
    }, { threshold: threshold == null ? 0.3 : threshold });
    io.observe(el);
  };
  UC.inr = function (n) {
    n = Math.round(n);
    if (n >= 1e7) return '₹' + (n / 1e7).toLocaleString('en-IN', { maximumFractionDigits: 2 }) + ' Cr';
    if (n >= 1e5) return '₹' + (n / 1e5).toLocaleString('en-IN', { maximumFractionDigits: 2 }) + ' L';
    return '₹' + n.toLocaleString('en-IN');
  };
  UC.el = function (tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (html != null) n.innerHTML = html;
    return n;
  };
})();
