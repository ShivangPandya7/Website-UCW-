/* Sub-navigation — a sticky local menu for long pages. Highlights the section in view,
   and pre-selects the right fund in the enquiry letter when a fund's CTA is used. */
(function () {
  UC.register('subnav', '[data-subnav]', function (nav) {
    var links = UC.$$('a[href^="#"]', nav).filter(function (a) { return a.getAttribute('href').length > 1; });
    var targets = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (a) { a.classList.toggle('is-on', a.getAttribute('href') === '#' + e.target.id); });
        });
      }, { rootMargin: '-35% 0px -60% 0px' });
      targets.forEach(function (t) { if (t) io.observe(t); });
    }
    var hero = document.querySelector('.hero');
    function stuck() { nav.classList.toggle('is-stuck', hero ? hero.getBoundingClientRect().bottom < 80 : window.scrollY > 200); }
    window.addEventListener('scroll', function () { requestAnimationFrame(stuck); }, { passive: true }); stuck();
  });
  UC.register('fund-pick', '[data-fund-pick]', function (btn) {
    btn.addEventListener('click', function () {
      var code = btn.dataset.fundPick, f = (UC.site.funds || []).filter(function (x) { return x.code === code; })[0];
      var sel = document.querySelector('.letter select[name="fund"]');
      if (sel && f) { sel.value = f.name; sel.dispatchEvent(new Event('change')); }
    });
  });
})();
