/* Insights — rendered from content/insights.json when available (static markup stays as the fallback). */
(function () {
  UC.register('insights', '[data-component="insights"]', function (host) {
    var items = UC.content && UC.content.insights; if (!items || !items.length) return;
    var mail = UC.site.contact.email;
    host.innerHTML = items.map(function (n) {
      var cta = '<a class="link" href="resources.html#note-' + n.id + '">Read in the library</a>';
      var img = n.image && UC.images[n.image] ? '<figure class="ph" data-img="' + n.image + '" data-w="900" data-alt=""></figure>' : '';
      return '<article class="icard' + (img ? '' : ' icard--text') + '">' + img + '<div class="icard__body">' +
        '<span class="sticker sticker--dark">' + n.kind + '</span><h3>' + n.title + '</h3><p>' + n.summary + '</p>' +
        '<div class="icard__foot"><span>' + (n.readTime || '') + '</span>' + cta + '</div></div></article>';
    }).join('');
  });
})();
