/* The record — one compact, interactive panel: choose a fund and a period,
   see the return against its benchmark and the gap between them. Figures come from the performance sheet. */
(function () {
  var LABEL = { y1: '1-year return', y3: '3-year return (annualised)', si: 'return since inception (annualised)' };
  UC.register('record', '[data-record]', function (root) {
    var fund = 'UCWF', period = 'y3';
    var $ = function (s) { return root.querySelector(s); };
    function fmt(v) { return v.toFixed(2); }
    function render() {
      var f = UC.funds && UC.funds[fund]; if (!f || !f.returns) return;
      var fv = f.returns[period], bv = f.benchmark && f.benchmark.returns ? f.benchmark.returns[period] : null;
      if (fv == null) return;
      var max = Math.max(Math.abs(fv), Math.abs(bv || 0), 1);
      $('[data-rec-fund]').innerHTML = fmt(fv) + '<sup>%</sup>';
      $('[data-rec-caption]').textContent = fund + ', ' + LABEL[period] + (period === 'si' && f.inception ? ' · since ' + f.inception : '');
      $('[data-rec-name]').textContent = fund;
      $('[data-rec-bname]').textContent = f.benchmark ? f.benchmark.name : 'Benchmark';
      $('[data-rec-fval]').textContent = fmt(fv) + '%';
      $('[data-rec-bval]').textContent = bv == null ? '—' : fmt(bv) + '%';
      $('[data-rec-fbar]').style.width = Math.max(2, Math.abs(fv) / max * 100) + '%';
      $('[data-rec-bbar]').style.width = bv == null ? '0' : Math.max(2, Math.abs(bv) / max * 100) + '%';
      var d = bv == null ? null : fv - bv;
      $('[data-rec-delta]').textContent = d == null ? '' : (d >= 0 ? 'Ahead of the benchmark by ' : 'Behind the benchmark by ') + Math.abs(d).toFixed(2) + ' percentage points' + (period === 'y1' ? '.' : ' a year.');
      root.classList.remove('is-anim'); void root.offsetWidth; root.classList.add('is-anim');
    }
    UC.$$('[data-fund]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        fund = b.dataset.fund;
        UC.$$('[data-fund]', root).forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
        render();
      });
    });
    UC.$$('[data-period]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        period = b.dataset.period;
        UC.$$('[data-period]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        render();
      });
    });
    render();
  });
})();
