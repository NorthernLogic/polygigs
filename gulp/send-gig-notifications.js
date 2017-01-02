const request = require('request');
const _ = require('lodash');

const firebase = require('./firebase-init');
const topicName = 'gig-notification';

function sendNotification(key, gig, delay) {
  var options = {
    uri: 'https://fcm.googleapis.com/fcm/send',
    method: 'POST',
    headers: {
      Authorization : `key=${process.env.FIREBASE_SERVER_KEY}`,
    },
    json: {
      to: `/topics/${topicName}`,
      notification: {
        title: 'PolyGig Posted',
        body: `${gig.title} is looking for a software developer.`,
        click_action : `https://polygigs.com/gig/${key}`,
        icon: 'https://polygigs.com/src/polymer-logo.png',
      },
    }
  };

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body)
          resolve()
        } else {
          reject(body)
        }
      });
    }, delay);
  })
}

function sendNotifications(gigs) {
  let count = 0;
  return Promise.all(_.map(gigs, (gig, key) => {
    const delay = count * 5000;
    count += 1;
    return sendNotification(key, gig, delay);
  }));
}

function updateGigNotificationFlag(gigs) {
  const db = firebase.openDatabase();
  const updatedGigs = _.mapValues(gigs, (gig, path) =>
    Object.assign({}, gig, { dateNotificationSent: (new Date()).toISOString() })
  );

  return new Promise(resolve => db.ref('/gigs').update(updatedGigs, () => {
    firebase.closeDatabase();
    resolve();
  }));
}

module.exports = done => {
  const db = firebase.openDatabase();
  const query = db.ref('/gigs')
    .orderByChild('dateNotificationSent')
    .equalTo(false);

  const cleanup = (...args) => {
    // needed or else gulp will not exit
    firebase.closeDatabase();
    done();
  };

  new Promise(resolve => query.once('value', snapshot => resolve(snapshot.val())))
  .then(gigs => {
    if (!gigs) {
      return;
    }

    return sendNotifications(gigs)
       .then(() => updateGigNotificationFlag(gigs));
  })
  .then(cleanup, cleanup);
}