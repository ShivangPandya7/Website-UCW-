/* Growth calculator — illustration of compounding. Same arithmetic as the original site:
   year 1 grows the lumpsum; from year 2 the annual top-up is added before growth.
   <div data-calc> with [data-rate-source] (radio group or range), and ranges named lumpsum, topup, years. */
(function () {
  UC.register('calculator', '[data-calc]', function (root) {
    var form = root.querySelector('form');
    var out = {
      value: root.querySelector('[data-out="value"]'),
      invested: root.querySelector('[data-out="invested"]'),
      gain: root.querySelector('[data-out="gain"]'),
      basis: root.querySelector('[data-out="basis"]'),
      chart: root.querySelector('[data-out="chart"]')
    };
    // fund rates come from the admin panel when available
    UC.$$('input[name="rate"][data-fund]', form).forEach(function (r) {
      var f = UC.funds && UC.funds[r.dataset.fund];
      var y3 = f && f.returns && f.returns.y3; if (y3) { r.value = y3; r.dataset.label = r.dataset.fund + '’s 3-year return of ' + y3.toFixed(2) + '%'; var b = r.parentNode.querySelector('b'); if (b) b.textContent = y3.toFixed(2) + '%'; }
    });
    function rate() {
      var r = form.querySelector('input[name="rate"]:checked') || form.querySelector('input[name="rate"]');
      return { value: parseFloat(r.value), label: r.type === 'range' ? r.value + '% assumed return' : (r.dataset.label || r.value + '%') };
    }
    function chart(series, invested) {
      var W = 600, H = 220, max = Math.max.apply(null, series);
      function X(i) { return i * W / (series.length - 1 || 1); }
      function Y(v) { return H - (v / max) * (H - 12); }
      function path(arr) { return arr.map(function (v, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ',' + Y(v).toFixed(1); }).join(' '); }
      var a1 = path(series) + ' L' + W + ',' + H + ' L0,' + H + ' Z';
      var a2 = path(invested) + ' L' + W + ',' + H + ' L0,' + H + ' Z';
      out.chart.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true">' +
        '<path d="' + a1 + '" class="cc-grow"/><path d="' + a2 + '" class="cc-inv"/>' +
        '<path d="' + path(series) + '" class="cc-line"/></svg>';
    }
    function update() {
      var r = rate();
      var lump = +form.lumpsum.value, top = +form.topup.value, years = +form.years.value;
      UC.$$('[data-show]', root).forEach(function (o) {
        var v = +form[o.dataset.show].value;
        o.textContent = o.dataset.show === 'years' ? v + (v === 1 ? ' year' : ' years') : o.dataset.show === 'rate' ? v + '%' : UC.inr(v);
      });
      var bal = lump, inv = lump, s = [bal], si = [inv];
      for (var y = 1; y <= years; y++) {
        if (y > 1) { bal += top; inv += top; }
        bal *= 1 + r.value / 100;
        s.push(bal); si.push(inv);
      }
      out.value.textContent = UC.inr(bal);
      out.invested.textContent = UC.inr(inv);
      out.gain.textContent = UC.inr(bal - inv);
      out.basis.textContent = 'At ' + r.label + ', over ' + years + (years === 1 ? ' year' : ' years');
      chart(s, si);
      UC.$$('input[type="range"]', form).forEach(function (rg) {
        rg.style.setProperty('--p', ((rg.value - rg.min) / (rg.max - rg.min) * 100) + '%');
      });
    }
    form.addEventListener('input', update);
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    update();
  });
})();
