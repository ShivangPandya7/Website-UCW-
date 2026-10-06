/* Rail — a horizontal, snap-scrolling row of cards with previous/next controls. */
(function () {
  UC.register('rail', '[data-rail]', function (rail) {
    var sec = rail.closest('section') || document;
    var prev = sec.querySelector('[data-rail-prev]'), next = sec.querySelector('[data-rail-next]');
    function step() { var c = rail.querySelector(':scope > *'); return c ? c.getBoundingClientRect().width + 24 : 320; }
    function state() {
      if (prev) prev.disabled = rail.scrollLeft < 8;
      if (next) next.disabled = rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8;
    }
    if (prev) prev.addEventListener('click', function () { rail.scrollBy({ left: -step(), behavior: UC.reduced ? 'auto' : 'smooth' }); });
    if (next) next.addEventListener('click', function () { rail.scrollBy({ left: step(), behavior: UC.reduced ? 'auto' : 'smooth' }); });
    rail.addEventListener('scroll', function () { requestAnimationFrame(state); }, { passive: true });
    rail.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); rail.scrollBy({ left: step() }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); rail.scrollBy({ left: -step() }); }
    });
    // drag to scroll with a mouse
    var down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; rail.classList.add('is-drag'); });
    window.addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; rail.scrollLeft = sl - dx; });
    window.addEventListener('pointerup', function () { down = false; rail.classList.remove('is-drag'); });
    rail.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    state();
  });
})();
