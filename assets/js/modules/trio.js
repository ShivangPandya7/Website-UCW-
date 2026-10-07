/* Three funds on mobile — a swipeable row that opens on the flagship, with tabs that follow the swipe. */
(function () {
  UC.register('trio', '[data-trio]', function (rail) {
    var tabs = UC.$$('[data-trio-go]', rail.parentNode), mq = window.matchMedia('(max-width:900px)');
    function card(id) { return rail.querySelector('#' + id); }
    function goTo(id, smooth) {
      var c = card(id); if (!c) return;
      rail.scrollTo({ left: c.offsetLeft - (rail.clientWidth - c.clientWidth) / 2, behavior: smooth ? 'smooth' : 'auto' });
    }
    function mark(id) { tabs.forEach(function (t) { t.setAttribute('aria-selected', String(t.dataset.trioGo === id)); }); }
    tabs.forEach(function (t) { t.addEventListener('click', function () { goTo(t.dataset.trioGo, true); mark(t.dataset.trioGo); }); });
    var raf = 0;
    rail.addEventListener('scroll', function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        var mid = rail.scrollLeft + rail.clientWidth / 2, best = null, d = 1e9;
        UC.$$('.tcard3', rail).forEach(function (c) { var m = Math.abs(c.offsetLeft + c.clientWidth / 2 - mid); if (m < d) { d = m; best = c.id; } });
        if (best) mark(best);
      });
    }, { passive: true });
    if (mq.matches) requestAnimationFrame(function () { goTo('ucwf', false); });
  });
})();
