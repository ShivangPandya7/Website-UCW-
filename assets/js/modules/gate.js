/* Research library — a short form (name, mobile, email) opens the notes and documents.
   Details go to the lead endpoint (Google Apps Script → Google Sheet) set in the admin panel.
   The visitor stays unlocked on this device afterwards. Links like resources.html#note-defence
   open straight to that note once unlocked. */
(function () {
  var KEY = 'uc-research-room';
  function remember(who) { try { localStorage.setItem(KEY, JSON.stringify(who)); } catch (e) {} }
  function saved() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function esc(t) { return String(t || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mail(subject) { return 'mailto:' + (UC.site.contact.leadEmail || UC.site.contact.email) + '?subject=' + encodeURIComponent(subject); }

  function noteHTML(n) {
    var body = (n.body || '').split(/\n\s*\n/).filter(Boolean).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
    var pdf = n.file ? '<a class="link" href="' + n.file + '" target="_blank" rel="noopener">Download PDF</a>' : '';
    return '<article class="rnote" id="note-' + esc(n.id) + '"><span class="rnote__kind">' + esc(n.kind) + '</span><h3>' + esc(n.title) + '</h3><p>' + esc(n.summary) + '</p>' +
      (body ? '<details class="rnote__more"><summary>Read the note</summary><div class="rnote__body">' + body + '</div></details>' : '') +
      '<div class="rnote__foot"><span>' + esc(n.readTime) + '</span>' + pdf + '</div></article>';
  }
  function docHTML(d, i) {
    var cta = d.file ? '<button type="button" class="btn rdoc__dl" data-doc="' + i + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14"/></svg>Download PDF</button>' : '<span class="rdoc__soon">Available shortly</span>';
    return '<article class="rdoc"><span class="rnote__kind">' + esc(d.kind) + '</span><h3>' + esc(d.title) + '</h3><p>' + esc(d.summary) + '</p><div class="rdoc__foot">' + cta + '</div></article>';
  }

  UC.register('gate', '[data-gate]', function (root) {
    var form = root.querySelector('[data-gate-form]'), status = root.querySelector('[data-gate-status]');
    var lockedView = root.querySelector('[data-gate-locked]'), openView = root.querySelector('[data-gate-open]');
    var hello = root.querySelector('[data-gate-hello]');
    var notes = UC.content && UC.content.insights;
    if (notes && notes.length) root.querySelector('[data-gate-list]').innerHTML = notes.map(noteHTML).join('');
    // a download elsewhere on the page introduces the visitor too, so the notes open for them as well
    document.addEventListener('uc:identified', function (e) { if (lockedView && !lockedView.hidden) unlock(e.detail, true); });

    function openTarget() {
      var id = location.hash.slice(1); if (!id) return;
      var el = document.getElementById(id); if (!el) return;
      var d = el.querySelector('details'); if (d) d.open = true;
      setTimeout(function () { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 250);
    }
    function unlock(who, animate) {
      if (hello && who && who.name) hello.textContent = 'Welcome, ' + who.name.split(' ')[0] + '.';
      lockedView.hidden = true; openView.hidden = false;
      root.classList.add('is-open'); if (animate) openView.classList.add('is-arriving');
      openTarget();
    }
    var me = saved(); if (me) unlock(me, false);
    else if (/^#note-/.test(location.hash)) setTimeout(function () { root.scrollIntoView({ behavior: 'smooth' }); }, 300);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim(), phone = form.phone.value.trim(), email = form.email.value.trim();
      var ok = name.length > 1 && /^[+\d][\d\s-]{8,}$/.test(phone) && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
      if (!ok) { status.textContent = 'Please add your name, a valid mobile number and email address.'; status.className = 'gate__status is-error'; return; }
      var lead = { type: 'resources', name: name, phone: phone, email: email, page: location.pathname + location.hash, at: new Date().toISOString() };
      var url = UC.site.leadEndpoint;
      var done = function () { remember({ name: name, phone: phone, email: email }); unlock({ name: name }, true); };
      status.textContent = 'Opening the library…'; status.className = 'gate__status';
      if (url) fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(lead) }).then(done, done);
      else done();
    });
  });

  /* Documents — each download asks for name, mobile and email first, logs the lead, then starts the download.
     A visitor already introduced on this device is not asked again, but every download is still logged. */
  function post(lead) {
    var url = UC.site.leadEndpoint; if (!url) return;
    try { fetch(url, { method: 'POST', mode: 'no-cors', keepalive: true, headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(lead) }).catch(function () {}); } catch (e) {}
  }
  function startDownload(file) {
    var a = document.createElement('a'); a.href = file; a.download = file.split('/').pop();
    document.body.appendChild(a); a.click(); a.remove();
  }
  function logAndGet(d, who) {
    post({ type: 'download', document: d.title, file: d.file, name: who.name, phone: who.phone, email: who.email, subscribe: who.subscribe ? 'Yes' : 'No', page: location.pathname, at: new Date().toISOString() });
    startDownload(d.file);
  }

  UC.register('docs', '[data-docs]', function (root) {
    var docs = (UC.content && UC.content.documents) || [];
    if (!docs.length) return;
    root.innerHTML = docs.map(docHTML).join('');

    var modal = document.createElement('div');
    modal.className = 'dlmodal'; modal.hidden = true; modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-labelledby', 'dl-title');
    modal.innerHTML = '<div class="dlmodal__card"><button type="button" class="dlmodal__x" aria-label="Close">\u00d7</button>' +
      '<p class="dlmodal__kind">Free download</p><h2 id="dl-title">Before your download</h2>' +
      '<p class="dlmodal__doc" data-dl-doc></p>' +
      '<form class="gate__form" novalidate>' +
        '<label>Full name<input name="name" autocomplete="name" required></label>' +
        '<label>Mobile number<input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+91" required></label>' +
        '<label>Email address<input name="email" type="email" autocomplete="email" required></label>' +
        '<label class="dlmodal__check"><input type="checkbox" name="subscribe"><span>Yes, keep me informed. I agree to receive UpperCrust\u2019s news articles, market notes and further information by email. I can unsubscribe at any time.</span></label>' +
        '<button class="btn" type="submit">Download</button><p class="gate__status" data-dl-status role="status" aria-live="polite"></p>' +
      '</form><p class="gate__fine">We never share your contact details with anyone, and we will not call you unless you have asked us to.</p></div>';
    document.body.appendChild(modal);
    var form = modal.querySelector('form'), status = modal.querySelector('[data-dl-status]'), pending = null, opener = null;

    function open(d, btn) {
      pending = d; opener = btn; status.textContent = ''; status.className = 'gate__status';
      modal.querySelector('[data-dl-doc]').textContent = d.title;
      var me = saved(); if (me) { ['name', 'phone', 'email'].forEach(function (k) { if (form[k] && me[k]) form[k].value = me[k]; }); form.subscribe.checked = !!me.subscribe; }
      modal.hidden = false; document.body.classList.add('dl-open'); setTimeout(function () { (form.name.value ? form.phone : form.name).focus(); }, 60);
    }
    function close() { modal.hidden = true; document.body.classList.remove('dl-open'); if (opener) opener.focus(); }
    modal.addEventListener('click', function (e) { if (e.target === modal || e.target.closest('.dlmodal__x')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) close(); });

    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-doc]'); if (!b) return;
      var d = docs[+b.dataset.doc], me = saved();
      if (me && me.phone && me.email) { logAndGet(d, me); b.textContent = 'Downloading\u2026'; setTimeout(function () { b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14"/></svg>Download PDF'; }, 2500); }
      else open(d, b);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim(), phone = form.phone.value.trim(), email = form.email.value.trim();
      var ok = name.length > 1 && /^[+\d][\d\s-]{8,}$/.test(phone) && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
      if (!ok) { status.textContent = 'Please add your name, a valid mobile number and email address.'; status.className = 'gate__status is-error'; return; }
      var who = { name: name, phone: phone, email: email, subscribe: form.subscribe.checked };
      remember(who);
      logAndGet(pending, who);              // download starts straight away, inside the click
      document.dispatchEvent(new CustomEvent('uc:identified', { detail: who }));
      status.textContent = 'Thank you, ' + name.split(' ')[0] + '. Your download has started.'; status.className = 'gate__status';
      setTimeout(close, 1400);
    });
  });
})();
