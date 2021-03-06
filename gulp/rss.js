const fs = require('fs');
const RSS = require('rss');

const gigs = require('./gigs');


const feedOptions = {
  title: 'New Polygigs',
  description: 'A feed containing the latest jobs posted to Polygigs',
  feed_url: 'https://polygigs.com/gigs.rss',
  site_url: 'https://polygigs.com/',
  image_url: 'https://polygigs.com/src/feed-icon.png',
};

function generateRSSFeed(gigs) {
  const feed = new RSS(feedOptions);

  const entries = gigs
    .reduce((acc, [path, gig]) =>
      acc.concat({
        url: `https://polygigs.com/gig/${path}/`,
        title: gig.title,
        description: `${gig.posterCompany} is looking for a ${gig.title}`,
        date: gig.datePosted,
      })
    , []);

  entries.forEach(entry => feed.item(entry));

  return feed.xml();
}

module.exports = cb => {
  gigs.getActiveGigs()
    .then(generateRSSFeed)
    .then(feed => fs.writeFile('./gigs.rss', feed, cb));
}
