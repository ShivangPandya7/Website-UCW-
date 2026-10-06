/* Suggest — a quiet, on-brand list of topics under the letter's "talk about" field.
   Replaces the browser's default dropdown. Type freely or pick a suggestion. */
(function () {
  var TOPICS = [
    'investing through PMS',
    'a mutual fund plan for my goals',
    'consolidating scattered holdings',
    'what to do after selling a business',
    'investing in India from abroad',
    'a steady income in retirement',
    'protecting my family with the right cover'
  ];
  UC.register('suggest', '[data-suggest]', function (input) {
    var wrap = input.closest('.fill'), id = 'sg-' + Math.random().toString(36).slice(2, 7), active = -1;
    var list = document.createElement('ul');
    list.className = 'suggest'; list.id = id; list.setAttribute('role', 'listbox');
    input.setAttribute('aria-controls', id);
    wrap.appendChild(list);

    function render() {
      var q = input.value.trim().toLowerCase();
      var items = TOPICS.filter(function (t) { return !q || t.indexOf(q) > -1; });
      if (!items.length) items = TOPICS;
      list.innerHTML = items.map(function (t, i) {
        return '<li role="option" id="' + id + '-' + i + '" data-v="' + t + '">' + t + '</li>';
      }).join('');
      active = -1;
    }
    function open() { render(); wrap.classList.add('is-open'); input.setAttribute('aria-expanded', 'true'); }
    function close() { wrap.classList.remove('is-open'); input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); }
    function pick(v) { input.value = v; input.dispatchEvent(new Event('input')); close(); }
    function move(d) {
      var opts = list.children; if (!opts.length) return;
      active = (active + d + opts.length) % opts.length;
      Array.prototype.forEach.call(opts, function (o, i) { o.classList.toggle('is-on', i === active); });
      input.setAttribute('aria-activedescendant', opts[active].id);
      opts[active].scrollIntoView({ block: 'nearest' });
    }
    input.addEventListener('focus', open);
    input.addEventListener('input', function () { if (wrap.classList.contains('is-open')) render(); else open(); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (!wrap.classList.contains('is-open')) open(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter' && active > -1) { e.preventDefault(); pick(list.children[active].dataset.v); }
      else if (e.key === 'Escape') close();
    });
    input.addEventListener('blur', function () { setTimeout(close, 150); });
    list.addEventListener('mousedown', function (e) { var li = e.target.closest('li'); if (li) { e.preventDefault(); pick(li.dataset.v); } });
  });
})();
