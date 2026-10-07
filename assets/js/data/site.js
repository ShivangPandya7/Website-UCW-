/* Site-wide content: contact details and navigation. Edit here, not in each page. */
window.UC = window.UC || {};
UC.site = {
  contact: {
    phone: '+91 81411 22322',
    tel: '+918141122322',
    email: 'yash@uppercrustwealth.com',
    leadEmail: 'social@uppercrustwealth.com',   // receives the enquiry letter and the document-download details
    address: '316–317 Pancham Icon, Vasna, Vadodara 390025',
    whatsapp: 'https://wa.me/918141122322',
    linkedin: '#'
  },
  event: { name: 'Wealth Conclave ’26', short: 'Conclave ’26', date: '2026-10-10', dateLabel: '10 Oct', venue: 'Waves Club, Vadodara', url: 'https://uppercrustconclave.in' },
  // Set to your form handler URL (POST, JSON). Empty = the letter opens in the visitor's email app.
  formEndpoint: '',
  practice: [
    { name: 'Wealth Advisory', href: 'wealth-advisory.html', page: 'advisory', note: 'Mutual funds, PMS, AIF and bonds, chosen for your goal rather than from a shelf.' },
    { name: 'Asset Management', href: 'pms.html', page: 'pms', note: 'UCWF, UCGF and UCPF — our three portfolio management strategies.' },
    { name: 'Insurance Broking', href: 'insurance.html', page: 'insurance', note: 'Protection reviewed alongside the portfolio.', soon: true },
    { name: 'Equity Broking', href: 'broking.html', page: 'broking', note: 'Direct equity with the research desk behind it.', soon: true }
  ],
  funds: [
    { name: 'UpperCrust Wealth Fund', code: 'UCWF', href: 'pms.html#ucwf', page: 'pms-ucwf', note: 'Core equity. Diversified and quality-first.', tag: 'Core equity' },
    { name: 'UpperCrust Growth Fund', code: 'UCGF', href: 'pms.html#ucgf', page: 'pms-ucgf', note: 'Multi-asset. Moves between equity and debt through the cycle.', tag: 'Multi-asset' },
    { name: 'UpperCrust Prosperity Fund', code: 'UCPF', href: 'pms.html#ucpf', page: 'pms-ucpf', note: 'Concentrated. For a small number of families.', tag: 'By invitation' }
  ]
};
