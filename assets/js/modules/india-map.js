/* Where we are — a gold dot-matrix map of India with our cities pinned, Dubai across the Arabian Sea.
   Hover or tap a pin (or a city in the list) to see that city. */
(function () {
  // Dot grid comes from data/india-dots.js (India’s official boundary, incl. J&K and Ladakh).
  var M = UC.mapDots, LON0 = M.lon0, LON1 = M.lon1, LAT0 = M.lat0, LAT1 = M.lat1, W = M.w, H = M.h;
  function X(lon) { return (lon - LON0) / (LON1 - LON0) * W; }
  function Y(lat) { return (LAT0 - lat) / (LAT0 - LAT1) * H; }
  UC.register('india-map', '[data-map]', function (root) {
    var svg = root.querySelector("[data-map-svg]"), dots = "";
    M.dots.forEach(function (d) { dots += '<circle cx="' + d[0] + '" cy="' + d[1] + '" r="' + M.r + '"/>'; });
    var pins = UC.$$('[data-pin]', root), html = '';
    pins.forEach(function (b) {
      var x = X(+b.dataset.lon), y = Y(+b.dataset.lat);
      b.style.left = (x / W * 100) + '%'; b.style.top = (y / H * 100) + '%';
    });
    var mum = [X(72.88), Y(19.08)], dxb = [X(55.27), Y(25.2)];
    var arc = 'M' + dxb[0] + ',' + dxb[1] + ' Q' + ((mum[0] + dxb[0]) / 2) + ',' + (Math.min(mum[1], dxb[1]) - 90) + ' ' + mum[0] + ',' + mum[1];
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.innerHTML = '<g class="map-dots">' + dots + '</g><path class="map-arc" d="' + arc + '"/>';

    var cards = UC.$$('[data-city-card]', root), list = UC.$$('[data-city-pick]', root);
    function show(name) {
      pins.forEach(function (p) { p.classList.toggle('is-on', p.dataset.pin === name); p.setAttribute('aria-pressed', String(p.dataset.pin === name)); });
      list.forEach(function (l) { l.classList.toggle('is-on', l.dataset.cityPick === name); });
      cards.forEach(function (c) { c.classList.toggle('is-on', c.dataset.cityCard === name); });
    }
    pins.concat(list).forEach(function (el) {
      var name = el.dataset.pin || el.dataset.cityPick;
      el.addEventListener('click', function () { show(name); });
      el.addEventListener('mouseenter', function () { if (window.matchMedia('(hover:hover)').matches) show(name); });
      el.addEventListener('focus', function () { show(name); });
    });
    show('Vadodara');
  });
})();
