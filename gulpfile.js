const gulp = require('gulp');
const fetch = require('node-fetch');
const sitemap = require('sitemap');
const fs = require('fs');

const IS_DEV = !process.argv.includes('-prod');
const SITEMAP_PATH = `${IS_DEV ? '.' : '/var/www/polygigs/build/bundled'}/sitemap.xml`;

function getGigs() {
  return fetch('https://polygigs.firebaseio.com/gigs.json')
    .then(res => res.json());
}

function getMostRecentUpdateDateTime(gigs) {
  return Object.keys(gigs)
    .map(path => gigs[path].datePosted)
    .reduce(
      (maxDate, currDate) => maxDate === null || currDate > maxDate ? currDate : maxDate,
      null
    );
}

function generateSitemap(gigs) {
  const urls = Object.keys(gigs)
    .reduce((acc, path) => {
        const gig = gigs[path];
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
  getGigs()
    .then(generateSitemap)
    .then(sitemap => fs.writeFile(SITEMAP_PATH, sitemap, cb));
});
