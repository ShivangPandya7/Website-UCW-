/* The enquiry letter. Inline inputs grow with what is typed.
   Sends JSON to UC.site.formEndpoint if set; otherwise opens the visitor's email app with the letter written out. */
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
      var endpoint = (window.UC.site && UC.site.formEndpoint) || form.dataset.endpoint;
      var data = {}; new FormData(form).forEach(function (v, k) { data[k] = v; });
      data.page = location.pathname; data.letter = text();
      var subject0 = (form.dataset.subject || 'Private enquiry') + ' \u2014 ' + (data.name || '');
      // the email relay reads these fields: subject line, a readable layout, no captcha page, and a spam trap
      if (/formsubmit\.co/.test(endpoint || '')) { data._subject = subject0; data._template = 'table'; data._captcha = 'false'; data._honey = ''; }
      if (endpoint === 'netlify') {
        btn.disabled = true; status.className = 'letter__status'; status.textContent = 'Sending…';
        var body = new URLSearchParams(); body.append('form-name', 'enquiry');
        Object.keys(data).forEach(function (k) { body.append(k, data[k]); });
        fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
          .then(function (r) { if (!r.ok) throw new Error(r.status); done('Received. We will call you within one business day.'); })
          .catch(function () { btn.disabled = false; status.className = 'letter__status is-error'; status.textContent = 'The letter did not send. Call ' + UC.site.contact.phone + ' or try again.'; });
      } else if (endpoint) {
        btn.disabled = true; status.className = 'letter__status'; status.textContent = 'Sending…';
        fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
          .then(function (r) { return r.json().catch(function () { return {}; }).then(function (b) { if (!r.ok || b.success === 'false' || b.success === false) throw new Error(r.status); }); })
          .then(function () { done('Received. We will call you within one business day.'); })
          .catch(function () {
            btn.disabled = false; status.className = 'letter__status is-error';
            status.innerHTML = 'The letter did not send. <a href="mailto:' + UC.site.contact.email + '?subject=' + encodeURIComponent(subject0) + '&body=' + encodeURIComponent(data.letter) + '">Send it from your email app</a>, or call ' + UC.site.contact.phone + '.';
          });
      } else {
        var subject = form.dataset.subject || 'Private enquiry';
        location.href = 'mailto:' + UC.site.contact.email + '?subject=' + encodeURIComponent(subject + ' — ' + (data.name || '')) + '&body=' + encodeURIComponent(data.letter);
        done('Your letter is open in your email app. Send it and we will reply within one business day.');
      }
    });
    function done(msg) { form.classList.add('is-sent'); status.className = 'letter__status'; status.textContent = msg; btn.textContent = 'Letter written'; btn.disabled = true; }
  });
})();
