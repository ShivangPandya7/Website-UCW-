/* Footer: renders closing line, sitemap and regulatory notes from UC.site. */
(function () {
  var UC = window.UC;
  UC.register('footer', '[data-component="footer"]', function (host) {
    var s = UC.site, c = s.contact;
    var practice = s.practice.map(function (p) { return '<a href="' + p.href + '">' + p.name + (p.soon ? '<small>Coming soon</small>' : '') + '</a>'; }).join('');
    var funds = s.funds.map(function (f) { return '<a href="' + f.href + '">' + f.name + '</a>'; }).join('');
    var year = new Date().getFullYear();
    host.outerHTML =
      '<footer class="site-footer"><div class="wrap">' +
        '<p class="site-footer__close">Your next chapter <span>starts with a conversation.</span></p>' +
        '<div class="site-footer__grid">' +
          '<div class="site-footer__brand"><img src="assets/img/logo-light.png" alt="UpperCrust, the wealth company" width="122" height="30">' +
            '<p>A private wealth practice for India\u2019s business families, professionals and NRIs. Advisory, asset management, insurance and broking, coordinated through one advisor.</p></div>' +
          '<div class="site-footer__col"><h2>The practice</h2>' + practice + '</div>' +
          '<div class="site-footer__col"><h2>Our funds</h2>' + funds + '<a href="pms.html">Compare mandates</a></div>' +
          '<div class="site-footer__col"><h2>Firm</h2><a href="index.html#approach">Our approach</a><a href="client-stories.html">Client stories</a><a href="pms.html#insights">Insights</a><a href="resources.html">Resources</a></div>' +
          '<div class="site-footer__col"><h2>Reach us</h2><a href="tel:' + c.tel + '">' + c.phone + '</a><a href="mailto:' + c.email + '">' + c.email + '</a><a href="' + c.whatsapp + '" rel="noopener">WhatsApp</a><a href="' + c.linkedin + '" rel="noopener">LinkedIn</a></div>' +
        '</div>' +
        '<div class="site-footer__legal">' +
          '<p>Investments in securities are subject to market risks. Read all related documents carefully before investing. Past performance is not indicative of future returns. Portfolio management services are offered through Moat Financial Services Pvt. Ltd., SEBI PMS Registration No. ' + (s.sebi || 'INP000004482') + '.' + (s.compliance && s.compliance.name ? ' Compliance officer: ' + s.compliance.name + (s.compliance.email ? ', ' + s.compliance.email : '') + (s.compliance.phone ? ', ' + s.compliance.phone : '') + '.' : '') + '</p>' +
          '<p>\u00A9 ' + year + ' UpperCrust Wealth. ' + c.address + '</p>' +
        '</div>' +
      '</div></footer>';
  });
})();
