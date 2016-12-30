const admin = require('firebase-admin');
const request = require('request');
const _ = require('lodash');

const serviceAccount = require(process.env.FIREBASE_ADMIN_CERT_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://polygigs.firebaseio.com'
});

const db = admin.database();
const registrationPath = '/notificationRegistrations';
const topicName = gig-notification;

function registerTokens(tokens) {
  var options = {
    uri: 'https://iid.googleapis.com/iid/v1:batchAdd',
    method: 'POST',
    headers: {
      Authorization : `key=${process.env.FIREBASE_SERVER_KEY}`,
    },
    json: {
      to: `/topics/${topicName}`,
      registration_tokens: tokens,
    }
  };

  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(_.zip(tokens, body.results));
      } else {
        reject(body);
      }
    });
  })
}

function updateRegistrationEntries([registrations, results]) {
  const updatedRegistrations = _.fromPairs(results.map(([token, result]) => {
    const updatedRegistration = Object.assign({}, registrations[token], { registered: !result.error })
    return [token, updatedRegistration];
  }))

  return new Promise(resolve => db.ref(registrationPath).update(updatedRegistrations, () => resolve()));
}

module.exports = done => {
  const query = db.ref(registrationPath)
    .orderByChild('registered')
    .equalTo(false);

  const cleanup = (...args) => {
    // needed or else gulp will not exit
    db.goOffline();
    done();
  };

  new Promise(resolve => query.once('value', snapshot => resolve(snapshot.val())))
  .then(registrations => {
    if (!registrations) {
      return;
    }

    return Promise.all([registrations, registerTokens(Object.keys(registrations))])
       .then(updateRegistrationEntries);
  })
  .then(cleanup, cleanup);
}