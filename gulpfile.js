const gulp = require('gulp');
const fetch = require('node-fetch');
const sitemap = require('sitemap');
const fs = require('fs');

function getGigs() {
  return fetch('https://polygigs.firebaseio.com/gigs.json')
    .then(res => res.json())
    // convert to array of [path, value]
    .then(json => Object.entries(json));
}

function getActiveGigs() {
  return getGigs()
    .then(gigs => gigs.filter(([path, gig]) => gig.isActive));
}

function getMostRecentUpdateDateTime(gigs) {
  return gigs
    .map(([path, gig]) => gig.datePosted)
    .reduce(
      (maxDate, currDate) => maxDate === null || currDate > maxDate ? currDate : maxDate,
      null
    );
}

function generateSitemap(gigs) {
  const urls = gigs
    .reduce((acc, [path, gig]) => {
        const url = { url: `gig/${path}/`, changefreq: 'weekly', lastmodISO: gig.datePosted }
        return acc.concat(url);
      },
      [ // listing of static paths
        { url: '/', lastmodISO: getMostRecentUpdateDateTime(gigs) },
        { url: '/post-gig/' },
      ]
    );

  return sitemap.createSitemap({
    hostname: 'https://polygigs.com',
    cacheTime: 600000,  // 600 sec cache period
    urls,
  }).toString();
}

gulp.task('sitemap', cb => {
  getActiveGigs()
    .then(generateSitemap)
    .then(sitemap => fs.writeFile('./sitemap.xml', sitemap, cb));
});
