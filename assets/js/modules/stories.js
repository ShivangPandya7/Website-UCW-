/* Client stories — highlights the chapter being read in the running index. */
(function () {
  UC.register('stories', '[data-stories]', function (root) {
    var links = UC.$$('[data-toc]', root);
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) { l.setAttribute('aria-current', String(l.dataset.toc === e.target.id)); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    UC.$$('.chapter', root).forEach(function (c) { io.observe(c); });
  });
})();
