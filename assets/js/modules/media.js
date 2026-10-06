/* Media — fills any element with data-img="slot" from UC.images.
   Tries your own photo (assets/img/photos/…) first, then the interim fallback, then a branded surface.
   <figure class="ph" data-img="library" data-w="1600"></figure> */
(function () {
  function isUnsplash(src) { return src && src.indexOf('images.unsplash.com') > -1; }
  function srcset(src, w) {
    return [Math.round(w / 2), w, Math.round(w * 1.5)].map(function (x) { return src + '&w=' + x + ' ' + x + 'w'; }).join(', ');
  }
  function apply(img, el, src, w) {
    img.removeAttribute('srcset');
    if (isUnsplash(src)) { img.srcset = srcset(src, w); img.sizes = el.dataset.sizes || '(max-width: 900px) 100vw, 60vw'; img.src = src + '&w=' + w; }
    else img.src = src;
  }
  UC.register('media', '[data-img]', function (el) {
    var d = UC.images && UC.images[el.dataset.img];
    if (!d) { el.classList.add('is-missing'); return; }
    var w = parseInt(el.dataset.w || '1200', 10);
    var own = d.own || (UC.ownPhotos || []).indexOf(d.file || d.src.split('/').pop()) > -1;
    var img = new Image(), tried = [own ? d.src : null].concat(d.fallbacks && d.fallbacks.length ? d.fallbacks : [d.fallback]).filter(Boolean), i = 0;
    if (!tried.length) { el.classList.add('is-missing'); return; }
    img.alt = el.dataset.alt != null ? el.dataset.alt : d.alt;
    img.decoding = 'async';
    img.loading = el.hasAttribute('data-eager') ? 'eager' : 'lazy';
    if (d.pos) img.style.objectPosition = d.pos;
    img.addEventListener('load', function () {
      el.classList.add('is-loaded');
      if (d.credit && !own && i === 0 && !el.querySelector('.ph-credit')) { var c = document.createElement('small'); c.className = 'ph-credit'; c.textContent = d.credit; el.appendChild(c); }
    });
    img.addEventListener('error', function () {
      i += 1;
      if (i < tried.length) apply(img, el, tried[i], w);
      else { el.classList.add('is-missing'); img.remove(); }
    });
    apply(img, el, tried[0], w);
    el.insertBefore(img, el.firstChild);
  });

  UC.register('parallax', '[data-parallax]', function (el) {
    if (UC.reduced || !window.matchMedia('(hover:hover)').matches) return;
    var k = parseFloat(el.dataset.parallax) || 0.12, ticking = false;
    function run() {
      var r = el.getBoundingClientRect(), vh = window.innerHeight;
      if (r.bottom > 0 && r.top < vh) el.style.setProperty('--py', (((r.top + r.height / 2 - vh / 2) / vh) * k * 100).toFixed(2) + 'px');
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
    run();
  });
})();
