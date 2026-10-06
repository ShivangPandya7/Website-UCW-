/* Adds .is-in once an element enters view. Used for drawn lines and charts — not for blanket fade-ins. */
(function () {
  UC.register('inview', '[data-inview]', function (el) {
    if (UC.reduced) { el.classList.add('is-in'); return; }
    UC.onceInView(el, function (t) { t.classList.add('is-in'); }, parseFloat(el.dataset.inview) || 0.3);
  });
})();
