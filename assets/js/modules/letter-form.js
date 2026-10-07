/* The enquiry letter. Inline inputs grow with what is typed.
   Sends the letter to the lead endpoint (Google Apps Script -> Google Sheet). It never opens the visitor's email app. */
(function () {
  function grow(input) {
    var len = Math.max((input.value || '').length, (input.getAttribute('placeholder') || '').length, 4);
    input.setAttribute('size', Math.min(len + 1, 42));
  }
  UC.register('letter', '[data-letter]', function (form) {
    var status = form.querySelector('.letter__status');
    var btn = form.querySelector('button[type="submit"]');
    UC.$$('.fill input', form).forEach(function (i) { grow(i); i.addEventListener('input', function () { grow(i); i.removeAttribute('aria-invalid'); }); });
    // selects size to the chosen option, so the sentence reads naturally
    UC.$$('.fill select', form).forEach(function (sel) {
      function fit() { sel.style.width = (sel.options[sel.selectedIndex].text.length * 0.56 + 2.2) + 'em'; }
      fit(); sel.addEventListener('change', fit);
    });

    function text() {
      var f = new FormData(form), lines = [];
      lines.push('Dear UpperCrust,', '');
      lines.push('My name is ' + (f.get('name') || '') + ', and I would like to talk about ' + (f.get('topic') || '') + '.');
      if (f.get('assets')) lines.push('My investable assets are roughly ' + f.get('assets') + '.');
      if (f.get('fund')) lines.push('I am most interested in ' + f.get('fund') + '.');
      if (f.get('referred')) lines.push('I was introduced by ' + f.get('referred') + '.');
      lines.push('You can reach me at ' + (f.get('email') || '') + (f.get('phone') ? ' or on ' + f.get('phone') : '') + '.');
      if (f.get('prefer')) lines.push('I would prefer ' + f.get('prefer') + '.');
      lines.push('', 'Sent from ' + document.title);
      return lines.join('\n');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = UC.$$('input[required]', form).filter(function (i) { return !i.checkValidity(); });
      UC.$$('input', form).forEach(function (i) { i.removeAttribute('aria-invalid'); });
      if (bad.length) {
        bad.forEach(function (i) { i.setAttribute('aria-invalid', 'true'); });
        status.className = 'letter__status is-error';
        status.textContent = 'Add your ' + bad.map(function (i) { return i.dataset.name || i.name; }).join(' and ') + ' so we can reply.';
        bad[0].focus();
        return;
      }
      var data = {}; new FormData(form).forEach(function (v, k) { data[k] = v; });
      data.page = location.pathname; data.letter = text();
      var url = UC.site.leadEndpoint;
      var fail = function () {
        btn.disabled = false; status.className = 'letter__status is-error';
        status.textContent = 'Your letter could not be sent just now. Please try again in a moment, or call ' + UC.site.contact.phone + '.';
      };
      if (!url) { fail(); return; }   // the letter is only ever recorded in the Google Sheet; no email app is opened
      btn.disabled = true; status.className = 'letter__status'; status.textContent = 'Sending…';
      var lead = Object.assign({ type: 'enquiry', page: location.pathname }, data);
      fetch(url, { method: 'POST', mode: 'no-cors', keepalive: true, headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(lead) })
        .then(function () { done('Our team will reach out to you soon.'); }, fail);
    });
    function done(msg) { form.classList.add('is-sent'); status.className = 'letter__status'; status.textContent = msg; btn.textContent = 'Letter written'; btn.disabled = true; }
  });
})();
