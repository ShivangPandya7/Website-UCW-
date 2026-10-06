/* Where we are — a gold dot-matrix map of India with our cities pinned, Dubai across the Arabian Sea.
   Hover or tap a pin (or a city in the list) to see that city. */
(function () {
  // Simplified outline of India (lon, lat). Stylised, not cartographic.
  var INDIA = [[68.2,23.7],[68.8,22.3],[70.0,20.8],[72.6,21.1],[72.8,19.0],[73.4,16.5],[74.1,14.8],[74.8,12.8],[75.8,11.2],[76.3,9.9],[77.5,8.1],[78.2,8.9],[79.1,10.3],[79.9,10.3],[79.8,12.0],[80.3,13.1],[80.1,15.5],[81.3,16.4],[82.3,17.0],[83.3,17.7],[85.0,19.3],[86.5,20.2],[87.0,21.5],[88.2,21.7],[89.0,22.0],[88.7,24.3],[88.1,26.5],[89.8,26.7],[92.0,26.9],[94.0,27.5],[95.4,28.0],[97.2,28.0],[96.6,27.0],[95.2,26.6],[94.6,25.2],[94.3,24.0],[93.3,23.9],[92.6,22.0],[91.6,23.4],[91.9,25.1],[90.0,25.3],[88.4,26.0],[87.5,26.5],[85.0,27.0],[83.3,27.4],[81.0,28.5],[80.1,28.8],[79.0,30.0],[78.5,31.2],[78.9,32.6],[79.5,33.0],[78.0,34.5],[77.8,35.5],[76.0,35.8],[74.4,35.0],[73.8,34.3],[74.6,33.0],[75.0,32.3],[74.6,31.5],[74.0,30.2],[73.0,29.5],[71.9,27.9],[70.6,27.7],[69.6,26.8],[70.2,25.7],[69.2,24.4]];
  var UAE = [[51.6,24.2],[54.0,24.1],[55.6,25.6],[56.3,26.2],[56.4,24.9],[55.9,24.0],[55.2,22.7],[52.6,22.9]];
  var LON0 = 53.5, LON1 = 97.8, LAT0 = 36.2, LAT1 = 7.4, W = 1000, K = Math.cos(22 * Math.PI / 180);
  var H = Math.round(W * (LAT0 - LAT1) / ((LON1 - LON0) * K));
  function X(lon) { return (lon - LON0) / (LON1 - LON0) * W; }
  function Y(lat) { return (LAT0 - lat) / (LAT0 - LAT1) * H; }
  function inside(p, poly) {
    var c = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var a = poly[i], b = poly[j];
      if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c;
    }
    return c;
  }
  UC.register('india-map', '[data-map]', function (root) {
    var svg = root.querySelector("[data-map-svg]"), step = 0.48, dots = '';
    for (var lat = LAT0; lat > LAT1; lat -= step) {
      for (var lon = LON0; lon < LON1; lon += step / K * 0.92) {
        var p = [lon, lat];
        if (inside(p, INDIA) || inside(p, UAE)) dots += '<circle cx="' + X(lon).toFixed(1) + '" cy="' + Y(lat).toFixed(1) + '" r="3.3"/>';
      }
    }
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
