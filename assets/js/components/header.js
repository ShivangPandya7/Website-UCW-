/* Header: renders nav from UC.site, handles mega panels, mobile overlay and scroll states. */
(function () {
  var UC = window.UC;

  function megaItems(list, current) {
    return list.map(function (i) {
      var cur = i.page === current ? ' aria-current="page"' : '';
      return '<a class="mega__item" href="' + i.href + '"' + cur + '>' +
        '<b>' + i.name + '</b><span>' + i.note + '</span>' +
        '<em>' + (i.tag || 'Explore') + '</em></a>';
    }).join('');
  }

  function menuLinks(list) {
    return list.map(function (i) {
      return '<a href="' + i.href + '">' + i.name + (i.code ? ' <small>' + i.code + '</small>' : '') + '</a>';
    }).join('');
  }

  // The event sticker shows until the day after the event, then the link quietly drops its date.
  function eventLink(ev) {
    if (!ev) return '';
    var upcoming = new Date() <= new Date(ev.date + 'T23:59:59');
    return '<a class="nav-link nav-link--event" href="' + ev.url + '" target="_blank" rel="noopener">' +
      '<span><span class="label-long">Wealth </span>Conclave ’26</span>' + (upcoming ? '<span class="sticker">' + ev.dateLabel + '</span>' : '') + '</a>';
  }

  function render(host) {
    var s = UC.site, page = document.body.dataset.page || '';
    var practicePages = s.practice.map(function (p) { return p.page; });
    var fundPages = s.funds.map(function (f) { return f.page; });
    var fundsPlus = s.funds.concat([{ name: 'Compare all three', href: 'pms.html#funds', page: 'pms-compare', note: 'Every term side by side, plus the growth calculator.', tag: 'Asset management' }]);

    host.outerHTML =
      '<a class="skip" href="#main">Skip to content</a>' +
      '<header class="site-header" id="siteHeader">' +
      '<div class="wrap site-header__bar">' +
        '<a class="site-header__logo" href="index.html" aria-label="UpperCrust, the wealth company — home">' +
          '<img class="logo-dark" src="assets/img/logo-dark.png" alt="" width="122" height="30">' +
          '<img class="logo-light" src="assets/img/logo-light.png" alt="" width="122" height="30">' +
        '</a>' +
        '<nav class="site-header__nav" aria-label="Main">' +
          '<div class="nav-item" data-mega>' +
            '<button class="nav-link" aria-expanded="false" aria-controls="mega-practice"' + (practicePages.indexOf(page) > -1 ? ' aria-current="page"' : '') + '>The practice <i class="caret" aria-hidden="true"></i></button>' +
            '<div class="mega" id="mega-practice"><div class="wrap mega__inner">' +
              '<p class="mega__intro"><strong>One advisor. Every part of your wealth.</strong>Each business has its own licence and team, coordinated through a single relationship.</p>' +
              '<div class="mega__list">' + megaItems(s.practice, page) + '</div>' +
            '</div></div>' +
          '</div>' +
          '<div class="nav-item" data-mega>' +
            '<button class="nav-link" aria-expanded="false" aria-controls="mega-funds"' + (page === 'pms' ? ' aria-current="page"' : '') + '>Our funds <i class="caret" aria-hidden="true"></i></button>' +
            '<div class="mega" id="mega-funds"><div class="wrap mega__inner">' +
              '<p class="mega__intro"><strong>Three strategies. One standard.</strong>Core equity, multi-asset and concentrated — each benchmarked openly.</p>' +
              '<div class="mega__list">' + megaItems(fundsPlus, page) + '</div>' +
            '</div></div>' +
          '</div>' +
          eventLink(s.event) +
          '<a class="nav-link" href="client-stories.html"' + (page === 'stories' ? ' aria-current="page"' : '') + '>Client stories</a>' +
          '<a class="nav-link" href="pms.html#insights">Insights</a>' +
          '<a class="nav-link nav-link--lock" href="resources.html"' + (page === 'resources' ? ' aria-current="page"' : '') + '>Resources <svg class="lock-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5v13c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z"/><path d="M12 6v13"/></svg></a>' +
        '</nav>' +
        '<a class="btn site-header__cta" href="#contact">Schedule a discovery call</a>' +
        '<button class="site-header__toggle" aria-expanded="false" aria-controls="siteMenu"><span class="label">Menu</span><span class="bars" aria-hidden="true"></span></button>' +
      '</div></header>' +
      '<div class="menu" id="siteMenu" aria-label="Site menu">' +
        '<div class="menu__group"><p class="menu__label">The practice</p>' + menuLinks(s.practice) + '</div>' +
        '<div class="menu__group"><p class="menu__label">Our funds</p>' + menuLinks(s.funds) + '</div>' +
        '<div class="menu__group"><a href="' + s.event.url + '" target="_blank" rel="noopener">' + s.event.name + ' <small>' + s.event.dateLabel + '</small></a><a href="client-stories.html">Client stories</a><a href="pms.html#insights">Insights</a><a href="resources.html">Resources <small>Library</small></a><a href="#contact">Schedule a discovery call</a></div>' +
        '<div class="menu__foot"><span><a href="tel:' + s.contact.tel + '">' + s.contact.phone + '</a> · <a href="mailto:' + s.contact.email + '">' + s.contact.email + '</a></span></div>' +
      '</div>';
  }

  function behave() {
    var header = document.getElementById('siteHeader');
    var menu = document.getElementById('siteMenu');
    var toggle = header.querySelector('.site-header__toggle');
    var darkHero = document.body.dataset.hero === 'dark' ? document.querySelector('.hero') : null;
    var lastY = window.scrollY, ticking = false;

    function overDarkZone(line) {
      var darkZones = UC.$$('.sec--dark, .hero.is-dark, .site-footer');
      for (var i = 0; i < darkZones.length; i++) {
        var r = darkZones[i].getBoundingClientRect();
        if (r.top <= line && r.bottom > line) return true;
      }
      return false;
    }
    function update() {
      var y = window.scrollY, h = header.offsetHeight;
      var overHero = darkHero && y < darkHero.offsetHeight - h;
      var dark = overHero || overDarkZone(h / 2);
      header.classList.toggle('on-dark', !!overHero);
      header.classList.toggle('is-solid', !overHero && y > 8);
      header.classList.toggle('is-solid-dark', !overHero && dark && y > 8);
      var locked = header.querySelector('.nav-item.is-open') || document.body.classList.contains('menu-open');
      if (locked || y < 640) header.classList.remove('is-hidden');
      else if (y > lastY + 6) header.classList.add('is-hidden');
      else if (y < lastY - 6) header.classList.remove('is-hidden');
      document.body.classList.toggle('hdr-hidden', header.classList.contains('is-hidden'));
      if (Math.abs(y - lastY) > 6) lastY = y;
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();

    // Mega panels: hover on pointer devices, click/keyboard everywhere
    var items = UC.$$('[data-mega]', header);
    function close(item) { item.classList.remove('is-open'); item.querySelector('.nav-link').setAttribute('aria-expanded', 'false'); }
    function open(item) { items.forEach(function (i) { if (i !== item) close(i); }); item.classList.add('is-open'); item.querySelector('.nav-link').setAttribute('aria-expanded', 'true'); update(); }
    items.forEach(function (item) {
      var btn = item.querySelector('.nav-link'), timer;
      btn.addEventListener('click', function () { item.classList.contains('is-open') ? close(item) : open(item); });
      if (window.matchMedia('(hover:hover)').matches) {
        item.addEventListener('mouseenter', function () { clearTimeout(timer); open(item); });
        item.addEventListener('mouseleave', function () { timer = setTimeout(function () { close(item); }, 180); });
      }
      item.addEventListener('focusout', function (e) { if (!item.contains(e.relatedTarget)) close(item); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      items.forEach(function (i) { if (i.classList.contains('is-open')) { close(i); i.querySelector('.nav-link').focus(); } });
      if (document.body.classList.contains('menu-open')) setMenu(false);
    });
    document.addEventListener('click', function (e) { if (!header.contains(e.target)) items.forEach(close); });

    // Mobile overlay
    function setMenu(on) {
      document.body.classList.toggle('menu-open', on);
      menu.classList.toggle('is-open', on);
      toggle.setAttribute('aria-expanded', String(on));
      toggle.querySelector('.label').textContent = on ? 'Close' : 'Menu';
      update();
    }
    toggle.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
    UC.$$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  }


  // Floating page switcher (bottom of every page). The x folds it down to a single button.
  function pageBar() {
    if (document.querySelector('.pagebar')) return;
    var page = document.body.dataset.page || '';
    var items = [['Home', 'index.html', 'home'], ['Wealth Advisory', 'wealth-advisory.html', 'advisory'], ['Asset Management', 'pms.html', 'pms'],
      ['Client stories', 'client-stories.html', 'stories'], ['Resources', 'resources.html', 'resources']];
    var nav = document.createElement('nav');
    nav.className = 'pagebar'; nav.setAttribute('aria-label', 'Pages');
    nav.innerHTML = '<b>EXPLORE</b>' + items.map(function (i) {
      return '<a href="' + i[1] + '"' + (i[2] === page ? ' class="on" aria-current="page"' : '') + '>' + i[0] + '</a>';
    }).join('') + '<button type="button" class="pagebar__hide" aria-label="Hide page tabs" title="Hide page tabs">\u00d7</button>';
    document.body.appendChild(nav); document.body.classList.add('has-pagebar');
    var btn = nav.querySelector('button'), min = false;
    try { min = sessionStorage.getItem('ucBarMin') === '1'; } catch (e) {}
    function apply() { nav.classList.toggle('is-min', min); btn.textContent = min ? '\u2630' : '\u00d7'; btn.setAttribute('aria-label', min ? 'Show page tabs' : 'Hide page tabs'); }
    btn.addEventListener('click', function () { min = !min; try { sessionStorage.setItem('ucBarMin', min ? '1' : '0'); } catch (e) {} apply(); });
    apply();
  }
  UC.register('header', '[data-component="header"]', function (host) { render(host); behave(); pageBar(); });
})();
