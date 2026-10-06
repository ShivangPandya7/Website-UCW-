/* Fund performance — built-in copy of the latest factsheet (TWRR %, gross of fees).
   Live figures come from the Google Sheet (or content/performance.csv) via loader.js. */
window.UC = window.UC || {};
UC.funds = {
  asOf: '',
  periods: [['m1', '1M'], ['m3', '3M'], ['m6', '6M'], ['y1', '1Y'], ['y2', '2Y'], ['y3', '3Y'], ['y4', '4Y'], ['y5', '5Y'], ['si', 'Since inception']],
  UCWF: { name: 'UpperCrust Wealth Fund', inception: '28 Jan 2022', aum: 136.84, publish: true,
    returns: { m1: 4.61, m3: -3.29, m6: 3.41, y1: 20, y2: 4.82, y3: 24.29, y4: 20.66, si: 15.71 },
    benchmark: { name: 'BSE 500 TRI', returns: { m1: -0.09, m3: 3.86, m6: 1.43, y1: 4.72, y2: -0.11, y3: 12.09, y4: 11.9, si: 10.54 } } },
  UCGF: { name: 'UpperCrust Growth Fund', inception: '', aum: 76.14, publish: true,
    returns: { m1: 3.74, m3: -1.02, m6: 1.17, y1: 15.87, y2: 3.39, y3: 19.02, y4: 18.4, si: 16.58 },
    benchmark: { name: 'NSE Multi Asset Index 1', returns: { m1: 0.28, m3: 3.46, m6: 3, y1: 7.54, y2: 5, y3: 11.26, y4: 10.42, si: 10.14 } } },
  UCPF: { name: 'UpperCrust Prosperity Fund', inception: '', aum: 19.87, publish: false,
    returns: { m1: 5.39, m3: -1.75, m6: 3.08, y1: 22.7, y2: 7.13, si: 4.77 },
    benchmark: { name: 'BSE 500 TRI', returns: { m1: -0.09, m3: 3.86, m6: 1.43, y1: 4.72, y2: -0.11, si: 1.03 } } }
};
