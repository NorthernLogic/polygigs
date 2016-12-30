const admin = require('firebase-admin');

const serviceAccount = require('../polygigs-firebase-adminsdk-h1d5y-22f98d5057.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://polygigs.firebaseio.com'
});

module.exports = (done) => {
  const db = admin.database();
  const ref = db.ref('/notificationRegistrations')
    .orderByChild('registered')
    .equalTo(false)

  new Promise(resolve => {
    ref.once('value', snapshot => resolve(snapshot.val()));
  })
  .then(unregisteredClients => {
    console.log(unregisteredClients);
    // needed or else gulp will not exit
    db.goOffline();
    done();
  })
}