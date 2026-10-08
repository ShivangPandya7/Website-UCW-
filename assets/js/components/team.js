/* Leadership — rendered from content/team.json when available (static markup stays as the fallback). */
(function () {
  UC.register('team', '[data-component="team"]', function (host) {
    var t = UC.content && UC.content.team; if (!t || !t.length) return;
    host.innerHTML = t.map(function (m, i) {
      var key = 'cmsPortrait' + i;
      if (m.photo) UC.images[key] = { src: m.photo.replace(/^\//, ''), own: true, alt: m.name, pos: m.photoPos || '50% 25%' };
      return '<article class="leader"><figure class="ph portrait"' + (m.photo ? ' data-img="' + key + '"' : '') + ' data-w="700"><span aria-hidden="true">' + m.name.charAt(0) + '</span></figure>' +
        '<h3>' + m.name + '</h3><p class="person__role">' + m.role + '</p>' +
        '<a class="link leader__in" href="' + (m.linkedin || ('https://www.linkedin.com/search/results/people/?keywords=' + encodeURIComponent(m.name + ' UpperCrust'))) + '" target="_blank" rel="noopener">LinkedIn</a></article>';
    }).join('');
    host.querySelectorAll('.portrait').forEach(function (f) { if (!f.dataset.img) f.classList.add('is-missing'); });
  });
})();
