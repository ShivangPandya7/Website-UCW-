/* Content loader — reads the JSON files the admin panel edits (content/*.json) and merges them
   over the built-in defaults, then lets the page boot. If the files can't be read
   (e.g. opened straight from disk), the built-in defaults are used. */
(function () {
  var UC = window.UC;
  function get(name) {
    return fetch('content/' + name + '.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
  }
  function merge(a, b) { Object.keys(b || {}).forEach(function (k) { if (b[k] !== '' && b[k] != null) a[k] = b[k]; }); return a; }
  // Performance spreadsheet: a Google Sheet published as CSV (link set in the admin panel), else content/performance.csv
  function csv(text) {
    var rows = text.trim().split(/\r?\n/).map(function (l) { return l.split(',').map(function (c) { return c.trim(); }); });
    var head = rows.shift(); return rows.map(function (r) { var o = {}; head.forEach(function (h, i) { o[h] = r[i] || ''; }); return o; });
  }
  function applySheet(text) {
    if (!text) return;
    var keys = ['m1', 'm3', 'm6', 'y1', 'y2', 'y3', 'y4', 'y5', 'si'];
    csv(text).forEach(function (r) {
      var f = UC.funds[r.code]; if (!f) return;
      var ret = {}; keys.forEach(function (k) { if (r[k] !== '') ret[k] = parseFloat(r[k]); });
      if (r.row === 'fund') {
        f.returns = ret; if (r.name) f.name = r.name; if (r.aum_cr) f.aum = parseFloat(r.aum_cr);
        if (r.as_of) UC.funds.asOf = r.as_of; if (r.publish) f.publish = /^y/i.test(r.publish);
      } else if (r.row === 'benchmark') { f.benchmark = { name: r.name, returns: ret }; }
    });
  }
  function sheet(site) {
    var url = site && site.sheetCsvUrl ? site.sheetCsvUrl : 'content/performance.csv';
    return fetch(url, { cache: 'no-cache' }).then(function (r) { return r.ok ? r.text() : null; }).then(applySheet).catch(function () {});
  }
  var timeout = new Promise(function (res) { setTimeout(res, 2500); });
  var load = location.protocol === 'file:' ? Promise.resolve() : Promise.all([get('site'), get('funds'), get('insights'), get('team'), get('images'), get('documents')]).then(function (r) {
    var site = r[0], funds = r[1], insights = r[2], team = r[3], images = r[4], documents = r[5];
    if (site) { merge(UC.site.contact, site.contact); if (site.event) UC.site.event = merge(UC.site.event || {}, site.event); UC.site.stats = site.stats; UC.site.sebi = site.sebiRegistration; if (site.formEndpoint) UC.site.formEndpoint = site.formEndpoint; if (site.leadEndpoint) UC.site.leadEndpoint = site.leadEndpoint; }
    if (funds && funds.asOf) UC.funds.asOf = funds.asOf;
    UC.content = UC.content || {};
    if (insights && insights.items) UC.content.insights = insights.items;
    if (team && team.members) UC.content.team = team.members;
    if (documents && documents.items) UC.content.documents = documents.items;
    if (site && site.compliance) UC.site.compliance = site.compliance;
    if (images && images.slots) Object.keys(images.slots).forEach(function (k) {
      var p = images.slots[k]; if (p && UC.images[k]) { UC.images[k].src = p.replace(/^\//, ''); UC.images[k].own = true; }
    });
    return sheet(site);
  });
  UC.ready = Promise.race([load, timeout]);
})();
