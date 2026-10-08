/* Image library — one photograph per place. No slot is used twice anywhere on the site.
   Upload your own in the admin panel (Photographs), or save into assets/img/photos/ with the
   file name below and list it in UC.ownPhotos. Interim photos: free-licence Unsplash. */
window.UC = window.UC || {};
UC.ownPhotos = [
  'pms-signature.jpg', 'advisory-hero.jpg', 'practice-asset-management.jpg', 'city-vadodara.jpg', 'city-delhi.jpg', 'city-dubai.jpg', 'city-kochi.jpg', 'city-bangalore.jpg'
];
(function () {
  function u(id) { return 'https://images.unsplash.com/' + id + '?auto=format&fit=crop&q=72'; }
  function dl(id) { return 'https://unsplash.com/photos/' + id + '/download?w=2400'; }
  // id may be one Unsplash CDN id, a full URL, or a list (tried in order)
  function src1(x) { return /^https?:/.test(x) ? x : u(x); }
  function s(file, alt, id, pos, credit) {
    var list = id ? [].concat(id).map(src1) : [];
    return { file: file, src: 'assets/img/photos/' + file, fallback: list[0] || null, fallbacks: list, alt: alt, pos: pos || '50% 50%', credit: credit || '' };
  }
  UC.images = {
    // Home
    homeHero:           s('home-hero.jpg', 'Mumbai’s high-rises rising in layers beside the water at night', 'photo-1575261755165-1a9d4370c898', '50% 55%'),
    homeIntro:          s('home-intro-walk.jpg', 'A family of three walking hand in hand into a golden sunset, seen from behind', ['https://images.pexels.com/photos/3030090/pexels-photo-3030090.jpeg?auto=compress&cs=tinysrgb&w=1800', 'https://images.pexels.com/photos/9207532/pexels-photo-9207532.jpeg?auto=compress&cs=tinysrgb&w=1800'], '50% 55%'),
    practiceAdvisory:   s('practice-advisory.jpg', 'A quiet boardroom set for a private meeting', 'photo-1706074793638-da28b90ea8ae'),
    practiceAM:         s('practice-asset-management.jpg', 'The UpperCrust office, with the bronze bull in a gold-lit display case', 'photo-1706074797611-a02f9ed06439', '50% 55%'),
    practiceInsurance:  s('practice-insurance.jpg', 'A young family holding their baby', 'photo-1657912230172-23f8b31665ed', '50% 30%'),
    practiceBroking:    s('practice-broking.jpg', 'Live market charts on a trading screen', 'photo-1611974789855-9c2a0a7236a3'),
    homeQuote:          s('home-quote.jpg', 'The sale agreement being signed — the close of one chapter and the start of the next', 'photo-1450101499163-c8848c66ca85'),
    // Cities — the presence switcher. Upload a premium photo of each city in the admin panel.
    cityVadodara:       s('city-vadodara.jpg', 'Laxmi Vilas Palace, Vadodara', null, '50% 62%'),
    cityMumbai:         s('city-mumbai.jpg', 'The Taj Mahal Palace and Gateway of India, Mumbai', 'photo-1595658658481-d53d3f999875'),
    cityBangalore:      s('city-bangalore.jpg', 'Vidhana Soudha, Bangalore', null, '50% 55%'),
    cityDelhi:          s('city-delhi.jpg', 'The Lotus Temple, Delhi, at dusk', null, '50% 45%'),
    cityKochi:          s('city-kochi.jpg', 'Chinese fishing nets at sunset, Kochi', null, '50% 50%'),
    cityDubai:          s('city-dubai.jpg', 'Palm Jumeirah, Dubai, from the air', null, '50% 50%'),
    // Insights — one image per research story
    insightCapex:       s('insight-capex.jpg', 'High-voltage transmission towers at dusk', 'photo-1473341304170-971dccb5ac1e'),
    insightDefence:     s('insight-defence.jpg', 'Precision electronics, close up', 'photo-1518770660439-4636190af475'),
    insightRates:       s('insight-metals.jpg', 'Gold bars — ballast for a portfolio', ['https://images.pexels.com/photos/47047/pexels-photo-47047.jpeg?auto=compress&cs=tinysrgb&w=1400', 'photo-1645207825163-4e231ee2d707']),
    // Wealth Advisory
    advisoryHero:       s('advisory-hero.jpg', 'A tailor hand-stitching the lapel of a bespoke jacket', 'photo-1706074740295-d7a79c079562', '62% 45%'),
    advisoryBand:       s('advisory-band.jpg', 'The Bandra–Worli Sea Link leading toward the Mumbai skyline — the road ahead', 'photo-1569758267239-d08deb78bb1a', '50% 55%'),
    // Mutual funds
    // Asset management
    pmsHero:            s('pms-hero.jpg', 'Gold bullion', 'photo-1610375461246-83df859d849d'),
    pmsSignature:       s('pms-signature.jpg', 'An engineer working inside a jet engine — built by hand, with precision', null, '50% 40%'),
    pmsRecord:          s('pms-record.jpg', 'A modern villa with a pool, lit at dusk', 'photo-1613490493576-7fde63acd811', '50% 60%'),
    ucwf:               s('ucwf.jpg', 'Chess pieces in a line, the king alone in sharp focus', ['https://images.pexels.com/photos/6022438/pexels-photo-6022438.jpeg?auto=compress&cs=tinysrgb&w=2200', 'photo-1523170335258-f5ed11844a49'], '50% 50%'),
    ucgf:               s('ucgf.jpg', 'A chessboard mid-game, many pieces working together', ['https://images.pexels.com/photos/6114957/pexels-photo-6114957.jpeg?auto=compress&cs=tinysrgb&w=2200', 'photo-1486406146926-c627a92ad1ab'], '50% 50%'),
    ucpf:               s('ucpf.jpg', 'The king and queen of a chess set — legacy, held by very few', ['https://images.pexels.com/photos/5502523/pexels-photo-5502523.jpeg?auto=compress&cs=tinysrgb&w=1400', 'photo-1567899378494-47b22a2ae96a'], '50% 50%'),
    // Client stories
    storiesHero:        s('stories-hero.jpg', 'A father and child watching a quiet sunset together', ['https://images.pexels.com/photos/31839655/pexels-photo-31839655.jpeg?auto=compress&cs=tinysrgb&w=2200', 'photo-1564540574859-0dfb63985953'], '50% 62%'),
    storiesExit:        s('stories-exit.jpg', 'A father and son walking along the shore at sunset — the next chapter, together', ['https://images.pexels.com/photos/20464674/pexels-photo-20464674.jpeg?auto=compress&cs=tinysrgb&w=2200', 'photo-1450101499163-c8848c66ca85'], '50% 55%'),
    storiesSuccession:  s('stories-succession.jpg', 'A father’s hand holding his child’s — the bond that carries a family forward', ['https://images.pexels.com/photos/4005249/pexels-photo-4005249.jpeg?auto=compress&cs=tinysrgb&w=2200', 'photo-1621176313593-89976c1f1bed'], '50% 50%'),
    storiesNRI:         s('stories-nri.jpg', 'The Dubai skyline, where the client lives', 'photo-1512453979798-5ea266f8880c'),
    storiesPreservation: s('stories-preservation.jpg', 'A calm sea meeting the shore — staying steady through the storm', 'photo-1507525428034-b723cf961d3e'),
    resourcesHero:      s('resources-hero.jpg', 'A calm, light-filled private study', 'photo-1600607687939-ce8a6c25118c'),
    // Leadership — initials show until a portrait is added
    portraitDurgesh:    s('durgesh-pandya-2.jpg', 'Durgesh Pandya', null, '50% 50%'),
    portraitYash:       s('yash-joshi-2.jpg', 'Yash Joshi', null, '50% 50%'),
    portraitManish:     s('manish-shah-3.jpg', 'Manish Shah', null, '50% 50%')
  };
})();
