const fetch = require('node-fetch');

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

module.exports = {
  getActiveGigs,
  getGigs,
}