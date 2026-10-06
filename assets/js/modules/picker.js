/* Picker — replaces the browser's native select inside the letter with an on-brand list.
   The real <select> stays in the form (hidden) so the value is submitted as before. */
(function () {
  UC.register('picker', '.letter .fill select', function (sel) {
    var wrap = sel.closest('.fill'), id = 'pk-' + Math.random().toString(36).slice(2, 7), active = -1;
    wrap.classList.add('fill--pick');
    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'picker';
    btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', id);
    btn.setAttribute('aria-label', (wrap.querySelector('.sr-only') || {}).textContent || 'Choose');
    var list = document.createElement('ul');
    list.className = 'suggest'; list.id = id; list.setAttribute('role', 'listbox');
    list.innerHTML = Array.prototype.map.call(sel.options, function (o, i) {
      return '<li role="option" id="' + id + '-' + i + '" data-i="' + i + '">' + o.text + '</li>';
    }).join('');
    sel.classList.add('picker-native'); sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');
    wrap.appendChild(btn); wrap.appendChild(list);

    function sync() {
      btn.textContent = sel.options[sel.selectedIndex].text;
      Array.prototype.forEach.call(list.children, function (li, i) { li.setAttribute('aria-selected', String(i === sel.selectedIndex)); });
    }
    function mark(i) {
      active = i;
      Array.prototype.forEach.call(list.children, function (li, k) { li.classList.toggle('is-on', k === i); });
      if (list.children[i]) { btn.setAttribute('aria-activedescendant', list.children[i].id); list.children[i].scrollIntoView({ block: 'nearest' }); }
    }
    function open() { wrap.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); mark(sel.selectedIndex); }
    function close() { wrap.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); btn.removeAttribute('aria-activedescendant'); }
    function choose(i) { sel.selectedIndex = i; sel.dispatchEvent(new Event('change', { bubbles: true })); sync(); close(); btn.focus(); }

    btn.addEventListener('click', function () { wrap.classList.contains('is-open') ? close() : open(); });
    btn.addEventListener('keydown', function (e) {
      var n = list.children.length, isOpen = wrap.classList.contains('is-open');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (!isOpen) return open(); mark((active + (e.key === 'ArrowDown' ? 1 : -1) + n) % n); }
      else if ((e.key === 'Enter' || e.key === ' ') && isOpen) { e.preventDefault(); choose(active); }
      else if (e.key === 'Escape') close();
    });
    list.addEventListener('mousedown', function (e) { var li = e.target.closest('li'); if (li) { e.preventDefault(); choose(+li.dataset.i); } });
    document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) close(); });
    sel.addEventListener('change', sync);   // e.g. a fund chosen elsewhere on the page
    sync();
  });
})();
