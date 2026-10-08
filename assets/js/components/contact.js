/* Contact section — the enquiry letter, rendered once and configured per page.
   <div data-component="contact" data-title="..." data-lede="..." data-subject="..."
        data-extra="assets,fund,referred" data-desk="PMS advisory desk" data-response="Our team will reach out to you soon"
        data-topic="investing through PMS" data-fund="UCWF"></div> */
(function () {
  var UC = window.UC;
  function fill(name, label, placeholder, attrs) {
    return '<label class="fill"><span class="sr-only">' + label + '</span><input name="' + name + '" data-name="' + label.toLowerCase() + '" placeholder="' + placeholder + '"' + (attrs || '') + '></label>';
  }
  function select(name, label, options, chosen) {
    return '<label class="fill"><span class="sr-only">' + label + '</span><select name="' + name + '">' +
      options.map(function (o) { return '<option' + (o === chosen ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select></label>';
  }
  UC.register('contact', '[data-component="contact"]', function (host) {
    var d = host.dataset, c = UC.site.contact;
    var extra = (d.extra || '').split(',').map(function (x) { return x.trim(); });
    var funds = UC.site.funds.map(function (f) { return f.name; }).concat(['whichever fund suits me best']);
    var chosenFund = UC.site.funds.filter(function (f) { return f.code === d.fund; })[0];
    var lines = '';
    if (extra.indexOf('assets') > -1) lines += ' My investable assets are roughly ' + select('assets', 'Investable assets', ['₹1 to ₹5 crore', '₹5 to ₹25 crore', '₹25 to ₹100 crore', 'above ₹100 crore', 'something I would rather discuss in person'], '₹5 to ₹25 crore') + '.';
    if (extra.indexOf('fund') > -1) lines += ' I am most interested in ' + select('fund', 'Fund of interest', funds, chosenFund ? chosenFund.name : 'whichever fund suits me best') + '.';
    if (extra.indexOf('referred') > -1) lines += ' I was introduced by ' + fill('referred', 'Referred by', 'name of an existing client') + '.';

    host.outerHTML =
      '<section class="sec sec--light letter-sec" id="contact" aria-labelledby="contact-title"><div class="wrap page">' +
        '<div class="letter-head">' +
          '<h2 id="contact-title">' + (d.title || 'Tell us the goal.') + '</h2>' +
          '<p>' + (d.lede || 'We will build the plan around it.') + '</p>' +
          '<dl class="letter-desk">' +
            '<div><dt>' + (d.desk || 'Direct line') + '</dt><dd><a href="tel:' + c.tel + '">' + c.phone + '</a></dd></div>' +
            '<div><dt>Email</dt><dd><a href="mailto:' + (c.leadEmail || c.email) + '">' + (c.leadEmail || c.email) + '</a></dd></div>' +
            '<div><dt>' + (d.response ? 'Response' : 'Office') + '</dt><dd>' + (d.response || c.address) + '</dd></div>' +
          '</dl>' +
        '</div>' +
        '<form class="letter" data-letter data-subject="' + (d.subject || 'Private enquiry') + '" novalidate>' +
          '<p class="letter__salute">Dear UpperCrust,</p>' +
          '<p class="letter__body">My name is ' + fill('name', 'Name', 'your full name', ' required autocomplete="name"') +
            ', and I would like to talk about ' + fill('topic', 'Topic', d.topic || 'planning a business exit', ' required autocomplete="off" data-suggest role="combobox" aria-expanded="false" aria-autocomplete="list"') + '.' + lines +
            ' You can reach me at ' + fill('email', 'Email address', 'email address', ' type="email" required autocomplete="email"') +
            ' or on ' + fill('phone', 'Phone', 'phone number', ' type="tel" autocomplete="tel"') + '.</p>' +
          '<fieldset class="letter__pref"><legend>I would prefer</legend>' +
            '<label><input type="radio" name="prefer" value="a call" checked><span>a call</span></label><span class="sep">,</span>' +
            '<label><input type="radio" name="prefer" value="a meeting in person"><span>a meeting in person</span></label><span class="sep">or</span>' +
            '<label><input type="radio" name="prefer" value="a video call"><span>a video call</span></label>.</fieldset>' +
          '<div class="letter__sign"><button class="btn" type="submit">' + (d.button || 'Schedule a discovery call') + '</button>' +
            '<p class="letter__status" role="status" aria-live="polite">' + 'Our team will reach out to you soon.' + '</p></div>' +
                  '</form>' +
      '</div></section>';
  });
})();
